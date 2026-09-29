// Cours journalier : le travail du jour, obligatoire avant de jouer.
// Les parents choisissent dans l'espace parents les notions vues en classe (par date).
// Tant que le cours du jour n'est pas fait, le reste de l'appli est fermé.
// Un jour sans nouvelle notion (du lundi au vendredi), on révise les notions de la semaine.
// Chaque cours est noté sur 20 (la première fois compte) ; un jour oublié compte 0.
// À la fin de la semaine, la moyenne donne la note de la semaine : 16/20 ou plus → un cadeau pour l'animal.

/* ======================= Nouveau jeu CM1 : présent des verbes du 2e groupe ======================= */
(function () {
  // [infinitif, complément pour les phrases]
  const V2 = [['finir', 'ses devoirs'], ['choisir', 'un livre'], ['grandir', 'très vite'], ['réussir', 'son exercice'], ['remplir', 'la bouteille'],
    ['obéir', 'à la maîtresse'], ['réfléchir', 'avant de répondre'], ['rougir', 'de plaisir'], ['applaudir', 'les artistes'], ['bâtir', 'une cabane'],
    ['nourrir', 'les poules'], ['ralentir', 'devant l\'école'], ['salir', 'son pantalon'], ['guérir', 'vite'], ['agir', 'avec courage'],
    ['avertir', 'ses parents'], ['atterrir', 'à Paris'], ['fleurir', 'au printemps'], ['vieillir', 'doucement'], ['saisir', 'la balle'],
    ['bondir', 'de joie'], ['franchir', 'la ligne'], ['punir', 'le chien'], ['jaunir', 'en automne'], ['maigrir', 'un peu']];
  const T = ['is', 'is', 'it', 'issons', 'issez', 'issent'];
  const PR = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
  const rad = v => v.slice(0, -2);
  const voyelle = v => /^[aeiouéèêh]/.test(v);
  const avec = (i, v, f) => i === 0 && voyelle(v) ? `j'${f}` : `${PR[i]} ${f}`;
  const PIEGES = ['courir', 'partir', 'dormir', 'venir', 'sortir', 'ouvrir', 'tenir', 'mentir', 'cueillir', 'offrir', 'chanter', 'danser', 'sauter', 'prendre'];
  // Phrases : [sujet, personne, verbe, suite]
  const PHRASES = [
    ['Les élèves', 5, 'finir', 'leur travail.'], ['Nous', 3, 'choisir', 'un jeu.'], ['Ma petite sœur', 2, 'grandir', 'vite.'], ['Tu', 1, 'réussir', 'ta dictée.'],
    ['Vous', 4, 'remplir', 'vos verres.'], ['Le chien', 2, 'obéir', 'à son maître.'], ['Je', 0, 'réfléchir', 'avant de répondre.'], ['Les spectateurs', 5, 'applaudir', 'les clowns.'],
    ['Les oiseaux', 5, 'bâtir', 'leur nid.'], ['Nous', 3, 'nourrir', 'les lapins.'], ['La voiture', 2, 'ralentir', 'au virage.'], ['Tu', 1, 'salir', 'tes chaussures.'],
    ['Les roses', 5, 'fleurir', 'en juin.'], ['L\'avion', 2, 'atterrir', 'à l\'heure.'], ['Vous', 4, 'finir', 'le puzzle.'], ['Nous', 3, 'réussir', 'le défi.'],
    ['Je', 0, 'choisir', 'une glace à la fraise.'], ['Les feuilles', 5, 'jaunir', 'en automne.'], ['Le kangourou', 2, 'bondir', 'très haut.'], ['Vous', 4, 'réfléchir', 'ensemble.']
  ];
  const gen = () => {
    const t = alea(0, 5);
    const [v] = pioche(V2), r = rad(v);
    if (t === 0) { // conjuguer
      const i = alea(0, 5), bon = avec(i, v, r + T[i]);
      const fausses = [...T, 'e', 'es', 'ent', 'ons', 'issont'].map(x => avec(i, v, r + x));
      return qcm({ visuel: '⏳', enonce: `Conjugue « ${v} » au présent avec « ${PR[i]} ».` }, bon, fausses);
    }
    if (t === 1) { // terminaison
      const i = alea(0, 5);
      return qcm({ visuel: '✏️', enonce: `Complète : ${avec(i, v, r)}___ (présent)` }, '-' + T[i], ['-is', '-it', '-issons', '-issez', '-issent', '-ons', '-ent', '-e'].filter(x => x !== '-' + T[i]));
    }
    if (t === 2) { // phrase à écrire
      const [suj, i, vb, fin] = pioche(PHRASES), bon = rad(vb) + T[i];
      return { type: 'saisie', visuel: '✍️', enonce: `${suj} ___ ${fin} (${vb})`, aide: 'Écris le verbe conjugué au présent.', dire: `${suj}, blanc, ${fin} Verbe ${vb}, au présent.`, bonne: bon };
    }
    if (t === 3) { // reconnaître un verbe du 2e groupe
      return qcm({ visuel: '🔎', enonce: 'Quel verbe est du 2e groupe ?', aide: 'Essaie avec « nous » : nous …issons ?' }, v, PIEGES);
    }
    if (t === 4) { // retrouver l'infinitif
      const i = alea(2, 5), f = r + T[i];
      return qcm({ visuel: '🔙', enonce: `« ${PR[i]} ${f} » : quel est l'infinitif ?` }, v, [r + 'er', r + 'isser', r + 'ire', r + 're', f + 'er']);
    }
    const i = alea(2, 5); // trouver le sujet
    return qcm({ visuel: '👤', enonce: `Quel pronom va avec « … ${r + T[i]} » ?` }, ['Je', 'Tu', 'Il', 'Nous', 'Vous', 'Ils'][i], ['Je', 'Il', 'Nous', 'Vous', 'Ils']);
  };
  ajouterJeux('CM1', 'francais', [{ id: 'present-2e-groupe', titre: 'Présent : verbes du 2e groupe', emoji: '🌱', gen }]);
  cours('CM1/francais/present-2e-groupe',
    { t: 'Les verbes du 2e groupe', si: /2e groupe|infinitif/i, l: [
      'Ils se terminent par <b>-ir</b> à l\'infinitif, et avec « nous » on entend <b>-issons</b>.',
      'Pour vérifier, dis « nous … » : nous grandissons → grandir est du 2e groupe.',
      'Attention aux pièges : courir, partir, dormir, venir finissent aussi par -ir, mais on dit « nous courons », pas « nous courissons ». Ce sont des verbes du 3e groupe.'
    ], ex: 'bâtir → nous bâtissons → 2e groupe ✔<br>sortir → nous sortons → 3e groupe' },
    { t: 'Le présent des verbes du 2e groupe', l: [
      'On enlève <b>-ir</b> pour garder le radical : grandir → grand.',
      'Puis on ajoute : je -is · tu -is · il -it · nous -issons · vous -issez · ils -issent',
      'Avec je, tu et il, on n\'entend pas la fin : il faut bien écrire -is, -is, -it.'
    ], ex: 'bâtir : je bâtis, tu bâtis, il bâtit,<br>nous bâtissons, vous bâtissez, ils bâtissent' });
})();

