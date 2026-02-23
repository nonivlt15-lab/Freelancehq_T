// FreelanceHQ Service Worker
// Caches the app so it works offline

const CACHE_NAME = 'freelancehq-v1';
const ASSETS = [
  './freelancehq.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,600;12..96,800&family=JetBrains+Mono:wght@400;500&display=swap'
];

// Install: cache everything
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching app shell');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        // If completely offline and no cache, show offline page
        return new Response('<h2 style="font-family:sans-serif;padding:2rem">FreelanceHQ — Mode hors ligne. Reconnectez-vous pour synchroniser.</h2>', {
          headers: { 'Content-Type': 'text/html' }
        });
      });
    })
  );
});
