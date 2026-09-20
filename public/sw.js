// SMRITICARE - Service Worker for Automatic Map Tile Caching
// Handles silent background caching of OpenStreetMap tiles with Cache-First strategy.

const TILE_CACHE_NAME = 'smriticare-osm-tiles-v1';

// Hostnames for OpenStreetMap standard tile servers
const OSM_TILE_DOMAINS = [
  'tile.openstreetmap.org',
  'a.tile.openstreetmap.org',
  'b.tile.openstreetmap.org',
  'c.tile.openstreetmap.org'
];

// Install Event: Activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate Event: Clean up old versions and claim active clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('smriticare-') && name !== TILE_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache-First strategy specifically for OpenStreetMap tiles
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Match OSM tile requests (e.g., https://a.tile.openstreetmap.org/15/26543/14231.png)
  const isOsmTile = OSM_TILE_DOMAINS.some((domain) => requestUrl.hostname === domain) ||
                    requestUrl.hostname.endsWith('tile.openstreetmap.org');

  if (!isOsmTile) {
    // Non-tile requests follow standard browser network lifecycle
    return;
  }

  event.respondWith(
    caches.open(TILE_CACHE_NAME).then(async (cache) => {
      // 1. Check local Cache API first
      const cachedTile = await cache.match(event.request);
      if (cachedTile) {
        return cachedTile;
      }

      // 2. Fetch from network and store silently for offline use
      try {
        const networkResponse = await fetch(event.request);

        // HTTP 200 or opaque response (CORS fallback)
        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
          cache.put(event.request, networkResponse.clone());
        }

        return networkResponse;
      } catch (err) {
        // Return 503 response if both cache and network fail
        return new Response('Map tile unavailable offline', {
          status: 503,
          statusText: 'Offline Tile Unavailable',
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    })
  );
});