/* ======================= Dates ======================= */
const JOUR_MS = 864e5;
const NOMS_JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
function isoJour(d = new Date()) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function dateIso(iso) { const [a, m, j] = iso.split('-').map(Number); return new Date(a, m - 1, j, 12); }
function ajouterJours(iso, n) { const d = dateIso(iso); d.setDate(d.getDate() + n); return isoJour(d); }
function lundiDe(iso) { const j = dateIso(iso).getDay(); return ajouterJours(iso, j === 0 ? -6 : 1 - j); }
function joursEcole(lundi) { return [0, 1, 2, 3, 4].map(k => ajouterJours(lundi, k)); }
function estJourEcole(iso) { const j = dateIso(iso).getDay(); return j >= 1 && j <= 5; }
function nomJour(iso) { return NOMS_JOURS[dateIso(iso).getDay()]; }
function dateLisible(iso) { const d = dateIso(iso); return `${nomJour(iso)} ${d.getDate()} ${['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'][d.getMonth()]}`; }

/* ======================= Les cadeaux de la semaine ======================= */
const SEUIL_CADEAU = 16, PATTES_CADEAU = 150;
const CADEAUX_SEMAINE = ['cape-etoiles', 'diademe', 'collier-etoile', 'ailes-or', 'lunettes-diamant'];
function cadeauSemaine(p, lundi) {
  const n = Math.round((dateIso(lundi) - dateIso('2026-09-28')) / (7 * JOUR_MS));
  const id = CADEAUX_SEMAINE[((n % CADEAUX_SEMAINE.length) + CADEAUX_SEMAINE.length) % CADEAUX_SEMAINE.length];
  const deja = p.animal && p.animal.possede[id];
  return { id, deja, pattes: deja ? PATTES_CADEAU * 2 : PATTES_CADEAU }; // déjà gagné : deux fois plus de pattes à la place
}

