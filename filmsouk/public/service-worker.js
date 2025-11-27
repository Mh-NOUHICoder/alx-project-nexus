const CACHE_NAME = "goldenscreen-cache-v2";
const urlsToCache = [
  "/",                // root
  "/favicon.ico",     // site icon
  "/movies",          // movies route
  "/favorites",       // favorites route
  "/new-movies",      // new movies route
  "/icons/android/icon-192x192.png",
  "/icons/android/icon-512x512.png"
];

// Install event: cache important routes & assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: serve cached files if offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Serve from cache if available, otherwise fetch from network
      return response || fetch(event.request);
    })
  );
});

// Activate event: clean old caches
self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
