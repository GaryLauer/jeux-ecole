// Dessin de l'animal à élever : la panthère bleu foncé (la grande) et le panda (la petite).
// dessinAnimal(a, options) renvoie un SVG. L'animal change de silhouette à chaque âge
// (bébé, enfant, ado, adulte) et porte les habits choisis dans son armoire.

const STADES = [
  { id: 'bebe', nom: 'Bébé', xp: 0, s: 0.72, H: 70, BX: 50, B: 45, oeil: 1.3, taille: 25 },
  { id: 'enfant', nom: 'Enfant', xp: 10000, s: 0.83, H: 64, BX: 56, B: 55, oeil: 1.15, taille: 45 },
  { id: 'ado', nom: 'Ado', xp: 30000, s: 0.92, H: 58, BX: 61, B: 66, oeil: 1.05, taille: 65 },
  { id: 'adulte', nom: 'Adulte', xp: 70000, s: 1, H: 55, BX: 66, B: 77, oeil: 1, taille: 85 }
];
function stadeDe(xp) { let s = STADES[0]; STADES.forEach(x => { if (xp >= x.xp) s = x; }); return s; }
function rangStade(id) { return STADES.findIndex(s => s.id === id); }

// Toutes les mesures du dessin, dans un repère dont l'origine est entre les pieds de l'animal.
function geometrie(st) {
  const { H, BX, B } = st;
  const hy = -2 * B - 0.62 * H;
  return { H, BX, B, hy, ex: H * 0.37, ey: hy - H * 0.02, r: H * 0.15 * st.oeil, cou: hy + H * 0.98, s: st.s };
}
// Position d'un point du dessin en % de la zone (viewBox 300 × 340, pieds en 150,322).
function pointAnimal(a, ou) {
  const g = geometrie(stadeDe(a.xp));
  const y = { bouche: g.hy + g.H * 0.45, tete: g.hy - g.H * 0.2, yeux: g.ey, corps: -g.B, haut: g.hy - g.H * 1.1 }[ou] || -g.B;
  return { x: 50, y: (322 + y * g.s) / 340 * 100 };
}

const COULEURS_ANIMAL = {
  panthere: { corps: '#233270', clair: '#31449a', ombre: '#141c48', patte: '#233270', ventre: '#3c50a6', museau: '#4a60b8', trait: '#080c26', tache: '#141c4a', sourcil: '#9fb2ff', coussinet: '#5b72cf' },
  panda: { corps: '#fbfbfd', clair: '#ffffff', ombre: '#dcdce6', patte: '#1e1e28', ventre: '#ffffff', museau: '#ffffff', trait: '#1e1e28', tache: '#1e1e28', sourcil: '#555', coussinet: '#4a4a55' }
};

