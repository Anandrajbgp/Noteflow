import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  type OfflineNote,
  getOfflineNotes,
  saveOfflineNote,
  deleteOfflineNote,
  getPendingSyncNotes,
  markNoteSynced,
  createPinHash,
} from '@/lib/offlineStorage';

export function useNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<OfflineNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const userId = user?.id || 'local';

  // Load notes from offline storage
  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const offlineNotes = await getOfflineNotes(userId);
      setNotes(offlineNotes);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Sync with Supabase - NOTE: We do NOT sync lockPinHash to cloud for security
  const syncWithCloud = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) return;
    
    const supabase = getSupabase();
    if (!supabase) return;
    
    setSyncing(true);
    try {
      // Get pending sync notes
      const pendingNotes = await getPendingSyncNotes(userId);
      
      // Upload pending notes (without lockPinHash for security)
      for (const note of pendingNotes) {
        const { error } = await supabase
          .from('notes')
          .upsert({
            id: note.id,
            user_id: userId,
            title: note.title,
            content: note.content,
            color: note.color,
            is_pinned: note.isPinned,
            is_archived: note.isArchived,
            is_locked: note.isLocked,
            // Do NOT sync lockPinHash to cloud - keep it local only
            labels: note.labels,
            created_at: note.createdAt,
            updated_at: note.updatedAt,
            is_deleted: note.isDeleted,
          });
        
        if (!error) {
          await markNoteSynced(userId, note.id);
        }
      }

      // Fetch notes from cloud
      const { data: cloudNotes } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (cloudNotes) {
        const offlineNotes = await getOfflineNotes(userId);
        
        for (const cloudNote of cloudNotes) {
          const localNote = offlineNotes.find(n => n.id === cloudNote.id);
          const cloudUpdatedAt = new Date(cloudNote.updated_at).getTime();
          const localUpdatedAt = localNote ? new Date(localNote.updatedAt).getTime() : 0;
          
          // Cloud is newer or doesn't exist locally
          if (!localNote || cloudUpdatedAt > localUpdatedAt) {
            await saveOfflineNote({
              id: cloudNote.id,
              userId: cloudNote.user_id,
              title: cloudNote.title,
              content: cloudNote.content,
              color: cloudNote.color,
              isPinned: cloudNote.is_pinned,
              isArchived: cloudNote.is_archived,
              isLocked: cloudNote.is_locked,
              // Keep local lockPinHash if exists, cloud notes are not locked
              lockPinHash: localNote?.lockPinHash,
              labels: cloudNote.labels || [],
              createdAt: cloudNote.created_at,
              updatedAt: cloudNote.updated_at,
              syncedAt: new Date().toISOString(),
              pendingSync: false,
              isDeleted: cloudNote.is_deleted,
            });
          }
        }
        
        await loadNotes();
      }
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setSyncing(false);
    }
  }, [user, userId, loadNotes]);

  // Initial load
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Sync when user logs in or when online
  useEffect(() => {
    if (user && isSupabaseConfigured()) {
      syncWithCloud();
    }
  }, [user, syncWithCloud]);

  // Listen for online events
  useEffect(() => {
    const handleOnline = () => {
      if (user && isSupabaseConfigured()) {
        syncWithCloud();
      }
    };
    
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [user, syncWithCloud]);

  const createNote = async (noteData: Partial<OfflineNote>) => {
    const now = new Date().toISOString();
    const newNote: OfflineNote = {
      id: crypto.randomUUID(),
      userId,
      title: noteData.title || '',
      content: noteData.content || '',
      color: noteData.color,
      isPinned: noteData.isPinned || false,
      isArchived: noteData.isArchived || false,
      isLocked: noteData.isLocked || false,
      lockPinHash: noteData.lockPinHash,
      labels: noteData.labels || [],
      createdAt: now,
      updatedAt: now,
      pendingSync: !!user && isSupabaseConfigured(),
    };
    
    await saveOfflineNote(newNote);
    await loadNotes();
    
    if (user && navigator.onLine && isSupabaseConfigured()) {
      syncWithCloud();
    }
    
    return newNote;
  };

  const updateNote = async (noteId: string, updates: Partial<OfflineNote>) => {
    const existingNotes = await getOfflineNotes(userId);
    const existing = existingNotes.find(n => n.id === noteId);
    
    if (existing) {
      const updatedNote: OfflineNote = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
        pendingSync: !!user && isSupabaseConfigured(),
      };
      
      await saveOfflineNote(updatedNote);
      await loadNotes();
      
      if (user && navigator.onLine && isSupabaseConfigured()) {
        syncWithCloud();
      }
      
      return updatedNote;
    }
  };

  const removeNote = async (noteId: string) => {
    await deleteOfflineNote(userId, noteId);
    
    if (user && isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        await supabase.from('notes').delete().eq('id', noteId);
      }
    }
    
    await loadNotes();
  };

  const togglePin = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      await updateNote(noteId, { isPinned: !note.isPinned });
    }
  };

  const toggleArchive = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      await updateNote(noteId, { isArchived: !note.isArchived });
    }
  };

  const lockNote = async (noteId: string, pin: string) => {
    // Hash the PIN before storing
    const pinHash = await createPinHash(pin);
    await updateNote(noteId, { isLocked: true, lockPinHash: pinHash });
  };

  const unlockNote = async (noteId: string) => {
    await updateNote(noteId, { isLocked: false, lockPinHash: undefined });
  };

  // Filter notes
  const activeNotes = notes.filter(n => !n.isArchived);
  const archivedNotes = notes.filter(n => n.isArchived);
  const pinnedNotes = activeNotes.filter(n => n.isPinned);
  const unpinnedNotes = activeNotes.filter(n => !n.isPinned);

  return {
    notes,
    activeNotes,
    archivedNotes,
    pinnedNotes,
    unpinnedNotes,
    loading,
    syncing,
    createNote,
    updateNote,
    removeNote,
    togglePin,
    toggleArchive,
    lockNote,
    unlockNote,
    syncWithCloud,
    refresh: loadNotes,
  };
}
