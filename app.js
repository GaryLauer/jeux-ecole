// Navigation, profils, récompenses (pièces, tickets, album, niveaux) et déroulement d'une partie.
const NB_QUESTIONS = 10;
const CLE = 'jeux-ecole-v1';
const PRIX_OEUF = 20;
const $ecran = document.getElementById('ecran');
const $titre = document.getElementById('titre');
const $retour = document.getElementById('retour');
const $bourse = document.getElementById('bourse');

let donnees = charger();
let pile = []; // écrans précédents, pour le bouton retour
let nettoyage = null;
let maitresseActive = null; // la maîtresse de l'enfant qui joue // fonction à appeler en quittant un écran (mini-jeu en cours…)

/* ---------- Autocollants de l'album ---------- */
const ALBUM = [
  ...['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
    '🦉', '🐴', '🐝', '🐛', '🦋', '🐌', '🐞', '🐢', '🐍', '🐙', '🦀', '🐠', '🐬', '🐳', '🦒', '🦓', '🐘', '🦔', '🐿️', '🦘'].map(e => ({ e, rarete: 'commun' })),
  ...['🦄', '🐉', '🦕', '🦖', '🦩', '🦚', '🦜', '🐆', '🦭', '🐻‍❄️', '🦥', '🦦', '🐊', '🦈', '🦙'].map(e => ({ e, rarete: 'rare' })),
  ...['👑', '🌈', '🚀', '💎', '🏆'].map(e => ({ e, rarete: 'légendaire' }))
].map((s, i) => ({ ...s, id: 'a' + i }));
const CHANCES = { commun: 0.75, rare: 0.21, 'légendaire': 0.04 };

function nouveauProfil(id, nom, niveau, avatar) {
  // niveau : la classe choisie pour jouer ; classeReelle : sa vraie classe à l'école (réglée par les parents).
  return { id, nom, niveau, classeReelle: niveau, espece: niveau === 'CP' ? 'panda' : 'panthere', avatar, maitresse: niveau === 'CP' ? 'panda' : 'leopard', etoiles: 0, scores: {}, pieces: 0, tickets: 1, xp: 0, album: {}, records: {}, serie: { jour: '', n: 0 }, defi: '', jeuxDuJour: { jour: '', n: 0 }, pattes: 0, animal: null };
}
function charger() {
  let d;
  try { d = JSON.parse(localStorage.getItem(CLE)); } catch (e) {}
  if (!d || !d.profils) d = { profils: [nouveauProfil('p1', 'Ma grande', 'CM1', '🦊'), nouveauProfil('p2', 'Ma petite', 'CP', '🐻')] };
  d.profils.forEach(p => {
    // L'animal reste celui de l'enfant, quelle que soit la classe choisie ensuite.
    if (!p.espece) p.espece = p.animal ? p.animal.espece : p.niveau === 'CP' ? 'panda' : 'panthere';
    if (!p.classeReelle) p.classeReelle = p.niveau;
    // Étoiles rangées par classe (« CM1:maths/tables ») : chaque classe a ses propres jeux.
    if (p.scores) Object.keys(p.scores).forEach(k => { if (!k.includes(':')) { p.scores[`${p.niveau}:${k}`] = p.scores[k]; delete p.scores[k]; } });
  });
  // Ajoute les champs des nouvelles versions aux anciens profils.
  d.profils = d.profils.map(p => ({ ...nouveauProfil(p.id, p.nom, p.niveau, p.avatar), ...p }));
  d.profils.forEach(p => { if (p.nom === 'Mon grand') p.nom = 'Ma grande'; if (p.nom === 'Mon petit') p.nom = 'Ma petite'; });
  if (d.limiteMiniJeux === undefined) d.limiteMiniJeux = 5;
  d.profils.forEach(initJournalier);
  semerNotions(d.profils);
  return d;
}
function sauver() { try { localStorage.setItem(CLE, JSON.stringify(donnees)); } catch (e) {} }
function aujourdhui() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
// Chaque niveau demande un peu plus d'XP que le précédent : 100, 150, 200…
function infoNiveau(xp) {
  let niv = 1, besoin = 100;
  while (xp >= besoin) { xp -= besoin; niv++; besoin += 50; }
  return { niv, pourcent: Math.round(xp / besoin * 100) };
}
function niveauDe(p) { return infoNiveau(p.xp).niv; }

/* ---------- Classes ---------- */
const COULEUR_CLASSE = { CP: '#ff8a3d', CE1: '#e5484d', CE2: '#3bb273', CM1: '#4f8ef7', CM2: '#8e5cd9' };
const rangClasse = c => Math.max(0, CLASSES.indexOf(c));
// On peut « redoubler » une classe (un an en dessous) et gagner ses points ;
// deux ans ou plus en dessous de sa vraie classe, on peut jouer mais on ne gagne rien.
function sansPoints(p, classe = p.niveau) { return rangClasse(p.classeReelle) - rangClasse(classe) >= 2; }
function cleScore(p, m, j) { return m.parcours ? PARCOURS_EN.cle(j.id) : `${p.niveau}:${m.id}/${j.id}`; }

/* ---------- Voix ---------- */
function parler(texte, lang = 'fr-FR', suite) {
  if (!('speechSynthesis' in window) || !texte) { suite && suite(); return; }
  const u = new SpeechSynthesisUtterance(texte.replace(/<[^>]+>/g, ' ').replace(/_+/g, ' blanc '));
  u.lang = lang; u.rate = lang === 'fr-FR' ? 0.95 : 0.8;
  const voix = lang === 'fr-FR' ? voixMaitresse() : speechSynthesis.getVoices().find(v => v.lang && v.lang.replace('_', '-').startsWith(lang.slice(0, 2)));
  if (voix) u.voice = voix;
  if (lang === 'fr-FR' && maitresseActive) u.pitch = MAITRESSES[maitresseActive].pitch;
  u.onstart = () => document.body.classList.add('parle');
  u.onend = () => { document.body.classList.remove('parle'); suite && suite(); };
  u.onerror = () => document.body.classList.remove('parle');
  speechSynthesis.speak(u);
}
function lireQuestion(q, avecChoix) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const choixLisibles = avecChoix && q.choix && q.choix.every(c => /[a-zà-ÿ0-9]/i.test(c));
  parler(q.dire || q.enonce, 'fr-FR', () => {
    if (q.direEn) parler(q.direEn, 'en-GB', () => {
      // suite éventuelle : [[texte, langue], …]
      const suite = (q.apres || []).slice();
      const dire = () => { const x = suite.shift(); if (x) parler(x[0], x[1], dire); };
      dire();
    });
    else if (choixLisibles) parler(q.choix.join(', ou, '));
  });
}
function taire() { if ('speechSynthesis' in window) speechSynthesis.cancel(); document.body.classList.remove('parle'); }

/* ---------- Écrans ---------- */
function afficher(titre, html, options = {}) {
  $titre.textContent = titre;
  $retour.hidden = !options.retour;
  majBourse(options.profil);
  $ecran.innerHTML = html;
  $ecran.className = options.classe || '';
  window.scrollTo(0, 0);
}
function majBourse(p) {
  $bourse.hidden = !p;
  if (!p) return;
  document.getElementById('nbPieces').textContent = p.pieces;
  document.getElementById('nbTickets').textContent = p.tickets;
  document.getElementById('nbPattes').textContent = p.pattes || 0;
}
function quitter() { if (nettoyage) { const f = nettoyage; nettoyage = null; f(); } fermerCours(); taire(); }
function aller(fn) { quitter(); pile.push(ecranActuel); ecranActuel = fn; fn(); }
let ecranActuel = accueil;
$retour.onclick = () => {
  if (document.querySelector('.cours-fenetre')) return fermerCours(); // retour d'Android : ferme d'abord le petit cours
  quitter(); ecranActuel = pile.pop() || accueil; ecranActuel();
};

