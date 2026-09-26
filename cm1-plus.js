// Contenu supplémentaire pour le CM1 (programme cycle 3).
(() => {
  /* ---------- Outils ---------- */
  const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  // Nombre décimal écrit à partir d'un entier de centièmes (ex. 345 -> "3,45", 350 -> "3,5").
  const dec = c => {
    const e = Math.floor(c / 100), r = c % 100;
    if (r === 0) return sp(e);
    if (r % 10 === 0) return sp(e) + ',' + (r / 10);
    return sp(e) + ',' + String(r).padStart(2, '0');
  };
  const r1 = x => Math.round(x * 10) / 10;
  const gros = t => `<b style="font-size:1.5em">${t}</b>`;
  const phrase = t => `<span style="font-weight:normal">${t}</span>`;
  // Tire dans une liste sans répéter avant d'avoir tout vu.
  const tirage = liste => { let r = []; return () => { if (!r.length) r = melange(liste); return r.pop(); }; };
  const pgcd = (a, b) => b ? pgcd(b, a % b) : a;

  /* ---------- Dessins ---------- */
  const TRAIT = 'stroke="currentColor" stroke-width="2"';
  const REMPLI = 'fill="rgba(79,142,247,.25)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"';
  const ROUGE = '#e5484d';
  function codage(a, b, n) {
    const [x1, y1] = a, [x2, y2] = b;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, L = Math.hypot(x2 - x1, y2 - y1);
    const ux = (x2 - x1) / L, uy = (y2 - y1) / L, px = -uy, py = ux;
    let s = '';
    for (let i = 0; i < n; i++) {
      const o = (i - (n - 1) / 2) * 3, cx = mx + ux * o, cy = my + uy * o;
      s += `<line x1="${r1(cx - px * 4)}" y1="${r1(cy - py * 4)}" x2="${r1(cx + px * 4)}" y2="${r1(cy + py * 4)}" stroke="${ROUGE}" stroke-width="1.5"/>`;
    }
    return s;
  }
  function angleDroit(p, a, b) {
    const k = 6, la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const ux = (a[0] - p[0]) / la * k, uy = (a[1] - p[1]) / la * k, vx = (b[0] - p[0]) / lb * k, vy = (b[1] - p[1]) / lb * k;
    return `<path d="M${r1(p[0] + ux)} ${r1(p[1] + uy)} L${r1(p[0] + ux + vx)} ${r1(p[1] + uy + vy)} L${r1(p[0] + vx)} ${r1(p[1] + vy)}" fill="none" stroke="${ROUGE}" stroke-width="1.5"/>`;
  }
  // Polygone avec codages : traits[i] = nb de traits sur le côté i, droits = sommets à angle droit.
  function polygone(pts, traits = [], droits = []) {
    let s = `<polygon points="${pts.map(p => p.join(',')).join(' ')}" ${REMPLI}/>`;
    const n = pts.length;
    pts.forEach((p, i) => { if (traits[i]) s += codage(p, pts[(i + 1) % n], traits[i]); });
    droits.forEach(i => { s += angleDroit(pts[i], pts[(i + 1) % n], pts[(i + n - 1) % n]); });
    return s;
  }
  const FIG = {
    carre: [[25, 25], [75, 25], [75, 75], [25, 75]],
    rectangle: [[12, 30], [88, 30], [88, 70], [12, 70]],
    losange: [[50, 8], [80, 50], [50, 92], [20, 50]],
    triRect: [[20, 85], [88, 85], [20, 30]],
    isocele: [[50, 12], [78, 85], [22, 85]],
    equi: [[15, 80], [85, 80], [50, 19.4]],
    parallelo: [[28, 30], [90, 30], [72, 70], [10, 70]]
  };
  const DESSINS = {
    'un carré': () => polygone(FIG.carre, [1, 1, 1, 1], [0, 1, 2, 3]),
    'un rectangle': () => polygone(FIG.rectangle, [], [0, 1, 2, 3]),
    'un losange': () => polygone(FIG.losange, [1, 1, 1, 1]),
    'un triangle rectangle': () => polygone(FIG.triRect, [], [0]),
    'un triangle isocèle': () => polygone(FIG.isocele, [1, 0, 1]),
    'un triangle équilatéral': () => polygone(FIG.equi, [1, 1, 1]),
    'un cercle': () => `<circle cx="50" cy="50" r="38" ${REMPLI}/><circle cx="50" cy="50" r="2" fill="currentColor"/>`
  };
  const pointilles = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ROUGE}" stroke-width="2" stroke-dasharray="5 4"/>`;
  const texte = (x, y, t, anc = 'middle', taille = 8) => `<text x="${x}" y="${y}" font-size="${taille}" fill="currentColor" text-anchor="${anc}" font-family="sans-serif">${t}</text>`;

  /* ======================= MATHS ======================= */
  const genDecimaux = () => {
    const t = alea(0, 5);
    if (t === 0) {
      const e = alea(1, 99), d = alea(0, 9), c = alea(1, 9), s = dec(e * 100 + d * 10 + c);
      const [nom, bon] = pioche([['dixièmes', d], ['centièmes', c], ['unités', e % 10]]);
      return qcm({ visuel: gros(s), enonce: `Dans ${s}, quel est le chiffre des ${nom} ?`, aide: 'Après la virgule : dixièmes, puis centièmes.' }, bon, [d, c, e % 10, Math.floor(e / 10), 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
    if (t === 1) {
      const e = alea(1, 20), d = alea(1, 9), c = alea(1, 9), m = alea(0, 2);
      if (m === 0) return qcm({ visuel: '✍️', enonce: `Écris en chiffres : ${e} unité${e > 1 ? 's' : ''} et ${d} dixième${d > 1 ? 's' : ''}` }, dec(e * 100 + d * 10), [dec(e * 100 + d), sp(e * 10 + d), dec(e * 10 + d)]);
      if (m === 1) return qcm({ visuel: '✍️', enonce: `Écris en chiffres : ${e} unité${e > 1 ? 's' : ''} et ${c} centième${c > 1 ? 's' : ''}` }, dec(e * 100 + c), [dec(e * 100 + c * 10), sp(e * 100 + c), dec(e * 10 + c)]);
      const n = d * 10 + c;
      return qcm({ visuel: '✍️', enonce: `Écris en chiffres : ${n} centièmes` }, dec(n), [String(n), dec(n * 10), '0,0' + n]);
    }
    if (t === 2) {
      const e = alea(0, 20), vals = new Set();
      while (vals.size < 3) vals.add(e * 100 + (Math.random() < 0.4 ? alea(1, 9) * 10 : alea(1, 99)));
      const v = [...vals], grand = Math.random() < 0.5, bon = grand ? Math.max(...v) : Math.min(...v);
      return qcm({ visuel: '⚖️', enonce: `Quel est le nombre le plus ${grand ? 'grand' : 'petit'} ?`, aide: 'Compare les dixièmes, puis les centièmes.' }, dec(bon), v.filter(x => x !== bon).map(dec), 3);
    }
    if (t === 3) {
      const cent = Math.random() < 0.5;
      let a = cent ? alea(101, 2999) : alea(11, 199) * 10, b = cent ? alea(11, 999) : alea(1, 99) * 10;
      const plus = Math.random() < 0.5;
      if (!plus && b > a) [a, b] = [b, a];
      if (!plus && a === b) a += 10;
      const r = plus ? a + b : a - b, pas = cent ? 1 : 10;
      return qcm({ visuel: '🧮', enonce: `${dec(a)} ${plus ? '+' : '−'} ${dec(b)} = ?`, aide: 'Aligne les virgules !' }, dec(r), [r + 10, r - 10, r + 100, r - 100, r + pas * 2, r - pas].filter(x => x >= 0 && x !== r).map(dec));
    }
    if (t === 4) {
      if (Math.random() < 0.5) { const k = alea(1, 99); return qcm({ visuel: gros(`${k}/10`), enonce: `${k}/10 = ?`, aide: '1/10 = 0,1' }, dec(k * 10), [dec(k), dec(k * 100), sp(k * 10), '0,0' + k]); }
      const k = alea(1, 199); return qcm({ visuel: gros(`${k}/100`), enonce: `${k}/100 = ?`, aide: '1/100 = 0,01' }, dec(k), [dec(k * 10), sp(k), '0,00' + k, dec(k * 100)]);
    }
    const k = alea(1, 9), dix = Math.random() < 0.5;
    if (dix) return qcm({ visuel: gros('0,' + k), enonce: `Quelle fraction décimale est égale à 0,${k} ?` }, `${k}/10`, [`${k}/100`, `1/${k}`, `${k}/1000`]);
    const n = alea(11, 99); if (n % 10 === 0) return qcm({ visuel: gros('0,' + k), enonce: `Quelle fraction décimale est égale à 0,${k} ?` }, `${k}/10`, [`${k}/100`, `1/${k}`, `${k}/1000`]);
    return qcm({ visuel: gros(dec(n)), enonce: `Quelle fraction décimale est égale à ${dec(n)} ?` }, `${n}/100`, [`${n}/10`, `${n}/1000`, `1/${n}`]);
  };

  const NOMS_FIG = Object.keys(DESSINS);
  const AXES = [
    [() => polygone(FIG.rectangle, [], [0, 1, 2, 3]) + pointilles(50, 20, 50, 80), 'oui'],
    [() => polygone(FIG.rectangle, [], [0, 1, 2, 3]) + pointilles(4, 50, 96, 50), 'oui'],
    [() => polygone(FIG.rectangle, [], [0, 1, 2, 3]) + pointilles(12, 30, 88, 70), 'non'],
    [() => polygone(FIG.carre, [1, 1, 1, 1], [0, 1, 2, 3]) + pointilles(15, 15, 85, 85), 'oui'],
    [() => polygone(FIG.carre, [1, 1, 1, 1], [0, 1, 2, 3]) + pointilles(50, 15, 50, 85), 'oui'],
    [() => polygone(FIG.losange, [1, 1, 1, 1]) + pointilles(50, 2, 50, 98), 'oui'],
    [() => polygone(FIG.isocele, [1, 0, 1]) + pointilles(50, 4, 50, 94), 'oui'],
    [() => polygone(FIG.triRect, [], [0]) + pointilles(20, 85, 70, 40), 'non'],
    [() => polygone(FIG.parallelo) + pointilles(50, 22, 50, 78), 'non'],
    [() => polygone(FIG.parallelo) + pointilles(4, 50, 96, 50), 'non']
  ];
  const genGeometrie = () => {
    const t = alea(0, 5);
    if (t === 0) {
      const type = pioche(['droit', 'aigu', 'obtus']);
      const a = type === 'droit' ? 90 : type === 'aigu' ? alea(20, 65) : alea(115, 160);
      const rad = a * Math.PI / 180, x = r1(50 + 42 * Math.cos(rad)), y = r1(80 - 42 * Math.sin(rad));
      let d = `<line x1="50" y1="80" x2="94" y2="80" ${TRAIT}/><line x1="50" y1="80" x2="${x}" y2="${y}" ${TRAIT}/><circle cx="50" cy="80" r="2" fill="currentColor"/>`;
      if (Math.random() < 0.5) d = `<g transform="translate(100,0) scale(-1,1)">${d}</g>`;
      return qcm({ visuel: svg(d), enonce: 'Cet angle est…', aide: 'Compare-le à un angle droit (le coin d\'une feuille).' }, `un angle ${type}`, ['un angle droit', 'un angle aigu', 'un angle obtus']);
    }
    if (t === 1) {
      const nom = pioche(NOMS_FIG);
      let exclus = [];
      if (nom === 'un carré') exclus = ['un rectangle', 'un losange'];
      if (nom === 'un triangle équilatéral') exclus = ['un triangle isocèle'];
      const proches = nom.includes('triangle') ? NOMS_FIG.filter(n => n.includes('triangle')) : NOMS_FIG.filter(n => !n.includes('triangle'));
      const fausses = [...melange(proches), ...melange(NOMS_FIG)].filter(n => n !== nom && !exclus.includes(n));
      return qcm({ visuel: svg(DESSINS[nom]()), enonce: 'Comment s\'appelle cette figure ?', aide: 'Les petits traits rouges montrent des côtés de même longueur.' }, nom, uniques(fausses).slice(0, 3));
    }
    if (t === 2) {
      const m = alea(0, 2);
      if (m === 0) {
        const diam = Math.random() < 0.5, ang = alea(0, 359) * Math.PI / 180;
        const x = r1(50 + 38 * Math.cos(ang)), y = r1(50 + 38 * Math.sin(ang));
        const x2 = diam ? r1(50 - 38 * Math.cos(ang)) : 50, y2 = diam ? r1(50 - 38 * Math.sin(ang)) : 50;
        const d = `<circle cx="50" cy="50" r="38" fill="none" ${TRAIT}/><line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="${ROUGE}" stroke-width="3"/><circle cx="50" cy="50" r="2" fill="currentColor"/>${texte(55, 47, 'O')}`;
        return qcm({ visuel: svg(d), enonce: 'O est le centre du cercle. Le segment rouge est…' }, diam ? 'un diamètre' : 'un rayon', [diam ? 'un rayon' : 'un diamètre', 'un côté']);
      }
      if (m === 1) { const r = alea(2, 12); return qcm({ visuel: '⭕', enonce: `Le rayon d'un cercle mesure ${r} cm. Combien mesure son diamètre ?` }, `${2 * r} cm`, [`${r} cm`, `${r / 2} cm`.replace('.', ','), `${4 * r} cm`, `${r + 2} cm`]); }
      const r = alea(2, 12); return qcm({ visuel: '⭕', enonce: `Le diamètre d'un cercle mesure ${2 * r} cm. Combien mesure son rayon ?` }, `${r} cm`, [`${2 * r} cm`, `${4 * r} cm`, `${r + 2} cm`, `${2 * r + 2} cm`]);
    }
    if (t === 3) {
      const type = pioche(['parallèles', 'perpendiculaires', 'ni parallèles ni perpendiculaires']);
      const a = pioche([0, 20, 35, 60, 90, 110, 145]) * Math.PI / 180;
      const ligne = (cx, cy, ang) => `<line x1="${r1(cx - 45 * Math.cos(ang))}" y1="${r1(cy - 45 * Math.sin(ang))}" x2="${r1(cx + 45 * Math.cos(ang))}" y2="${r1(cy + 45 * Math.sin(ang))}" ${TRAIT}/>`;
      let d;
      if (type === 'parallèles') { const ox = -Math.sin(a) * 15, oy = Math.cos(a) * 15; d = ligne(50 + ox, 50 + oy, a) + ligne(50 - ox, 50 - oy, a); }
      else if (type === 'perpendiculaires') { const b = a + Math.PI / 2; d = ligne(50, 50, a) + ligne(50, 50, b) + angleDroit([50, 50], [50 + Math.cos(a) * 10, 50 + Math.sin(a) * 10], [50 + Math.cos(b) * 10, 50 + Math.sin(b) * 10]); }
      else { const b = a + pioche([45, 55, 130]) * Math.PI / 180; d = ligne(50, 50, a) + ligne(50, 50, b); }
      return qcm({ visuel: svg(d), enonce: 'Ces deux droites sont…', aide: 'Le petit carré rouge code un angle droit.' }, type, ['parallèles', 'perpendiculaires', 'ni parallèles ni perpendiculaires']);
    }
    if (t === 4) {
      const [des, bon] = pioche(AXES);
      return { visuel: svg(des()), enonce: 'La droite en pointillés est-elle un axe de symétrie de la figure ?', aide: 'Si on plie selon cette droite, les deux moitiés se superposent-elles ?', choix: ['oui', 'non'], bonne: bon };
    }
    const [q, b, f] = pioche([
      ['Combien de côtés a un rectangle ?', '4', ['3', '5', '6']],
      ['Combien d\'angles droits a un rectangle ?', '4', ['2', '1', '0']],
      ['Quel quadrilatère a 4 côtés égaux et 4 angles droits ?', 'le carré', ['le rectangle', 'le losange', 'le triangle']],
      ['Quel quadrilatère a 4 côtés égaux mais pas forcément d\'angle droit ?', 'le losange', ['le rectangle', 'le triangle', 'le cercle']],
      ['Un triangle qui a 3 côtés égaux est un triangle…', 'équilatéral', ['rectangle', 'quelconque', 'carré']],
      ['Un triangle qui a un angle droit est un triangle…', 'rectangle', ['équilatéral', 'carré', 'obtus']],
      ['Quel instrument sert à tracer un cercle ?', 'le compas', ['l\'équerre', 'la gomme', 'le rapporteur']],
      ['Quel instrument sert à vérifier un angle droit ?', 'l\'équerre', ['le compas', 'la gomme', 'le taille-crayon']],
      ['Combien de sommets a un triangle ?', '3', ['4', '2', '6']]
    ]);
    return qcm({ visuel: '📐', enonce: q }, b, f);
  };

  const genPerimetreAire = () => {
    const t = alea(0, 3);
    const rect = (L, l) => {
      const w = L * 6.5, h = l * 6.5, x = r1((100 - w) / 2), y = r1((100 - h) / 2);
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${REMPLI}/>${texte(50, r1(y - 4), L + ' cm')}${texte(r1(x + 4), r1(y + h / 2 + 3), l + ' cm', 'start')}`;
    };
    if (t === 0) {
      const L = alea(4, 12), l = alea(2, Math.min(8, L - 1)), p = 2 * (L + l);
      return qcm({ visuel: svg(rect(L, l)), enonce: `Quel est le périmètre de ce rectangle ?`, aide: 'Le périmètre, c\'est le tour de la figure.' }, `${p} cm`, [`${L + l} cm`, `${L * l} cm`, `${2 * L + l} cm`, `${p} cm²`].filter(x => x !== `${p} cm`));
    }
    if (t === 1) {
      const c = pioche([2, 3, 5, 6, 7, 8, 9, 10, 12]);
      return qcm({ visuel: svg(rect(c, c)), enonce: `Un carré a des côtés de ${c} cm. Quel est son périmètre ?` }, `${4 * c} cm`, [`${c * c} cm`, `${2 * c} cm`, `${3 * c} cm`, `${4 * c + 4} cm`]);
    }
    if (t === 2) {
      const L = alea(3, 10), l = alea(2, Math.min(8, L)), a = L * l;
      return qcm({ visuel: svg(rect(L, l)), enonce: `Quelle est l'aire de ce ${L === l ? 'carré' : 'rectangle'} ?`, aide: 'Aire du rectangle = longueur × largeur.' }, `${a} cm²`, [`${2 * (L + l)} cm²`, `${L + l} cm²`, `${a} cm`, `${a + L} cm²`, `${a - l} cm²`]);
    }
    // Aire en carreaux sur un quadrillage 8 × 6
    const w = alea(3, 6), h = alea(2, 4), x0 = alea(0, 8 - w), y0 = alea(0, 6 - h);
    const cellules = [];
    for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) cellules.push([x0 + i, y0 + j]);
    let n = cellules;
    if (Math.random() < 0.6) { // on retire un coin pour faire une forme en L
      const cw = alea(1, w - 2), ch = alea(1, h - 1);
      n = cellules.filter(([i, j]) => !(i >= x0 + w - cw && j < y0 + ch));
    }
    const k = 11, ox = 6, oy = 17;
    let d = n.map(([i, j]) => `<rect x="${ox + i * k}" y="${oy + j * k}" width="${k}" height="${k}" fill="rgba(79,142,247,.55)"/>`).join('');
    for (let i = 0; i <= 8; i++) d += `<line x1="${ox + i * k}" y1="${oy}" x2="${ox + i * k}" y2="${oy + 6 * k}" stroke="currentColor" stroke-width=".6" opacity=".6"/>`;
    for (let j = 0; j <= 6; j++) d += `<line x1="${ox}" y1="${oy + j * k}" x2="${ox + 8 * k}" y2="${oy + j * k}" stroke="currentColor" stroke-width=".6" opacity=".6"/>`;
    const aire = n.length;
    return qcm({ visuel: svg(d), enonce: 'Quelle est l\'aire de la figure coloriée ?', aide: 'Unité : 1 carreau.' }, `${aire} carreaux`, voisins(aire, 3, 1).map(v => `${v} carreaux`));
  };

  const heure = (h, m) => `${h} h ${String(m).padStart(2, '0')}`;
  const duree = mn => { const h = Math.floor(mn / 60), m = mn % 60; return h ? (m ? `${h} h ${m} min` : `${h} h`) : `${m} min`; };
  const deMinutes = t => heure(Math.floor(t / 60), t % 60);
  const genDurees = () => {
    const t = alea(0, 4);
    if (t === 0) {
      const h = alea(1, 4), m = alea(1, 11) * 5, r = h * 60 + m;
      return qcm({ visuel: '⏱️', enonce: `${h} h ${m} min = ? min`, aide: '1 h = 60 min' }, `${r} min`, [h * 100 + m, r + 10, r - 10, r + 60, h * 10 + m].filter(x => x !== r).map(x => `${x} min`));
    }
    if (t === 1) {
      let n; do { n = alea(13, 50) * 5; } while (n % 60 === 0);
      const naif = n % 100 < 60 ? duree(Math.floor(n / 100) * 60 + n % 100) : duree(n + 20);
      return qcm({ visuel: '⏱️', enonce: `${n} min = ?`, aide: '60 min = 1 h' }, duree(n), [naif, duree(n + 10), duree(n - 10), duree(n + 60)]);
    }
    if (t === 2) {
      const debut = alea(7 * 12, 17 * 12) * 5, d = alea(3, 30) * 5, fin = debut + d;
      const [quoi, v, pron] = pioche([['Le film commence', '🎬', 'il'], ['Le match commence', '⚽', 'il'], ['La balade commence', '🥾', 'elle'], ['Le spectacle commence', '🎭', 'il'], ['Le trajet en train commence', '🚆', 'il']]);
      return qcm({ visuel: v, enonce: `${quoi} à ${deMinutes(debut)} et se termine à ${deMinutes(fin)}. Combien de temps dure-t-${pron} ?` }, duree(d), [d + 10, d - 10, d + 60, d - 5, d + 5].filter(x => x > 0 && x !== d).map(duree));
    }
    if (t === 3) {
      const debut = alea(7 * 12, 18 * 12) * 5, d = alea(2, 18) * 5, fin = debut + d;
      return qcm({ visuel: '🕰️', enonce: `Il est ${deMinutes(debut)}. Quelle heure sera-t-il dans ${d} min ?` }, deMinutes(fin), [fin + 10, fin - 10, fin + 60, fin - 60, fin + 5].filter(x => x > debut).map(deMinutes));
    }
    const h = alea(1, 11), m = alea(0, 11) * 5;
    const ah = ((h % 12) + m / 60) * 30 * Math.PI / 180, am = m * 6 * Math.PI / 180;
    let d = `<circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.08)" ${TRAIT}/>`;
    for (let i = 0; i < 60; i++) { const a = i * 6 * Math.PI / 180, r0 = i % 5 ? 43 : 40; d += `<line x1="${r1(50 + r0 * Math.sin(a))}" y1="${r1(50 - r0 * Math.cos(a))}" x2="${r1(50 + 46 * Math.sin(a))}" y2="${r1(50 - 46 * Math.cos(a))}" stroke="currentColor" stroke-width="${i % 5 ? .5 : 1.5}"/>`; }
    for (let i = 1; i <= 12; i++) { const a = i * 30 * Math.PI / 180; d += texte(r1(50 + 33 * Math.sin(a)), r1(50 - 33 * Math.cos(a) + 3), i, 'middle', 9); }
    d += `<line x1="50" y1="50" x2="${r1(50 + 22 * Math.sin(ah))}" y2="${r1(50 - 22 * Math.cos(ah))}" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`;
    d += `<line x1="50" y1="50" x2="${r1(50 + 37 * Math.sin(am))}" y2="${r1(50 - 37 * Math.cos(am))}" stroke="${ROUGE}" stroke-width="2" stroke-linecap="round"/><circle cx="50" cy="50" r="2.5" fill="currentColor"/>`;
    const fausses = [heure(m / 5 || 12, (h * 5) % 60), heure(h === 11 ? 12 : h + 1, m), heure(h === 1 ? 12 : h - 1, m), heure(h, (m + 30) % 60), heure(h, (m + 5) % 60)];
    return qcm({ visuel: svg(d, 180), enonce: 'C\'est le matin. Quelle heure indique l\'horloge ?', aide: 'La petite aiguille indique les heures, la grande (rouge) les minutes.' }, heure(h, m), fausses);
  };

  const genMultPosee = () => {
    const t = alea(0, 3);
    if (t === 0) {
      const a = alea(12, 98), b = alea(3, 9), r = a * b, u = a % 10, dz = Math.floor(a / 10);
      const sansRetenue = dz * b * 10 + (u * b) % 10;
      return qcm({ visuel: '✖️', enonce: `${a} × ${b} = ?`, aide: 'N\'oublie pas les retenues.' }, sp(r), [sansRetenue, r + 10, r - 10, r + b, r - b, r + a].filter(x => x !== r).map(sp));
    }
    if (t === 1) {
      const a = alea(12, 99), b = alea(12, 49), r = a * b;
      const oubliDecalage = a * (b % 10) + a * Math.floor(b / 10);
      return qcm({ visuel: '✖️', enonce: `${a} × ${b} = ?`, aide: 'N\'oublie pas le 0 à la deuxième ligne.' }, sp(r), [oubliDecalage, r + 10, r - 10, r + 100, r - 100, r + a].filter(x => x !== r && x > 0).map(sp));
    }
    if (t === 2) {
      const a = alea(3, 999), p = pioche([10, 100, 1000]), r = a * p;
      return qcm({ visuel: '🔟', enonce: `${sp(a)} × ${sp(p)} = ?` }, sp(r), [r * 10, a * p / 10, a + p, r * 100].filter(x => Number.isInteger(x) && x !== r).map(sp));
    }
    const a = alea(2, 99), k = alea(2, 9), r = a * k * 10;
    return qcm({ visuel: '✖️', enonce: `${a} × ${k * 10} = ?`, aide: `Calcule ${a} × ${k}, puis multiplie par 10.` }, sp(r), [a * k, r * 10, r + 10, r - 10, a * (k + 1) * 10].filter(x => x !== r).map(sp));
  };

  const genFractions2 = () => {
    const t = alea(0, 4);
    if (t === 0) {
      const d = alea(5, 12), ns = new Set();
      while (ns.size < 3) ns.add(alea(1, d - 1));
      const v = [...ns], grand = Math.random() < 0.5, bon = grand ? Math.max(...v) : Math.min(...v);
      return qcm({ visuel: '🍰', enonce: `Quelle fraction est la plus ${grand ? 'grande' : 'petite'} ?`, aide: 'Même dénominateur : compare les numérateurs.' }, `${bon}/${d}`, v.filter(x => x !== bon).map(x => `${x}/${d}`), 3);
    }
    if (t === 1) {
      const d = pioche([2, 3, 4, 5, 10]), k = alea(1, d - 1), m = alea(2, 10), q = d * m, r = k * m;
      const [obj, v] = pioche([['bonbons', '🍬'], ['billes', '🔵'], ['élèves', '🧒'], ['euros', '💶'], ['pommes', '🍎']]);
      return qcm({ visuel: v, enonce: `Combien font ${k}/${d} de ${q} ${obj} ?`, aide: `Partage ${q} en ${d}, puis prends ${k} part${k > 1 ? 's' : ''}.` }, r, [m, q - r, r + m, r + 1, q].filter(x => x !== r && x > 0));
    }
    if (t === 2) {
      const [a, b] = pioche([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5]]), k = alea(2, 5);
      const cand = [[a + 1, b * k], [a * k, b], [a * k + 1, b * k], [a, b * k], [a * k, b * k + 1], [b, a * k]];
      const fausses = cand.filter(([x, y]) => x > 0 && y > 0 && x * b !== y * a).map(([x, y]) => `${x}/${y}`);
      return qcm({ visuel: gros(`${a}/${b}`), enonce: `Quelle fraction est égale à ${a}/${b} ?`, aide: 'Multiplie le numérateur et le dénominateur par le même nombre.' }, `${a * k}/${b * k}`, fausses);
    }
    if (t === 3) {
      const d = pioche([2, 3, 4, 5, 6, 8, 10]), k = alea(1, d - 1);
      const x0 = 10, L = 80, y = 50;
      let s = `<line x1="${x0}" y1="${y}" x2="${x0 + L}" y2="${y}" ${TRAIT}/>`;
      for (let i = 0; i <= d; i++) { const x = r1(x0 + i * L / d); s += `<line x1="${x}" y1="${y - (i % d ? 4 : 7)}" x2="${x}" y2="${y + (i % d ? 4 : 7)}" stroke="currentColor" stroke-width="${i % d ? 1 : 2}"/>`; }
      s += texte(x0, y + 17, '0', 'middle', 10) + texte(x0 + L, y + 17, '1', 'middle', 10);
      const px = r1(x0 + k * L / d);
      s += `<circle cx="${px}" cy="${y}" r="3.5" fill="${ROUGE}"/>${texte(px, y - 10, 'A', 'middle', 10)}`;
      const cand = [[k + 1, d], [k - 1, d], [k, d + 1], [d, k], [k, 10]];
      const fausses = cand.filter(([x, z]) => x > 0 && z > 0 && x * d !== z * k).map(([x, z]) => `${x}/${z}`);
      return qcm({ visuel: svg(s, 200), enonce: 'Quelle fraction correspond au point A ?', aide: 'Compte en combien de parts l\'unité est partagée.' }, `${k}/${d}`, fausses);
    }
    const d = alea(2, 10), n = Math.random() < 0.2 ? d : pioche([alea(1, d - 1), alea(d + 1, 2 * d)]);
    const bon = n < d ? 'plus petite que 1' : n === d ? 'égale à 1' : 'plus grande que 1';
    return { visuel: gros(`${n}/${d}`), enonce: `La fraction ${n}/${d} est…`, aide: `${d}/${d} = 1`, choix: ['plus petite que 1', 'égale à 1', 'plus grande que 1'], bonne: bon };
  };

  const genMultiples = () => {
    const t = alea(0, 5);
    if (t === 0) {
      const b = alea(2, 9), bon = b * alea(3, 12);
      const f = []; for (let x = bon - 6; x <= bon + 6; x++) if (x > 0 && x % b) f.push(x);
      return qcm({ visuel: '🔢', enonce: `Quel nombre est un multiple de ${b} ?`, aide: `Pense à la table de ${b}.` }, bon, f);
    }
    if (t === 1) {
      const n = pioche([12, 18, 20, 24, 30, 36, 40, 42, 48, 56, 60, 72]);
      const div = [], non = [];
      for (let x = 2; x < n && x <= 15; x++) (n % x ? non : div).push(x);
      return qcm({ visuel: gros(n), enonce: `Quel nombre est un diviseur de ${n} ?`, aide: `Un diviseur de ${n} partage ${n} sans reste.` }, pioche(div), non);
    }
    if (t === 2) {
      const n = alea(100, 9999);
      return { visuel: gros(sp(n)), enonce: 'Ce nombre est-il pair ou impair ?', aide: 'Regarde le chiffre des unités.', choix: ['pair', 'impair'], bonne: n % 2 ? 'impair' : 'pair' };
    }
    const b = alea(3, 9), q = alea(3, 12), r = alea(1, b - 1), a = b * q + r;
    if (t === 3) {
      const fmt = (x, y) => `quotient ${x}, reste ${y}`;
      const f = [fmt(q + 1, r), fmt(q - 1, r), fmt(q, r + 1 < b ? r + 1 : r - 1), fmt(r, q)].filter(s => s !== fmt(q, r));
      return qcm({ visuel: '➗', enonce: `Division de ${a} par ${b} : quels sont le quotient et le reste ?`, aide: `${b} × ? ≤ ${a}, et le reste est plus petit que ${b}.` }, fmt(q, r), f);
    }
    if (t === 4) {
      const [chose, boite, v] = pioche([['œufs', 'boîtes', '🥚'], ['élèves', 'équipes', '🧒'], ['photos', 'pages d\'album', '📷'], ['crayons', 'pots', '✏️'], ['gâteaux', 'sachets', '🍪']]);
      if (Math.random() < 0.5) return qcm({ visuel: v, enonce: `On range ${a} ${chose} par ${b} dans des ${boite}. Combien de ${boite} pleines obtient-on ?` }, q, [q + 1, q - 1, r, a - b]);
      return qcm({ visuel: v, enonce: `On range ${a} ${chose} par ${b} dans des ${boite}. Combien de ${chose} reste-t-il ?` }, r, [q, r + 1, b - r, 0].filter(x => x !== r));
    }
    const [div, regle] = pioche([[2, 'Un nombre pair se termine par 0, 2, 4, 6 ou 8.'], [5, 'Il se termine par 0 ou 5.'], [10, 'Il se termine par 0.']]);
    const ok = u => div === 2 ? u % 2 === 0 : div === 5 ? u % 5 === 0 : u === 0;
    const base = alea(10, 99) * 10;
    const bonsU = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(ok), mauvaisU = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(u => !ok(u));
    const bon = base + pioche(bonsU);
    const f = melange(mauvaisU).slice(0, 3).map(u => base + alea(-5, 5) * 10 + u);
    return qcm({ visuel: '🔍', enonce: `Quel nombre est divisible par ${div} ?`, aide: regle }, bon, f);
  };

  ajouterJeux('CM1', 'maths', [
    { id: 'decimaux', titre: 'Nombres décimaux', emoji: '🔟', gen: genDecimaux },
    { id: 'geometrie', titre: 'Géométrie', emoji: '📐', gen: genGeometrie },
    { id: 'perimetre-aire', titre: 'Périmètre et aire', emoji: '⬛', gen: genPerimetreAire },
    { id: 'durees', titre: 'Heures et durées', emoji: '⏰', gen: genDurees },
    { id: 'multiplication-posee', titre: 'Multiplications', emoji: '✖️', gen: genMultPosee },
    { id: 'fractions-2', titre: 'Fractions (suite)', emoji: '🥧', gen: genFractions2 },
    { id: 'multiples', titre: 'Multiples et divisions', emoji: '🧩', gen: genMultiples }
  ]);

  /* ======================= FRANÇAIS ======================= */
  // Passé composé
  const AUX = { avoir: ['ai', 'as', 'a', 'avons', 'avez', 'ont'], être: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'] };
  const PC_AVOIR = [
    ['manger', 'mangé', 'une pomme', ['manger', 'mangait', 'mangez']], ['finir', 'fini', 'l\'exercice', ['finit', 'finu', 'finir']],
    ['prendre', 'pris', 'le bus', ['prendu', 'prit', 'prendre']], ['faire', 'fait', 'un gâteau', ['faire', 'faisé', 'fai']],
    ['dire', 'dit', 'la vérité', ['disé', 'dire', 'di']], ['voir', 'vu', 'un film', ['voiru', 'vut', 'voit']],
    ['lire', 'lu', 'un livre', ['lit', 'lut', 'lisé']], ['écrire', 'écrit', 'une lettre', ['écrire', 'écrivé', 'écri']],
    ['mettre', 'mis', 'un manteau', ['mettu', 'mit', 'metté']], ['boire', 'bu', 'du lait', ['boivé', 'but', 'boit']],
    ['jouer', 'joué', 'au ballon', ['jouer', 'jouait', 'jouez']], ['chanter', 'chanté', 'une chanson', ['chanter', 'chantait', 'chantez']],
    ['perdre', 'perdu', 'les clés', ['perdi', 'perdre', 'perdé']], ['attendre', 'attendu', 'le train', ['attendi', 'attendre', 'attendé']],
    ['avoir', 'eu', 'de la chance', ['avu', 'ayé', 'avé']], ['être', 'été', 'malade', ['êté', 'étu', 'eu']],
    ['pouvoir', 'pu', 'venir', ['pouvu', 'pouvé', 'put']], ['vouloir', 'voulu', 'partir', ['voulé', 'voulut', 'veut']]
  ];
  const PC_ETRE = [
    ['aller', 'allé', 'au marché'], ['venir', 'venu', 'à la fête'], ['partir', 'parti', 'en vacances'],
    ['arriver', 'arrivé', 'en retard'], ['tomber', 'tombé', 'dans l\'escalier'], ['rester', 'resté', 'à la maison'],
    ['entrer', 'entré', 'dans la classe'], ['revenir', 'revenu', 'de l\'école'], ['naître', 'né', 'au printemps']
  ];
  const PART_FAUX_ETRE = { aller: ['aller', 'allait'], venir: ['venit', 'venir'], partir: ['partit', 'partu'], arriver: ['arriver', 'arrivait'], tomber: ['tomber', 'tombait'], rester: ['rester', 'restait'], entrer: ['entrer', 'entrait'], revenir: ['revenit', 'revenir'], naître: ['naît', 'naissu'] };
  // sujet, personne (0-5), féminin, pluriel
  const SUJETS_AVOIR = [['j\'', 0], ['tu', 1], ['il', 2], ['elle', 2], ['nous', 3], ['vous', 4], ['ils', 5], ['elles', 5], ['Léa', 2], ['Mes cousins', 5]];
  const SUJETS_ETRE = [['il', 2, 0, 0], ['elle', 2, 1, 0], ['ils', 5, 0, 1], ['elles', 5, 1, 1], ['Léa', 2, 1, 0], ['Tom', 2, 0, 0], ['Les filles', 5, 1, 1], ['Mes frères', 5, 0, 1], ['Ma tante', 2, 1, 0], ['Nos voisins', 5, 0, 1]];
  const avecSujet = (s, aux) => s === 'j\'' ? (/^[aeiouéê]/.test(aux) ? 'j\'' + aux : 'je ' + aux) : s + ' ' + aux;
  const genPasseCompose = () => {
    const t = alea(0, 5);
    if (t <= 1) { // verbe avec avoir
      const [inf, pp, comp] = pioche(PC_AVOIR), [s, p] = pioche(SUJETS_AVOIR);
      const bon = avecSujet(s, AUX.avoir[p]) + ' ' + pp;
      const f = [avecSujet(s, AUX.être[p]) + ' ' + pp, avecSujet(s, AUX.avoir[p]) + ' ' + pioche(PC_AVOIR.find(v => v[0] === inf)[3]), avecSujet(s, AUX.être[p]) + ' ' + pioche(PC_AVOIR.find(v => v[0] === inf)[3])];
      if (!/[st]$/.test(pp) && !/^(il|elle|j'|tu|Léa)$/.test(s)) f.push(avecSujet(s, AUX.avoir[p]) + ' ' + pp + 's');
      if (!/[st]$/.test(pp)) f.push(avecSujet(s, AUX.avoir[p]) + ' ' + pp + 'e');
      const sujetAff = s === 'j\'' ? 'je' : s;
      return qcm({ visuel: '⏪', enonce: `Conjugue au passé composé :<br>${phrase(`${sujetAff} (${inf}) ${comp}`)}`, aide: 'Passé composé = auxiliaire + participe passé.' }, bon, f);
    }
    if (t <= 3) { // verbe avec être : accord du participe
      const [inf, pp, comp] = pioche(PC_ETRE), [s, p, fem, pl] = pioche(SUJETS_ETRE);
      const accord = (fe, pll) => pp + (fe ? 'e' : '') + (pll ? 's' : '');
      const bon = `${s} ${AUX.être[p]} ${accord(fem, pl)}`;
      const f = [];
      [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([fe, pll]) => { f.push(`${s} ${AUX.être[p]} ${accord(fe, pll)}`); f.push(`${s} ${AUX.avoir[p]} ${pp}`); });
      return qcm({ visuel: '⏪', enonce: `Conjugue au passé composé :<br>${phrase(`${s} (${inf}) ${comp}`)}`, aide: 'Avec l\'auxiliaire être, le participe passé s\'accorde avec le sujet.' }, bon, [...new Set(f)].filter(x => x !== bon).sort(() => Math.random() - 0.5).slice(0, 3));
    }
    if (t === 4) {
      const etre = Math.random() < 0.5, inf = etre ? pioche(PC_ETRE)[0] : pioche(PC_AVOIR)[0];
      return { visuel: '🤔', enonce: `Au passé composé, le verbe « ${inf} » se conjugue avec l'auxiliaire…`, choix: ['être', 'avoir'], bonne: etre ? 'être' : 'avoir' };
    }
    if (Math.random() < 0.7) { const [inf, pp, , faux] = pioche(PC_AVOIR); return qcm({ visuel: '🔎', enonce: `Quel est le participe passé du verbe « ${inf} » ?` }, pp, faux); }
    const [inf, pp] = pioche(PC_ETRE); return qcm({ visuel: '🔎', enonce: `Quel est le participe passé du verbe « ${inf} » ?` }, pp, PART_FAUX_ETRE[inf].concat(pp + 'r'));
  };

  // Grammaire : fonctions dans la phrase
  const FONCTIONS = { S: 'le sujet', V: 'le verbe', CV: 'un complément du verbe', CP: 'un complément de phrase' };
  const GRAMMAIRE = [
    ['[Le petit chat] dort sur le canapé.', 'S'], ['[Mes cousins] arrivent demain.', 'S'], ['Chaque matin, [le boulanger] prépare du pain.', 'S'],
    ['[Nous] partons en vacances en juillet.', 'S'], ['[La maîtresse] corrige les cahiers.', 'S'], ['[Les oiseaux] chantent au printemps.', 'S'],
    ['Au loin, [un loup] hurle.', 'S'], ['[Tom et Léa] construisent une cabane.', 'S'], ['[Elle] écrit une lettre à sa grand-mère.', 'S'],
    ['Hier soir, [mon père] a préparé des crêpes.', 'S'], ['Dans la mare nagent [des canards].', 'S'],
    ['Le chien [ronge] un os.', 'V'], ['Les enfants [jouent] dans la cour.', 'V'], ['Demain, nous [irons] à la piscine.', 'V'],
    ['Ma sœur [lit] une bande dessinée.', 'V'], ['Le vent [souffle] très fort.', 'V'], ['Les élèves [écoutent] une histoire.', 'V'],
    ['Pendant la nuit, la neige [tombe].', 'V'], ['Léo [range] ses jouets.', 'V'], ['Tu [bois] un verre de lait.', 'V'],
    ['Les pompiers [éteignent] l\'incendie.', 'V'],
    ['Le chien ronge [un os].', 'CV'], ['Ma sœur lit [une bande dessinée].', 'CV'], ['Léo range [ses jouets].', 'CV'],
    ['Les pompiers éteignent [l\'incendie].', 'CV'], ['Le jardinier arrose [les fleurs].', 'CV'], ['Maman achète [du pain].', 'CV'],
    ['Paul téléphone [à son ami].', 'CV'], ['Les élèves écoutent [une histoire].', 'CV'], ['Tom et Léa construisent [une cabane].', 'CV'],
    ['Cette fillette ressemble [à sa mère].', 'CV'], ['Le chat attrape [une souris].', 'CV'],
    ['[Chaque matin], le boulanger prépare du pain.', 'CP'], ['[Au loin], un loup hurle.', 'CP'], ['[Hier soir], mon père a préparé des crêpes.', 'CP'],
    ['Les enfants jouent au ballon [dans la cour].', 'CP'], ['[Pendant la nuit], la neige tombe.', 'CP'], ['[En été], nous allons à la plage.', 'CP'],
    ['[Dans la forêt], les enfants cueillent des champignons.', 'CP'], ['Les élèves font du sport [le mardi].', 'CP'],
    ['[Demain], nous irons à la piscine.', 'CP'], ['Le chat dort [sous la table].', 'CP'], ['[Après le repas], Léo range ses jouets.', 'CP']
  ];
  const tireGram = tirage(GRAMMAIRE);
  const genGrammaire = () => {
    const [p, code] = tireGram();
    const html = p.replace(/\[(.+?)\]/, '<u>$1</u>');
    return qcm({ visuel: '🧐', enonce: `Le groupe souligné est…<br>${phrase(html)}`, dire: p.replace(/[[\]]/g, ''), aide: 'Un complément de phrase peut être déplacé ou supprimé.' }, FONCTIONS[code], Object.values(FONCTIONS));
  };

  const ACCORDS = [
    ['Les enfants ___ dans le jardin.', 'jouent', ['joue', 'joues']], ['Mon frère et ma sœur ___ au cinéma.', 'vont', ['va', 'vas']],
    ['Les feuilles des arbres ___ en automne.', 'tombent', ['tombe', 'tombes']], ['Le chien des voisins ___ toute la nuit.', 'aboie', ['aboient', 'aboies']],
    ['Tu ___ très bien.', 'chantes', ['chante', 'chantent']], ['Nous ___ nos devoirs.', 'finissons', ['finissez', 'finissent']],
    ['Vous ___ le train.', 'prenez', ['prennent', 'prenons']], ['Les oiseaux ___ vers le sud.', 'partent', ['part', 'pars']],
    ['Elle les ___ tous les jours.', 'regarde', ['regardent', 'regardes']], ['Je les ___ souvent.', 'vois', ['voient', 'voit']],
    ['Dans la mare ___ des canards.', 'nagent', ['nage', 'nages']], ['Le bouquet de fleurs ___ sur la table.', 'est', ['sont', 'es']],
    ['Ma tante et moi ___ des crêpes.', 'faisons', ['font', 'fait']], ['Toi et ton frère ___ en retard.', 'êtes', ['sont', 'est']],
    ['Les élèves de la classe ___ une chanson.', 'apprennent', ['apprend', 'apprends']], ['Chaque soir, mes parents ___ le journal.', 'lisent', ['lit', 'lis']],
    ['Le chat de mes cousins ___ du lait.', 'boit', ['boivent', 'bois']], ['On ___ au parc.', 'va', ['vont', 'vas']],
    ['Les petits ___ du bruit.', 'font', ['fait', 'fais']], ['Où ___ mes chaussures ?', 'sont', ['est', 'son']],
    ['J\'ai des chaussures ___.', 'noires', ['noire', 'noirs']], ['Nous habitons une ___ maison.', 'petite', ['petit', 'petites']],
    ['Ce sont des garçons ___.', 'gentils', ['gentil', 'gentilles']], ['Elle porte une robe ___.', 'blanche', ['blanc', 'blanches']],
    ['Il raconte des histoires ___.', 'amusantes', ['amusante', 'amusants']], ['Nous voyons les ___ montagnes.', 'hautes', ['haute', 'hauts']],
    ['Maman a cueilli des fleurs ___.', 'parfumées', ['parfumée', 'parfumés']], ['Zoé est ma ___ amie.', 'meilleure', ['meilleur', 'meilleures']],
    ['Deux chats ___ dorment.', 'noirs', ['noir', 'noires']], ['Léa est une fille ___.', 'heureuse', ['heureux', 'heureuses']],
    ['Il a deux pantalons ___.', 'bleus', ['bleu', 'bleues']], ['C\'est une ___ nouvelle !', 'bonne', ['bon', 'bonnes']],
    ['Il lit les ___ journaux.', 'nouveaux', ['nouvelles', 'nouveau']], ['Il met une chemise ___.', 'neuve', ['neuf', 'neuves']],
    ['Mes amies sont très ___.', 'sportives', ['sportive', 'sportifs']], ['Elle a une ___ voix.', 'douce', ['doux', 'douces']],
    ['Mon chat a les yeux ___.', 'verts', ['vert', 'vertes']], ['Au port, il y a de ___ bateaux.', 'beaux', ['belles', 'beau']],
    ['Je bois une eau ___.', 'fraîche', ['frais', 'fraîches']], ['___ arbre est très vieux.', 'Cet', ['Ce', 'Cette']],
    ['___ fleur est jolie.', 'Cette', ['Cet', 'Ces']], ['Mes sœurs sont ___.', 'grandes', ['grande', 'grands']],
    ['Ces pommes sont ___.', 'mûres', ['mûre', 'mûrs']], ['La soupe est ___.', 'chaude', ['chaud', 'chaudes']]
  ];
  const tireAcc = tirage(ACCORDS);
  const genAccords = () => {
    const [p, bon, f] = tireAcc();
    return qcm({ visuel: '✅', enonce: `Choisis la bonne orthographe :<br>${phrase(p)}`, dire: p.replace('___', '…') }, bon, f, 3);
  };

  const TYPES = [
    ['Le soleil brille aujourd\'hui.', 'déclarative'], ['Mon chat s\'appelle Filou.', 'déclarative'], ['Nous irons à la mer cet été.', 'déclarative'],
    ['Les élèves travaillent en silence.', 'déclarative'], ['Il pleut depuis ce matin.', 'déclarative'], ['J\'ai perdu ma trousse.', 'déclarative'],
    ['La Terre tourne autour du Soleil.', 'déclarative'], ['Mon frère n\'aime pas les épinards.', 'déclarative'],
    ['Quelle heure est-il ?', 'interrogative'], ['As-tu fini tes devoirs ?', 'interrogative'], ['Où habites-tu ?', 'interrogative'],
    ['Est-ce que tu viens avec nous ?', 'interrogative'], ['Pourquoi le ciel est-il bleu ?', 'interrogative'], ['Tu veux du gâteau ?', 'interrogative'],
    ['Combien coûte ce livre ?', 'interrogative'], ['Qui a mangé ma pomme ?', 'interrogative'],
    ['Quelle belle journée !', 'exclamative'], ['Comme tu as grandi !', 'exclamative'], ['Que ce gâteau est bon !', 'exclamative'],
    ['Quel beau dessin !', 'exclamative'], ['Comme il fait chaud !', 'exclamative'], ['Quelle surprise !', 'exclamative'],
    ['Ferme la porte.', 'impérative'], ['Range ta chambre.', 'impérative'], ['Prenez vos cahiers.', 'impérative'], ['Viens ici.', 'impérative'],
    ['Écoutez bien la consigne.', 'impérative'], ['Ne cours pas dans le couloir.', 'impérative'], ['Mettons nos manteaux.', 'impérative'],
    ['Lave-toi les mains.', 'impérative']
  ];
  const FORMES = [
    ['Je ne viens pas.', 'négative'], ['Il ne mange jamais de viande.', 'négative'], ['Tu ne dis rien.', 'négative'],
    ['Il n\'y a plus de pain.', 'négative'], ['Nous ne sommes pas fatigués.', 'négative'], ['Elle n\'a pas faim.', 'négative'],
    ['Elle aime lire.', 'affirmative'], ['Nous jouons dehors.', 'affirmative'], ['Le train est à l\'heure.', 'affirmative'],
    ['J\'ai tout compris.', 'affirmative'], ['Il pleut encore.', 'affirmative'], ['Vous chantez juste.', 'affirmative']
  ];
  const NEGATIONS = [
    ['Il joue au foot.', 'Il ne joue pas au foot.', ['Il joue pas au foot.', 'Il ne pas joue au foot.', 'Il ne joue au foot pas.']],
    ['Nous aimons la soupe.', 'Nous n\'aimons pas la soupe.', ['Nous ne aimons pas la soupe.', 'Nous aimons pas la soupe.', 'Nous n\'aimons la soupe.']],
    ['Elle est contente.', 'Elle n\'est pas contente.', ['Elle est pas contente.', 'Elle ne est pas contente.', 'Elle n\'est contente pas.']],
    ['Tu regardes la télévision.', 'Tu ne regardes pas la télévision.', ['Tu regardes pas la télévision.', 'Tu ne pas regardes la télévision.', 'Tu regardes ne pas la télévision.']],
    ['Le bébé dort.', 'Le bébé ne dort pas.', ['Le bébé dort pas.', 'Le bébé pas dort.', 'Le bébé ne pas dort.']],
    ['J\'ai faim.', 'Je n\'ai pas faim.', ['J\'ai pas faim.', 'Je ne ai pas faim.', 'Je n\'ai faim pas.']],
    ['Vous chantez.', 'Vous ne chantez pas.', ['Vous chantez pas.', 'Vous pas chantez.', 'Vous ne pas chantez.']],
    ['Les oiseaux volent.', 'Les oiseaux ne volent pas.', ['Les oiseaux volent pas.', 'Les oiseaux ne pas volent.', 'Les oiseaux pas volent.']]
  ];
  const tireTypes = tirage(TYPES), tireFormes = tirage(FORMES), tireNeg = tirage(NEGATIONS);
  const genTypes = () => {
    const t = alea(0, 5);
    if (t <= 3) { const [p, b] = tireTypes(); return qcm({ visuel: '💬', enonce: `Quel est le type de cette phrase ?<br>${phrase(p)}`, dire: p }, b, ['déclarative', 'interrogative', 'exclamative', 'impérative']); }
    if (t === 4) { const [p, b] = tireFormes(); return { visuel: '➕➖', enonce: `Cette phrase est à la forme…<br>${phrase(p)}`, dire: p, choix: ['affirmative', 'négative'], bonne: b }; }
    const [p, b, f] = tireNeg(); return qcm({ visuel: '🚫', enonce: `Quelle est la forme négative de :<br>${phrase(p)}`, dire: p }, b, f);
  };

  const SYNONYMES = [
    ['content', 'heureux', ['triste', 'fâché', 'inquiet']], ['commencer', 'débuter', ['finir', 'arrêter', 'oublier']],
    ['un bateau', 'un navire', ['un avion', 'un train', 'un port']], ['effrayé', 'apeuré', ['courageux', 'joyeux', 'calme']],
    ['joli', 'beau', ['laid', 'petit', 'vieux']], ['crier', 'hurler', ['chuchoter', 'murmurer', 'dormir']],
    ['finir', 'terminer', ['commencer', 'débuter', 'partir']], ['immense', 'gigantesque', ['minuscule', 'petit', 'étroit']],
    ['regarder', 'observer', ['écouter', 'sentir', 'toucher']], ['drôle', 'amusant', ['ennuyeux', 'triste', 'sérieux']],
    ['un chemin', 'un sentier', ['une rivière', 'une colline', 'un pont']], ['se dépêcher', 'se presser', ['traîner', 'se reposer', 'attendre']],
    ['une voiture', 'une automobile', ['un vélo', 'un camion', 'une moto']], ['rapide', 'vif', ['lent', 'lourd', 'calme']],
    ['un professeur', 'un enseignant', ['un élève', 'un directeur', 'un cuisinier']]
  ];
  const CONTRAIRES = [
    ['chaud', 'froid', ['tiède', 'brûlant', 'doux']], ['monter', 'descendre', ['grimper', 'sauter', 'marcher']],
    ['heureux', 'malheureux', ['joyeux', 'content', 'gai']], ['possible', 'impossible', ['facile', 'réalisable', 'certain']],
    ['ouvrir', 'fermer', ['entrer', 'pousser', 'regarder']], ['lourd', 'léger', ['gros', 'épais', 'solide']],
    ['toujours', 'jamais', ['souvent', 'parfois', 'longtemps']], ['propre', 'sale', ['net', 'neuf', 'lavé']],
    ['gagner', 'perdre', ['jouer', 'réussir', 'courir']], ['le jour', 'la nuit', ['le matin', 'le midi', 'le soleil']],
    ['coller', 'décoller', ['recoller', 'couper', 'plier']], ['visible', 'invisible', ['voyant', 'clair', 'net']],
    ['le début', 'la fin', ['le milieu', 'le départ', 'le commencement']], ['rapide', 'lent', ['pressé', 'vif', 'agile']],
    ['acheter', 'vendre', ['payer', 'dépenser', 'choisir']], ['plein', 'vide', ['rempli', 'complet', 'lourd']],
    ['faire', 'défaire', ['refaire', 'finir', 'fabriquer']], ['poli', 'impoli', ['gentil', 'aimable', 'calme']]
  ];
  const FAMILLES = [
    ['terre', 'terrain', ['tortue', 'tarte', 'tirer']], ['jardin', 'jardinier', ['jarre', 'jaune', 'gardien']],
    ['mer', 'marin', ['mère', 'maire', 'merle']], ['lait', 'laitier', ['laid', 'laine', 'laisser']],
    ['fleur', 'fleuriste', ['flèche', 'fleuve', 'flûte']], ['chant', 'chanteur', ['chanceux', 'chameau', 'champ']],
    ['long', 'longueur', ['loupe', 'louer', 'lion']], ['froid', 'refroidir', ['frite', 'fromage', 'frotter']],
    ['sel', 'salière', ['selle', 'ciel', 'cèdre']], ['pied', 'piéton', ['pie', 'pierre', 'pieuvre']],
    ['ami', 'amitié', ['amande', 'ampoule', 'animal']], ['dent', 'dentiste', ['danse', 'dans', 'dindon']],
    ['glace', 'glacier', ['glisser', 'glaïeul', 'gland']], ['nage', 'nageur', ['neige', 'nuage', 'nappe']]
  ];
  const PREFIXES = [['relire', 're-'], ['défaire', 'dé-'], ['impossible', 'im-'], ['incapable', 'in-'], ['prévoir', 'pré-'], ['malheureux', 'mal-'], ['survoler', 'sur-'], ['déplier', 'dé-'], ['refaire', 're-'], ['impatient', 'im-']];
  const SUFFIXES = [['jardinier', '-ier'], ['gentiment', '-ment'], ['maisonnette', '-ette'], ['boulangerie', '-erie'], ['lavable', '-able'], ['chanteur', '-eur'], ['arrosage', '-age'], ['fillette', '-ette'], ['rapidement', '-ment'], ['pommier', '-ier']];
  const SENS = [
    ['Il a un <u>cœur</u> de pierre.', 'figuré'], ['Le <u>cœur</u> pompe le sang.', 'propre'], ['Elle <u>dévore</u> les livres.', 'figuré'],
    ['Le lion <u>dévore</u> sa proie.', 'propre'], ['Il pleut des <u>cordes</u>.', 'figuré'], ['Elle saute à la <u>corde</u>.', 'propre'],
    ['Le lac est <u>glacé</u> en hiver.', 'propre'], ['Tu es une vraie <u>tortue</u> !', 'figuré'], ['La <u>tortue</u> avance lentement.', 'propre'],
    ['Mon grand-père a une mémoire d\'<u>éléphant</u>.', 'figuré'], ['L\'<u>éléphant</u> boit avec sa trompe.', 'propre'],
    ['Il a la <u>tête</u> dans les nuages.', 'figuré'], ['Je me suis cogné la <u>tête</u>.', 'propre']
  ];
  const genVocabulaire = () => {
    const t = alea(0, 5);
    if (t === 0) { const [m, b, f] = pioche(SYNONYMES); return qcm({ visuel: '🟰', enonce: `Quel est le synonyme de « ${m} » ?`, aide: 'Un synonyme a presque le même sens.' }, b, f); }
    if (t === 1) { const [m, b, f] = pioche(CONTRAIRES); return qcm({ visuel: '↔️', enonce: `Quel est le contraire de « ${m} » ?` }, b, f); }
    if (t === 2) { const [m, b, f] = pioche(FAMILLES); return qcm({ visuel: '👨‍👩‍👧', enonce: `Quel mot est de la même famille que « ${m} » ?`, aide: 'Les mots d\'une même famille ont un radical commun et un sens proche.' }, b, f); }
    if (t === 3) { const [m, b] = pioche(PREFIXES); return qcm({ visuel: '🧩', enonce: `Quel est le préfixe du mot « ${m} » ?`, aide: 'Le préfixe se place avant le radical.' }, b, PREFIXES.map(x => x[1]).concat(['dis-'])); }
    if (t === 4) { const [m, b] = pioche(SUFFIXES); return qcm({ visuel: '🧩', enonce: `Quel est le suffixe du mot « ${m} » ?`, aide: 'Le suffixe se place après le radical.' }, b, SUFFIXES.map(x => x[1])); }
    const [p, b] = pioche(SENS);
    return { visuel: '💡', enonce: `Le mot souligné est employé au sens…<br>${phrase(p)}`, dire: p, choix: ['propre', 'figuré'], bonne: b };
  };

  const MOTS_DICO = {
    a: ['abeille', 'ananas', 'arbre', 'avion', 'autruche', 'armoire', 'aile'],
    b: ['balle', 'banane', 'bateau', 'biscuit', 'bonbon', 'bouteille', 'branche', 'brosse', 'bureau', 'baleine'],
    c: ['cabane', 'cadeau', 'camion', 'carotte', 'cerise', 'chaise', 'chameau', 'château', 'citron', 'cochon', 'crayon', 'canard'],
    m: ['maison', 'manteau', 'marteau', 'melon', 'miroir', 'montagne', 'mouton', 'musique', 'moto', 'mardi'],
    p: ['panier', 'papillon', 'parapluie', 'pêche', 'piano', 'pirate', 'plage', 'pomme', 'poule', 'prince', 'pantalon'],
    s: ['sable', 'salade', 'sapin', 'serpent', 'singe', 'soleil', 'souris', 'stylo', 'sucre', 'sirop'],
    t: ['table', 'tambour', 'tapis', 'téléphone', 'tigre', 'tomate', 'tortue', 'train', 'trésor', 'tulipe']
  };
  const sansAccent = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const ordre = (a, b) => { const x = sansAccent(a), y = sansAccent(b); return x < y ? -1 : x > y ? 1 : 0; };
  const ABREV = [['n. m.', 'nom masculin'], ['n. f.', 'nom féminin'], ['adj.', 'adjectif'], ['v.', 'verbe'], ['adv.', 'adverbe'], ['pl.', 'pluriel']];
  const genDictionnaire = () => {
    const t = alea(0, 5);
    if (t === 5) { const [a, b] = pioche(ABREV); return qcm({ visuel: '📖', enonce: `Dans le dictionnaire, que signifie l'abréviation « ${a} » ?` }, b, ABREV.map(x => x[1])); }
    let mots;
    if (t <= 2) mots = melange(MOTS_DICO[pioche(Object.keys(MOTS_DICO))]).slice(0, 4);
    else mots = melange(Object.keys(MOTS_DICO)).slice(0, 4).map(l => pioche(MOTS_DICO[l]));
    const tri = [...mots].sort(ordre), premier = Math.random() < 0.6;
    const bon = premier ? tri[0] : tri[tri.length - 1];
    return qcm({ visuel: '📖', enonce: `Quel mot vient en ${premier ? 'premier' : 'dernier'} dans le dictionnaire ?`, aide: 'Si la première lettre est la même, regarde la deuxième, puis la troisième…' }, bon, mots.filter(m => m !== bon));
  };

  const TEXTES = [
    { v: '🐕', t: 'Tous les samedis, Malik promène Pistache, le chien de sa voisine, Mme Lopez. Mme Lopez est âgée et elle a mal aux genoux. Pour le remercier, elle lui prépare souvent une tarte aux pommes. Malik adore ces promenades au bord du canal.', qs: [
      ['À qui appartient Pistache ?', 'À Mme Lopez', ['À Malik', 'Au boulanger', 'À la maîtresse']],
      ['Pourquoi Mme Lopez ne promène-t-elle pas son chien ?', 'Elle a mal aux genoux.', ['Elle travaille le samedi.', 'Elle n\'aime pas les chiens.', 'Elle est en vacances.']]] },
    { v: '🌋', t: 'Le Vésuve est un volcan situé près de la ville de Naples, en Italie. En l\'an 79, il est entré en éruption. Ses cendres ont recouvert la ville romaine de Pompéi. Aujourd\'hui, les archéologues y découvrent des maisons, des rues et des objets très bien conservés.', qs: [
      ['Quelle ville a été recouverte par les cendres ?', 'Pompéi', ['Naples', 'Rome', 'Paris']],
      ['Dans quel pays se trouve le Vésuve ?', 'En Italie', ['En France', 'En Espagne', 'En Grèce']]] },
    { v: '🐝', t: 'Dans une ruche, il n\'y a qu\'une seule reine. Elle pond des œufs toute la journée. Les ouvrières, elles, récoltent le nectar des fleurs, nettoient la ruche et nourrissent les larves. Les mâles s\'appellent les faux bourdons.', qs: [
      ['Qui pond les œufs ?', 'La reine', ['Les ouvrières', 'Les faux bourdons', 'Les larves']],
      ['Comment s\'appellent les mâles ?', 'Les faux bourdons', ['Les ouvrières', 'Les reines', 'Les larves']]] },
    { v: '🎒', t: 'Ce matin, Inès s\'est réveillée en retard. Elle a enfilé ses vêtements en vitesse et a couru jusqu\'à l\'arrêt de bus. Arrivée à l\'école, elle s\'est aperçue qu\'elle avait oublié son cartable sur son lit. Heureusement, son père le lui a apporté à la récréation.', qs: [
      ['Qu\'a oublié Inès ?', 'Son cartable', ['Son manteau', 'Son goûter', 'Son vélo']],
      ['Qui lui a apporté ce qu\'elle avait oublié ?', 'Son père', ['Sa mère', 'La maîtresse', 'Le chauffeur du bus']]] },
    { v: '❄️', t: 'En hiver, la marmotte hiberne. Elle s\'enferme dans son terrier, sous la terre, et dort pendant plusieurs mois. Son cœur bat alors très lentement et elle ne mange pas. Elle se réveille au printemps, très amaigrie.', qs: [
      ['Où la marmotte passe-t-elle l\'hiver ?', 'Dans son terrier', ['Dans un arbre', 'Au bord de la mer', 'Dans une ferme']],
      ['Comment est la marmotte à son réveil ?', 'Très maigre', ['Très grosse', 'Malade', 'Toute blanche']]] },
    { v: '🏰', t: 'Au Moyen Âge, les fils de seigneurs apprenaient très tôt à monter à cheval. Vers sept ans, un garçon devenait page chez un autre seigneur. Plus tard, il devenait écuyer et s\'occupait des armes et du cheval d\'un chevalier. Enfin, vers vingt ans, il pouvait être adoubé chevalier.', qs: [
      ['Que devenait un garçon vers sept ans ?', 'Un page', ['Un écuyer', 'Un chevalier', 'Un seigneur']],
      ['Dans quel ordre devenait-on chevalier ?', 'page, écuyer, chevalier', ['écuyer, page, chevalier', 'chevalier, page, écuyer', 'page, chevalier, écuyer']]] },
    { v: '🌱', t: 'Pour faire pousser un haricot, Lou a posé une graine sur du coton mouillé. Elle a placé le pot près de la fenêtre. Au bout de trois jours, une petite racine est sortie de la graine. Une semaine plus tard, deux feuilles vertes sont apparues.', qs: [
      ['Qu\'est-ce qui est apparu en premier ?', 'Une racine', ['Deux feuilles', 'Une fleur', 'Un haricot']],
      ['Où Lou a-t-elle placé le pot ?', 'Près de la fenêtre', ['Dans le placard', 'Dans le frigo', 'Sous son lit']]] },
    { v: '🚲', t: 'Samedi, Hugo a participé à sa première course de vélo. Au départ, il était très nerveux. Dans la montée, il a doublé trois coureurs. Il a franchi la ligne d\'arrivée en deuxième position, juste derrière son ami Karim.', qs: [
      ['Qui a gagné la course ?', 'Karim', ['Hugo', 'Personne', 'Le père de Hugo']],
      ['À quelle place Hugo est-il arrivé ?', 'Deuxième', ['Premier', 'Troisième', 'Dernier']]] },
    { v: '🐢', t: 'La tortue luth est la plus grande tortue marine du monde. Elle peut mesurer jusqu\'à deux mètres de long. Elle se nourrit surtout de méduses. Malheureusement, elle confond parfois les sacs en plastique avec des méduses et elle s\'étouffe.', qs: [
      ['De quoi se nourrit surtout la tortue luth ?', 'De méduses', ['D\'algues', 'De crabes', 'De plastique']],
      ['Pourquoi les sacs en plastique sont-ils dangereux pour elle ?', 'Elle les prend pour des méduses.', ['Ils sont trop lourds.', 'Ils font du bruit.', 'Ils cachent le soleil.']]] },
    { v: '🎂', t: 'Pour l\'anniversaire de sa mère, Chloé a préparé un gâteau au chocolat avec l\'aide de sa grand-mère. Elle a cassé quatre œufs, puis ajouté du sucre, de la farine et du beurre fondu. Pendant la cuisson, toute la maison sentait bon. Sa mère était si émue qu\'elle a pleuré de joie.', qs: [
      ['Pour qui Chloé a-t-elle fait le gâteau ?', 'Pour sa mère', ['Pour sa grand-mère', 'Pour sa sœur', 'Pour sa maîtresse']],
      ['Pourquoi la mère de Chloé a-t-elle pleuré ?', 'Elle était émue.', ['Elle était triste.', 'Elle s\'était brûlée.', 'Le gâteau était raté.']]] },
    { v: '🚀', t: 'En 1969, trois astronautes américains sont partis vers la Lune à bord d\'Apollo 11. Neil Armstrong a été le premier homme à marcher sur la Lune. Buzz Aldrin l\'a rejoint quelques minutes plus tard. Michael Collins, lui, est resté en orbite dans le vaisseau.', qs: [
      ['Qui a marché le premier sur la Lune ?', 'Neil Armstrong', ['Buzz Aldrin', 'Michael Collins', 'Thomas Pesquet']],
      ['Qu\'a fait Michael Collins ?', 'Il est resté dans le vaisseau.', ['Il a marché sur la Lune.', 'Il est resté sur Terre.', 'Il a piloté un avion.']]] },
    { v: '🦊', t: 'Un renard affamé aperçut des raisins bien mûrs accrochés à une treille. Il sauta plusieurs fois pour les attraper, mais ils étaient trop hauts. Alors il s\'éloigna en disant : « Ils sont trop verts, ils ne sont bons que pour les sots ! »', qs: [
      ['Pourquoi le renard n\'a-t-il pas mangé les raisins ?', 'Ils étaient trop hauts.', ['Ils étaient trop verts.', 'Il n\'avait pas faim.', 'Il n\'aime pas les raisins.']]] },
    { v: '🏊', t: 'À la piscine, il est interdit de courir autour du bassin, car le sol est glissant. Il faut prendre une douche avant d\'entrer dans l\'eau. Les enfants qui ne savent pas nager doivent rester dans le petit bain. Le maître-nageur surveille tout le monde.', qs: [
      ['Pourquoi ne faut-il pas courir ?', 'Le sol est glissant.', ['Cela fait du bruit.', 'L\'eau est froide.', 'Le maître-nageur dort.']],
      ['Où doivent rester les enfants qui ne savent pas nager ?', 'Dans le petit bain', ['Dans le grand bain', 'Dans les douches', 'Sur le plongeoir']]] },
    { v: '🌧️', t: 'Le cycle de l\'eau ne s\'arrête jamais. Le soleil chauffe l\'eau des mers, qui s\'évapore. Cette vapeur monte, se refroidit et forme des nuages. Quand les gouttes deviennent trop lourdes, elles tombent sous forme de pluie.', qs: [
      ['D\'après le texte, qu\'est-ce qui fait évaporer l\'eau des mers ?', 'Le soleil', ['La lune', 'Les nuages', 'La pluie']],
      ['Quand la pluie tombe-t-elle ?', 'Quand les gouttes sont trop lourdes', ['Quand la mer est chaude', 'Quand il y a du soleil', 'Quand la vapeur monte']]] },
    { v: '📚', t: 'La médiathèque de mon quartier est ouverte le mercredi et le samedi. On peut y emprunter des livres, des BD et des films. On peut garder les documents trois semaines. Si on les rend en retard, on ne peut plus emprunter pendant une semaine.', qs: [
      ['Combien de temps peut-on garder un livre ?', 'Trois semaines', ['Une semaine', 'Trois jours', 'Un mois']],
      ['Quels jours la médiathèque est-elle ouverte ?', 'Le mercredi et le samedi', ['Tous les jours', 'Le lundi et le jeudi', 'Le dimanche']]] },
    { v: '🐺', t: 'Le loup vit en meute, c\'est-à-dire en groupe. Une meute compte souvent entre quatre et huit loups. Ils chassent ensemble des cerfs ou des sangliers. Pour communiquer, les loups hurlent, grognent et utilisent leur queue et leurs oreilles.', qs: [
      ['Qu\'est-ce qu\'une meute ?', 'Un groupe de loups', ['Un terrier', 'Une proie', 'Un cri de loup']],
      ['Comment les loups chassent-ils ?', 'Ensemble', ['Chacun seul', 'Avec des pièges', 'Dans l\'eau']]] },
    { v: '🗼', t: 'La tour Eiffel a été construite pour l\'Exposition universelle de 1889, à Paris. Elle mesure environ 330 mètres de haut. Au début, beaucoup de Parisiens la trouvaient laide. Aujourd\'hui, c\'est l\'un des monuments les plus visités au monde.', qs: [
      ['Pour quel événement la tour Eiffel a-t-elle été construite ?', 'L\'Exposition universelle de 1889', ['Les Jeux olympiques', 'La Révolution française', 'Le mariage d\'un roi']],
      ['Que pensaient beaucoup de Parisiens au début ?', 'Qu\'elle était laide', ['Qu\'elle était trop petite', 'Qu\'elle était magnifique', 'Qu\'elle était en or']]] },
    { v: '⚽', t: 'Pendant la récréation, Nathan et ses amis jouent au football. Ce matin, le ballon a atterri sur le toit du préau. Nathan voulait grimper pour le chercher, mais Sofia l\'en a empêché : c\'était trop dangereux. Ils ont prévenu la maîtresse, qui a appelé le gardien avec son échelle.', qs: [
      ['Où est tombé le ballon ?', 'Sur le toit du préau', ['Dans la rue', 'Dans un arbre', 'Dans la classe']],
      ['Qui est allé chercher le ballon ?', 'Le gardien', ['Nathan', 'Sofia', 'La maîtresse']]] },
    { v: '🦋', t: 'La chenille sort d\'un petit œuf pondu sur une feuille. Elle mange sans arrêt et grossit très vite. Un jour, elle s\'enferme dans une chrysalide. Quelques semaines plus tard, un papillon en sort et déploie ses ailes.', qs: [
      ['D\'où sort le papillon ?', 'D\'une chrysalide', ['D\'un œuf', 'D\'une fleur', 'D\'une feuille']],
      ['Quel est le bon ordre ?', 'œuf, chenille, chrysalide, papillon', ['chenille, œuf, papillon, chrysalide', 'œuf, chrysalide, chenille, papillon', 'papillon, chenille, œuf, chrysalide']]] },
    { v: '⛵', t: 'Mon grand-père était marin. Pendant trente ans, il a navigué sur des cargos qui transportaient des marchandises. Il a traversé l\'océan Atlantique plus de cent fois. Maintenant, il vit dans un petit port breton et répare des bateaux de pêche.', qs: [
      ['Quel était le métier du grand-père ?', 'Marin', ['Boulanger', 'Pilote d\'avion', 'Facteur']],
      ['Où vit-il aujourd\'hui ?', 'Dans un port breton', ['Sur un cargo', 'En Amérique', 'À la montagne']]] },
    { v: '🍎', t: 'Pour rester en bonne santé, il faut manger de tout, mais en quantités raisonnables. Les fruits et les légumes apportent des vitamines. Les produits laitiers donnent du calcium, utile pour les os. Les sucreries, elles, doivent rester un plaisir occasionnel.', qs: [
      ['D\'après le texte, à quoi sert le calcium ?', 'Aux os', ['Aux yeux', 'Aux cheveux', 'À dormir']],
      ['Comment faut-il manger les sucreries ?', 'De temps en temps', ['À chaque repas', 'Tous les matins', 'Le plus possible']]] },
    { v: '🧭', t: 'Léna et son père partent en randonnée dans les Pyrénées. Ils emportent une carte, une boussole, de l\'eau et des sandwichs. Au sommet, ils admirent la vue sur les montagnes enneigées. Sur le chemin du retour, ils aperçoivent un isard, une sorte de chèvre sauvage.', qs: [
      ['Qu\'est-ce qu\'un isard ?', 'Une sorte de chèvre sauvage', ['Un oiseau', 'Un poisson', 'Une fleur']],
      ['Dans quelles montagnes se promènent-ils ?', 'Les Pyrénées', ['Les Alpes', 'Les Vosges', 'Le Jura']]] },
    { v: '👑', t: 'Louis XIV est devenu roi à l\'âge de quatre ans, en 1643. Comme il était trop jeune pour gouverner, sa mère, Anne d\'Autriche, dirigeait le royaume avec l\'aide du cardinal Mazarin. Plus tard, Louis XIV a décidé de gouverner seul. Il a régné pendant soixante-douze ans.', qs: [
      ['Quel âge avait Louis XIV quand il est devenu roi ?', 'Quatre ans', ['Dix ans', 'Vingt ans', 'Soixante-douze ans']],
      ['Qui dirigeait le royaume quand le roi était petit ?', 'Sa mère, avec Mazarin', ['Son père', 'Le roi d\'Espagne', 'Personne']]] },
    { v: '🔥', t: 'Hier soir, une alarme a retenti dans l\'immeuble. Tous les habitants sont descendus par l\'escalier, sans prendre l\'ascenseur. Les pompiers sont arrivés en quelques minutes. C\'était une casserole oubliée sur le feu : il y avait beaucoup de fumée, mais personne n\'a été blessé.', qs: [
      ['Qu\'est-ce qui a déclenché l\'alarme ?', 'Une casserole oubliée sur le feu', ['Un orage', 'Une panne d\'ascenseur', 'Un chat coincé']],
      ['Comment les habitants sont-ils descendus ?', 'Par l\'escalier', ['Par l\'ascenseur', 'Par la fenêtre', 'Avec une échelle']]] },
    { v: '🐪', t: 'Le désert du Sahara se trouve en Afrique. C\'est le plus grand désert chaud du monde. Il y fait très chaud le jour, mais les nuits peuvent être froides. Les dromadaires y vivent bien, car ils peuvent rester longtemps sans boire.', qs: [
      ['Sur quel continent se trouve le Sahara ?', 'En Afrique', ['En Asie', 'En Europe', 'En Amérique']],
      ['Pourquoi les dromadaires vivent-ils bien dans le désert ?', 'Ils peuvent rester longtemps sans boire.', ['Ils aiment le froid.', 'Ils mangent du sable.', 'Ils nagent très bien.']],
      ['Comment sont les nuits dans le désert ?', 'Elles peuvent être froides.', ['Elles sont toujours brûlantes.', 'Il n\'y a pas de nuit.', 'Il pleut chaque nuit.']]] },
    { v: '🎻', t: 'Wolfgang Amadeus Mozart est né en 1756 à Salzbourg, une ville qui se trouve aujourd\'hui en Autriche. À cinq ans, il composait déjà de petits morceaux de musique. Enfant, il a voyagé dans toute l\'Europe pour jouer devant des rois et des reines. Il a composé plus de six cents œuvres.', qs: [
      ['Quel était le talent de Mozart ?', 'La musique', ['La peinture', 'La danse', 'Le théâtre']],
      ['À quel âge composait-il déjà ?', 'À cinq ans', ['À quinze ans', 'À trente ans', 'À un an']]] },
    { v: '🐧', t: 'Le manchot empereur vit en Antarctique, où il fait extrêmement froid. La femelle pond un seul œuf, puis part en mer pour se nourrir. Pendant ce temps, c\'est le mâle qui garde l\'œuf au chaud sur ses pattes, pendant environ deux mois, sans manger.', qs: [
      ['Qui garde l\'œuf ?', 'Le mâle', ['La femelle', 'Les petits', 'Personne']],
      ['Combien d\'œufs pond la femelle ?', 'Un seul', ['Deux', 'Dix', 'Aucun']]] }
  ];
  const QUESTIONS_TEXTES = [];
  TEXTES.forEach(x => x.qs.forEach(q => QUESTIONS_TEXTES.push([x, q])));
  const tireTexte = tirage(QUESTIONS_TEXTES);
  const genComprehension = () => {
    const [x, [q, b, f]] = tireTexte();
    return qcm({
      visuel: x.v,
      enonce: `<span style="font-weight:normal;display:block;text-align:left;margin-bottom:.6em">${x.t}</span><b>${q}</b>`,
      dire: x.t + ' ' + q
    }, b, f);
  };

  // Dictée : [mot, phrase d'exemple, variantes acceptées]
  const DICTEE = [
    ['beaucoup', 'Il y a beaucoup de monde au marché.'], ['toujours', 'Mon chat dort toujours sur mon lit.'], ['longtemps', 'Nous avons attendu longtemps.'],
    ['maintenant', 'Tu peux sortir maintenant.'], ['aujourd\'hui', 'Aujourd\'hui, il fait très beau.'], ['pendant', 'Il a dormi pendant tout le film.'],
    ['souvent', 'Je vais souvent chez ma grand-mère.'], ['quelquefois', 'Il neige quelquefois en montagne.'], ['déjà', 'Tu as déjà fini ton dessin ?'],
    ['bientôt', 'Les vacances arrivent bientôt.'], ['ensuite', 'Lave-toi les mains, ensuite tu mangeras.'], ['dehors', 'Les enfants jouent dehors.'],
    ['jamais', 'Je ne mens jamais.'], ['plusieurs', 'J\'ai lu plusieurs livres.'], ['chaque', 'Chaque élève a un cahier.'],
    ['ensemble', 'Nous chantons tous ensemble.'], ['autrefois', 'Autrefois, on s\'éclairait à la bougie.'], ['environ', 'Il y a environ vingt élèves.'],
    ['vraiment', 'Ce gâteau est vraiment délicieux.'], ['malgré', 'Il sort malgré la pluie.'], ['près', 'J\'habite près de l\'école.'],
    ['très', 'Cette tour est très haute.'], ['après', 'Après le repas, je lis une histoire.'], ['derrière', 'Le chat se cache derrière le rideau.'],
    ['parce que', 'Je mets mon manteau parce que j\'ai froid.'], ['fenêtre', 'Ouvre la fenêtre, s\'il te plaît.'], ['château', 'Le roi vit dans un château.'],
    ['forêt', 'Le loup se promène dans la forêt.'], ['hôpital', 'Le médecin travaille à l\'hôpital.'], ['théâtre', 'Nous allons voir une pièce de théâtre.'],
    ['île', 'La Corse est une île.', ['ile']], ['boîte', 'Range tes crayons dans la boîte.', ['boite']], ['goûter', 'À quatre heures, je prends mon goûter.', ['gouter']],
    ['maîtresse', 'La maîtresse écrit au tableau.', ['maitresse']], ['août', 'Mon anniversaire est en août.', ['aout']], ['monsieur', 'Bonjour, monsieur.'],
    ['femme', 'Cette femme est pilote d\'avion.'], ['sœur', 'Ma sœur a sept ans.', ['soeur']], ['cœur', 'Mon cœur bat très vite.', ['coeur']],
    ['œuf', 'Je mange un œuf à la coque.', ['oeuf']], ['garçon', 'Ce garçon court très vite.'], ['leçon', 'J\'apprends ma leçon.'],
    ['glaçon', 'Je mets un glaçon dans mon verre.'], ['pigeon', 'Un pigeon picore du pain.'], ['nageoire', 'Le poisson remue sa nageoire.'],
    ['éléphant', 'L\'éléphant a une longue trompe.'], ['dauphin', 'Le dauphin saute hors de l\'eau.'], ['pharmacie', 'Maman achète un médicament à la pharmacie.'],
    ['orthographe', 'Je fais attention à l\'orthographe.'], ['automne', 'En automne, les feuilles tombent.'], ['printemps', 'Au printemps, les fleurs poussent.'],
    ['corps', 'Le squelette soutient le corps.'], ['doigt', 'Je me suis coupé le doigt.'], ['poids', 'Quel est le poids de ce colis ?'],
    ['grenouille', 'La grenouille saute dans la mare.'], ['abeille', 'L\'abeille butine les fleurs.'], ['soleil', 'Le soleil se couche à l\'ouest.'],
    ['travail', 'Mon père part au travail.'], ['feuille', 'Prends une feuille de papier.'], ['bouteille', 'La bouteille est vide.'],
    ['famille', 'Toute la famille est réunie.'], ['hiver', 'En hiver, il fait froid.'], ['histoire', 'Raconte-moi une histoire.'],
    ['hibou', 'Le hibou chasse la nuit.'], ['herbe', 'La vache mange de l\'herbe.'], ['gentil', 'Ton chien est très gentil.'],
    ['chaussette', 'J\'ai perdu une chaussette.'], ['escalier', 'Monte l\'escalier doucement.'], ['cahier', 'Ouvre ton cahier.'],
    ['papier', 'Je dessine sur du papier.'], ['poisson', 'Le poisson nage dans le bocal.'], ['voyage', 'Nous partons en voyage.'],
    ['nuage', 'Un gros nuage cache le soleil.'], ['quatorze', 'J\'ai quatorze billes.'], ['cinquante', 'Ce livre a cinquante pages.'],
    ['soixante', 'Une heure dure soixante minutes.'], ['mille', 'Un kilomètre, c\'est mille mètres.'], ['immeuble', 'Nous habitons dans un grand immeuble.'],
    ['addition', 'Fais cette addition.'], ['accident', 'Il y a eu un accident sur la route.'], ['personne', 'Il n\'y a personne dans la rue.'],
    ['anniversaire', 'Joyeux anniversaire !'], ['tranquille', 'Le lac est tranquille.'], ['difficile', 'Cet exercice est difficile.'],
    ['silence', 'Le silence règne dans la classe.'], ['attention', 'Fais attention en traversant.']
  ];
  const tireDictee = tirage(DICTEE);
  const genDictee = () => {
    const [mot, ex, acc] = tireDictee();
    const q = { type: 'saisie', visuel: '🎧', enonce: 'Écoute bien, puis écris le mot.', aide: 'Appuie sur le haut-parleur pour réécouter.', dire: `${mot}. ${ex} ${mot}.`, bonne: mot };
    if (acc) q.accepte = acc;
    return q;
  };

  ajouterJeux('CM1', 'francais', [
    { id: 'passe-compose', titre: 'Le passé composé', emoji: '⏪', gen: genPasseCompose },
    { id: 'grammaire', titre: 'Sujet, verbe, compléments', emoji: '🧐', gen: genGrammaire },
    { id: 'accords', titre: 'Les accords', emoji: '✅', gen: genAccords },
    { id: 'types-phrases', titre: 'Types de phrases', emoji: '💬', gen: genTypes },
    { id: 'vocabulaire', titre: 'Vocabulaire', emoji: '📚', gen: genVocabulaire },
    { id: 'dictionnaire', titre: 'Le dictionnaire', emoji: '📖', gen: genDictionnaire },
    { id: 'comprehension', titre: 'Compréhension de texte', emoji: '🔍', gen: genComprehension },
    { id: 'dictee', titre: 'Dictée de mots', emoji: '🎧', gen: genDictee }
  ]);

  /* ======================= HISTOIRE ======================= */
  HISTOIRE.push(
    { q: 'Quelle découverte a permis aux hommes préhistoriques de se chauffer et de cuire leurs aliments ?', v: '🔥', b: 'La maîtrise du feu', f: ['L\'électricité', 'Le fer', 'L\'écriture'] },
    { q: 'Au Néolithique, les hommes deviennent agriculteurs et éleveurs. Ils s\'installent dans des villages : ils deviennent…', v: '🌾', b: 'sédentaires', f: ['nomades', 'navigateurs', 'chevaliers'] },
    { q: 'Comment appelle-t-on les grandes pierres dressées, comme à Carnac ?', v: '🗿', b: 'Des menhirs', f: ['Des pyramides', 'Des châteaux', 'Des cathédrales'] },
    { q: 'Quelle invention marque la fin de la Préhistoire ?', v: '✍️', b: 'L\'écriture', f: ['Le feu', 'L\'imprimerie', 'La machine à vapeur'] },
    { q: 'Quel était le nom de Paris à l\'époque gallo-romaine ?', b: 'Lutèce', f: ['Lugdunum', 'Massalia', 'Burdigala'] },
    { q: 'Comment appelle-t-on la civilisation née du mélange des Gaulois et des Romains ?', b: 'Gallo-romaine', f: ['Viking', 'Égyptienne', 'Carolingienne'] },
    { q: 'Quel célèbre pont-aqueduc romain se trouve dans le département du Gard ?', v: '🌉', b: 'Le pont du Gard', f: ['Le pont Neuf', 'Le pont d\'Avignon', 'Le pont de Normandie'] },
    { q: 'Quelle cité grecque, fondée vers 600 av. J.-C., est devenue Marseille ?', v: '⛵', b: 'Massalia', f: ['Lutèce', 'Alésia', 'Rome'] },
    { q: 'Dans quelle ville Clovis a-t-il été baptisé ?', b: 'Reims', f: ['Paris', 'Lyon', 'Versailles'] },
    { q: 'En quelle année Hugues Capet devient-il roi des Francs ?', v: '👑', b: '987', f: ['52 av. J.-C.', '1515', '1789'] },
    { q: 'Au Moyen Âge, qui cultive les terres du seigneur ?', v: '🌾', b: 'Les paysans', f: ['Les chevaliers', 'Les rois', 'Les pages'] },
    { q: 'Comment s\'appelle la cérémonie où un jeune homme devient chevalier ?', v: '⚔️', b: 'L\'adoubement', f: ['Le sacre', 'Le baptême', 'Le mariage'] },
    { q: 'Contre quel pays la France s\'est-elle battue pendant la guerre de Cent Ans ?', b: 'L\'Angleterre', f: ['L\'Espagne', 'L\'Italie', 'La Suisse'] },
    { q: 'Dans quelle ville Jeanne d\'Arc a-t-elle été brûlée en 1431 ?', b: 'Rouen', f: ['Orléans', 'Reims', 'Marseille'] },
    { q: 'Quel grand artiste italien le roi François Ier a-t-il invité en France ?', v: '🎨', b: 'Léonard de Vinci', f: ['Picasso', 'Mozart', 'Victor Hugo'] },
    { q: 'Quel château de la Loire François Ier a-t-il fait construire ?', v: '🏰', b: 'Chambord', f: ['Versailles', 'Carcassonne', 'Le Mont-Saint-Michel'] },
    { q: 'Depuis l\'ordonnance de Villers-Cotterêts (1539), les actes officiels doivent être écrits…', v: '📜', b: 'en français', f: ['en latin', 'en anglais', 'en grec'] },
    { q: 'Comment appelle-t-on la période du XVIe siècle où les arts et les sciences se renouvellent ?', v: '🎨', b: 'La Renaissance', f: ['La Préhistoire', 'La Révolution', 'L\'Antiquité'] },
    { q: 'Louis XIV décidait de tout, seul. On parle de monarchie…', v: '👑', b: 'absolue', f: ['républicaine', 'démocratique', 'parlementaire'] },
    { q: 'Pendant combien d\'années Louis XIV a-t-il régné ?', v: '☀️', b: '72 ans', f: ['10 ans', '30 ans', '100 ans'] },
    { q: 'En 1789, Louis XVI réunit les représentants du clergé, de la noblesse et du tiers état. Ce sont…', b: 'les États généraux', f: ['les croisades', 'les Jeux olympiques', 'les Parlements gaulois'] },
    { q: 'Quel texte important est adopté le 26 août 1789 ?', v: '📜', b: 'La Déclaration des droits de l\'homme et du citoyen', f: ['Le Code civil', 'L\'édit de Nantes', 'La Convention des droits de l\'enfant'] },
    { q: 'Que décident les députés dans la nuit du 4 août 1789 ?', b: 'L\'abolition des privilèges', f: ['La mort du roi', 'Le sacre de Napoléon', 'La construction de Versailles'] },
    { q: 'Quel roi a été guillotiné en 1793 ?', b: 'Louis XVI', f: ['Louis XIV', 'Henri IV', 'François Ier'] },
    { q: 'En quelle année la République est-elle proclamée pour la première fois en France ?', v: '🇫🇷', b: '1792', f: ['1515', '1715', '1815'] },
    { q: 'Qui était la reine, épouse de Louis XVI ?', b: 'Marie-Antoinette', f: ['Jeanne d\'Arc', 'Anne d\'Autriche', 'Aliénor d\'Aquitaine'] },
    { q: 'Pendant la Révolution, en 1790, le territoire français est découpé en…', v: '🗺️', b: 'départements', f: ['royaumes', 'duchés', 'comtés'] },
    { q: 'Quel système de mesures, avec le mètre et le kilogramme, est créé pendant la Révolution ?', v: '📏', b: 'Le système métrique', f: ['Le système solaire', 'Le pied et le pouce', 'Le calendrier chinois'] },
    { q: 'Sur quelle île Napoléon Bonaparte est-il né ?', v: '🏝️', b: 'La Corse', f: ['La Sardaigne', 'Sainte-Hélène', 'La Réunion'] },
    { q: 'En quelle année Napoléon Bonaparte est-il sacré empereur ?', v: '👑', b: '1804', f: ['1789', '1815', '1492'] },
    { q: 'Quel recueil de lois, créé sous Napoléon en 1804, est encore utilisé aujourd\'hui ?', v: '⚖️', b: 'Le Code civil', f: ['L\'édit de Nantes', 'La Marseillaise', 'La Déclaration des droits de l\'enfant'] },
    { q: 'Quelle bataille marque la défaite finale de Napoléon en 1815 ?', b: 'Waterloo', f: ['Marignan', 'Alésia', 'Austerlitz'] },
    { q: 'Quels établissements scolaires Napoléon a-t-il créés en 1802 ?', v: '🏫', b: 'Les lycées', f: ['Les écoles maternelles', 'Les crèches', 'Les colonies de vacances'] },
    { q: 'Quelle décoration Napoléon a-t-il créée en 1802 pour récompenser les mérites ?', v: '🎖️', b: 'La Légion d\'honneur', f: ['Le prix Nobel', 'La médaille olympique', 'La coupe du monde'] },
    { q: 'Où Napoléon est-il mort en exil, en 1821 ?', v: '🏝️', b: 'Sur l\'île de Sainte-Hélène', f: ['En Corse', 'À Paris', 'À Versailles'] }
  );

  /* ======================= GÉOGRAPHIE ======================= */
  GEOGRAPHIE.push(
    { q: 'Sur une carte ou un plan, à quoi sert la légende ?', v: '🗺️', b: 'À expliquer les symboles et les couleurs', f: ['À indiquer l\'heure', 'À donner l\'âge de la carte', 'À raconter une histoire'] },
    { q: 'Qui dirige la commune ?', v: '🏛️', b: 'Le maire', f: ['Le président de la République', 'Le directeur d\'école', 'Le boulanger'] },
    { q: 'Dans quel bâtiment travaille le maire ?', v: '🏛️', b: 'La mairie', f: ['L\'Élysée', 'La gare', 'La poste'] },
    { q: 'Combien y a-t-il de départements en France (métropole et outre-mer) ?', b: '101', f: ['13', '50', '200'] },
    { q: 'Quel territoire français se trouve en Amérique du Sud ?', v: '🌴', b: 'La Guyane', f: ['La Corse', 'La Réunion', 'Mayotte'] },
    { q: 'Dans quel océan se trouve l\'île de La Réunion ?', v: '🏝️', b: 'L\'océan Indien', f: ['L\'océan Atlantique', 'L\'océan Pacifique', 'L\'océan Arctique'] },
    { q: 'Quel type de logement regroupe plusieurs appartements ?', v: '🏢', b: 'Un immeuble', f: ['Une maison individuelle', 'Une ferme', 'Une cabane'] },
    { q: 'Comment appelle-t-on les communes qui entourent une grande ville ?', v: '🏘️', b: 'La banlieue', f: ['Le centre-ville', 'La montagne', 'Le littoral'] },
    { q: 'Où peut-on emprunter des livres, des BD et des films ?', v: '📚', b: 'À la médiathèque', f: ['Au supermarché', 'À la gare', 'À la piscine'] },
    { q: 'Quel lieu culturel expose des tableaux et des sculptures ?', v: '🖼️', b: 'Un musée', f: ['Un stade', 'Une usine', 'Un hôpital'] },
    { q: 'Comment appelle-t-on une eau que l\'on peut boire sans danger ?', v: '🚰', b: 'Une eau potable', f: ['Une eau usée', 'Une eau salée', 'Une eau polluée'] },
    { q: 'Où sont nettoyées les eaux usées avant de retourner dans la nature ?', v: '💧', b: 'Dans une station d\'épuration', f: ['Dans un château d\'eau', 'Dans une centrale nucléaire', 'Dans une piscine'] },
    { q: 'À quoi sert un château d\'eau ?', b: 'À stocker l\'eau potable et la distribuer', f: ['À produire de l\'électricité', 'À nettoyer les eaux usées', 'À fabriquer de la neige'] },
    { q: 'En France, la plus grande partie de l\'électricité est produite par…', v: '⚡', b: 'les centrales nucléaires', f: ['les éoliennes', 'les panneaux solaires', 'les centrales au charbon'] },
    { q: 'Un barrage hydroélectrique produit de l\'électricité grâce…', v: '🌊', b: 'à la force de l\'eau', f: ['au vent', 'au soleil', 'au charbon'] },
    { q: 'Quelle source d\'énergie va finir par s\'épuiser ?', v: '🛢️', b: 'Le pétrole', f: ['Le soleil', 'Le vent', 'L\'eau des rivières'] },
    { q: 'Acheter ses légumes directement au producteur, près de chez soi, c\'est…', v: '🥕', b: 'un circuit court', f: ['un circuit long', 'une importation', 'une exportation'] },
    { q: 'Pour aller à l\'école tout près de chez soi, quel moyen de transport pollue le moins ?', v: '🚶', b: 'La marche à pied', f: ['La voiture', 'L\'avion', 'Le scooter'] },
    { q: 'Quelle est la deuxième ville de France par le nombre d\'habitants ?', b: 'Marseille', f: ['Nice', 'Rennes', 'Dijon'] },
    { q: 'Quel fleuve traverse Bordeaux ?', b: 'La Garonne', f: ['La Seine', 'La Loire', 'Le Rhône'] },
    { q: 'Quelle ville du sud-ouest est surnommée la « ville rose » ?', v: '🌸', b: 'Toulouse', f: ['Lille', 'Strasbourg', 'Brest'] },
    { q: 'Dans quel massif se trouve le puy de Dôme, un ancien volcan ?', v: '🌋', b: 'Le Massif central', f: ['Les Alpes', 'Les Pyrénées', 'Le Jura'] },
    { q: 'Quelle mer sépare la France de l\'Angleterre ?', v: '🌊', b: 'La Manche', f: ['La mer Méditerranée', 'La mer Noire', 'La mer Baltique'] },
    { q: 'Lequel de ces pays n\'a PAS de frontière avec la France ?', b: 'Le Portugal', f: ['La Belgique', 'L\'Allemagne', 'L\'Italie'] },
    { q: 'Combien d\'habitants compte environ la France ?', v: '👥', b: 'Environ 68 millions', f: ['Environ 6 millions', 'Environ 680 millions', 'Environ 2 milliards'] },
    { q: 'Comment surnomme-t-on la France métropolitaine, à cause de sa forme à six côtés ?', b: 'L\'Hexagone', f: ['Le Triangle', 'Le Carré', 'Le Cercle'] },
    { q: 'Sur une carte, où se trouve l\'ouest ?', v: '🧭', b: 'À gauche', f: ['À droite', 'En haut', 'En bas'] },
    { q: 'Pourquoi faut-il économiser l\'eau ?', v: '💧', b: 'C\'est une ressource précieuse', f: ['Elle est dangereuse', 'Elle est inutile', 'Elle abîme les tuyaux'] },
    { q: 'Quel pays, voisin de la France, a pour capitale Berlin ?', b: 'L\'Allemagne', f: ['La Belgique', 'La Suisse', 'L\'Italie'] },
    { q: 'Quel département d\'outre-mer est une île de l\'océan Indien, près de Madagascar ?', b: 'Mayotte', f: ['La Guyane', 'La Martinique', 'La Guadeloupe'] }
  );

  /* ======================= SCIENCES ======================= */
  SCIENCES.push(
    { q: 'Quand on mélange du sel dans de l\'eau, on ne le voit plus. On dit qu\'il se…', v: '🧂', b: 'dissout', f: ['évapore', 'congèle', 'brûle'] },
    { q: 'L\'eau et l\'huile mélangées : on voit encore les deux. C\'est un mélange…', v: '🫗', b: 'hétérogène', f: ['homogène', 'gazeux', 'invisible'] },
    { q: 'Quelle technique permet de séparer le sable de l\'eau ?', v: '⏳', b: 'La filtration', f: ['La dissolution', 'La fusion', 'La congélation'] },
    { q: 'Comment récupérer le sel dissous dans de l\'eau ?', v: '☀️', b: 'En faisant évaporer l\'eau', f: ['En filtrant', 'En secouant', 'En ajoutant du sucre'] },
    { q: 'L\'air est-il de la matière ?', v: '🎈', b: 'Oui, il a une masse', f: ['Non, c\'est du vide', 'Non, car on ne le voit pas', 'Seulement quand il fait froid'] },
    { q: 'Quand la vapeur d\'eau refroidit et redevient liquide, on parle de…', v: '💧', b: 'condensation', f: ['fusion', 'solidification', 'dissolution'] },
    { q: 'Quel état de l\'eau a une forme propre ?', v: '🧊', b: 'L\'état solide', f: ['L\'état liquide', 'L\'état gazeux', 'Aucun'] },
    { q: 'Quel animal est un vertébré (il a un squelette avec une colonne vertébrale) ?', v: '🦴', b: 'Le chat', f: ['L\'escargot', 'Le ver de terre', 'L\'araignée'] },
    { q: 'Combien de pattes a un insecte ?', v: '🐜', b: '6', f: ['4', '8', '10'] },
    { q: 'L\'araignée n\'est pas un insecte, car elle a…', v: '🕷️', b: '8 pattes', f: ['6 pattes', 'des ailes', 'des plumes'] },
    { q: 'Quel animal a des plumes ?', b: 'La poule', f: ['Le dauphin', 'La chauve-souris', 'Le lézard'] },
    { q: 'Quel animal est un mammifère ?', v: '🌊', b: 'Le dauphin', f: ['Le requin', 'La tortue', 'Le saumon'] },
    { q: 'Les femelles des mammifères nourrissent leurs petits avec…', v: '🍼', b: 'du lait', f: ['des graines', 'des insectes', 'du nectar'] },
    { q: 'Quel animal pond des œufs ?', v: '🥚', b: 'Le crocodile', f: ['La vache', 'Le chien', 'Le lapin'] },
    { q: 'Quel animal change beaucoup de forme en grandissant (métamorphose) ?', b: 'La grenouille', f: ['Le chien', 'Le cheval', 'La poule'] },
    { q: 'Comment s\'appelle le petit de la grenouille ?', v: '🐸', b: 'Le têtard', f: ['La chenille', 'Le poussin', 'Le faon'] },
    { q: 'Après la pollinisation, la fleur du pommier se transforme en…', v: '🌸', b: 'fruit (une pomme)', f: ['feuille', 'racine', 'tige'] },
    { q: 'Quand une graine commence à pousser, on parle de…', v: '🌱', b: 'germination', f: ['floraison', 'fusion', 'digestion'] },
    { q: 'Le plus souvent, par quoi commence une chaîne alimentaire ?', v: '🌿', b: 'Un végétal', f: ['Un carnivore', 'Un herbivore', 'Un oiseau'] },
    { q: 'Dans une chaîne alimentaire, que signifie la flèche → ?', b: '« est mangé par »', f: ['« est l\'ami de »', '« est plus grand que »', '« habite avec »'] },
    { q: 'Quels êtres vivants transforment les feuilles mortes en terre (vers de terre, champignons…) ?', v: '🍂', b: 'Les décomposeurs', f: ['Les carnivores', 'Les oiseaux', 'Les poissons'] },
    { q: 'Quelle est l\'étoile la plus proche de la Terre ?', v: '☀️', b: 'Le Soleil', f: ['La Lune', 'Mars', 'L\'étoile Polaire'] },
    { q: 'Combien de planètes tournent autour du Soleil ?', v: '🪐', b: '8', f: ['5', '9', '12'] },
    { q: 'Quelle est la plus grande planète du système solaire ?', v: '🪐', b: 'Jupiter', f: ['La Terre', 'Mars', 'Mercure'] },
    { q: 'Quelle planète est la plus proche du Soleil ?', b: 'Mercure', f: ['La Terre', 'Jupiter', 'Neptune'] },
    { q: 'Pourquoi y a-t-il le jour et la nuit ?', v: '🌗', b: 'Parce que la Terre tourne sur elle-même', f: ['Parce que le Soleil s\'éteint la nuit', 'Parce que la Lune cache le Soleil', 'Parce que les nuages cachent le Soleil'] },
    { q: 'Pour qu\'une ampoule s\'allume, le circuit électrique doit être…', v: '💡', b: 'fermé', f: ['ouvert', 'coupé', 'mouillé'] },
    { q: 'Quel matériau fabrique-t-on à partir du sable ?', b: 'Le verre', f: ['Le bois', 'Le papier', 'La laine'] },
    { q: 'Le papier est fabriqué à partir…', v: '📄', b: 'du bois', f: ['du pétrole', 'du sable', 'du fer'] },
    { q: 'La plupart des plastiques sont fabriqués à partir…', b: 'du pétrole', f: ['du bois', 'du sable', 'de la laine'] },
    { q: 'Quelle énergie fait tourner une éolienne ?', v: '🌬️', b: 'L\'énergie du vent', f: ['L\'énergie du pétrole', 'L\'énergie du charbon', 'L\'énergie du gaz'] },
    { q: 'Quel geste permet d\'économiser l\'énergie ?', v: '🔌', b: 'Éteindre la lumière en sortant', f: ['Laisser la télé allumée', 'Laisser le frigo ouvert', 'Chauffer avec la fenêtre ouverte'] },
    { q: 'Comment s\'appelle le mouvement de la Terre autour du Soleil ?', v: '🌍', b: 'La révolution', f: ['La rotation', 'L\'éclipse', 'La marée'] },
    { q: 'Quel objet est attiré par un aimant ?', v: '🧲', b: 'Un clou en fer', f: ['Une règle en bois', 'Une gomme', 'Un verre'] }
  );

  /* ======================= ANGLAIS ======================= */
  ANGLAIS_CM1.push(
    ['tête', 'head'], ['bras', 'arm'], ['jambe', 'leg'], ['main', 'hand'], ['pied', 'foot'], ['œil', 'eye'], ['oreille', 'ear'], ['bouche', 'mouth'], ['nez', 'nose'], ['cheveux', 'hair'],
    ['pantalon', 'trousers'], ['jupe', 'skirt'], ['robe', 'dress'], ['chaussures', 'shoes'], ['chapeau', 'hat'], ['manteau', 'coat'], ['chaussettes', 'socks'],
    ['il pleut', 'it\'s raining'], ['il neige', 'it\'s snowing'], ['il fait froid', 'it\'s cold'], ['il fait chaud', 'it\'s hot'], ['il y a du vent', 'it\'s windy'], ['il fait beau (soleil)', 'it\'s sunny'],
    ['fromage', 'cheese'], ['poisson', 'fish'], ['poulet', 'chicken'], ['banane', 'banana'], ['gâteau', 'cake'], ['œuf', 'egg'],
    ['règle', 'ruler'], ['cartable', 'schoolbag'], ['trousse', 'pencil case'], ['professeur', 'teacher'], ['ciseaux', 'scissors'],
    ['grand-mère', 'grandmother'], ['grand-père', 'grandfather'], ['oncle', 'uncle'], ['tante', 'aunt'],
    ['trente', 'thirty'], ['quarante', 'forty'], ['cinquante', 'fifty'], ['soixante', 'sixty'], ['soixante-dix', 'seventy'], ['quatre-vingts', 'eighty'], ['quatre-vingt-dix', 'ninety'], ['cent', 'one hundred']
  );
  // [question, anglais à lire (ou ''), bonne réponse, fausses]
  const PHRASES_EN = [
    ['Comment dit-on « Quel âge as-tu ? » en anglais ?', '', 'How old are you?', ['What\'s your name?', 'How are you?', 'Where are you from?']],
    ['Comment dit-on « Comment t\'appelles-tu ? » en anglais ?', '', 'What\'s your name?', ['How old are you?', 'Where do you live?', 'What colour is it?']],
    ['Comment dit-on « Comment vas-tu ? » en anglais ?', '', 'How are you?', ['Who are you?', 'How old are you?', 'Where are you?']],
    ['Comment dit-on « J\'ai neuf ans. » en anglais ?', '', 'I am nine.', ['I have nine.', 'I am fine.', 'My name is Nine.']],
    ['Comment dit-on « Je m\'appelle Tom. » en anglais ?', '', 'My name is Tom.', ['I am nine.', 'I like Tom.', 'This is my dog.']],
    ['Comment dit-on « J\'aime le chocolat. » en anglais ?', '', 'I like chocolate.', ['I don\'t like chocolate.', 'I have chocolate.', 'I am chocolate.']],
    ['Comment dit-on « Je n\'aime pas les carottes. » en anglais ?', '', 'I don\'t like carrots.', ['I like carrots.', 'I have got carrots.', 'I eat carrots.']],
    ['Comment dit-on « Il pleut. » en anglais ?', '', 'It\'s raining.', ['It\'s sunny.', 'It\'s cold.', 'It\'s snowing.']],
    ['Comment dit-on « Il fait froid. » en anglais ?', '', 'It\'s cold.', ['It\'s hot.', 'It\'s windy.', 'It\'s sunny.']],
    ['Comment dit-on « Quelle heure est-il ? » en anglais ?', '', 'What time is it?', ['How old are you?', 'What day is it?', 'What colour is it?']],
    ['Comment dit-on « Quel jour sommes-nous ? » en anglais ?', '', 'What day is it today?', ['What time is it?', 'How are you today?', 'Where is it?']],
    ['Comment dit-on « J\'ai un chat. » en anglais ?', '', 'I have got a cat.', ['I am a cat.', 'I like cats.', 'I have got a dog.']],
    ['Que veut dire « How old are you? » ?', 'How old are you?', 'Quel âge as-tu ?', ['Comment vas-tu ?', 'Où habites-tu ?', 'Comment t\'appelles-tu ?']],
    ['Que veut dire « Where do you live? » ?', 'Where do you live?', 'Où habites-tu ?', ['Quel âge as-tu ?', 'Comment vas-tu ?', 'Qu\'est-ce que tu aimes ?']],
    ['Que veut dire « What colour is it? » ?', 'What colour is it?', 'De quelle couleur est-ce ?', ['Qu\'est-ce que c\'est ?', 'Combien ça coûte ?', 'Quelle heure est-il ?']],
    ['Que veut dire « Can I have an apple, please? » ?', 'Can I have an apple, please?', 'Je peux avoir une pomme, s\'il te plaît ?', ['J\'aime les pommes.', 'Où est la pomme ?', 'Je n\'ai pas de pomme.']],
    ['Que veut dire « I\'m fine, thank you. » ?', 'I\'m fine, thank you.', 'Je vais bien, merci.', ['Je m\'appelle Fine.', 'J\'ai faim, merci.', 'Au revoir, merci.']],
    ['Que veut dire « Stand up! » ?', 'Stand up!', 'Lève-toi !', ['Assieds-toi !', 'Écoute !', 'Regarde !']],
    ['Que veut dire « Sit down, please. » ?', 'Sit down, please.', 'Assieds-toi, s\'il te plaît.', ['Lève-toi, s\'il te plaît.', 'Ouvre ton livre, s\'il te plaît.', 'Viens ici, s\'il te plaît.']],
    ['Que veut dire « Open your book. » ?', 'Open your book.', 'Ouvre ton livre.', ['Ferme ton livre.', 'Lis ton livre.', 'Range ton livre.']],
    ['Que veut dire « Happy birthday! » ?', 'Happy birthday!', 'Joyeux anniversaire !', ['Bonne année !', 'Joyeux Noël !', 'Bonne nuit !']],
    ['Que veut dire « Good night! » ?', 'Good night!', 'Bonne nuit !', ['Bonjour !', 'Bon appétit !', 'Bonne chance !']],
    ['Que veut dire « I\'m hungry. » ?', 'I\'m hungry.', 'J\'ai faim.', ['J\'ai soif.', 'J\'ai froid.', 'Je suis fatigué.']],
    ['Que veut dire « Let\'s go! » ?', 'Let\'s go!', 'Allons-y !', ['Arrête !', 'Attends !', 'Au revoir !']],
    ['Quelle est la bonne réponse à « How old are you? » ?', 'How old are you?', 'I am nine.', ['My name is Lucas.', 'I am fine.', 'It is blue.']],
    ['Quelle est la bonne réponse à « What\'s your name? » ?', 'What\'s your name?', 'My name is Emma.', ['I am nine.', 'I am fine, thank you.', 'It is Monday.']],
    ['Quelle est la bonne réponse à « How are you? » ?', 'How are you?', 'I\'m fine, thank you.', ['I am ten.', 'My name is Sam.', 'It is red.']],
    ['Quelle est la bonne réponse à « What colour is the sky? » ?', 'What colour is the sky?', 'It is blue.', ['It is Monday.', 'It is ten.', 'It is a dog.']],
    ['Quelle est la bonne réponse à « What day is it today? » ?', 'What day is it today?', 'It\'s Monday.', ['It\'s sunny.', 'It\'s red.', 'I\'m nine.']],
    ['Quelle est la bonne réponse à « Do you like pizza? » ?', 'Do you like pizza?', 'Yes, I do.', ['Yes, I am.', 'Yes, it is.', 'Yes, I can.']],
    ['Quelle est la bonne réponse à « Have you got a pet? » ?', 'Have you got a pet?', 'Yes, I have got a dog.', ['Yes, I am a dog.', 'Yes, I like pizza.', 'I am nine.']],
    ['Quelle est la bonne réponse à « Where do you live? » ?', 'Where do you live?', 'I live in France.', ['I am nine.', 'I like pizza.', 'It is sunny.']],
    ['Quel jour vient après « Monday » ?', 'Monday', 'Tuesday', ['Sunday', 'Thursday', 'Friday']],
    ['Quel jour vient avant « Saturday » ?', 'Saturday', 'Friday', ['Sunday', 'Thursday', 'Monday']],
    ['Comment dit-on « janvier » en anglais ?', '', 'January', ['June', 'July', 'February']],
    ['Comment dit-on « décembre » en anglais ?', '', 'December', ['November', 'September', 'October']],
    ['Quel mois vient après « March » ?', 'March', 'April', ['May', 'February', 'August']],
    ['En quel mois est « Christmas » (Noël) ?', 'Christmas', 'December', ['January', 'July', 'October']],
    ['Comment dit-on « juillet » en anglais ?', '', 'July', ['June', 'January', 'August']]
  ];
  const tirePhrase = tirage(PHRASES_EN);
  ajouterJeux('CM1', 'anglais', [
    { id: 'phrases-en', titre: 'Little sentences', emoji: '🗨️', gen: () => {
      const [q, en, b, f] = tirePhrase();
      const base = { visuel: '🇬🇧', enonce: q, dire: q };
      if (en) { base.dire = q.replace(/«[^»]*»/, 'ceci'); base.direEn = en; }
      return qcm(base, b, f);
    } }
  ]);

  /* ======================= EMC ======================= */
  const EMC = [
    { q: 'En quelle année la Convention internationale des droits de l\'enfant a-t-elle été adoptée ?', v: '🧒', b: '1989', f: ['1789', '1945', '2010'] },
    { q: 'Quelle organisation a adopté la Convention internationale des droits de l\'enfant ?', v: '🌍', b: 'L\'ONU', f: ['La mairie', 'L\'école', 'Un club de football'] },
    { q: 'Quel jour célèbre-t-on la Journée internationale des droits de l\'enfant ?', b: 'Le 20 novembre', f: ['Le 14 juillet', 'Le 1er janvier', 'Le 25 décembre'] },
    { q: 'Lequel de ces droits est un droit de l\'enfant ?', v: '🏫', b: 'Le droit d\'aller à l\'école', f: ['Le droit de conduire une voiture', 'Le droit de voter', 'Le droit de travailler à l\'usine'] },
    { q: 'Lequel de ces droits est aussi un droit de l\'enfant ?', v: '🪪', b: 'Avoir un nom et une nationalité', f: ['Sortir seul la nuit', 'Ne jamais aller chez le médecin', 'Acheter tout ce qu\'il veut'] },
    { q: 'Selon la Convention, un enfant a le droit…', v: '⚽', b: 'de jouer et d\'avoir des loisirs', f: ['de faire la guerre', 'de travailler dans une mine', 'd\'être frappé'] },
    { q: 'Jusqu\'à quel âge l\'instruction est-elle obligatoire en France ?', b: '16 ans', f: ['10 ans', '12 ans', '25 ans'] },
    { q: 'À partir de quel âge l\'instruction est-elle obligatoire en France ?', b: '3 ans', f: ['6 ans', '8 ans', '10 ans'] },
    { q: 'Quelles sont les couleurs du drapeau français ?', v: '🇫🇷', b: 'Bleu, blanc, rouge', f: ['Vert, blanc, rouge', 'Bleu, jaune, rouge', 'Noir, rouge, jaune'] },
    { q: 'Comment s\'appelle l\'hymne national français ?', v: '🎵', b: 'La Marseillaise', f: ['Frère Jacques', 'Au clair de la lune', 'L\'Hymne à la joie'] },
    { q: 'Qui a composé La Marseillaise en 1792 ?', v: '🎵', b: 'Rouget de Lisle', f: ['Napoléon', 'Victor Hugo', 'Louis XIV'] },
    { q: 'Quel personnage féminin représente la République française ?', b: 'Marianne', f: ['Jeanne d\'Arc', 'Marie-Antoinette', 'Blanche-Neige'] },
    { q: 'Quel mot manque dans la devise « Liberté, Égalité, … » ?', v: '🇫🇷', b: 'Fraternité', f: ['Solidarité', 'Amitié', 'Sécurité'] },
    { q: 'Quel jour est la fête nationale française ?', v: '🎆', b: 'Le 14 juillet', f: ['Le 11 novembre', 'Le 1er mai', 'Le 25 décembre'] },
    { q: 'Quel événement de 1789 rappelle la fête nationale du 14 juillet ?', b: 'La prise de la Bastille', f: ['Le sacre de Napoléon', 'La bataille de Marignan', 'Le baptême de Clovis'] },
    { q: 'Comment le président de la République est-il choisi ?', v: '🗳️', b: 'Il est élu par les citoyens', f: ['Il est le fils du roi', 'Il est tiré au sort', 'Il est choisi par les enfants'] },
    { q: 'Pour combien d\'années le président de la République est-il élu ?', b: '5 ans', f: ['2 ans', '10 ans', 'Toute sa vie'] },
    { q: 'Dans quel palais travaille le président de la République ?', v: '🏛️', b: 'Le palais de l\'Élysée', f: ['Le château de Versailles', 'La mairie de Paris', 'Le château de Chambord'] },
    { q: 'À partir de quel âge peut-on voter en France ?', v: '🗳️', b: '18 ans', f: ['10 ans', '14 ans', '30 ans'] },
    { q: 'Qui élit le maire ?', v: '🏛️', b: 'Le conseil municipal', f: ['Le président de la République', 'Les élèves de l\'école', 'Le directeur de la poste'] },
    { q: 'Pour combien d\'années les conseillers municipaux sont-ils élus ?', b: '6 ans', f: ['1 an', '3 ans', '20 ans'] },
    { q: 'Qui vote les lois en France ?', v: '⚖️', b: 'Les députés et les sénateurs (le Parlement)', f: ['Les maires', 'Les policiers', 'Les enseignants'] },
    { q: 'Dans quoi glisse-t-on son bulletin de vote ?', v: '🗳️', b: 'Dans l\'urne', f: ['Dans la boîte aux lettres', 'Dans un cartable', 'Dans une tirelire'] },
    { q: 'Pour que personne ne sache pour qui on vote, on passe dans…', b: 'l\'isoloir', f: ['la cantine', 'le préau', 'l\'ascenseur'] },
    { q: 'Comment s\'appellent les élèves élus pour représenter leur classe ?', b: 'Les délégués', f: ['Les maires', 'Les députés', 'Les préfets'] },
    { q: 'Les filles et les garçons ont…', v: '⚖️', b: 'les mêmes droits', f: ['des droits différents', 'aucun droit', 'des droits seulement à 18 ans'] },
    { q: 'Qui peut devenir pompier, médecin ou pilote ?', v: '👩‍🚒', b: 'Les femmes et les hommes', f: ['Seulement les hommes', 'Seulement les femmes', 'Seulement les enfants'] },
    { q: 'Un élève est souvent moqué, bousculé et mis à l\'écart par d\'autres. C\'est…', b: 'du harcèlement', f: ['un jeu normal', 'une récompense', 'de la politesse'] },
    { q: 'Tu vois un camarade se faire harceler. Que dois-tu faire ?', v: '🗣️', b: 'En parler à un adulte de confiance', f: ['Ne rien dire', 'Rire avec les autres', 'Filmer et partager la vidéo'] },
    { q: 'Envoyer des messages méchants à quelqu\'un sur Internet, c\'est…', v: '📱', b: 'du cyberharcèlement', f: ['un jeu vidéo', 'un exposé', 'une blague sans importance'] },
    { q: 'À l\'école publique, la laïcité garantit que chacun…', b: 'est libre de croire ou de ne pas croire', f: ['doit avoir la même religion', 'doit prier en classe', 'ne peut pas parler de lui'] },
    { q: 'En quelle année a été votée la loi de séparation des Églises et de l\'État ?', b: '1905', f: ['1789', '1804', '1989'] },
    { q: 'Quel numéro appelles-tu pour joindre les pompiers ?', v: '🚒', b: '18', f: ['15', '17', '119'] },
    { q: 'Quel numéro appelles-tu pour joindre le SAMU (urgence médicale) ?', v: '🚑', b: '15', f: ['17', '18', '119'] },
    { q: 'Quel numéro appelles-tu pour joindre la police ou la gendarmerie ?', v: '🚓', b: '17', f: ['15', '18', '119'] },
    { q: 'Quel numéro d\'urgence fonctionne partout en Europe ?', v: '🇪🇺', b: '112', f: ['15', '17', '18'] },
    { q: 'Quel est le numéro d\'« Allô Enfance en danger », gratuit et ouvert jour et nuit ?', v: '☎️', b: '119', f: ['15', '17', '18'] },
    { q: 'Quand tu appelles les secours, que dois-tu dire ?', v: '📞', b: 'Qui tu es, où tu es et ce qui se passe', f: ['Seulement ton prénom', 'Ta couleur préférée', 'Rien, il faut raccrocher vite'] },
    { q: 'Pour porter secours, il faut : Protéger, Alerter et…', v: '⛑️', b: 'Secourir', f: ['Courir', 'Crier', 'Partir'] },
    { q: 'Quelqu\'un est blessé. Quelle est la première chose à faire ?', b: 'Protéger : éviter un nouveau danger', f: ['Déplacer la victime tout de suite', 'Partir sans rien dire', 'Lui donner à manger'] },
    { q: 'Qui doit respecter le règlement de l\'école ?', v: '🏫', b: 'Tout le monde : élèves et adultes', f: ['Seulement les élèves', 'Seulement le directeur', 'Personne'] },
    { q: 'Pourquoi y a-t-il des règles dans la classe ?', v: '📋', b: 'Pour bien vivre et apprendre ensemble', f: ['Pour punir les élèves', 'Pour faire plaisir au maire', 'Pour rien'] },
    { q: 'Tu n\'es pas d\'accord avec un camarade. Que fais-tu ?', v: '🤝', b: 'J\'en discute calmement', f: ['Je le frappe', 'Je l\'insulte', 'Je casse ses affaires'] },
    { q: 'Pour traverser la rue en sécurité, on passe…', v: '🚸', b: 'sur le passage piéton, quand le feu piéton est vert', f: ['entre les voitures garées', 'quand le feu piéton est rouge', 'en courant derrière un bus'] }
  ];
  ajouterMatiere('CM1', {
    id: 'emc', titre: 'Vivre ensemble', emoji: '🤝', couleur: '#d94f9c', jeux: [
      { id: 'quiz-emc', titre: 'Quiz citoyen', emoji: '🇫🇷', gen: depuisListe(EMC) }
    ]
  });
})();