/* ======================= Les données ======================= */
function initJournalier(p) {
  if (!p.journalier) p.journalier = { debut: isoJour(), notions: {}, jours: {}, semaines: {} };
  const J = p.journalier;
  ['notions', 'jours', 'semaines'].forEach(k => { if (!J[k]) J[k] = {}; });
  if (!J.cadeauxEnAttente) J.cadeauxEnAttente = [];
  return J;
}
// Les notions vues en classe le mardi 29 septembre 2026 (demandées par le papa) : fractions et présent du 2e groupe.
function premiereGraine(profils) {
  const p = profils.find(x => x.classeReelle === 'CM1' && !x.journalier);
  if (!p || isoJour() > '2026-10-02') return;
  initJournalier(p).notions['2026-09-29'] = ['CM1:maths/fractions', 'CM1:maths/fractions-2', 'CM1:francais/present-2e-groupe'];
}
// Une notion = un jeu d'une classe : « CM1:maths/fractions ».
function trouverNotion(cle) {
  const [niv, reste] = cle.split(':'), [mid, jid] = (reste || '').split('/');
  const N = NIVEAUX[niv], m = N && N.matieres.find(x => x.id === mid), j = m && m.jeux.find(x => x.id === jid);
  return j && (j.gen || j.sequence) ? { cle, niv, m, j } : null;
}
// Les notions à travailler ce jour-là (et si c'est une révision), ou null si rien n'est prévu.
function notionsDuJour(p, iso = isoJour()) {
  const J = initJournalier(p);
  const valides = l => (l || []).map(trouverNotion).filter(Boolean);
  const duJour = valides(J.notions[iso]);
  if (duJour.length) return { liste: duJour, revision: false };
  if (!estJourEcole(iso)) return null;
  const vues = new Set();
  joursEcole(lundiDe(iso)).filter(d => d < iso).forEach(d => (J.notions[d] || []).forEach(c => vues.add(c)));
  const rev = valides([...vues]);
  return rev.length ? { liste: rev, revision: true } : null;
}
function coursFait(p, iso = isoJour()) { return !!initJournalier(p).jours[iso]; }
function coursObligatoire(p) { return !!notionsDuJour(p) && !coursFait(p); }

// Où en est la semaine : un point par jour d'école, et la note (moyenne des jours comptés).
function etatSemaine(p, lundi = lundiDe(isoJour())) {
  const J = initJournalier(p), auj = isoJour();
  const jours = joursEcole(lundi).map(d => {
    const fait = J.jours[d];
    if (fait && fait.dispense) return { d, etat: 'dispense' };
    if (fait) return { d, etat: 'fait', note: fait.note };
    if (d > auj) return { d, etat: notionsDuJour(p, d) ? 'avenir' : 'libre' };
    if (d < J.debut || !notionsDuJour(p, d)) return { d, etat: 'libre' };
    return d === auj ? { d, etat: 'aujourdhui' } : { d, etat: 'oublie', note: 0 };
  });
  const comptes = jours.filter(x => x.note !== undefined);
  const note = comptes.length ? Math.round(comptes.reduce((a, x) => a + x.note, 0) / comptes.length * 2) / 2 : null;
  const vendredi = ajouterJours(lundi, 4);
  const finie = auj > vendredi || (auj === vendredi && jours[4].etat !== 'aujourdhui');
  return { lundi, jours, note, finie, prevue: jours.some(x => x.etat !== 'libre') };
}