function accueil() {
  quitter();
  pile = [];
  ecranActuel = accueil;
  maitresseActive = null;
  afficher('Mes Petits Jeux d\'École', `
    <p class="sous-titre">Qui joue aujourd'hui ?</p>
    <div class="grille">
      ${donnees.profils.map((p, i) => `
        <button class="tuile profil" style="--c:${COULEUR_CLASSE[p.niveau] || '#4f8ef7'}" data-i="${i}">
          <span class="emoji rebond">${p.avatar}</span>${echapper(p.nom)}<small>${p.niveau} · Niveau ${niveauDe(p)} · 🪙 ${p.pieces}${coursObligatoire(p) ? '<br>📝 Cours du jour à faire' : ''}</small>
        </button>`).join('')}
    </div>
    <button class="lien" id="parents">Espace parents</button>`);
  $ecran.querySelectorAll('.profil').forEach(b => b.onclick = () => aller(() => maison(donnees.profils[b.dataset.i])));
  document.getElementById('parents').onclick = () => aller(espaceParents);
}

// L'écran d'accueil d'un enfant : sa mascotte, son niveau, et les 4 grandes portes.
function maison(p) {
  // Fin de semaine : la maîtresse annonce d'abord la note de la semaine.
  const aAnnoncer = cloturerSemaines(p);
  if (aAnnoncer.length) return bilanSemaine(p, aAnnoncer[0], () => maison(p));
  const jour = aujourdhui();
  if (p.serie.jour !== jour) {
    const hier = new Date(Date.now() - 864e5);
    const jourHier = `${hier.getFullYear()}-${hier.getMonth() + 1}-${hier.getDate()}`;
    p.serie = { jour, n: p.serie.jour === jourHier ? p.serie.n + 1 : 1 };
    sauver();
  }
  const { niv, pourcent: xpNiv } = infoNiveau(p.xp);
  const nbAlbum = Object.keys(p.album).length;
  const defiFait = p.defi === jour;
  const lecture = NIVEAUX[p.niveau].lecture;
  maitresseActive = p.maitresse;
  const mt = MAITRESSES[p.maitresse];
  const alerte = alerteAnimal(p);
  const panda = p.espece === 'panda';
  // Cours journalier : tant qu'il n'est pas fait, tout le reste est fermé.
  const duJour = notionsDuJour(p), aFaire = coursObligatoire(p), semaine = etatSemaine(p);
  const faitJour = initJournalier(p).jours[isoJour()];
  const phraseTravail = `D'abord, ton cours journalier ! Tu dois travailler tes exercices avant de faire ce que tu veux. Après, tout sera ouvert.`;
  const bulle = aFaire ? `Coucou ${echapper(p.nom)} ! ${phraseTravail}` : alerte && !p.animal.dort ? `${p.animal.nom} t'appelle : « ${alerte.replace(/\s*\p{Extended_Pictographic}\uFE0F?/gu, '')} »` : !p.animal && Math.random() < 0.5 ? `Un bébé t'attend dans la maison des animaux ! Va vite l'adopter.` : pioche([
    pioche(mt.salut),
    `Coucou ${echapper(p.nom)} ! C'est moi, ${mt.nom}.`,
    p.tickets ? `Tu as ${p.tickets} ticket${p.tickets > 1 ? 's' : ''} pour la salle de jeux !` : 'Gagne 2 étoiles dans un jeu pour avoir un ticket !',
    defiFait ? 'Bravo, tu as fait le défi du jour !' : 'Le défi du jour t\'attend !',
    p.pieces >= PRIX_OEUF ? 'Tu peux ouvrir un œuf surprise dans ton album !' : `Encore ${PRIX_OEUF - p.pieces} pièces pour un œuf surprise !`
  ]);
  afficher(`${p.avatar} ${p.nom}`, `
    <div class="mascotte">
      <div class="perso-maitresse">${dessinMaitresse(p.maitresse, 'normal')}</div>
      <div class="bulle"><b>${mt.nom}</b><br>${typo(bulle)}</div>
    </div>
    <div class="niveau">
      <b>Niveau ${niv}</b>
      <div class="barre-xp"><div style="width:${xpNiv}%"></div></div>
      <span>${p.serie.n > 1 ? `🔥 ${p.serie.n} jours de suite` : '🔥 1er jour'}</span>
    </div>
    <div class="grille portes">
      ${duJour || semaine.prevue ? `<button class="tuile journalier ${aFaire ? 'brille' : 'fait-jour'}" style="--c:#ff8a3d" data-porte="journalier"><span class="emoji">📝</span>Cours journalier<small>${aFaire ? (duJour.revision ? 'Révision de la semaine à faire' : 'À faire avant tout le reste !') : faitJour && !faitJour.dispense ? `✅ Fait : ${faitJour.note}/20` : 'Pas de cours aujourd\'hui'}${semaine.note !== null ? ` · semaine : ${noteFr(semaine.note)}/20` : ''} · 🎁 le cadeau</small></button>` : ''}
      <button class="tuile" style="--c:#4f8ef7" data-porte="apprendre"><span class="emoji">📚</span>Apprendre<small>Gagne des pièces 🪙 et des pattes 🐾</small></button>
      <button class="tuile ${defiFait ? 'fait' : 'brille'}" style="--c:#e5484d" data-porte="defi"><span class="emoji">🎯</span>Défi du jour<small>${defiFait ? 'Réussi ! Reviens demain' : '+2 🎟️ et +20 🪙'}</small></button>
      <button class="tuile" style="--c:#8e5cd9" data-porte="salle"><span class="emoji">🎮</span>Salle de jeux<small>${p.tickets} 🎟️</small></button>
      <button class="tuile" style="--c:#1fa5a5" data-porte="album"><span class="emoji">📒</span>Mon album<small>${nbAlbum} / ${ALBUM.length}</small></button>
      <button class="tuile ${alerte || !p.animal ? 'brille' : ''}" style="--c:${panda ? '#3a3a48' : '#233270'}" data-porte="animal"><span class="emoji">${panda ? '🐼' : '🐆'}</span>${p.animal ? echapper(p.animal.nom) : panda ? 'Mon panda' : 'Ma panthère'}<small>${!p.animal ? 'Viens l\'adopter !' : alerte && !p.animal.dort ? '📢 ' + echapper(alerte) : p.animal.dort ? 'Zzz… il dort' : '🐾 ' + (p.pattes || 0) + ' pattes'}</small></button>
    </div>`, { retour: true, profil: p });
  parler(bulle);
  if (aFaire) $ecran.querySelectorAll('[data-porte]:not([data-porte="journalier"])').forEach(b => {
    b.classList.add('verrou'); b.classList.remove('brille');
    b.querySelector('.emoji').textContent = '🔒';
    b.querySelector('small').textContent = 'Après ton cours journalier';
  });
  $ecran.querySelectorAll('[data-porte]').forEach(b => b.onclick = () => {
    const porte = b.dataset.porte;
    if (porte === 'journalier') return aller(() => ecranJournalier(p));
    if (coursObligatoire(p)) {
      son('faux'); b.classList.remove('faux'); void b.offsetWidth; b.classList.add('faux');
      const bu = $ecran.querySelector('.mascotte .bulle');
      if (bu) bu.innerHTML = `<b>${mt.nom}</b><br>${typo(phraseTravail)}`;
      taire(); parler(phraseTravail);
      return;
    }
    if (porte === 'apprendre') aller(() => matieres(p));
    if (porte === 'defi') { if (defiFait) { son('faux'); b.classList.add('faux'); setTimeout(() => b.classList.remove('faux'), 400); } else aller(() => partie(p, null, jeuDefi(p))); }
    if (porte === 'salle') aller(() => salleDeJeux(p));
    if (porte === 'album') aller(() => album(p));
    if (porte === 'animal') aller(() => ecranAnimal(p));
  });
}

