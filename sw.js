const SHELL_CACHE = 'quran-shell-v5';
const DATA_CACHE = 'quran-data-v5';
const SHELL_URLS = [
  'index.html',
  'quran.html',
  'sistem-vault/index.html',
  'sistem-menu/index.html',
  'sistem-kewangan/index.html',
  'style.css',
  'app.js',
  'data.js',
  'manifest.json',
  'assets/icons/icon-192x192.png',
  'assets/icons/icon-512x512.png',
  'assets/fonts/Amiri-Regular.ttf',
  'assets/fonts/Amiri-Bold.ttf',
  'assets/fonts/ScheherazadeNew-Regular.woff2',
  'assets/fonts/ScheherazadeNew-Bold.ttf',
  'assets/fonts/UthmanTN1.woff2',
  'assets/fonts/UthmanTN1B.woff2',
  'assets/anime.min.js',
  'assets/dexie.min.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return cache.addAll(SHELL_URLS).catch(function(err) {
        console.warn('[SW] cache.addAll partial failure:', err.message);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== DATA_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isDataTafsir = url.pathname.includes('/data-tafsir/');
  const isShell = SHELL_URLS.includes(url.pathname.replace(/^\//, ''));

  if (isShell) {
    event.respondWith(cacheFirst(event.request, SHELL_CACHE));
  } else if (isDataTafsir) {
    event.respondWith(networkFirst(event.request, DATA_CACHE));
  } else if (
    event.request.destination === 'style' ||
    event.request.destination === 'script' ||
    event.request.destination === 'font' ||
    event.request.destination === 'image'
  ) {
    event.respondWith(cacheFirst(event.request, SHELL_CACHE));
  } else {
    event.respondWith(networkFirst(event.request, DATA_CACHE));
  }
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 408 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.destination === 'document') {
      return caches.match('index.html');
    }
    return new Response('', { status: 408 });
  }
}
