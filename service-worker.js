self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("blacktrigger-v1").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/style.css",
        "/main.js",
        "/icon-192.png",
        "/icon-512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("push", event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "icon-192.png"
  });
});