function matieres(p) {
  const niv = NIVEAUX[p.niveau];
  afficher('📚 Apprendre', `
    <div class="choix-classe">
      <span>Ma classe :</span>
      ${CLASSES.map(c => `<button class="${c === p.niveau ? 'choisie' : ''} ${sansPoints(p, c) ? 'sans-points' : ''}" style="--c:${COULEUR_CLASSE[c]}" data-classe="${c}">${c}</button>`).join('')}
    </div>
    ${sansPoints(p) ? `<p class="astuce alerte-classe">⚠️ Tu es en ${p.classeReelle} : en ${p.niveau}, tu peux t'entraîner mais tu ne gagnes <b>aucun point</b> (ni pièces, ni pattes, ni étoiles), sauf en anglais.</p>` : ''}
    <p class="sous-titre">Choisis une matière</p>
    <div class="grille">
      ${niv.matieres.map((m, i) => {
        const total = m.jeux.length * 3, gagnees = m.jeux.reduce((a, j) => a + (p.scores[cleScore(p, m, j)] || 0), 0);
        const info = m.parcours ? `Palier ${palierActuel(p).num}` : `⭐ ${gagnees} / ${total}`;
        return `<button class="tuile" style="--c:${m.couleur}" data-i="${i}"><span class="emoji">${m.emoji}</span>${m.titre}<small>${info}</small></button>`;
      }).join('')}
    </div>`, { retour: true, profil: p });
  $ecran.querySelectorAll('[data-classe]').forEach(b => b.onclick = () => {
    const c = b.dataset.classe;
    if (c === p.niveau) return;
    son('tic');
    p.niveau = c; sauver();
    matieres(p);
    const ecart = rangClasse(p.classeReelle) - rangClasse(c);
    parler(sansPoints(p) ? `Attention ! En ${c}, tu peux t'entraîner, mais tu ne gagnes aucun point. C'est trop loin de ta classe.`
      : ecart === 1 ? `Tu révises le ${c}. Tu gagnes tes points normalement !` : `C'est parti pour le ${c} !`);
  });
  $ecran.querySelectorAll('.tuile').forEach(b => b.onclick = () => {
    const m = niv.matieres[b.dataset.i];
    if (niv.lecture) parler(m.titre);
    aller(() => listeJeux(p, m));
  });
}

