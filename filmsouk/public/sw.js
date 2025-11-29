// public/sw.js
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';

cleanupOutdatedCaches();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST || []);

// Your exact same caching rules — now working 100%
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({ cacheName: 'static-assets' })
);

registerRoute(
  ({ request, url }) => request.destination === 'image' || url.origin === 'https://image.tmdb.org',
  new CacheFirst({ cacheName: 'images' })
);

registerRoute(
  /^https:\/\/api\.tmdb\.org\/.*/i,
  new NetworkFirst({ cacheName: 'tmdb-api', networkTimeoutSeconds: 3 })
);