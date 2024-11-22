// Cache name
const CACHE_NAME = "bclock-caches-v1";
// Cache targets
const urlsToCache = [
  "js/block.js",
  "index.html",
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

console.log("sw.js end");