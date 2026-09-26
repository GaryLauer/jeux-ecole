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
let nettoyage = null; // fonction à appeler en quittant un écran (mini-jeu en cours…)

/* ---------- Autocollants de l'album ---------- */
const ALBUM = [
  ...['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
    '🦉', '🐴', '🐝', '🐛', '🦋', '🐌', '🐞', '🐢', '🐍', '🐙', '🦀', '🐠', '🐬', '🐳', '🦒', '🦓', '🐘', '🦔', '🐿️', '🦘'].map(e => ({ e, rarete: 'commun' })),
  ...['🦄', '🐉', '🦕', '🦖', '🦩', '🦚', '🦜', '🐆', '🦭', '🐻‍❄️', '🦥', '🦦', '🐊', '🦈', '🦙'].map(e => ({ e, rarete: 'rare' })),
  ...['👑', '🌈', '🚀', '💎', '🏆'].map(e => ({ e, rarete: 'légendaire' }))
].map((s, i) => ({ ...s, id: 'a' + i }));
const CHANCES = { commun: 0.75, rare: 0.21, 'légendaire': 0.04 };

function nouveauProfil(id, nom, niveau, avatar) {
  return { id, nom, niveau, avatar, etoiles: 0, scores: {}, pieces: 0, tickets: 1, xp: 0, album: {}, records: {}, serie: { jour: '', n: 0 }, defi: '', jeuxDuJour: { jour: '', n: 0 } };
}
function charger() {
  let d;
  try { d = JSON.parse(localStorage.getItem(CLE)); } catch (e) {}
  if (!d || !d.profils) d = { profils: [nouveauProfil('p1', 'Mon grand', 'CM1', '🦊'), nouveauProfil('p2', 'Mon petit', 'CP', '🐻')] };
  // Ajoute les champs des nouvelles versions aux anciens profils.
  d.profils = d.profils.map(p => ({ ...nouveauProfil(p.id, p.nom, p.niveau, p.avatar), ...p }));
  if (d.limiteMiniJeux === undefined) d.limiteMiniJeux = 5;
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

/* ---------- Voix ---------- */
function parler(texte, lang = 'fr-FR', suite) {
  if (!('speechSynthesis' in window) || !texte) { suite && suite(); return; }
  const u = new SpeechSynthesisUtterance(texte.replace(/<[^>]+>/g, ' ').replace(/_+/g, ' blanc '));
  u.lang = lang; u.rate = lang === 'fr-FR' ? 0.95 : 0.8;
  const voix = speechSynthesis.getVoices().find(v => v.lang && v.lang.replace('_', '-').startsWith(lang.slice(0, 2)));
  if (voix) u.voice = voix;
  if (suite) u.onend = suite;
  speechSynthesis.speak(u);
}
function lireQuestion(q, avecChoix) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const choixLisibles = avecChoix && q.choix && q.choix.every(c => /[a-zà-ÿ0-9]/i.test(c));
  parler(q.dire || q.enonce, 'fr-FR', () => {
    if (q.direEn) parler(q.direEn, 'en-GB');
    else if (choixLisibles) parler(q.choix.join(', ou, '));
  });
}
function taire() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }

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
}
function quitter() { if (nettoyage) { const f = nettoyage; nettoyage = null; f(); } taire(); }
function aller(fn) { quitter(); pile.push(ecranActuel); ecranActuel = fn; fn(); }
let ecranActuel = accueil;
$retour.onclick = () => { quitter(); ecranActuel = pile.pop() || accueil; ecranActuel(); };

function accueil() {
  quitter();
  pile = [];
  ecranActuel = accueil;
  afficher('Mes Petits Jeux d\'École', `
    <p class="sous-titre">Qui joue aujourd'hui ?</p>
    <div class="grille">
      ${donnees.profils.map((p, i) => `
        <button class="tuile profil" style="--c:${p.niveau === 'CP' ? '#ff8a3d' : '#4f8ef7'}" data-i="${i}">
          <span class="emoji rebond">${p.avatar}</span>${echapper(p.nom)}<small>${p.niveau} · Niveau ${niveauDe(p)} · 🪙 ${p.pieces}</small>
        </button>`).join('')}
    </div>
    <button class="lien" id="parents">Espace parents</button>`);
  $ecran.querySelectorAll('.profil').forEach(b => b.onclick = () => aller(() => maison(donnees.profils[b.dataset.i])));
  document.getElementById('parents').onclick = () => aller(espaceParents);
}

