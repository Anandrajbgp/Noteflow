export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export function sendNotification(title: string, options?: NotificationOptions): Notification | null {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.log('Notification permission not granted');
    return null;
  }

  try {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      requireInteraction: true,
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    return null;
  }
}

export function parseTaskDateTime(date?: string, time?: string): Date | null {
  if (!date) return null;
  
  const dateStr = date;
  const timeStr = time || '00:00';
  
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    const taskDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
    return taskDate;
  } catch {
    return null;
  }
}

export function shouldNotifyForTask(
  taskDate: Date,
  reminderOffset: string,
  now: Date = new Date()
): boolean {
  const offsetMinutes = parseInt(reminderOffset, 10) || 0;
  const notifyTime = new Date(taskDate.getTime() - offsetMinutes * 60 * 1000);
  
  const diffMs = notifyTime.getTime() - now.getTime();
  
  return diffMs <= 0 && diffMs > -300000;
}

export function getTimeUntilNotification(
  taskDate: Date,
  reminderOffset: string,
  now: Date = new Date()
): number {
  const offsetMinutes = parseInt(reminderOffset, 10) || 0;
  const notifyTime = new Date(taskDate.getTime() - offsetMinutes * 60 * 1000);
  
  return notifyTime.getTime() - now.getTime();
}