function listeJeux(p, m) {
  if (m.parcours) return listeParcours(p, m);
  afficher(`${m.emoji} ${m.titre}`, `
    <p class="sous-titre">Choisis un jeu</p>
    <div class="grille">
      ${m.jeux.map((j, i) => {
        const best = p.scores[cleScore(p, m, j)] || 0;
        const verrou = m.progressif && i > 0 && !(p.scores[cleScore(p, m, m.jeux[i - 1])] >= 1);
        return verrou
          ? `<button class="tuile verrou" data-i="${i}" data-bloque="1"><span class="emoji">🔒</span>${j.titre}<small>Finis la leçon d'avant</small></button>`
          : `<button class="tuile" style="--c:${m.couleur}" data-i="${i}"><span class="emoji">${j.emoji}</span>${j.titre}<small>${'⭐'.repeat(best) + '☆'.repeat(3 - best)}</small></button>`;
      }).join('')}
    </div>`, { retour: true, profil: p });
  $ecran.querySelectorAll('.tuile').forEach(b => b.onclick = () => {
    if (b.dataset.bloque) { son('faux'); b.classList.remove('faux'); void b.offsetWidth; b.classList.add('faux'); parler('Termine d\'abord la leçon d\'avant !'); return; }
    const j = m.jeux[b.dataset.i];
    aller(() => j.lancer ? j.lancer(p, m, j) : partie(p, m, j)); // un jeu peut avoir son propre écran (la course du loup)
  });
}

// Le parcours d'anglais : des paliers de leçons, chacun fermé par une évaluation qui ouvre le suivant.
function palierActuel(p) {
  const P = PARCOURS_EN;
  return P.paliers.find(pal => !P.reussi(p, pal)) || P.paliers[P.paliers.length - 1];
}
function listeParcours(p, m) {
  const P = PARCOURS_EN, actuel = palierActuel(p);
  const tuile = j => {
    const best = p.scores[P.cle(j.id)] || 0, ok = j.evaluation && P.reussi(p, P.paliers[j.palier - 1]);
    if (!P.ouvert(p, j)) return `<button class="tuile verrou" data-id="${j.id}" data-bloque="1"><span class="emoji">🔒</span>${j.titre}<small>${j.evaluation ? 'Finis les leçons' : j === P.paliers[j.palier - 1].lecons[0] ? 'Réussis l\'évaluation d\'avant' : 'Finis la leçon d\'avant'}</small></button>`;
    const bas = j.evaluation ? (ok ? '✅ Réussie' : `${Math.round(P.seuil * 10)} sur 10 pour passer`) : '⭐'.repeat(best) + '☆'.repeat(3 - best);
    return `<button class="tuile ${j.evaluation && !ok ? 'brille' : ''}" style="--c:${j.evaluation ? '#e5484d' : m.couleur}" data-id="${j.id}"><span class="emoji">${j.emoji}</span>${j.titre}<small>${bas}</small></button>`;
  };
  let html = '', niveau = '';
  for (const pal of P.paliers) {
    if (pal.num > actuel.num + 1) break;  // on montre les paliers faits, l'actuel et le suivant (fermé)
    if (pal.niveau !== niveau) { niveau = pal.niveau; html += `<h2 class="niveau-en">${pal.niveauEmoji} Niveau ${niveau}</h2>`; }
    html += `<p class="sous-titre palier-en">${P.reussi(p, pal) ? '✅' : pal.emoji} Palier ${pal.num} : ${pal.titre}</p>
      <div class="grille">${[...pal.lecons, pal.evaluation].map(tuile).join('')}</div>`;
  }
  const reste = P.paliers.length - Math.min(P.paliers.length, actuel.num + 1);
  html += `<p class="astuce">${reste ? `Encore ${reste} palier${reste > 1 ? 's' : ''} après ceux-là, puis ` : 'Ensuite : '}${P.aVenir.map(([n, e]) => `${e} ${n}`).join(' · ')} (bientôt).</p>`;
  afficher(`${m.emoji} ${m.titre}`, `<p class="sous-titre">Réussis l'évaluation d'un palier pour ouvrir le suivant !</p>${html}`, { retour: true, profil: p });
  const parId = id => m.jeux.find(j => j.id === id);
  $ecran.querySelectorAll('.tuile').forEach(b => b.onclick = () => {
    const j = parId(b.dataset.id);
    if (b.dataset.bloque) { son('faux'); b.classList.remove('faux'); void b.offsetWidth; b.classList.add('faux'); parler(j.evaluation ? 'Finis d\'abord toutes les leçons du palier !' : j === P.paliers[j.palier - 1].lecons[0] ? 'Réussis d\'abord l\'évaluation du palier d\'avant !' : 'Termine d\'abord la leçon d\'avant !'); return; }
    aller(() => partie(p, m, j));
  });
}

// Le défi du jour : 10 questions tirées de toutes les matières de l'enfant.
function jeuDefi(p) {
  const tous = [];
  NIVEAUX[p.niveau].matieres.filter(m => !m.progressif).forEach(m => m.jeux.forEach(j => tous.push({ m, j })));
  // Anglais : seulement des mots déjà appris dans les leçons faites.
  const rev = typeof PARCOURS_EN !== 'undefined' && PARCOURS_EN.revision(p);
  if (rev) tous.push({ m: PARCOURS_EN.matiere, j: rev }, { m: PARCOURS_EN.matiere, j: rev });
  return { id: 'defi', titre: 'Défi du jour', emoji: '🎯', defi: true, gen: () => { const x = pioche(tous); const q = x.j.gen(); q.matiere = x.m; q.jeu = x.j; return q; } };
}

// Pour les jeux d'anglais : 2 fois (5 cartes « Nouveau mot », puis les 5 questions sur ces mots).
function sequenceAnglais(jeu) {
  const qs = [], deja = new Set();
  for (let essais = 0; qs.length < NB_QUESTIONS && essais < 200; essais++) {
    const q = jeu.gen();
    if (deja.has(cleQ(q)) || deja.has('b:' + q.bonne)) continue;
    deja.add(cleQ(q)); deja.add('b:' + q.bonne);
    qs.push(q);
  }
  const seq = [];
  for (let i = 0; i < qs.length; i += 5) {
    const groupe = qs.slice(i, i + 5);
    groupe.forEach(q => seq.push(carteApprendre(q)));
    melange(groupe).forEach(q => { q.indice = true; seq.push(q); });
  }
  return seq;
}
function carteApprendre(q) {
  const guillemets = /«\s*(.+?)\s*»/.exec(q.enonce);
  const dans = guillemets ? guillemets[1] : '';
  const lettres = s => /[a-z]/i.test(s);
  if (q.direEn && !lettres(q.bonne)) // écoute : image ou nombre
    return { type: 'decouvrir', visuel: q.bonne, sens: q.fr, enonce: q.direEn, dire: q.fr ? `${q.fr}, en anglais, ça se dit :` : 'Regarde bien. En anglais, on dit :', direEn: q.direEn };
  if (/^Comment dit-on/.test(q.enonce) && dans)
    return { type: 'decouvrir', visuel: q.visuel, sens: dans, enonce: q.bonne, dire: `${dans}, en anglais, ça se dit :`, direEn: q.bonne };
  if (/^Que veut dire/.test(q.enonce) && q.direEn)
    return { type: 'decouvrir', visuel: q.visuel, sens: q.bonne, enonce: q.direEn, dire: `${q.bonne}, en anglais, ça se dit :`, direEn: q.direEn };
  if (/réponse à/.test(q.enonce) && q.direEn)
    return { type: 'decouvrir', visuel: '💬', avant: `🇬🇧 ${q.direEn}`, enonce: q.bonne, dire: 'Quand on te demande :', direEn: q.direEn, apres: [['on répond :', 'fr-FR'], [q.bonne, 'en-GB']] };
  if (dans) // ex. « Quel jour vient après « Monday » ? » : partie française, mot anglais, puis la réponse
    return { type: 'decouvrir', visuel: q.visuel, avant: q.enonce, enonce: q.bonne, dire: q.enonce.split('«')[0], direEn: dans, apres: [['La réponse est :', 'fr-FR'], [q.bonne, 'en-GB']] };
  return { type: 'decouvrir', visuel: q.visuel, avant: q.enonce, enonce: q.bonne, dire: `${q.enonce} La réponse est :`, direEn: q.bonne };
}

function partie(p, m, jeu) {
  let n = 0, reussies = 0, combo = 0, meilleurCombo = 0;
  maitresseActive = p.maitresse;
  const mt = MAITRESSES[p.maitresse];
  const lecture = NIVEAUX[p.niveau].lecture;
  const deja = new Set();
  // Leçon : questions dans un ordre fixé. Jeux d'anglais : on apprend les mots avant de les demander.
  const seq = jeu.sequence ? jeu.sequence() : (m && m.id === 'anglais' && !jeu.defi) ? sequenceAnglais(jeu) : null;
  const TOTAL = seq ? seq.length : NB_QUESTIONS;
  const NOTEES = seq ? seq.filter(q => q.type !== 'decouvrir').length : NB_QUESTIONS; // les cartes « nouveau mot » ne comptent pas

  function suivante() {
    if (n >= TOTAL) return fin();
    let q, essais = 0;
    if (seq) q = seq[n];
    else do { q = jeu.gen(); } while (deja.has(cleQ(q)) && essais++ < 20);
    deja.add(cleQ(q));
    const mq = q.matiere || m;
    let premierEssai = true, erreurs = 0;
    const fiches = q.type === 'decouvrir' || q.type === 'parler' ? null : fichesCours(q, jeu, mq, q.niveau || p.niveau);
    const zone = q.type === 'lettres' ? zoneLettres(q) : q.type === 'saisie' ? zoneSaisie() : q.type === 'parler' ? zoneParler() : q.type === 'decouvrir' ? zoneDecouvrir() : `<div class="choix">${q.choix.map(c => `<button data-v="${echapper(c)}">${c}</button>`).join('')}</div>`;
    afficher(`${jeu.emoji} ${jeu.titre}`, `
      <div class="jeu">
        <div class="haut-jeu">
          <div class="progression"><div style="width:${n / TOTAL * 100}%"></div><span class="coureur" style="left:max(16px, ${n / TOTAL * 100}%)">${p.avatar}</span></div>
          <div class="combo ${combo >= 2 ? 'visible' : ''}">🔥 ×${combo}</div>
        </div>
        <div class="question entre avec-maitresse">
          ${fiches ? '<button class="aide-cours" aria-label="Petit cours : je ne comprends pas">?</button>' : ''}
          <div class="prof-coin">${dessinMaitresse(p.maitresse, 'normal')}<div class="bulle-prof"></div></div>
          ${jeu.defi ? `<div class="aide">${mq.emoji} ${mq.titre}</div>` : ''}
          ${q.type === 'decouvrir' ? `<div class="nouveau-mot">✨ ${/\s/.test(q.enonce.trim()) ? 'J\'apprends' : 'Nouveau mot'}</div>` : ''}
          <div class="visuel">${q.type === 'decouvrir' && q.visuel === '🇬🇧' ? '' : q.visuel || ''}</div>
          ${q.type === 'decouvrir' && (q.sens || q.avant) ? `<div class="mot-fr ${q.avant ? 'petit' : ''}">${q.avant ? typo(q.avant) : '🇫🇷 ' + echapper(q.sens)}</div><div class="fleche-mot">⬇</div>` : ''}
          <div class="enonce ${q.type === 'parler' || q.type === 'decouvrir' ? 'mot-anglais' : ''}">${q.type === 'decouvrir' && !q.avant ? '🇬🇧 ' : ''}${typo(q.enonce)}</div>
          ${q.sens && q.type !== 'decouvrir' ? `<div class="aide">🇫🇷 ${echapper(q.sens)}</div>` : ''}
          ${q.aide ? `<div class="aide">${q.aide}</div>` : ''}
          ${('speechSynthesis' in window) && q.type !== 'parler' && q.type !== 'decouvrir' ? '<button class="ecouter">🔊 Écouter</button>' : ''}
        </div>
        ${zone}
      </div>`, { retour: true, profil: p });
    const bc = $ecran.querySelector('.aide-cours');
    if (bc) bc.onclick = () => { son('tic'); ouvrirCours(p, fiches, lecture); };
    const ec = $ecran.querySelector('.ecouter');
    if (ec) ec.onclick = () => lireQuestion(q, !(lecture && mq.id === 'francais'));
    if (lecture || q.direEn || q.type === 'saisie') setTimeout(() => lireQuestion(q, false), 250);

    function reagit(humeur, texte, dire) {
      const coin = $ecran.querySelector('.prof-coin');
      if (!coin) return;
      coin.innerHTML = `${dessinMaitresse(p.maitresse, humeur)}<div class="bulle-prof visible">${typo(texte)}</div>`;
      coin.classList.remove('saute'); void coin.offsetWidth; coin.classList.add('saute');
      if (dire) { taire(); parler(texte); }
    }
    function gagne(el) {
      if (premierEssai) { reussies++; combo++; meilleurCombo = Math.max(meilleurCombo, combo); } else combo = 0;
      son(combo >= 3 && premierEssai ? 'bonus' : 'bon');
      reagit('contente', combo >= 3 && premierEssai ? `Waouh, ${combo} d'affilée !` : pioche(mt.bravo), false);
      if (el) confettis(el, premierEssai ? (combo >= 3 ? 26 : 14) : 6);
      if (premierEssai) {
        const c = $ecran.querySelector('.combo');
        c.textContent = `🔥 ×${combo}`; c.classList.toggle('visible', combo >= 2);
        if (el) texteVolant(el, combo >= 3 ? `Super ! ×${combo}` : pioche(['Bravo !', 'Oui !', 'Génial !', 'Top !']));
      }
      n++;
      setTimeout(suivante, 950);
    }
    function rate(el) {
      premierEssai = false; erreurs++; combo = 0;
      const c = $ecran.querySelector('.combo'); c.classList.remove('visible');
      son('faux');
      reagit('encourage', pioche(mt.oups), lecture);
      if (el) { el.classList.remove('faux'); void el.offsetWidth; el.classList.add('faux'); }
    }

    if (q.type === 'decouvrir') {
      const z = $ecran.querySelector('.decouvrir');
      z.querySelector('.encore').onclick = () => lireQuestion(q, false);
      z.querySelector('.compris').onclick = () => { taire(); son('tic'); n++; suivante(); };
    } else if (q.type === 'parler') {
      const zoneP = $ecran.querySelector('.parler');
      const info = zoneP.querySelector('.info-micro');
      const micro = zoneP.querySelector('.micro');
      let ecoute = null;
      const modele = () => { taire(); parler(q.direEn, 'en-GB'); };
      const sansMicro = texte => {
        info.innerHTML = texte;
        micro.hidden = true;
        zoneP.querySelector('.repete').hidden = false;
      };
      zoneP.querySelector('.ecoute-en').onclick = modele;
      zoneP.querySelector('.repete').onclick = () => gagne(zoneP.querySelector('.repete'));
      if (!Reco) sansMicro('Cet appareil ne peut pas écouter ta voix. Répète le mot à voix haute, puis touche le bouton vert.');
      micro.onclick = () => {
        if (ecoute) return;
        taire();
        micro.classList.add('actif'); micro.innerHTML = '👂 Je t\'écoute…';
        info.textContent = 'Dis le mot en anglais !';
        ecoute = ecouterEnfant(alts => {
          ecoute = null; micro.classList.remove('actif'); micro.innerHTML = '🎤 À toi !';
          const trouve = correspondAnglais(alts, q);
          if (trouve) {
            const c = trouve.c;
            const note = c === 0 || c >= 0.75 ? 'Super accent ! 🌟' : c >= 0.45 ? 'Bien dit ! Ton accent est presque parfait.' : 'C\'est ça ! Imite encore mieux la maîtresse.';
            info.innerHTML = `<b>${note}</b>`;
            micro.disabled = true;
            gagne(micro);
            reagit('contente', note.replace(' 🌟', ''), false);
            return;
          }
          info.innerHTML = alts.length ? `J'ai entendu : « ${echapper(alts[0].t)} ». Écoute encore et réessaie !` : 'Je n\'ai rien entendu. Parle un peu plus fort !';
          rate(micro);
          setTimeout(modele, 1200);
          if (erreurs >= 3) {
            info.innerHTML += '<br><button class="bouton second suivant">On continue ➜</button>';
            info.querySelector('.suivant').onclick = () => { n++; suivante(); };
          }
        }, err => {
          ecoute = null; micro.classList.remove('actif'); micro.innerHTML = '🎤 À toi !';
          if (err === 'not-allowed' || err === 'service-not-allowed') sansMicro('Le micro n\'est pas autorisé. Demande à un parent de l\'autoriser, ou répète le mot puis touche le bouton vert.');
          else if (err === 'network') sansMicro('Il faut internet pour vérifier ton accent. Répète le mot à voix haute, puis touche le bouton vert.');
          else if (err === 'no-speech' || err === 'aborted') info.textContent = 'Je n\'ai rien entendu. Touche le micro et parle !';
          else sansMicro('Le micro ne marche pas. Répète le mot à voix haute, puis touche le bouton vert.');
        });
      };
      nettoyage = () => { if (ecoute) try { ecoute.abort(); } catch (e) {} };
    } else if (q.type === 'lettres') {
      const cible = [...q.bonne];
      let pos = 0;
      const cases = $ecran.querySelectorAll('.mot span');
      $ecran.querySelectorAll('.tuiles button').forEach(b => b.onclick = () => {
        if (b.dataset.l === cible[pos]) {
          cases[pos].textContent = cible[pos]; cases[pos].classList.add('plein');
          b.disabled = true; b.classList.add('utilise');
          pos++;
          if (pos === cible.length) { const mot = $ecran.querySelector('.mot'); mot.classList.add('bon'); gagne(mot); }
          else son('tic');
        } else rate(b);
      });
    } else if (q.type === 'saisie') {
      const champ = $ecran.querySelector('.saisie input');
      const valider = () => {
        if (!champ.value.trim()) return;
        const ok = [q.bonne, ...(q.accepte || [])].some(r => normaliser(r) === normaliser(champ.value));
        if (ok) { champ.classList.add('bon'); champ.disabled = true; gagne(champ); return; }
        rate(champ);
        if (erreurs >= 2) {
          champ.disabled = true;
          $ecran.querySelector('.saisie').innerHTML = `<div class="correction">La bonne réponse : <b>${echapper(q.bonne)}</b></div><button class="bouton">Continuer ➜</button>`;
          $ecran.querySelector('.saisie .bouton').onclick = () => { n++; suivante(); };
        } else champ.select();
      };
      $ecran.querySelector('.saisie .bouton').onclick = valider;
      champ.onkeydown = e => { if (e.key === 'Enter') valider(); };
      setTimeout(() => champ.focus(), 300);
    } else {
      $ecran.querySelectorAll('.choix button').forEach(b => b.onclick = () => {
        if (b.dataset.v === q.bonne) {
          b.classList.add('bon');
          $ecran.querySelectorAll('.choix button').forEach(x => x.disabled = true);
          gagne(b);
        } else {
          rate();
          b.classList.add('faux'); b.disabled = true;
          if (q.indice) {
            // Leçon d'anglais : on montre la bonne réponse et on réécoute le mot.
            const bon = [...$ecran.querySelectorAll('.choix button')].find(x => x.dataset.v === q.bonne);
            if (bon) bon.classList.add('indice');
            if (q.direEn) setTimeout(() => { taire(); parler(q.direEn, 'en-GB'); }, 900);
          }
        }
      });
    }
  }

  function fin() {
    const sur10 = reussies * 10 / NOTEES;
    const nbEt = sur10 >= 9 ? 3 : sur10 >= 6 ? 2 : sur10 >= 3 ? 1 : 0;
    const avantNiveau = niveauDe(p), avantEtoiles = m ? (p.scores[cleScore(p, m, jeu)] || 0) : 0;
    // Classe choisie trop basse (2 ans ou plus sous la vraie classe) : rien n'est gagné ni enregistré.
    const bloque = sansPoints(p) && !(m && m.parcours) && !jeu.journalier; // cours journalier : notions de sa vraie classe // le parcours d'anglais ne dépend pas de la classe
    // Évaluation d'anglais : 8 sur 10 pour réussir le palier et ouvrir le suivant.
    const evalOk = jeu.evaluation && reussies >= Math.ceil(PARCOURS_EN.seuil * NOTEES);
    let pieces = 0, tickets = 0, pattes = 0;
    if (!bloque) {
      pieces = reussies + (nbEt === 3 ? 5 : 0) + (meilleurCombo >= 5 ? 3 : 0);
      tickets = nbEt >= 2 ? 1 : 0;
      if (jeu.defi && nbEt >= 1) { pieces += 20; tickets += 2; p.defi = aujourdhui(); }
      if (m) {
        if (nbEt > avantEtoiles) pieces += (nbEt - avantEtoiles) * 2; // bonus la première fois qu'on gagne une étoile
        p.scores[cleScore(p, m, jeu)] = Math.max(avantEtoiles, nbEt);
        if (evalOk) p.scores[cleScore(p, m, jeu) + ':ok'] = 1;
      }
      p.etoiles += nbEt; p.pieces += pieces; p.tickets += tickets;
      pattes = gagnerPattes(p, reussies, nbEt, jeu.defi);
      p.xp += reussies * 10;
    }
    const monte = niveauDe(p) > avantNiveau;
    if (monte) p.tickets += 1;
    sauver();
    if (jeu.journalier) return finJournalier(p, jeu, reussies, NOTEES, { pieces, pattes, tickets: tickets + (monte ? 1 : 0) });
    const msg = jeu.evaluation ? (evalOk ? 'Bravo, palier réussi ! Le palier suivant est ouvert.' : `Il faut ${Math.ceil(PARCOURS_EN.seuil * NOTEES)} bonnes réponses sur ${NOTEES}. Refais les leçons, puis réessaie !`) : bloque ? `Bien entraîné ! Mais en ${p.niveau}, c'est trop loin de ta classe : tu ne gagnes pas de points.` : jeu.defi && nbEt === 0 ? 'Presque ! Il faut 3 bonnes réponses pour réussir le défi.' : nbEt === 3 ? 'Bravo, c\'est parfait !' : nbEt === 2 ? 'Très bien joué !' : nbEt === 1 ? 'C\'est bien, continue !' : 'On réessaie ensemble ?';
    afficher(`${jeu.emoji} ${jeu.titre}`, `
      <div class="bravo">
        <div class="fin-maitresse">${dessinMaitresse(p.maitresse, nbEt ? 'contente' : 'encourage')}</div>
        <div class="gros">${nbEt ? [1, 2, 3].map(i => `<span class="etoile ${i <= nbEt ? 'pleine' : ''}" style="animation-delay:${i * .25}s">⭐</span>`).join('') : '💪'}</div>
        <p>${msg}<br><small>${reussies} bonnes réponses du premier coup sur ${NOTEES}${meilleurCombo >= 3 ? ` · meilleure série 🔥 ${meilleurCombo}` : ''}</small></p>
        ${bloque ? `<p class="astuce alerte-classe">Tu es en ${p.classeReelle} : en ${p.niveau}, aucun point n'est gagné. Choisis ta classe ou celle juste en dessous pour gagner des pièces, des pattes et des étoiles !</p>` : ''}
        <div class="gains" ${bloque ? 'style="display:none"' : ''}>
          <div class="gain">🪙 <b>+${pieces}</b></div>
          ${pattes ? `<div class="gain">🐾 <b>+${pattes}</b></div>` : ''}
          ${tickets ? `<div class="gain">🎟️ <b>+${tickets}</b></div>` : ''}
          ${monte ? `<div class="gain niveau-up">🆙 Niveau ${niveauDe(p)} ! <b>+1 🎟️</b></div>` : ''}
        </div>
        ${p.animal && reussies && !bloque ? `<p class="astuce">${p.animal.espece === 'panda' ? '🐼' : '🐆'} ${echapper(p.animal.nom)} grandit : +${reussies * 10} XP</p>` : ''}
        ${!tickets && !jeu.defi && !bloque ? '<p class="astuce">Avec 2 étoiles ⭐⭐, tu gagnes un ticket 🎟️ pour la salle de jeux !</p>' : ''}
        <div>
          ${jeu.defi ? '' : '<button class="bouton" id="rejouer">🔁 Rejouer</button>'}
          ${p.tickets ? '<button class="bouton violet" id="salle">🎮 Salle de jeux</button>' : ''}
          <button class="bouton second" id="autre">${jeu.defi ? 'Retour' : 'Autre jeu'}</button>
        </div>
      </div>`, { retour: true, profil: p });
    if (nbEt) { son('bonus'); setTimeout(() => confettis(document.querySelector('.bravo .gros'), 40), 300); }
    parler(msg + (monte ? ` Tu passes au niveau ${niveauDe(p)} !` : ''));
    const rj = document.getElementById('rejouer');
    if (rj) rj.onclick = () => partie(p, m, jeu);
    const sl = document.getElementById('salle');
    if (sl) sl.onclick = () => aller(() => salleDeJeux(p));
    document.getElementById('autre').onclick = () => $retour.onclick();
  }

  suivante();
}

/* ---------- Salle de jeux : les mini-jeux récompenses ---------- */
function salleDeJeux(p) {
  const jour = aujourdhui();
  if (p.jeuxDuJour.jour !== jour) p.jeuxDuJour = { jour, n: 0 };
  const limite = donnees.limiteMiniJeux, reste = limite ? Math.max(0, limite - p.jeuxDuJour.n) : Infinity;
  const jeux = typeof MINIJEUX !== 'undefined' ? MINIJEUX : [];
  afficher('🎮 Salle de jeux', `
    <p class="sous-titre">${p.tickets ? `Tu as <b>${p.tickets} 🎟️</b>. Une partie coûte 1 ticket.` : 'Tu n\'as plus de ticket 🎟️. Réussis un jeu avec 2 étoiles pour en gagner !'}</p>
    ${reste === 0 ? '<p class="astuce">C\'est fini pour aujourd\'hui ! Reviens demain pour rejouer 😊</p>' : ''}
    <div class="grille">
      ${jeux.map((j, i) => `<button class="tuile" style="--c:${['#8e5cd9', '#ff8a3d', '#3bb273', '#1fa5a5', '#e5484d'][i % 5]}" data-i="${i}" ${!p.tickets || reste === 0 ? 'data-bloque="1"' : ''}>
        <span class="emoji">${j.emoji}</span>${j.titre}<small>${j.description}</small><small>🏆 Record : ${p.records[j.id] || 0}</small></button>`).join('')}
    </div>
    ${!p.tickets ? '<p style="text-align:center"><button class="bouton" id="apprendre">📚 Gagner des tickets</button></p>' : ''}`, { retour: true, profil: p });
  if (NIVEAUX[p.niveau].lecture) parler(p.tickets ? 'Choisis un jeu !' : 'Tu n\'as plus de ticket. Réussis un jeu avec deux étoiles pour en gagner !');
  const ap = document.getElementById('apprendre');
  if (ap) ap.onclick = () => aller(() => matieres(p));
  $ecran.querySelectorAll('.tuile').forEach(b => b.onclick = () => {
    if (b.dataset.bloque) { son('faux'); b.classList.remove('faux'); void b.offsetWidth; b.classList.add('faux'); return; }
    p.tickets--; p.jeuxDuJour.n++; sauver();
    aller(() => miniJeu(p, jeux[b.dataset.i]));
  });
}

function miniJeu(p, j) {
  afficher(`${j.emoji} ${j.titre}`, '<div class="zone-minijeu"></div>', { retour: true, profil: p, classe: 'plein-ecran' });
  const zone = $ecran.querySelector('.zone-minijeu');
  const hauteur = Math.max(260, Math.round(window.innerHeight - $ecran.getBoundingClientRect().top - 12));
  zone.style.height = hauteur + 'px';
  let arret = null;
  arret = j.lancer(zone, { niveau: p.niveau, son, hauteur, duree: window.__dureeTest }, score => {
    nettoyage = null;
    arret && arret();
    score = Math.max(0, Math.round(score || 0));
    const record = score > (p.records[j.id] || 0);
    if (record) p.records[j.id] = score;
    const pieces = Math.min(10, Math.floor(score / 5));
    p.pieces += pieces;
    sauver();
    afficher(`${j.emoji} ${j.titre}`, `
      <div class="bravo">
        <div class="gros">${record ? '🏆' : '🎉'}</div>
        <p>${record ? 'Nouveau record !' : 'Bien joué !'}<br>Score : <b>${score}</b></p>
        ${pieces ? `<div class="gains"><div class="gain">🪙 <b>+${pieces}</b></div></div>` : ''}
        <div>
          ${p.tickets ? `<button class="bouton violet" id="encore">🎟️ Rejouer (${p.tickets} ticket${p.tickets > 1 ? 's' : ''})</button>` : ''}
          <button class="bouton second" id="autre">Retour</button>
        </div>
      </div>`, { retour: true, profil: p });
    if (record) { son('bonus'); confettis(document.querySelector('.bravo .gros'), 40); }
    const enc = document.getElementById('encore');
    if (enc) enc.onclick = () => { p.tickets--; p.jeuxDuJour.n++; sauver(); miniJeu(p, j); };
    document.getElementById('autre').onclick = () => $retour.onclick();
  });
  nettoyage = () => arret && arret();
}

/* ---------- Album d'autocollants ---------- */
function album(p) {
  const nb = Object.keys(p.album).length;
  afficher('📒 Mon album', `
    <div class="oeuf-zone">
      <button class="oeuf ${p.pieces >= PRIX_OEUF ? 'pret' : ''}" id="oeuf">🥚</button>
      <div>
        <b>Œuf surprise : ${PRIX_OEUF} 🪙</b><br>
        <small>${p.pieces >= PRIX_OEUF ? 'Touche l\'œuf pour l\'ouvrir !' : `Il te manque ${PRIX_OEUF - p.pieces} pièces. Joue pour en gagner !`}</small>
      </div>
    </div>
    <p class="sous-titre">${nb} / ${ALBUM.length} autocollants</p>
    <div class="album">
      ${ALBUM.map(s => p.album[s.id] ? `<div class="colle ${s.rarete === 'commun' ? '' : s.rarete === 'rare' ? 'rare' : 'legende'}">${s.e}${p.album[s.id] > 1 ? `<i>×${p.album[s.id]}</i>` : ''}</div>` : `<div class="colle vide ${s.rarete === 'commun' ? '' : s.rarete === 'rare' ? 'rare' : 'legende'}">?</div>`).join('')}
    </div>
    <p class="astuce">Les cases dorées sont rares ✨, les violettes sont légendaires 👑</p>`, { retour: true, profil: p });
  document.getElementById('oeuf').onclick = () => {
    if (p.pieces < PRIX_OEUF) { son('faux'); const o = document.getElementById('oeuf'); o.classList.remove('faux'); void o.offsetWidth; o.classList.add('faux'); return; }
    p.pieces -= PRIX_OEUF;
    const r = Math.random();
    const rarete = r < CHANCES['légendaire'] ? 'légendaire' : r < CHANCES['légendaire'] + CHANCES.rare ? 'rare' : 'commun';
    const s = pioche(ALBUM.filter(x => x.rarete === rarete));
    const doublon = !!p.album[s.id];
    p.album[s.id] = (p.album[s.id] || 0) + 1;
    if (doublon) p.pieces += 3;
    sauver();
    ouvertureOeuf(p, s, doublon);
  };
}

function ouvertureOeuf(p, s, doublon) {
  afficher('📒 Mon album', `
    <div class="bravo">
      <div class="gros oeuf-casse">🥚</div>
      <p id="revele">&nbsp;</p>
    </div>`, { retour: true, profil: p });
  son('tic');
  const o = document.querySelector('.oeuf-casse');
  setTimeout(() => son('tic'), 400);
  setTimeout(() => {
    o.textContent = s.e; o.classList.add('apparait', s.rarete === 'commun' ? 'x' : s.rarete === 'rare' ? 'rare' : 'legende');
    son('bonus'); confettis(o, s.rarete === 'commun' ? 25 : 60);
    const txt = s.rarete === 'légendaire' ? 'LÉGENDAIRE !!!' : s.rarete === 'rare' ? 'Un autocollant rare !' : 'Nouvel autocollant !';
    document.getElementById('revele').innerHTML = doublon
      ? 'Tu l\'avais déjà ! Tu récupères 3 🪙'
      : `${txt}<br><button class="bouton" id="coller">📒 Le coller dans l'album</button>`;
    const c = document.getElementById('coller');
    if (c) c.onclick = () => album(p);
    if (doublon) setTimeout(() => { if (document.getElementById('revele')) album(p); }, 2000);
    if (NIVEAUX[p.niveau].lecture) parler(doublon ? 'Tu l\'avais déjà ! Tu récupères trois pièces.' : txt);
  }, 1200);
}

