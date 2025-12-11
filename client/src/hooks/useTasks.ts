import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  type OfflineTask,
  getOfflineTasks,
  saveOfflineTask,
  deleteOfflineTask,
  getPendingSyncTasks,
  markTaskSynced,
} from '@/lib/offlineStorage';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<OfflineTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const userId = user?.id || 'local';

  // Load tasks from offline storage
  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const offlineTasks = await getOfflineTasks(userId);
      setTasks(offlineTasks);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Sync with Supabase
  const syncWithCloud = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) return;
    
    const supabase = getSupabase();
    if (!supabase) return;
    
    setSyncing(true);
    try {
      // Get pending sync tasks
      const pendingTasks = await getPendingSyncTasks(userId);
      
      // Upload pending tasks
      for (const task of pendingTasks) {
        const { error } = await supabase
          .from('tasks')
          .upsert({
            id: task.id,
            user_id: userId,
            title: task.title,
            description: task.description,
            date: task.date,
            time: task.time,
            frequency: task.frequency,
            completed: task.completed,
            reminder_enabled: task.reminderEnabled,
            reminder_offset: task.reminderOffset,
            created_at: task.createdAt,
            updated_at: task.updatedAt,
          });
        
        if (!error) {
          await markTaskSynced(userId, task.id);
        }
      }

      // Fetch tasks from cloud
      const { data: cloudTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (cloudTasks) {
        const offlineTasks = await getOfflineTasks(userId);
        
        for (const cloudTask of cloudTasks) {
          const localTask = offlineTasks.find(t => t.id === cloudTask.id);
          const cloudUpdatedAt = new Date(cloudTask.updated_at).getTime();
          const localUpdatedAt = localTask ? new Date(localTask.updatedAt).getTime() : 0;
          
          // Cloud is newer or doesn't exist locally
          if (!localTask || cloudUpdatedAt > localUpdatedAt) {
            await saveOfflineTask({
              id: cloudTask.id,
              userId: cloudTask.user_id,
              title: cloudTask.title,
              description: cloudTask.description,
              date: cloudTask.date,
              time: cloudTask.time,
              frequency: cloudTask.frequency,
              completed: cloudTask.completed,
              starred: cloudTask.starred || false,
              reminderEnabled: cloudTask.reminder_enabled,
              reminderOffset: cloudTask.reminder_offset,
              createdAt: cloudTask.created_at,
              updatedAt: cloudTask.updated_at,
              syncedAt: new Date().toISOString(),
              pendingSync: false,
            });
          }
        }
        
        await loadTasks();
      }
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setSyncing(false);
    }
  }, [user, userId, loadTasks]);

  // Initial load
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Sync when user logs in
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

  const createTask = async (taskData: Partial<OfflineTask>) => {
    const now = new Date().toISOString();
    const newTask: OfflineTask = {
      id: crypto.randomUUID(),
      userId,
      title: taskData.title || '',
      description: taskData.description,
      date: taskData.date,
      time: taskData.time,
      frequency: taskData.frequency || 'once',
      completed: false,
      starred: false,
      reminderEnabled: taskData.reminderEnabled || false,
      reminderOffset: taskData.reminderOffset,
      createdAt: now,
      updatedAt: now,
      pendingSync: !!user && isSupabaseConfigured(),
    };
    
    await saveOfflineTask(newTask);
    await loadTasks();
    
    if (user && navigator.onLine && isSupabaseConfigured()) {
      syncWithCloud();
    }
    
    return newTask;
  };

  const updateTask = async (taskId: string, updates: Partial<OfflineTask>) => {
    const existingTasks = await getOfflineTasks(userId);
    const existing = existingTasks.find(t => t.id === taskId);
    
    if (existing) {
      const updatedTask: OfflineTask = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
        pendingSync: !!user && isSupabaseConfigured(),
      };
      
      await saveOfflineTask(updatedTask);
      await loadTasks();
      
      if (user && navigator.onLine && isSupabaseConfigured()) {
        syncWithCloud();
      }
      
      return updatedTask;
    }
  };

  const removeTask = async (taskId: string) => {
    await deleteOfflineTask(userId, taskId);
    
    if (user && isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        await supabase.from('tasks').delete().eq('id', taskId);
      }
    }
    
    await loadTasks();
  };

  const toggleComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { completed: !task.completed });
    }
  };

  const toggleStar = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { starred: !task.starred });
    }
  };

  // Filter tasks
  const today = new Date().toISOString().split('T')[0];
  
  const todayTasks = tasks.filter(t => t.date === today);
  const upcomingTasks = tasks.filter(t => t.date && t.date > today && !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const incompleteTasks = tasks.filter(t => !t.completed);

  // Sort functions
  const sortByDate = (tasksToSort: OfflineTask[]) => 
    [...tasksToSort].sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });

  const sortByName = (tasksToSort: OfflineTask[]) =>
    [...tasksToSort].sort((a, b) => a.title.localeCompare(b.title));

  return {
    tasks,
    todayTasks,
    upcomingTasks,
    completedTasks,
    incompleteTasks,
    loading,
    syncing,
    createTask,
    updateTask,
    removeTask,
    toggleComplete,
    toggleStar,
    syncWithCloud,
    refresh: loadTasks,
    sortByDate,
    sortByName,
  };
}
