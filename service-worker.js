self.addEventListener("install", function (e) {
  console.log("BlackTrigger установлен");
  e.waitUntil(
    caches.open("blacktrigger").then(function (cache) {
      return cache.addAll(["index.html", "js/main.js", "css/style.css"]);
    })
  );
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});
