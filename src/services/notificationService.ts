import { LocalNotifications } from '@capacitor/local-notifications';
import { Habit } from '../types';

class NotificationService {
  private isCapacitor = false;

  constructor() {
    this.checkPlatform();
  }

  private checkPlatform() {
    // Check if running under Capacitor native environment
    if (typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform()) {
      this.isCapacitor = true;
    }
  }

  // Request permissions
  async requestPermission(): Promise<boolean> {
    try {
      if (this.isCapacitor) {
        const status = await LocalNotifications.requestPermissions();
        return status.display === 'granted';
      } else if (typeof window !== 'undefined' && 'Notification' in window) {
        const result = await Notification.requestPermission();
        return result === 'granted';
      }
    } catch (e) {
      console.warn('Error requesting notification permission:', e);
    }
    return false;
  }

  // Schedule a habit reminder alarm/notification
  async scheduleHabitReminder(habit: Habit): Promise<void> {
    if (!habit.reminderEnabled || !habit.targetTime) return;

    const [hours, minutes] = habit.targetTime.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;

    try {
      if (this.isCapacitor) {
        // Cancel existing notification for this habit first
        await this.cancelHabitReminder(habit.id);

        const notifId = this.stringToId(habit.id);
        await LocalNotifications.schedule({
          notifications: [
            {
              id: notifId,
              title: `⏰ Waktunya Habit: ${habit.title}`,
              body: `Saatnya meluangkan waktu untuk rutinitas ${habit.category.toLowerCase()} kamu! Tetap konsisten hari ini.`,
              schedule: {
                on: {
                  hour: hours,
                  minute: minutes,
                },
                allowWhileIdle: true,
              },
              sound: 'beep.wav',
              actionTypeId: '',
              extra: { habitId: habit.id },
            },
          ],
        });
        console.log(`[Capacitor] Scheduled reminder for ${habit.title} at ${habit.targetTime}`);
      } else {
        console.log(`[Web] Reminder saved for ${habit.title} at ${habit.targetTime}`);
      }
    } catch (e) {
      console.error('Failed to schedule notification:', e);
    }
  }

  // Cancel habit reminder
  async cancelHabitReminder(habitId: string): Promise<void> {
    try {
      if (this.isCapacitor) {
        const notifId = this.stringToId(habitId);
        await LocalNotifications.cancel({
          notifications: [{ id: notifId }],
        });
      }
    } catch (e) {
      console.error('Failed to cancel notification:', e);
    }
  }

  // Test notification directly
  async sendTestNotification(title = 'Uji Coba Alarm & Notifikasi', body = 'Pengingat Habit & Financial berfungsi optimal!'): Promise<void> {
    const granted = await this.requestPermission();
    if (!granted && typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted') {
      alert('Izin notifikasi belum diaktifkan di browser/perangkat Anda.');
      return;
    }

    try {
      if (this.isCapacitor) {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: Math.floor(Math.random() * 100000),
              title,
              body,
              schedule: { at: new Date(Date.now() + 1000) },
              sound: 'beep.wav',
            },
          ],
        });
      } else if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } else {
        alert(`${title}\n${body}`);
      }
    } catch (e) {
      console.error('Test notification failed:', e);
      alert(`${title}\n${body}`);
    }
  }

  // Convert habit ID string to 32-bit positive integer for Capacitor
  private stringToId(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % 2147483647;
  }
}

export const notificationService = new NotificationService();