let numeroDessin = 0;
function dessinAnimal(a, o = {}) {
  const st = o.stade || stadeDe(a.xp);
  const g = geometrie(st);
  const { H, BX, B, hy, ex, ey, r } = g;
  const pan = a.espece === 'panda';
  const C = COULEURS_ANIMAL[a.espece];
  const u = 'an' + (++numeroDessin);
  const humeur = o.humeur || 'content';
  const tenue = o.tenue || a.tenue || {};
  const habits = Object.values(tenue).map(id => typeof ARTICLE !== 'undefined' && ARTICLE[id]).filter(x => x && x.dessin).map(x => x.dessin(g, u, C, pan));
  const couche = nom => habits.map(d => d[nom] || '').join('');
  const cotes = f => f(-1) + f(1);

  // Queue, pattes, corps
  const queue = pan
    ? `<circle cx="${BX * 0.82}" cy="${-B * 0.3}" r="${BX * 0.2}" fill="${C.corps}" stroke="${C.ombre}" stroke-width="2"/>`
    : `<path class="queue" d="M${BX * 0.55} ${-B * 0.25} C ${BX * 1.5} ${-B * 0.1}, ${BX * 1.75} ${-B * 1.1}, ${BX * 1.28} ${-B * (st.id === 'bebe' ? 1.25 : 1.6)}" stroke="${C.corps}" stroke-width="${BX * 0.22}" fill="none" stroke-linecap="round"/>
       <circle cx="${BX * 1.28}" cy="${-B * (st.id === 'bebe' ? 1.25 : 1.6)}" r="${BX * 0.11}" fill="${C.ombre}"/>`;
  const corps = `<ellipse cx="0" cy="${-B}" rx="${BX}" ry="${B}" fill="url(#${u}c)"/>
    ${pan ? `<ellipse clip-path="url(#${u}k)" cx="0" cy="${-2 * B + B * 0.22}" rx="${BX * 1.1}" ry="${B * 0.34}" fill="${C.patte}"/>`
    : `<ellipse cx="0" cy="${-B * 0.82}" rx="${BX * 0.58}" ry="${B * 0.62}" fill="${C.ventre}"/>
       ${[[-0.72, -1.25], [0.74, -1.2], [-0.8, -0.6], [0.8, -0.65], [-0.45, -1.7], [0.5, -1.72]].map(([x, y]) => `<circle cx="${x * BX}" cy="${y * B}" r="${BX * 0.07}" fill="none" stroke="${C.tache}" stroke-width="${BX * 0.04}"/>`).join('')}`}`;
  const pieds = cotes(s => `<ellipse cx="${s * BX * 0.48}" cy="${-BX * 0.15}" rx="${BX * 0.36}" ry="${BX * 0.22}" fill="${C.patte}"/>
    ${[-1, 0, 1].map(i => `<ellipse cx="${s * BX * 0.48 + i * BX * 0.14}" cy="${-BX * 0.06}" rx="${BX * 0.06}" ry="${BX * 0.05}" fill="${C.coussinet}"/>`).join('')}`);
  const bras = cotes(s => `<ellipse cx="${s * BX * 0.8}" cy="${-B * 1.22}" rx="${BX * 0.24}" ry="${B * 0.44}" transform="rotate(${s * 15} ${s * BX * 0.8} ${-B * 1.22})" fill="${C.patte}"/>`);

  // Couche de bébé (sale ou propre)
  const couchette = st.id === 'bebe' ? `<g clip-path="url(#${u}k)"><rect x="${-BX}" y="${-B * 0.62}" width="${BX * 2}" height="${B * 0.7}" fill="${a.couche ? '#e8d9a8' : '#ffffff'}" stroke="#d6d6e0" stroke-width="2"/>
    <rect x="${-BX}" y="${-B * 0.66}" width="${BX * 2}" height="${B * 0.08}" fill="${a.couche ? '#d9c486' : '#9fd3ff'}"/>
    ${cotes(s => `<rect x="${s * BX * 0.55 - BX * 0.1}" y="${-B * 0.6}" width="${BX * 0.2}" height="${B * 0.12}" rx="3" fill="#ffd23f"/>`)}</g>` : '';

  // Tête
  const oreilles = pan
    ? cotes(s => `<circle cx="${s * H * 0.8}" cy="${hy - H * 0.72}" r="${H * 0.32}" fill="${C.patte}"/><circle cx="${s * H * 0.8}" cy="${hy - H * 0.72}" r="${H * 0.15}" fill="#3b3b47"/>`)
    : cotes(s => { const x = s * H * 0.72, y = hy - H * 0.66; return `<path d="M${x - H * 0.3} ${y + H * 0.2} Q ${x + s * H * 0.06} ${y - H * 0.62} ${x + H * 0.3} ${y + H * 0.2} Z" fill="${C.corps}"/><path d="M${x - H * 0.16} ${y + H * 0.12} Q ${x + s * H * 0.04} ${y - H * 0.34} ${x + H * 0.16} ${y + H * 0.12} Z" fill="#6c5aa8"/>`; });
  const tete = `<ellipse cx="0" cy="${hy}" rx="${H * (pan ? 1.04 : 1.08)}" ry="${H}" fill="url(#${u}t)"/>
    ${st.id === 'bebe' ? `<path d="M${-H * 0.1} ${hy - H * 0.94} q ${H * 0.02} ${-H * 0.3} ${H * 0.26} ${-H * 0.2} q ${-H * 0.14} ${H * 0.01} ${-H * 0.1} ${H * 0.2} z" fill="${pan ? C.patte : C.corps}"/>` : ''}
    ${pan ? cotes(s => `<ellipse cx="${s * ex}" cy="${ey + H * 0.04}" rx="${H * 0.23}" ry="${H * 0.31}" transform="rotate(${s * -32} ${s * ex} ${ey + H * 0.04})" fill="${C.patte}"/>`)
    : `<circle cx="0" cy="${hy - H * 0.62}" r="${H * 0.06}" fill="${C.tache}"/>${cotes(s => `<circle cx="${s * H * 0.2}" cy="${hy - H * 0.55}" r="${H * 0.05}" fill="${C.tache}"/><circle cx="${s * H * 0.78}" cy="${hy - H * 0.1}" r="${H * 0.05}" fill="${C.tache}"/>`)}`}
    ${pan ? '' : `<ellipse cx="0" cy="${hy + H * 0.4}" rx="${H * 0.44}" ry="${H * 0.3}" fill="${C.museau}"/>`}`;

  // Yeux selon l'humeur
  const couleurFerme = pan ? '#e6e6ee' : C.trait;
  const oeil = s => {
    const x = s * ex;
    if (humeur === 'joie' || humeur === 'mange') return `<path d="M${x - r} ${ey + r * 0.3} Q ${x} ${ey - r * 1.1} ${x + r} ${ey + r * 0.3}" stroke="${couleurFerme}" stroke-width="${H * 0.06}" fill="none" stroke-linecap="round"/>`;
    if (humeur === 'dort') return `<path d="M${x - r} ${ey} Q ${x} ${ey + r * 0.9} ${x + r} ${ey}" stroke="${couleurFerme}" stroke-width="${H * 0.055}" fill="none" stroke-linecap="round"/>`;
    const ouvert = pan
      ? `<circle cx="${x}" cy="${ey}" r="${r}" fill="#fff"/><circle cx="${x}" cy="${ey + r * 0.1}" r="${r * 0.72}" fill="#2a1a10"/>`
      : `<circle cx="${x}" cy="${ey}" r="${r}" fill="url(#${u}i)"/><ellipse cx="${x}" cy="${ey}" rx="${r * 0.32}" ry="${r * 0.78}" fill="#0a0d24"/>`;
    const reflets = `<circle cx="${x + r * 0.35}" cy="${ey - r * 0.38}" r="${r * 0.3}" fill="#fff"/><circle cx="${x - r * 0.35}" cy="${ey + r * 0.35}" r="${r * 0.13}" fill="#fff"/>`;
    const paupiere = humeur === 'malade' ? `<path d="M${x - r * 1.15} ${ey - r * 0.05} A ${r * 1.15} ${r * 1.15} 0 0 1 ${x + r * 1.15} ${ey - r * 0.05} Z" fill="${pan ? C.patte : C.corps}"/>` : '';
    return ouvert + reflets + paupiere;
  };
  const sourcils = humeur === 'triste' || humeur === 'malade'
    ? cotes(s => `<path d="M${s * (ex + r * 1.1)} ${ey - r * 1.5} L ${s * (ex - r * 0.6)} ${ey - r * 2.1}" stroke="${C.sourcil}" stroke-width="${H * 0.045}" stroke-linecap="round"/>`) : '';
  const larme = humeur === 'triste' ? `<path class="larme" d="M${ex + r * 0.2} ${ey + r * 1.2} q ${-r * 0.35} ${r * 0.6} 0 ${r * 0.8} q ${r * 0.35} ${-r * 0.2} 0 ${-r * 0.8} z" fill="#7cc4ff"/>` : '';

  // Nez, bouche, joues, moustaches
  const ny = hy + H * 0.24, my = hy + H * 0.44;
  const nez = pan
    ? `<ellipse cx="0" cy="${ny}" rx="${H * 0.13}" ry="${H * 0.085}" fill="${C.trait}"/><ellipse cx="${-H * 0.04}" cy="${ny - H * 0.03}" rx="${H * 0.04}" ry="${H * 0.02}" fill="#777"/>`
    : `<path d="M${-H * 0.11} ${ny - H * 0.05} Q 0 ${ny - H * 0.1} ${H * 0.11} ${ny - H * 0.05} Q ${H * 0.02} ${ny + H * 0.1} 0 ${ny + H * 0.08} Q ${-H * 0.02} ${ny + H * 0.1} ${-H * 0.11} ${ny - H * 0.05} Z" fill="#1a1f4a"/><ellipse cx="${-H * 0.03}" cy="${ny - H * 0.04}" rx="${H * 0.035}" ry="${H * 0.018}" fill="#7d8ad6"/>`;
  const t = C.trait, w = H * 0.045;
  const bouches = {
    content: `<path d="M0 ${ny + H * 0.08} V ${my - H * 0.02} M${-H * 0.16} ${my - H * 0.03} Q ${-H * 0.08} ${my + H * 0.09} 0 ${my - H * 0.02} Q ${H * 0.08} ${my + H * 0.09} ${H * 0.16} ${my - H * 0.03}" stroke="${t}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`,
    joie: `<path d="M${-H * 0.19} ${my - H * 0.04} Q 0 ${my + H * 0.34} ${H * 0.19} ${my - H * 0.04} Z" fill="#7a1f3d" stroke="${t}" stroke-width="${w * 0.7}" stroke-linejoin="round"/><path d="M${-H * 0.09} ${my + H * 0.14} Q 0 ${my + H * 0.05} ${H * 0.09} ${my + H * 0.14} Q 0 ${my + H * 0.24} ${-H * 0.09} ${my + H * 0.14}" fill="#ff8fa8"/>`,
    triste: `<path d="M${-H * 0.14} ${my + H * 0.1} Q 0 ${my - H * 0.05} ${H * 0.14} ${my + H * 0.1}" stroke="${t}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`,
    dort: `<path d="M${-H * 0.07} ${my + H * 0.03} Q 0 ${my + H * 0.07} ${H * 0.07} ${my + H * 0.03}" stroke="${t}" stroke-width="${w * 0.8}" fill="none" stroke-linecap="round"/>`,
    mange: `<ellipse class="machoire" cx="0" cy="${my + H * 0.05}" rx="${H * 0.11}" ry="${H * 0.12}" fill="#7a1f3d" stroke="${t}" stroke-width="${w * 0.7}"/>`,
    malade: `<path d="M${-H * 0.12} ${my + H * 0.06} q ${H * 0.06} ${-H * 0.06} ${H * 0.12} 0 q ${H * 0.06} ${H * 0.06} ${H * 0.12} 0" stroke="${t}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`
  };
  const bouche = bouches[humeur] || bouches.content;
  const joues = cotes(s => `<ellipse cx="${s * H * 0.62}" cy="${hy + H * 0.33}" rx="${H * 0.13}" ry="${H * 0.09}" fill="${humeur === 'malade' ? '#8fdc6a' : '#ff8fb3'}" opacity="${humeur === 'malade' ? 0.85 : pan ? 0.55 : 0.45}"/>`);
  const moustaches = pan ? '' : cotes(s => [-0.06, 0.04, 0.14].map(d => `<path d="M${s * H * 0.36} ${hy + H * (0.36 + d)} q ${s * H * 0.3} ${-H * 0.04} ${s * H * 0.62} ${H * d * 1.6}" stroke="#aebcff" stroke-width="${H * 0.018}" fill="none" stroke-linecap="round"/>`).join(''));

  // Saleté, odeur, pansement, thermomètre, étincelles
  const nbTaches = o.taches !== undefined ? o.taches : a.proprete < 70 ? Math.min(6, Math.ceil((70 - a.proprete) / 10)) : 0;
  const PLACES = [[-0.35 * H, hy - 0.45 * H, H * 0.1], [0.5 * BX, -1.25 * B, BX * 0.12], [-0.45 * BX, -0.55 * B, BX * 0.14], [0.55 * H, hy + 0.05 * H, H * 0.08], [0.1 * BX, -1.6 * B, BX * 0.1], [-0.6 * BX, -1.45 * B, BX * 0.11]];
  const taches = PLACES.slice(0, nbTaches).map(([x, y, rr], i) => `<ellipse class="tache" cx="${x}" cy="${y}" rx="${rr * 1.2}" ry="${rr}" fill="#7a5230" opacity=".75" transform="rotate(${i * 37} ${x} ${y})"/>`).join('');
  const odeur = a.proprete < 30 || a.couche || a.cacas >= 2 ? [-1, 0, 1].map(i => `<path class="odeur" style="animation-delay:${i * 0.4 + 0.4}s" d="M${i * H * 0.6} ${hy - H * 1.15} q ${H * 0.12} ${-H * 0.12} 0 ${-H * 0.24} q ${-H * 0.12} ${-H * 0.12} 0 ${-H * 0.24}" stroke="#8bbf4a" stroke-width="${H * 0.05}" fill="none" stroke-linecap="round"/>`).join('') : '';
  const pansement = a.pansement > Date.now() ? `<g transform="rotate(-25 ${H * 0.62} ${hy - H * 0.35})"><rect x="${H * 0.42}" y="${hy - H * 0.43}" width="${H * 0.4}" height="${H * 0.16}" rx="${H * 0.06}" fill="#f5c89a"/><rect x="${H * 0.56}" y="${hy - H * 0.43}" width="${H * 0.12}" height="${H * 0.16}" fill="#e8b07a"/></g>` : '';
  const thermo = o.thermo ? `<g transform="rotate(-30 ${H * 0.1} ${my})"><rect x="${H * 0.05}" y="${my - H * 0.03}" width="${H * 0.55}" height="${H * 0.07}" rx="${H * 0.035}" fill="#fff" stroke="#999"/><circle cx="${H * 0.62}" cy="${my + H * 0.005}" r="${H * 0.06}" fill="#e5484d"/><rect x="${H * 0.3}" y="${my - H * 0.005}" width="${H * 0.3}" height="${H * 0.025}" fill="#e5484d"/></g>` : '';
  const brille = a.brille > Date.now() ? [[-1.1 * H, hy - 0.4 * H], [1.15 * H, hy + 0.2 * H], [-1.1 * BX, -1.2 * B], [1.1 * BX, -0.6 * B]].map(([x, y], i) => `<text class="etincelle" style="animation-delay:${i * 0.5}s" x="${x}" y="${y}" font-size="${H * 0.35}" text-anchor="middle" dominant-baseline="central">✨</text>`).join('') : '';

  // Lit et couverture quand il dort
  const lit = o.dort ? `<ellipse cx="0" cy="${-BX * 0.05}" rx="${BX * 1.9}" ry="${BX * 0.35}" fill="#8e5cd9"/><ellipse cx="0" cy="${-BX * 0.12}" rx="${BX * 1.7}" ry="${BX * 0.25}" fill="#b691f0"/>` : '';
  const couverture = o.dort ? `<path d="M${-BX * 1.35} ${-2} L ${-BX * 1.25} ${-B * 1.05} Q 0 ${-B * 1.3} ${BX * 1.25} ${-B * 1.05} L ${BX * 1.35} ${-2} Z" fill="url(#${u}d)" stroke="#e58ab8" stroke-width="3"/><path d="M${-BX * 1.25} ${-B * 1.05} Q 0 ${-B * 1.3} ${BX * 1.25} ${-B * 1.05}" stroke="#fff" stroke-width="${B * 0.1}" fill="none" stroke-linecap="round"/>` : '';

  // Cadre serré (aperçus de la boutique) : juste l'animal, avec la place pour un chapeau ou des ailes.
  const larg = Math.max(H * 1.2, BX * 1.6) * g.s, haut = 322 + (hy - H * 1.55) * g.s;
  const vb = o.serre ? `${150 - larg} ${haut} ${larg * 2} ${334 - haut}` : '0 0 300 340';
  return `<svg class="animal-svg ${o.classe || ''}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-label="${echapper(a.nom || '')}">
  <defs>
    <radialGradient id="${u}c" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="${C.clair}"/><stop offset=".75" stop-color="${C.corps}"/><stop offset="1" stop-color="${C.ombre}"/></radialGradient>
    <radialGradient id="${u}t" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="${C.clair}"/><stop offset=".8" stop-color="${C.corps}"/><stop offset="1" stop-color="${C.ombre}"/></radialGradient>
    <radialGradient id="${u}i" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fff39a"/><stop offset=".55" stop-color="#ffc928"/><stop offset="1" stop-color="#d98a00"/></radialGradient>
    <pattern id="${u}d" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#ffc2dc"/><circle cx="6" cy="6" r="3" fill="#fff"/><circle cx="18" cy="18" r="3" fill="#fff"/></pattern>
    <clipPath id="${u}k"><ellipse cx="0" cy="${-B}" rx="${BX}" ry="${B}"/></clipPath>
    ${couche('defs')}
  </defs>
  <g transform="translate(150 322) scale(${g.s})"><g class="animal-corps">
    ${lit}
    <g class="balance">${queue}</g>
    ${couche('arriere')}
    ${corps}
    ${couchette}
    ${couche('corps')}
    ${couche('jupe')}
    ${pieds}
    ${couche('pieds')}
    ${bras}
    ${couche('manches')}
    ${couverture}
    <g class="tete-animal">
      ${oreilles}${tete}
      <g class="yeux-animal">${cotes(oeil)}</g>
      ${sourcils}${larme}${joues}${moustaches}${nez}${bouche}${pansement}${thermo}
      ${couche('cou')}${couche('yeux')}${couche('tete')}
    </g>
    ${taches}${odeur}${brille}
  </g></g>
</svg>`;
}

