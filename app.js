// Navigation, profils, sauvegarde des étoiles et déroulement d'une partie.
const NB_QUESTIONS = 10;
const CLE = 'jeux-ecole-v1';
const $ecran = document.getElementById('ecran');
const $titre = document.getElementById('titre');
const $retour = document.getElementById('retour');
const $etoiles = document.getElementById('etoiles');

let donnees = charger();
let pile = []; // écrans précédents, pour le bouton retour

function charger() {
  try { const d = JSON.parse(localStorage.getItem(CLE)); if (d && d.profils) return d; } catch (e) {}
  return { profils: [
    { id: 'p1', nom: 'Mon grand', niveau: 'CM1', avatar: '🦊', etoiles: 0, scores: {} },
    { id: 'p2', nom: 'Mon petit', niveau: 'CP', avatar: '🐻', etoiles: 0, scores: {} }
  ] };
}
function sauver() { try { localStorage.setItem(CLE, JSON.stringify(donnees)); } catch (e) {} }

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

/* ---------- Écrans ---------- */
function afficher(titre, html, options = {}) {
  $titre.textContent = titre;
  $retour.hidden = !options.retour;
  const p = options.profil;
  $etoiles.hidden = !p;
  if (p) document.getElementById('nbEtoiles').textContent = p.etoiles;
  $ecran.innerHTML = html;
  window.scrollTo(0, 0);
}
function aller(fn) { pile.push(ecranActuel); ecranActuel = fn; fn(); }
let ecranActuel = accueil;
$retour.onclick = () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); ecranActuel = pile.pop() || accueil; ecranActuel(); };

function accueil() {
  pile = [];
  ecranActuel = accueil;
  afficher('Mes Petits Jeux d\'École', `
    <p class="sous-titre">Qui joue aujourd'hui ?</p>
    <div class="grille">
      ${donnees.profils.map((p, i) => `
        <button class="tuile profil" style="--c:${p.niveau === 'CP' ? '#ff8a3d' : '#4f8ef7'}" data-i="${i}">
          <span class="emoji">${p.avatar}</span>${echapper(p.nom)}<small>${p.niveau} · ⭐ ${p.etoiles}</small>
        </button>`).join('')}
    </div>
    <button class="lien" id="parents">Espace parents</button>`);
  $ecran.querySelectorAll('.profil').forEach(b => b.onclick = () => aller(() => matieres(donnees.profils[b.dataset.i])));
  document.getElementById('parents').onclick = () => aller(espaceParents);
}

