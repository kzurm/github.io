/* Offline support. Caches the app shell; checks the network for updates in the
   background. Bump the version when files change. */
var CACHE = "bump-v2";
var FILES = ["./", "index.html", "app.css?v=2", "icons.js?v=2", "app.js?v=2", "sync.js?v=2", "coach.js?v=2", "data/weeks.js?v=2", "data/nutrition.js?v=2", "data/fitness.js?v=2", "data/insights.js?v=2", "manifest.webmanifest", "icon.svg", "icon-192.png", "icon-512.png"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener("activate", function (e) { e.waitUntil(caches.keys().then(function (keys) { return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request).then(function (cached) {
    var net = fetch(e.request).then(function (res) { if (res && res.ok) caches.open(CACHE).then(function (c) { c.put(e.request, res.clone()); }); return res; }).catch(function () { return cached; });
    return cached || net;
  }));
});
