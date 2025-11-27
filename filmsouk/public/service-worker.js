const CACHE_NAME = "goldenscreen-cache-v3";

// Add all routes and assets you want available offline
const urlsToCache = [
  "/",                // root
  "/movies",          // movies page
  "/favorites",       // favorites page
  "/new-movies",      // new movies page
  "/favicon.ico",
  "/icons/android/icon-192x192.png",
  "/icons/android/icon-512x512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Serve from cache if available, otherwise fetch from network
      return response || fetch(event.request).catch(() => caches.match("/offline.html"));
    })
  );
});

self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
