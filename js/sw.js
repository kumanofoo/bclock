// Cache name
const CACHE_NAME = "bclock-caches-v1";
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

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return response ? response : fetch(event.request);
      })
  );
});