// L'écran d'accueil d'un enfant : sa mascotte, son niveau, et les 4 grandes portes.
function maison(p) {
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
  const bulle = pioche([
    `Coucou ${echapper(p.nom)} ! On joue ?`,
    p.tickets ? `Tu as ${p.tickets} ticket${p.tickets > 1 ? 's' : ''} pour la salle de jeux !` : 'Gagne 2 étoiles dans un jeu pour avoir un ticket !',
    defiFait ? 'Bravo, tu as fait le défi du jour !' : 'Le défi du jour t\'attend !',
    p.pieces >= PRIX_OEUF ? 'Tu peux ouvrir un œuf surprise dans ton album !' : `Encore ${PRIX_OEUF - p.pieces} pièces pour un œuf surprise !`
  ]);
  afficher(`${p.avatar} ${p.nom}`, `
    <div class="mascotte">
      <div class="perso rebond">${p.avatar}</div>
      <div class="bulle">${bulle}</div>
    </div>
    <div class="niveau">
      <b>Niveau ${niv}</b>
      <div class="barre-xp"><div style="width:${xpNiv}%"></div></div>
      <span>${p.serie.n > 1 ? `🔥 ${p.serie.n} jours de suite` : '🔥 1er jour'}</span>
    </div>
    <div class="grille portes">
      <button class="tuile" style="--c:#4f8ef7" data-porte="apprendre"><span class="emoji">📚</span>Apprendre<small>Gagne des pièces 🪙</small></button>
      <button class="tuile ${defiFait ? 'fait' : 'brille'}" style="--c:#e5484d" data-porte="defi"><span class="emoji">🎯</span>Défi du jour<small>${defiFait ? 'Réussi ! Reviens demain' : '+2 🎟️ et +20 🪙'}</small></button>
      <button class="tuile" style="--c:#8e5cd9" data-porte="salle"><span class="emoji">🎮</span>Salle de jeux<small>${p.tickets} 🎟️</small></button>
      <button class="tuile" style="--c:#1fa5a5" data-porte="album"><span class="emoji">📒</span>Mon album<small>${nbAlbum} / ${ALBUM.length}</small></button>
    </div>`, { retour: true, profil: p });
  if (lecture) parler(bulle);
  $ecran.querySelectorAll('[data-porte]').forEach(b => b.onclick = () => {
    const porte = b.dataset.porte;
    if (porte === 'apprendre') aller(() => matieres(p));
    if (porte === 'defi') { if (defiFait) { son('faux'); b.classList.add('faux'); setTimeout(() => b.classList.remove('faux'), 400); } else aller(() => partie(p, null, jeuDefi(p))); }
    if (porte === 'salle') aller(() => salleDeJeux(p));
    if (porte === 'album') aller(() => album(p));
  });
}

function matieres(p) {
  const niv = NIVEAUX[p.niveau];
  afficher('📚 Apprendre', `
    <p class="sous-titre">Choisis une matière</p>
    <div class="grille">
      ${niv.matieres.map((m, i) => {
        const total = m.jeux.length * 3, gagnees = m.jeux.reduce((a, j) => a + (p.scores[`${m.id}/${j.id}`] || 0), 0);
        return `<button class="tuile" style="--c:${m.couleur}" data-i="${i}"><span class="emoji">${m.emoji}</span>${m.titre}<small>⭐ ${gagnees} / ${total}</small></button>`;
      }).join('')}
    </div>`, { retour: true, profil: p });
  $ecran.querySelectorAll('.tuile').forEach(b => b.onclick = () => {
    const m = niv.matieres[b.dataset.i];
    if (niv.lecture) parler(m.titre);
    aller(() => listeJeux(p, m));
  });
}

function listeJeux(p, m) {
  afficher(`${m.emoji} ${m.titre}`, `
    <p class="sous-titre">Choisis un jeu</p>
    <div class="grille">
      ${m.jeux.map((j, i) => {
        const best = p.scores[`${m.id}/${j.id}`] || 0;
        return `<button class="tuile" style="--c:${m.couleur}" data-i="${i}"><span class="emoji">${j.emoji}</span>${j.titre}<small>${'⭐'.repeat(best) + '☆'.repeat(3 - best)}</small></button>`;
      }).join('')}
    </div>`, { retour: true, profil: p });
  $ecran.querySelectorAll('.tuile').forEach(b => b.onclick = () => aller(() => partie(p, m, m.jeux[b.dataset.i])));
}

