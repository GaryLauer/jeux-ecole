// Multiplication rapide : une course contre le loup avec les tables de 0 à 10 (CE2, CM1, CM2).
// Plus on répond vite, plus on distance le loup ; trop lent, il nous rattrape et nous croque.
// Aux carrefours, on choisit son chemin : à gauche tables de 0 à 3, au centre de 4 à 7, à droite de 7 à 10.
// La vitesse (1x à 5x) se choisit avant la partie et multiplie les gains.
const LOUP = (() => {
  const ETAPES = 12;               // bonnes réponses pour arriver à la maison
  const CARREFOURS = [0, 4, 8];    // un carrefour avant ces questions
  // Temps « normal » pour répondre selon la vitesse : plus vite que ça, on s'éloigne du loup.
  const TEMPS = [0, 9, 7, 5.5, 4.5, 3.5];
  const CHEMINS = [
    { id: 'gauche', nom: 'À gauche', fleche: '⬅️', tables: [0, 1, 2, 3], texte: 'tables de 0 à 3', prime: 0, marge: 1, couleur: '#3bb273' },
    { id: 'centre', nom: 'Au centre', fleche: '⬆️', tables: [4, 5, 6, 7], texte: 'tables de 4 à 7', prime: 0.5, marge: 1.1, couleur: '#ff8a3d' },
    { id: 'droite', nom: 'À droite', fleche: '➡️', tables: [7, 8, 9, 10], texte: 'tables de 7 à 10', prime: 1, marge: 1.2, couleur: '#e5484d' }
  ];

  // Une multiplication des tables choisies, avec des réponses proches pour se tromper.
  function question(tables) {
    const t = pioche(tables), x = alea(0, 10), r = t * x;
    const [a, b] = Math.random() < 0.5 ? [t, x] : [x, t];
    const fausses = [r + t, r - t, r + x, r - x, (t + 1) * x, t * (x + 1), r + 1, r - 1, r + 10, r - 10, t + x, r + 2, r + 5].filter(v => v >= 0);
    return qcm({ visuel: '🐺', enonce: `${a} × ${b} = ?`, table: t }, r, fausses);
  }

  /* ---------- Écran de départ : choix de la vitesse ---------- */
  function depart(p, m, jeu) {
    const v0 = p.vitesseLoup || 1;
    const rec = p.records[jeu.id] || 0;
    afficher(`${jeu.emoji} ${jeu.titre}`, `
      <div class="loup-depart">
        <div class="loup-affiche"><span class="loup-bete">🐺</span><span class="loup-fille">🏃‍♀️</span><span>🏠</span></div>
        <p class="loup-regle">Le loup te poursuit ! <b>Réponds vite</b> aux multiplications pour t'éloigner.<br>Si tu es trop lente, il te rattrape et te <b>croque</b>…</p>
        <div class="loup-chemins-info">
          ${CHEMINS.map(c => `<div style="--c:${c.couleur}"><b>${c.fleche} ${c.nom}</b><br>${c.texte}</div>`).join('')}
        </div>
        <p class="loup-titre-vitesse">Choisis ta vitesse :</p>
        <div class="loup-vitesses">
          ${[1, 2, 3, 4, 5].map(v => `<button data-v="${v}" class="${v === v0 ? 'choisie' : ''}"><b>${v}x</b><small>gains ×${v}</small></button>`).join('')}
        </div>
        ${rec ? `<p class="loup-record">🏆 Ton record : <b>${rec}</b> points</p>` : ''}
        ${sansPoints(p) ? `<p class="astuce alerte-classe">⚠️ En ${p.niveau}, tu t'entraînes mais tu ne gagnes aucun point.</p>` : ''}
        <button class="bouton" id="partir">🏃‍♀️ C'est parti !</button>
      </div>`, { retour: true, profil: p });
    let v = v0;
    $ecran.querySelectorAll('.loup-vitesses button').forEach(b => b.onclick = () => {
      son('tic');
      v = +b.dataset.v;
      $ecran.querySelectorAll('.loup-vitesses button').forEach(x => x.classList.toggle('choisie', x === b));
    });
    document.getElementById('partir').onclick = () => { p.vitesseLoup = v; sauver(); course(p, m, jeu, v); };
    maitresseActive = p.maitresse;
    parler('Attention, le loup arrive ! Choisis ta vitesse, puis réponds vite pour lui échapper.');
  }

  /* ---------- La course ---------- */
  function course(p, m, jeu, vitesse) {
    quitter();
    maitresseActive = p.maitresse;
    const A = TEMPS[vitesse];
    const avanceMax = 4 * A;
    let avance = 2.5 * A;          // avance sur le loup, en secondes
    let n = 0, reussies = 0, prime = 0, score = 0, combo = 0;
    let chemin = null, q = null, tQuestion = 0, premierEssai = true;
    let etat = 'carrefour';        // carrefour | question | bravo | croquee | maison
    let raf = 0, dernier = performance.now(), temps = 0, defile = 0, attaque = 0, joie = 0, fini = false;
    const deja = new Set();

    afficher(`${jeu.emoji} ${jeu.titre}`, `
      <div class="loup-jeu">
        <div class="loup-haut">
          <div class="progression"><div class="loup-prog"></div>${CARREFOURS.slice(1).map(c => `<span class="loup-borne" style="left:${c / ETAPES * 100}%">🔀</span>`).join('')}<span class="loup-borne" style="left:100%">🏠</span></div>
          <div class="loup-infos"><span class="loup-v">⚡ ${vitesse}x</span><span class="loup-score">⭐ 0</span></div>
        </div>
        <canvas class="loup-scene"></canvas>
        <div class="loup-bas"></div>
      </div>`, { retour: true, profil: p, classe: 'plein-ecran' });
    const canvas = $ecran.querySelector('.loup-scene'), ctx = canvas.getContext('2d');
    const bas = $ecran.querySelector('.loup-bas');
    let W = 0, H = 0;
    function taille() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = canvas.clientWidth; H = Math.round(Math.min(360, Math.max(150, window.innerHeight * 0.34)));
      canvas.style.height = H + 'px';
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    taille();
    window.addEventListener('resize', taille);

    const enPause = () => etat !== 'question' || !!document.querySelector('.cours-fenetre') || document.hidden;

    function boucle(t) {
      const dt = Math.min(0.1, (t - dernier) / 1000);
      dernier = t;
      temps += dt;
      if (!enPause()) {
        avance -= dt;
        tQuestion += dt;
        if (avance <= 0) { avance = 0; croquee(); }
      }
      if (etat === 'question' || etat === 'bravo') defile += dt * (90 + vitesse * 25);
      attaque = Math.max(0, attaque - dt * 2);
      joie = Math.max(0, joie - dt * 1.5);
      dessiner();
      raf = requestAnimationFrame(boucle);
    }

    function dessiner() {
      const sol = H * 0.78;
      // Ciel et collines
      const ciel = ctx.createLinearGradient(0, 0, 0, H);
      ciel.addColorStop(0, etat === 'croquee' ? '#6b5b7a' : '#bfe6ff'); ciel.addColorStop(1, '#fff8ec');
      ctx.fillStyle = ciel; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#9fd49a';
      for (let i = -1; i < W / 160 + 2; i++) {
        const x = i * 160 - (defile * 0.3) % 160;
        ctx.beginPath(); ctx.ellipse(x, sol, 120, 55, 0, Math.PI, 0); ctx.fill();
      }
      ctx.fillStyle = '#7cc46f'; ctx.fillRect(0, sol, W, H - sol);
      ctx.fillStyle = '#e8d3a8';
      ctx.fillRect(0, sol + 6, W, H - sol - 12);
      if (chemin && etat !== 'carrefour') { ctx.fillStyle = chemin.couleur; ctx.fillRect(0, sol + 6, W, 4); ctx.fillRect(0, H - 10, W, 4); }
      ctx.fillStyle = '#000'; // les emoji prennent la transparence de la couleur : on la remet opaque
      // Arbres qui défilent
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.font = `${Math.round(H * 0.22)}px ${'"Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif'}`;
      for (let i = -1; i < W / 110 + 2; i++) {
        const x = i * 110 - (defile * 0.8) % 110;
        ctx.fillText(i % 3 === 0 ? '🌲' : i % 3 === 1 ? '🌳' : '🌲', x, sol + 2);
      }
      // Panneaux du carrefour
      if (etat === 'carrefour') {
        ctx.font = `bold ${Math.round(H * 0.1)}px "Comic Sans MS", sans-serif`;
        CHEMINS.forEach((c, i) => {
          const x = W * (0.25 + i * 0.25), y = H * 0.18;
          ctx.fillStyle = c.couleur; ctx.fillRect(x - 3, y, 6, sol - y - 10);
          const tw = Math.min(W * 0.23, 150);
          ctx.fillRect(x - tw / 2, y - H * 0.06, tw, H * 0.16);
          ctx.fillStyle = '#fff'; ctx.fillText(`${c.tables[0]} à ${c.tables[3]}`, x, y + H * 0.06);
        });
      }
      // La maison au bout du chemin
      if (n >= ETAPES - 2 || etat === 'maison') {
        const reste = etat === 'maison' ? 0 : ETAPES - n;
        ctx.font = `${Math.round(H * 0.4)}px "Noto Color Emoji", sans-serif`;
      ctx.fillStyle = '#000';
        ctx.fillText('🏠', W * 0.9 + reste * W * 0.08, sol + 4);
      }
      // L'enfant et le loup
      const filleX = etat === 'maison' ? W * 0.85 : W * 0.68;
      const loin = Math.min(1, avance / avanceMax);
      let loupX = W * 0.05 + (filleX - W * 0.14 - W * 0.05) * (1 - loin) + attaque * W * 0.06;
      if (etat === 'croquee') loupX = filleX - W * 0.05;
      const saut = t => Math.abs(Math.sin(temps * t)) * H * 0.05;
      ctx.font = `${Math.round(H * 0.3)}px "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
      ctx.fillStyle = '#000';
      if (etat !== 'croquee') {
        ctx.save();
        ctx.translate(filleX, sol - (etat === 'carrefour' ? 0 : saut(9)) - joie * H * 0.12);
        ctx.scale(-1, 1); // l'emoji court vers la gauche : on le retourne
        ctx.fillText('🏃‍♀️', 0, 0);
        ctx.restore();
      } else {
        ctx.fillText('💥', filleX, sol - H * 0.05);
      }
      ctx.save();
      ctx.translate(loupX, sol - (etat === 'carrefour' ? 0 : saut(7)));
      ctx.scale(-1, 1);
      ctx.fillText('🐺', 0, 0);
      ctx.restore();
      // Distance entre les deux
      if (etat === 'question' || etat === 'bravo') {
        const danger = avance < A;
        ctx.font = `bold ${Math.round(H * 0.11)}px "Comic Sans MS", sans-serif`;
        ctx.fillStyle = danger ? '#e5484d' : '#2d2a32';
        ctx.fillText(`${Math.round(avance * 5)} m`, (loupX + filleX) / 2, H * 0.2);
        if (danger) {
          ctx.fillStyle = `rgba(229,72,77,${0.12 + 0.1 * Math.sin(temps * 10)})`;
          ctx.fillRect(0, 0, W, H);
        }
      }
    }

    function majHaut() {
      $ecran.querySelector('.loup-prog').style.width = `${n / ETAPES * 100}%`;
      $ecran.querySelector('.loup-score').textContent = `⭐ ${score}`;
    }

    function carrefour() {
      etat = 'carrefour';
      majHaut();
      bas.innerHTML = `
        <p class="loup-consigne">🔀 Un carrefour ! Choisis ton chemin :</p>
        <div class="loup-carrefour">
          ${CHEMINS.map((c, i) => `<button data-i="${i}" style="--c:${c.couleur}"><span>${c.fleche}</span><b>${c.nom}</b><small>${c.texte}</small><small>${'⭐'.repeat(i + 1)}</small></button>`).join('')}
        </div>`;
      bas.querySelectorAll('button').forEach(b => b.onclick = () => {
        son('tic');
        chemin = CHEMINS[b.dataset.i];
        suivante();
      });
      if (n === 0) parler('Choisis ton chemin !');
    }

    function suivante() {
      if (fini) return;
      if (n >= ETAPES) return maison();
      if (CARREFOURS.includes(n) && etat !== 'carrefour') return carrefour();
      let essais = 0;
      do { q = question(chemin.tables); } while (deja.has(q.enonce) && essais++ < 20);
      deja.add(q.enonce);
      etat = 'question';
      tQuestion = 0;
      premierEssai = true;
      const fiches = fichesCours({ ...q }, jeu, m, p.niveau);
      bas.innerHTML = `
        <div class="question loup-question">
          ${fiches ? '<button class="aide-cours" aria-label="Petit cours : je ne comprends pas">?</button>' : ''}
          <div class="aide">${chemin.fleche} ${chemin.nom} · ${chemin.texte}</div>
          <div class="enonce loup-enonce">${q.enonce}</div>
        </div>
        <div class="choix loup-choix">${q.choix.map(c => `<button data-v="${c}">${c}</button>`).join('')}</div>`;
      majHaut();
      const bc = bas.querySelector('.aide-cours');
      if (bc) bc.onclick = () => { son('tic'); ouvrirCours(p, fiches, false); }; // le loup attend pendant le petit cours
      bas.querySelectorAll('.choix button').forEach(b => b.onclick = () => {
        if (etat !== 'question') return;
        if (b.dataset.v === q.bonne) {
          b.classList.add('bon');
          bas.querySelectorAll('.choix button').forEach(x => x.disabled = true);
          const marge = A * chemin.marge;
          avance = Math.min(avanceMax, avance + marge + Math.max(0, marge - tQuestion));
          if (premierEssai) {
            reussies++; prime += chemin.prime; combo++;
            score += (CHEMINS.indexOf(chemin) + 1) * vitesse * (tQuestion < marge / 2 ? 2 : 1);
          }
          son(combo >= 3 ? 'bonus' : 'bon');
          confettis(b, premierEssai ? 14 : 6);
          if (premierEssai) texteVolant(b, tQuestion < marge / 2 ? 'Éclair ! ⚡' : pioche(['Bravo !', 'Oui !', 'Vite !', 'Top !']));
          joie = 1;
          n++;
          etat = 'bravo';
          setTimeout(suivante, 450);
        } else {
          premierEssai = false; combo = 0;
          b.classList.add('faux'); b.disabled = true;
          son('faux');
          avance -= A * 0.35; // le loup bondit
          attaque = 1;
          if (avance <= 0) croquee();
        }
      });
    }

    function croquee() {
      if (fini) return;
      fini = true; etat = 'croquee';
      fermerCours();
      bas.innerHTML = '<p class="loup-consigne loup-perdu">😱 Croquée par le loup !</p>';
      son('croque');
      if (navigator.vibrate) try { navigator.vibrate([80, 60, 200]); } catch (e) {}
      setTimeout(() => resultat(false), 1600);
    }
    function maison() {
      if (fini) return;
      fini = true; etat = 'maison';
      majHaut();
      bas.innerHTML = '<p class="loup-consigne loup-gagne">🏠 À l\'abri dans la maison !</p>';
      son('bonus');
      setTimeout(() => resultat(true), 1600);
    }

    function resultat(sauvee) {
      cancelAnimationFrame(raf); raf = 0;
      window.removeEventListener('resize', taille);
      nettoyage = null;
      const bloque = sansPoints(p);
      const nbEt = !sauvee ? 0 : reussies >= ETAPES - 1 ? 3 : reussies >= ETAPES * 0.6 ? 2 : 1;
      const avantNiveau = niveauDe(p), avantEtoiles = p.scores[cleScore(p, m, jeu)] || 0;
      // Gains comme un jeu de 10 questions, multipliés par la vitesse ; la moitié si le loup a gagné.
      const r10 = reussies * 10 / ETAPES, prime10 = prime * 10 / ETAPES;
      const record = !bloque && score > (p.records[jeu.id] || 0);
      let pieces = 0, tickets = 0, pattes = 0, xp = 0;
      if (!bloque) {
        const base = sauvee ? r10 + prime10 : r10 / 2;
        pieces = Math.round(base * vitesse) + (nbEt === 3 ? 5 : 0);
        if (nbEt > avantEtoiles) pieces += (nbEt - avantEtoiles) * 2;
        tickets = nbEt >= 2 ? 1 : 0;
        p.scores[cleScore(p, m, jeu)] = Math.max(avantEtoiles, nbEt);
        if (record) p.records[jeu.id] = score;
        p.etoiles += nbEt; p.pieces += pieces; p.tickets += tickets;
        const bonnes = Math.round((sauvee ? r10 : r10 / 2) * vitesse);
        pattes = gagnerPattes(p, bonnes, nbEt * vitesse, false);
        xp = bonnes * 10;
        p.xp += xp;
      }
      const monte = niveauDe(p) > avantNiveau;
      if (monte) p.tickets += 1;
      sauver();
      const msg = sauvee
        ? (nbEt === 3 ? 'Bravo, le loup ne t\'a pas rattrapée ! C\'est parfait !' : 'Ouf, tu as échappé au loup !')
        : 'Oh non, le loup t\'a croquée ! Tu as perdu cette fois. Réessaie !';
      afficher(`${jeu.emoji} ${jeu.titre}`, `
        <div class="bravo">
          <div class="fin-maitresse">${dessinMaitresse(p.maitresse, sauvee ? 'contente' : 'encourage')}</div>
          <div class="gros">${sauvee ? [1, 2, 3].map(i => `<span class="etoile ${i <= nbEt ? 'pleine' : ''}" style="animation-delay:${i * .25}s">⭐</span>`).join('') : '🐺'}</div>
          <p>${msg}<br><small>Vitesse ${vitesse}x · ${reussies} bonnes réponses du premier coup · ${Math.min(n, ETAPES)} sur ${ETAPES} · score ${score}${record ? ' · 🏆 nouveau record !' : ''}</small></p>
          ${bloque ? `<p class="astuce alerte-classe">Tu es en ${p.classeReelle} : en ${p.niveau}, aucun point n'est gagné.</p>` : `
          <div class="gains">
            <div class="gain">🪙 <b>+${pieces}</b></div>
            ${pattes ? `<div class="gain">🐾 <b>+${pattes}</b></div>` : ''}
            ${tickets ? `<div class="gain">🎟️ <b>+${tickets}</b></div>` : ''}
            ${monte ? `<div class="gain niveau-up">🆙 Niveau ${niveauDe(p)} ! <b>+1 🎟️</b></div>` : ''}
          </div>
          ${!sauvee && reussies ? '<p class="astuce">Croquée : tu gardes la moitié de tes gains. Arrive à la maison pour tout gagner !</p>' : ''}
          ${sauvee && vitesse < 5 ? `<p class="astuce">Essaie en ${vitesse + 1}x pour gagner encore plus !</p>` : ''}
          ${p.animal && xp ? `<p class="astuce">${p.animal.espece === 'panda' ? '🐼' : '🐆'} ${echapper(p.animal.nom)} grandit : +${xp} XP</p>` : ''}`}
          <div>
            <button class="bouton" id="rejouer">🔁 Rejouer en ${vitesse}x</button>
            <button class="bouton violet" id="vitesse">⚡ Changer de vitesse</button>
            <button class="bouton second" id="autre">Autre jeu</button>
          </div>
        </div>`, { retour: true, profil: p });
      if (sauvee) { setTimeout(() => confettis(document.querySelector('.bravo .gros'), 40), 300); }
      parler(msg + (monte ? ` Tu passes au niveau ${niveauDe(p)} !` : ''));
      document.getElementById('rejouer').onclick = () => course(p, m, jeu, vitesse);
      document.getElementById('vitesse').onclick = () => depart(p, m, jeu);
      document.getElementById('autre').onclick = () => $retour.onclick();
    }

    nettoyage = () => { fini = true; cancelAnimationFrame(raf); raf = 0; window.removeEventListener('resize', taille); };
    carrefour();
    raf = requestAnimationFrame(t => { dernier = t; boucle(t); });
  }

  const jeu = {
    id: 'multi-rapide', titre: 'Multiplication rapide', emoji: '🐺',
    // Pour le défi du jour et le vérificateur : une multiplication des tables de 0 à 10.
    gen: () => question([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    lancer: (p, m, j) => depart(p, m, j)
  };
  ['CE2', 'CM1', 'CM2'].forEach(niv => {
    ajouterJeux(niv, 'maths', [jeu]);
    cours(`${niv}/maths/multi-rapide`,
      { t: 'Les tables de 0, 1 et 10', si: /(^|\D)(0|1|10) ×|× (0|1|10)(\D|$)/, l: [
        'Fois 0, ça fait toujours <b>0</b> : il n\'y a rien du tout.',
        'Fois 1, le nombre ne change pas.',
        'Fois 10, on ajoute un zéro au bout du nombre.'
      ], ex: '6 × 0 = <b>0</b> · 1 × 8 = <b>8</b> · 4 × 10 = <b>40</b>' },
      { t: 'Les tables de multiplication', l: [
        '6 × 4, c\'est 6 fois 4 : 4 + 4 + 4 + 4 + 4 + 4.',
        'On peut échanger les nombres : 3 × 8 = 8 × 3.',
        'Table de 2 : c\'est le double. Table de 4 : le double du double.',
        'Table de 5 : ça finit par 0 ou 5. Table de 9 : en additionnant les deux chiffres du résultat, on trouve 9.',
        'Si tu bloques, pars d\'un résultat que tu connais, puis ajoute ou enlève une fois le nombre.'
      ], ex: '7 × 6 = 7 × 5 + 7 = 35 + 7 = <b>42</b>' });
  });
  return { depart };
})();
