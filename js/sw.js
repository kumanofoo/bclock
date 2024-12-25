// Cache name
const CACHE_NAME = "bclock";
const VERSION="1.0.0";
const CACHE_KEYS = [CACHE_NAME + VERSION];
// Cache targets
const urlsToCache = [
  "bclock.js",
  "bcalendar.js",
  "config.js",
  "holidays.js",
  "../index.html",
  "../images/icon-192x192.png",
  "../images/lava.jpg",
  "../images/frost.jpg",
  "../style/style.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(key => {
        return !CACHE_KEYS.includes(key);
      }).map(key => {
        if (key.indexOf(CACHE_NAME) == 0) {
          console.log("ServiceWorker: " + key + " remove");
          return caches.delete(key);
        } else {
          console.log("ServiceWorker: " + key + " no remove");
          return true;
        }
      }));
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return response ? response : fetch(event.request);
      })
  );
});
