// Mise à jour : quand une nouvelle version de l'appli est prête, un bouton 🔄 apparaît en haut.
// Un toucher l'installe et recharge l'appli (les étoiles et pièces restent, elles sont dans localStorage).
(function () {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  const bouton = document.getElementById('maj');
  const avaitVersion = !!navigator.serviceWorker.controller;
  let reg = null, recharge = false;
  const montrer = () => { if (reg && reg.waiting && navigator.serviceWorker.controller) bouton.hidden = false; };
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
  bouton.onclick = () => {
    if (!reg || !reg.waiting) { location.reload(); return; }
    bouton.disabled = true;
    bouton.classList.add('tourne');
    reg.waiting.postMessage('maj');
  };
})();