// Semaines terminées pas encore notées : on calcule la note et on donne le cadeau.
function cloturerSemaines(p) {
  const J = initJournalier(p), nouvelles = [];
  const lundis = new Set([...Object.keys(J.notions), ...Object.keys(J.jours)].filter(d => d >= lundiDe(J.debut)).map(lundiDe));
  [...lundis].sort().forEach(lundi => {
    if (J.semaines[lundi]) return;
    const s = etatSemaine(p, lundi);
    if (!s.finie || s.note === null) return;
    const c = cadeauSemaine(p, lundi), gagne = s.note >= SEUIL_CADEAU;
    J.semaines[lundi] = { note: s.note, gagne, cadeau: c.id, pattes: gagne ? c.pattes : 0, vu: false };
    if (gagne) {
      p.pattes = (p.pattes || 0) + c.pattes;
      if (p.animal) p.animal.possede[c.id] = true; else J.cadeauxEnAttente.push(c.id);
    }
    nouvelles.push(lundi);
  });
  // Cadeau gagné avant l'adoption : on le donne dès que l'animal est là.
  if (p.animal && J.cadeauxEnAttente.length) { J.cadeauxEnAttente.forEach(id => { p.animal.possede[id] = true; }); J.cadeauxEnAttente = []; }
  if (nouvelles.length) sauver();
  return Object.keys(J.semaines).filter(l => !J.semaines[l].vu).sort();
}

/* ======================= Dessins ======================= */
function dessinCadeau(p, id, humeur = 'joie') {
  const it = ARTICLE[id];
  if (!p.animal) return `<div class="cadeau-ic">${it.ic}</div>`;
  return dessinAnimal({ ...p.animal, proprete: 100, couche: false, cacas: 0, brille: 0, pansement: 0, dort: false }, { tenue: { ...p.animal.tenue, [it.slot]: id }, humeur, serre: true });
}
function frisePointsSemaine(s) {
  return `<div class="frise-semaine">${s.jours.map(x => {
    const [ic, txt] = { fait: ['✅', x.note + '/20'], oublie: ['❌', '0/20'], aujourdhui: ['📝', 'à faire'], avenir: ['⏳', ''], libre: ['➖', ''], dispense: ['🏠', 'dispensé'] }[x.etat];
    return `<div class="jour-semaine ${x.etat}"><b>${nomJour(x.d).slice(0, 3)}</b><span>${ic}</span><small>${txt}</small></div>`;
  }).join('')}</div>`;
}
const noteFr = n => String(n).replace('.', ',');
function nomAnimal(p) { return p.animal ? echapper(p.animal.nom) : p.espece === 'panda' ? 'ton panda' : 'ta panthère'; }

