const CACHE = 'jeux-ecole-v10';
const FILES = ['./', './index.html', './style.css', './app.js', './jeux.js', './cp-plus.js', './cm1-plus.js', './anglais-cours.js', './minijeux.js', './maitresses.js', './maj.js', './android.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => caches.keys()).then(ks => {
    // Les versions d'avant la v9 n'ont pas le bouton de mise à jour : on les remplace tout de suite.
    // Ensuite, la nouvelle version attend que l'on touche le bouton 🔄.
    if (!ks.some(k => k !== CACHE && +k.split('-v').pop() >= 9)) self.skipWaiting();
  }));
});
self.addEventListener('message', e => { if (e.data === 'maj') self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request))); });
