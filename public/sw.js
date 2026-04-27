// Service Worker for HealthOS
// Handles push notifications and background sync

const CACHE_NAME = 'healthos-v1';
const urlsToCache = [
  '/',
  '/index.html',
];

// Install event — cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate event — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Push event — show notification from server push
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'HealthOS Notification';
  const options = {
    body: data.body || 'You have a new notification.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: data,
    tag: data.tag || 'healthos',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event — focus or open app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Fetch event — network-first strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request)
    )
  );
});
