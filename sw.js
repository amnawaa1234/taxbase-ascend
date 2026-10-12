const CACHE_NAME = 'fintrack-shell-v3';
const SHELL_FILES = ['index.html', 'dashboard.html', 'manifest.json', 'icon.svg', 'login-bg.png', 'bg-slide-1.jpg', 'bg-slide-2.jpg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first: live client data must always come from Supabase, not the cache.
// The cached shell is only a fallback so the app can still open the login page offline.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
