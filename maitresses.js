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

function yeuxFelins(humeur) {
  // Yeux en amande, iris ambre-vert, cils : une dame léopard.
  const oeil = (cx, sens) => {
    if (humeur === 'contente') {
      return `<path d="M${cx - 17} ${118} q17 -14 34 0" stroke="#2a1a0c" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        <path d="M${cx + sens * 15} ${113} l${sens * 7} -6" stroke="#2a1a0c" stroke-width="2.5" stroke-linecap="round"/>`;
    }
    return `<g class="yeux">
      <path d="M${cx - 19} 118 q19 -20 38 0 q-19 14 -38 0 z" fill="#fffaf0" stroke="#2a1a0c" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="${cx}" cy="117" r="9.5" fill="url(#irisL)"/>
      <ellipse cx="${cx}" cy="117" rx="3.6" ry="7" fill="#1a0f06"/>
      <circle cx="${cx + 3.5}" cy="113" r="2.8" fill="#fff"/>
      <path d="M${cx + sens * 16} 111 l${sens * 8} -7 M${cx + sens * 10} 106 l${sens * 5} -8" stroke="#2a1a0c" stroke-width="2.5" stroke-linecap="round"/>
    </g>`;
  };
  const sourcils = humeur === 'encourage'
    ? `<path d="M84 94 q14 -9 26 -1 M130 93 q12 -8 26 1" stroke="#5a3514" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
    : `<path d="M82 97 q15 -8 28 -2 M130 95 q13 -6 28 2" stroke="#5a3514" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  return sourcils + oeil(97, -1) + oeil(143, 1);
}