/* ======================= Écran du cours journalier ======================= */
function ecranJournalier(p) {
  const J = initJournalier(p), auj = isoJour();
  maitresseActive = p.maitresse;
  const mt = MAITRESSES[p.maitresse];
  const s = etatSemaine(p), c = cadeauSemaine(p, s.lundi), it = ARTICLE[c.id];
  const dispense = J.jours[auj] && J.jours[auj].dispense;
  const du = dispense ? null : notionsDuJour(p), fait = dispense ? null : J.jours[auj];
  const premiereFois = J.expliqueSemaine !== s.lundi;
  const matieresDuJour = du ? [...new Set(du.liste.map(n => `${n.m.emoji} ${n.m.titre}`))] : [];
  const bulle = !du ? 'Pas de cours aujourd\'hui. Profites-en bien !'
    : fait ? `Bravo, ton cours du jour est fait : ${fait.note} sur 20 ! Tu peux t'entraîner encore si tu veux.`
      : premiereFois ? `Voici ton cours journalier. Chaque jour, tu travailles d'abord tes leçons, et après tu fais ce que tu veux. Regarde le cadeau de la semaine : si tu as au moins ${SEUIL_CADEAU} sur 20 vendredi, il est pour ${p.animal ? p.animal.nom : 'ton animal'} !`
        : du.revision ? 'Aujourd\'hui, on révise les leçons de la semaine. Au travail !' : 'Aujourd\'hui, on travaille ce que tu as vu en classe. Au travail !';
  afficher('📝 Cours journalier', `
    <div class="mascotte">
      <div class="perso-maitresse">${dessinMaitresse(p.maitresse, fait ? 'contente' : 'normal')}</div>
      <div class="bulle"><b>${mt.nom}</b><br>${typo(bulle)}</div>
    </div>
    ${du ? `<div class="carte-jour">
      <h2>${du.revision ? '🔁 Révision de la semaine' : '📌 Aujourd\'hui'} · ${dateLisible(auj)}</h2>
      <ul>${du.liste.map(n => `<li>${n.m.emoji} <b>${n.m.titre}</b> : ${n.j.titre}</li>`).join('')}</ul>
      <p style="text-align:center"><button class="bouton ${fait ? 'second' : 'gros-bouton'}" id="commencer">${fait ? '🔁 M\'entraîner encore (la note ne change pas)' : '🚀 Commencer mon cours'}</button></p>
    </div>` : ''}
    <div class="cadeau-semaine">
      <h2>🎁 Le cadeau de la semaine</h2>
      <div class="cadeau-contenu">
        <div class="cadeau-dessin">${dessinCadeau(p, c.id)}</div>
        <div>
          <p class="cadeau-nom">${it.nom}<br><small>pour ${nomAnimal(p)}, introuvable à la boutique !</small></p>
          <p class="cadeau-pattes">+ ${c.pattes} 🐾</p>
          <p>Il faut <b>${SEUIL_CADEAU}/20</b> ou plus à la note de la semaine.</p>
        </div>
      </div>
      ${s.prevue ? `<h3>Ma semaine${s.note !== null ? ` · note pour l'instant : <b>${noteFr(s.note)}/20</b>` : ''}</h3>${frisePointsSemaine(s)}` : ''}
    </div>
    <details class="comment-ca-marche" ${premiereFois ? 'open' : ''}>
      <summary>❓ Comment ça marche ?</summary>
      <ol>
        <li>Chaque jour d'école, tu fais ton <b>cours journalier</b> avant tout le reste. Tant qu'il n'est pas fini, les jeux, l'album et ${nomAnimal(p)} t'attendent.</li>
        <li>D'abord un <b>petit cours</b> pour te rappeler la leçon, puis des <b>exercices</b>.</li>
        <li>Chaque cours a une <b>note sur 20</b>. C'est ta <b>première</b> fois de la journée qui compte : prends ton temps et utilise le bouton « ? » si tu bloques.</li>
        <li>Un jour oublié compte <b>0/20</b>. Le mercredi ou un jour sans nouvelle leçon, tu révises les leçons de la semaine.</li>
        <li>Le <b>vendredi</b>, ta maîtresse fait la moyenne : c'est ta <b>note de la semaine</b>.</li>
        <li><b>${SEUIL_CADEAU}/20 ou plus</b> : tu gagnes le cadeau et les pattes 🐾 ! Chaque semaine, un nouveau cadeau.</li>
      </ol>
    </details>
    ${Object.keys(J.semaines).length ? `<p class="astuce">Mes notes : ${Object.entries(J.semaines).sort().slice(-4).map(([l, x]) => `semaine du ${dateIso(l).getDate()}/${dateIso(l).getMonth() + 1} : ${noteFr(x.note)}/20 ${x.gagne ? '🎁' : ''}`).join(' · ')}</p>` : ''}`,
  { retour: true, profil: p });
  if (premiereFois) { J.expliqueSemaine = s.lundi; sauver(); }
  parler(bulle);
  const b = document.getElementById('commencer');
  if (b) b.onclick = () => { son('tic'); aller(() => leconJournaliere(p, du, !!fait)); };
}