// Le défi du jour : 10 questions tirées de toutes les matières de l'enfant.
function jeuDefi(p) {
  const tous = [];
  NIVEAUX[p.niveau].matieres.forEach(m => m.jeux.forEach(j => tous.push({ m, j })));
  return { id: 'defi', titre: 'Défi du jour', emoji: '🎯', defi: true, gen: () => { const x = pioche(tous); const q = x.j.gen(); q.matiere = x.m; return q; } };
}

function partie(p, m, jeu) {
  let n = 0, reussies = 0, combo = 0, meilleurCombo = 0;
  const lecture = NIVEAUX[p.niveau].lecture;
  const deja = new Set();

  function suivante() {
    if (n >= NB_QUESTIONS) return fin();
    let q, essais = 0;
    do { q = jeu.gen(); } while (deja.has(cleQ(q)) && essais++ < 20);
    deja.add(cleQ(q));
    const mq = q.matiere || m;
    let premierEssai = true, erreurs = 0;
    const zone = q.type === 'lettres' ? zoneLettres(q) : q.type === 'saisie' ? zoneSaisie() : `<div class="choix">${q.choix.map(c => `<button data-v="${echapper(c)}">${c}</button>`).join('')}</div>`;
    afficher(`${jeu.emoji} ${jeu.titre}`, `
      <div class="jeu">
        <div class="haut-jeu">
          <div class="progression"><div style="width:${n / NB_QUESTIONS * 100}%"></div><span class="coureur" style="left:max(16px, ${n / NB_QUESTIONS * 100}%)">${p.avatar}</span></div>
          <div class="combo ${combo >= 2 ? 'visible' : ''}">🔥 ×${combo}</div>
        </div>
        <div class="question entre">
          ${jeu.defi ? `<div class="aide">${mq.emoji} ${mq.titre}</div>` : ''}
          <div class="visuel">${q.visuel || ''}</div>
          <div class="enonce">${typo(q.enonce)}</div>
          ${q.aide ? `<div class="aide">${q.aide}</div>` : ''}
          ${('speechSynthesis' in window) ? '<button class="ecouter">🔊 Écouter</button>' : ''}
        </div>
        ${zone}
      </div>`, { retour: true, profil: p });
    const ec = $ecran.querySelector('.ecouter');
    if (ec) ec.onclick = () => lireQuestion(q, !(lecture && mq.id === 'francais'));
    if (lecture || q.direEn || q.type === 'saisie') setTimeout(() => lireQuestion(q, false), 250);

    function gagne(el) {
      if (premierEssai) { reussies++; combo++; meilleurCombo = Math.max(meilleurCombo, combo); } else combo = 0;
      son(combo >= 3 && premierEssai ? 'bonus' : 'bon');
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
      if (el) { el.classList.remove('faux'); void el.offsetWidth; el.classList.add('faux'); }
    }

    if (q.type === 'lettres') {
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
        }
      });
    }
  }

  function fin() {
    const nbEt = reussies >= 9 ? 3 : reussies >= 6 ? 2 : reussies >= 3 ? 1 : 0;
    const avantNiveau = niveauDe(p), avantEtoiles = m ? (p.scores[`${m.id}/${jeu.id}`] || 0) : 0;
    let pieces = reussies + (nbEt === 3 ? 5 : 0) + (meilleurCombo >= 5 ? 3 : 0);
    let tickets = nbEt >= 2 ? 1 : 0;
    if (jeu.defi && nbEt >= 1) { pieces += 20; tickets += 2; p.defi = aujourdhui(); }
    if (m) {
      const cle = `${m.id}/${jeu.id}`;
      if (nbEt > avantEtoiles) pieces += (nbEt - avantEtoiles) * 2; // bonus la première fois qu'on gagne une étoile
      p.scores[cle] = Math.max(avantEtoiles, nbEt);
    }
    p.etoiles += nbEt; p.pieces += pieces; p.tickets += tickets;
    p.xp += reussies * 10;
    const monte = niveauDe(p) > avantNiveau;
    if (monte) p.tickets += 1;
    sauver();
    const msg = jeu.defi && nbEt === 0 ? 'Presque ! Il faut 3 bonnes réponses pour réussir le défi.' : nbEt === 3 ? 'Bravo, c\'est parfait !' : nbEt === 2 ? 'Très bien joué !' : nbEt === 1 ? 'C\'est bien, continue !' : 'On réessaie ensemble ?';
    afficher(`${jeu.emoji} ${jeu.titre}`, `
      <div class="bravo">
        <div class="gros">${nbEt ? [1, 2, 3].map(i => `<span class="etoile ${i <= nbEt ? 'pleine' : ''}" style="animation-delay:${i * .25}s">⭐</span>`).join('') : '💪'}</div>
        <p>${msg}<br><small>${reussies} bonnes réponses du premier coup sur ${NB_QUESTIONS}${meilleurCombo >= 3 ? ` · meilleure série 🔥 ${meilleurCombo}` : ''}</small></p>
        <div class="gains">
          <div class="gain">🪙 <b>+${pieces}</b></div>
          ${tickets ? `<div class="gain">🎟️ <b>+${tickets}</b></div>` : ''}
          ${monte ? `<div class="gain niveau-up">🆙 Niveau ${niveauDe(p)} ! <b>+1 🎟️</b></div>` : ''}
        </div>
        ${!tickets && !jeu.defi ? '<p class="astuce">Avec 2 étoiles ⭐⭐, tu gagnes un ticket 🎟️ pour la salle de jeux !</p>' : ''}
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
      <p style="font-size:16px;color:#7a7066">Les tickets 🎟️ se gagnent seulement en réussissant les exercices (2 étoiles ou plus, défi du jour, nouveau niveau).</p>
      <hr style="margin:30px 0">
      ${donnees.profils.map((p, i) => `
        <h2>${p.avatar} Profil ${i + 1} · Niveau ${niveauDe(p)} · 🪙 ${p.pieces} · 🎟️ ${p.tickets}</h2>
        <label>Prénom</label><input data-i="${i}" data-k="nom" value="${echapper(p.nom)}">
        <label>Classe</label>
        <select data-i="${i}" data-k="niveau" style="font-size:22px;padding:8px;border-radius:12px">
          ${Object.keys(NIVEAUX).map(n => `<option ${n === p.niveau ? 'selected' : ''}>${n}</option>`).join('')}
        </select>
        <label>Avatar</label>
        <div>${AVATARS.map(av => `<button class="rond" style="margin:4px;${av === p.avatar ? 'outline:4px solid #ff8a3d' : ''}" data-i="${i}" data-av="${av}">${av}</button>`).join('')}</div>
        <table><tr><th>Jeu</th><th>Meilleur score</th></tr>
          ${Object.entries(p.scores).map(([k, s]) => `<tr><td>${nomJeu(p.niveau, k)}</td><td>${'⭐'.repeat(s) || '–'}</td></tr>`).join('') || '<tr><td colspan="2">Pas encore de partie jouée.</td></tr>'}
        </table>`).join('<hr style="margin:30px 0">')}
      <p style="text-align:center;margin-top:30px"><button class="bouton" id="fini">✔ Terminé</button></p>
    </div>`, { retour: true });
  document.getElementById('limite').onchange = e => { donnees.limiteMiniJeux = parseInt(e.target.value, 10); sauver(); };
  $ecran.querySelectorAll('input[data-i],select[data-i]').forEach(el => el.onchange = () => { donnees.profils[el.dataset.i][el.dataset.k] = el.value.trim() || donnees.profils[el.dataset.i][el.dataset.k]; sauver(); });
  $ecran.querySelectorAll('[data-av]').forEach(b => b.onclick = () => { donnees.profils[b.dataset.i].avatar = b.dataset.av; sauver(); reglages(); });
  document.getElementById('fini').onclick = accueil;
}

function nomJeu(niveau, cle) {
  const [mid, jid] = cle.split('/');
  for (const n of Object.values(NIVEAUX)) {
    const m = n.matieres.find(x => x.id === mid); const j = m && m.jeux.find(x => x.id === jid);
    if (j) return `${m.titre} · ${j.titre}`;
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
  piece: { notes: [988, 1319], type: 'square', pas: 0.07 }
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
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js');
accueil();
