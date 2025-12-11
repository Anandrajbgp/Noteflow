import localforage from 'localforage';

// Configure localforage
localforage.config({
  name: 'noteflow',
  storeName: 'noteflow_data',
});

// Simple hash function for PIN (not cryptographically secure but better than plaintext)
async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + 'noteflow_salt_v1');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPin(pin: string, hashedPin: string): Promise<boolean> {
  const hashed = await hashPin(pin);
  return hashed === hashedPin;
}

export async function createPinHash(pin: string): Promise<string> {
  return hashPin(pin);
}

export interface OfflineNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  color?: string;
  isPinned: boolean;
  isArchived: boolean;
  isLocked: boolean;
  lockPinHash?: string; // Store hash, not plaintext
  labels: string[];
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
  pendingSync: boolean;
  isDeleted?: boolean; // Soft delete for sync
}

export interface OfflineTask {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date?: string;
  time?: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  starred: boolean;
  reminderEnabled: boolean;
  reminderOffset?: string;
  listId?: number;
  listOrder?: number;
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
  pendingSync: boolean;
  isDeleted?: boolean; // Soft delete for sync
}

// Notes operations
export async function getOfflineNotes(userId: string): Promise<OfflineNote[]> {
  const notes = await localforage.getItem<OfflineNote[]>(`notes_${userId}`) || [];
  // Filter out deleted notes and sort
  return notes
    .filter(n => !n.isDeleted)
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
}

export async function getAllOfflineNotes(userId: string): Promise<OfflineNote[]> {
  return await localforage.getItem<OfflineNote[]>(`notes_${userId}`) || [];
}

export async function saveOfflineNote(note: OfflineNote): Promise<void> {
  const notes = await getAllOfflineNotes(note.userId);
  const existingIndex = notes.findIndex(n => n.id === note.id);
  
  if (existingIndex >= 0) {
    notes[existingIndex] = note;
  } else {
    notes.push(note);
  }
  
  await localforage.setItem(`notes_${note.userId}`, notes);
}

export async function deleteOfflineNote(userId: string, noteId: string): Promise<void> {
  const notes = await getAllOfflineNotes(userId);
  const note = notes.find(n => n.id === noteId);
  if (note) {
    // Soft delete for sync
    note.isDeleted = true;
    note.updatedAt = new Date().toISOString();
    note.pendingSync = true;
    await localforage.setItem(`notes_${userId}`, notes);
  }
}

export async function hardDeleteOfflineNote(userId: string, noteId: string): Promise<void> {
  const notes = await getAllOfflineNotes(userId);
  const filtered = notes.filter(n => n.id !== noteId);
  await localforage.setItem(`notes_${userId}`, filtered);
}

// Tasks operations
export async function getOfflineTasks(userId: string): Promise<OfflineTask[]> {
  const tasks = await localforage.getItem<OfflineTask[]>(`tasks_${userId}`) || [];
  return tasks
    .filter(t => !t.isDeleted)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAllOfflineTasks(userId: string): Promise<OfflineTask[]> {
  return await localforage.getItem<OfflineTask[]>(`tasks_${userId}`) || [];
}

export async function saveOfflineTask(task: OfflineTask): Promise<void> {
  const tasks = await getAllOfflineTasks(task.userId);
  const existingIndex = tasks.findIndex(t => t.id === task.id);
  
  if (existingIndex >= 0) {
    tasks[existingIndex] = task;
  } else {
    tasks.push(task);
  }
  
  await localforage.setItem(`tasks_${task.userId}`, tasks);
}

export async function deleteOfflineTask(userId: string, taskId: string): Promise<void> {
  const tasks = await getAllOfflineTasks(userId);
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    // Soft delete for sync
    task.isDeleted = true;
    task.updatedAt = new Date().toISOString();
    task.pendingSync = true;
    await localforage.setItem(`tasks_${userId}`, tasks);
  }
}

export async function hardDeleteOfflineTask(userId: string, taskId: string): Promise<void> {
  const tasks = await getAllOfflineTasks(userId);
  const filtered = tasks.filter(t => t.id !== taskId);
  await localforage.setItem(`tasks_${userId}`, filtered);
}

// Sync utilities
export async function getPendingSyncNotes(userId: string): Promise<OfflineNote[]> {
  const notes = await getAllOfflineNotes(userId);
  return notes.filter(n => n.pendingSync);
}

export async function getPendingSyncTasks(userId: string): Promise<OfflineTask[]> {
  const tasks = await getAllOfflineTasks(userId);
  return tasks.filter(t => t.pendingSync);
}

export async function markNoteSynced(userId: string, noteId: string): Promise<void> {
  const notes = await getAllOfflineNotes(userId);
  const note = notes.find(n => n.id === noteId);
  if (note) {
    note.pendingSync = false;
    note.syncedAt = new Date().toISOString();
    await localforage.setItem(`notes_${userId}`, notes);
  }
}

export async function markTaskSynced(userId: string, taskId: string): Promise<void> {
  const tasks = await getAllOfflineTasks(userId);
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.pendingSync = false;
    task.syncedAt = new Date().toISOString();
    await localforage.setItem(`tasks_${userId}`, tasks);
  }
}

// Theme storage
export async function getStoredTheme(): Promise<'light' | 'dark' | 'system'> {
  return await localforage.getItem<'light' | 'dark' | 'system'>('theme') || 'system';
}

export async function setStoredTheme(theme: 'light' | 'dark' | 'system'): Promise<void> {
  await localforage.setItem('theme', theme);
}

// Clear all data
export async function clearAllData(): Promise<void> {
  await localforage.clear();
}