// Le petit rappel de cours, notion par notion, avant les exercices.
function leconJournaliere(p, du, entrainement) {
  maitresseActive = p.maitresse;
  const fichesDe = n => COURS[`${n.niv}/${n.m.id}/${n.j.id}`] || COURS[`${n.niv}/${n.m.id}`] || [];
  const html = du.liste.map(n => `<h2 class="titre-notion">${n.m.emoji} ${n.m.titre} · ${n.j.titre}</h2>
    ${fichesDe(n).map(f => `<section class="fiche"><h3>${typo(f.t)}</h3><ul>${f.l.map(l => `<li>${typo(l)}</li>`).join('')}</ul>${f.ex ? `<div class="exemple"><span>Exemple</span>${typo(f.ex)}</div>` : ''}</section>`).join('')}`).join('');
  afficher('📖 Le petit cours', `
    <div class="mascotte">
      <div class="perso-maitresse">${dessinMaitresse(p.maitresse, 'contente')}</div>
      <div class="bulle"><b>${MAITRESSES[p.maitresse].nom}</b><br>Lis bien ton cours${NIVEAUX[p.niveau].lecture ? '' : ' (ou écoute-moi)'}. Ensuite, place aux exercices !</div>
    </div>
    <div class="lecon-jour">${html}</div>
    <p style="text-align:center">
      <button class="bouton violet" id="ecouterLecon">🔊 Écouter la maîtresse</button>
      <button class="bouton" id="auxExercices">✏️ J'ai compris, aux exercices !</button>
    </p>`, { retour: true, profil: p });
  const aDire = s => sansBalises(s).replace(/\p{Extended_Pictographic}|️|‍/gu, ' ').replace(/ · /g, ', ').replace(/→/g, ', ').replace(/\s+/g, ' ').trim();
  const phrases = du.liste.flatMap(n => [`${n.m.titre} : ${n.j.titre}.`, ...fichesDe(n).flatMap(f => [f.t + '.', ...f.l, f.ex ? 'Par exemple : ' + f.ex : ''])]).map(aDire).filter(Boolean);
  document.getElementById('ecouterLecon').onclick = () => {
    taire();
    const file = phrases.slice(), ecran = $ecran.firstElementChild;
    const suite = () => { const x = file.shift(); if (x && ecran.isConnected) parler(x, 'fr-FR', suite); };
    suite();
  };
  document.getElementById('auxExercices').onclick = () => { taire(); son('tic'); aller(() => partie(p, null, jeuJournalier(du, entrainement))); };
  parler('Lis bien ton cours. Ensuite, place aux exercices !');
}

// Les exercices : quelques questions sur chaque notion (12 environ), dans l'ordre du cours.
function jeuJournalier(du, entrainement) {
  const parNotion = Math.max(3, Math.round(12 / du.liste.length));
  const sequence = () => du.liste.flatMap(n => {
    const qs = [], deja = new Set();
    const source = n.j.gen ? () => n.j.gen() : (() => { const toutes = n.j.sequence().filter(q => q.type !== 'decouvrir' && q.type !== 'parler'); return () => toutes.length ? toutes.splice(alea(0, toutes.length - 1), 1)[0] : null; })();
    for (let essais = 0; qs.length < parNotion && essais < 60; essais++) {
      const q = source();
      if (!q) break;
      if (deja.has(cleQ(q))) continue;
      deja.add(cleQ(q));
      q.matiere = n.m; q.jeu = n.j; q.niveau = n.niv;
      qs.push(q);
    }
    return qs;
  }).slice(0, 15);
  return { id: 'journalier', titre: 'Cours journalier', emoji: '📝', journalier: true, entrainement, sequence };
}