/* ---------- Effets : confettis et petits textes ---------- */
function confettis(el, nb = 16) {
  if (!el) return;
  const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const couleurs = ['#ff8a3d', '#3bb273', '#4f8ef7', '#e5484d', '#ffd23f', '#8e5cd9'];
  for (let i = 0; i < nb; i++) {
    const c = document.createElement('i');
    c.className = 'confetti';
    const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 140;
    c.style.cssText = `left:${cx}px;top:${cy}px;background:${pioche(couleurs)};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 60}px;--r:${Math.random() * 720}deg`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1000);
  }
}
function texteVolant(el, texte) {
  const r = el.getBoundingClientRect();
  const t = document.createElement('div');
  t.className = 'texte-volant'; t.textContent = texte;
  t.style.left = (r.left + r.width / 2) + 'px'; t.style.top = r.top + 'px';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1000);
}

/* ---------- Espace parents ---------- */
function espaceParents() {
  const a = alea(3, 9), b = alea(3, 9);
  afficher('Espace parents', `
    <div class="parent">
      <p class="sous-titre">Pour les grands : combien font ${a} × ${b} ?</p>
      <input id="verrou" inputmode="numeric" autocomplete="off">
      <p style="text-align:center"><button class="bouton" id="ok">Entrer</button></p>
    </div>`, { retour: true });
  document.getElementById('ok').onclick = () => {
    if (parseInt(document.getElementById('verrou').value, 10) === a * b) reglages();
    else document.getElementById('verrou').value = '';
  };
}