// Petites aides pour dessiner les habits
function emojiSvg(e, x, y, taille, rot = 0) {
  return `<text x="${x}" y="${y}" font-size="${taille}" text-anchor="middle" dominant-baseline="central" transform="rotate(${rot} ${x} ${y})">${e}</text>`;
}
function hautDeCorps(g, u, fill, hauteur = 1.05, col = true, C) {
  const { BX, B } = g;
  return `<g clip-path="url(#${u}k)"><rect x="${-BX}" y="${-2 * B}" width="${2 * BX}" height="${B * hauteur}" fill="${fill}"/>
    <rect x="${-BX}" y="${-2 * B + B * hauteur - 5}" width="${2 * BX}" height="5" fill="rgba(0,0,0,.18)"/>
    ${col ? `<ellipse cx="0" cy="${-2 * B}" rx="${BX * 0.32}" ry="${B * 0.2}" fill="${C.corps}"/>` : ''}</g>`;
}
function manchesCourtes(g, fill) {
  const { BX, B } = g;
  return [-1, 1].map(s => `<ellipse cx="${s * BX * 0.8}" cy="${-B * 1.52}" rx="${BX * 0.29}" ry="${B * 0.2}" transform="rotate(${s * 15} ${s * BX * 0.8} ${-B * 1.52})" fill="${fill}"/>`).join('');
}
function manchesLongues(g, fill) {
  const { BX, B } = g;
  return [-1, 1].map(s => `<ellipse cx="${s * BX * 0.8}" cy="${-B * 1.3}" rx="${BX * 0.25}" ry="${B * 0.37}" transform="rotate(${s * 15} ${s * BX * 0.8} ${-B * 1.3})" fill="${fill}"/>`).join('');
}
function jupeEvasee(g, fill, large = 1.2, haut = 0.95) {
  const { BX, B } = g;
  return `<path d="M${-BX * 0.86} ${-B * haut} L ${BX * 0.86} ${-B * haut} L ${BX * large} ${-4} Q 0 ${B * 0.12} ${-BX * large} ${-4} Z" fill="${fill}"/>`;
}
function lunettes(g, verre) {
  const { ex, ey, r } = g;
  return [-1, 1].map(s => verre(s * ex, ey, r * 1.55)).join('') + `<path d="M${-ex + r * 1.4} ${ey - r * 0.3} Q 0 ${ey - r * 0.9} ${ex - r * 1.4} ${ey - r * 0.3}" stroke="#3a2a1a" stroke-width="${g.H * 0.04}" fill="none"/>`;
}
function coeur(x, y, t) {
  return `M${x} ${y + t * 0.9} C ${x - t * 1.6} ${y - t * 0.2}, ${x - t * 0.8} ${y - t * 1.3}, ${x} ${y - t * 0.45} C ${x + t * 0.8} ${y - t * 1.3}, ${x + t * 1.6} ${y - t * 0.2}, ${x} ${y + t * 0.9} Z`;
}
function etoileChemin(x, y, R) {
  let d = '';
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? R * 0.45 : R; d += `${i ? 'L' : 'M'}${x + Math.cos(a) * rr} ${y + Math.sin(a) * rr} `; }
  return d + 'Z';
}

