// Vérifie tous les jeux : génère des questions et contrôle qu'elles sont bien formées
// et qu'un petit cours (bouton « ? ») existe. Usage : node outils/verifier.js [NIVEAU]
const fs = require('fs'), vm = require('vm'), path = require('path');
const dir = path.join(__dirname, '..');
const ctx = { console, Math, window: {}, document: { createElement: () => ({}), querySelector: () => null, body: {} } };
vm.createContext(ctx);
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const fichiers = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1])
  .filter(f => !/^(android|minijeux|animal-dessin|animal|app|maj|maitresses)\.js$/.test(f));
for (const f of fichiers) {
  try { vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f }); }
  catch (e) { console.log('✗ ' + f + ' ne se charge pas : ' + e.message); if (!process.argv[2] || f === process.argv[2].toLowerCase() + '.js') process.exitCode = 1; }
}
const res = vm.runInContext(`(() => {
  const seul = ${JSON.stringify(process.argv[2] || '')};
  const erreurs = [], stats = {};
  for (const [niv, N] of Object.entries(NIVEAUX)) {
    if (seul && niv !== seul) continue;
    let nbJeux = 0;
    for (const m of N.matieres) for (const j of m.jeux) {
      nbJeux++;
      const cle = niv + '/' + m.id + '/' + j.id;
      const qs = [];
      try { for (let i = 0; i < 150; i++) qs.push(...(j.sequence ? j.sequence() : [j.gen()])); }
      catch (e) { erreurs.push(cle + ' : plantage ' + e.message); continue; }
      let sansCours = 0, conseil = 0;
      const vues = new Set();
      for (const q of qs) {
        const txt = JSON.stringify(q);
        vues.add(q.enonce + '|' + q.visuel + '|' + q.bonne);
        if (/undefined|NaN|null|\\[object/.test([q.enonce, q.visuel, q.bonne, q.aide, q.dire, ...(q.choix || [])].join(' '))) { erreurs.push(cle + ' : valeur vide ' + txt.slice(0, 200)); break; }
        if (q.type === 'decouvrir' || q.type === 'parler') continue;
        if (q.bonne === undefined || q.bonne === '') { erreurs.push(cle + ' : pas de bonne réponse ' + txt.slice(0, 200)); break; }
        if (!q.type) {
          if (!Array.isArray(q.choix) || q.choix.length < 2) { erreurs.push(cle + ' : moins de 2 choix ' + txt.slice(0, 200)); break; }
          if (!q.choix.includes(q.bonne)) { erreurs.push(cle + ' : bonne réponse absente des choix ' + txt.slice(0, 200)); break; }
          if (new Set(q.choix).size !== q.choix.length) { erreurs.push(cle + ' : choix en double ' + txt.slice(0, 200)); break; }
        }
        const f = fichesCours(q, j, m, niv);
        if (!f) sansCours++;
        else if (f.length === 1 && f[0].t === 'Un petit conseil') conseil++;
      }
      if (sansCours) erreurs.push(cle + ' : pas de petit cours (' + sansCours + ' questions)');
      if (conseil > qs.length / 3) erreurs.push(cle + ' : le cours est vide pour ' + conseil + '/' + qs.length + ' questions');
      if (!j.sequence && vues.size < 8) erreurs.push(cle + ' : seulement ' + vues.size + ' questions différentes');
    }
    stats[niv] = N.matieres.length + ' matières, ' + nbJeux + ' jeux';
  }
  return { erreurs, stats };
})()`, ctx);
console.log(res.stats);
res.erreurs.forEach(e => console.log('✗ ' + e));
console.log(res.erreurs.length ? res.erreurs.length + ' problème(s)' : 'Tout est bon ✓');
process.exit(res.erreurs.length ? 1 : 0);