function reglages() {
  const AVATARS = ['🦊', '🐻', '🐼', '🐯', '🦄', '🐸', '🐵', '🐱', '🐶', '🐰', '🦁', '🐧'];
  afficher('Espace parents', `
    <div class="parent">
      <h2>🎮 Mini-jeux</h2>
      <label>Nombre maximum de parties de mini-jeux par jour et par enfant</label>
      <select id="limite" style="font-size:22px;padding:8px;border-radius:12px">
        ${[3, 5, 10, 20, 0].map(v => `<option value="${v}" ${v === donnees.limiteMiniJeux ? 'selected' : ''}>${v || 'Sans limite'}</option>`).join('')}
      </select>
      <p style="font-size:16px;color:#7a7066">Les tickets 🎟️ se gagnent seulement en réussissant les exercices (2 étoiles ou plus, défi du jour, nouveau niveau).<br>Les pattes 🐾 de la boutique de l'animal se gagnent seulement avec les exercices (2 par bonne réponse, 3 par étoile, 10 pour le défi).<br>Classes : l'enfant peut jouer dans n'importe quelle classe. Dans sa vraie classe, au-dessus, ou une classe en dessous, il gagne ses points normalement ; deux classes ou plus en dessous, il ne gagne rien.</p>
      <hr style="margin:30px 0">
      ${donnees.profils.map((p, i) => `
        <h2>${p.avatar} Profil ${i + 1} · Niveau ${niveauDe(p)} · 🪙 ${p.pieces} · 🎟️ ${p.tickets} · 🐾 ${p.pattes || 0}</h2>
        <label>Prénom</label><input data-i="${i}" data-k="nom" value="${echapper(p.nom)}">
        <label>Vraie classe à l'école</label>
        <select data-i="${i}" data-k="classeReelle" style="font-size:22px;padding:8px;border-radius:12px">
          ${CLASSES.map(n => `<option ${n === p.classeReelle ? 'selected' : ''}>${n}</option>`).join('')}
        </select>
        <label>Classe choisie pour jouer (l'enfant peut aussi la changer dans « Apprendre »)</label>
        <select data-i="${i}" data-k="niveau" style="font-size:22px;padding:8px;border-radius:12px">
          ${CLASSES.map(n => `<option value="${n}" ${n === p.niveau ? 'selected' : ''}>${n}${sansPoints(p, n) ? ' (sans points)' : ''}</option>`).join('')}
        </select>
        <label>Maîtresse</label>
        <select data-i="${i}" data-k="maitresse" style="font-size:22px;padding:8px;border-radius:12px">
          ${Object.entries(MAITRESSES).map(([k, m]) => `<option value="${k}" ${k === p.maitresse ? 'selected' : ''}>${m.nom} (${m.animal})</option>`).join('')}
        </select>
        <label>Avatar</label>
        <div>${AVATARS.map(av => `<button class="rond" style="margin:4px;${av === p.avatar ? 'outline:4px solid #ff8a3d' : ''}" data-i="${i}" data-av="${av}">${av}</button>`).join('')}</div>
        ${reglagesJournalier(p, i)}
        <table><tr><th>Jeu</th><th>Meilleur score</th></tr>
          ${Object.entries(p.scores).map(([k, s]) => `<tr><td>${nomJeu(k)}</td><td>${'⭐'.repeat(s) || '–'}</td></tr>`).join('') || '<tr><td colspan="2">Pas encore de partie jouée.</td></tr>'}
        </table>`).join('<hr style="margin:30px 0">')}
      <p style="text-align:center;margin-top:30px"><button class="bouton" id="fini">✔ Terminé</button></p>
    </div>`, { retour: true });
  document.getElementById('limite').onchange = e => { donnees.limiteMiniJeux = parseInt(e.target.value, 10); sauver(); };
  $ecran.querySelectorAll('input[data-i],select[data-i]').forEach(el => el.onchange = () => { donnees.profils[el.dataset.i][el.dataset.k] = el.value.trim() || donnees.profils[el.dataset.i][el.dataset.k]; sauver(); if (el.dataset.k === 'classeReelle') reglages(); });
  $ecran.querySelectorAll('[data-av]').forEach(b => b.onclick = () => { donnees.profils[b.dataset.i].avatar = b.dataset.av; sauver(); reglages(); });
  lierReglagesJournalier(() => { const y = window.scrollY; reglages(); window.scrollTo(0, y); });
  document.getElementById('fini').onclick = accueil;
}

function nomJeu(cle) {
  const [niv, reste] = cle.includes(':') ? cle.split(':') : ['', cle];
  const [mid, jid] = reste.split('/');
  for (const n of niv && NIVEAUX[niv] ? [NIVEAUX[niv]] : Object.values(NIVEAUX)) {
    const m = n.matieres.find(x => x.id === mid); const j = m && m.jeux.find(x => x.id === jid);
    if (j) return `${niv ? niv + ' · ' : ''}${m.titre} · ${j.titre}`;
  }
  return cle;
}
function cleQ(q) { return (q.enonce || '') + (q.visuel || '') + (q.bonne || ''); }
function normaliser(s) { return String(s).trim().toLowerCase().replace(/[’`]/g, "'").replace(/\s+/g, ' ').replace(/[\s.!?]+$/, ''); }
function zoneLettres(q) {
  const lettres = melange([...q.bonne]);
  return `<div class="mot">${[...q.bonne].map(() => '<span></span>').join('')}</div>
    <div class="tuiles">${lettres.map(l => `<button data-l="${echapper(l)}">${l}</button>`).join('')}</div>`;
}
function zoneDecouvrir() {
  return `<div class="decouvrir boutons-parler"><button class="bouton violet encore">🔊 Encore</button><button class="bouton compris">J'ai compris ➜</button></div>`;
}
function zoneParler() {
  return `<div class="parler">
    <div class="boutons-parler"><button class="bouton violet ecoute-en">🔊 Écouter</button><button class="bouton micro">🎤 À toi !</button><button class="bouton repete" hidden>✔ J'ai répété</button></div>
    <div class="info-micro">Écoute, puis touche le micro et répète !</div>
  </div>`;
}
// Reconnaissance vocale (Chrome sur Android) pour vérifier la prononciation.
const Reco = window.SpeechRecognition || window.webkitSpeechRecognition;
function ecouterEnfant(ok, erreur) {
  const r = new Reco();
  r.lang = 'en-GB'; r.maxAlternatives = 5; r.interimResults = false; r.continuous = false;
  let fini = false;
  r.onresult = e => { fini = true; ok([...e.results[0]].map(a => ({ t: a.transcript, c: a.confidence || 0 }))); };
  r.onerror = e => { fini = true; erreur(e.error); };
  r.onend = () => { if (!fini) { fini = true; ok([]); } };
  try { r.start(); } catch (e) { erreur('start'); }
  return r;
}
function normEn(s) {
  return String(s).toLowerCase().replace(/[’`]/g, "'").replace(/\bi'm\b/g, 'i am').replace(/\bwhat's\b/g, 'what is').replace(/-/g, ' ').replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();
}
function correspondAnglais(alts, q) {
  const cibles = [q.bonne, ...(q.accepte || [])].map(normEn);
  for (const a of alts) {
    const t = ' ' + normEn(a.t) + ' ';
    if (cibles.some(c => t.includes(' ' + c + ' '))) return a;
  }
  return null;
}
function zoneSaisie() {
  return `<div class="saisie"><input autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Écris ici"><button class="bouton">Valider</button></div>`;
}
function typo(s) { return s.replace(/ ([?!:»])/g, ' $1').replace(/« /g, '« '); }
function echapper(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

/* ---------- Petits sons (sans fichier) ---------- */
let audio;
const SONS = {
  bon: { notes: [523, 659, 784], type: 'triangle', pas: 0.1 },
  faux: { notes: [220, 180], type: 'sawtooth', pas: 0.1 },
  bonus: { notes: [523, 659, 784, 1047, 1319], type: 'triangle', pas: 0.08 },
  tic: { notes: [880], type: 'sine', pas: 0.05 },
  piece: { notes: [988, 1319], type: 'square', pas: 0.07 },
  croque: { notes: [180, 140, 90], type: 'sawtooth', pas: 0.12 }
};
function son(type) {
  if (type === true) type = 'bon';
  if (type === false) type = 'faux';
  const s = SONS[type] || SONS.tic;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    s.notes.forEach((f, i) => {
      const o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime + i * s.pas;
      o.frequency.value = f; o.type = s.type;
      g.gain.setValueAtTime(type === 'piece' ? 0.06 : 0.15, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      o.connect(g).connect(audio.destination);
      o.start(t); o.stop(t + 0.3);
    });
  } catch (e) {}
}

if ('speechSynthesis' in window) speechSynthesis.getVoices();
accueil();
