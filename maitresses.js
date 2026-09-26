// Les maîtresses : Maîtresse Léona la léopard et Maîtresse Pia la panda.
// dessinMaitresse(id, humeur) renvoie un dessin SVG ; humeur : 'normal', 'contente' ou 'encourage'.

const MAITRESSES = {
  leopard: {
    nom: 'Maîtresse Léona', animal: 'léopard', pitch: 1.05,
    salut: ['Bonjour ! Prête à apprendre avec moi ?', 'Coucou ! Quelle matière on travaille aujourd\'hui ?', 'Te revoilà ! Je suis contente de te voir.'],
    bravo: ['Bravo !', 'Excellent !', 'Parfait !', 'Tu es rapide comme un léopard !', 'Génial !', 'Super réponse !'],
    oups: ['Presque ! Réessaie.', 'Pas tout à fait, regarde bien.', 'Prends ton temps, tu vas trouver.', 'On essaie encore ?']
  },
  panda: {
    nom: 'Maîtresse Pia', animal: 'panda', pitch: 1.25,
    salut: ['Coucou ! On joue ensemble ?', 'Bonjour ! On apprend en s\'amusant ?', 'Te voilà ! Je t\'attendais !'],
    bravo: ['Bravo !', 'Oui, c\'est ça !', 'Trop fort !', 'Je suis fière de toi !', 'Super !', 'Bien joué !'],
    oups: ['Oh, presque ! Essaie encore.', 'Pas grave, on réessaie !', 'Regarde bien, tu peux le faire !', 'Encore un petit effort !']
  }
};

function dessinMaitresse(id, humeur = 'normal') {
  return id === 'panda' ? dessinPanda(humeur) : dessinLeopard(humeur);
}

