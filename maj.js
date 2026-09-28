// Mise à jour : quand une nouvelle version de l'appli est prête, un bouton 🔄 apparaît en haut.
// Un toucher l'installe et recharge l'appli (les étoiles et pièces restent, elles sont dans localStorage).
(function () {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  const bouton = document.getElementById('maj');
  const avaitVersion = !!navigator.serviceWorker.controller;
  let reg = null, recharge = false;
  const debut = Date.now();
  // À l'ouverture de l'appli (écran d'accueil, premières secondes), la nouvelle version s'installe toute seule.
  // Pendant un jeu, on ne coupe pas l'enfant : le bouton vert 🔄 apparaît.
  const aLAccueil = () => document.getElementById('retour').hidden;
  const montrer = () => {
    if (!reg || !reg.waiting || !navigator.serviceWorker.controller) return;
    if (Date.now() - debut < 15000 && aLAccueil()) installer();
    else bouton.hidden = false;
  };
  const installer = () => {
    if (!reg || !reg.waiting) { location.reload(); return; }
    bouton.disabled = true;
    bouton.classList.add('tourne');
    reg.waiting.postMessage('maj');
  };
  // Numéro de version en bas de l'écran d'accueil (utile pour savoir si la tablette est à jour).
  if (window.caches) caches.keys().then(ks => {
    const n = ks.map(k => +k.split('-v').pop()).filter(x => x > 0);
    const el = document.getElementById('version');
    if (n.length && el) el.textContent = 'Version ' + Math.min(...n);
  }).catch(() => {});
  navigator.serviceWorker.register('sw.js').then(r => {
    reg = r;
    montrer();
    const suivre = w => { if (w) w.addEventListener('statechange', () => { if (w.state === 'installed') montrer(); }); };
    suivre(r.installing);
    r.addEventListener('updatefound', () => suivre(r.installing));
    const verifier = () => r.update().then(montrer, () => {});
    verifier();
    setInterval(verifier, 30 * 60 * 1000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) verifier(); });
  }).catch(() => {});
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (recharge || !avaitVersion) return;
    recharge = true;
    location.reload();
  });
  bouton.onclick = installer;
})();
