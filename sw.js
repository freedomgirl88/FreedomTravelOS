// Freedom Travel OS Personal v2.5.1 Official — Korea Plans Sync
const CACHE_NAME = 'ftos-personal-v2.5.1-official-plans';
const APP_ROOT = '/FreedomTravelOS/';
const APP_SHELL = [APP_ROOT, `${APP_ROOT}manifest.webmanifest`, `${APP_ROOT}icons/icon-192.png`];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(APP_SHELL.map(url => cache.add(url).catch(() => undefined))))
  );
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names
        .filter(name => name.startsWith('ftos-personal-') && name !== CACHE_NAME)
        .map(name => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response?.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone()).catch(() => undefined);
    }
    return response;
  } catch {
    return (await caches.match(request)) || (await caches.match(APP_ROOT));
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const network = fetch(request).then(async response => {
    if (response?.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone()).catch(() => undefined);
    }
    return response;
  }).catch(() => null);
  return cached || (await network) || new Response('Offline - Content not available', { status: 503 });
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  const acceptsHtml = request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html');
  event.respondWith(acceptsHtml ? networkFirst(request) : staleWhileRevalidate(request));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const client of list) if ('focus' in client) return client.focus();
    const page = event.notification?.data?.page || 'notifications';
    if (clients.openWindow) return clients.openWindow(`${APP_ROOT}?page=${encodeURIComponent(page)}`);
  }));
});