// Yeux, sourcils et bouche selon l'humeur.
function visage(cx, yeuxY, ecart, couleurYeux, humeur, boucheY, couleurBouche) {
  const g = cx - ecart, d = cx + ecart;
  const yeux = humeur === 'contente'
    ? `<path d="M${g - 9} ${yeuxY + 2} q9 -11 18 0 M${d - 9} ${yeuxY + 2} q9 -11 18 0" stroke="#2d2a32" stroke-width="4" fill="none" stroke-linecap="round"/>`
    : `<g class="yeux"><ellipse cx="${g}" cy="${yeuxY}" rx="7.5" ry="9" fill="${couleurYeux}"/><ellipse cx="${d}" cy="${yeuxY}" rx="7.5" ry="9" fill="${couleurYeux}"/>
       <circle cx="${g + 2.5}" cy="${yeuxY - 3}" r="2.8" fill="#fff"/><circle cx="${d + 2.5}" cy="${yeuxY - 3}" r="2.8" fill="#fff"/></g>`;
  const sourcils = humeur === 'encourage'
    ? `<path d="M${g - 10} ${yeuxY - 17} q10 -8 20 -2 M${d - 10} ${yeuxY - 19} q10 -6 20 2" stroke="#2d2a32" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<path d="M${g - 10} ${yeuxY - 16} q10 -6 20 0 M${d - 10} ${yeuxY - 16} q10 -6 20 0" stroke="#2d2a32" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const bouche = humeur === 'contente'
    ? `<path class="bouche" d="M${cx - 14} ${boucheY} q14 18 28 0 z" fill="${couleurBouche}" stroke="#2d2a32" stroke-width="2.5" stroke-linejoin="round"/>`
    : humeur === 'encourage'
      ? `<path class="bouche" d="M${cx - 9} ${boucheY + 3} q9 7 18 0" stroke="#2d2a32" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<path class="bouche" d="M${cx - 11} ${boucheY} q11 11 22 0" stroke="#2d2a32" stroke-width="3" fill="${couleurBouche}" stroke-linecap="round"/>`;
  return sourcils + yeux + bouche;
}

function dessinLeopard(humeur) {
  const taches = [[62, 58], [132, 52], [52, 92], [148, 90], [98, 40], [80, 48], [120, 44], [44, 74], [156, 70]]
    .map(([x, y]) => `<g transform="translate(${x} ${y})"><circle r="6" fill="none" stroke="#6b3d12" stroke-width="3" stroke-dasharray="7 3"/><circle r="2.5" fill="#c9771f"/></g>`).join('');
  return `<svg class="maitresse-svg" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg" aria-label="Maîtresse Léona la léopard">
    <!-- corps : chemisier et gilet -->
    <path d="M40 250 q0 -70 60 -78 q60 8 60 78 z" fill="#1fa5a5"/>
    <path d="M100 172 l-22 10 l22 34 l22 -34 z" fill="#fff"/>
    <path d="M78 182 l22 34 l-8 34 h-26 q-4 -40 12 -68 z M122 182 l-22 34 l8 34 h26 q4 -40 -12 -68 z" fill="#16807f"/>
    <circle cx="100" cy="230" r="3" fill="#ffd23f"/><circle cx="100" cy="244" r="3" fill="#ffd23f"/>
    <!-- collier de perles -->
    <path d="M82 184 q18 16 36 0" stroke="#fff" stroke-width="5" stroke-dasharray="0.1 8" stroke-linecap="round" fill="none"/>
    <!-- cou -->
    <path d="M86 150 h28 v28 q-14 8 -28 0 z" fill="#e8a13f"/>
    <!-- oreilles -->
    <circle cx="48" cy="38" r="20" fill="#f2b04a" stroke="#6b3d12" stroke-width="3"/><circle cx="48" cy="38" r="10" fill="#6b3d12"/>
    <circle cx="152" cy="38" r="20" fill="#f2b04a" stroke="#6b3d12" stroke-width="3"/><circle cx="152" cy="38" r="10" fill="#6b3d12"/>
    <!-- tête -->
    <ellipse cx="100" cy="85" rx="66" ry="64" fill="#f2b04a" stroke="#6b3d12" stroke-width="3"/>
    ${taches}
    <!-- cheveux : chignon et mèche -->
    <circle cx="100" cy="14" r="17" fill="#4a2a10"/>
    <path d="M52 50 q20 -34 60 -30 q-18 10 -20 26 q-14 -8 -40 4 z" fill="#4a2a10"/>
    <!-- museau -->
    <ellipse cx="100" cy="112" rx="34" ry="26" fill="#fbe3b8"/>
    <path d="M91 100 h18 l-9 10 z" fill="#3a2410" stroke="#3a2410" stroke-width="3" stroke-linejoin="round"/>
    <path d="M100 110 v6" stroke="#3a2410" stroke-width="3"/>
    <g stroke="#6b3d12" stroke-width="2" stroke-linecap="round"><path d="M70 110 h-22 M70 116 l-20 6 M130 110 h22 M130 116 l20 6"/></g>
    <!-- joues -->
    <ellipse cx="62" cy="104" rx="10" ry="6" fill="#ff8f8f" opacity=".45"/><ellipse cx="138" cy="104" rx="10" ry="6" fill="#ff8f8f" opacity=".45"/>
    ${visage(100, 80, 24, '#2f6b3a', humeur, 118, '#d9534f')}
    <!-- lunettes rouges -->
    <g fill="none" stroke="#e5484d" stroke-width="3.5"><circle cx="76" cy="80" r="15"/><circle cx="124" cy="80" r="15"/><path d="M91 78 q9 -6 18 0 M61 76 l-12 -5 M139 76 l12 -5"/></g>
    <!-- boucles d'oreilles -->
    <circle cx="36" cy="100" r="5" fill="#ffd23f"/><circle cx="164" cy="100" r="5" fill="#ffd23f"/>
  </svg>`;
}

function dessinPanda(humeur) {
  return `<svg class="maitresse-svg" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg" aria-label="Maîtresse Pia la panda">
    <!-- corps : gilet vert et col claudine -->
    <path d="M70 140 h60 v40 h-60 z" fill="#2d2a32"/>
    <path d="M36 250 q0 -72 64 -80 q64 8 64 80 z" fill="#3bb273"/>
    <path d="M100 172 q-24 -2 -32 12 q16 12 32 2 q16 10 32 -2 q-8 -14 -32 -12 z" fill="#fff" stroke="#d8e8dc" stroke-width="2"/>
    <circle cx="100" cy="206" r="4" fill="#fff"/><circle cx="100" cy="226" r="4" fill="#fff"/><circle cx="100" cy="246" r="4" fill="#fff"/>
    <!-- pomme dans la poche -->
    <text x="128" y="236" font-size="22">🍎</text>
    <!-- oreilles -->
    <circle cx="46" cy="36" r="22" fill="#2d2a32"/><circle cx="154" cy="36" r="22" fill="#2d2a32"/>
    <!-- tête -->
    <ellipse cx="100" cy="88" rx="70" ry="66" fill="#fff" stroke="#2d2a32" stroke-width="3"/>
    <!-- nœud rose -->
    <g transform="translate(150 30) rotate(20)"><path d="M0 0 l-18 -11 v22 z M0 0 l18 -11 v22 z" fill="#ff7eb6" stroke="#d94f9c" stroke-width="2" stroke-linejoin="round"/><circle r="5.5" fill="#d94f9c"/></g>
    <!-- taches autour des yeux -->
    <ellipse cx="72" cy="84" rx="20" ry="25" fill="#2d2a32" transform="rotate(25 72 84)"/>
    <ellipse cx="128" cy="84" rx="20" ry="25" fill="#2d2a32" transform="rotate(-25 128 84)"/>
    ${humeur === 'contente'
      ? `<path d="M63 88 q9 -11 18 0 M119 88 q9 -11 18 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`
      : `<g class="yeux"><circle cx="74" cy="86" r="9" fill="#fff"/><circle cx="126" cy="86" r="9" fill="#fff"/><circle cx="75" cy="87" r="5.5" fill="#2d2a32"/><circle cx="127" cy="87" r="5.5" fill="#2d2a32"/><circle cx="77" cy="84" r="2" fill="#fff"/><circle cx="129" cy="84" r="2" fill="#fff"/></g>`}
    ${humeur === 'encourage' ? `<path d="M58 56 q12 -8 24 -2 M118 54 q12 -6 24 2" stroke="#2d2a32" stroke-width="3" fill="none" stroke-linecap="round"/>` : ''}
    <!-- joues -->
    <ellipse cx="56" cy="116" rx="11" ry="7" fill="#ff9fb8" opacity=".7"/><ellipse cx="144" cy="116" rx="11" ry="7" fill="#ff9fb8" opacity=".7"/>
    <!-- nez et bouche -->
    <ellipse cx="100" cy="110" rx="10" ry="7" fill="#2d2a32"/>
    <path d="M100 116 v5" stroke="#2d2a32" stroke-width="3"/>
    ${humeur === 'contente'
      ? `<path class="bouche" d="M86 124 q14 18 28 0 z" fill="#ff7e8a" stroke="#2d2a32" stroke-width="2.5" stroke-linejoin="round"/>`
      : humeur === 'encourage'
        ? `<path class="bouche" d="M92 126 q8 6 16 0" stroke="#2d2a32" stroke-width="3" fill="none" stroke-linecap="round"/>`
        : `<path class="bouche" d="M88 123 q12 12 24 0" stroke="#2d2a32" stroke-width="3" fill="#ff7e8a" stroke-linecap="round"/>`}
  </svg>`;
}

// Choisit une voix féminine française si l'appareil en a une.
function voixMaitresse() {
  if (!('speechSynthesis' in window)) return null;
  const fr = speechSynthesis.getVoices().filter(v => v.lang && v.lang.replace('_', '-').toLowerCase().startsWith('fr'));
  return fr.find(v => /female|femme|amélie|amelie|audrey|marie|julie|léa|lea|céline|celine|virginie|aurélie/i.test(v.name)) || fr[0] || null;
}