// Fin du cours : la note du jour, puis la maison est ouverte.
function finJournalier(p, jeu, reussies, total, gains) {
  const J = initJournalier(p), auj = isoJour();
  const note = Math.round(reussies * 20 / Math.max(1, total));
  const premiere = !jeu.entrainement && !J.jours[auj];
  if (premiere) { J.jours[auj] = { note, bonnes: reussies, total }; sauver(); }
  const fermees = cloturerSemaines(p);
  const s = etatSemaine(p);
  const msg = premiere ? `Ton cours journalier est fini ! Tu as ${note} sur 20. ${note >= 16 ? 'Excellent travail !' : note >= 12 ? 'C\'est bien !' : 'Continue tes efforts, demain ça ira mieux !'} Maintenant, tu peux faire ce que tu veux !`
    : `Bon entraînement : ${note} sur 20. Ta note du jour reste celle de la première fois.`;
  maitresseActive = p.maitresse;
  afficher('📝 Cours journalier', `
    <div class="bravo">
      <div class="fin-maitresse">${dessinMaitresse(p.maitresse, note >= 10 ? 'contente' : 'encourage')}</div>
      <div class="note-jour ${note >= 16 ? 'top' : ''}">${note}<small>/20</small></div>
      <p>${typo(msg)}<br><small>${reussies} bonnes réponses du premier coup sur ${total}</small></p>
      <div class="gains">
        <div class="gain">🪙 <b>+${gains.pieces}</b></div>
        ${gains.pattes ? `<div class="gain">🐾 <b>+${gains.pattes}</b></div>` : ''}
        ${gains.tickets ? `<div class="gain">🎟️ <b>+${gains.tickets}</b></div>` : ''}
      </div>
      ${s.prevue && !fermees.length ? `<h3>Ma semaine${s.note !== null ? ` : <b>${noteFr(s.note)}/20</b> pour l'instant` : ''}</h3>${frisePointsSemaine(s)}` : ''}
      <div>
        ${fermees.length ? '<button class="bouton gros-bouton" id="bilan">🏆 Voir ma note de la semaine</button>' : ''}
        <button class="bouton ${fermees.length ? 'second' : ''}" id="maison">🏠 Retour à la maison</button>
      </div>
    </div>`, { retour: true, profil: p });
  if (note >= 12) { son('bonus'); setTimeout(() => confettis(document.querySelector('.note-jour'), 40), 300); }
  parler(msg);
  const retourMaison = () => { quitter(); pile = [accueil]; ecranActuel = () => maison(p); maison(p); };
  document.getElementById('maison').onclick = retourMaison;
  const bl = document.getElementById('bilan');
  if (bl) bl.onclick = () => bilanSemaine(p, fermees[0], retourMaison);
}

// L'annonce de la note de la semaine (une seule fois par semaine).
function bilanSemaine(p, lundi, suite) {
  const J = initJournalier(p), x = J.semaines[lundi], it = ARTICLE[x.cadeau];
  x.vu = true; sauver();
  maitresseActive = p.maitresse;
  const msg = x.gagne ? `Bravo ! Ta note de la semaine est ${noteFr(x.note)} sur 20. Tu as gagné : ${it.nom}, et ${x.pattes} pattes ! Va vite l'essayer dans l'armoire de ${p.animal ? p.animal.nom : 'ton animal'}.`
    : `Ta note de la semaine est ${noteFr(x.note)} sur 20. Il fallait ${SEUIL_CADEAU} pour le cadeau. Ce n'est pas grave : la semaine prochaine, un nouveau cadeau t'attend. Fais ton cours chaque jour, et tu vas y arriver !`;
  afficher('🏆 Ma note de la semaine', `
    <div class="bravo bilan-semaine">
      <div class="fin-maitresse">${dessinMaitresse(p.maitresse, x.gagne ? 'contente' : 'encourage')}</div>
      <p>Semaine du ${dateLisible(lundi)}</p>
      <div class="note-jour ${x.gagne ? 'top' : ''}">${noteFr(x.note)}<small>/20</small></div>
      ${x.gagne ? `<div class="cadeau-dessin grand">${dessinCadeau(p, x.cadeau)}</div><p class="cadeau-nom">🎁 ${it.nom}<br><b>+ ${x.pattes} 🐾</b></p>` : '<div class="gros">💪</div>'}
      <p>${typo(msg)}</p>
      <div><button class="bouton" id="suiteBilan">Continuer ➜</button></div>
    </div>`, { retour: true, profil: p });
  if (x.gagne) { son('bonus'); [0, 500, 1000].forEach(t => setTimeout(() => confettis(document.querySelector('.note-jour'), 60), t)); }
  parler(msg);
  document.getElementById('suiteBilan').onclick = () => {
    const reste = cloturerSemaines(p);
    if (reste.length) bilanSemaine(p, reste[0], suite); else suite();
  };
}