// Dessin de chaque habit, rangé par couche (arriere, corps, jupe, pieds, manches, cou, yeux, tete, defs).
const DESSINS_HABITS = {
  // Tête
  noeud: g => ({ tete: emojiSvg('🎀', g.H * 0.58, g.hy - g.H * 0.78, g.H * 0.55, 18) }),
  casquette: g => ({ tete: emojiSvg('🧢', 0, g.hy - g.H * 0.85, g.H * 1.05) }),
  paille: g => ({ tete: emojiSvg('👒', 0, g.hy - g.H * 0.92, g.H * 1.15) }),
  hautdeforme: g => ({ tete: emojiSvg('🎩', 0, g.hy - g.H * 1.12, g.H * 0.95) }),
  fleurs: g => ({ tete: [-150, -122, -90, -58, -30].map(d => { const a = d * Math.PI / 180; return emojiSvg(['🌸', '🌼', '🌸', '🌼', '🌸'][(d + 150) / 30 | 0] || '🌸', Math.cos(a) * g.H * 0.9, g.hy + Math.sin(a) * g.H * 0.9, g.H * 0.32); }).join('') }),
  couronne: g => ({ tete: emojiSvg('👑', 0, g.hy - g.H * 1.05, g.H * 0.8) }),
  licorne: (g, u) => ({
    defs: `<linearGradient id="${u}or" x1="0" x2="1"><stop offset="0" stop-color="#ffe066"/><stop offset=".5" stop-color="#fff6c2"/><stop offset="1" stop-color="#f0b400"/></linearGradient>`,
    tete: `<path d="M${-g.H * 0.14} ${g.hy - g.H * 0.82} L 0 ${g.hy - g.H * 1.55} L ${g.H * 0.14} ${g.hy - g.H * 0.82} Z" fill="url(#${u}or)" stroke="#e0a800" stroke-width="2"/>
      ${[0.2, 0.4, 0.6].map(k => `<path d="M${-g.H * 0.14 * (1 - k)} ${g.hy - g.H * (0.82 + 0.73 * k)} l ${g.H * 0.28 * (1 - k)} ${g.H * 0.08}" stroke="#e0a800" stroke-width="2"/>`).join('')}`
  }),
  // Lunettes
  'lunettes-rondes': g => ({ yeux: lunettes(g, (x, y, R) => `<circle cx="${x}" cy="${y}" r="${R}" fill="rgba(200,230,255,.25)" stroke="#3a2a1a" stroke-width="${g.H * 0.05}"/>`) }),
  'lunettes-soleil': g => ({ yeux: lunettes(g, (x, y, R) => `<rect x="${x - R * 1.1}" y="${y - R * 0.8}" width="${R * 2.2}" height="${R * 1.6}" rx="${R * 0.5}" fill="#161616" stroke="#3a2a1a" stroke-width="${g.H * 0.04}"/><path d="M${x - R * 0.6} ${y - R * 0.4} l ${R * 0.5} 0" stroke="#fff" stroke-width="${g.H * 0.03}" opacity=".6"/>`) }),
  'lunettes-coeur': g => ({ yeux: lunettes(g, (x, y, R) => `<path d="${coeur(x, y, R * 0.95)}" fill="rgba(255,95,162,.75)" stroke="#d6246e" stroke-width="${g.H * 0.035}"/>`) }),
  'lunettes-etoile': g => ({ yeux: lunettes(g, (x, y, R) => `<path d="${etoileChemin(x, y, R * 1.3)}" fill="rgba(255,210,63,.85)" stroke="#e0a800" stroke-width="${g.H * 0.035}" stroke-linejoin="round"/>`) }),
  // Cou
  papillon: g => { const n = g.cou, H = g.H; return { cou: `<path d="M0 ${n} L ${-H * 0.3} ${n - H * 0.15} L ${-H * 0.3} ${n + H * 0.15} Z M0 ${n} L ${H * 0.3} ${n - H * 0.15} L ${H * 0.3} ${n + H * 0.15} Z" fill="#8e5cd9" stroke="#5e3a9c" stroke-width="2" stroke-linejoin="round"/><circle cy="${n}" r="${H * 0.08}" fill="#b691f0"/>` }; },
  echarpe: (g, u) => { const n = g.cou, H = g.H; return {
    defs: `<pattern id="${u}e" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#e5484d"/><rect width="7" height="14" fill="#fff"/></pattern>`,
    cou: `<rect x="${H * 0.18}" y="${n}" width="${H * 0.24}" height="${H * 0.7}" rx="5" fill="url(#${u}e)" transform="rotate(-10 ${H * 0.3} ${n})"/><ellipse cy="${n}" rx="${H * 0.66}" ry="${H * 0.15}" fill="url(#${u}e)"/>` }; },
  perles: g => { const n = g.cou, H = g.H; let s = ''; for (let i = 0; i <= 8; i++) { const a = (25 + i * 16.25) * Math.PI / 180; s += `<circle cx="${Math.cos(a) * H * 0.55}" cy="${n - H * 0.38 + Math.sin(a) * H * 0.55}" r="${H * 0.065}" fill="#fff" stroke="#d9cfe8" stroke-width="1.5"/>`; } return { cou: s }; },
  bandana: g => { const n = g.cou, H = g.H; return { cou: `<path d="M${-H * 0.52} ${n - H * 0.08} L ${H * 0.52} ${n - H * 0.08} L 0 ${n + H * 0.5} Z" fill="#e5484d" stroke="#b8363a" stroke-width="2" stroke-linejoin="round"/>${[[-0.2, 0.05], [0.2, 0.05], [0, 0.25]].map(([x, y]) => `<circle cx="${x * H}" cy="${n + y * H}" r="${H * 0.04}" fill="#fff"/>`).join('')}` }; },
  medaille: g => { const n = g.cou, H = g.H; return { cou: `<path d="M${-H * 0.32} ${n - H * 0.1} L 0 ${n + H * 0.38} L ${H * 0.32} ${n - H * 0.1}" stroke="#4f8ef7" stroke-width="${H * 0.1}" fill="none" stroke-linejoin="round"/><circle cy="${n + H * 0.45}" r="${H * 0.17}" fill="#ffd23f" stroke="#e0a800" stroke-width="3"/><text y="${n + H * 0.46}" font-size="${H * 0.2}" text-anchor="middle" dominant-baseline="central" fill="#a87a00" font-weight="bold" font-family="sans-serif">1</text>` }; },
  // Corps
  tshirt: (g, u, C) => ({ corps: hautDeCorps(g, u, '#e5484d', 1.05, true, C) + emojiSvg('⭐', 0, -g.B * 1.45, g.B * 0.32), manches: manchesCourtes(g, '#e5484d') }),
  pull: (g, u, C) => ({
    defs: `<pattern id="${u}r" width="20" height="16" patternUnits="userSpaceOnUse"><rect width="20" height="16" fill="#ffd23f"/><rect width="20" height="8" fill="#3bb273"/></pattern>`,
    corps: hautDeCorps(g, u, `url(#${u}r)`, 1.3, true, C), manches: manchesLongues(g, `url(#${u}r)`)
  }),
  salopette: (g, u) => { const { BX, B } = g; return { corps: `<g clip-path="url(#${u}k)"><rect x="${-BX * 0.42}" y="${-B * 1.55}" width="${BX * 0.84}" height="${B * 1.6}" fill="#3d6fd8"/><rect x="${-BX}" y="${-B * 0.95}" width="${BX * 2}" height="${B}" fill="#3d6fd8"/>
      <rect x="${-BX * 0.2}" y="${-B * 1.35}" width="${BX * 0.4}" height="${B * 0.3}" rx="4" fill="#2f59b3"/>
      ${[-1, 1].map(s => `<path d="M${s * BX * 0.36} ${-B * 1.52} L ${s * BX * 0.5} ${-2 * B}" stroke="#3d6fd8" stroke-width="${BX * 0.14}"/><circle cx="${s * BX * 0.33}" cy="${-B * 1.47}" r="${BX * 0.06}" fill="#ffd23f"/>`).join('')}</g>` }; },
  pyjama: (g, u, C) => ({
    defs: `<pattern id="${u}p" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="30" height="30" fill="#7aa6ff"/><path d="${etoileChemin(8, 8, 5)} ${etoileChemin(23, 22, 4)}" fill="#fff6a8"/></pattern>`,
    corps: hautDeCorps(g, u, `url(#${u}p)`, 2, true, C), manches: manchesLongues(g, `url(#${u}p)`)
  }),
  robe: (g, u, C) => ({
    defs: `<pattern id="${u}o" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#ff7eb6"/><circle cx="6" cy="6" r="3.5" fill="#fff"/><circle cx="17" cy="17" r="3.5" fill="#fff"/></pattern>`,
    corps: hautDeCorps(g, u, `url(#${u}o)`, 1.1, true, C), jupe: jupeEvasee(g, `url(#${u}o)`), manches: manchesCourtes(g, `url(#${u}o)`)
  }),
  tutu: (g, u, C) => {
    const { BX, B } = g, y0 = -B * 0.85;
    const zig = (dy, k, fill) => { let d = `M${-BX * k} ${y0 + dy}`; for (let i = 0; i <= 12; i++) d += ` L ${-BX * k + i * BX * k / 6} ${y0 + dy + (i % 2 ? B * 0.28 : B * 0.06)}`; return `<path d="${d} L ${BX * k} ${y0 - B * 0.08} L ${-BX * k} ${y0 - B * 0.08} Z" fill="${fill}"/>`; };
    return { corps: hautDeCorps(g, u, '#ffc2dc', 1.12, true, C), jupe: zig(0, 1.3, '#ff9ccc') + zig(-B * 0.06, 1.18, '#ffd1e8') + `<rect x="${-BX * 0.95}" y="${y0 - B * 0.12}" width="${BX * 1.9}" height="${B * 0.1}" rx="4" fill="#ff5fa2"/>` };
  },
  princesse: (g, u, C) => {
    const { BX, B } = g;
    let volants = ''; for (let i = 0; i < 7; i++) volants += `<circle cx="${-BX * 1.4 + i * BX * 0.467}" cy="${-6}" r="${BX * 0.24}" fill="#e2b4ff"/>`;
    return {
      defs: `<linearGradient id="${u}q" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f7b8ff"/><stop offset="1" stop-color="#b06cff"/></linearGradient>`,
      corps: hautDeCorps(g, u, `url(#${u}q)`, 1.1, true, C),
      jupe: volants + jupeEvasee(g, `url(#${u}q)`, 1.45) + `<rect x="${-BX * 0.88}" y="${-B * 1.0}" width="${BX * 1.76}" height="${B * 0.1}" rx="4" fill="#ffd23f"/>` + [[-0.6, -0.5], [0.5, -0.35], [-0.1, -0.2], [0.9, -0.12], [-1.0, -0.15]].map(([x, y]) => emojiSvg('✨', x * BX, y * B, B * 0.18)).join(''),
      manches: [-1, 1].map(s => `<circle cx="${s * BX * 0.82}" cy="${-B * 1.55}" r="${BX * 0.26}" fill="#f7b8ff"/>`).join('')
    };
  },
  // Dos
  cape: g => { const { BX, B } = g; return { arriere: `<path d="M${-BX * 0.75} ${-2 * B + B * 0.12} Q ${-BX * 1.55} ${-B} ${-BX * 1.45} ${-2} L ${BX * 1.45} ${-2} Q ${BX * 1.55} ${-B} ${BX * 0.75} ${-2 * B + B * 0.12} Z" fill="#e5484d"/>`, cou: `${[-1, 1].map(s => `<circle cx="${s * g.H * 0.5}" cy="${g.cou - g.H * 0.05}" r="${g.H * 0.09}" fill="#ffd23f" stroke="#e0a800" stroke-width="2"/>`).join('')}` }; },
  ailes: g => { const { BX, B } = g; return { arriere: [-1, 1].map(s => `<ellipse cx="${s * BX * 1.1}" cy="${-B * 1.6}" rx="${BX * 0.6}" ry="${B * 0.42}" transform="rotate(${s * -30} ${s * BX * 1.1} ${-B * 1.6})" fill="#cfe8ff" stroke="#fff" stroke-width="4" opacity=".9"/><ellipse cx="${s * BX * 1.0}" cy="${-B * 0.95}" rx="${BX * 0.4}" ry="${B * 0.28}" transform="rotate(${s * 25} ${s * BX} ${-B * 0.95})" fill="#ffd6f0" stroke="#fff" stroke-width="4" opacity=".9"/>`).join('') }; },
  sac: g => { const { BX, B } = g; return { arriere: `<rect x="${-BX * 1.08}" y="${-B * 1.85}" width="${BX * 2.16}" height="${B * 1.15}" rx="${BX * 0.3}" fill="#3bb273"/>`, manches: [-1, 1].map(s => `<path d="M${s * BX * 0.42} ${-2 * B + B * 0.08} L ${s * BX * 0.55} ${-B * 0.95}" stroke="#2a8f59" stroke-width="${BX * 0.13}" stroke-linecap="round"/>`).join('') }; },
  // Cadeaux du cours journalier (on ne peut pas les acheter)
  diademe: (g, u) => { const H = g.H, y = g.hy - g.H * 0.8; return {
    defs: `<linearGradient id="${u}dd" x1="0" x2="1"><stop offset="0" stop-color="#ffe066"/><stop offset=".5" stop-color="#fff6c2"/><stop offset="1" stop-color="#f0b400"/></linearGradient>`,
    tete: `<path d="M${-H * 0.52} ${y} L ${-H * 0.36} ${y - H * 0.3} L ${-H * 0.18} ${y - H * 0.1} L 0 ${y - H * 0.46} L ${H * 0.18} ${y - H * 0.1} L ${H * 0.36} ${y - H * 0.3} L ${H * 0.52} ${y} Q 0 ${y + H * 0.14} ${-H * 0.52} ${y} Z" fill="url(#${u}dd)" stroke="#e0a800" stroke-width="2" stroke-linejoin="round"/>
      <path d="${etoileChemin(0, y - H * 0.46, H * 0.13)}" fill="#ff5fa2" stroke="#d6246e" stroke-width="1.5"/>
      ${[-1, 1].map(s => `<circle cx="${s * H * 0.36}" cy="${y - H * 0.3}" r="${H * 0.07}" fill="#4fd1ff" stroke="#1c8fc0" stroke-width="1.5"/>`).join('')}
      <circle cx="0" cy="${y - H * 0.02}" r="${H * 0.06}" fill="#8e5cd9"/>`
  }; },
  'lunettes-diamant': g => ({ yeux: lunettes(g, (x, y, R) => `<path d="M${x} ${y - R * 1.05} L ${x + R * 1.15} ${y} L ${x} ${y + R * 1.05} L ${x - R * 1.15} ${y} Z" fill="rgba(120,220,255,.75)" stroke="#1c8fc0" stroke-width="${g.H * 0.035}" stroke-linejoin="round"/><path d="M${x - R * 0.45} ${y - R * 0.35} l ${R * 0.3} -${R * 0.3}" stroke="#fff" stroke-width="${g.H * 0.03}"/>`) }),
  'collier-etoile': g => { const n = g.cou, H = g.H; let s = ''; for (let i = 0; i <= 8; i++) { const a = (25 + i * 16.25) * Math.PI / 180; s += `<circle cx="${Math.cos(a) * H * 0.55}" cy="${n - H * 0.38 + Math.sin(a) * H * 0.55}" r="${H * 0.05}" fill="#ffd23f" stroke="#e0a800" stroke-width="1"/>`; }
    return { cou: s + `<path d="${etoileChemin(0, n + H * 0.3, H * 0.24)}" fill="#ffd23f" stroke="#e0a800" stroke-width="2.5" stroke-linejoin="round"/>` }; },
  'cape-etoiles': (g, u) => { const { BX, B } = g; return {
    defs: `<pattern id="${u}ce" width="34" height="34" patternUnits="userSpaceOnUse"><rect width="34" height="34" fill="#5b2fb0"/><path d="${etoileChemin(9, 9, 6)} ${etoileChemin(26, 25, 4.5)}" fill="#ffd23f"/></pattern>`,
    arriere: `<path d="M${-BX * 0.75} ${-2 * B + B * 0.12} Q ${-BX * 1.6} ${-B} ${-BX * 1.5} ${-2} L ${BX * 1.5} ${-2} Q ${BX * 1.6} ${-B} ${BX * 0.75} ${-2 * B + B * 0.12} Z" fill="url(#${u}ce)" stroke="#ffd23f" stroke-width="4"/>`,
    cou: `${[-1, 1].map(s => `<path d="${etoileChemin(s * g.H * 0.5, g.cou - g.H * 0.05, g.H * 0.13)}" fill="#ffd23f" stroke="#e0a800" stroke-width="2"/>`).join('')}` }; },
  'ailes-or': g => { const { BX, B } = g; return { arriere: [-1, 1].map(s => `<ellipse cx="${s * BX * 1.15}" cy="${-B * 1.6}" rx="${BX * 0.66}" ry="${B * 0.45}" transform="rotate(${s * -30} ${s * BX * 1.15} ${-B * 1.6})" fill="#ffe27a" stroke="#fff6c2" stroke-width="4"/><ellipse cx="${s * BX * 1.02}" cy="${-B * 0.95}" rx="${BX * 0.44}" ry="${B * 0.3}" transform="rotate(${s * 25} ${s * BX * 1.02} ${-B * 0.95})" fill="#ffc94d" stroke="#fff6c2" stroke-width="4"/>${emojiSvg('✨', s * BX * 1.3, -B * 1.75, B * 0.22)}`).join('') }; },
  // Pieds
  baskets: g => { const { BX } = g; return { pieds: [-1, 1].map(s => `<ellipse cx="${s * BX * 0.48}" cy="${-BX * 0.15}" rx="${BX * 0.39}" ry="${BX * 0.24}" fill="#fff" stroke="#e5484d" stroke-width="3"/><path d="M${s * BX * 0.48 - BX * 0.36} ${-BX * 0.08} q ${BX * 0.36} ${BX * 0.14} ${BX * 0.72} 0" stroke="#e5484d" stroke-width="${BX * 0.07}" fill="none"/>${[-0.1, 0.05].map(d => `<path d="M${s * BX * 0.48 - BX * 0.1} ${-BX * (0.24 - d)} l ${BX * 0.2} 0" stroke="#4f8ef7" stroke-width="3"/>`).join('')}`).join('') }; },
  bottes: g => { const { BX } = g; return { pieds: [-1, 1].map(s => `<rect x="${s * BX * 0.48 - BX * 0.36}" y="${-BX * 0.5}" width="${BX * 0.72}" height="${BX * 0.46}" rx="${BX * 0.18}" fill="#ffd23f" stroke="#e0a800" stroke-width="3"/><rect x="${s * BX * 0.48 - BX * 0.38}" y="${-BX * 0.54}" width="${BX * 0.76}" height="${BX * 0.1}" rx="4" fill="#e0a800"/>`).join('') }; },
  chaussons: g => { const { BX } = g; return { pieds: [-1, 1].map(s => `<ellipse cx="${s * BX * 0.48}" cy="${-BX * 0.15}" rx="${BX * 0.4}" ry="${BX * 0.25}" fill="#ffb3d1" stroke="#ff8ab8" stroke-width="3"/><circle cx="${s * BX * 0.48}" cy="${-BX * 0.3}" r="${BX * 0.12}" fill="#fff"/>`).join('') }; }
};