function matieres(p) {
  const niv = NIVEAUX[p.niveau];
  afficher(`${p.avatar} ${p.nom}`, `
    <p class="sous-titre">Choisis une matière</p>
    <div class="grille">
      ${niv.matieres.map((m, i) => `<button class="tuile" style="--c:${m.couleur}" data-i="${i}"><span class="emoji">${m.emoji}</span>${m.titre}</button>`).join('')}
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

function partie(p, m, jeu) {
  let n = 0, reussies = 0;
  const lecture = NIVEAUX[p.niveau].lecture;
  const deja = new Set();

  function suivante() {
    if (n >= NB_QUESTIONS) return fin();
    let q, essais = 0;
    do { q = jeu.gen(); } while (deja.has(cleQ(q)) && essais++ < 20);
    deja.add(cleQ(q));
    let premierEssai = true, erreurs = 0;
    const zone = q.type === 'lettres' ? zoneLettres(q) : q.type === 'saisie' ? zoneSaisie() : `<div class="choix">${q.choix.map(c => `<button data-v="${echapper(c)}">${c}</button>`).join('')}</div>`;
    afficher(`${jeu.emoji} ${jeu.titre}`, `
      <div class="jeu">
        <div class="progression"><div style="width:${n / NB_QUESTIONS * 100}%"></div></div>
        <div class="question">
          <div class="visuel">${q.visuel || ''}</div>
          <div class="enonce">${typo(q.enonce)}</div>
          ${q.aide ? `<div class="aide">${q.aide}</div>` : ''}
          ${('speechSynthesis' in window) ? '<button class="ecouter">🔊 Écouter</button>' : ''}
        </div>
        ${zone}
      </div>`, { retour: true, profil: p });
    const ec = $ecran.querySelector('.ecouter');
    if (ec) ec.onclick = () => lireQuestion(q, !(lecture && m.id === 'francais'));
    if (lecture || q.direEn || q.type === 'saisie') setTimeout(() => lireQuestion(q, false), 250);

    function gagne() {
      if (premierEssai) reussies++;
      son(true);
      n++;
      setTimeout(suivante, 900);
    }
    function rate(el) {
      premierEssai = false; erreurs++;
      son(false);
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
          if (pos === cible.length) { $ecran.querySelector('.mot').classList.add('bon'); gagne(); }
        } else rate(b);
      });
    } else if (q.type === 'saisie') {
      const champ = $ecran.querySelector('.saisie input');
      const valider = () => {
        if (!champ.value.trim()) return;
        const ok = [q.bonne, ...(q.accepte || [])].some(r => normaliser(r) === normaliser(champ.value));
        if (ok) { champ.classList.add('bon'); champ.disabled = true; gagne(); return; }
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
          gagne();
        } else {
          rate();
          b.classList.add('faux'); b.disabled = true;
        }
      });
    }
  }

  function fin() {
    const nbEt = reussies >= 9 ? 3 : reussies >= 6 ? 2 : reussies >= 3 ? 1 : 0;
    const cle = `${m.id}/${jeu.id}`;
    p.etoiles += nbEt;
    p.scores[cle] = Math.max(p.scores[cle] || 0, nbEt);
    sauver();
    const msg = nbEt === 3 ? 'Bravo, c\'est parfait !' : nbEt === 2 ? 'Très bien joué !' : nbEt === 1 ? 'C\'est bien, continue !' : 'On réessaie ensemble ?';
    afficher(`${jeu.emoji} ${jeu.titre}`, `
      <div class="bravo">
        <div class="gros">${nbEt ? '⭐'.repeat(nbEt) : '💪'}</div>
        <p>${msg}<br>${reussies} bonnes réponses du premier coup sur ${NB_QUESTIONS}.</p>
        <button class="bouton" id="rejouer">🔁 Rejouer</button>
        <button class="bouton second" id="autre">Autre jeu</button>
      </div>`, { retour: true, profil: p });
    parler(msg);
    document.getElementById('rejouer').onclick = () => partie(p, m, jeu);
    document.getElementById('autre').onclick = () => $retour.onclick();
  }

  suivante();
}

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
      ${donnees.profils.map((p, i) => `
        <h2>${p.avatar} Profil ${i + 1}</h2>
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
  $ecran.querySelectorAll('input,select').forEach(el => el.onchange = () => { donnees.profils[el.dataset.i][el.dataset.k] = el.value.trim() || donnees.profils[el.dataset.i][el.dataset.k]; sauver(); });
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
function typo(s) { return s.replace(/ ([?!:»])/g, '\u00a0$1').replace(/« /g, '«\u00a0'); }
function echapper(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

/* ---------- Petits sons (sans fichier) ---------- */
let audio;
function son(bon) {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const notes = bon ? [523, 659, 784] : [220, 180];
    notes.forEach((f, i) => {
      const o = audio.createOscillator(), g = audio.createGain();
      o.frequency.value = f; o.type = bon ? 'triangle' : 'sawtooth';
      g.gain.setValueAtTime(0.15, audio.currentTime + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + i * 0.1 + 0.25);
      o.connect(g).connect(audio.destination);
      o.start(audio.currentTime + i * 0.1); o.stop(audio.currentTime + i * 0.1 + 0.3);
    });
  } catch (e) {}
}

if ('speechSynthesis' in window) speechSynthesis.getVoices();
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js');
accueil();