/* ======================= Espace parents ======================= */
function reglagesJournalier(p, i) {
  const J = initJournalier(p), s = etatSemaine(p);
  const date = window.__dateJournalier && window.__dateJournalier[i] || isoJour();
  const choisies = new Set(J.notions[date] || []);
  const N = NIVEAUX[p.classeReelle];
  const listes = N.matieres.map(m => {
    const jeux = m.jeux.filter(j => (j.gen || j.sequence) && !j.evaluation);
    if (!jeux.length || m.parcours) return '';
    const nb = jeux.filter(j => choisies.has(`${p.classeReelle}:${m.id}/${j.id}`)).length;
    return `<details class="notions-matiere" ${nb ? 'open' : ''}><summary>${m.emoji} ${m.titre}${nb ? ` (${nb})` : ''}</summary>
      ${jeux.map(j => { const cle = `${p.classeReelle}:${m.id}/${j.id}`; return `<label class="case"><input type="checkbox" data-notion="${cle}" data-i="${i}" ${choisies.has(cle) ? 'checked' : ''}> ${j.emoji} ${j.titre}</label>`; }).join('')}</details>`;
  }).join('');
  const du = notionsDuJour(p);
  return `<div class="parent-journalier">
    <h3>📝 Cours journalier</h3>
    <p class="note-parent">Cochez ce qui a été vu en classe. Tant que le cours du jour n'est pas fait, le reste de l'appli est fermé. Du lundi au vendredi, un jour sans nouvelle notion devient une révision de la semaine. Note de la semaine = moyenne des cours du jour (jour oublié = 0) ; ${SEUIL_CADEAU}/20 ou plus = cadeau pour l'animal + ${PATTES_CADEAU} pattes.</p>
    <label>Date (classe de ${p.classeReelle})</label>
    <input type="date" data-date-journalier="${i}" value="${date}">
    ${listes}
    <p class="note-parent">Aujourd'hui : ${du ? (coursFait(p) ? (J.jours[isoJour()].dispense ? 'dispensé' : `fait, ${J.jours[isoJour()].note}/20`) : du.revision ? 'révision à faire' : 'cours à faire') : 'pas de cours'}${s.note !== null ? ` · note de la semaine pour l'instant : ${noteFr(s.note)}/20` : ''}</p>
    ${du && !coursFait(p) ? `<button class="bouton second" data-dispense="${i}">🏠 Dispenser aujourd'hui (jour non compté)</button>` : ''}
    ${Object.keys(J.semaines).length ? `<table><tr><th>Semaine du</th><th>Note</th><th>Cadeau</th></tr>${Object.entries(J.semaines).sort().reverse().map(([l, x]) => `<tr><td>${dateLisible(l)}</td><td>${noteFr(x.note)}/20</td><td>${x.gagne ? '🎁 ' + ARTICLE[x.cadeau].nom : '–'}</td></tr>`).join('')}</table>` : ''}
  </div>`;
}
function lierReglagesJournalier(rafraichir) {
  $ecran.querySelectorAll('[data-date-journalier]').forEach(el => el.onchange = () => {
    window.__dateJournalier = window.__dateJournalier || {};
    if (el.value) window.__dateJournalier[el.dataset.dateJournalier] = el.value;
    rafraichir();
  });
  $ecran.querySelectorAll('[data-notion]').forEach(el => el.onchange = () => {
    const i = el.dataset.i, p = donnees.profils[i], J = initJournalier(p);
    const date = window.__dateJournalier && window.__dateJournalier[i] || isoJour();
    const l = new Set(J.notions[date] || []);
    if (el.checked) l.add(el.dataset.notion); else l.delete(el.dataset.notion);
    if (l.size) J.notions[date] = [...l]; else delete J.notions[date];
    sauver();
  });
  $ecran.querySelectorAll('[data-dispense]').forEach(el => el.onclick = () => {
    const p = donnees.profils[el.dataset.dispense];
    initJournalier(p).jours[isoJour()] = { dispense: true };
    sauver(); rafraichir();
  });
}
