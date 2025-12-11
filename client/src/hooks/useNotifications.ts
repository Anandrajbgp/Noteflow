import { useEffect, useRef, useCallback, useState } from 'react';
import { 
  requestNotificationPermission, 
  getNotificationPermission,
  sendNotification, 
  parseTaskDateTime,
  shouldNotifyForTask 
} from '@/lib/notifications';
import type { OfflineTask } from '@/lib/offlineStorage';

const NOTIFICATION_CHECK_INTERVAL = 30000;
const NOTIFIED_TASKS_KEY = 'notified_tasks';
const MISSED_WINDOW_MS = 24 * 60 * 60 * 1000;

function getNotifiedTasks(): Set<string> {
  try {
    const stored = localStorage.getItem(NOTIFIED_TASKS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const now = Date.now();
      const filtered = parsed.filter((item: { id: string; expiry: number }) => item.expiry > now);
      return new Set(filtered.map((item: { id: string }) => item.id));
    }
  } catch {
    console.error('Error reading notified tasks');
  }
  return new Set();
}

function markTaskNotified(taskId: string): void {
  try {
    const stored = localStorage.getItem(NOTIFIED_TASKS_KEY);
    let tasks: { id: string; expiry: number }[] = [];
    
    if (stored) {
      tasks = JSON.parse(stored);
      const now = Date.now();
      tasks = tasks.filter(item => item.expiry > now);
    }
    
    tasks.push({
      id: taskId,
      expiry: Date.now() + 24 * 60 * 60 * 1000
    });
    
    localStorage.setItem(NOTIFIED_TASKS_KEY, JSON.stringify(tasks));
  } catch {
    console.error('Error marking task as notified');
  }
}

export function useNotifications(tasks: OfflineTask[]) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');
  
  const requestPermission = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setPermissionStatus(getNotificationPermission());
    return granted;
  }, []);

  const checkAndSendNotifications = useCallback(() => {
    if (getNotificationPermission() !== 'granted') {
      return;
    }

    const notifiedTasks = getNotifiedTasks();
    const now = new Date();

    for (const task of tasks) {
      if (task.completed || task.isDeleted) continue;
      if (!task.reminderEnabled) continue;
      if (!task.date || !task.time) continue;
      if (notifiedTasks.has(task.id)) continue;

      const taskDate = parseTaskDateTime(task.date, task.time);
      if (!taskDate) continue;

      const reminderOffset = task.reminderOffset || '15';
      const offsetMinutes = parseInt(reminderOffset, 10) || 0;
      const notifyTime = new Date(taskDate.getTime() - offsetMinutes * 60 * 1000);
      const diffMs = notifyTime.getTime() - now.getTime();
      
      if (shouldNotifyForTask(taskDate, reminderOffset, now)) {
        let timeDescription = 'now';
        if (offsetMinutes > 0) {
          if (offsetMinutes >= 60) {
            timeDescription = `in ${offsetMinutes / 60} hour`;
          } else {
            timeDescription = `in ${offsetMinutes} minutes`;
          }
        }

        sendNotification(`Task Reminder: ${task.title}`, {
          body: task.description || `Your task is scheduled ${timeDescription}`,
          tag: `task-${task.id}`,
        });

        markTaskNotified(task.id);
      } else if (diffMs <= 0 && diffMs > -MISSED_WINDOW_MS) {
        const missedMinutesAgo = Math.abs(Math.round(diffMs / 60000));
        let missedTimeAgo = '';
        if (missedMinutesAgo < 60) {
          missedTimeAgo = `${missedMinutesAgo} minutes ago`;
        } else {
          const hours = Math.round(missedMinutesAgo / 60);
          missedTimeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }

        sendNotification(`Missed Reminder: ${task.title}`, {
          body: `This reminder was scheduled ${missedTimeAgo}`,
          tag: `task-missed-${task.id}`,
        });

        markTaskNotified(task.id);
      }
    }
  }, [tasks]);

  useEffect(() => {
    setPermissionStatus(getNotificationPermission());
  }, []);

  useEffect(() => {
    checkAndSendNotifications();

    intervalRef.current = setInterval(checkAndSendNotifications, NOTIFICATION_CHECK_INTERVAL);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndSendNotifications();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkAndSendNotifications]);

  return {
    permissionStatus,
    requestPermission,
    checkAndSendNotifications,
  };
}