function dessinLeopard(humeur) {
  const rosette = (x, y, r = 1, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${r})">
    <path d="M-7 -2 q1 -6 6 -6 M3 -7 q5 1 5 6 M7 3 q-1 5 -6 5 M-3 7 q-5 -1 -5 -5" stroke="#3a220c" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    <circle r="3.4" fill="#c97a1c"/></g>`;
  const points = [[103, 78], [112, 72], [120, 76], [128, 72], [137, 78], [116, 86], [124, 86], [108, 90], [132, 90]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#3a220c"/>`).join('');
  const bouche = humeur === 'contente'
    ? `<path class="bouche" d="M106 160 q14 22 28 0 q-14 5 -28 0 z" fill="#7a2f2a" stroke="#2a1a0c" stroke-width="2.5" stroke-linejoin="round"/><path d="M113 167 q7 6 14 0 q-7 -3 -14 0" fill="#ff8a8a"/>`
    : humeur === 'encourage'
      ? `<path class="bouche" d="M108 162 q6 -5 12 -1 q6 -4 12 1" stroke="#2a1a0c" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<path class="bouche" d="M104 156 q8 9 16 1 q8 8 16 -1" stroke="#2a1a0c" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  return `<svg class="maitresse-svg" viewBox="0 0 240 300" xmlns="http://www.w3.org/2000/svg" aria-label="Maîtresse Léona la léopard">
  <defs>
    <radialGradient id="peauL" cx="50%" cy="42%" r="62%"><stop offset="0" stop-color="#fbd27a"/><stop offset=".7" stop-color="#eeaa45"/><stop offset="1" stop-color="#d98c2b"/></radialGradient>
    <radialGradient id="irisL" cx="40%" cy="40%" r="70%"><stop offset="0" stop-color="#d9e86a"/><stop offset=".6" stop-color="#8fae2e"/><stop offset="1" stop-color="#4d6b1a"/></radialGradient>
    <linearGradient id="vesteL" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#23b3b0"/><stop offset="1" stop-color="#157f7d"/></linearGradient>
    <linearGradient id="cheveuxL" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#6a3c16"/><stop offset="1" stop-color="#40220a"/></linearGradient>
  </defs>
  <!-- longs cheveux derrière -->
  <path d="M54 92 C40 150 38 210 52 250 L92 240 C80 200 78 160 84 120 Z M186 92 C200 150 202 210 188 250 L148 240 C160 200 162 160 156 120 Z" fill="url(#cheveuxL)"/>
  <!-- corps : veste, chemisier, épaules -->
  <path d="M22 300 C22 238 60 212 120 210 C180 212 218 238 218 300 Z" fill="url(#vesteL)"/>
  <path d="M96 212 L120 262 L144 212 C136 208 104 208 96 212 Z" fill="#fff6e6"/>
  <path d="M96 212 L120 262 L104 300 L80 300 C78 262 84 232 96 212 Z M144 212 L120 262 L136 300 L160 300 C162 262 156 232 144 212 Z" fill="#12706e"/>
  <!-- cou -->
  <path d="M100 182 L140 182 L144 214 C130 224 110 224 96 214 Z" fill="#e9a340"/>
  <path d="M108 186 C112 204 128 204 132 186 Z" fill="#fff3dc"/>
  <!-- collier -->
  <path d="M98 214 q22 18 44 0" stroke="#fff" stroke-width="6" stroke-dasharray="0.1 9" stroke-linecap="round" fill="none"/>
  <!-- bras et pattes qui tiennent un livre -->
  <path d="M40 300 C44 262 58 240 74 236 L88 262 C74 270 70 284 70 300 Z" fill="#157f7d"/>
  <path d="M200 300 C196 262 182 240 166 236 L152 262 C166 270 170 284 170 300 Z" fill="#157f7d"/>
  <g transform="rotate(-6 120 272)">
    <rect x="78" y="252" width="84" height="44" rx="5" fill="#e5484d"/><rect x="82" y="255" width="76" height="38" rx="3" fill="#fff" opacity=".25"/>
    <path d="M120 252 v44" stroke="#b8363a" stroke-width="3"/>
    <text x="120" y="280" font-size="15" text-anchor="middle" fill="#fff" font-family="sans-serif" font-weight="bold">ABC</text>
  </g>
  <ellipse cx="80" cy="268" rx="13" ry="11" fill="url(#peauL)" stroke="#b56f1c" stroke-width="2"/>
  <ellipse cx="160" cy="268" rx="13" ry="11" fill="url(#peauL)" stroke="#b56f1c" stroke-width="2"/>
  <circle cx="76" cy="266" r="2" fill="#3a220c"/><circle cx="84" cy="271" r="2" fill="#3a220c"/><circle cx="162" cy="265" r="2" fill="#3a220c"/><circle cx="157" cy="271" r="2" fill="#3a220c"/>
  <!-- oreilles (petites, arrondies, en haut) -->
  <g><path d="M66 78 C58 52 70 36 90 42 C98 50 98 62 94 70 Z" fill="#e39a33" stroke="#3a220c" stroke-width="3" stroke-linejoin="round"/>
     <path d="M72 70 C68 56 74 48 86 50 C90 56 90 62 88 66 Z" fill="#f7e2c0"/></g>
  <g><path d="M174 78 C182 52 170 36 150 42 C142 50 142 62 146 70 Z" fill="#e39a33" stroke="#3a220c" stroke-width="3" stroke-linejoin="round"/>
     <path d="M168 70 C172 56 166 48 154 50 C150 56 150 62 152 66 Z" fill="#f7e2c0"/></g>
  <!-- tête féline : large avec collerette de joues -->
  <path d="M120 58 C160 58 184 84 186 118 C188 138 182 150 190 162 C176 162 172 172 164 176 C152 188 136 194 120 194 C104 194 88 188 76 176 C68 172 64 162 50 162 C58 150 52 138 54 118 C56 84 80 58 120 58 Z" fill="url(#peauL)" stroke="#b56f1c" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- frange de cheveux -->
  <path d="M64 100 C64 66 96 50 124 54 C150 56 172 70 178 96 C164 80 144 72 128 74 C134 80 134 88 130 92 C118 78 96 74 80 84 C74 88 68 94 64 100 Z" fill="url(#cheveuxL)"/>
  <!-- taches -->
  ${points}
  ${rosette(66, 128, 1, 20)}${rosette(174, 128, 1, -20)}${rosette(72, 150, .8, 60)}${rosette(168, 150, .8, -60)}${rosette(82, 108, .7, 10)}${rosette(158, 108, .7, -10)}
  <!-- masque clair autour du museau et sous les yeux -->
  <path d="M86 128 C92 124 104 126 110 134 L120 144 L130 134 C136 126 148 124 154 128 C160 146 156 172 142 184 C134 190 106 190 98 184 C84 172 80 146 86 128 Z" fill="#fff4e0"/>
  <!-- larmes du léopard -->
  <path d="M86 122 C90 132 96 140 104 146" stroke="#3a220c" stroke-width="3" fill="none" stroke-linecap="round" opacity=".75"/>
  <path d="M154 122 C150 132 144 140 136 146" stroke="#3a220c" stroke-width="3" fill="none" stroke-linecap="round" opacity=".75"/>
  <!-- joues roses -->
  <ellipse cx="80" cy="146" rx="11" ry="6" fill="#ff8f7a" opacity=".45"/><ellipse cx="160" cy="146" rx="11" ry="6" fill="#ff8f7a" opacity=".45"/>
  ${yeuxFelins(humeur)}
  <!-- nez -->
  <path d="M110 138 C110 132 130 132 130 138 C130 144 124 148 120 150 C116 148 110 144 110 138 Z" fill="#c9635a" stroke="#6b2a20" stroke-width="2"/>
  <ellipse cx="116" cy="138" rx="3.5" ry="2" fill="#fff" opacity=".5"/>
  <path d="M120 150 v6" stroke="#2a1a0c" stroke-width="3" stroke-linecap="round"/>
  ${bouche}
  <!-- moustaches -->
  <g stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".9"><path d="M98 156 C84 152 72 152 60 156 M98 162 C86 162 74 166 64 172 M142 156 C156 152 168 152 180 156 M142 162 C154 162 166 166 176 172"/></g>
  <g fill="#3a220c"><circle cx="102" cy="152" r="1.6"/><circle cx="106" cy="157" r="1.6"/><circle cx="138" cy="152" r="1.6"/><circle cx="134" cy="157" r="1.6"/></g>
  <!-- boucles d'oreilles et barrette -->
  <circle cx="64" cy="170" r="5" fill="#ffd23f" stroke="#c9a200" stroke-width="1.5"/><circle cx="176" cy="170" r="5" fill="#ffd23f" stroke="#c9a200" stroke-width="1.5"/>
  <g transform="translate(150 70) rotate(-20)"><rect x="-12" y="-4" width="24" height="8" rx="4" fill="#e5484d"/><circle r="4" fill="#ffd23f"/></g>
