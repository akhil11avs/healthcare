// ==========================================
// HEALTHOS — Service Worker Registration & Notifications
// ==========================================

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers not supported in this browser.');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    return registration;
  } catch (err) {
    console.error('[SW] Registration failed:', err);
    return null;
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported.');
    return 'denied';
  }

  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';

  return await Notification.requestPermission();
}

export async function showLocalNotification(
  title: string,
  body: string,
  options: NotificationOptions = {}
): Promise<void> {
  const permission = await requestNotificationPermission();
  if (permission !== 'granted') return;

  const defaultOptions: NotificationOptions = {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'healthos-notification',
    requireInteraction: false,
    ...options,
  };

  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.getRegistration('/');
    if (reg) {
      await reg.showNotification(title, defaultOptions);
      return;
    }
  }

  // Fallback to native Notification API
  new Notification(title, defaultOptions);
}

export function scheduleLoginNotification(displayName: string, appointmentCount: number): void {
  setTimeout(() => {
    showLocalNotification(
      `Good day, ${displayName}! 👋`,
      `You have ${appointmentCount} appointments scheduled for today. Have a great shift!`,
      { tag: 'login-welcome' }
    );
  }, 2000);
}

export function showPatientUpdateNotification(patientName: string): void {
  showLocalNotification(
    '🔔 Patient Update',
    `${patientName}'s vitals have been updated by nursing staff.`,
    { tag: 'patient-update' }
  );
}

export function showAppointmentReminderNotification(patientName: string, time: string): void {
  showLocalNotification(
    '📅 Appointment Reminder',
    `${patientName} is scheduled for ${time}. Please review their chart.`,
    { tag: 'appointment-reminder' }
  );
}