</svg>`;
}

function dessinPanda(humeur) {
  const oeil = (cx, sens) => {
    if (humeur === 'contente') return `<path d="M${cx - 10} 124 q10 -12 20 0" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    return `<g class="yeux">
      <ellipse cx="${cx}" cy="122" rx="10" ry="11" fill="#fff"/>
      <circle cx="${cx + sens}" cy="123" r="7" fill="#3b2a20"/>
      <circle cx="${cx + sens}" cy="123" r="4" fill="#120c08"/>
      <circle cx="${cx + sens + 3}" cy="119" r="2.8" fill="#fff"/><circle cx="${cx + sens - 2}" cy="127" r="1.3" fill="#fff"/>
    </g>`;
  };
  const sourcils = humeur === 'encourage'
    ? `<path d="M80 92 q12 -8 22 -1 M138 91 q10 -7 22 1" stroke="#2a2a30" stroke-width="3.5" fill="none" stroke-linecap="round"/>` : '';
  const bouche = humeur === 'contente'
    ? `<path class="bouche" d="M108 162 q12 18 24 0 q-12 4 -24 0 z" fill="#8a2e3a" stroke="#1d1d22" stroke-width="2.5" stroke-linejoin="round"/><path d="M114 168 q6 5 12 0 q-6 -3 -12 0" fill="#ff8fa3"/>`
    : humeur === 'encourage'
      ? `<path class="bouche" d="M111 163 q9 5 18 0" stroke="#1d1d22" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<path class="bouche" d="M106 158 q7 8 14 1 q7 7 14 -1" stroke="#1d1d22" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  return `<svg class="maitresse-svg" viewBox="0 0 240 300" xmlns="http://www.w3.org/2000/svg" aria-label="Maîtresse Pia la panda">
  <defs>
    <radialGradient id="blancP" cx="50%" cy="38%" r="65%"><stop offset="0" stop-color="#ffffff"/><stop offset=".75" stop-color="#f4f2ee"/><stop offset="1" stop-color="#d9d6d0"/></radialGradient>
    <radialGradient id="noirP" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#4a4a52"/><stop offset="1" stop-color="#1d1d22"/></radialGradient>
    <linearGradient id="robeP" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffb3cf"/><stop offset="1" stop-color="#f28bb3"/></linearGradient>
  </defs>
  <!-- corps rond : bande noire sur les épaules comme un vrai panda -->
  <path d="M20 300 C20 228 62 182 120 180 C178 182 220 228 220 300 Z" fill="url(#noirP)"/>
  <!-- robe rose à pois avec col -->
  <path d="M64 300 C60 250 84 196 120 194 C156 196 180 250 176 300 Z" fill="url(#robeP)"/>
  <g fill="#fff" opacity=".7"><circle cx="92" cy="270" r="3"/><circle cx="120" cy="284" r="3"/><circle cx="148" cy="270" r="3"/><circle cx="104" cy="296" r="3"/><circle cx="138" cy="296" r="3"/><circle cx="120" cy="240" r="3"/><circle cx="96" cy="244" r="3"/><circle cx="144" cy="244" r="3"/></g>
  <path d="M94 200 C100 218 116 218 120 206 C124 218 140 218 146 200 C136 192 104 192 94 200 Z" fill="#fff" stroke="#f0d5df" stroke-width="2"/>
  <!-- pattes noires qui tiennent un livre -->
  <g transform="rotate(5 120 272)">
    <rect x="80" y="254" width="80" height="42" rx="5" fill="#4f8ef7"/><path d="M120 254 v42" stroke="#3568c4" stroke-width="3"/>
    <text x="120" y="281" font-size="16" text-anchor="middle" fill="#fff" font-family="sans-serif" font-weight="bold">1 2 3</text>
  </g>
  <ellipse cx="80" cy="270" rx="15" ry="13" fill="url(#noirP)"/><ellipse cx="160" cy="274" rx="15" ry="13" fill="url(#noirP)"/>
  <!-- oreilles rondes en haut de la tête -->
  <circle cx="70" cy="62" r="24" fill="url(#noirP)"/><circle cx="170" cy="62" r="24" fill="url(#noirP)"/>
  <circle cx="72" cy="64" r="11" fill="#3a3a42"/><circle cx="168" cy="64" r="11" fill="#3a3a42"/>
  <!-- tête : ronde et large, joues pleines -->
  <path d="M120 54 C166 54 194 86 194 124 C194 140 190 152 184 162 C172 184 148 198 120 198 C92 198 68 184 56 162 C50 152 46 140 46 124 C46 86 74 54 120 54 Z" fill="url(#blancP)" stroke="#bdb8b0" stroke-width="2"/>
  <!-- petite touffe -->
  <path d="M112 58 C114 46 122 44 126 50 C128 44 136 46 134 56" fill="url(#blancP)" stroke="#bdb8b0" stroke-width="2" stroke-linejoin="round"/>
  <!-- fleur dans les poils -->
  <g transform="translate(160 64)">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-8" rx="6" ry="9" fill="#ff7eb6" transform="rotate(${a})"/>`).join('')}<circle r="5" fill="#ffd23f"/></g>
  <!-- taches noires en goutte, penchées vers l'extérieur -->
  <path d="M104 108 C108 124 104 146 88 148 C72 150 66 134 72 120 C78 106 100 94 104 108 Z" fill="url(#noirP)"/>
  <path d="M136 108 C132 124 136 146 152 148 C168 150 174 134 168 120 C162 106 140 94 136 108 Z" fill="url(#noirP)"/>
  ${sourcils}
  ${oeil(90, 1)}${oeil(150, -1)}
  <!-- museau clair -->
  <ellipse cx="120" cy="156" rx="26" ry="19" fill="#fbfaf7"/>
  <!-- nez -->
  <path d="M109 144 C109 138 131 138 131 144 C131 150 124 154 120 155 C116 154 109 150 109 144 Z" fill="#1d1d22"/>
  <ellipse cx="115" cy="143" rx="4" ry="2" fill="#fff" opacity=".45"/>
  <path d="M120 155 v4" stroke="#1d1d22" stroke-width="3" stroke-linecap="round"/>
  ${bouche}
  <!-- joues roses -->
  <ellipse cx="72" cy="160" rx="12" ry="7" fill="#ff9fb8" opacity=".75"/><ellipse cx="168" cy="160" rx="12" ry="7" fill="#ff9fb8" opacity=".75"/>
  <!-- cils -->
  ${humeur === 'contente' ? '' : `<path d="M78 113 l-6 -5 M80 108 l-4 -7 M162 113 l6 -5 M160 108 l4 -7" stroke="#1d1d22" stroke-width="2.5" stroke-linecap="round"/>`}
</svg>`;
}

// Choisit une voix féminine française si l'appareil en a une.
function voixMaitresse() {
  if (!('speechSynthesis' in window)) return null;
  const fr = speechSynthesis.getVoices().filter(v => v.lang && v.lang.replace('_', '-').toLowerCase().startsWith('fr'));
  return fr.find(v => /female|femme|amélie|amelie|audrey|marie|julie|léa|lea|céline|celine|virginie|aurélie/i.test(v.name)) || fr[0] || null;
}
