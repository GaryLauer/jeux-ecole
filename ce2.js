// Contenu du CE2 (8 ans) : matières, jeux et petits cours.
(() => {
  /* =====================================================================
     OUTILS
     ===================================================================== */
  // 3456 -> "3 456"
  const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const r1 = x => Math.round(x * 10) / 10;
  const gros = t => `<b style="font-size:.8em">${t}</b>`;
  const phrase = t => `<span style="font-weight:normal">${t}</span>`;
  const petit = t => `<span style="font-size:.45em">${t}</span>`;
  // Tire dans une liste sans répéter avant d'avoir tout vu.
  // « de » ou « d' » devant un mot.
  const de = m => (/^[aeiouyéèêœ]/i.test(m) ? 'd\'' : 'de ') + m;
  const tirage = liste => { let r = []; return () => { if (!r.length) r = melange(liste); return r.pop(); }; };
  // Liste de questions { q, v, b, f } tirées sans répétition.
  const quiz = liste => depuisListe(liste);

  // Nombres en lettres (0 à 9 999), orthographe traditionnelle.
  const UNITES = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
  const DIZAINES = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];
  const moins100 = n => {
    if (n <= 16) return UNITES[n];
    if (n < 20) return 'dix-' + UNITES[n - 10];
    const d = Math.floor(n / 10), u = n % 10;
    if (d === 7) return n === 71 ? 'soixante et onze' : 'soixante-' + moins100(n - 60);
    if (d === 8) return u ? 'quatre-vingt-' + UNITES[u] : 'quatre-vingts';
    if (d === 9) return 'quatre-vingt-' + moins100(n - 80);
    if (!u) return DIZAINES[d];
    return DIZAINES[d] + (u === 1 ? ' et un' : '-' + UNITES[u]);
  };
  const moins1000 = n => {
    const c = Math.floor(n / 100), r = n % 100;
    let s = c ? (c > 1 ? UNITES[c] + ' ' : '') + 'cent' + (c > 1 && !r ? 's' : '') : '';
    if (r) s += (s ? ' ' : '') + moins100(r);
    return s;
  };
  const enLettres = n => {
    if (!n) return 'zéro';
    const m = Math.floor(n / 1000), r = n % 1000;
    let s = m ? (m > 1 ? moins1000(m) + ' ' : '') + 'mille' : '';
    if (r) s += (s ? ' ' : '') + moins1000(r);
    return s;
  };

  /* ---------- Dessins ---------- */
  const TRAIT = 'stroke="currentColor" stroke-width="2"';
  const REMPLI = 'fill="rgba(79,142,247,.25)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"';
  const ROUGE = '#e5484d';
  const texte = (x, y, t, anc = 'middle', taille = 8) => `<text x="${x}" y="${y}" font-size="${taille}" fill="currentColor" text-anchor="${anc}" font-family="sans-serif">${t}</text>`;
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
  const pointilles = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ROUGE}" stroke-width="2" stroke-dasharray="5 4"/>`;
  // Polygone régulier à n côtés.
  const regulier = (n, r = 38, rot = -90) => Array.from({ length: n }, (_, i) => {
    const a = (rot + i * 360 / n) * Math.PI / 180;
    return [r1(50 + r * Math.cos(a)), r1(52 + r * Math.sin(a))];
  });
  // Opération posée en colonnes (le ? est la réponse).
  const posee = (a, b, op) => `<div style="display:inline-block;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.6em;text-align:right;line-height:1.25;white-space:pre">`
    + `<div>${sp(a)}</div><div>${op} ${sp(b)}</div><div style="border-top:3px solid currentColor;margin-top:3px">?</div></div>`;
  // Horloge (petite aiguille rouge : heures ; grande aiguille bleue : minutes).
  const horloge = (h, m) => {
    const pt = (deg, l) => { const a = deg * Math.PI / 180; return [(50 + l * Math.sin(a)).toFixed(1), (50 - l * Math.cos(a)).toFixed(1)]; };
    let s = '<circle cx="50" cy="50" r="46" fill="#fff" stroke="#333" stroke-width="3"/>';
    for (let i = 0; i < 60; i++) {
      const [x1, y1] = pt(i * 6, i % 5 ? 43.5 : 41), [x2, y2] = pt(i * 6, 45);
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#333" stroke-width="${i % 5 ? .6 : 1.6}"/>`;
    }
    for (let i = 1; i <= 12; i++) {
      const [x, y] = pt(i * 30, 34);
      s += `<text x="${x}" y="${y}" font-size="10" font-weight="bold" font-family="sans-serif" fill="#222" text-anchor="middle" dominant-baseline="central">${i}</text>`;
    }
    const [hx, hy] = pt(((h % 12) + m / 60) * 30, 21), [mx, my] = pt(m * 6, 36);
    s += `<line x1="50" y1="50" x2="${mx}" y2="${my}" stroke="#1d4ed8" stroke-width="3" stroke-linecap="round"/>`;
    s += `<line x1="50" y1="50" x2="${hx}" y2="${hy}" stroke="#e5484d" stroke-width="5" stroke-linecap="round"/>`;
    s += '<circle cx="50" cy="50" r="3" fill="#333"/>';
    return svg(s, 190);
  };

  /* =====================================================================
     MATHS
     ===================================================================== */

  // ---------- Nombres jusqu'à 10 000
  // Nombre à 4 chiffres, avec parfois des zéros (plus intéressant).
  const nombre4 = () => {
    const c = () => (Math.random() < .3 ? 0 : alea(1, 9));
    return alea(1, 9) * 1000 + c() * 100 + c() * 10 + c();
  };
  const chiffres = n => String(n).split('').map(Number);
  const genNombres = () => {
    const t = alea(0, 4);
    if (t === 0) {
      const n = nombre4(), s = String(n);
      const [nom, pos] = pioche([['unités', 1], ['dizaines', 2], ['centaines', 3], ['unités de mille', 4]]);
      const bon = s[s.length - pos];
      return qcm({ visuel: gros(sp(n)), enonce: `Quel est le chiffre des ${nom} ?`, dire: `Dans ${n}, quel est le chiffre des ${nom} ?` }, bon, [...s.split(''), '0', '1', '5', '9']);
    }
    if (t === 1 || t === 2) {
      const n = nombre4(), [m, c, d, u] = chiffres(n);
      const f = [n + 100, n - 100, n + 10, n + 1000 <= 9999 ? n + 1000 : n - 1000, m * 1000 + d * 100 + c * 10 + u, m * 1000 + c * 100 + u * 10 + d]
        .filter(x => x !== n && x >= 1000 && x <= 9999);
      if (t === 1) {
        const L = enLettres(n);
        return qcm({ visuel: '✍️', enonce: `Écris en chiffres :<br>${phrase(L)}`, dire: `Écris en chiffres : ${n}.` }, sp(n), f.map(sp));
      }
      const L = enLettres(n), piege = m > 1 ? L.replace('mille', 'milles') : L.replace(/ et un\b/, '-un').replace(/cent /, 'cents ');
      return qcm({ visuel: gros(sp(n)), enonce: 'Comment s\'écrit ce nombre en lettres ?', dire: 'Comment s\'écrit ce nombre en lettres ?' }, L, [piege, ...melange(f).slice(0, 2)].map(x => typeof x === 'number' ? enLettres(x) : x).concat(f.map(enLettres)));
    }
    if (t === 3) {
      const n = nombre4(), [m, c, d, u] = chiffres(n);
      const f = [m * 1000 + c * 100 + d + u * 10, m * 100 + c * 10 + d, m * 1000 + d * 100 + c * 10 + u, m * 1000 + c * 100 + u * 10 + d, n + 10, n - 10, n + 100]
        .filter(x => x !== n && x > 0);
      let txt;
      if (Math.random() < .5) txt = [m * 1000, c * 100, d * 10, u].filter(Boolean).map(sp).join(' + ');
      else {
        const parts = [[m, 'millier', 'milliers'], [c, 'centaine', 'centaines'], [d, 'dizaine', 'dizaines'], [u, 'unité', 'unités']].filter(x => x[0]);
        txt = parts.map(([k, s1, s2]) => `${k} ${k > 1 ? s2 : s1}`).join(' + ');
      }
      return qcm({ visuel: '🧱', enonce: `Quel nombre est égal à :<br>${phrase(txt)}`, dire: `Quel nombre est égal à : ${txt.replace(/\+/g, 'plus')} ?` }, sp(n), f.map(sp));
    }
    const k = alea(0, 3);
    if (k === 0) {
      const n = alea(1, 9) * 1000 - (Math.random() < .5 ? 1 : 0) + (Math.random() < .5 ? alea(1, 9) * 100 : 0);
      const r = n + 1;
      return qcm({ visuel: `${sp(n)} ➜ ?`, enonce: `Quel nombre vient juste après ${sp(n)} ?`, dire: `Quel nombre vient juste après ${n} ?` }, sp(r), [r + 1, r - 2, r + 10, r + 100, n + 1000].filter(x => x !== r && x <= 10000).map(sp));
    }
    if (k === 1) {
      const n = alea(2, 9) * 1000 + pioche([0, 0, 100, 500, 10]), r = n - 1;
      return qcm({ visuel: `? ➜ ${sp(n)}`, enonce: `Quel nombre vient juste avant ${sp(n)} ?`, dire: `Quel nombre vient juste avant ${n} ?` }, sp(r), [n + 1, r - 1, n - 10, n - 100, r - 1000 > 0 ? r - 1000 : n + 10].filter(x => x !== r).map(sp));
    }
    const pas = pioche([10, 100, 1000]), plus = k === 2;
    const n = plus ? alea(1000, 8999) : alea(1100, 9999), r = plus ? n + pas : n - pas;
    const f = [10, 100, 1000].filter(p => p !== pas).map(p => plus ? n + p : n - p).concat([plus ? n - pas : n + pas, r + 1]);
    return qcm({ visuel: '🔢', enonce: `Quel nombre a ${sp(pas)} ${plus ? 'de plus' : 'de moins'} que ${sp(n)} ?`, dire: `Quel nombre a ${pas} ${plus ? 'de plus' : 'de moins'} que ${n} ?` }, sp(r), f.filter(x => x >= 0 && x <= 10999).map(sp));
  };

  // ---------- Comparer, ranger, arrondir
  const proches = (combien) => {
    const base = nombre4(), s = new Set([base]);
    let essais = 0;
    while (s.size < combien && essais++ < 100) {
      const [m, c, d, u] = chiffres(base);
      const v = pioche([
        m * 1000 + d * 100 + c * 10 + u, m * 1000 + c * 100 + u * 10 + d, c * 1000 + m * 100 + d * 10 + u,
        base + pioche([-1, 1]) * pioche([10, 100, 1000]), base + alea(-99, 99)
      ]);
      if (v >= 1000 && v <= 9999) s.add(v);
    }
    return [...s];
  };
  const droiteGraduee = () => {
    const pas = pioche([1, 10, 100]), debut = pas === 1 ? alea(10, 99) * 10 * (Math.random() < .5 ? 1 : 10) : pas === 10 ? alea(10, 99) * 100 : alea(1, 8) * 1000;
    const k = alea(1, 9), val = debut + k * pas, x0 = 8, L = 84;
    let s = `<line x1="${x0 - 3}" y1="50" x2="${x0 + L + 3}" y2="50" ${TRAIT}/>`;
    for (let i = 0; i <= 10; i++) {
      const x = r1(x0 + i * L / 10), grand = i === 0 || i === 5 || i === 10;
      s += `<line x1="${x}" y1="${grand ? 43 : 46}" x2="${x}" y2="${grand ? 57 : 54}" stroke="currentColor" stroke-width="${grand ? 1.6 : 1}"/>`;
    }
    s += texte(x0, 68, sp(debut), 'middle', 7) + texte(x0 + L, 68, sp(debut + 10 * pas), 'middle', 7);
    const px = r1(x0 + k * L / 10);
    s += `<circle cx="${px}" cy="50" r="3.2" fill="${ROUGE}"/>${texte(px, 38, 'A', 'middle', 9)}`;
    const f = [val + pas, val - pas, debut + k, debut + k * pas * 10, debut + (10 - k) * pas].filter(x => x !== val && x >= 0);
    return qcm({ visuel: svg(s, 230), enonce: 'Quel nombre correspond au point A ?', dire: 'Quel nombre correspond au point A ?', aide: 'Regarde de combien on avance à chaque petit trait.' }, sp(val), f.map(sp));
  };
  const genComparer = () => {
    const t = alea(0, 5);
    if (t === 0) {
      let a, b;
      if (Math.random() < .1) { a = b = nombre4(); }
      else [a, b] = proches(2);
      if (b === undefined) b = a + 10;
      const bon = a < b ? '<' : a > b ? '>' : '=';
      return { visuel: gros(`${sp(a)} ? ${sp(b)}`), enonce: 'Quel signe faut-il mettre ?', dire: `${a} est-il plus petit, plus grand, ou égal à ${b} ?`, aide: '&lt; : plus petit que · &gt; : plus grand que', choix: ['<', '>', '='], bonne: bon };
    }
    if (t === 1) {
      const v = proches(4), grand = Math.random() < .5, bon = grand ? Math.max(...v) : Math.min(...v);
      return qcm({ visuel: '🐊', enonce: `Quel est le nombre le plus ${grand ? 'grand' : 'petit'} ?`, dire: `Quel est le nombre le plus ${grand ? 'grand' : 'petit'} ?` }, sp(bon), v.filter(x => x !== bon).map(sp));
    }
    if (t === 2) {
      const v = proches(3);
      if (v.length < 3) return droiteGraduee();
      const croissant = Math.random() < .5, signe = croissant ? ' < ' : ' > ';
      const tri = [...v].sort((x, y) => croissant ? x - y : y - x);
      const ecrire = a => a.map(sp).join(signe);
      const perms = [[0, 2, 1], [1, 0, 2], [2, 1, 0], [1, 2, 0], [2, 0, 1]].map(p => ecrire(p.map(i => tri[i])));
      return qcm({ visuel: '📶', enonce: `Range ces nombres du plus ${croissant ? 'petit au plus grand' : 'grand au plus petit'} :<br>${phrase(melange(v).map(sp).join(' ; '))}` }, ecrire(tri), perms);
    }
    if (t === 3) {
      const [nom, p] = pioche([['dizaine', 10], ['centaine', 100], ['millier', 1000]]);
      let n;
      do { n = p === 1000 ? alea(1001, 9499) : alea(1000, 9999); } while (n % p === 0 || Math.floor(n % p / (p / 10)) === 5);
      const bas = Math.floor(n / p) * p, haut = bas + p, bon = n - bas < haut - n ? bas : haut;
      const quoi = nom === 'millier' ? 'au millier le plus proche' : `à la ${nom} la plus proche`;
      return qcm({ visuel: gros(sp(n)), enonce: `Arrondis ${sp(n)} ${quoi}.`, dire: `Arrondis ${n} ${quoi}.` }, sp(bon), [bas === bon ? haut : bas, bon + p, bon - p, Math.round(n / (p / 10)) * (p / 10)].filter(x => x !== bon && x > 0).map(sp));
    }
    if (t === 4) {
      let n; do { n = alea(1000, 9899); } while (n % 100 === 0);
      const bas = Math.floor(n / 100) * 100, ecr = (a, b) => `${sp(a)} et ${sp(b)}`;
      return qcm({ visuel: gros(sp(n)), enonce: `Entre quelles centaines qui se suivent se trouve ${sp(n)} ?`, dire: `Entre quelles centaines qui se suivent se trouve ${n} ?` }, ecr(bas, bas + 100),
        [ecr(bas + 100, bas + 200), ecr(bas - 100, bas), ecr(Math.floor(n / 10) * 10, Math.floor(n / 10) * 10 + 10), ecr(bas + 10, bas + 110)]);
    }
    return droiteGraduee();
  };

  // ---------- Additions et soustractions posées
  // Addition chiffre à chiffre sans retenue (erreur fréquente).
  const sansRetenueAdd = (a, b) => { let r = 0, p = 1; while (a || b) { r += ((a % 10 + b % 10) % 10) * p; a = Math.floor(a / 10); b = Math.floor(b / 10); p *= 10; } return r; };
  // Soustraction « le plus petit chiffre du plus grand » (erreur fréquente).
  const sansEmprunt = (a, b) => { let r = 0, p = 1; while (a || b) { r += Math.abs(a % 10 - b % 10) * p; a = Math.floor(a / 10); b = Math.floor(b / 10); p *= 10; } return r; };
  const genAddSous = () => {
    const t = alea(0, 3);
    if (t <= 1) {
      let a, b;
      do { a = alea(t ? 1000 : 100, t ? 6999 : 899); b = alea(t ? 100 : 25, t ? 2999 : 699); } while (a + b > 9999 || sansRetenueAdd(a, b) === a + b);
      const r = a + b;
      return qcm({ visuel: posee(a, b, '+'), enonce: 'Calcule cette addition.', dire: `${a} plus ${b}, combien ça fait ?`, aide: 'Commence par les unités. N\'oublie pas les retenues !' },
        sp(r), [sansRetenueAdd(a, b), r + 10, r - 10, r + 100, r - 100, r + 1000].filter(x => x !== r && x > 0).map(sp));
    }
    let a, b;
    do { a = alea(t === 2 ? 200 : 1000, t === 2 ? 999 : 9999); b = alea(t === 2 ? 25 : 100, a - 10); } while (sansEmprunt(a, b) === a - b);
    const r = a - b;
    return qcm({ visuel: posee(a, b, '−'), enonce: 'Calcule cette soustraction.', dire: `${a} moins ${b}, combien ça fait ?`, aide: 'Commence par les unités. Si le chiffre du haut est trop petit, fais une retenue.' },
      sp(r), [sansEmprunt(a, b), r + 10, r - 10, r + 100, r - 100].filter(x => x !== r && x >= 0).map(sp));
  };

  // ---------- Tables de multiplication (2 à 10)
  const genTables = () => {
    const a = alea(2, 10), b = alea(2, 10), r = a * b, t = alea(0, 5);
    if (t <= 3) return qcm({ visuel: '✖️', enonce: `${a} × ${b} = ?`, dire: `${a} fois ${b}, combien ça fait ?` }, r, [r + a, r - a, r + b, r - b, (a + 1) * (b + 1), a + b].filter(x => x > 0 && x !== r));
    if (t === 4) return qcm({ visuel: '🧩', enonce: `${a} × ? = ${r}`, dire: `${a} fois combien font ${r} ?`, aide: `Récite la table de ${a}.` }, b, voisins(b, 2, 1));
    const n = alea(3, 9), bon = n * alea(2, 10);
    const f = []; for (let x = bon - 5; x <= bon + 5; x++) if (x > 1 && x % n) f.push(x);
    return qcm({ visuel: '🔎', enonce: `Quel nombre est dans la table de ${n} ?`, dire: `Quel nombre est dans la table de ${n} ?` }, bon, f);
  };

  // ---------- Multiplier (posé, × 10, × 100)
  const genMultiplication = () => {
    const t = alea(0, 3);
    if (t <= 1) {
      const b = alea(2, 9), a = t === 0 ? alea(12, 99) : alea(102, Math.min(999, Math.floor(9999 / b)));
      const r = a * b;
      // Erreur fréquente : oublier les retenues.
      let sr = 0, p = 1, x = a; while (x) { sr += ((x % 10) * b % 10) * p; x = Math.floor(x / 10); p *= 10; }
      return qcm({ visuel: posee(a, b, '×'), enonce: 'Calcule cette multiplication.', dire: `${a} fois ${b}, combien ça fait ?`, aide: 'Multiplie d\'abord les unités, puis les dizaines… et ajoute les retenues.' },
        sp(r), [sr, r + 10, r - 10, r + b, r - b, r + a, a * (b - 1)].filter(y => y !== r && y > 0).map(sp));
    }
    if (t === 2) {
      const a = alea(2, 99), p = pioche([10, 100]), r = a * p;
      return qcm({ visuel: '🔟', enonce: `${a} × ${p} = ?`, dire: `${a} fois ${p}, combien ça fait ?` }, sp(r), [a * (p === 10 ? 100 : 10), a * 1000, a + p, r + 10].filter(y => y !== r).map(sp));
    }
    const [q, b, x] = pioche([
      ['Combien de roues ont 7 voitures ?', 4, 7], ['Combien de pattes ont 9 araignées ?', 8, 9], ['Combien de pattes ont 6 insectes ?', 6, 6],
      ['Combien de jours dans 8 semaines ?', 7, 8], ['Combien de doigts sur 9 mains ?', 5, 9], ['Combien de roues ont 8 tricycles ?', 3, 8],
      ['Combien d\'œufs dans 7 boîtes de 6 ?', 6, 7], ['Combien de pattes ont 9 chiens ?', 4, 9], ['Combien de centimes dans 6 pièces de 20 c ?', 20, 6],
      ['Combien de minutes dans 4 quarts d\'heure ?', 15, 4], ['Combien de cartes dans 5 paquets de 12 ?', 12, 5], ['Combien de roues ont 6 vélos ?', 2, 6]
    ]);
    const r = b * x;
    return qcm({ visuel: '🤔', enonce: q, dire: q }, r, [r + b, r - b, b + x, r + x, r + 10].filter(y => y > 0 && y !== r));
  };

  // ---------- Calcul mental
  const genCalculMental = () => {
    const t = alea(0, 5);
    if (t === 0) {
      const n = Math.random() < .6 ? alea(11, 49) : alea(6, 50) * 10, r = 2 * n;
      return qcm({ visuel: '👯', enonce: `Quel est le double de ${n} ?`, dire: `Quel est le double de ${n} ?` }, sp(r), [r + 10, r - 10, r + 2, n + 2, r * 10].filter(x => x !== r && x > 0).map(sp));
    }
    if (t === 1) {
      const n = Math.random() < .6 ? alea(6, 49) * 2 : alea(3, 50) * 20, r = n / 2;
      return qcm({ visuel: '✂️', enonce: `Quelle est la moitié de ${sp(n)} ?`, dire: `Quelle est la moitié de ${n} ?` }, sp(r), [r + 10, r - 10, r + 1, n * 2, r + 5].filter(x => x !== r && x > 0).map(sp));
    }
    if (t === 2) {
      const n = Math.random() < .5 ? alea(1, 19) * 5 : alea(11, 89), r = 100 - n;
      return qcm({ visuel: '💯', enonce: `${n} + ? = 100`, dire: `Combien faut-il ajouter à ${n} pour faire 100 ?` }, r, [r + 10, r - 10, r + 1, r - 1, 110 - n].filter(x => x !== r && x > 0));
    }
    if (t === 3) {
      const p = pioche([10, 100, 1000]), k = alea(1, 9) * p, plus = Math.random() < .5;
      const a = plus ? alea(1000, 9999 - k) : alea(1000 + k, 9999), r = plus ? a + k : a - k;
      const f = [10, 100, 1000].filter(x => x !== p).map(x => plus ? a + k / p * x : a - k / p * x).filter(x => x > 0 && x < 10000);
      return qcm({ visuel: '🧠', enonce: `${sp(a)} ${plus ? '+' : '−'} ${sp(k)} = ?`, dire: `${a} ${plus ? 'plus' : 'moins'} ${k}, combien ça fait ?` }, sp(r), [...f, plus ? r + p : r - p].map(sp));
    }
    if (t === 4) {
      const k = pioche([9, 11, 19, 21, 99]), plus = Math.random() < .6;
      const a = plus ? alea(25, 900) : alea(k + 20, 900), r = plus ? a + k : a - k;
      const arr = k === 99 ? 100 : Math.round(k / 10) * 10, ecart = arr - k; // 9 → 10 − 1 ; 11 → 10 + 1
      const f = [plus ? a + arr : a - arr, plus ? a + arr + ecart : a - arr - ecart, r + 10, r - 10];
      return qcm({ visuel: '⚡', enonce: `${a} ${plus ? '+' : '−'} ${k} = ?`, dire: `${a} ${plus ? 'plus' : 'moins'} ${k}, combien ça fait ?`, aide: k === 99 ? 'Astuce : 99 = 100 − 1' : `Astuce : ${k} = ${arr} ${ecart > 0 ? '−' : '+'} ${Math.abs(ecart)}` }, r, f.filter(x => x !== r && x >= 0));
    }
    const a = alea(1, 9) * 10 + pioche([0, 5]), b = alea(1, 9) * 10, c = 100 - a;
    if (Math.random() < .5 && c > 0 && c < 100) {
      const r = a + b + c;
      return qcm({ visuel: '🧮', enonce: `${a} + ${b} + ${c} = ?`, dire: `${a} plus ${b} plus ${c}, combien ça fait ?`, aide: 'Astuce : cherche deux nombres qui font 100 ensemble.' }, r, [r + 10, r - 10, r + 100, a + b].filter(x => x !== r));
    }
    const r = a + b;
    return qcm({ visuel: '🧮', enonce: `${a} + ${b} = ?`, dire: `${a} plus ${b}, combien ça fait ?` }, r, [r + 10, r - 10, r + 5, r + 1].filter(x => x !== r && x > 0));
  };

  // ---------- Partager et grouper (sens de la division)
  const PARTAGE = [['billes', '🔵', 'enfants'], ['bonbons', '🍬', 'amis'], ['images', '🖼️', 'élèves'], ['cerises', '🍒', 'assiettes'], ['crayons', '✏️', 'pots'], ['gâteaux', '🧁', 'plateaux']];
  // [objets, emoji, contenant (singulier), contenant (pluriel), féminin, début de phrase]
  const GROUPES = [
    ['élèves', '🧒', 'équipe', 'équipes', 1, (t, n) => `On répartit ${t} élèves en équipes de ${n}.`],
    ['œufs', '🥚', 'boîte', 'boîtes', 1, (t, n) => `On range ${t} œufs dans des boîtes de ${n}.`],
    ['fleurs', '🌸', 'bouquet', 'bouquets', 0, (t, n) => `On fait des bouquets de ${n} fleurs avec ${t} fleurs.`],
    ['photos', '📷', 'page', 'pages', 1, (t, n) => `On colle ${t} photos dans un album, ${n} par page.`],
    ['livres', '📚', 'pile', 'piles', 1, (t, n) => `On fait des piles de ${n} livres avec ${t} livres.`],
    ['billes', '🔵', 'sachet', 'sachets', 0, (t, n) => `On met ${t} billes dans des sachets de ${n}.`]
  ];
  const genDivision = () => {
    const t = alea(0, 4);
    if (t === 0) {
      const [obj, e, qui] = pioche(PARTAGE), n = alea(2, 6), q = alea(2, 9), tot = n * q;
      const txt = `On partage ${tot} ${obj} entre ${n} ${qui}. Combien chacun en reçoit-il ?`;
      return qcm({ visuel: tot <= 30 ? petit(e.repeat(tot)) : e, enonce: txt, dire: txt, aide: 'Partager en parts égales, c\'est diviser.' }, q, [q + 1, q - 1, tot - n, n, q + 2].filter(x => x > 0 && x !== q));
    }
    if (t === 1) {
      const [, e, , pl, , deb] = pioche(GROUPES), n = alea(2, 9), q = alea(2, 9), tot = n * q;
      const txt = `${deb(tot, n)} Combien ${de(pl)} obtient-on ?`;
      return qcm({ visuel: e, enonce: txt, dire: txt, aide: 'Cherche combien de fois il y a ' + n + ' dans ' + tot + '.' }, q, [q + 1, q - 1, tot - n, n, tot + n].filter(x => x > 0 && x !== q));
    }
    const [obj, e, , pl, fem, deb] = pioche(GROUPES), n = alea(3, 9), q = alea(2, 9), r = alea(1, n - 1), tot = n * q + r;
    if (t === 2) {
      const txt = `${deb(tot, n)} Combien ${de(pl)} ${fem ? 'pleines' : 'pleins'} obtient-on ?`;
      return qcm({ visuel: e, enonce: txt, dire: txt }, q, [q + 1, q - 1, r, n].filter(x => x > 0 && x !== q));
    }
    if (t === 3) {
      const txt = `${deb(tot, n)} Combien ${de(obj)} reste-t-il à la fin ?`;
      return qcm({ visuel: e, enonce: txt, dire: txt, aide: 'Le reste est toujours plus petit que la taille d\'un paquet.' }, r, [q, r + 1, n - r, 0].filter(x => x !== r && x >= 0));
    }
    if (Math.random() < .5) {
      const fmt = (x, y) => `${x} fois, reste ${y}`;
      return qcm({ visuel: '🔢', enonce: `Combien de fois ${n} dans ${tot} ?`, dire: `Combien de fois ${n} dans ${tot} ? Et quel est le reste ?`, aide: `Cherche dans la table de ${n}.` },
        fmt(q, r), [fmt(q + 1, r), fmt(q - 1, r + n), fmt(q, r + 1 < n ? r + 1 : r - 1), fmt(r, q)].filter(s => s !== fmt(q, r)));
    }
    const d = alea(2, 9), q2 = alea(2, 10);
    return qcm({ visuel: '➗', enonce: `${d * q2} ÷ ${d} = ?`, dire: `${d * q2} divisé par ${d}, combien ça fait ?`, aide: `${d} × ? = ${d * q2}` }, q2, voisins(q2, 2, 1));
  };

  // ---------- Fractions : demi, tiers, quart
  const NOMS_FRAC = { '1/2': 'un demi', '1/3': 'un tiers', '2/3': 'deux tiers', '1/4': 'un quart', '2/4': 'deux quarts', '3/4': 'trois quarts' };
  const egales = f => (f === '1/2' ? ['2/4'] : f === '2/4' ? ['1/2'] : []);
  const dessinFraction = (d, k) => {
    const coul = '#f5a623', blanc = '#fff', st = 'stroke="#333" stroke-width="2" stroke-linejoin="round"';
    const pris = new Set(melange([...Array(d).keys()]).slice(0, k));
    const forme = d === 4 && Math.random() < .35 ? 'carre' : pioche(['disque', 'barre']);
    let s = '';
    if (forme === 'disque') {
      const rot = pioche([-90, 0, -45, 30]);
      for (let i = 0; i < d; i++) {
        const a0 = (rot + i * 360 / d) * Math.PI / 180, a1 = (rot + (i + 1) * 360 / d) * Math.PI / 180;
        s += `<path d="M50 50 L${r1(50 + 40 * Math.cos(a0))} ${r1(50 + 40 * Math.sin(a0))} A40 40 0 0 1 ${r1(50 + 40 * Math.cos(a1))} ${r1(50 + 40 * Math.sin(a1))} Z" fill="${pris.has(i) ? coul : blanc}" ${st}/>`;
      }
    } else if (forme === 'barre') {
      const w = 84 / d;
      for (let i = 0; i < d; i++) s += `<rect x="${r1(8 + i * w)}" y="32" width="${r1(w)}" height="36" fill="${pris.has(i) ? coul : blanc}" ${st}/>`;
    } else {
      [[14, 14], [50, 14], [14, 50], [50, 50]].forEach(([x, y], i) => { s += `<rect x="${x}" y="${y}" width="36" height="36" fill="${pris.has(i) ? coul : blanc}" ${st}/>`; });
    }
    return svg(s, 170);
  };
  const genFractions = () => {
    const t = alea(0, 5);
    if (t <= 1) {
      const d = pioche([2, 3, 4]), k = alea(1, d - 1), f = `${k}/${d}`, tous = Object.keys(NOMS_FRAC).filter(x => x !== f && !egales(f).includes(x));
      if (t === 0) return qcm({ visuel: dessinFraction(d, k), enonce: 'Quelle part est coloriée en orange ?', dire: 'Quelle part de la figure est coloriée en orange ?', aide: 'Compte en combien de parts égales la figure est partagée.' }, NOMS_FRAC[f], tous.map(x => NOMS_FRAC[x]));
      return qcm({ visuel: dessinFraction(d, k), enonce: 'Quelle fraction est coloriée en orange ?', dire: 'Quelle fraction de la figure est coloriée en orange ?' }, f, [...tous, `${d}/${k}`, `${k}/${d + 1}`].filter(x => !egales(f).includes(x)));
    }
    if (t === 2) {
      const f = pioche(Object.keys(NOMS_FRAC)), [k, d] = f.split('/');
      return qcm({ visuel: '✍️', enonce: `Comment écrit-on « ${NOMS_FRAC[f]} » en chiffres ?`, dire: `Comment écrit-on ${NOMS_FRAC[f]} en chiffres ?` }, f, [`${d}/${k}`, `${k}/${k}`, `1/${d}`, `${k}/${+d + 1}`, `${d}/${d}`].filter(x => x !== f && !egales(f).includes(x)));
    }
    if (t === 3) {
      const [d, nom] = pioche([[2, 'La moitié'], [3, 'Le tiers'], [4, 'Le quart']]), q = alea(2, d === 2 ? 25 : 10), n = d * q;
      const f = [q + 1, q - 1, n - d, n * 2, n % 2 === 0 && d !== 2 ? n / 2 : q + 2, n % 3 === 0 && d !== 3 ? n / 3 : q + 3].filter(x => x > 0 && x !== q);
      return qcm({ visuel: '🍬', enonce: `${nom} de ${n}, c'est combien ?`, dire: `${nom} de ${n}, c'est combien ?`, aide: `Partage ${n} en ${d} parts égales.` }, q, f);
    }
    if (t === 4) {
      const d = pioche([2, 3, 4]), nom = { 2: 'demis', 3: 'tiers', 4: 'quarts' }[d];
      return qcm({ visuel: '🍕', enonce: `Combien de ${nom} faut-il pour faire une pizza entière ?`, dire: `Combien de ${nom} faut-il pour faire une pizza entière ?` }, d, [1, 2, 3, 4, 6, 8].filter(x => x !== d));
    }
    const grand = Math.random() < .5;
    const [a, b] = melange(['un demi', 'un tiers', 'un quart']).slice(0, 2), ordre = ['un demi', 'un tiers', 'un quart'];
    const bon = grand ? (ordre.indexOf(a) < ordre.indexOf(b) ? a : b) : (ordre.indexOf(a) > ordre.indexOf(b) ? a : b);
    return { visuel: '🍰', enonce: `Qu'est-ce qui est le plus ${grand ? 'grand' : 'petit'} : ${a} ou ${b} du même gâteau ?`, dire: `Qu'est-ce qui est le plus ${grand ? 'grand' : 'petit'} : ${a} ou ${b} du même gâteau ?`, choix: [a, b], bonne: bon };
  };

  // ---------- Mesures : longueurs, masses, contenances
  const UNITE_OBJETS = [
    ['Une fourmi mesure environ 5 …', 'mm', 'L'], ['Un crayon mesure environ 15 …', 'cm', 'L'], ['Une porte mesure environ 2 …', 'm', 'L'],
    ['Un marathon est une course d\'environ 42 …', 'km', 'L'], ['Une coccinelle mesure environ 7 …', 'mm', 'L'], ['Un autobus mesure environ 12 …', 'm', 'L'],
    ['Une girafe mesure environ 5 …', 'm', 'L'], ['Une pièce de 1 € est épaisse d\'environ 2 …', 'mm', 'L'], ['Un cahier mesure environ 30 …', 'cm', 'L'],
    ['Le trajet de Paris à Lyon fait environ 460 …', 'km', 'L'], ['Une gomme mesure environ 5 …', 'cm', 'L'], ['Une piscine mesure 25 …', 'm', 'L'],
    ['Une pomme pèse environ 150 …', 'g', 'M'], ['Un chat pèse environ 4 …', 'kg', 'M'], ['Une feuille de papier pèse environ 5 …', 'g', 'M'],
    ['Un enfant de 8 ans pèse environ 25 …', 'kg', 'M'], ['Une tablette de chocolat pèse 100 …', 'g', 'M'], ['Un sac de pommes de terre pèse 5 …', 'kg', 'M'],
    ['Un bébé qui vient de naître pèse environ 3 …', 'kg', 'M'], ['Un paquet de beurre pèse 250 …', 'g', 'M'],
    ['Un verre d\'eau contient environ 20 …', 'cL', 'C'], ['Une baignoire contient environ 150 …', 'L', 'C'], ['Un seau contient environ 10 …', 'L', 'C'],
    ['Une canette de jus contient 33 …', 'cL', 'C'], ['Une grande bouteille de lait contient 1 …', 'L', 'C'], ['Une tasse contient environ 25 …', 'cL', 'C']
  ];
  const UNITES_TYPE = { L: ['mm', 'cm', 'm', 'km'], M: ['g', 'kg'], C: ['cL', 'L'] };
  const tireUnite = tirage(UNITE_OBJETS);
  const longueur = cm => { const m = Math.floor(cm / 100), c = cm % 100; return pioche(m && c ? [`${m} m ${c} cm`, `${cm} cm`] : m ? [`${m} m`, `${cm} cm`] : [`${cm} cm`]); };
  const masse = g => { const k = Math.floor(g / 1000), r = g % 1000; return pioche(k && r ? [`${k} kg ${r} g`, `${sp(g)} g`] : k ? [`${k} kg`, `${sp(g)} g`] : [`${g} g`]); };
  const genMesures = () => {
    const t = alea(0, 4);
    if (t <= 1) {
      const [q, u, type] = tireUnite();
      return qcm({ visuel: { L: '📏', M: '⚖️', C: '🥛' }[type], enonce: `Quelle est la bonne unité ?<br>${phrase(q)}`, dire: `Quelle est la bonne unité ? ${q.replace('…', 'combien')}` }, u, UNITES_TYPE[type]);
    }
    if (t === 2 || t === 3) {
      const c = pioche([['m', 'cm', 100], ['km', 'm', 1000], ['cm', 'mm', 10], ['kg', 'g', 1000], ['L', 'cL', 100]]);
      if (t === 3 && (c[0] === 'm' || c[0] === 'kg')) {
        const n = alea(1, 5), k = c[0] === 'm' ? alea(1, 99) : alea(1, 9) * 100 + pioche([0, 0, 50]), r = n * c[2] + k;
        const f = [n * 1000 + k, Number(`${n}${k}`), n * c[2] * 10 + k, r + c[2], n + k].filter(x => x !== r);
        return qcm({ visuel: c[0] === 'm' ? '📏' : '⚖️', enonce: `${n} ${c[0]} ${k} ${c[1]} = ? ${c[1]}`, dire: `${n} ${c[0] === 'm' ? (n > 1 ? 'mètres' : 'mètre') : (n > 1 ? 'kilos' : 'kilo')} et ${k} ${c[1] === 'cm' ? 'centimètres' : 'grammes'}, ça fait combien de ${c[1] === 'cm' ? 'centimètres' : 'grammes'} ?` },
          `${sp(r)} ${c[1]}`, f.map(x => `${sp(x)} ${c[1]}`));
      }
      const n = alea(1, 9), r = n * c[2], inverse = t === 3;
      const noms = { m: 'mètres', cm: 'centimètres', mm: 'millimètres', km: 'kilomètres', kg: 'kilos', g: 'grammes', L: 'litres', cL: 'centilitres' };
      if (inverse) return qcm({ visuel: '🔄', enonce: `${sp(r)} ${c[1]} = ? ${c[0]}`, dire: `${r} ${noms[c[1]]}, ça fait combien de ${noms[c[0]]} ?` }, `${n} ${c[0]}`, [n * 10, n * 100, r, n + 1, n * 1000].filter(x => x !== n).map(x => `${sp(x)} ${c[0]}`));
      return qcm({ visuel: '🔄', enonce: `${n} ${c[0]} = ? ${c[1]}`, dire: `${n} ${n > 1 ? noms[c[0]] : noms[c[0]].replace(/s$/, '')}, ça fait combien de ${noms[c[1]]} ?` }, `${sp(r)} ${c[1]}`, [n * 10, n * 100, n * 1000, r * 10, r + c[2]].filter(x => x !== r).map(x => `${sp(x)} ${c[1]}`));
    }
    const lg = Math.random() < .5, vals = new Set();
    while (vals.size < 3) vals.add(lg ? alea(10, 40) * 10 + pioche([0, 0, 5]) : alea(10, 40) * 100);
    const v = [...vals], grand = Math.random() < .5, bon = grand ? Math.max(...v) : Math.min(...v);
    const ecr = x => (lg ? longueur(x) : masse(x)), txt = v.map(x => [x, ecr(x)]);
    return qcm({ visuel: lg ? '📏' : '⚖️', enonce: `Quelle ${lg ? 'longueur' : 'masse'} est la plus ${grand ? 'grande' : 'petite'} ?`, dire: `Quelle ${lg ? 'longueur' : 'masse'} est la plus ${grand ? 'grande' : 'petite'} ?`, aide: 'Convertis tout dans la même unité.' },
      txt.find(x => x[0] === bon)[1], txt.filter(x => x[0] !== bon).map(x => x[1]), 3);
  };

  // ---------- Heures et durées
  const hm = (h, m) => `${h} h ${String(m).padStart(2, '0')}`;
  const deMinutes = t => hm(Math.floor(t / 60) % 24, t % 60);
  const duree = mn => { const h = Math.floor(mn / 60), m = mn % 60; return h ? (m ? `${h} h ${m} min` : `${h} h`) : `${m} min`; };
  const LIST_TEMPS = [
    ['1 heure = ? minutes', '60', ['100', '30', '24']], ['Une demi-heure = ? minutes', '30', ['50', '15', '60']],
    ['Un quart d\'heure = ? minutes', '15', ['25', '4', '45']], ['Trois quarts d\'heure = ? minutes', '45', ['75', '34', '30']],
    ['1 minute = ? secondes', '60', ['100', '10', '30']], ['1 jour = ? heures', '24', ['12', '60', '7']],
    ['1 semaine = ? jours', '7', ['5', '10', '30']], ['1 an = ? mois', '12', ['10', '52', '365']],
    ['Combien de jours y a-t-il dans une année (pas bissextile) ?', '365', ['100', '52', '12']], ['Combien de semaines y a-t-il environ dans une année ?', '52', ['12', '100', '365']]
  ];
  const tireTemps = tirage(LIST_TEMPS);
  const genHeure = () => {
    const t = alea(0, 5);
    if (t <= 1) {
      const h = alea(6, 11), m = alea(0, 11) * 5;
      const f = [hm(m / 5 || 12, (h * 5) % 60), hm(h + 1, m), hm(h === 1 ? 12 : h - 1, m), hm(h, (m + 30) % 60), hm(h, (m + 5) % 60), hm(h, (60 + m - 5) % 60)];
      return qcm({ visuel: horloge(h, m), enonce: 'C\'est le matin. Quelle heure est-il ?', dire: 'C\'est le matin. Quelle heure indique l\'horloge ?', aide: 'Petite aiguille rouge : les heures. Grande aiguille bleue : les minutes.' }, hm(h, m), f);
    }
    if (t === 2) {
      const h = alea(1, 11), m = alea(0, 11) * 5, moment = h < 6 ? 'de l\'après-midi' : 'du soir';
      return qcm({ visuel: '🕰️', enonce: `Il est ${hm(h, m)} ${moment}. Comment l'écrit-on autrement ?`, dire: `Il est ${h} heure${h > 1 ? 's' : ''} ${m || ''} ${moment}. Comment l'écrit-on autrement ?` }, hm(h + 12, m), [hm(h + 10, m), hm(h + 11, m), hm(h + 13, m), hm(h + 2, m)]);
    }
    if (t === 3) {
      const [quoi, v, pron, dmin, dmax] = pioche([['Le dessin animé commence', '📺', 'il', 2, 8], ['La récréation commence', '⚽', 'elle', 3, 6], ['Le match commence', '🏀', 'il', 6, 18], ['La leçon de piano commence', '🎹', 'elle', 4, 12], ['Le spectacle commence', '🎭', 'il', 9, 24], ['La promenade commence', '🥾', 'elle', 6, 24]]);
      const debut = alea(8 * 12, 17 * 12) * 5, d = alea(dmin, dmax) * 5, fin = debut + d;
      return qcm({ visuel: v, enonce: `${quoi} à ${deMinutes(debut)} et finit à ${deMinutes(fin)}. Combien de temps dure-t-${pron} ?`, aide: 'Avance jusqu\'à l\'heure pile, puis ajoute le reste.' }, duree(d), [d + 10, d - 10, d + 60, d - 5, d + 5, d + 100].filter(x => x > 0 && x !== d).map(duree));
    }
    if (t === 4) {
      const debut = alea(7 * 12, 18 * 12) * 5, d = pioche([10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 90]), fin = debut + d;
      return qcm({ visuel: '⏰', enonce: `Il est ${deMinutes(debut)}. Quelle heure sera-t-il dans ${duree(d)} ?` }, deMinutes(fin), [fin + 10, fin - 10, fin + 60, fin - 60, fin + 5].filter(x => x > debut).map(deMinutes));
    }
    if (Math.random() < .5) {
      const [q, b, f] = tireTemps();
      return qcm({ visuel: '⏳', enonce: q, dire: q.replace('= ?', 'égale combien de') }, b, f);
    }
    const h = alea(1, 3), m = pioche([0, 10, 15, 20, 30, 45]), r = h * 60 + m;
    const txt = m ? `${h} h ${m} min` : `${h} h`;
    return qcm({ visuel: '⏱️', enonce: `${txt} = ? min`, dire: `${txt.replace('h', h > 1 ? 'heures' : 'heure').replace('min', 'minutes')}, ça fait combien de minutes ?`, aide: '1 h = 60 min' }, `${r} min`, [h * 100 + m, r + 10, r - 10, r + 60, h * 10 + m].filter(x => x !== r && x > 0).map(x => `${x} min`));
  };

  // ---------- La monnaie (valeurs en centimes)
  const euros = c => { const e = Math.floor(c / 100), r = c % 100; return e && r ? `${e} € ${r} c` : e ? `${e} €` : `${r} c`; };
  const dessinArgent = (v, cx, cy) => {
    const t = (txt, taille = 6) => `<text x="${cx}" y="${cy}" font-size="${taille}" font-weight="bold" font-family="sans-serif" fill="#222" text-anchor="middle" dominant-baseline="central">${txt}</text>`;
    if (v === 100) return `<circle cx="${cx}" cy="${cy}" r="11" fill="#e0b64a" stroke="#8a6d1f"/><circle cx="${cx}" cy="${cy}" r="7.5" fill="#d4d4d4"/>` + t('1 €', 5.5);
    if (v === 200) return `<circle cx="${cx}" cy="${cy}" r="12.5" fill="#d4d4d4" stroke="#777"/><circle cx="${cx}" cy="${cy}" r="8.5" fill="#e0b64a"/>` + t('2 €', 5.5);
    if (v < 100) {
      const cuivre = v < 10, r = { 1: 7, 2: 8, 5: 9, 10: 8.5, 20: 9.5, 50: 10.5 }[v];
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${cuivre ? '#c7803e' : '#e0b64a'}" stroke="${cuivre ? '#7a4a1f' : '#8a6d1f'}"/>` + t(`${v} c`, v < 10 ? 5 : 5.5);
    }
    const coul = { 500: '#b9c2bd', 1000: '#e8907f', 2000: '#8fb4e3', 5000: '#f2b36b' }[v];
    return `<rect x="${cx - 14}" y="${cy - 9}" width="28" height="18" rx="2" fill="${coul}" stroke="#555"/>` + t(`${v / 100} €`, 7);
  };
  const dessinBourse = items => {
    const pos = [[17, 30], [50, 30], [83, 30], [17, 70], [50, 70], [83, 70]];
    return svg([...items].sort((a, b) => b - a).map((v, i) => dessinArgent(v, ...pos[i])).join(''), 230);
  };
  const EQUIV = [
    ['1 € = ? c', '100', ['10', '50', '1 000']], ['Combien de pièces de 50 c faut-il pour faire 1 € ?', '2', ['5', '50', '10']],
    ['Combien de pièces de 20 c faut-il pour faire 1 € ?', '5', ['2', '20', '4']], ['Combien de pièces de 10 c faut-il pour faire 1 € ?', '10', ['5', '100', '20']],
    ['Combien de pièces de 2 € faut-il pour faire 10 € ?', '5', ['2', '8', '20']], ['Combien de billets de 5 € faut-il pour faire 20 € ?', '4', ['5', '15', '2']],
    ['Combien de billets de 10 € faut-il pour faire 50 € ?', '5', ['10', '40', '4']], ['Combien de pièces de 5 c faut-il pour faire 20 c ?', '4', ['5', '15', '3']],
    ['2 € = ? c', '200', ['20', '2 000', '102']], ['Combien de billets de 20 € faut-il pour faire 100 € ?', '5', ['4', '10', '80']]
  ];
  const tireEquiv = tirage(EQUIV);
  const genMonnaie = () => {
    const t = alea(0, 4);
    if (t <= 1) {
      let items, total;
      do { items = Array.from({ length: alea(3, 6) }, () => pioche([100, 200, 500, 1000, 2000, 5000])); total = items.reduce((a, b) => a + b, 0); } while (total > 10000);
      const e = total / 100;
      return qcm({ visuel: dessinBourse(items), enonce: 'Combien d\'argent y a-t-il en tout ?', dire: 'Combien d\'euros y a-t-il en tout ?', aide: 'Commence par les billets, puis ajoute les pièces.' }, `${e} €`, [e + 1, e - 1, e + 10, e - 10, e + 5, items.length].filter(x => x > 0 && x !== e).map(x => `${x} €`));
    }
    if (t === 2) {
      let items, total;
      do {
        items = [...Array.from({ length: alea(1, 2) }, () => pioche([100, 200, 500])), ...Array.from({ length: alea(2, 4) }, () => pioche([1, 2, 5, 10, 20, 50]))];
        total = items.reduce((a, b) => a + b, 0);
      } while (total % 100 === 0);
      return qcm({ visuel: dessinBourse(items), enonce: 'Combien d\'argent y a-t-il en tout ?', dire: 'Combien d\'argent y a-t-il en tout ?', aide: '100 centimes = 1 euro' }, euros(total), [total + 10, total - 10, total + 100, total - 100, total + 5, total + 1].filter(x => x > 0 && x !== total).map(euros));
    }
    if (t === 3) {
      const [q, b, f] = tireEquiv();
      return qcm({ visuel: '🪙', enonce: q, dire: q.replace('= ?', 'égale combien de').replace(/ c\b/g, ' centimes') }, b, f);
    }
    const cas = alea(0, 2);
    const [paye, prix] = cas === 0 ? [2000, alea(3, 19) * 100] : cas === 1 ? [5000, alea(21, 49) * 100] : [pioche([500, 1000]), 0];
    const p = prix || alea(2, paye / 100 - 1) * 100 - pioche([50, 20, 30, 80]);
    const r = paye - p;
    const obj = pioche([['un livre', '📕'], ['un ballon', '⚽'], ['une peluche', '🧸'], ['une boîte de feutres', '🖍️'], ['un jeu de cartes', '🃏'], ['un puzzle', '🧩']]);
    const txt = `Tu achètes ${obj[0]} à ${euros(p)}. Tu paies avec un billet de ${paye / 100} €. Combien te rend-on ?`;
    return qcm({ visuel: obj[1], enonce: txt, dire: txt.replace(/ c\b/g, ' centimes') }, euros(r), [r + 100, r - 100, r + 10, r - 10, r + 50, p].filter(x => x > 0 && x !== r).map(euros));
  };

  // ---------- Géométrie : angles, figures, polygones, cercle, symétrie, solides
  const FIG = {
    carre: [[25, 25], [75, 25], [75, 75], [25, 75]],
    rectangle: [[12, 30], [88, 30], [88, 70], [12, 70]],
    losange: [[50, 8], [78, 50], [50, 92], [22, 50]],
    triRect: [[20, 82], [86, 82], [20, 28]],
    triangle: [[14, 80], [88, 72], [38, 20]],
    isocele: [[50, 12], [78, 85], [22, 85]],
    parallelo: [[28, 30], [90, 30], [72, 70], [10, 70]]
  };
  const tourne = (s, a) => `<g transform="rotate(${a} 50 50)">${s}</g>`;
  const FIGURES = {
    'un carré': () => tourne(polygone(FIG.carre, [1, 1, 1, 1], [0, 1, 2, 3]), pioche([0, 0, 20, 45, -30])),
    'un rectangle': () => tourne(polygone(FIG.rectangle, [], [0, 1, 2, 3]), pioche([0, 0, 90, 20, -25])),
    'un losange': () => tourne(polygone(FIG.losange, [1, 1, 1, 1]), pioche([0, 0, 90, 15])),
    'un triangle rectangle': () => tourne(polygone(FIG.triRect, [], [0]), pioche([0, 90, 180, 270, 30])),
    'un triangle': () => tourne(polygone(FIG.triangle), pioche([0, 40, 180, 250])),
    'un cercle': () => `<circle cx="50" cy="50" r="38" ${REMPLI}/><circle cx="50" cy="50" r="2" fill="currentColor"/>`,
    'un pentagone': () => polygone(regulier(5, 40, pioche([-90, 90, -54]))),
    'un hexagone': () => polygone(regulier(6, 40, pioche([0, 30, -90])))
  };
  const NOMS_POLY = { 3: 'un triangle', 4: 'un quadrilatère', 5: 'un pentagone', 6: 'un hexagone', 8: 'un octogone' };
  const AXES = [
    [() => polygone(FIG.rectangle, [], [0, 1, 2, 3]) + pointilles(50, 20, 50, 80), 'oui'],
    [() => polygone(FIG.rectangle, [], [0, 1, 2, 3]) + pointilles(4, 50, 96, 50), 'oui'],
    [() => polygone(FIG.rectangle, [], [0, 1, 2, 3]) + pointilles(12, 30, 88, 70), 'non'],
    [() => polygone(FIG.carre, [1, 1, 1, 1], [0, 1, 2, 3]) + pointilles(15, 15, 85, 85), 'oui'],
    [() => polygone(FIG.carre, [1, 1, 1, 1], [0, 1, 2, 3]) + pointilles(50, 15, 50, 85), 'oui'],
    [() => polygone(FIG.carre, [1, 1, 1, 1], [0, 1, 2, 3]) + pointilles(35, 15, 35, 85), 'non'],
    [() => polygone(FIG.losange, [1, 1, 1, 1]) + pointilles(50, 2, 50, 98), 'oui'],
    [() => polygone(FIG.losange, [1, 1, 1, 1]) + pointilles(14, 50, 86, 50), 'oui'],
    [() => polygone(FIG.isocele, [1, 0, 1]) + pointilles(50, 4, 50, 94), 'oui'],
    [() => polygone(FIG.triRect, [], [0]) + pointilles(20, 82, 70, 40), 'non'],
    [() => polygone(FIG.parallelo) + pointilles(50, 22, 50, 78), 'non'],
    [() => polygone(FIG.parallelo) + pointilles(4, 50, 96, 50), 'non'],
    [() => `<circle cx="50" cy="50" r="36" ${REMPLI}/>` + pointilles(50, 8, 50, 92), 'oui'],
    [() => `<path d="M50 85 C20 62 10 45 20 30 C28 18 45 20 50 34 C55 20 72 18 80 30 C90 45 80 62 50 85 Z" ${REMPLI}/>` + pointilles(50, 12, 50 , 94), 'oui'],
    [() => `<path d="M50 85 C20 62 10 45 20 30 C28 18 45 20 50 34 C55 20 72 18 80 30 C90 45 80 62 50 85 Z" ${REMPLI}/>` + pointilles(8, 45, 92, 45), 'non'],
    [() => polygone(regulier(6, 40, 0)) + pointilles(6, 52, 94, 52), 'oui'],
    [() => polygone([[20, 20], [80, 20], [80, 40], [45, 40], [45, 80], [20, 80]]) + pointilles(50, 10, 50, 90), 'non']
  ];
  const tireAxe = tirage(AXES);
  const genGeometrie = () => {
    const t = alea(0, 5);
    if (t === 0) {
      const type = pioche(['droit', 'petit', 'grand']);
      const a = type === 'droit' ? 90 : type === 'petit' ? alea(25, 65) : alea(115, 155), rot = alea(0, 359);
      const pt = ang => { const r = (ang + rot) * Math.PI / 180; return [r1(50 + 40 * Math.cos(r)), r1(50 + 40 * Math.sin(r))]; };
      const [x1, y1] = pt(0), [x2, y2] = pt(-a);
      const d = `<line x1="50" y1="50" x2="${x1}" y2="${y1}" ${TRAIT} stroke-width="3"/><line x1="50" y1="50" x2="${x2}" y2="${y2}" ${TRAIT} stroke-width="3"/><circle cx="50" cy="50" r="2.5" fill="currentColor"/>`;
      const noms = { droit: 'un angle droit', petit: 'plus petit qu\'un angle droit', grand: 'plus grand qu\'un angle droit' };
      return { visuel: svg(d), enonce: 'Cet angle est…', dire: 'Regarde bien cet angle. Est-il droit, plus petit, ou plus grand qu\'un angle droit ?', aide: 'Compare-le au coin d\'une feuille, ou utilise ton équerre.', choix: Object.values(noms), bonne: noms[type] };
    }
    if (t === 1) {
      const nom = pioche(Object.keys(FIGURES));
      const exclus = nom === 'un carré' ? ['un rectangle', 'un losange'] : nom === 'un triangle rectangle' ? ['un triangle'] : [];
      return qcm({ visuel: svg(FIGURES[nom]()), enonce: 'Comment s\'appelle cette figure ?', dire: 'Comment s\'appelle cette figure ?', aide: 'Les petits traits rouges montrent des côtés de même longueur. Le petit coin rouge montre un angle droit.' },
        nom, Object.keys(FIGURES).filter(n => n !== nom && !exclus.includes(n)));
    }
    if (t === 2) {
      const n = pioche([3, 4, 5, 6, 7, 8]);
      if (Math.random() < .3 && NOMS_POLY[n]) return qcm({ visuel: '🔷', enonce: `Comment appelle-t-on un polygone qui a ${n} côtés ?`, dire: `Comment appelle-t-on un polygone qui a ${n} côtés ?` }, NOMS_POLY[n], Object.values(NOMS_POLY));
      const quoi = pioche(['côtés', 'sommets']);
      const pts = n === 4 ? pioche([FIG.parallelo, FIG.rectangle, [[20, 25], [85, 35], [70, 80], [15, 70]]]) : regulier(n, 40, pioche([-90, -60, 0]));
      return qcm({ visuel: svg(polygone(pts)), enonce: `Combien de ${quoi} a ce polygone ?`, dire: `Combien de ${quoi} a ce polygone ?`, aide: quoi === 'côtés' ? 'Un côté est un trait droit du bord.' : 'Un sommet est un « coin » du polygone.' }, n, [n - 1, n + 1, n + 2, n - 2].filter(x => x >= 3));
    }
    if (t === 3) {
      if (Math.random() < .5) {
        const r = alea(2, 9), pt = pioche(['A', 'M', 'B', 'P']);
        return qcm({ visuel: '⭕', enonce: `Un cercle a un rayon de ${r} cm. Le point ${pt} est sur le cercle. Quelle est la distance entre le centre et ${pt} ?`, aide: 'Le rayon va du centre jusqu\'au cercle.' }, `${r} cm`, [`${2 * r} cm`, `${r + 1} cm`, `${r + 2} cm`, `${Math.max(1, r - 1)} cm`].filter(x => x !== `${r} cm`));
      }
      const noms = melange(['A', 'B', 'C', 'D']), a = alea(0, 359) * Math.PI / 180, cible = pioche(['centre', 'sur']);
      const pos = [[50, 50], [r1(50 + 38 * Math.cos(a)), r1(50 + 38 * Math.sin(a))], [r1(50 + 18 * Math.cos(a + 2)), r1(50 + 18 * Math.sin(a + 2))], [r1(50 + 46 * Math.cos(a + 4)), r1(50 + 46 * Math.sin(a + 4))]];
      let d = `<circle cx="50" cy="50" r="38" fill="none" ${TRAIT}/>`;
      pos.forEach(([x, y], i) => { d += `<circle cx="${x}" cy="${y}" r="2.2" fill="${ROUGE}"/>` + texte(r1(x > 60 ? x - 9 : x + 4), r1(y < 15 ? y + 10 : y - 3), noms[i], 'start', 8); });
      return { visuel: svg(d, 190), enonce: cible === 'centre' ? 'Quel point est le centre du cercle ?' : 'Quel point est exactement sur le cercle ?', choix: ['A', 'B', 'C', 'D'], bonne: noms[cible === 'centre' ? 0 : 1] };
    }
    if (t === 4) {
      if (Math.random() < .25) {
        const [nom, n, f] = pioche([['un carré', '4', ['2', '1', '0']], ['un rectangle', '2', ['4', '1', '0']], ['un losange', '2', ['4', '1', '0']], ['un triangle équilatéral', '3', ['1', '2', '0']]]);
        return qcm({ visuel: '🪞', enonce: `Combien d'axes de symétrie a ${nom} ?` }, n, f);
      }
      const [des, bon] = tireAxe();
      return { visuel: svg(des()), enonce: 'La ligne en pointillés est-elle un axe de symétrie ?', dire: 'La ligne rouge en pointillés est-elle un axe de symétrie de la figure ?', aide: 'Si on plie la figure sur cette ligne, les deux moitiés se superposent-elles ?', choix: ['oui', 'non'], bonne: bon };
    }
    return genSolides();
  };

  // Solides dessinés en perspective (arêtes cachées en pointillés).
  const CACHE = 'stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3" fill="none"';
  const FACE = 'fill="rgba(79,142,247,.25)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"';
  const boite = (x, y, w, h, dx, dy) => {
    const A = [x, y + h], B = [x + w, y + h], C = [x + w, y], D = [x, y], E = [x + dx, y + h + dy], G = [x + w + dx, y + dy], H = [x + dx, y + dy];
    const F = [x + w + dx, y + h + dy], p = pts => pts.map(q => q.join(',')).join(' ');
    return `<line x1="${A[0]}" y1="${A[1]}" x2="${E[0]}" y2="${E[1]}" ${CACHE}/><line x1="${E[0]}" y1="${E[1]}" x2="${F[0]}" y2="${F[1]}" ${CACHE}/><line x1="${E[0]}" y1="${E[1]}" x2="${H[0]}" y2="${H[1]}" ${CACHE}/>`
      + `<polygon points="${p([A, B, C, D])}" ${FACE}/><polygon points="${p([D, C, G, H])}" ${FACE}/><polygon points="${p([B, F, G, C])}" ${FACE}/>`;
  };
  const SOLIDES = {
    'un cube': () => boite(22, 40, 42, 42, 16, -16),
    'un pavé droit': () => boite(12, 46, 58, 32, 18, -18),
    'une pyramide': () => `<line x1="20" y1="80" x2="38" y2="62" ${CACHE}/><line x1="38" y1="62" x2="82" y2="62" ${CACHE}/><line x1="38" y1="62" x2="52" y2="14" ${CACHE}/>`
      + `<polygon points="20,80 64,80 52,14" ${FACE}/><polygon points="64,80 82,62 52,14" ${FACE}/>`,
    'un cylindre': () => `<path d="M22 24 L22 76 A28 9 0 0 0 78 76 L78 24" ${FACE}/><path d="M22 76 A28 9 0 0 1 78 76" ${CACHE}/><ellipse cx="50" cy="24" rx="28" ry="9" ${FACE}/>`,
    'un cône': () => `<path d="M50 12 L20 76 A30 10 0 0 0 80 76 Z" ${FACE}/><path d="M20 76 A30 10 0 0 1 80 76" ${CACHE}/>`,
    'une boule': () => `<circle cx="50" cy="50" r="36" ${FACE}/><path d="M14 50 A36 11 0 0 0 86 50" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M14 50 A36 11 0 0 1 86 50" ${CACHE}/>`
  };
  const COMPTES = { 'un cube': [6, 12, 8], 'un pavé droit': [6, 12, 8], 'une pyramide': [5, 8, 5] };
  const QUIZ_SOLIDES = [
    ['Quel solide ressemble à un dé à jouer ?', 'un cube'], ['Quel solide ressemble à une boîte de conserve ?', 'un cylindre'],
    ['Quel solide ressemble à un cornet de glace ?', 'un cône'], ['Quel solide ressemble à un ballon de foot ?', 'une boule'],
    ['Quel solide ressemble à une brique ?', 'un pavé droit'], ['Quel solide n\'a aucune face plate ?', 'une boule'],
    ['Quel solide a 6 faces qui sont toutes des carrés ?', 'un cube'], ['Quel solide a une base carrée et 4 faces triangulaires ?', 'une pyramide'],
    ['Quel solide a deux faces plates en forme de disque ?', 'un cylindre'], ['Quel solide a une seule face plate, en forme de disque, et une pointe ?', 'un cône']
  ];
  const tireQS = tirage(QUIZ_SOLIDES);
  const genSolides = () => {
    const t = alea(0, 2), noms = Object.keys(SOLIDES);
    if (t === 0) {
      const nom = pioche(noms);
      return qcm({ visuel: svg(SOLIDES[nom]()), enonce: 'Comment s\'appelle ce solide ?', dire: 'Comment s\'appelle ce solide ?', aide: 'Les pointillés montrent les arêtes cachées, derrière.' }, nom, noms.filter(x => !(nom === 'un cube' && x === 'un pavé droit')));
    }
    if (t === 1) {
      const nom = pioche(Object.keys(COMPTES)), i = alea(0, 2), quoi = ['faces', 'arêtes', 'sommets'][i], n = COMPTES[nom][i];
      return qcm({ visuel: svg(SOLIDES[nom]()), enonce: `Combien de ${quoi} a ${nom.replace(/^un |^une /, m => m === 'un ' ? 'ce ' : 'cette ')} ?`, aide: 'N\'oublie pas ce qui est caché derrière (en pointillés) !' },
        n, [4, 5, 6, 8, 10, 12].filter(x => x !== n));
    }
    const [q, b] = tireQS();
    return qcm({ visuel: '🧊', enonce: q, dire: q }, b, noms.filter(x => x !== b && !(b === 'un cube' && x === 'un pavé droit')));
  };

  // ---------- Problèmes (souvent en deux étapes)
  const PRENOMS = [['Léa', 'elle'], ['Hugo', 'il'], ['Inès', 'elle'], ['Malik', 'il'], ['Chloé', 'elle'], ['Nathan', 'il'], ['Zoé', 'elle'], ['Sacha', 'il'], ['Lina', 'elle'], ['Adam', 'il']];
  const genProblemes = () => {
    const [nom, pr] = pioche(PRENOMS), Pr = pr === 'il' ? 'Il' : 'Elle', t = alea(0, 8);
    let txt, r, f, v;
    if (t === 0) {
      const b = alea(8, 25), c = alea(5, 20), a = b + c + alea(5, 40);
      r = a - b - c; v = '💶';
      txt = `${nom} a ${a} €. ${Pr} achète un livre à ${b} € et un jeu à ${c} €. Combien d'argent lui reste-t-il ?`;
      f = [a - b, a - c, b + c, r + 10, a + b + c];
    } else if (t === 1) {
      const a = alea(30, 55), b = alea(8, 20), c = alea(5, 15);
      r = a - b + c; v = '🚌';
      txt = `Dans un car, il y a ${a} passagers. Au premier arrêt, ${b} passagers descendent. Au deuxième arrêt, ${c} passagers montent. Combien y a-t-il de passagers maintenant ?`;
      f = [a - b - c, a + b + c, a - b, r + 1, r - 10];
    } else if (t === 2) {
      const a = pioche([6, 10, 12]), b = alea(3, 6), c = alea(2, a - 1);
      r = a * b - c; v = '🥚';
      txt = `Une boîte contient ${a} œufs. Papa achète ${b} boîtes et utilise ${c} œufs pour une omelette. Combien d'œufs lui reste-t-il ?`;
      f = [a * b, a * b + c, a + b - c, a * (b - 1), r + 10];
    } else if (t === 3) {
      const a = alea(3, 7), b = alea(6, 12), c = alea(3, 15);
      r = a * b + c; v = '🃏';
      txt = `${nom} a ${a} paquets de ${b} cartes. On lui donne encore ${c} cartes. Combien de cartes a-t-${pr} maintenant ?`;
      f = [a * b, a + b + c, a * b - c, a * (b + c), r + 1];
    } else if (t === 4) {
      const a = alea(4, 9), b = alea(6, 10), c = alea(5, a * b - 5);
      r = a * b - c; v = '🎬';
      txt = `Une salle de cinéma a ${a} rangées de ${b} fauteuils. ${c} fauteuils sont occupés. Combien de fauteuils sont libres ?`;
      f = [a * b, a * b + c, a + b, r + b, r - 1];
    } else if (t === 5) {
      const pa = alea(6, 12), pe = alea(3, pa - 1), na = alea(1, 3), ne = alea(2, 4);
      r = na * pa + ne * pe; v = '🎟️';
      txt = `Au musée, un billet adulte coûte ${pa} € et un billet enfant ${pe} €. Combien paie une famille de ${na} adulte${na > 1 ? 's' : ''} et ${ne} enfants ?`;
      f = [pa + pe, (na + ne) * pa, (na + ne) * pe, na * pa + pe, r + pe];
    } else if (t === 6) {
      const a = alea(40, 150), b = alea(10, 40);
      r = a + a + b; v = '🖼️';
      txt = `${nom} a ${a} images. Son frère en a ${b} de plus qu'${pr === 'il' ? 'il' : 'elle'}. Combien d'images ont-ils à eux deux ?`;
      f = [a + b, a - b, a + a - b, r + 10, 2 * b + a];
    } else if (t === 7) {
      const n = alea(2, 5), q = alea(5, 10), c = alea(1, q - 2);
      r = q - c; v = '🍬';
      txt = `On partage ${n * q} bonbons entre ${n} enfants. Puis chaque enfant mange ${c} bonbon${c > 1 ? 's' : ''}. Combien de bonbons reste-t-il à chaque enfant ?`;
      f = [q, n * q - c, q + c, n * q - n * c, r + 1];
    } else {
      const a = alea(120, 400), b = alea(20, 90);
      const moins = Math.random() < .5;
      r = moins ? a - b : a + b; v = '📏';
      txt = `La guirlande ${de(nom)} mesure ${a} cm. Celle de son ami mesure ${b} cm ${moins ? 'de moins' : 'de plus'}. Combien mesure la guirlande de son ami ?`;
      f = [moins ? a + b : a - b, a, b, r + 10, r - 10];
      return qcm({ visuel: '🎀', enonce: txt, dire: txt, aide: '« De plus » ou « de moins » : lis bien !' }, `${r} cm`, f.filter(x => x > 0 && x !== r).map(x => `${x} cm`));
    }
    const unite = t === 0 || t === 5 ? ' €' : '';
    return qcm({ visuel: v, enonce: txt, dire: txt, aide: 'Il y a plusieurs calculs à faire. Lequel en premier ?' }, r + unite, f.filter(x => x > 0 && x !== r).map(x => x + unite));
  };

  ajouterMatiere('CE2', {
    id: 'maths', titre: 'Maths', emoji: '🔢', couleur: '#4f8ef7', jeux: [
      { id: 'nombres', titre: 'Nombres jusqu\'à 10 000', emoji: '🔢', gen: genNombres },
      { id: 'comparer', titre: 'Comparer, ranger, arrondir', emoji: '🐊', gen: genComparer },
      { id: 'add-sous', titre: 'Additions et soustractions', emoji: '➕', gen: genAddSous },
      { id: 'tables', titre: 'Tables de multiplication', emoji: '✖️', gen: genTables },
      { id: 'multiplication', titre: 'Multiplier', emoji: '🧮', gen: genMultiplication },
      { id: 'calcul-mental', titre: 'Calcul mental', emoji: '🧠', gen: genCalculMental },
      { id: 'division', titre: 'Partager et grouper', emoji: '➗', gen: genDivision },
      { id: 'fractions', titre: 'Moitié, tiers, quart', emoji: '🍕', gen: genFractions },
      { id: 'mesures', titre: 'Longueurs, masses, contenances', emoji: '📏', gen: genMesures },
      { id: 'heure', titre: 'Heures et durées', emoji: '⏰', gen: genHeure },
      { id: 'monnaie', titre: 'La monnaie', emoji: '💶', gen: genMonnaie },
      { id: 'geometrie', titre: 'Figures et solides', emoji: '📐', gen: genGeometrie },
      { id: 'problemes', titre: 'Problèmes', emoji: '🤔', gen: genProblemes }
    ]
  });

  /* =====================================================================
     FRANÇAIS
     ===================================================================== */

  // ---------- Conjugaison : présent, imparfait, futur, passé composé
  const verbeEr = v => { const s = v.slice(0, -2); return { pr: [s + 'e', s + 'es', s + 'e', s + 'ons', s + 'ez', s + 'ent'], imp: s, fut: v, aux: 'avoir', pp: s + 'é' }; };
  const verbeIr = v => { const s = v.slice(0, -2); return { pr: [s + 'is', s + 'is', s + 'it', s + 'issons', s + 'issez', s + 'issent'], imp: s + 'iss', fut: v, aux: 'avoir', pp: s + 'i' }; };
  const CONJ = {
    'être': { pr: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'], imp: 'ét', fut: 'ser', aux: 'avoir', pp: 'été', c: 'à la maison' },
    'avoir': { pr: ['ai', 'as', 'a', 'avons', 'avez', 'ont'], imp: 'av', fut: 'aur', aux: 'avoir', pp: 'eu', c: 'un chat' },
    'aller': { pr: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'], imp: 'all', fut: 'ir', aux: 'être', pp: 'allé', c: 'à la piscine' },
    'faire': { pr: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'], imp: 'fais', fut: 'fer', aux: 'avoir', pp: 'fait', c: 'un gâteau' },
    'dire': { pr: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'], imp: 'dis', fut: 'dir', aux: 'avoir', pp: 'dit', c: 'bonjour' },
    'venir': { pr: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'], imp: 'ven', fut: 'viendr', aux: 'être', pp: 'venu', c: 'à la fête' },
    'chanter': { ...verbeEr('chanter'), c: 'une chanson' }, 'jouer': { ...verbeEr('jouer'), c: 'au ballon' },
    'parler': { ...verbeEr('parler'), c: 'avec mamie' }, 'danser': { ...verbeEr('danser'), c: 'dans le salon' },
    'regarder': { ...verbeEr('regarder'), c: 'les étoiles' }, 'arriver': { ...verbeEr('arriver'), aux: 'être', c: 'à l\'école' },
    'finir': { ...verbeIr('finir'), c: 'le puzzle' }, 'choisir': { ...verbeIr('choisir'), c: 'un livre' }, 'grandir': { ...verbeIr('grandir'), c: 'vite' }
  };
  const AUX_PR = { avoir: ['ai', 'as', 'a', 'avons', 'avez', 'ont'], 'être': ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'] };
  const FIN_I = ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'], FIN_F = ['ai', 'as', 'a', 'ons', 'ez', 'ont'];
  const NOM_TEMPS = { pr: 'présent', imp: 'imparfait', fut: 'futur', pc: 'passé composé' };
  // [pronom, personne, féminin, pluriel]
  const PERS = [['je', 0, 0, 0], ['tu', 1, 0, 0], ['il', 2, 0, 0], ['elle', 2, 1, 0], ['nous', 3, 0, 1], ['vous', 4, 0, 1], ['ils', 5, 0, 1], ['elles', 5, 1, 1]];
  const PERS_ETRE = PERS.filter(x => /^(il|elle|ils|elles)$/.test(x[0]));
  // Forme conjuguée (sans le pronom). aux : forcer un auxiliaire (pour fabriquer des erreurs).
  const conj = (v, t, [, p, fem, pl], aux) => {
    const c = CONJ[v];
    if (t === 'pr') return c.pr[p];
    if (t === 'imp') return c.imp + FIN_I[p];
    if (t === 'fut') return c.fut + FIN_F[p];
    const a = aux || c.aux;
    return AUX_PR[a][p] + ' ' + c.pp + (a === 'être' ? (fem ? 'e' : '') + (pl ? 's' : '') : '');
  };
  const avecPron = (pron, f) => (pron === 'je' && /^[aeiouéèêh]/.test(f) ? 'j\'' + f : pron + ' ' + f);
  const erreursConj = (v, t, pers) => {
    const f = [];
    Object.keys(NOM_TEMPS).forEach(t2 => { if (t2 !== t) f.push(conj(v, t2, pers)); });
    PERS.forEach(p2 => { if (p2[1] !== pers[1]) f.push(conj(v, t, p2)); });
    if (t === 'pc') {
      f.push(conj(v, 'pc', pers, CONJ[v].aux === 'être' ? 'avoir' : 'être'));
      if (CONJ[v].aux === 'être') [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([fe, pl]) => f.push(conj(v, 'pc', [pers[0], pers[1], fe, pl])));
      else f.push(AUX_PR.avoir[pers[1]] + ' ' + v);
    }
    return f;
  };
  const MARQUEURS = { fut: ['Demain', 'L\'année prochaine', 'Bientôt', 'La semaine prochaine'], pc: ['Hier', 'Hier soir', 'La semaine dernière', 'Samedi dernier'], imp: ['Autrefois', 'Il y a très longtemps, chaque jour', 'Autrefois, tous les soirs'], pr: ['En ce moment'] };
  // Temps qu'on ne propose pas comme piège, car ils pourraient aussi convenir.
  const EXCLUS = { fut: ['pr'], pc: ['imp'], imp: ['pc'], pr: ['pc'] };
  const genConjugaison = () => {
    const t = alea(0, 6), v = pioche(Object.keys(CONJ)), temps = pioche(Object.keys(NOM_TEMPS));
    const pers = pioche(temps === 'pc' && CONJ[v].aux === 'être' ? PERS_ETRE : PERS), pron = pers[0];
    if (t <= 2) {
      const bon = avecPron(pron, conj(v, temps, pers));
      return qcm({ visuel: '⏳', enonce: `Conjugue « ${v} » ${temps === 'imp' ? 'à l\'' : 'au '}${NOM_TEMPS[temps]} avec « ${pron} ».`, aide: temps === 'pc' ? 'Passé composé = auxiliaire être ou avoir + participe passé.' : '' },
        bon, erreursConj(v, temps, pers).map(f => avecPron(pron, f)));
    }
    if (t === 3) {
      const f = avecPron(pron, conj(v, temps, pers));
      return { visuel: '🔎', enonce: `À quel temps est ce verbe ?<br>${phrase('« ' + f + ' »')}`, dire: `À quel temps est ce verbe : ${f} ?`, choix: Object.values(NOM_TEMPS), bonne: NOM_TEMPS[temps] };
    }
    if (t === 4 && Math.random() < .5) {
      const verbe = pioche(Object.keys(CONJ));
      return { visuel: '🤔', enonce: `Au passé composé, « ${verbe} » se conjugue avec l'auxiliaire…`, choix: ['être', 'avoir'], bonne: CONJ[verbe].aux };
    }
    // Phrase avec un mot qui indique le temps.
    const tm = pioche(Object.keys(MARQUEURS)), pr2 = pioche(tm === 'pc' && CONJ[v].aux === 'être' ? PERS_ETRE : PERS.slice(1));
    const bon = conj(v, tm, pr2);
    const fausses = erreursConj(v, tm, pr2).filter(f => !EXCLUS[tm].some(t2 => f === conj(v, t2, pr2)));
    const debut = pioche(MARQUEURS[tm]), sujet = pr2[0] + ' ';
    const p = `${debut}, ${sujet}… ${CONJ[v].c}.`;
    return qcm({ visuel: '📅', enonce: `Complète avec le verbe « ${v} » :<br>${phrase(p)}`, dire: `Complète avec le verbe ${v} : ${p.replace('…', 'blanc')}`, aide: 'Le début de la phrase t\'indique le temps.' }, bon, fausses);
  };

  // ---------- Nature des mots
  const NATURES = ['nom commun', 'nom propre', 'verbe', 'adjectif', 'déterminant', 'pronom personnel'];
  const NATURE_CE2 = [
    ['Le [chien] de Tom aboie.', 'nom commun'], ['Ma [maison] est au bord de la mer.', 'nom commun'], ['Les [enfants] jouent au ballon.', 'nom commun'],
    ['J\'ai mangé une [pomme] rouge.', 'nom commun'], ['La [maîtresse] écrit au tableau.', 'nom commun'], ['Le [vent] souffle fort.', 'nom commun'],
    ['[Paris] est une grande ville.', 'nom propre'], ['Mon chat s\'appelle [Filou].', 'nom propre'], ['[Léa] fait du vélo.', 'nom propre'],
    ['Nous partons en vacances en [Bretagne].', 'nom propre'], ['La [Loire] est un long fleuve.', 'nom propre'], ['Je joue avec [Karim].', 'nom propre'],
    ['Le chat [dort] sur le lit.', 'verbe'], ['Les oiseaux [chantent] le matin.', 'verbe'], ['Maman [prépare] une soupe.', 'verbe'],
    ['Nous [courons] dans la cour.', 'verbe'], ['Tu [lis] un livre.', 'verbe'], ['Le bébé [pleure] fort.', 'verbe'],
    ['Le [petit] chat dort.', 'adjectif'], ['J\'ai une robe [bleue].', 'adjectif'], ['Ce gâteau est [délicieux].', 'adjectif'],
    ['Un [grand] arbre pousse ici.', 'adjectif'], ['La mer est [calme].', 'adjectif'], ['Il porte un pull [chaud].', 'adjectif'],
    ['[Le] chien de Tom aboie.', 'déterminant'], ['[Une] souris mange du fromage.', 'déterminant'], ['[Mes] crayons sont neufs.', 'déterminant'],
    ['[Cette] fleur sent bon.', 'déterminant'], ['J\'ai perdu [ma] trousse.', 'déterminant'], ['Il mange [des] cerises.', 'déterminant'],
    ['[Il] chante bien.', 'pronom personnel'], ['[Nous] allons au parc.', 'pronom personnel'], ['[Elles] dansent dans le salon.', 'pronom personnel'],
    ['[Tu] ranges ta chambre.', 'pronom personnel'], ['[Vous] êtes en retard.', 'pronom personnel'], ['[Je] dessine un bateau.', 'pronom personnel']
  ];
  const tireNature = tirage(NATURE_CE2);
  const genNature = () => {
    const [p, bon] = tireNature();
    const html = p.replace(/\[(.+?)\]/, '<u><b>$1</b></u>'), mot = /\[(.+?)\]/.exec(p)[1];
    return qcm({ visuel: '🏷️', enonce: `Quelle est la nature du mot souligné ?<br>${phrase(html)}`, dire: `${p.replace(/[[\]]/g, '')} Quelle est la nature du mot : ${mot} ?` }, bon, NATURES);
  };

  // ---------- Sujet et verbe
  // [phrase, sujet, verbe, faux sujets]
  const SUJETS_CE2 = [
    ['Le petit chien aboie dans le jardin.', 'Le petit chien', 'aboie', ['le jardin', 'petit', 'dans le jardin']],
    ['Ma grand-mère prépare une tarte.', 'Ma grand-mère', 'prépare', ['une tarte', 'grand-mère prépare']],
    ['Les oiseaux chantent au printemps.', 'Les oiseaux', 'chantent', ['au printemps', 'le printemps']],
    ['Nous jouons dans la cour.', 'Nous', 'jouons', ['la cour', 'dans la cour']],
    ['Chaque matin, le facteur apporte le courrier.', 'le facteur', 'apporte', ['Chaque matin', 'le courrier', 'matin']],
    ['Tom et Léa construisent une cabane.', 'Tom et Léa', 'construisent', ['Tom', 'Léa', 'une cabane']],
    ['Dans la forêt, les écureuils ramassent des noisettes.', 'les écureuils', 'ramassent', ['la forêt', 'des noisettes', 'Dans la forêt']],
    ['Le vent souffle très fort.', 'Le vent', 'souffle', ['très fort', 'fort']],
    ['Tu ranges ta chambre.', 'Tu', 'ranges', ['ta chambre', 'chambre']],
    ['Mes cousins arrivent demain.', 'Mes cousins', 'arrivent', ['demain', 'cousins arrivent']],
    ['La maîtresse lit une histoire.', 'La maîtresse', 'lit', ['une histoire', 'histoire']],
    ['Le soir, papa regarde les étoiles.', 'papa', 'regarde', ['Le soir', 'les étoiles', 'étoiles']],
    ['Les enfants de la classe visitent un musée.', 'Les enfants de la classe', 'visitent', ['la classe', 'un musée']],
    ['Vous écoutez de la musique.', 'Vous', 'écoutez', ['de la musique', 'musique']],
    ['Mon frère et moi préparons le goûter.', 'Mon frère et moi', 'préparons', ['Mon frère', 'moi', 'le goûter']],
    ['Le chat de Julie dort sur le canapé.', 'Le chat de Julie', 'dort', ['Julie', 'le canapé', 'sur le canapé']],
    ['Elles dansent sur la scène.', 'Elles', 'dansent', ['la scène', 'sur la scène']],
    ['Au zoo, la girafe mange des feuilles.', 'la girafe', 'mange', ['Au zoo', 'des feuilles', 'zoo']],
    ['Les pompiers éteignent le feu.', 'Les pompiers', 'éteignent', ['le feu', 'feu']],
    ['Je dessine un bateau.', 'Je', 'dessine', ['un bateau', 'bateau']],
    ['Pendant la nuit, la neige tombe sans bruit.', 'la neige', 'tombe', ['la nuit', 'Pendant la nuit', 'sans bruit']],
    ['Le boulanger vend du pain frais.', 'Le boulanger', 'vend', ['du pain frais', 'pain']],
    ['Lucas range ses crayons.', 'Lucas', 'range', ['ses crayons', 'crayons']],
    ['Les feuilles des arbres tombent en automne.', 'Les feuilles des arbres', 'tombent', ['des arbres', 'les arbres', 'en automne']]
  ];
  const ACCORD_SV = [
    ['Les chats ___ du lait.', 'boivent', ['boit', 'bois']], ['Mon amie ___ une chanson.', 'chante', ['chantent', 'chantes']],
    ['Tu ___ ton cartable.', 'prends', ['prend', 'prennent']], ['Les élèves ___ à la piscine.', 'vont', ['va', 'vas']],
    ['Nous ___ nos devoirs.', 'finissons', ['finissent', 'finit']], ['Vous ___ très vite.', 'courez', ['courent', 'court']],
    ['Le chien et le chat ___ ensemble.', 'jouent', ['joue', 'joues']], ['Ma sœur ___ huit ans.', 'a', ['ont', 'as']],
    ['Les fleurs du jardin ___ belles.', 'sont', ['est', 'es']], ['Je ___ content.', 'suis', ['est', 'es']],
    ['Elles ___ dans la mer.', 'nagent', ['nage', 'nages']], ['Le bébé des voisins ___ souvent.', 'pleure', ['pleurent', 'pleures']],
    ['Tom et moi ___ au parc.', 'allons', ['vont', 'va']], ['Tu ___ une belle voix.', 'as', ['a', 'ont']],
    ['Les enfants ___ un château de sable.', 'font', ['fait', 'fais']], ['Papa et maman ___ au cinéma.', 'vont', ['va', 'allons']],
    ['Le maître ___ la leçon.', 'explique', ['expliquent', 'expliques']], ['Vous ___ gentils.', 'êtes', ['sont', 'est']],
    ['On ___ des crêpes ce soir.', 'mange', ['mangent', 'manges']], ['Les feuilles de l\'arbre ___ en automne.', 'tombent', ['tombe', 'tombes']],
    ['Il ___ ses chaussures.', 'met', ['mettent', 'mets']], ['Mes parents ___ la radio.', 'écoutent', ['écoute', 'écoutes']]
  ];
  const PETITS_MOTS = /^(le|la|les|l|un|une|des|du|de|d|mon|ma|mes|ses|sa|son|ta|tes|ton|dans|sur|sous|avec|très|au|aux|et|en|pendant|chaque|sans)$/i;
  const tireSujet = tirage(SUJETS_CE2), tireAccSV = tirage(ACCORD_SV);
  const genSujetVerbe = () => {
    const t = alea(0, 2);
    if (t === 0) {
      const [p, s, v, f] = tireSujet();
      const html = p.replace(new RegExp(`(^|\\s)${v}(?=[\\s.,])`), `$1<u><b>${v}</b></u>`);
      return qcm({ visuel: '🎯', enonce: `Quel est le sujet du verbe souligné ?<br>${phrase(html)}`, dire: `${p} Quel est le sujet du verbe ${v} ?`, aide: 'Pose la question « Qui est-ce qui… ? » devant le verbe.' }, s, [...f, v]);
    }
    if (t === 1) {
      const [p, , v] = tireSujet();
      const mots = p.replace(/[.,!?]/g, '').split(/[\s']+/).filter(m => m.length > 1 && !PETITS_MOTS.test(m) && m !== v);
      return qcm({ visuel: '🔍', enonce: `Quel est le verbe conjugué ?<br>${phrase(p)}`, dire: `${p} Quel est le verbe conjugué ?`, aide: 'Le verbe change si on dit la phrase au passé ou au futur.' }, v, mots);
    }
    const [p, b, f] = tireAccSV();
    return qcm({ visuel: '🤝', enonce: `Choisis la bonne forme du verbe :<br>${phrase(p)}`, dire: p.replace('___', 'blanc'), aide: 'Trouve d\'abord le sujet : le verbe s\'accorde avec lui.' }, b, f, 3);
  };

  // ---------- Les accords dans le groupe nominal
  const ACCORDS_GN = [
    ['J\'habite dans une ___ maison.', 'petite', ['petit', 'petites']], ['Il a des chaussures ___.', 'noires', ['noire', 'noirs']],
    ['Nous avons deux chats ___.', 'gris', ['grise', 'grises']], ['Elle porte une robe ___.', 'verte', ['vert', 'vertes']],
    ['Les ___ fleurs sentent bon.', 'jolies', ['jolie', 'jolis']], ['C\'est une ___ idée !', 'bonne', ['bon', 'bonnes']],
    ['Mes amies sont ___.', 'gentilles', ['gentil', 'gentils']], ['Il raconte des histoires ___.', 'drôles', ['drôle', 'drôlent']],
    ['J\'ai vu de ___ montagnes.', 'hautes', ['haute', 'hauts']], ['Le chat a des yeux ___.', 'verts', ['vert', 'vertes']],
    ['La soupe est ___.', 'chaude', ['chaud', 'chaudes']], ['Mes frères sont ___.', 'grands', ['grand', 'grandes']],
    ['___ oiseaux chantent.', 'Les', ['Le', 'La']], ['___ fille lit un livre.', 'La', ['Le', 'Les']],
    ['J\'ai rangé ___ crayons.', 'mes', ['mon', 'ma']], ['Elle promène ___ chienne.', 'sa', ['son', 'ses']],
    ['Il mange ___ pommes.', 'des', ['une', 'un']], ['Regarde ___ papillon !', 'ce', ['cette', 'ces']],
    ['Tu as de beaux ___.', 'dessins', ['dessin', 'dessine']], ['Il y a trois ___ dans le pré.', 'chevaux', ['cheval', 'chevals']],
    ['J\'ai deux ___ en or.', 'bijoux', ['bijou', 'bijous']], ['Les ___ flottent sur l\'eau.', 'bateaux', ['bateau', 'bateaus']],
    ['Mamie a les yeux ___.', 'bleus', ['bleu', 'bleues']], ['Ma tante est très ___.', 'gentille', ['gentil', 'gentils']],
    ['Les ___ du jardin sont mûres.', 'fraises', ['fraise', 'fraisent']], ['Une ___ voiture passe.', 'grosse', ['gros', 'grose']]
  ];
  const TRANSFO = [
    ['Mets au pluriel : « le chat noir »', 'les chats noirs', ['les chats noir', 'les chat noirs', 'le chats noirs']],
    ['Mets au pluriel : « une fleur rouge »', 'des fleurs rouges', ['des fleurs rouge', 'des fleur rouges', 'une fleurs rouges']],
    ['Mets au pluriel : « un arbre fleuri »', 'des arbres fleuris', ['des arbres fleuri', 'des arbre fleuris', 'un arbres fleuris']],
    ['Mets au pluriel : « la petite fille »', 'les petites filles', ['les petite filles', 'les petites fille', 'la petites filles']],
    ['Mets au pluriel : « un cheval blanc »', 'des chevaux blancs', ['des chevals blancs', 'des chevaux blanc', 'des cheval blancs']],
    ['Mets au pluriel : « mon ami fidèle »', 'mes amis fidèles', ['mes ami fidèles', 'mon amis fidèles', 'mes amis fidèle']],
    ['Mets au féminin : « un voisin gentil »', 'une voisine gentille', ['une voisin gentille', 'une voisine gentil', 'un voisine gentille']],
    ['Mets au féminin : « le petit chat »', 'la petite chatte', ['la petit chatte', 'la petite chate', 'le petite chatte']],
    ['Mets au féminin : « un chanteur célèbre »', 'une chanteuse célèbre', ['une chanteur célèbre', 'une chanteure célèbre', 'un chanteuse célèbre']],
    ['Mets au féminin : « un lion fatigué »', 'une lionne fatiguée', ['une lionne fatigué', 'une lione fatiguée', 'une lion fatiguée']],
    ['Mets au féminin : « le boulanger content »', 'la boulangère contente', ['la boulanger contente', 'la boulangère content', 'la boulangerie contente']]
  ];
  const tireGN = tirage(ACCORDS_GN), tireTransfo = tirage(TRANSFO);
  const genAccordsGN = () => {
    if (Math.random() < .7) {
      const [p, b, f] = tireGN();
      return qcm({ visuel: '✅', enonce: `Choisis le bon mot :<br>${phrase(p)}`, dire: p.replace('___', 'blanc'), aide: 'Regarde le nom : est-il masculin ou féminin ? singulier ou pluriel ?' }, b, f, 3);
    }
    const [q, b, f] = tireTransfo();
    return qcm({ visuel: '🔄', enonce: q, dire: q, aide: 'Tous les mots du groupe changent ensemble.' }, b, f);
  };

  // ---------- Phrases et ponctuation
  const PONCT = [
    ['Le chat dort sur le canapé', '.'], ['Nous partons en vacances demain', '.'], ['Il pleut depuis ce matin', '.'], ['Ma sœur a sept ans', '.'],
    ['Les oiseaux construisent leur nid', '.'], ['Le train arrive à midi', '.'], ['J\'aime les fraises', '.'], ['Papa lave la voiture', '.'],
    ['Où as-tu rangé tes chaussures', '?'], ['Quelle heure est-il', '?'], ['Veux-tu jouer avec moi', '?'], ['Est-ce que tu viens ce soir', '?'],
    ['Pourquoi pleures-tu', '?'], ['Combien coûte ce livre', '?'], ['As-tu fini ton dessin', '?'], ['Qui a mangé ma pomme', '?'],
    ['Quel beau dessin', '!'], ['Comme tu as grandi', '!'], ['Quelle chance', '!'], ['Que ce gâteau est bon', '!'], ['Comme il fait chaud', '!'], ['Quelle belle surprise', '!']
  ];
  const TYPES_CE2 = [
    ['Le soleil brille.', 'déclarative'], ['Mon chien s\'appelle Rex.', 'déclarative'], ['Les élèves lisent en silence.', 'déclarative'], ['J\'ai perdu mon bonnet.', 'déclarative'],
    ['Nous irons à la mer cet été.', 'déclarative'], ['Le bus est en retard.', 'déclarative'],
    ['Où habites-tu ?', 'interrogative'], ['As-tu faim ?', 'interrogative'], ['Est-ce que tu aimes la soupe ?', 'interrogative'], ['Qui frappe à la porte ?', 'interrogative'],
    ['Pourquoi le ciel est-il bleu ?', 'interrogative'], ['Tu viens avec nous ?', 'interrogative'],
    ['Quelle belle journée !', 'exclamative'], ['Comme tu cours vite !', 'exclamative'], ['Que cette fleur est jolie !', 'exclamative'], ['Quel beau château !', 'exclamative'],
    ['Ferme la porte.', 'impérative'], ['Range ta chambre.', 'impérative'], ['Prenez vos cahiers.', 'impérative'], ['Écoute bien la consigne.', 'impérative'],
    ['Lave-toi les mains.', 'impérative'], ['Viens ici.', 'impérative']
  ];
  const BIEN_ECRITES = ['Le chat dort.', 'Mon frère joue au foot.', 'Il fait beau aujourd\'hui.', 'Nous mangeons une tarte.', 'La maîtresse sourit.', 'Les enfants chantent.',
    'Léa lit une histoire.', 'Le vent souffle fort.', 'Mamie tricote une écharpe.', 'Paul range sa chambre.', 'Hugo nage vite.', 'Le soleil se couche.'];
  const NEG_CE2 = [
    ['Il aime le chocolat.', 'Il n\'aime pas le chocolat.', ['Il aime pas le chocolat.', 'Il ne aime pas le chocolat.', 'Il n\'aime le chocolat pas.']],
    ['Tu joues dehors.', 'Tu ne joues pas dehors.', ['Tu joues pas dehors.', 'Tu ne pas joues dehors.', 'Tu joues ne pas dehors.']],
    ['Le chien dort.', 'Le chien ne dort pas.', ['Le chien dort pas.', 'Le chien ne pas dort.', 'Le chien pas dort.']],
    ['Nous sommes fatigués.', 'Nous ne sommes pas fatigués.', ['Nous sommes pas fatigués.', 'Nous ne pas sommes fatigués.', 'Nous ne sommes fatigués pas.']],
    ['Elle a froid.', 'Elle n\'a pas froid.', ['Elle a pas froid.', 'Elle ne a pas froid.', 'Elle n\'a froid pas.']],
    ['Je regarde la télévision.', 'Je ne regarde pas la télévision.', ['Je regarde pas la télévision.', 'Je ne pas regarde la télévision.', 'Je pas regarde la télévision.']],
    ['Les enfants crient.', 'Les enfants ne crient pas.', ['Les enfants crient pas.', 'Les enfants ne pas crient.', 'Les enfants pas crient.']],
    ['Vous êtes en retard.', 'Vous n\'êtes pas en retard.', ['Vous êtes pas en retard.', 'Vous ne êtes pas en retard.', 'Vous n\'êtes en retard pas.']]
  ];
  const tirePonct = tirage(PONCT), tireTypes = tirage(TYPES_CE2), tireBien = tirage(BIEN_ECRITES), tireNeg = tirage(NEG_CE2);
  const genPhrases = () => {
    const t = alea(0, 4);
    if (t <= 1) {
      const [p, b] = tirePonct();
      return { visuel: '❓', enonce: `Quel signe faut-il mettre à la fin ?<br>${phrase(p + ' …')}`, dire: `Quel signe de ponctuation faut-il mettre à la fin de cette phrase ? ${p}`, choix: ['.', '?', '!'], bonne: b };
    }
    if (t === 2) {
      const [p, b] = tireTypes();
      return qcm({ visuel: '💬', enonce: `Quel est le type de cette phrase ?<br>${phrase(p)}`, dire: `Quel est le type de cette phrase : ${p}` }, b, ['déclarative', 'interrogative', 'exclamative', 'impérative']);
    }
    if (t === 3) {
      const p = tireBien(), min = p[0].toLowerCase() + p.slice(1), sans = p.slice(0, -1);
      return qcm({ visuel: '✍️', enonce: 'Quelle phrase est bien écrite ?', dire: 'Quelle phrase est bien écrite ? Regarde le début et la fin.' }, p, [min, sans, min.slice(0, -1)]);
    }
    const [p, b, f] = tireNeg();
    return qcm({ visuel: '🚫', enonce: `Quelle est la forme négative de :<br>${phrase(p)}`, dire: `Quelle est la forme négative de : ${p}`, aide: 'La négation a deux morceaux : ne… pas.' }, b, f);
  };

  // ---------- Homophones
  // [phrase, bon, faux] ; la paire est rappelée dans l'énoncé.
  const HOMO_CE2 = [
    ['Mon chat ___ faim.', 'a', 'à'], ['Je vais ___ l\'école.', 'à', 'a'], ['Il ___ un vélo neuf.', 'a', 'à'], ['Nous jouons ___ cache-cache.', 'à', 'a'],
    ['Lina ___ perdu son gant.', 'a', 'à'], ['Le goûter est ___ quatre heures.', 'à', 'a'], ['Papa ___ mal au dos.', 'a', 'à'], ['C\'est une tarte ___ la fraise.', 'à', 'a'],
    ['Le ciel ___ tout bleu.', 'est', 'et'], ['J\'ai un chien ___ un chat.', 'et', 'est'], ['Ma sœur ___ malade.', 'est', 'et'], ['Il saute ___ il court.', 'et', 'est'],
    ['Cette soupe ___ trop chaude.', 'est', 'et'], ['Tom ___ Léa sont amis.', 'et', 'est'], ['Le pain ___ sur la table.', 'est', 'et'], ['Je prends du pain ___ du beurre.', 'et', 'est'],
    ['Les enfants ___ dans la cour.', 'sont', 'son'], ['Léo range ___ cartable.', 'son', 'sont'], ['Mes amis ___ très gentils.', 'sont', 'son'], ['Elle promène ___ chien.', 'son', 'sont'],
    ['Les pommes ___ mûres.', 'sont', 'son'], ['Papa lave ___ vélo.', 'son', 'sont'], ['Où ___ mes lunettes ?', 'sont', 'son'], ['Le bébé tient ___ doudou.', 'son', 'sont'],
    ['___ va au parc cet après-midi.', 'On', 'Ont'], ['Les oiseaux ___ faim.', 'ont', 'on'], ['Mes parents ___ une grande voiture.', 'ont', 'on'], ['Ce soir, ___ mange des crêpes.', 'on', 'ont'],
    ['Les élèves ___ fini leur travail.', 'ont', 'on'], ['Quand il pleut, ___ reste à la maison.', 'on', 'ont'], ['Mes cousins ___ un chat roux.', 'ont', 'on'], ['___ entend la mer d\'ici.', 'On', 'Ont'],
    ['___ as-tu caché le trésor ?', 'Où', 'Ou'], ['Tu veux du lait ___ du jus ?', 'ou', 'où'], ['Je ne sais pas ___ est mon livre.', 'où', 'ou'], ['Prends une pomme ___ une poire.', 'ou', 'où'],
    ['La ville ___ j\'habite est grande.', 'où', 'ou'], ['Tu viens à pied ___ en vélo ?', 'ou', 'où'], ['___ vas-tu en vacances ?', 'Où', 'Ou'], ['Rouge ___ bleu, quelle couleur préfères-tu ?', 'ou', 'où'],
    ['Le chat lèche ___ pattes.', 'ses', 'ces'], ['Regarde ___ étoiles, là-haut !', 'ces', 'ses'], ['Mamie met ___ lunettes pour lire.', 'ses', 'ces'], ['Tu vois ___ nuages gris ? Il va pleuvoir.', 'ces', 'ses'],
    ['Le lapin remue ___ grandes oreilles.', 'ses', 'ces'], ['J\'adore ___ gâteaux-là !', 'ces', 'ses'], ['Paul lace ___ chaussures avant de partir.', 'ses', 'ces'], ['___ maisons-ci sont très anciennes.', 'Ces', 'Ses']
  ];
  const tireHomo = tirage(HOMO_CE2);
  const genHomophones = () => {
    const [p, b, f] = tireHomo();
    const paire = [b.toLowerCase(), f.toLowerCase()].sort((x, y) => (x < y ? -1 : 1)).map(x => `« ${x} »`).join(' ou ');
    return { visuel: '🔀', enonce: `${paire} ?<br>${phrase(p)}`, dire: `Complète la phrase : ${p.replace('___', 'blanc')}`, choix: melange([b, f]), bonne: b };
  };

  // ---------- Vocabulaire : synonymes, contraires, familles, préfixes, suffixes
  const SYN_CE2 = [
    ['content', 'joyeux', ['triste', 'fâché', 'fatigué']], ['un vélo', 'une bicyclette', ['une voiture', 'un camion', 'une moto']],
    ['rapide', 'vite', ['lent', 'lourd', 'grand']], ['se dépêcher', 'se presser', ['traîner', 'se reposer', 'attendre']],
    ['beau', 'joli', ['laid', 'petit', 'vieux']], ['commencer', 'débuter', ['finir', 'arrêter', 'oublier']],
    ['une maison', 'une habitation', ['un jardin', 'une rue', 'une voiture']], ['effrayé', 'apeuré', ['courageux', 'joyeux', 'calme']],
    ['grand', 'immense', ['minuscule', 'étroit', 'court']], ['parler', 'bavarder', ['se taire', 'dormir', 'courir']],
    ['un chemin', 'un sentier', ['une rivière', 'un pont', 'une colline']], ['finir', 'terminer', ['commencer', 'débuter', 'partir']],
    ['drôle', 'amusant', ['triste', 'ennuyeux', 'sérieux']], ['regarder', 'observer', ['écouter', 'sentir', 'goûter']],
    ['un bateau', 'un navire', ['un avion', 'un train', 'un port']], ['crier', 'hurler', ['chuchoter', 'murmurer', 'chanter']]
  ];
  const CONTR_CE2 = [
    ['grand', 'petit', ['gros', 'haut', 'long']], ['chaud', 'froid', ['tiède', 'brûlant', 'doux']], ['ouvrir', 'fermer', ['entrer', 'pousser', 'sortir']],
    ['monter', 'descendre', ['grimper', 'sauter', 'marcher']], ['jour', 'nuit', ['matin', 'soleil', 'midi']], ['propre', 'sale', ['neuf', 'net', 'lavé']],
    ['lourd', 'léger', ['gros', 'solide', 'épais']], ['gagner', 'perdre', ['jouer', 'réussir', 'courir']], ['plein', 'vide', ['rempli', 'lourd', 'complet']],
    ['toujours', 'jamais', ['souvent', 'parfois', 'longtemps']], ['devant', 'derrière', ['dessus', 'à côté', 'loin']], ['rapide', 'lent', ['pressé', 'vif', 'agile']],
    ['acheter', 'vendre', ['payer', 'choisir', 'dépenser']], ['facile', 'difficile', ['simple', 'possible', 'amusant']], ['allumer', 'éteindre', ['brûler', 'briller', 'chauffer']],
    ['entrer', 'sortir', ['rentrer', 'venir', 'arriver']]
  ];
  const FAM_CE2 = [
    ['dent', 'dentiste', ['danse', 'dindon', 'dans']], ['fleur', 'fleuriste', ['flèche', 'flûte', 'fleuve']], ['jardin', 'jardinier', ['jaune', 'jarre', 'jupe']],
    ['lait', 'laitier', ['laid', 'laine', 'lapin']], ['terre', 'terrain', ['tarte', 'tortue', 'tirer']], ['chant', 'chanteur', ['chameau', 'champ', 'chance']],
    ['froid', 'refroidir', ['frite', 'fromage', 'frotter']], ['mer', 'marin', ['mère', 'maire', 'merle']], ['plume', 'plumage', ['pluie', 'plomb', 'plage']],
    ['lent', 'lentement', ['lentille', 'lampe', 'lézard']], ['nage', 'nageur', ['neige', 'nuage', 'nappe']], ['pied', 'piéton', ['pierre', 'pie', 'pieuvre']],
    ['boulanger', 'boulangerie', ['boule', 'bouleau', 'bouton']], ['glace', 'glacier', ['glisser', 'gland', 'gloire']]
  ];
  const PREF_CE2 = [
    ['faire', 'défaire', ['refaire', 'parfaire', 'faisable']], ['coller', 'décoller', ['recoller', 'collage', 'collier']], ['possible', 'impossible', ['possibilité', 'repossible', 'dépossible']],
    ['content', 'mécontent', ['recontent', 'contentement', 'contente']], ['coiffer', 'décoiffer', ['recoiffer', 'coiffeur', 'coiffure']], ['heureux', 'malheureux', ['heureuse', 'heureusement', 'reheureux']],
    ['poli', 'impoli', ['polir', 'repoli', 'polie']], ['boutonner', 'déboutonner', ['reboutonner', 'bouton', 'boutonnière']], ['connu', 'inconnu', ['reconnu', 'connaître', 'connue']],
    ['plier', 'déplier', ['replier', 'pliage', 'pli']]
  ];
  const SENS_PREF = [
    ['relire', 'lire de nouveau', ['ne pas lire', 'lire vite', 'lire en premier']], ['refaire', 'faire de nouveau', ['ne pas faire', 'faire avant', 'faire mal']],
    ['revenir', 'venir de nouveau', ['ne pas venir', 'venir avant', 'venir vite']], ['défaire', 'le contraire de faire', ['faire de nouveau', 'faire avant', 'faire beaucoup']],
    ['incapable', 'qui n\'est pas capable', ['très capable', 'de nouveau capable', 'presque capable']], ['prévoir', 'voir à l\'avance', ['voir de nouveau', 'ne pas voir', 'voir mal']]
  ];
  const SUFF_CE2 = [
    ['Comment appelle-t-on une petite maison ?', 'une maisonnette', ['une maisonnée', 'un maison', 'une maisonnier']], ['Comment appelle-t-on une petite fille ?', 'une fillette', ['une fillerie', 'une filleuse', 'un fillon']],
    ['Comment appelle-t-on un petit chat ?', 'un chaton', ['un chatier', 'une chatette', 'un chatoir']], ['Comment appelle-t-on l\'arbre qui donne des pommes ?', 'un pommier', ['une pommade', 'un pommeur', 'une pommette']],
    ['Comment appelle-t-on l\'arbre qui donne des poires ?', 'un poirier', ['un poireau', 'une poirette', 'un poiron']], ['Comment appelle-t-on celui qui danse ?', 'un danseur', ['une danse', 'un dansier', 'un dansage']],
    ['Comment appelle-t-on celui qui nage ?', 'un nageur', ['une nage', 'un nageoir', 'un nagier']], ['Comment appelle-t-on la boutique du boucher ?', 'une boucherie', ['une bouchette', 'un bouchon', 'une bouchée']],
    ['Comment appelle-t-on celui qui travaille au jardin ?', 'un jardinier', ['un jardinage', 'une jardinerie', 'un jardinet']], ['Comment appelle-t-on un petit camion ?', 'une camionnette', ['un camionneur', 'un camionnier', 'une camionnerie']]
  ];
  const tSyn = tirage(SYN_CE2), tCon = tirage(CONTR_CE2), tFam = tirage(FAM_CE2), tPref = tirage(PREF_CE2), tSens = tirage(SENS_PREF), tSuff = tirage(SUFF_CE2);
  const genVocabulaire = () => {
    const t = alea(0, 5);
    if (t === 0) { const [m, b, f] = tSyn(); return qcm({ visuel: '🟰', enonce: `Quel mot veut dire presque la même chose que « ${m} » ?`, aide: 'On cherche un synonyme.' }, b, f); }
    if (t === 1) { const [m, b, f] = tCon(); return qcm({ visuel: '↔️', enonce: `Quel est le contraire de « ${m} » ?` }, b, f); }
    if (t === 2) { const [m, b, f] = tFam(); return qcm({ visuel: '👨‍👩‍👧', enonce: `Quel mot est de la même famille que « ${m} » ?`, aide: 'Les mots d\'une même famille se ressemblent ET ont un sens proche.' }, b, f); }
    if (t === 3) { const [m, b, f] = tPref(); return qcm({ visuel: '🧩', enonce: `Quel mot veut dire le contraire de « ${m} » ?`, aide: 'On peut ajouter un petit morceau au début du mot.' }, b, f); }
    if (t === 4) { const [m, b, f] = tSens(); return qcm({ visuel: '🧩', enonce: `Que veut dire le mot « ${m} » ?` }, b, f); }
    const [q, b, f] = tSuff();
    return qcm({ visuel: '🧩', enonce: q, dire: q, aide: 'On peut ajouter un petit morceau à la fin du mot.' }, b, f);
  };

  // ---------- Le dictionnaire
  const DICO = {
    b: ['balle', 'banane', 'bateau', 'biscuit', 'bonbon', 'bouteille', 'branche', 'brosse', 'bureau', 'baleine', 'bébé', 'bijou'],
    c: ['cabane', 'cadeau', 'camion', 'carotte', 'cerise', 'chaise', 'château', 'citron', 'cochon', 'crayon', 'canard', 'cuisine'],
    f: ['farine', 'fenêtre', 'fleur', 'fourmi', 'fraise', 'fromage', 'fusée', 'fête', 'forêt', 'flûte'],
    l: ['lapin', 'lampe', 'livre', 'loup', 'lune', 'lion', 'lait', 'légume', 'lézard', 'lit'],
    m: ['maison', 'manteau', 'marteau', 'melon', 'miroir', 'montagne', 'mouton', 'musique', 'moto', 'mardi', 'mouche'],
    p: ['panier', 'papillon', 'parapluie', 'pêche', 'piano', 'pirate', 'plage', 'pomme', 'poule', 'prince', 'pantalon'],
    s: ['sable', 'salade', 'sapin', 'serpent', 'singe', 'soleil', 'souris', 'stylo', 'sucre', 'sirop'],
    t: ['table', 'tambour', 'tapis', 'téléphone', 'tigre', 'tomate', 'tortue', 'train', 'trésor', 'tulipe']
  };
  const sansAccent = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const ordreAlpha = (a, b) => { const x = sansAccent(a), y = sansAccent(b); return x < y ? -1 : x > y ? 1 : 0; };
  const BASE = [
    ['chevaux', 'cheval', ['chevau', 'chevaux', 'chevals']], ['mangeons', 'manger', ['mangeon', 'mange', 'mangé']], ['belles', 'beau', ['belle', 'bel', 'belles']],
    ['finissent', 'finir', ['finisse', 'finissent', 'fini']], ['yeux', 'œil', ['yeu', 'yeux', 'yeuil']], ['allait', 'aller', ['allait', 'allai', 'va']],
    ['petites', 'petit', ['petite', 'petites', 'petits']], ['journaux', 'journal', ['journau', 'journaux', 'journals']], ['courons', 'courir', ['couron', 'courons', 'coure']],
    ['grandes', 'grand', ['grande', 'grandes', 'grands']], ['bijoux', 'bijou', ['bijoux', 'bijous', 'bijo']], ['chantaient', 'chanter', ['chantaient', 'chanta', 'chante']]
  ];
  const tireBase = tirage(BASE);
  const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
  const genDictionnaire = () => {
    const t = alea(0, 5), lettre = pioche(Object.keys(DICO)), liste = DICO[lettre];
    if (t <= 1) {
      const mots = melange(liste).slice(0, 4), tri = [...mots].sort(ordreAlpha), premier = Math.random() < .5;
      const bon = premier ? tri[0] : tri[3];
      return qcm({ visuel: '📖', enonce: `Quel mot vient en ${premier ? 'premier' : 'dernier'} dans le dictionnaire ?`, aide: 'La 1re lettre est la même : regarde la 2e, puis la 3e…' }, bon, mots);
    }
    if (t === 2) {
      const tri = [...liste].sort(ordreAlpha), i = alea(0, tri.length - 3), j = alea(i + 2, tri.length - 1), k = alea(i + 1, j - 1);
      const dehors = tri.filter((_, x) => x < i || x > j);
      return qcm({ visuel: '📖', enonce: `Sur une page du dictionnaire, les mots repères sont « ${tri[i]} » et « ${tri[j]} ». Quel mot peut-on trouver sur cette page ?`, aide: 'Le mot doit se ranger entre les deux mots repères.' }, tri[k], dehors.concat(melange(Object.keys(DICO).filter(l => l !== lettre)).slice(0, 3).map(l => pioche(DICO[l]))));
    }
    if (t === 3) {
      const mots = melange(liste).slice(0, 3), tri = [...mots].sort(ordreAlpha), ecr = a => a.join(' – ');
      const perms = [[0, 2, 1], [1, 0, 2], [2, 1, 0], [1, 2, 0], [2, 0, 1]].map(p => ecr(p.map(x => tri[x])));
      return qcm({ visuel: '🔤', enonce: `Quel est le bon ordre alphabétique ?`, dire: `Range dans l'ordre alphabétique : ${mots.join(', ')}.` }, ecr(tri), perms);
    }
    if (t === 4) {
      const i = alea(1, 24), apres = Math.random() < .5, bon = ALPHABET[apres ? i + 1 : i - 1];
      return qcm({ visuel: gros(ALPHABET[i].toUpperCase()), enonce: `Quelle lettre vient juste ${apres ? 'après' : 'avant'} « ${ALPHABET[i]} » dans l'alphabet ?` }, bon, [ALPHABET[apres ? i - 1 : i + 1], ALPHABET[i + 2], ALPHABET[i - 2], ALPHABET[i]].filter(Boolean));
    }
    const [m, b, f] = tireBase();
    return qcm({ visuel: '📖', enonce: `Pour trouver le mot « ${m} », quel mot faut-il chercher dans le dictionnaire ?`, aide: 'Le dictionnaire donne les noms au singulier, les adjectifs au masculin singulier et les verbes à l\'infinitif.' }, b, f);
  };

  // ---------- Compréhension de petits textes
  const TEXTES_CE2 = [
    { v: '🐶', t: 'Chaque soir, Sami sort son chien Caramel. Ils font le tour du parc. Caramel adore courir après les pigeons, mais il ne les attrape jamais.', qs: [
      ['Comment s\'appelle le chien ?', 'Caramel', ['Sami', 'Pigeon', 'Filou']],
      ['Que fait Caramel dans le parc ?', 'Il court après les pigeons.', ['Il dort sous un arbre.', 'Il mange les pigeons.', 'Il nage dans le lac.']]] },
    { v: '🎂', t: 'Aujourd\'hui, c\'est l\'anniversaire de Jade. Elle a huit ans. Ses amis lui offrent un livre sur les dinosaures. Jade est ravie : elle adore les animaux préhistoriques.', qs: [
      ['Quel âge a Jade ?', 'Huit ans', ['Sept ans', 'Neuf ans', 'Dix ans']],
      ['Pourquoi Jade est-elle ravie ?', 'Elle adore les dinosaures.', ['Elle n\'aime pas lire.', 'Elle a eu un chien.', 'Il n\'y a pas école.']]] },
    { v: '🌧️', t: 'Ce matin, il pleuvait très fort. Noé a mis ses bottes et son ciré jaune. En chemin, il a sauté dans toutes les flaques. En arrivant à l\'école, ses chaussettes étaient trempées !', qs: [
      ['Quel temps faisait-il ?', 'Il pleuvait.', ['Il neigeait.', 'Il faisait beau.', 'Il y avait du vent.']],
      ['Pourquoi les chaussettes de Noé étaient-elles trempées ?', 'Il a sauté dans les flaques.', ['Il est tombé dans la rivière.', 'Il a oublié ses bottes.', 'Il a pris une douche.']]] },
    { v: '🐌', t: 'L\'escargot sort surtout quand il pleut. Il porte sa coquille sur son dos : c\'est sa maison. Quand il a peur, il rentre dedans. Il avance lentement en laissant une trace brillante.', qs: [
      ['Quand l\'escargot sort-il surtout ?', 'Quand il pleut', ['Quand il fait très chaud', 'La nuit de Noël', 'Quand il neige']],
      ['Que fait l\'escargot quand il a peur ?', 'Il rentre dans sa coquille.', ['Il court très vite.', 'Il crie.', 'Il saute.']]] },
    { v: '🍎', t: 'Dans le verger de papi, il y a des pommiers et des poiriers. En septembre, Louna l\'aide à cueillir les fruits. Avec les pommes, mamie prépare une délicieuse compote.', qs: [
      ['En quel mois Louna cueille-t-elle les fruits ?', 'En septembre', ['En mars', 'En décembre', 'En juin']],
      ['Que prépare mamie avec les pommes ?', 'Une compote', ['Une soupe', 'Un jus d\'orange', 'Une tarte aux poires']]] },
    { v: '🚀', t: 'Thomas Pesquet est un astronaute français. Il a vécu plusieurs mois dans la Station spatiale internationale, qui tourne autour de la Terre. Là-haut, tout flotte, même l\'eau !', qs: [
      ['Quel est le métier de Thomas Pesquet ?', 'Astronaute', ['Pilote de course', 'Boulanger', 'Médecin']],
      ['Que se passe-t-il dans la Station spatiale ?', 'Tout flotte.', ['Tout tombe très vite.', 'Il neige.', 'Il fait nuit tout le temps.']]] },
    { v: '🏰', t: 'Au Moyen Âge, le seigneur habitait dans un château fort. Autour du château, il y avait un fossé rempli d\'eau. Pour entrer, il fallait passer sur le pont-levis.', qs: [
      ['Qui habitait dans le château fort ?', 'Le seigneur', ['Le roi des Gaulois', 'Le boulanger', 'Le président']],
      ['Qu\'y avait-il autour du château ?', 'Un fossé rempli d\'eau', ['Un parking', 'Une forêt de sapins', 'Une piscine']]] },
    { v: '🐝', t: 'Les abeilles vivent dans une ruche. Elles vont de fleur en fleur pour récolter le nectar. Avec ce nectar, elles fabriquent le miel. L\'apiculteur s\'occupe des ruches.', qs: [
      ['Où vivent les abeilles ?', 'Dans une ruche', ['Dans un nid', 'Dans un terrier', 'Dans une grotte']],
      ['Comment s\'appelle la personne qui s\'occupe des ruches ?', 'L\'apiculteur', ['Le jardinier', 'Le fermier', 'Le vétérinaire']]] },
    { v: '⚽', t: 'Samedi, l\'équipe de Yanis a joué contre l\'équipe de la ville voisine. À la mi-temps, elle perdait deux buts à zéro. Mais en deuxième mi-temps, Yanis a marqué trois buts ! Son équipe a gagné.', qs: [
      ['Qui a gagné le match ?', 'L\'équipe de Yanis', ['L\'équipe de la ville voisine', 'Personne', 'L\'arbitre']],
      ['Combien de buts Yanis a-t-il marqués ?', 'Trois', ['Deux', 'Un', 'Zéro']]] },
    { v: '🦔', t: 'Le hérisson est couvert de piquants. La nuit, il cherche des vers de terre, des limaces et des insectes. En hiver, il hiberne sous un tas de feuilles jusqu\'au printemps.', qs: [
      ['Quand le hérisson cherche-t-il sa nourriture ?', 'La nuit', ['Le matin', 'À midi', 'Seulement en hiver']],
      ['Que fait le hérisson en hiver ?', 'Il hiberne.', ['Il part en voyage.', 'Il change de couleur.', 'Il construit un nid dans un arbre.']]] },
    { v: '🎒', t: 'Lucie prépare son cartable pour demain. Elle y met sa trousse, son cahier de poésie et son livre de lecture. Elle oublie sa gourde sur la table de la cuisine.', qs: [
      ['Qu\'est-ce que Lucie a oublié ?', 'Sa gourde', ['Sa trousse', 'Son livre de lecture', 'Son cahier de poésie']],
      ['Pour quand Lucie prépare-t-elle son cartable ?', 'Pour demain', ['Pour les vacances', 'Pour hier', 'Pour ce soir']]] },
    { v: '🐧', t: 'Les manchots vivent là où il fait très froid. Ils ne savent pas voler, mais ce sont d\'excellents nageurs. Ils plongent dans l\'eau glacée pour attraper des poissons.', qs: [
      ['Que ne savent pas faire les manchots ?', 'Voler', ['Nager', 'Plonger', 'Marcher']],
      ['Que mangent les manchots ?', 'Des poissons', ['Des fruits', 'De l\'herbe', 'Des graines']]] },
    { v: '🚒', t: 'Mardi, la classe de CE2 a visité la caserne des pompiers. Le capitaine a montré le grand camion rouge et la longue échelle. Chaque élève a pu essayer un casque.', qs: [
      ['Qu\'a visité la classe ?', 'La caserne des pompiers', ['Un musée', 'Une ferme', 'L\'hôpital']],
      ['Qu\'a pu essayer chaque élève ?', 'Un casque', ['Le camion', 'Une échelle', 'Une lance à incendie']]] },
    { v: '🌻', t: 'Nour a planté une graine de tournesol dans un pot. Elle l\'arrose tous les deux jours et le met au soleil. Au bout de deux mois, la fleur est plus grande qu\'elle !', qs: [
      ['Qu\'a planté Nour ?', 'Une graine de tournesol', ['Un pommier', 'Une rose', 'Une carotte']],
      ['Combien de temps a-t-il fallu pour que la fleur soit plus grande que Nour ?', 'Deux mois', ['Deux jours', 'Deux ans', 'Une semaine']]] },
    { v: '🦊', t: 'Un corbeau tenait un fromage dans son bec. Un renard, attiré par l\'odeur, lui dit : « Que vous êtes joli ! Si votre chant est aussi beau que vos plumes, vous êtes le roi de la forêt. » Le corbeau ouvrit le bec pour chanter et laissa tomber le fromage.', qs: [
      ['Que voulait le renard ?', 'Le fromage', ['Écouter chanter le corbeau', 'Devenir roi', 'Les plumes du corbeau']],
      ['Pourquoi le corbeau a-t-il perdu son fromage ?', 'Il a ouvert le bec pour chanter.', ['Le renard a grimpé à l\'arbre.', 'Il l\'a mangé.', 'Le vent l\'a emporté.']]] },
    { v: '🏖️', t: 'Pendant les vacances, Ethan est allé chez sa tante, au bord de la mer. Le matin, il ramassait des coquillages. L\'après-midi, il se baignait avec ses cousins.', qs: [
      ['Où Ethan a-t-il passé ses vacances ?', 'Au bord de la mer', ['À la montagne', 'À la campagne', 'Chez lui']],
      ['Que faisait Ethan le matin ?', 'Il ramassait des coquillages.', ['Il se baignait.', 'Il dormait.', 'Il faisait du ski.']]] },
    { v: '🐢', t: 'Pépette est une tortue de terre. Elle vit dans le jardin de Clara. Elle mange de la salade et des pissenlits. Quand il fait froid, elle s\'enterre et dort jusqu\'au printemps.', qs: [
      ['Que mange Pépette ?', 'De la salade et des pissenlits', ['Des croquettes', 'Des poissons', 'Des insectes']],
      ['Qui est Pépette ?', 'Une tortue', ['Une poule', 'Un chat', 'Une souris']]] },
    { v: '🎨', t: 'Pour la fête des mères, Arthur a peint un tableau. Il a mélangé du bleu et du jaune pour faire un beau vert. Il a dessiné une maison entourée d\'arbres. Sa maman l\'a accroché dans le salon.', qs: [
      ['Quelles couleurs Arthur a-t-il mélangées ?', 'Du bleu et du jaune', ['Du rouge et du blanc', 'Du rouge et du jaune', 'Du noir et du blanc']],
      ['Où le tableau a-t-il été accroché ?', 'Dans le salon', ['Dans la classe', 'Dans la chambre d\'Arthur', 'Dans la cuisine']]] },
    { v: '🚲', t: 'Ce dimanche, Mia fait du vélo sans les petites roues pour la première fois. Son père la tient d\'abord par la selle, puis il la lâche. Mia roule toute seule jusqu\'au bout de l\'allée !', qs: [
      ['Qu\'est-ce que Mia fait pour la première fois ?', 'Du vélo sans petites roues', ['Du roller', 'Du cheval', 'De la trottinette']],
      ['Qui aide Mia ?', 'Son père', ['Sa mère', 'Son frère', 'Sa maîtresse']]] },
    { v: '❄️', t: 'Il a neigé toute la nuit. Au réveil, le jardin est tout blanc. Les enfants enfilent leurs gants et leurs bonnets. Ils construisent un bonhomme de neige avec une carotte pour le nez.', qs: [
      ['Avec quoi les enfants font-ils le nez du bonhomme ?', 'Une carotte', ['Un caillou', 'Une branche', 'Un bouton']],
      ['Pourquoi le jardin est-il blanc ?', 'Il a neigé toute la nuit.', ['On l\'a peint.', 'Il y a du brouillard.', 'Il y a des fleurs blanches.']]] }
  ];
  const Q_TEXTES = [];
  TEXTES_CE2.forEach(x => x.qs.forEach(q => Q_TEXTES.push([x, q])));
  const tireTexte = tirage(Q_TEXTES);
  const genComprehension = () => {
    const [x, [q, b, f]] = tireTexte();
    return qcm({ visuel: x.v, enonce: `<span style="font-weight:normal;display:block;text-align:left;margin-bottom:.6em">${x.t}</span><b>${q}</b>`, dire: x.t + ' ' + q }, b, f);
  };

  // ---------- Dictée de mots
  const DICTEE_CE2 = [
    ['aujourd\'hui', 'Aujourd\'hui, il fait beau.'], ['toujours', 'Mon chat dort toujours sur mon lit.'], ['maintenant', 'Tu peux sortir maintenant.'],
    ['beaucoup', 'Il y a beaucoup de fleurs.'], ['souvent', 'Je vais souvent au parc.'], ['demain', 'Demain, nous irons à la piscine.'],
    ['hier', 'Hier, il a plu.'], ['après', 'Après le repas, je lis.'], ['avant', 'Lave-toi les mains avant de manger.'], ['pendant', 'Il a dormi pendant le film.'],
    ['dehors', 'Les enfants jouent dehors.'], ['dedans', 'La boîte est vide, il n\'y a rien dedans.'], ['ensuite', 'Ensuite, nous rentrons.'], ['jamais', 'Je ne mens jamais.'],
    ['matin', 'Ce matin, je me suis levé tôt.'], ['soir', 'Le soir, je lis une histoire.'], ['semaine', 'Une semaine a sept jours.'], ['année', 'Bonne année !'],
    ['école', 'Je vais à l\'école.'], ['classe', 'Notre classe est grande.'], ['cahier', 'Ouvre ton cahier.'], ['crayon', 'Prends ton crayon.'], ['livre', 'Ce livre est passionnant.'],
    ['maison', 'Ma maison a un jardin.'], ['jardin', 'Papa arrose le jardin.'], ['fenêtre', 'Ferme la fenêtre.'], ['chambre', 'Range ta chambre.'], ['cuisine', 'Maman est dans la cuisine.'],
    ['famille', 'Toute la famille est là.'], ['enfant', 'Cet enfant a huit ans.'], ['garçon', 'Le garçon court vite.'], ['fille', 'La fille chante.'], ['frère', 'Mon frère a dix ans.'],
    ['sœur', 'Ma sœur est petite.', ['soeur']], ['oiseau', 'L\'oiseau chante.'], ['cheval', 'Le cheval galope.'], ['lapin', 'Le lapin mange une carotte.'], ['poisson', 'Le poisson nage.'],
    ['mouton', 'Le mouton a de la laine.'], ['grenouille', 'La grenouille saute.'], ['papillon', 'Le papillon vole.'], ['arbre', 'L\'arbre perd ses feuilles.'], ['fleur', 'Cette fleur est rouge.'],
    ['forêt', 'Le loup vit dans la forêt.'], ['montagne', 'La montagne est haute.'], ['rivière', 'La rivière coule.'], ['soleil', 'Le soleil brille.'], ['nuage', 'Un nuage cache le soleil.'],
    ['pluie', 'La pluie tombe.'], ['neige', 'La neige est froide.'], ['hiver', 'En hiver, il fait froid.'], ['été', 'En été, il fait chaud.'], ['printemps', 'Au printemps, les fleurs poussent.'],
    ['automne', 'En automne, les feuilles tombent.'], ['gâteau', 'Ce gâteau est délicieux.', ['gateau']], ['chocolat', 'J\'aime le chocolat.'], ['pomme', 'Je croque une pomme.'],
    ['fromage', 'La souris mange du fromage.'], ['voiture', 'La voiture est rouge.'], ['vélo', 'Je fais du vélo.'], ['train', 'Le train arrive en gare.'], ['avion', 'L\'avion décolle.'],
    ['content', 'Je suis content.'], ['petit', 'Mon chien est petit.'], ['grand', 'Ton frère est grand.'], ['gentil', 'Tu es gentil.'], ['rouge', 'La tomate est rouge.'],
    ['blanc', 'La neige est blanche, le lait est blanc.'], ['chanter', 'J\'aime chanter.'], ['jouer', 'Viens jouer avec moi !'], ['manger', 'C\'est l\'heure de manger.'], ['dormir', 'Le bébé va dormir.']
  ];
  const tireDictee = tirage(DICTEE_CE2);
  const genDictee = () => {
    const [mot, ex, acc] = tireDictee();
    const q = { type: 'saisie', visuel: '🎧', enonce: 'Écoute bien, puis écris le mot.', aide: 'Appuie sur 🔊 pour réécouter.', dire: `${mot}. ${ex} ${mot}.`, bonne: mot };
    if (acc) q.accepte = acc;
    return q;
  };

  ajouterMatiere('CE2', {
    id: 'francais', titre: 'Français', emoji: '✏️', couleur: '#e5484d', jeux: [
      { id: 'conjugaison', titre: 'Conjugaison', emoji: '⏳', gen: genConjugaison },
      { id: 'nature', titre: 'Nature des mots', emoji: '🏷️', gen: genNature },
      { id: 'sujet-verbe', titre: 'Sujet et verbe', emoji: '🎯', gen: genSujetVerbe },
      { id: 'accords', titre: 'Les accords', emoji: '✅', gen: genAccordsGN },
      { id: 'phrases', titre: 'Phrases et ponctuation', emoji: '❓', gen: genPhrases },
      { id: 'homophones', titre: 'a/à, et/est, son/sont…', emoji: '🔀', gen: genHomophones },
      { id: 'vocabulaire', titre: 'Vocabulaire', emoji: '📚', gen: genVocabulaire },
      { id: 'dictionnaire', titre: 'Le dictionnaire', emoji: '📖', gen: genDictionnaire },
      { id: 'comprehension', titre: 'Lire et comprendre', emoji: '🔍', gen: genComprehension },
      { id: 'dictee', titre: 'Dictée de mots', emoji: '🎧', gen: genDictee }
    ]
  });

  /* =====================================================================
     QUESTIONNER LE MONDE
     ===================================================================== */
  const ouiNon = (base, bonne) => ({ ...base, choix: ['oui', 'non'], bonne });

  // ---------- Plantes et chaînes alimentaires
  const CHAINES = [
    [['l\'herbe', '🌿'], ['le lapin', '🐰'], ['le renard', '🦊']],
    [['les feuilles', '🍃'], ['la chenille', '🐛'], ['la mésange', '🐦']],
    [['le blé', '🌾'], ['la souris', '🐭'], ['la chouette', '🦉']],
    [['la salade', '🥬'], ['l\'escargot', '🐌'], ['le hérisson', '🦔']],
    [['l\'herbe', '🌿'], ['la sauterelle', '🦗'], ['la grenouille', '🐸'], ['le serpent', '🐍']],
    [['les glands', '🌰'], ['l\'écureuil', '🐿️'], ['l\'aigle', '🦅']],
    [['l\'herbe', '🌿'], ['le zèbre', '🦓'], ['le lion', '🦁']],
    [['les algues', '🌱'], ['le petit poisson', '🐟'], ['le dauphin', '🐬']],
    [['les graines', '🌾'], ['le mulot', '🐭'], ['la buse', '🦅']]
  ];
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const PLANTES = [
    { q: 'De quoi une plante a-t-elle besoin pour vivre ?', v: '🌱', b: 'D\'eau, de lumière et d\'air', f: ['De sucre et de lait', 'Seulement de terre', 'De rien du tout'] },
    { q: 'Une plante reste longtemps dans le noir. Que se passe-t-il ?', v: '🌑', b: 'Elle jaunit et dépérit.', f: ['Elle pousse plus vite.', 'Elle devient bleue.', 'Rien du tout.'] },
    { q: 'Par quelle partie la plante puise-t-elle l\'eau dans le sol ?', v: '🌱', b: 'Les racines', f: ['Les fleurs', 'Les fruits', 'Les pétales'] },
    { q: 'Quelle partie de la plante la tient droite et transporte la sève ?', v: '🌿', b: 'La tige', f: ['La racine', 'La graine', 'Le pétale'] },
    { q: 'Où se trouvent les graines d\'une pomme ?', v: '🍎', b: 'Dans le fruit', f: ['Dans les racines', 'Dans la tige', 'Dans les feuilles'] },
    { q: 'Comment appelle-t-on le moment où une graine commence à pousser ?', v: '🌰', b: 'La germination', f: ['La floraison', 'La récolte', 'La fusion'] },
    { q: 'Quel insecte transporte le pollen de fleur en fleur ?', v: '🌼', b: 'L\'abeille', f: ['La fourmi', 'Le moustique', 'La puce'] },
    { q: 'Après avoir été pollinisée, la fleur se transforme en…', v: '🌸', b: 'fruit', f: ['racine', 'feuille', 'tige'] },
    { q: 'Dans une chaîne alimentaire, que veut dire la flèche → ?', v: '➡️', b: '« est mangé par »', f: ['« mange »', '« est plus grand que »', '« habite avec »'] },
    { q: 'Par quoi commence presque toujours une chaîne alimentaire ?', v: '🔗', b: 'Par un végétal', f: ['Par un carnivore', 'Par un oiseau', 'Par un poisson'] },
    { q: 'Qui transforme les feuilles mortes en terre ?', v: '🍂', b: 'Les vers de terre et les champignons', f: ['Les oiseaux', 'Les lapins', 'Les poissons'] },
    { q: 'Quel est le bon ordre de vie d\'une plante à fleurs ?', v: '🌻', b: 'graine → plantule → plante → fleur → fruit', f: ['fleur → graine → racine → fruit', 'fruit → fleur → graine → plante', 'plante → fruit → graine → fleur'] },
    { q: 'Pourquoi les feuilles des plantes sont-elles importantes ?', v: '🍃', b: 'Elles fabriquent la nourriture de la plante avec la lumière.', f: ['Elles servent à boire.', 'Elles servent à marcher.', 'Elles ne servent à rien.'] },
    { q: 'Quel être vivant est un végétal ?', v: '🔍', b: 'Le chêne', f: ['Le champignon de Paris', 'Le ver de terre', 'L\'escargot'] },
    { q: 'Comment appelle-t-on les animaux qui mangent seulement des plantes ?', v: '🐄', b: 'Les herbivores', f: ['Les carnivores', 'Les omnivores', 'Les insectivores'] },
    { q: 'Une plante verte a-t-elle besoin de manger des animaux ?', v: '🌿', b: 'Non, elle fabrique sa nourriture.', f: ['Oui, des insectes chaque jour.', 'Oui, de la viande.', 'Oui, des graines de tournesol.'] }
  ];
  const quizPlantes = quiz(PLANTES);
  const genVivant = () => {
    if (Math.random() < .45) return quizPlantes();
    const ch = pioche(CHAINES), n = ch.length, noms = ch.map(x => x[0]);
    const vis = `<div>${ch.map(x => x[1]).join(' → ')}</div><div style="font-size:.28em;font-weight:normal">${noms.join(' → ')}</div>`;
    const autres = ['le loup', 'la vache', 'le requin', 'l\'ours', 'la poule'].filter(x => !noms.includes(x));
    const t = alea(0, 3);
    if (t === 0) { const i = alea(0, n - 2); return qcm({ visuel: vis, enonce: `Dans cette chaîne alimentaire, qui mange ${noms[i]} ?`, aide: 'La flèche veut dire « est mangé par ».' }, cap(noms[i + 1]), noms.filter((_, j) => j !== i + 1).map(cap)); }
    if (t === 1) { const i = alea(1, n - 1); return qcm({ visuel: vis, enonce: `Dans cette chaîne alimentaire, que mange ${noms[i]} ?`, aide: 'La flèche veut dire « est mangé par ».' }, cap(noms[i - 1]), noms.filter((_, j) => j !== i - 1).map(cap)); }
    if (t === 2) return qcm({ visuel: vis, enonce: 'Dans cette chaîne alimentaire, lequel est un végétal ?' }, cap(noms[0]), noms.slice(1).concat(autres).map(cap));
    return qcm({ visuel: vis, enonce: 'Dans cette chaîne alimentaire, qui n\'est mangé par personne ?' }, cap(noms[n - 1]), noms.slice(0, -1).map(cap));
  };

  // ---------- Les animaux
  const ANIMAUX = [
    ['le chat', '🐱', 'mammifère'], ['le dauphin', '🐬', 'mammifère'], ['la baleine', '🐋', 'mammifère'], ['la chauve-souris', '🦇', 'mammifère'],
    ['le cheval', '🐴', 'mammifère'], ['la vache', '🐄', 'mammifère'], ['le lapin', '🐰', 'mammifère'], ['l\'éléphant', '🐘', 'mammifère'],
    ['l\'aigle', '🦅', 'oiseau'], ['le manchot', '🐧', 'oiseau'], ['la poule', '🐔', 'oiseau'], ['le hibou', '🦉', 'oiseau'], ['le canard', '🦆', 'oiseau'],
    ['le requin', '🦈', 'poisson'], ['le poisson-clown', '🐠', 'poisson'], ['la truite', '🐟', 'poisson'],
    ['la grenouille', '🐸', 'amphibien'], ['le crocodile', '🐊', 'reptile'], ['le serpent', '🐍', 'reptile'], ['la tortue', '🐢', 'reptile'], ['le lézard', '🦎', 'reptile'],
    ['l\'escargot', '🐌', 'invertébré'], ['la fourmi', '🐜', 'invertébré'], ['l\'araignée', '🕷️', 'invertébré'], ['le ver de terre', '🪱', 'invertébré'],
    ['la coccinelle', '🐞', 'invertébré'], ['la pieuvre', '🐙', 'invertébré'], ['le papillon', '🦋', 'invertébré']
  ];
  const GROUPES_V = ['mammifère', 'oiseau', 'poisson', 'reptile', 'amphibien'];
  const COUVERTURE = { mammifère: 'des poils', oiseau: 'des plumes', poisson: 'des écailles', reptile: 'des écailles', amphibien: 'une peau nue et humide' };
  const REGIMES = [
    ['la vache', '🐄', 'herbivore'], ['le lapin', '🐰', 'herbivore'], ['le cheval', '🐴', 'herbivore'], ['la girafe', '🦒', 'herbivore'], ['le zèbre', '🦓', 'herbivore'], ['le mouton', '🐑', 'herbivore'],
    ['le lion', '🦁', 'carnivore'], ['le tigre', '🐯', 'carnivore'], ['le loup', '🐺', 'carnivore'], ['le requin', '🦈', 'carnivore'], ['l\'aigle', '🦅', 'carnivore'], ['le crocodile', '🐊', 'carnivore'],
    ['l\'ours brun', '🐻', 'omnivore'], ['le cochon', '🐷', 'omnivore'], ['le sanglier', '🐗', 'omnivore'], ['la poule', '🐔', 'omnivore'], ['l\'être humain', '🧑', 'omnivore']
  ];
  const CYCLES = [
    ['la grenouille', ['l\'œuf', 'le têtard', 'la grenouille']], ['le papillon', ['l\'œuf', 'la chenille', 'la chrysalide', 'le papillon']],
    ['la poule', ['l\'œuf', 'le poussin', 'la poule']], ['la coccinelle', ['l\'œuf', 'la larve', 'la nymphe', 'la coccinelle']], ['l\'humain', ['le bébé', 'l\'enfant', 'l\'adolescent', 'l\'adulte']]
  ];
  const QUIZ_ANIMAUX = [
    { q: 'Comment s\'appelle un animal qui a une colonne vertébrale ?', v: '🦴', b: 'Un vertébré', f: ['Un invertébré', 'Un insecte', 'Un végétal'] },
    { q: 'Combien de pattes a un insecte ?', v: '🐜', b: '6', f: ['4', '8', '10'] },
    { q: 'Combien de pattes a une araignée ?', v: '🕷️', b: '8', f: ['6', '4', '10'] },
    { q: 'Comment naissent les petits des mammifères, comme le chaton ?', v: '🐱', b: 'Ils sortent du ventre de leur mère.', f: ['Ils sortent d\'un œuf.', 'Ils sortent d\'une graine.', 'Ils sortent d\'une chrysalide.'] },
    { q: 'Avec quoi les mammifères nourrissent-ils leurs petits ?', v: '🍼', b: 'Avec du lait', f: ['Avec des graines', 'Avec du nectar', 'Avec des insectes'] },
    { q: 'Un animal qui pond des œufs est…', v: '🥚', b: 'ovipare', f: ['vivipare', 'herbivore', 'mammifère'] },
    { q: 'Quel animal change complètement de forme en grandissant ?', v: '🐛', b: 'Le papillon', f: ['Le chien', 'Le cheval', 'Le chat'] },
    { q: 'La baleine est un mammifère. Comment respire-t-elle ?', v: '🐋', b: 'Elle remonte respirer de l\'air à la surface.', f: ['Avec des branchies, sous l\'eau', 'Elle ne respire jamais', 'Par sa queue'] },
    { q: 'Avec quoi les poissons respirent-ils dans l\'eau ?', v: '🐟', b: 'Avec des branchies', f: ['Avec des poumons', 'Avec leurs nageoires', 'Avec leur queue'] },
    { q: 'Comment appelle-t-on le petit de la grenouille ?', v: '🐸', b: 'Le têtard', f: ['La chenille', 'Le poussin', 'Le faon'] }
  ];
  const quizAnimaux = quiz(QUIZ_ANIMAUX);
  const genAnimaux = () => {
    const t = alea(0, 5);
    if (t === 0) {
      const [nom, e, g] = pioche(ANIMAUX.filter(a => a[2] !== 'invertébré'));
      return qcm({ visuel: e, enonce: `À quel groupe d'animaux appartient ${nom} ?` }, g, GROUPES_V);
    }
    if (t === 1) {
      const [nom, e, g] = pioche(ANIMAUX);
      return { visuel: e, enonce: `${cap(nom)} a-t-${/^(la|l')/.test(nom) && !/^l'(aigle|escargot|éléphant)/.test(nom) ? 'elle' : 'il'} un squelette avec une colonne vertébrale ?`, choix: ['oui, c\'est un vertébré', 'non, c\'est un invertébré'], bonne: g === 'invertébré' ? 'non, c\'est un invertébré' : 'oui, c\'est un vertébré' };
    }
    if (t === 2) {
      const [nom, e, g] = pioche(ANIMAUX.filter(a => a[2] !== 'invertébré' && !/dauphin|baleine|chauve|éléphant/.test(a[0])));
      return qcm({ visuel: e, enonce: `Qu'est-ce qui recouvre le corps ${nom.replace(/^le /, 'du ').replace(/^la /, 'de la ').replace(/^l'/, 'de l\'')} ?` }, COUVERTURE[g], ['des poils', 'des plumes', 'des écailles', 'une peau nue et humide']);
    }
    if (t === 3) {
      const [nom, e, r] = pioche(REGIMES);
      return qcm({ visuel: e, enonce: `${cap(nom)} est…`, dire: `Que mange ${nom} ? Est-ce un herbivore, un carnivore ou un omnivore ?`, aide: 'Herbivore : des plantes. Carnivore : de la viande. Omnivore : un peu de tout.' }, r, ['herbivore', 'carnivore', 'omnivore']);
    }
    if (t === 4) {
      const [nom, et] = pioche(CYCLES), i = alea(0, et.length - 2);
      return qcm({ visuel: '🔄', enonce: `Dans la vie ${nom.replace(/^le /, 'du ').replace(/^la /, 'de la ').replace(/^l'/, 'de l\'')}, quelle étape vient juste après ${et[i]} ?` }, cap(et[i + 1]), et.filter((_, j) => j !== i + 1).concat(['la graine', 'le nid']).map(cap));
    }
    return quizAnimaux();
  };

  // ---------- L'eau et la matière
  const ETATS = [
    ['un glaçon', '🧊', 'solide'], ['la vapeur qui sort de la casserole', '♨️', 'gaz'], ['le lait', '🥛', 'liquide'], ['une pierre', '🪨', 'solide'],
    ['l\'air d\'un ballon', '🎈', 'gaz'], ['le jus d\'orange', '🧃', 'liquide'], ['une bûche de bois', '🪵', 'solide'], ['l\'huile', '🫒', 'liquide'],
    ['la neige', '❄️', 'solide'], ['l\'eau de la rivière', '🏞️', 'liquide'], ['une cuillère', '🥄', 'solide'], ['le jus de citron', '🍋', 'liquide'],
    ['le sable', '⏳', 'solide'], ['l\'eau de la mer', '🌊', 'liquide'], ['une clé', '🔑', 'solide'], ['l\'air que l\'on respire', '🌬️', 'gaz']
  ];
  const CHANGEMENTS = [
    ['Le beurre fond dans la poêle.', 'la fusion'], ['L\'eau gèle dans le congélateur.', 'la solidification'], ['Le linge mouillé sèche au soleil.', 'l\'évaporation'],
    ['De la buée se forme sur le miroir de la salle de bain.', 'la condensation'], ['La neige fond au printemps.', 'la fusion'], ['Une flaque d\'eau disparaît au soleil.', 'l\'évaporation'],
    ['Le chocolat fondu durcit en refroidissant.', 'la solidification'], ['Des gouttes apparaissent sur une bouteille froide sortie du frigo.', 'la condensation'],
    ['Un glaçon oublié sur la table devient de l\'eau.', 'la fusion'], ['L\'eau de la mare gèle en hiver.', 'la solidification'], ['Le matin, de la rosée apparaît sur l\'herbe.', 'la condensation'],
    ['La casserole d\'eau bout et l\'eau diminue.', 'l\'évaporation']
  ];
  const DISSOUS = [['du sucre', 'oui'], ['du sel', 'oui'], ['du sable', 'non'], ['de l\'huile', 'non'], ['un morceau de sucre', 'oui'], ['du poivre', 'non'],
    ['des cailloux', 'non'], ['de la farine', 'non'], ['une pincée de gros sel', 'oui'], ['de la terre', 'non']];
  const QUIZ_MATIERE = [
    { q: 'À quelle température l\'eau pure gèle-t-elle ?', v: '🧊', b: '0 °C', f: ['10 °C', '50 °C', '100 °C'] },
    { q: 'À quelle température l\'eau pure bout-elle ?', v: '♨️', b: '100 °C', f: ['0 °C', '37 °C', '50 °C'] },
    { q: 'Avec quel instrument mesure-t-on la température ?', v: '🌡️', b: 'Un thermomètre', f: ['Une balance', 'Une règle', 'Un chronomètre'] },
    { q: 'Quel état de l\'eau a une forme bien à lui, qu\'on peut tenir dans la main ?', v: '✋', b: 'L\'état solide', f: ['L\'état liquide', 'L\'état gazeux', 'Aucun'] },
    { q: 'On verse de l\'eau d\'un verre dans une assiette. Que se passe-t-il ?', v: '🥛', b: 'Elle prend la forme de l\'assiette.', f: ['Elle garde la forme du verre.', 'Elle devient solide.', 'Elle disparaît.'] },
    { q: 'La surface de l\'eau dans un verre posé sur la table est…', v: '🥤', b: 'plate et horizontale', f: ['penchée', 'bosselée', 'verticale'] },
    { q: 'On met un glaçon de 10 g dans un verre. Quand il a fondu, combien pèse l\'eau ?', v: '⚖️', b: '10 g', f: ['0 g', '5 g', '20 g'] },
    { q: 'Comment séparer du sable mélangé à de l\'eau ?', v: '⏳', b: 'En filtrant', f: ['En secouant', 'En ajoutant du sel', 'En soufflant'] },
    { q: 'Comment récupérer le sel dissous dans l\'eau de mer ?', v: '🌊', b: 'En laissant l\'eau s\'évaporer', f: ['En filtrant', 'En la mettant au congélateur', 'En la secouant'] },
    { q: 'Un ballon gonflé est-il plus lourd qu\'un ballon dégonflé ?', v: '🎈', b: 'Oui, car l\'air a une masse.', f: ['Non, l\'air ne pèse rien.', 'Non, il est plus léger.', 'Ça dépend de la couleur.'] },
    { q: 'D\'où vient la pluie ?', v: '🌧️', b: 'Des nuages, formés de minuscules gouttes d\'eau', f: ['Du Soleil', 'Des arbres', 'Des montagnes'] },
    { q: 'L\'eau des mers chauffée par le Soleil s\'évapore, forme des nuages, puis retombe en pluie. C\'est…', v: '🔄', b: 'le cycle de l\'eau', f: ['le cycle de la Lune', 'une chaîne alimentaire', 'le cycle des saisons'] }
  ];
  const quizMatiere = quiz(QUIZ_MATIERE);
  const genMatiere = () => {
    const t = alea(0, 4);
    if (t <= 1) { const [nom, e, et] = pioche(ETATS); return qcm({ visuel: e, enonce: `Dans quel état est ${nom} ?`, aide: 'Solide : il garde sa forme. Liquide : il coule. Gaz : on ne peut pas le saisir.' }, et, ['solide', 'liquide', 'gaz']); }
    if (t === 2) { const [p, b] = pioche(CHANGEMENTS); return qcm({ visuel: '🔄', enonce: `Quel changement d'état est-ce ?<br>${phrase(p)}` }, b, ['la fusion', 'la solidification', 'l\'évaporation', 'la condensation']); }
    if (t === 3) {
      const [m, b] = pioche(DISSOUS);
      return { visuel: '🥄💧', enonce: `On met ${m} dans un verre d'eau et on mélange bien. Est-ce que ça se dissout (on ne le voit plus) ?`, choix: ['oui', 'non'], bonne: b };
    }
    return quizMatiere();
  };

  // ---------- Électricité et aimants
  const circuit = (inter, coupe) => {
    const L = 'stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"';
    let s = '';
    // Fils : haut (avec ampoule au milieu), gauche (avec pile), bas, droite (avec interrupteur).
    s += `<path d="M15 45 L15 20 L43 20 M57 20 L85 20 L85 45" ${L}/>`;
    s += `<path d="M15 60 L15 85 ${coupe ? 'L40 85 M52 85' : ''} L85 85 L85 ${inter === 'aucun' ? 45 : 60}" ${L}/>`;
    if (inter === 'aucun') s += `<line x1="85" y1="45" x2="85" y2="60" ${L}/>`;
    // Pile (grand trait fin +, petit trait épais −)
    s += `<line x1="5" y1="48" x2="25" y2="48" stroke="currentColor" stroke-width="2"/><line x1="10" y1="57" x2="20" y2="57" stroke="currentColor" stroke-width="5"/>`;
    s += `<path d="M15 45 L15 48 M15 57 L15 60" ${L}/>` + texte(29, 50, '+', 'start', 9);
    // Ampoule
    s += `<circle cx="50" cy="20" r="7" fill="rgba(255,255,255,.15)" stroke="currentColor" stroke-width="2"/><path d="M45 15 L55 25 M55 15 L45 25" stroke="currentColor" stroke-width="1.5"/>`;
    // Interrupteur
    if (inter !== 'aucun') {
      s += `<circle cx="85" cy="45" r="1.8" fill="currentColor"/><circle cx="85" cy="60" r="1.8" fill="currentColor"/>`;
      s += inter === 'ferme' ? `<line x1="85" y1="60" x2="85" y2="45" ${L}/>` : `<line x1="85" y1="60" x2="95" y2="47" ${L}/>`;
    }
    if (coupe) s += `<path d="M40 85 L42 82 M52 85 L50 88" stroke="${ROUGE}" stroke-width="2"/>`;
    return svg(s, 180);
  };
  const CONDUCTEURS = [['une clé en fer', 'oui'], ['une règle en plastique', 'non'], ['une cuillère en bois', 'non'], ['une cuillère en métal', 'oui'], ['une gomme', 'non'],
    ['une pièce de monnaie', 'oui'], ['du papier aluminium', 'oui'], ['un verre', 'non'], ['un bouchon en liège', 'non'], ['un trombone en métal', 'oui'],
    ['une feuille de papier', 'non'], ['un élastique', 'non'], ['une tige de cuivre', 'oui']];
  const AIMANT = [['un clou en fer', 'oui'], ['une bille en verre', 'non'], ['un trombone en acier', 'oui'], ['une règle en plastique', 'non'], ['une canette en aluminium', 'non'],
    ['un cube en bois', 'non'], ['une vis en fer', 'oui'], ['une gomme', 'non'], ['une épingle en acier', 'oui'], ['une feuille de papier', 'non'], ['une bague en or', 'non'], ['une casserole en fonte', 'oui']];
  const SECURITE = [
    { q: 'Peut-on jouer avec une prise électrique de la maison ?', v: '🔌', b: 'Non, c\'est très dangereux.', f: ['Oui, si on fait attention.', 'Oui, avec un doigt mouillé.', 'Oui, avec une fourchette.'] },
    { q: 'Pourquoi peut-on faire des expériences avec une pile, en classe ?', v: '🔋', b: 'Une petite pile n\'est pas dangereuse.', f: ['Parce qu\'elle est en plastique.', 'Parce qu\'elle est lourde.', 'Parce qu\'elle est chaude.'] },
    { q: 'Que faut-il faire avec un appareil électrique près de l\'eau (bain, lavabo) ?', v: '🛁', b: 'Ne jamais l\'utiliser : c\'est dangereux.', f: ['Le mettre dans le bain.', 'L\'arroser.', 'Le toucher avec les mains mouillées.'] },
    { q: 'Un fil électrique est abîmé. Que fais-tu ?', v: '⚠️', b: 'Je n\'y touche pas et je préviens un adulte.', f: ['Je le répare seul.', 'Je le coupe avec des ciseaux.', 'Je le mets dans ma bouche.'] },
    { q: 'Que doit-il y avoir pour qu\'une ampoule s\'allume ?', v: '💡', b: 'Un circuit fermé avec une pile', f: ['Un circuit ouvert', 'Seulement une ampoule', 'Un aimant'] },
    { q: 'Un matériau qui laisse passer le courant électrique est…', v: '⚡', b: 'un conducteur', f: ['un isolant', 'un aimant', 'une pile'] },
    { q: 'Un matériau qui ne laisse pas passer le courant, comme le plastique, est…', v: '🧤', b: 'un isolant', f: ['un conducteur', 'un aimant', 'une ampoule'] },
    { q: 'Où voit-on ce panneau jaune avec un éclair ⚡ ?', v: '⚠️', b: 'Là où il y a un danger électrique', f: ['À l\'entrée d\'une piscine', 'Devant une école', 'Sur les paquets de gâteaux'] },
    { q: 'Que fait l\'interrupteur dans un circuit ?', v: '🔘', b: 'Il ouvre ou ferme le circuit.', f: ['Il fabrique l\'électricité.', 'Il donne de la lumière.', 'Il attire le fer.'] },
    { q: 'Deux aimants se repoussent. Que faut-il faire pour qu\'ils s\'attirent ?', v: '🧲', b: 'Retourner un des deux aimants', f: ['Les mouiller', 'Les chauffer', 'Crier très fort'] }
  ];
  const quizSecu = quiz(SECURITE);
  const genElectricite = () => {
    const t = alea(0, 4);
    if (t <= 1) {
      const inter = pioche(['aucun', 'ouvert', 'ferme', 'ferme']), coupe = Math.random() < .3;
      return ouiNon({ visuel: circuit(inter, coupe), enonce: 'L\'ampoule s\'allume-t-elle ?', dire: 'Regarde bien le circuit. L\'ampoule s\'allume-t-elle ?', aide: 'Suis le fil avec ton doigt : fait-il le tour sans s\'arrêter ?' }, inter !== 'ouvert' && !coupe ? 'oui' : 'non');
    }
    if (t === 2) { const [o, b] = pioche(CONDUCTEURS); return ouiNon({ visuel: '💡', enonce: `On met ${o} dans un circuit à la place d'un fil. L'ampoule s'allume-t-elle ?` }, b); }
    if (t === 3) { const [o, b] = pioche(AIMANT); return ouiNon({ visuel: '🧲', enonce: `Un aimant attire-t-il ${o} ?` }, b); }
    return quizSecu();
  };

  // ---------- Mon corps et ma santé
  const CORPS = [
    { q: 'Comment s\'appelle l\'ensemble des os du corps ?', v: '🦴', b: 'Le squelette', f: ['Les muscles', 'La peau', 'Le cerveau'] },
    { q: 'À quoi sert le squelette ?', v: '🦴', b: 'À soutenir le corps et protéger les organes', f: ['À digérer les aliments', 'À voir et à entendre', 'À respirer'] },
    { q: 'Quel os protège le cerveau ?', v: '🧠', b: 'Le crâne', f: ['Le fémur', 'La colonne vertébrale', 'Les côtes'] },
    { q: 'Quels os protègent le cœur et les poumons ?', v: '🫁', b: 'Les côtes', f: ['Le crâne', 'Les phalanges', 'Le fémur'] },
    { q: 'Comment s\'appelle l\'endroit où deux os se rejoignent et bougent, comme le genou ?', v: '🦵', b: 'Une articulation', f: ['Un muscle', 'Un organe', 'Un tendon'] },
    { q: 'Laquelle de ces parties du corps est une articulation ?', v: '🦾', b: 'Le coude', f: ['Le mollet', 'L\'estomac', 'Le front'] },
    { q: 'Qu\'est-ce qui fait bouger les os ?', v: '💪', b: 'Les muscles', f: ['Les dents', 'Les cheveux', 'Les ongles'] },
    { q: 'Quand tu plies le bras, que fait le muscle de devant (le biceps) ?', v: '💪', b: 'Il se contracte : il devient dur et gonflé.', f: ['Il disparaît.', 'Il devient tout mou.', 'Il se casse.'] },
    { q: 'Combien de dents de lait un enfant a-t-il ?', v: '🦷', b: '20', f: ['10', '32', '50'] },
    { q: 'Combien de dents a un adulte, en général ?', v: '🦷', b: '32', f: ['20', '12', '100'] },
    { q: 'Quelles dents coupent les aliments, à l\'avant de la bouche ?', v: '🦷', b: 'Les incisives', f: ['Les molaires', 'Les canines', 'Les dents de sagesse'] },
    { q: 'Quelles dents pointues déchirent les aliments ?', v: '🦷', b: 'Les canines', f: ['Les incisives', 'Les molaires', 'Les gencives'] },
    { q: 'Quelles dents, au fond de la bouche, écrasent les aliments ?', v: '🦷', b: 'Les molaires', f: ['Les canines', 'Les incisives', 'Les lèvres'] },
    { q: 'Qu\'est-ce qui abîme le plus les dents ?', v: '🍭', b: 'Les sucreries, sans se brosser les dents', f: ['Les légumes', 'L\'eau', 'Le lait'] },
    { q: 'Combien de fois par jour faut-il se brosser les dents ?', v: '🪥', b: 'Au moins 2 fois, pendant 2 minutes', f: ['Une fois par semaine', 'Jamais', 'Une fois par mois'] },
    { q: 'Combien d\'heures un enfant de 8 ans doit-il dormir par nuit ?', v: '😴', b: 'Environ 10 heures', f: ['Environ 3 heures', 'Environ 5 heures', 'Environ 20 heures'] },
    { q: 'Que se passe-t-il si on ne dort pas assez ?', v: '🥱', b: 'On est fatigué et on apprend moins bien.', f: ['On grandit plus vite.', 'On devient plus fort.', 'Il ne se passe rien.'] },
    { q: 'Quelle boisson faut-il boire le plus souvent ?', v: '🚰', b: 'De l\'eau', f: ['Du soda', 'Du sirop', 'Du jus sucré'] },
    { q: 'Combien de fruits et légumes conseille-t-on de manger chaque jour ?', v: '🥕', b: 'Au moins 5', f: ['Aucun', 'Un seul par semaine', 'Seulement des frites'] },
    { q: 'Pourquoi faire du sport régulièrement ?', v: '🏃', b: 'Pour garder un corps en bonne santé', f: ['Pour avoir mal partout', 'Pour ne plus manger', 'Pour dormir moins'] },
    { q: 'Quand tu cours, ton cœur bat…', v: '❤️', b: 'plus vite', f: ['plus lentement', 'pareil', 'plus du tout'] },
    { q: 'Quand faut-il se laver les mains ?', v: '🧼', b: 'Avant de manger et après être allé aux toilettes', f: ['Seulement le dimanche', 'Jamais', 'Seulement quand elles sont noires'] },
    { q: 'Pourquoi le petit-déjeuner est-il important ?', v: '🥣', b: 'Il donne de l\'énergie pour la matinée.', f: ['Il fait dormir.', 'Il ne sert à rien.', 'Il remplace le déjeuner.'] },
    { q: 'Passer des heures devant les écrans avant de dormir…', v: '📱', b: 'empêche de bien dormir', f: ['aide à s\'endormir', 'fait grandir', 'rend plus fort'] },
    { q: 'Quel organe pompe le sang dans tout le corps ?', v: '❤️', b: 'Le cœur', f: ['Les poumons', 'L\'estomac', 'Le cerveau'] },
    { q: 'Avec quels organes respire-t-on ?', v: '🫁', b: 'Les poumons', f: ['Le cœur', 'L\'estomac', 'Les reins'] }
  ];
  const FAMILLES_ALIM = [
    ['la pomme', '🍎', 'fruits et légumes'], ['la carotte', '🥕', 'fruits et légumes'], ['le brocoli', '🥦', 'fruits et légumes'], ['la banane', '🍌', 'fruits et légumes'],
    ['le pain', '🍞', 'féculents'], ['les pâtes', '🍝', 'féculents'], ['le riz', '🍚', 'féculents'], ['les pommes de terre', '🥔', 'féculents'],
    ['le lait', '🥛', 'produits laitiers'], ['le fromage', '🧀', 'produits laitiers'], ['le yaourt', '🥣', 'produits laitiers'],
    ['le poisson', '🐟', 'viande, poisson, œufs'], ['l\'œuf', '🥚', 'viande, poisson, œufs'], ['le poulet', '🍗', 'viande, poisson, œufs'], ['le steak', '🥩', 'viande, poisson, œufs'],
    ['les bonbons', '🍬', 'produits sucrés'], ['le gâteau', '🍰', 'produits sucrés'], ['le chocolat', '🍫', 'produits sucrés']
  ];
  const quizCorps = quiz(CORPS);
  const genCorps = () => {
    if (Math.random() < .3) {
      const [nom, e, fam] = pioche(FAMILLES_ALIM);
      return qcm({ visuel: e, enonce: `Dans quelle famille d'aliments range-t-on ${nom} ?` }, fam, ['fruits et légumes', 'féculents', 'produits laitiers', 'viande, poisson, œufs', 'produits sucrés']);
    }
    return quizCorps();
  };

  // ---------- Le temps et l'histoire
  const romain = n => { const v = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; let s = ''; for (const [k, r] of v) while (n >= k) { s += r; n -= k; } return s; };
  const siecle = n => `${romain(n)}${n === 1 ? 'er' : 'e'} siècle`;
  const PERIODES = ['la Préhistoire', 'l\'Antiquité', 'le Moyen Âge', 'les Temps modernes', 'l\'époque contemporaine'];
  const EVENEMENTS = [
    ['Des hommes peignent des animaux dans la grotte de Lascaux.', 'la Préhistoire', '🦬'], ['Les hommes taillent des outils en silex.', 'la Préhistoire', '🪨'],
    ['Les Gaulois et les Romains se font la guerre.', 'l\'Antiquité', '⚔️'], ['Les Romains construisent le pont du Gard.', 'l\'Antiquité', '🌉'],
    ['Les chevaliers vivent dans des châteaux forts.', 'le Moyen Âge', '🏰'], ['Jeanne d\'Arc combat les Anglais.', 'le Moyen Âge', '🛡️'],
    ['Christophe Colomb arrive en Amérique (1492).', 'les Temps modernes', '⛵'], ['Louis XIV fait agrandir le château de Versailles.', 'les Temps modernes', '👑'],
    ['On invente l\'avion et la voiture.', 'l\'époque contemporaine', '✈️'], ['Les premiers hommes marchent sur la Lune (1969).', 'l\'époque contemporaine', '🚀']
  ];
  const HISTOIRE_CE2 = [
    { q: 'Combien d\'années y a-t-il dans un siècle ?', v: '💯', b: '100', f: ['10', '1 000', '12'] },
    { q: 'Comment appelle-t-on une période de 1 000 ans ?', v: '⏳', b: 'Un millénaire', f: ['Un siècle', 'Une décennie', 'Une année'] },
    { q: 'Dans quel siècle vivons-nous aujourd\'hui ?', v: '📅', b: 'Le XXIe siècle', f: ['Le XXe siècle', 'Le XIXe siècle', 'Le Ier siècle'] },
    { q: 'Sur une frise chronologique, où place-t-on les événements les plus anciens ?', v: '↔️', b: 'À gauche', f: ['À droite', 'En haut', 'Au milieu'] },
    { q: 'Quelle invention marque la fin de la Préhistoire ?', v: '✍️', b: 'L\'écriture', f: ['Le feu', 'La roue', 'L\'électricité'] },
    { q: 'Comment appelle-t-on les chasseurs-cueilleurs qui se déplaçaient sans cesse ?', v: '🏕️', b: 'Des nomades', f: ['Des sédentaires', 'Des chevaliers', 'Des seigneurs'] },
    { q: 'Autrefois, sans électricité, avec quoi s\'éclairait-on ?', v: '🕯️', b: 'Des bougies et des lampes à huile', f: ['Des ampoules', 'Des écrans', 'Des lampes de poche'] },
    { q: 'Autrefois, où allait-on laver le linge ?', v: '🧺', b: 'Au lavoir', f: ['À la laverie automatique', 'Dans la machine à laver', 'À la piscine'] },
    { q: 'Avec quoi écrivait-on à l\'école du temps des arrière-grands-parents ?', v: '✒️', b: 'Avec une plume et de l\'encre', f: ['Avec un ordinateur', 'Avec un feutre', 'Avec une tablette'] },
    { q: 'Avant l\'invention de la voiture, comment voyageait-on sur les routes ?', v: '🐴', b: 'À cheval ou en calèche', f: ['En avion', 'En train à grande vitesse', 'En fusée'] },
    { q: 'Quelle invention permet de parler à quelqu\'un qui est loin ?', v: '☎️', b: 'Le téléphone', f: ['Le moulin', 'La charrue', 'La bougie'] },
    { q: 'Qui peut nous raconter comment on vivait il y a 60 ans ?', v: '👵', b: 'Nos grands-parents', f: ['Nos petits frères', 'Les bébés', 'Personne'] },
    { q: 'Comment s\'appelle la personne qui étudie le passé en cherchant des objets enfouis ?', v: '⛏️', b: 'Un archéologue', f: ['Un astronaute', 'Un boulanger', 'Un pilote'] },
    { q: 'Quel événement de 1789 marque le début de l\'époque contemporaine ?', v: '🇫🇷', b: 'La Révolution française', f: ['L\'invention de l\'écriture', 'La construction de Lascaux', 'La naissance de Charlemagne'] }
  ];
  const quizHistoire = quiz(HISTOIRE_CE2);
  const genHistoire = () => {
    const t = alea(0, 4);
    if (t === 0) {
      let a; do { a = pioche([alea(1, 999), alea(1000, 2025), alea(1000, 2025)]); } while (a % 100 === 0);
      const s = Math.floor((a - 1) / 100) + 1;
      return qcm({ visuel: gros(a), enonce: `En quel siècle se trouve l'année ${a} ?`, aide: 'De l\'an 1 à l\'an 100 : Ier siècle. De 101 à 200 : IIe siècle…' }, siecle(s), [s - 1, s + 1, s + 2, s - 2].filter(x => x > 0).map(siecle));
    }
    if (t === 1) {
      const i = alea(0, 3), apres = Math.random() < .5 || i === 0, j = apres ? i : i + 1;
      if (apres) return qcm({ visuel: '🕰️', enonce: `Quelle grande période vient juste après ${PERIODES[i]} ?` }, cap(PERIODES[i + 1]), PERIODES.filter((_, k) => k !== i + 1 && k !== i).map(cap));
      return qcm({ visuel: '🕰️', enonce: `Quelle grande période vient juste avant ${PERIODES[j]} ?` }, cap(PERIODES[j - 1]), PERIODES.filter((_, k) => k !== j - 1 && k !== j).map(cap));
    }
    if (t === 2) { const [e, p, v] = pioche(EVENEMENTS); return qcm({ visuel: v, enonce: `À quelle période cela s'est-il passé ?<br>${phrase(e)}` }, cap(p), PERIODES.filter(x => x !== p).map(cap)); }
    if (t === 3) {
      const a = alea(1940, 1975), d = alea(18, 40), b = a + d;
      return qcm({ visuel: '👵👨', enonce: `Mamie est née en ${a}. Papa, son fils, est né en ${b}. Combien d'années séparent leurs deux naissances ?`, aide: 'Calcule l\'écart entre les deux années.' }, `${d} ans`, [d + 10, d - 10, d + 1, d - 1, d + 100].filter(x => x > 0).map(x => `${x} ans`));
    }
    return quizHistoire();
  };

  // ---------- L'espace et la géographie
  const LIEUX = [['🌳', 'le parc'], ['🏫', 'l\'école'], ['🏥', 'l\'hôpital'], ['🏪', 'le magasin'], ['⛪', 'l\'église'], ['🚉', 'la gare'], ['🏊', 'la piscine'], ['🌊', 'la plage']];
  const DIRECTIONS = [['nord', 0, 1], ['est', 1, 2], ['sud', 2, 1], ['ouest', 1, 0]]; // [nom, ligne, colonne]
  const avecDir = d => (d === 'est' || d === 'ouest' ? `à l'${d}` : `au ${d}`);
  const cardinaux = () => {
    const l = melange(LIEUX).slice(0, 4), cases = Array(9).fill('');
    cases[4] = '🏠';
    DIRECTIONS.forEach(([, r, c], i) => { cases[r * 3 + c] = l[i][0]; });
    const grille = `<div style="display:inline-grid;grid-template-columns:repeat(3,1.2em);gap:.08em;font-size:.8em;line-height:1.2em;position:relative">${cases.map(c => `<span>${c || '·'}</span>`).join('')}</div>`;
    const rose = '<div style="font-size:.3em;font-weight:bold">N ⬆</div>';
    const vis = rose + grille;
    const i = alea(0, 3), [dir] = DIRECTIONS[i];
    if (Math.random() < .5) return { visuel: vis, enonce: `Qu'y a-t-il ${avecDir(dir)} de la maison 🏠 ?`, aide: 'Le nord est en haut.', choix: melange(l.map(x => x[0])), bonne: l[i][0] };
    return qcm({ visuel: vis, enonce: `Où se trouve ${l[i][1]} ${l[i][0]} par rapport à la maison 🏠 ?`, aide: 'Le nord est en haut, le sud en bas, l\'est à droite, l\'ouest à gauche.' }, avecDir(dir), DIRECTIONS.map(d => avecDir(d[0])));
  };
  const GEO_CE2 = [
    { q: 'Comment s\'appelle le dessin d\'un lieu vu de dessus, comme une classe ou un quartier ?', v: '🗺️', b: 'Un plan', f: ['Une photo', 'Un portrait', 'Une frise'] },
    { q: 'Sur une carte, à quoi sert la légende ?', v: '🗺️', b: 'À expliquer les couleurs et les symboles', f: ['À raconter une histoire', 'À donner l\'heure', 'À décorer'] },
    { q: 'Sur une carte, de quelle couleur sont souvent la mer et les rivières ?', v: '🗺️', b: 'Bleu', f: ['Vert', 'Rouge', 'Marron'] },
    { q: 'Quel objet indique toujours le nord ?', v: '🧭', b: 'La boussole', f: ['Le thermomètre', 'La montre', 'La loupe'] },
    { q: 'Combien y a-t-il de points cardinaux ?', v: '🧭', b: '4', f: ['2', '3', '8'] },
    { q: 'De quel côté le soleil se lève-t-il le matin ?', v: '🌅', b: 'À l\'est', f: ['À l\'ouest', 'Au nord', 'Au sud'] },
    { q: 'De quel côté le soleil se couche-t-il le soir ?', v: '🌇', b: 'À l\'ouest', f: ['À l\'est', 'Au nord', 'Au sud'] },
    { q: 'Quelle est la capitale de la France ?', v: '🇫🇷', b: 'Paris', f: ['Lyon', 'Marseille', 'Bordeaux'] },
    { q: 'Quel fleuve traverse Paris ?', v: '🌉', b: 'La Seine', f: ['La Loire', 'Le Rhône', 'La Garonne'] },
    { q: 'Quel est le plus long fleuve de France ?', v: '🏞️', b: 'La Loire', f: ['La Seine', 'Le Rhône', 'La Garonne'] },
    { q: 'Quel fleuve passe à Lyon ?', v: '🏞️', b: 'Le Rhône', f: ['La Seine', 'La Loire', 'La Garonne'] },
    { q: 'Quel fleuve passe à Bordeaux ?', v: '🏞️', b: 'La Garonne', f: ['La Seine', 'Le Rhône', 'La Loire'] },
    { q: 'Quelle est la plus haute montagne de France ?', v: '🏔️', b: 'Le mont Blanc', f: ['Le puy de Dôme', 'Le mont Saint-Michel', 'Le Ventoux'] },
    { q: 'Quelles montagnes se trouvent entre la France et l\'Espagne ?', v: '⛰️', b: 'Les Pyrénées', f: ['Les Alpes', 'Les Vosges', 'Le Jura'] },
    { q: 'Dans quelles montagnes se trouve le mont Blanc ?', v: '🏔️', b: 'Les Alpes', f: ['Les Pyrénées', 'Le Massif central', 'Les Vosges'] },
    { q: 'Quelle mer borde le sud de la France ?', v: '🌊', b: 'La mer Méditerranée', f: ['La mer du Nord', 'La Manche', 'La mer Rouge'] },
    { q: 'Quel océan borde l\'ouest de la France ?', v: '🌊', b: 'L\'océan Atlantique', f: ['L\'océan Pacifique', 'L\'océan Indien', 'L\'océan Arctique'] },
    { q: 'Quelle grande ville française se trouve au bord de la Méditerranée ?', v: '⛵', b: 'Marseille', f: ['Lille', 'Strasbourg', 'Paris'] },
    { q: 'Sur quel continent se trouve la France ?', v: '🌍', b: 'L\'Europe', f: ['L\'Afrique', 'L\'Asie', 'L\'Océanie'] },
    { q: 'Sur quel continent se trouvent les États-Unis et le Brésil ?', v: '🌎', b: 'L\'Amérique', f: ['L\'Europe', 'L\'Asie', 'L\'Océanie'] },
    { q: 'Quel est le plus grand océan du monde ?', v: '🌏', b: 'L\'océan Pacifique', f: ['L\'océan Atlantique', 'L\'océan Indien', 'La mer Méditerranée'] },
    { q: 'Sur quel continent vivent les lions et les girafes en liberté ?', v: '🦒', b: 'L\'Afrique', f: ['L\'Europe', 'L\'Antarctique', 'L\'Océanie'] },
    { q: 'Sur quel continent vivent les kangourous ?', v: '🦘', b: 'L\'Océanie', f: ['L\'Europe', 'L\'Afrique', 'L\'Amérique'] },
    { q: 'Quel continent, tout au sud, est couvert de glace ?', v: '🧊', b: 'L\'Antarctique', f: ['L\'Afrique', 'L\'Asie', 'L\'Europe'] },
    { q: 'Sur quel continent se trouve la Chine ?', v: '🐼', b: 'L\'Asie', f: ['L\'Afrique', 'L\'Europe', 'L\'Amérique'] },
    { q: 'Un paysage avec beaucoup d\'immeubles, de routes et de magasins est un paysage…', v: '🏙️', b: 'urbain (de ville)', f: ['de montagne', 'de littoral', 'de campagne'] },
    { q: 'Un paysage avec des champs, des prés et des fermes est un paysage…', v: '🚜', b: 'rural (de campagne)', f: ['urbain', 'de montagne', 'de littoral'] },
    { q: 'Comment appelle-t-on le bord de la mer ?', v: '🏖️', b: 'Le littoral', f: ['La plaine', 'Le sommet', 'La vallée'] },
    { q: 'Sur la Terre, qu\'est-ce qui occupe le plus de place : les terres ou les océans ?', v: '🌍', b: 'Les océans', f: ['Les terres', 'Autant des deux', 'Les montagnes'] },
    { q: 'Quel pays a une frontière avec la France ?', v: '🗺️', b: 'L\'Espagne', f: ['Le Portugal', 'L\'Angleterre', 'La Pologne'] }
  ];
  const quizGeo = quiz(GEO_CE2);
  const genGeographie = () => (Math.random() < .3 ? cardinaux() : quizGeo());

  ajouterMatiere('CE2', {
    id: 'monde', titre: 'Questionner le monde', emoji: '🌍', couleur: '#3bb273', jeux: [
      { id: 'quiz-vivant', titre: 'Plantes et chaînes alimentaires', emoji: '🌱', gen: genVivant },
      { id: 'quiz-animaux', titre: 'Les animaux', emoji: '🦎', gen: genAnimaux },
      { id: 'quiz-matiere', titre: 'L\'eau et la matière', emoji: '💧', gen: genMatiere },
      { id: 'quiz-electricite', titre: 'Électricité et aimants', emoji: '💡', gen: genElectricite },
      { id: 'quiz-corps', titre: 'Mon corps et ma santé', emoji: '🦴', gen: genCorps },
      { id: 'quiz-histoire', titre: 'Le temps et l\'histoire', emoji: '🏰', gen: genHistoire },
      { id: 'quiz-geo', titre: 'Cartes et paysages', emoji: '🧭', gen: genGeographie }
    ]
  });

  /* =====================================================================
     VIVRE ENSEMBLE (EMC)
     ===================================================================== */
  const EMC_CE2 = [
    { q: 'Quelles sont les couleurs du drapeau français ?', v: '🏳️', b: 'Bleu, blanc, rouge', f: ['Vert, blanc, rouge', 'Bleu, jaune, rouge', 'Noir, rouge, jaune'] },
    { q: 'Dans quel ordre sont les couleurs du drapeau français, en partant du mât ?', v: '🏳️', b: 'Bleu, blanc, rouge', f: ['Rouge, blanc, bleu', 'Blanc, bleu, rouge', 'Bleu, rouge, blanc'] },
    { q: 'Quelle est la devise de la République française ?', v: '🏛️', b: 'Liberté, Égalité, Fraternité', f: ['Un pour tous, tous pour un', 'Paix et amour', 'Travail, Famille, Maison'] },
    { q: 'Comment s\'appelle l\'hymne national de la France ?', v: '🎵', b: 'La Marseillaise', f: ['Frère Jacques', 'Au clair de la lune', 'Joyeux anniversaire'] },
    { q: 'Quelle femme représente la République française ?', v: '🗽', b: 'Marianne', f: ['Blanche-Neige', 'Cendrillon', 'Jeanne'] },
    { q: 'Où voit-on souvent le buste de Marianne ?', v: '🏛️', b: 'Dans les mairies', f: ['Dans les boulangeries', 'Dans les piscines', 'Dans les forêts'] },
    { q: 'Quel jour fête-t-on la fête nationale ?', v: '🎆', b: 'Le 14 juillet', f: ['Le 25 décembre', 'Le 1er janvier', 'Le 1er avril'] },
    { q: 'Où voit-on la devise « Liberté, Égalité, Fraternité » ?', v: '🏫', b: 'Sur les écoles et les mairies', f: ['Sur les paquets de céréales', 'Sur les voitures', 'Sur les arbres'] },
    { q: 'Qui dirige la commune ?', v: '🏛️', b: 'Le maire', f: ['Le président de la République', 'Le directeur de l\'école', 'Le boulanger'] },
    { q: 'Qui dirige la France ?', v: '🇫🇷', b: 'Le président de la République', f: ['Le roi', 'Le maire de Paris', 'La maîtresse'] },
    { q: 'À quel âge peut-on voter en France ?', v: '🗳️', b: 'À 18 ans', f: ['À 8 ans', 'À 12 ans', 'À 50 ans'] },
    { q: 'Quel texte protège les droits de tous les enfants du monde ?', v: '🧒', b: 'La Convention internationale des droits de l\'enfant', f: ['Le règlement de la cantine', 'Le code de la route', 'Le livre de recettes'] },
    { q: 'Lequel de ces droits est un droit de l\'enfant ?', v: '🏫', b: 'Le droit d\'aller à l\'école', f: ['Le droit de conduire une voiture', 'Le droit de ne jamais dormir', 'Le droit de frapper'] },
    { q: 'Lequel de ces droits est aussi un droit de l\'enfant ?', v: '⚽', b: 'Le droit de jouer', f: ['Le droit de travailler à l\'usine', 'Le droit de voter', 'Le droit de rester seul la nuit'] },
    { q: 'Un enfant a le droit d\'être soigné quand il est malade.', v: '🩺', b: 'Vrai', f: ['Faux'] },
    { q: 'Un enfant a le droit d\'avoir un nom et un prénom.', v: '🪪', b: 'Vrai', f: ['Faux'] },
    { q: 'Les filles et les garçons ont-ils les mêmes droits ?', v: '👧👦', b: 'Oui, les mêmes droits', f: ['Non, les garçons en ont plus', 'Non, les filles en ont plus', 'Seulement le mercredi'] },
    { q: 'Qui doit respecter le règlement de l\'école ?', v: '📜', b: 'Tout le monde : élèves et adultes', f: ['Seulement les CP', 'Seulement le directeur', 'Personne'] },
    { q: 'À quoi servent les règles de la classe ?', v: '📋', b: 'À bien vivre et apprendre ensemble', f: ['À punir', 'À faire peur', 'À rien'] },
    { q: 'Si quelqu\'un ne respecte pas une règle, il y a…', v: '⚖️', b: 'une sanction juste, pour réparer', f: ['une récompense', 'une fête', 'rien du tout, jamais'] },
    { q: 'Un camarade se moque sans arrêt d\'un autre élève et le bouscule. C\'est…', v: '😢', b: 'du harcèlement', f: ['un jeu normal', 'de la politesse', 'de l\'amitié'] },
    { q: 'Tu vois un élève se faire harceler. Que fais-tu ?', v: '🗣️', b: 'J\'en parle à un adulte de confiance.', f: ['Je ne dis rien.', 'Je ris avec les autres.', 'Je filme avec un téléphone.'] },
    { q: 'Tu n\'es pas d\'accord avec un camarade. Que fais-tu ?', v: '🤝', b: 'J\'en discute calmement.', f: ['Je le tape.', 'Je l\'insulte.', 'Je casse ses affaires.'] },
    { q: 'Un camarade parle une autre langue ou vient d\'un autre pays. Tu…', v: '🌍', b: 'le respectes et tu l\'accueilles', f: ['te moques de lui', 'refuses de jouer avec lui', 'l\'ignores'] },
    { q: 'Que veut dire « respecter les autres » ?', v: '🙂', b: 'Être poli et ne pas faire de mal aux autres', f: ['Faire tout ce qu\'on veut', 'Crier plus fort que les autres', 'Prendre les affaires des autres'] },
    { q: 'Comment s\'appellent les élèves élus pour représenter la classe ?', v: '🙋', b: 'Les délégués', f: ['Les maires', 'Les présidents', 'Les policiers'] },
    { q: 'Pendant une discussion en classe, on…', v: '🙋', b: 'lève le doigt et on écoute les autres', f: ['coupe la parole', 'crie pour être entendu', 'se moque des idées des autres'] },
    { q: 'Tu as cassé la trousse d\'un camarade sans le faire exprès. Que fais-tu ?', v: '✏️', b: 'Je m\'excuse et je propose de réparer.', f: ['Je la cache.', 'Je dis que c\'est un autre.', 'Je pars en courant.'] },
    { q: 'Quel numéro appelle-t-on pour les pompiers ?', v: '🚒', b: '18', f: ['15', '17', '12'] },
    { q: 'Quel numéro appelle-t-on pour le SAMU (urgence médicale) ?', v: '🚑', b: '15', f: ['18', '17', '10'] },
    { q: 'Quel numéro appelle-t-on pour la police ?', v: '🚓', b: '17', f: ['15', '18', '11'] },
    { q: 'Quel numéro gratuit peut appeler un enfant en danger ?', v: '☎️', b: '119', f: ['15', '17', '18'] },
    { q: 'Sur Internet, un inconnu te demande ton adresse. Que fais-tu ?', v: '💻', b: 'Je ne la donne pas et je préviens un adulte.', f: ['Je la donne.', 'Je lui envoie une photo de ma maison.', 'Je lui donne aussi mon téléphone.'] },
    { q: 'Pourquoi trie-t-on les déchets ?', v: '♻️', b: 'Pour les recycler et protéger la planète', f: ['Pour faire joli', 'Pour s\'amuser', 'Pour salir les rues'] },
    { q: 'À vélo, que faut-il porter pour se protéger la tête ?', v: '🚲', b: 'Un casque', f: ['Une casquette', 'Un bonnet', 'Rien'] },
    { q: 'Pour traverser la rue, on attend que le petit bonhomme soit…', v: '🚦', b: 'vert', f: ['rouge', 'orange', 'bleu'] }
  ];

  /* =====================================================================
     ARTS ET MUSIQUE
     ===================================================================== */
  const MELANGES_ART = [['🔴', '🟡', 'orange', 'rouge', 'jaune'], ['🔵', '🟡', 'vert', 'bleu', 'jaune'], ['🔴', '🔵', 'violet', 'rouge', 'bleu']];
  const CHAUDES = [['rouge', 'chaude'], ['orange', 'chaude'], ['jaune', 'chaude'], ['bleu', 'froide'], ['vert', 'froide'], ['violet', 'froide']];
  const INSTR_FAM = [
    ['le violon', '🎻', 'les cordes'], ['la guitare', '🎸', 'les cordes'], ['le banjo', '🪕', 'les cordes'], ['la trompette', '🎺', 'les vents'], ['le saxophone', '🎷', 'les vents'],
    ['la flûte', '🎼', 'les vents'], ['la clarinette', '🎼', 'les vents'], ['le tambour', '🥁', 'les percussions'], ['le triangle', '🔺', 'les percussions'], ['le xylophone', '🎼', 'les percussions']
  ];
  const ARTS = [
    { q: 'Quelles sont les trois couleurs primaires ?', v: '🎨', b: 'Rouge, jaune, bleu', f: ['Vert, orange, violet', 'Noir, blanc, gris', 'Rose, marron, vert'] },
    { q: 'Qu\'obtient-on en ajoutant du blanc à du rouge ?', v: '🎨', b: 'Du rose', f: ['Du violet', 'Du vert', 'Du marron'] },
    { q: 'Quel peintre a peint La Joconde ?', v: '🖼️', b: 'Léonard de Vinci', f: ['Picasso', 'Monet', 'Van Gogh'] },
    { q: 'Quel peintre a peint de célèbres tournesols et « La Nuit étoilée » ?', v: '🌻', b: 'Van Gogh', f: ['Léonard de Vinci', 'Monet', 'Matisse'] },
    { q: 'Quel peintre a peint beaucoup de nénuphars dans son jardin de Giverny ?', v: '🪷', b: 'Monet', f: ['Picasso', 'Van Gogh', 'Léonard de Vinci'] },
    { q: 'Dans quel musée de Paris peut-on voir La Joconde ?', v: '🏛️', b: 'Le Louvre', f: ['Le musée Grévin', 'La tour Eiffel', 'Le château de Versailles'] },
    { q: 'Comment appelle-t-on une œuvre en trois dimensions, en pierre ou en bronze ?', v: '🗿', b: 'Une sculpture', f: ['Une peinture', 'Une photographie', 'Un dessin'] },
    { q: 'Comment appelle-t-on un tableau qui représente une personne ?', v: '🧑‍🎨', b: 'Un portrait', f: ['Un paysage', 'Une nature morte', 'Une carte'] },
    { q: 'Comment appelle-t-on un tableau qui représente la nature, la mer ou la campagne ?', v: '🏞️', b: 'Un paysage', f: ['Un portrait', 'Une sculpture', 'Une affiche'] },
    { q: 'Un son qui ressemble au chant d\'un petit oiseau est…', v: '🐦', b: 'aigu', f: ['grave', 'lent', 'silencieux'] },
    { q: 'Un son qui ressemble au grondement de l\'orage est…', v: '⛈️', b: 'grave', f: ['aigu', 'doux', 'rapide'] },
    { q: 'En musique, jouer « piano », c\'est jouer…', v: '🎹', b: 'doucement', f: ['très fort', 'très vite', 'faux'] },
    { q: 'En musique, jouer « forte », c\'est jouer…', v: '🔊', b: 'fort', f: ['doucement', 'lentement', 'sans bruit'] },
    { q: 'Comment appelle-t-on un groupe de personnes qui chantent ensemble ?', v: '🎤', b: 'Une chorale', f: ['Un orchestre', 'Une équipe', 'Une classe'] },
    { q: 'Comment appelle-t-on un grand groupe de musiciens avec un chef ?', v: '🎼', b: 'Un orchestre', f: ['Une chorale', 'Un solo', 'Un public'] },
    { q: 'Quel musicien célèbre a composé « La Flûte enchantée » ?', v: '🎶', b: 'Mozart', f: ['Picasso', 'Van Gogh', 'Monet'] }
  ];
  const quizArts = quiz(ARTS);
  const genArts = () => {
    const t = alea(0, 4);
    if (t === 0) {
      const m = pioche(MELANGES_ART);
      return qcm({ visuel: `${m[0]} + ${m[1]} = ?`, enonce: `Quelle couleur obtient-on en mélangeant du ${m[3]} et du ${m[4]} ?` }, m[2], ['orange', 'vert', 'violet', 'marron', 'rose']);
    }
    if (t === 1) { const [c, b] = pioche(CHAUDES); return { visuel: '🎨', enonce: `${/^[aeiou]/.test(c) ? 'L\'' : 'Le '}${c} est-il une couleur chaude ou une couleur froide ?`, choix: ['chaude', 'froide'], bonne: b }; }
    if (t === 2) { const [nom, e, fam] = pioche(INSTR_FAM); return qcm({ visuel: e, enonce: `À quelle famille d'instruments appartient ${nom} ?` }, fam, ['les cordes', 'les vents', 'les percussions']); }
    return quizArts();
  };

  ajouterMatiere('CE2', {
    id: 'emc', titre: 'Vivre ensemble', emoji: '🤝', couleur: '#d94f9c', jeux: [
      { id: 'quiz-emc', titre: 'Citoyen et République', emoji: '🇫🇷', gen: quiz(EMC_CE2) }
    ]
  });

  ajouterMatiere('CE2', {
    id: 'arts', titre: 'Arts et musique', emoji: '🎨', couleur: '#d94f9c', jeux: [
      { id: 'quiz-arts', titre: 'Couleurs, tableaux et musique', emoji: '🖌️', gen: genArts }
    ]
  });

  /* =====================================================================
     ANGLAIS
     ===================================================================== */
  const UN_EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const DIX_EN = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const enAnglais = n => (n === 100 ? 'one hundred' : n < 20 ? UN_EN[n] : DIX_EN[Math.floor(n / 10)] + (n % 10 ? '-' + UN_EN[n % 10] : ''));
  const genNombresEn = () => {
    const t = Math.random();
    const n = t < .45 ? alea(2, 10) * 10 : t < .7 ? alea(11, 19) : alea(2, 9) * 10 + alea(1, 9);
    const d = Math.floor(n / 10), u = n % 10;
    let f;
    if (n === 100) f = [10, 90, 1000];
    else if (n < 20) f = [u * 10, n + 1, n - 1, n + 10];         // fourteen / forty
    else if (!u) f = [10 + d, n + 10, n - 10, d];                // forty / fourteen
    else f = [u * 10 + d, n + 10, n - 10, n + 1, n - 1];         // 42 / 24
    return qcm({ visuel: '🔊', enonce: `Écoute : « ${enAnglais(n)} »`, dire: 'Écoute, et touche le bon nombre :', direEn: enAnglais(n), fr: enLettres(n) }, n, f.filter(x => x > 0 && x !== n && x <= 1000));
  };

  // [anglais, emoji, français, groupe] : deux mots du même groupe ne sont jamais proposés ensemble.
  const MOTS_EN_CE2 = [
    ['sunny', '☀️', 'il y a du soleil', 'ciel'], ['rainy', '🌧️', 'il pleut', 'pluie'], ['snowy', '🌨️', 'il neige', 'pluie'], ['windy', '🌬️', 'il y a du vent', 'vent'],
    ['cloudy', '☁️', 'c\'est nuageux', 'ciel'], ['stormy', '⛈️', 'il y a de l\'orage', 'pluie'], ['foggy', '🌫️', 'il y a du brouillard', 'vent'], ['a rainbow', '🌈', 'un arc-en-ciel', 'ciel'],
    ['rice', '🍚', 'le riz', 'plat'], ['soup', '🍲', 'la soupe', 'plat'], ['a sandwich', '🥪', 'un sandwich', 'pain'], ['pizza', '🍕', 'la pizza', 'pain'],
    ['meat', '🥩', 'la viande', 'viande'], ['honey', '🍯', 'le miel', 'sucre'], ['a biscuit', '🍪', 'un biscuit', 'sucre'], ['sweets', '🍬', 'les bonbons', 'sucre'],
    ['pasta', '🍝', 'les pâtes', 'plat'], ['a potato', '🥔', 'une pomme de terre', 'légume'], ['an onion', '🧅', 'un oignon', 'légume'], ['a peach', '🍑', 'une pêche', 'fruit'],
    ['a pineapple', '🍍', 'un ananas', 'fruit'], ['a watermelon', '🍉', 'une pastèque', 'fruit'], ['orange juice', '🧃', 'le jus d\'orange', 'boisson'], ['water', '🚰', 'l\'eau', 'boisson'],
    ['a bed', '🛏️', 'un lit', 'chambre'], ['a bath', '🛁', 'une baignoire', 'bain'], ['a door', '🚪', 'une porte', 'mur'], ['a window', '🪟', 'une fenêtre', 'mur'],
    ['a chair', '🪑', 'une chaise', 'siège'], ['a sofa', '🛋️', 'un canapé', 'siège'], ['the toilet', '🚽', 'les toilettes', 'bain'], ['a key', '🔑', 'une clé', 'clé'],
    ['a clock', '🕰️', 'une horloge', 'écran'], ['a television', '📺', 'une télévision', 'écran'], ['a computer', '💻', 'un ordinateur', 'écran'], ['a house', '🏠', 'une maison', 'maison']
  ];
  const genMotsEn = () => {
    const [en, e, fr, g] = pioche(MOTS_EN_CE2);
    const autres = melange(MOTS_EN_CE2.filter(x => x[1] !== e && x[3] !== g)).slice(0, 3).map(x => x[1]);
    return { visuel: '🔊', enonce: `Écoute : « ${en} »`, dire: 'Écoute, et touche la bonne image :', direEn: en, fr, choix: melange([e, ...autres]), bonne: e };
  };

  // [question, anglais à lire (ou ''), bonne réponse, fausses]
  const PHRASES_EN_CE2 = [
    ['Que veut dire « I can swim. » ?', 'I can swim.', 'Je sais nager.', ['Je sais courir.', 'J\'aime nager.', 'Je ne sais pas nager.']],
    ['Que veut dire « I can\'t fly. » ?', 'I can\'t fly.', 'Je ne sais pas voler.', ['Je sais voler.', 'J\'aime voler.', 'Je ne sais pas nager.']],
    ['Que veut dire « Can you jump? » ?', 'Can you jump?', 'Sais-tu sauter ?', ['Aimes-tu sauter ?', 'Je sais sauter.', 'Sais-tu nager ?']],
    ['Que veut dire « I can ride a bike. » ?', 'I can ride a bike.', 'Je sais faire du vélo.', ['J\'ai un vélo.', 'J\'aime les vélos.', 'Je ne sais pas faire du vélo.']],
    ['Comment dit-on « Je sais chanter. » en anglais ?', '', 'I can sing.', ['I like singing.', 'I can\'t sing.', 'I can dance.']],
    ['Que veut dire « I like apples. » ?', 'I like apples.', 'J\'aime les pommes.', ['Je n\'aime pas les pommes.', 'Je mange des pommes.', 'J\'ai des pommes.']],
    ['Que veut dire « I don\'t like milk. » ?', 'I don\'t like milk.', 'Je n\'aime pas le lait.', ['J\'aime le lait.', 'Je bois du lait.', 'Je n\'ai pas de lait.']],
    ['Que veut dire « Do you like pizza? » ?', 'Do you like pizza?', 'Aimes-tu la pizza ?', ['Veux-tu une pizza ?', 'J\'aime la pizza.', 'Sais-tu faire une pizza ?']],
    ['Comment dit-on « J\'aime le chocolat. » en anglais ?', '', 'I like chocolate.', ['I don\'t like chocolate.', 'I can chocolate.', 'I have got chocolate.']],
    ['Comment dit-on « Je n\'aime pas les carottes. » en anglais ?', '', 'I don\'t like carrots.', ['I like carrots.', 'I can\'t carrots.', 'I eat carrots.']],
    ['Que veut dire « It\'s three o\'clock. » ?', 'It\'s three o\'clock.', 'Il est trois heures.', ['Il est treize heures.', 'J\'ai trois ans.', 'Il est trois heures et demie.']],
    ['Que veut dire « It\'s half past four. » ?', 'It\'s half past four.', 'Il est quatre heures et demie.', ['Il est quatre heures.', 'Il est quatre heures et quart.', 'Il est trois heures et demie.']],
    ['Que veut dire « What time is it? » ?', 'What time is it?', 'Quelle heure est-il ?', ['Quel temps fait-il ?', 'Quel âge as-tu ?', 'Quel jour sommes-nous ?']],
    ['Comment dit-on « Il est sept heures. » en anglais ?', '', 'It\'s seven o\'clock.', ['It\'s seven years.', 'It\'s half past seven.', 'It\'s eleven o\'clock.']],
    ['Que veut dire « What\'s the weather like? » ?', 'What\'s the weather like?', 'Quel temps fait-il ?', ['Quelle heure est-il ?', 'Comment vas-tu ?', 'Qu\'est-ce que tu aimes ?']],
    ['Que veut dire « It\'s raining. » ?', 'It\'s raining.', 'Il pleut.', ['Il neige.', 'Il fait beau.', 'Il y a du vent.']],
    ['Comment dit-on « Il y a du soleil. » en anglais ?', '', 'It\'s sunny.', ['It\'s rainy.', 'It\'s windy.', 'It\'s snowy.']],
    ['Que veut dire « It\'s windy. » ?', 'It\'s windy.', 'Il y a du vent.', ['Il y a du soleil.', 'Il pleut.', 'Il fait froid.']],
    ['Que veut dire « Touch your nose! » ?', 'Touch your nose!', 'Touche ton nez !', ['Montre tes yeux !', 'Lève la main !', 'Touche ta bouche !']],
    ['Que veut dire « I\'ve got two hands. » ?', 'I\'ve got two hands.', 'J\'ai deux mains.', ['J\'ai deux pieds.', 'Je lave mes mains.', 'J\'ai dix doigts.']],
    ['Comment dit-on « la tête » en anglais ?', '', 'head', ['hand', 'hair', 'heart']],
    ['Comment dit-on « les épaules » en anglais ?', '', 'shoulders', ['knees', 'toes', 'legs']],
    ['Comment dit-on « les genoux » en anglais ?', '', 'knees', ['shoulders', 'feet', 'arms']],
    ['Que veut dire « The cat is in the bedroom. » ?', 'The cat is in the bedroom.', 'Le chat est dans la chambre.', ['Le chat est dans la cuisine.', 'Le chien est dans la chambre.', 'Le chat est sur le lit.']],
    ['Comment dit-on « la cuisine » en anglais ?', '', 'the kitchen', ['the bedroom', 'the bathroom', 'the garden']],
    ['Comment dit-on « la salle de bain » en anglais ?', '', 'the bathroom', ['the kitchen', 'the bedroom', 'the living room']],
    ['Que veut dire « I\'m hungry. » ?', 'I\'m hungry.', 'J\'ai faim.', ['J\'ai soif.', 'J\'ai froid.', 'Je suis fatigué.']],
    ['Que veut dire « I\'m thirsty. » ?', 'I\'m thirsty.', 'J\'ai soif.', ['J\'ai faim.', 'J\'ai chaud.', 'J\'ai trente ans.']],
    ['Quelle est la bonne réponse à « Can you swim? » ?', 'Can you swim?', 'Yes, I can.', ['Yes, I do.', 'Yes, I am.', 'Yes, it is.']],
    ['Quelle est la bonne réponse à « Do you like bananas? » ?', 'Do you like bananas?', 'Yes, I do.', ['Yes, I can.', 'Yes, I am.', 'Yes, it is.']],
    ['Quelle est la bonne réponse à « What time is it? » ?', 'What time is it?', 'It\'s five o\'clock.', ['I\'m five.', 'It\'s sunny.', 'It\'s Monday.']],
    ['Quelle est la bonne réponse à « What\'s the weather like? » ?', 'What\'s the weather like?', 'It\'s cloudy.', ['It\'s three o\'clock.', 'I\'m fine.', 'I like it.']]
  ];
  const tirePhraseEn = tirage(PHRASES_EN_CE2);
  const genPhrasesEn = () => {
    const [q, en, b, f] = tirePhraseEn();
    const base = { visuel: '🇬🇧', enonce: q, dire: q };
    if (en) { base.dire = q.replace(/«[^»]*»/, 'ceci'); base.direEn = en; }
    return qcm(base, b, f);
  };

  ajouterMatiere('CE2', {
    id: 'anglais', titre: 'Anglais', emoji: '🇬🇧', couleur: '#8e5cd9', jeux: [
      { id: 'numbers-en', titre: 'Numbers to 100', emoji: '💯', gen: genNombresEn },
      { id: 'words-en', titre: 'Weather, food, home', emoji: '🏠', gen: genMotsEn },
      { id: 'sentences-en', titre: 'I can, I like', emoji: '🗨️', gen: genPhrasesEn }
    ]
  });
})();

/* =====================================================================
   PETITS COURS DU CE2 (bouton « ? »)
   ===================================================================== */

// ---- Maths
cours('CE2/maths/nombres',
  { t: 'Les chiffres d\'un nombre', si: /chiffre des/i, l: [
    'Dans un nombre à 4 chiffres, on lit de droite à gauche : <b>unités</b>, <b>dizaines</b>, <b>centaines</b>, <b>unités de mille</b> (les milliers).',
    'Un petit espace sépare les milliers du reste : 5 283.',
    'Astuce : écris le nombre dans un tableau m | c | d | u.'
  ], ex: '7 205 → m : 7 · c : 2 · d : 0 · u : 5' },
  { t: 'Écrire un nombre en chiffres', si: /en chiffres/i, l: [
    'Un nombre avec « mille » s\'écrit avec <b>4 chiffres</b>.',
    'Écris d\'abord le chiffre des milliers, puis les centaines, les dizaines et les unités.',
    'S\'il n\'y a pas de centaines ou de dizaines, écris un <b>0</b> à leur place !'
  ], ex: 'deux mille quarante → 2 m, 0 c, 4 d, 0 u → <b>2 040</b>' },
  { t: 'Écrire un nombre en lettres', si: /en lettres/i, l: [
    '<b>mille</b> ne prend jamais de s : trois mille.',
    '<b>cent</b> prend un s quand il est multiplié et à la fin : trois cents, mais trois cent deux.',
    'On met des traits d\'union entre les petits mots sous cent : quatre-vingt-dix-sept, sauf avec « et » : vingt et un.'
  ], ex: '6 380 → six mille trois cent quatre-vingts' },
  { t: 'Décomposer un nombre', si: /égal à/i, l: [
    'Chaque morceau va dans sa colonne : milliers, centaines, dizaines, unités.',
    'Attention à l\'ordre : les morceaux peuvent être mélangés !',
    'S\'il manque un morceau, c\'est un <b>0</b> dans la colonne.'
  ], ex: '5 000 + 60 + 3 = <b>5 063</b> (0 centaine)' },
  { t: 'Avancer et reculer', l: [
    'Le nombre juste après, c\'est + 1. Le nombre juste avant, c\'est − 1.',
    'Attention aux passages : après 3 999, on passe à un nouveau millier !',
    '100 de plus : seul le chiffre des centaines augmente de 1 (sauf s\'il y a une retenue).'
  ], ex: '6 099 + 1 = <b>6 100</b> · 2 450 + 1 000 = <b>3 450</b>' });
cours('CE2/maths/comparer',
  { t: 'Comparer deux nombres', si: /signe|le plus (grand|petit)/i, l: [
    'Le nombre qui a le plus de chiffres est le plus grand.',
    'S\'ils ont autant de chiffres, compare le chiffre des milliers, puis des centaines, puis des dizaines, puis des unités.',
    '<b>&lt;</b> veut dire « plus petit que », <b>&gt;</b> « plus grand que ». La pointe montre le plus petit !'
  ], ex: '4 <b>3</b>90 &lt; 4 <b>5</b>12 (3 centaines &lt; 5 centaines)' },
  { t: 'Ranger des nombres', si: /Range/i, l: [
    'Du plus petit au plus grand : c\'est l\'ordre <b>croissant</b> (on utilise &lt;).',
    'Du plus grand au plus petit : c\'est l\'ordre <b>décroissant</b> (on utilise &gt;).',
    'Cherche d\'abord le plus petit (ou le plus grand), puis le suivant…'
  ], ex: '2 108 &lt; 2 180 &lt; 2 801' },
  { t: 'Arrondir', si: /Arrondis/i, l: [
    'Arrondir, c\'est remplacer un nombre par un nombre « rond » tout proche.',
    'Cherche les deux nombres ronds qui l\'entourent, puis choisis le plus proche.',
    'Pour la dizaine, regarde le chiffre des unités ; pour la centaine, celui des dizaines ; pour le millier, celui des centaines. S\'il est 5 ou plus, on arrondit au-dessus.'
  ], ex: '3 462 à la centaine : entre 3 400 et 3 500, plus près de <b>3 500</b>' },
  { t: 'Encadrer', si: /se suivent/i, l: [
    'On cherche la centaine juste avant et la centaine juste après le nombre.',
    'Les centaines qui se suivent vont de 100 en 100.'
  ], ex: '7 318 est entre 7 300 et 7 400' },
  { t: 'La droite graduée', l: [
    'Regarde les deux nombres écrits sous la droite, et compte les petits intervalles entre eux.',
    'Trouve de combien on avance à chaque petit trait : 1, 10 ou 100 ?',
    'Puis compte les traits jusqu\'au point.'
  ], ex: 'De 300 à 400 en 10 intervalles → chaque trait vaut 10.' });
cours('CE2/maths/add-sous',
  { t: 'L\'addition posée', si: /addition/i, l: [
    'Aligne bien les chiffres : unités sous unités, dizaines sous dizaines…',
    'Commence par la colonne des <b>unités</b>, à droite.',
    'Si le résultat d\'une colonne dépasse 9, écris les unités et mets une <b>retenue</b> en haut de la colonne suivante.'
  ], ex: '&nbsp;&nbsp;¹<br>&nbsp;&nbsp;2 47<br>+ 1 25<br>= 3 72 (7 + 5 = 12 : j\'écris 2, je retiens 1)' },
  { t: 'La soustraction posée', l: [
    'Aligne bien les chiffres et commence par les <b>unités</b>.',
    'Si le chiffre du haut est plus petit que celui du bas, ajoute 10 au chiffre du haut et ajoute 1 au chiffre du bas de la colonne suivante (la retenue).',
    'Vérifie : résultat + nombre du bas = nombre du haut.'
  ], ex: '52 − 18 : 2 − 8 impossible → 12 − 8 = 4, puis 5 − (1 + 1) = 3 → <b>34</b>' });
cours('CE2/maths/tables',
  { t: 'Les tables de multiplication', l: [
    '6 × 4, c\'est 6 fois 4 : 4 + 4 + 4 + 4 + 4 + 4.',
    'On peut échanger : 3 × 8 = 8 × 3. Ça fait moins de tables à apprendre !',
    'Table de 5 : ça finit par 0 ou 5. Table de 10 : on ajoute un 0.',
    'Si tu bloques, pars d\'un résultat que tu connais et ajoute ou enlève une fois le nombre.'
  ], ex: '7 × 6 = 7 × 5 + 7 = 35 + 7 = <b>42</b>' });
cours('CE2/maths/multiplication',
  { t: 'Multiplier par 10, par 100', si: /× 10{1,2}\b/, l: [
    '× 10 : chaque chiffre avance d\'un rang, on écrit <b>un 0</b> au bout.',
    '× 100 : on écrit <b>deux 0</b> au bout.'
  ], ex: '64 × 10 = 640 · 64 × 100 = 6 400' },
  { t: 'Choisir la multiplication', si: /^Combien/, l: [
    'Quand on a plusieurs fois la même quantité, on multiplie.',
    'Cherche combien il y a de groupes, et combien il y a dans chaque groupe.'
  ], ex: '5 paquets de 3 billes : 5 × 3 = <b>15</b> billes' },
  { t: 'La multiplication posée', l: [
    'On multiplie chaque chiffre du haut par le chiffre du bas, en commençant par les <b>unités</b>.',
    'Si le résultat dépasse 9, on écrit les unités et on garde la <b>retenue</b>.',
    'On ajoute la retenue <b>après</b> avoir multiplié le chiffre suivant.'
  ], ex: '36 × 4 : 6 × 4 = 24, j\'écris 4, je retiens 2 ; 3 × 4 = 12, + 2 = 14 → <b>144</b>' });
cours('CE2/maths/calcul-mental',
  { t: 'Le double', si: /double/i, l: [
    'Le double, c\'est 2 fois le nombre : on l\'ajoute à lui-même.',
    'Astuce : double les dizaines, puis double les unités, et ajoute.'
  ], ex: 'Double de 36 : 60 + 12 = <b>72</b>' },
  { t: 'La moitié', si: /moitié/i, l: [
    'La moitié, c\'est partager en 2 parts égales.',
    'Astuce : moitié des dizaines, puis moitié des unités.',
    'Vérifie : la moitié + la moitié = le nombre de départ.'
  ], ex: 'Moitié de 84 : 40 + 2 = <b>42</b>' },
  { t: 'Aller jusqu\'à 100', si: /= 100/, l: [
    'Complète d\'abord jusqu\'à la dizaine suivante, puis jusqu\'à 100.',
    'Les unités doivent faire 10, et les dizaines 9 (à cause de la retenue).'
  ], ex: '64 + ? = 100 : 64 + 6 = 70, 70 + 30 = 100 → <b>36</b>' },
  { t: 'Ajouter 9, 11, 19, 99…', si: /[+−] (9|11|19|21|99) =/, l: [
    '+ 9, c\'est + 10 puis − 1. + 11, c\'est + 10 puis + 1.',
    '+ 19, c\'est + 20 puis − 1. + 99, c\'est + 100 puis − 1.',
    'Pour enlever, on fait pareil à l\'envers.'
  ], ex: '56 + 19 = 76 − 1 = <b>75</b>' },
  { t: 'Calculer vite', l: [
    'Ajouter des dizaines, des centaines ou des milliers : seul un chiffre change (sauf retenue).',
    'Cherche les nombres qui vont bien ensemble pour faire 100 (25 et 75, 40 et 60…).'
  ], ex: '3 250 + 400 = <b>3 650</b> · 30 + 45 + 70 = 100 + 45 = <b>145</b>' });
cours('CE2/maths/division',
  { t: 'Partager', si: /partage/i, l: [
    'Partager en parts égales : chacun doit avoir <b>autant</b>.',
    'Tu peux distribuer un par un, ou chercher dans les tables : nombre d\'enfants × ? = total.'
  ], ex: '18 billes pour 3 enfants : 3 × <b>6</b> = 18 → 6 billes chacun' },
  { t: 'Le reste', si: /reste|pleins|pleines|fois/i, l: [
    'On cherche combien de paquets <b>complets</b> on peut faire.',
    'Ce qui ne suffit pas pour faire un paquet de plus, c\'est le <b>reste</b>.',
    'Le reste est toujours plus petit que la taille d\'un paquet.'
  ], ex: '23 œufs par boîtes de 5 : 5 × 4 = 20, il reste 3 → 4 boîtes pleines, reste 3' },
  { t: 'Diviser', l: [
    'Diviser, c\'est chercher combien de fois un nombre va dans un autre.',
    'Utilise les tables de multiplication à l\'envers.'
  ], ex: '35 ÷ 7 : 7 × 5 = 35 → <b>5</b>' });
cours('CE2/maths/fractions',
  { t: 'Nommer une fraction', si: /coloriée|en chiffres/i, l: [
    'Compte en combien de parts <b>égales</b> la figure est partagée : c\'est le nombre du bas.',
    '2 parts : des <b>demis</b>. 3 parts : des <b>tiers</b>. 4 parts : des <b>quarts</b>.',
    'Compte ensuite combien de parts sont coloriées : c\'est le nombre du haut.'
  ], ex: '🟧⬜⬜⬜⬜ : 1 part sur 5 → 1/5 (un cinquième)' },
  { t: 'Moitié, tiers, quart d\'un nombre', si: /^(La moitié|Le tiers|Le quart) de/, l: [
    'La moitié : on partage en <b>2</b>. Le tiers : en <b>3</b>. Le quart : en <b>4</b>.',
    'Utilise les tables : 3 × ? = le nombre (pour le tiers).'
  ], ex: 'Le tiers de 27 : 3 × 9 = 27 → <b>9</b>' },
  { t: 'Parts d\'une unité', l: [
    'Plus on partage une pizza en beaucoup de parts, plus chaque part est <b>petite</b>.',
    'Une pizza entière = 2 demis = 3 tiers = 4 quarts.'
  ], ex: 'Un cinquième de gâteau est plus petit qu\'un demi.' });
cours('CE2/maths/mesures',
  { t: 'Choisir la bonne unité', si: /bonne unité/i, l: [
    'Longueurs : mm (tout petit), cm, m, km (très long, pour les trajets).',
    'Masses : g (léger), kg (lourd).',
    'Contenances : cL (petit récipient), L (grand récipient).',
    'Imagine l\'objet : est-il petit ou grand ? léger ou lourd ?'
  ], ex: 'Un timbre mesure 3 cm · un camion pèse 3 000 kg' },
  { t: 'Les conversions', si: /= \?/, l: [
    '1 km = 1 000 m · 1 m = 100 cm · 1 cm = 10 mm',
    '1 kg = 1 000 g · 1 L = 100 cL',
    'Pour « 2 m 40 cm » : 2 m = 200 cm, puis + 40 cm.'
  ], ex: '5 m 8 cm = 500 + 8 = <b>508 cm</b>' },
  { t: 'Comparer des mesures', l: [
    'Convertis tout dans la même unité avant de comparer.',
    '1 m = 100 cm · 1 kg = 1 000 g'
  ], ex: '1 m 30 cm = 130 cm, c\'est plus que 125 cm.' });
cours('CE2/maths/heure',
  { t: 'Lire l\'heure', si: /Quelle heure est-il/i, l: [
    'La <b>petite aiguille</b> (rouge) montre les heures.',
    'La <b>grande aiguille</b> (bleue) montre les minutes : chaque chiffre vaut 5 minutes.',
    'Sur le 3 → 15 min, sur le 6 → 30 min, sur le 9 → 45 min.'
  ], ex: 'Petite aiguille juste après le 7, grande sur le 4 → <b>7 h 20</b>' },
  { t: 'Les heures de l\'après-midi', si: /autrement/i, l: [
    'Après midi, on continue de compter : 1 h de l\'après-midi = 13 h.',
    'On ajoute <b>12</b> aux heures de l\'après-midi et du soir.'
  ], ex: '4 h 10 de l\'après-midi = <b>16 h 10</b>' },
  { t: 'Calculer une durée', si: /dure|sera-t-il/i, l: [
    'Avance d\'abord jusqu\'à l\'heure pile, puis ajoute le reste.',
    '60 minutes = 1 heure.'
  ], ex: 'De 10 h 45 à 11 h 20 : 15 min + 20 min = <b>35 min</b>' },
  { t: 'Les unités de temps', l: [
    '1 min = 60 s · 1 h = 60 min · une demi-heure = 30 min · un quart d\'heure = 15 min',
    '1 jour = 24 h · 1 semaine = 7 jours · 1 an = 12 mois · 1 an = 365 jours · 1 an = 52 semaines environ',
    'Pour convertir des heures en minutes : 1 h = 60 min, 2 h = 60 + 60…'
  ] });
cours('CE2/maths/monnaie',
  { t: 'Compter l\'argent', si: /en tout/i, l: [
    'Commence par les billets, puis les grosses pièces, puis les petites.',
    'Compte les euros d\'un côté et les centimes de l\'autre.',
    '100 centimes = 1 euro : si les centimes dépassent 100, ça fait un euro de plus !'
  ], ex: '5 € + 2 € + 50 c + 20 c = 7 € 70 c' },
  { t: 'Rendre la monnaie', si: /rend/i, l: [
    'On calcule ce qui manque au prix pour arriver à la somme donnée.',
    'Astuce : avance jusqu\'à l\'euro rond, puis jusqu\'à la somme payée.'
  ], ex: 'Prix 6 € 40 c, je donne 10 € : 6 € 40 c → 7 € (60 c), 7 € → 10 € (3 €) → on me rend 3 € 60 c' },
  { t: 'Pièces et billets', l: [
    '1 € = 100 c · 2 € = 200 c',
    'Pour savoir combien de pièces il faut, compte de pièce en pièce jusqu\'à la somme.'
  ], ex: 'Pièces de 25 c pour 1 € : 25, 50, 75, 100 → 4 pièces' });
cours('CE2/maths/geometrie',
  { t: 'Les angles', si: /cet angle|angle droit/i, l: [
    'Un <b>angle droit</b> est comme le coin d\'une feuille. On le vérifie avec l\'<b>équerre</b>.',
    'Un angle plus fermé est plus petit qu\'un angle droit. Un angle plus ouvert est plus grand.'
  ] },
  { t: 'Les figures', si: /figure/i, l: [
    '<b>Carré</b> : 4 côtés égaux et 4 angles droits.',
    '<b>Rectangle</b> : 4 angles droits, les côtés opposés sont égaux.',
    '<b>Losange</b> : 4 côtés égaux, pas forcément d\'angle droit.',
    '<b>Triangle rectangle</b> : un triangle avec un angle droit.',
    'Pentagone : 5 côtés. Hexagone : 6 côtés. Le cercle est tout rond.'
  ] },
  { t: 'Les polygones', si: /polygone/i, l: [
    'Un polygone est une figure fermée faite de traits droits : les <b>côtés</b>.',
    'Les coins s\'appellent les <b>sommets</b>. Un polygone a autant de sommets que de côtés.',
    'Pour ne pas en oublier, marque le côté par lequel tu commences.'
  ], ex: 'Octogone : 8 côtés (comme le panneau STOP)' },
  { t: 'Le cercle', si: /cercle/i, l: [
    'On trace un cercle avec un <b>compas</b>. La pointe du compas est au <b>centre</b>.',
    'Tous les points du cercle sont à la même distance du centre : c\'est le <b>rayon</b>.'
  ], ex: 'Rayon 6 cm → chaque point du cercle est à 6 cm du centre.' },
  { t: 'La symétrie', si: /symétrie/i, l: [
    'Un axe de symétrie partage une figure en deux moitiés qui se superposent exactement quand on plie.',
    'Imagine un miroir posé sur la ligne : la moitié se reflète-t-elle en l\'autre ?'
  ] },
  { t: 'Les solides', l: [
    'Un solide a des <b>faces</b> (surfaces plates), des <b>arêtes</b> (les bords) et des <b>sommets</b> (les pointes).',
    'Cube : 6 faces carrées. Pavé droit : 6 faces rectangulaires. Pyramide : une base et des faces triangulaires.',
    'Cylindre et cône peuvent rouler. La boule n\'a aucune face plate.',
    'Pour compter, pense aussi à ce qui est caché derrière (en pointillés).'
  ] });
cours('CE2/maths/problemes', { t: 'Résoudre un problème', l: [
  '1. Lis tout l\'énoncé et repère la <b>question</b>.',
  '2. Cherche ce qu\'il faut calculer en premier (parfois il y a deux étapes).',
  '3. « en tout » → +, « reste », « de moins » → −, « plusieurs fois la même chose » → ×, « partager » → ÷.',
  '4. Vérifie que ta réponse a du sens.'
], ex: 'Léo a 3 boîtes de 4 crayons et en perd 2 : 3 × 4 = 12, puis 12 − 2 = <b>10</b>' });

// ---- Français
cours('CE2/francais/conjugaison',
  { t: 'Le présent', si: /au présent/i, l: [
    'Verbes en -er : je saute, tu sautes, il saute, nous sautons, vous sautez, ils sautent.',
    'Verbes comme finir : je remplis, tu remplis, il remplit, nous remplissons, vous remplissez, ils remplissent.',
    'Être, avoir, aller, faire, dire, venir sont irréguliers : il faut les apprendre par cœur.'
  ], ex: 'marcher : je marche, nous marchons, elles marchent' },
  { t: 'L\'imparfait', si: /imparfait/i, l: [
    'Les terminaisons sont les mêmes pour tous les verbes : <b>-ais, -ais, -ait, -ions, -iez, -aient</b>.',
    'Verbes comme finir : on ajoute « ss » : je remplissais.',
    'Attention : à l\'imparfait, le verbe être commence par « ét- ».'
  ], ex: 'sauter : je sautais, nous sautions, ils sautaient' },
  { t: 'Le futur', si: /futur/i, l: [
    'Les terminaisons : <b>-ai, -as, -a, -ons, -ez, -ont</b>, ajoutées souvent à l\'infinitif.',
    'Certains verbes changent de début : être → ser-, avoir → aur-, aller → ir-, faire → fer-, venir → viendr-.'
  ], ex: 'marcher : je marcherai, nous marcherons, ils marcheront' },
  { t: 'Le passé composé', si: /passé composé|auxiliaire/i, l: [
    'Passé composé = auxiliaire <b>avoir</b> ou <b>être</b> au présent + participe passé.',
    'La plupart des verbes utilisent avoir : j\'ai sauté, nous avons ri, il a pris.',
    'Quelques verbes, souvent de mouvement (partir, tomber, rester…), utilisent être. Avec être, le participe s\'accorde : elle est partie, ils sont partis.'
  ], ex: 'tomber : il est tombé, elles sont tombées · lire : j\'ai lu' },
  { t: 'Reconnaître le temps', si: /À quel temps/i, l: [
    'Deux mots (auxiliaire + participe) : c\'est le <b>passé composé</b>.',
    'Terminaison en -ais, -ait, -ions, -aient : c\'est l\'<b>imparfait</b>.',
    'Terminaison en -rai, -ra, -rons, -ront : c\'est le <b>futur</b>.',
    'Sinon, c\'est souvent le <b>présent</b>.'
  ] },
  { t: 'Les mots qui donnent le temps', l: [
    '« Demain », « bientôt », « l\'année prochaine » → le futur.',
    '« Hier », « la semaine dernière » → souvent le passé composé.',
    '« Autrefois », « il y a très longtemps » → l\'imparfait.',
    '« En ce moment », « maintenant » → le présent.'
  ] });
cours('CE2/francais/nature', { t: 'La nature des mots', l: [
  '<b>Nom commun</b> : une personne, un animal, une chose (on peut mettre le, un devant).',
  '<b>Nom propre</b> : un prénom, une ville, un pays, un fleuve… Il commence par une majuscule.',
  '<b>Verbe</b> : ce que l\'on fait ; il change avec le temps (hier…, demain…).',
  '<b>Adjectif</b> : il dit comment est le nom (petit, rouge…).',
  '<b>Déterminant</b> : petit mot devant le nom (le, une, mes, cette…).',
  '<b>Pronom personnel</b> : il remplace un nom (je, tu, il, elle, nous, vous, ils, elles).'
], ex: '<b>Mon</b> (dét.) <b>lapin</b> (nom) <b>Pompon</b> (nom propre) <b>saute</b> (verbe). <b>Il</b> (pronom) est <b>rapide</b> (adj.).' });
cours('CE2/francais/sujet-verbe',
  { t: 'Trouver le sujet', si: /sujet/i, l: [
    'Le sujet dit <b>qui</b> fait l\'action.',
    'Pose la question « <b>Qui est-ce qui</b> … ? » avant le verbe.',
    'On peut l\'encadrer avec « C\'est … qui ».'
  ], ex: 'Le soir, mon oncle cuisine. → Qui est-ce qui cuisine ? C\'est mon oncle qui cuisine.' },
  { t: 'Trouver le verbe', si: /verbe conjugué/i, l: [
    'Le verbe dit ce que fait le sujet.',
    'Il change si on dit la phrase au passé (hier…) ou au futur (demain…).',
    'On peut l\'encadrer avec « ne … pas ».'
  ], ex: 'Le chat miaule. → Hier, le chat miaulait. → Le chat ne miaule pas.' },
  { t: 'L\'accord sujet-verbe', l: [
    'Trouve d\'abord le sujet, puis remplace-le par un pronom (il, elle, ils, elles…).',
    'Avec ils ou elles, le verbe se termine souvent par <b>-ent</b> (qui ne se prononce pas).',
    'Avec tu, le verbe se termine souvent par <b>-s</b>.'
  ], ex: 'Les poules (elles) picorent. · Tu picores.' });
cours('CE2/francais/accords',
  { t: 'Mettre au pluriel', si: /pluriel/i, l: [
    'Tous les mots du groupe passent au pluriel : le déterminant, le nom et l\'adjectif.',
    'On ajoute souvent un <b>-s</b>. Les mots en -eau et -al changent souvent en -eaux et -aux.'
  ], ex: 'le gros ballon → les gros ballons · un journal → des journaux' },
  { t: 'Mettre au féminin', si: /féminin/i, l: [
    'On ajoute souvent un <b>-e</b> au nom et à l\'adjectif.',
    'Certains mots changent davantage : -er → -ère, -eur → -euse, -on → -onne, -en → -enne.'
  ], ex: 'un cousin blond → une cousine blonde · un danseur → une danseuse' },
  { t: 'Les accords dans le groupe nominal', l: [
    'L\'adjectif et le déterminant s\'accordent avec le nom : masculin ou féminin, singulier ou pluriel.',
    'Féminin : on ajoute souvent un -e. Pluriel : on ajoute souvent un -s.',
    'Cherche le nom, puis demande-toi : un ou une ? un seul ou plusieurs ?'
  ], ex: 'une robe bleu<b>e</b> · des pulls bleu<b>s</b> · des jupes bleu<b>es</b>' });
cours('CE2/francais/phrases',
  { t: 'La ponctuation', si: /quel signe/i, l: [
    'Une phrase qui raconte ou explique finit par un <b>point</b> (.).',
    'Une phrase qui pose une question finit par un <b>point d\'interrogation</b> (?).',
    'Une phrase qui montre une émotion (joie, surprise…) finit par un <b>point d\'exclamation</b> (!).'
  ], ex: 'Il neige. · Il neige ? · Il neige !' },
  { t: 'Les types de phrases', si: /type/i, l: [
    '<b>Déclarative</b> : elle raconte, elle donne une information.',
    '<b>Interrogative</b> : elle pose une question.',
    '<b>Exclamative</b> : elle exprime un sentiment fort.',
    '<b>Impérative</b> : elle donne un ordre ou un conseil.'
  ], ex: 'Mange ta soupe. (ordre) · Tu manges ta soupe ? (question)' },
  { t: 'Une phrase bien écrite', si: /bien écrite/i, l: [
    'Une phrase commence par une <b>majuscule</b>.',
    'Elle se termine par un point (., ? ou !).'
  ], ex: 'Le lapin saute dans le pré.' },
  { t: 'La phrase négative', l: [
    'Pour dire le contraire, on entoure le verbe avec <b>ne … pas</b>.',
    'Devant une voyelle, ne devient <b>n\'</b>.'
  ], ex: 'Il court. → Il <b>ne</b> court <b>pas</b>. · J\'ai peur. → Je <b>n\'</b>ai <b>pas</b> peur.' });
cours('CE2/francais/homophones',
  { t: 'a ou à', si: /« a » ou « à »/, l: [
    '<b>a</b> est le verbe avoir : on peut le remplacer par <b>avait</b>.',
    '<b>à</b> ne peut pas être remplacé par « avait » : il indique un lieu, un moment…'
  ], ex: 'Zoé <b>a</b> une trottinette (Zoé avait…). Elle va <b>à</b> la plage.' },
  { t: 'est ou et', si: /« est » ou « et »/, l: [
    '<b>est</b> est le verbe être : on peut le remplacer par <b>était</b>.',
    '<b>et</b> relie deux mots ou deux idées : on peut dire « et puis ».'
  ], ex: 'La mer <b>est</b> calme <b>et</b> bleue.' },
  { t: 'son ou sont', si: /« son » ou « sont »/, l: [
    '<b>sont</b> est le verbe être : on peut dire <b>étaient</b>.',
    '<b>son</b> veut dire « le sien » : on peut dire <b>mon</b>.'
  ], ex: 'Ses crayons <b>sont</b> neufs. Il prend <b>son</b> crayon.' },
  { t: 'on ou ont', si: /« on » ou « ont »/, l: [
    '<b>ont</b> est le verbe avoir : on peut dire <b>avaient</b>.',
    '<b>on</b> est un pronom : on peut le remplacer par <b>il</b>.'
  ], ex: 'Les lapins <b>ont</b> peur. <b>On</b> les rassure.' },
  { t: 'ou ou où', si: /« ou » ou « où »/, l: [
    '<b>ou</b> sans accent : on peut dire <b>ou bien</b> (un choix).',
    '<b>où</b> avec un accent indique un <b>lieu</b> (une question sur l\'endroit).'
  ], ex: 'Du thé <b>ou</b> du lait ? <b>Où</b> est le chat ?' },
  { t: 'ces ou ses', si: /« ces » ou « ses »/, l: [
    '<b>ses</b> veut dire « les siens » : on peut dire <b>mes</b>.',
    '<b>ces</b> montre des choses : on peut dire <b>ces … -là</b>.'
  ], ex: 'Tom range <b>ses</b> livres (les siens). Regarde <b>ces</b> nuages-là !' });
cours('CE2/francais/vocabulaire',
  { t: 'Les synonymes', si: /même chose/i, l: [
    'Un synonyme est un mot qui a presque le <b>même sens</b>.',
    'Essaie de remplacer le mot dans une phrase : la phrase veut-elle toujours dire la même chose ?'
  ], ex: 'un cadeau → un présent · se sauver → s\'enfuir' },
  { t: 'Les contraires', si: /contraire/i, l: [
    'Un contraire a le sens <b>opposé</b>.',
    'Parfois, on fabrique le contraire en ajoutant un petit morceau au début : <b>dé-</b>, <b>in-</b>, <b>im-</b>, <b>mé-</b>, <b>mal-</b>.'
  ], ex: 'sec → mouillé · visible → invisible · habiller → déshabiller' },
  { t: 'Les familles de mots', si: /famille/i, l: [
    'Les mots d\'une même famille ont un morceau commun (le <b>radical</b>) et un sens proche.',
    'Attention aux pièges : un mot qui se ressemble mais n\'a pas le même sens n\'est pas de la famille.'
  ], ex: 'neige → neiger, enneigé (mais pas « nez » !)' },
  { t: 'Les préfixes', si: /veut dire le mot/i, l: [
    'Un préfixe est un petit morceau placé <b>au début</b> du mot. Il change son sens.',
    '<b>re-</b> : de nouveau. <b>dé-</b>, <b>in-</b>, <b>im-</b> : le contraire. <b>pré-</b> : avant.'
  ], ex: 'repeindre = peindre de nouveau · inutile = pas utile' },
  { t: 'Les suffixes', l: [
    'Un suffixe est un petit morceau placé <b>à la fin</b> du mot.',
    '<b>-ette</b>, <b>-on</b> : petit. <b>-ier</b> : arbre fruitier ou métier. <b>-eur</b> : celui qui fait. <b>-erie</b> : boutique.'
  ], ex: 'une cloche → une clochette · un cerisier · un coureur · une pâtisserie' });
cours('CE2/francais/dictionnaire',
  { t: 'L\'ordre alphabétique', si: /premier|dernier|ordre alphabétique/i, l: [
    'Les mots du dictionnaire sont rangés dans l\'ordre de l\'alphabet.',
    'Si la 1re lettre est la même, regarde la 2e lettre, puis la 3e…',
    'Les accents ne comptent pas pour ranger les mots.'
  ], ex: 'radis → renard → robot (a, e, o)' },
  { t: 'Les mots repères', si: /repères/i, l: [
    'En haut de chaque page, les mots repères indiquent le premier et le dernier mot de la page.',
    'Le mot cherché doit se ranger <b>entre</b> les deux mots repères.'
  ], ex: 'Page « girafe – glace » : on y trouve « gilet » ? Non (gi-l avant gi-r). On y trouve « givre » ? Oui.' },
  { t: 'L\'alphabet', si: /lettre/i, l: [
    'L\'alphabet a 26 lettres, de a à z. Tu peux le chanter pour t\'en souvenir.',
    'Récite l\'alphabet dans ta tête jusqu\'à la lettre, puis regarde la suivante ou la précédente.'
  ] },
  { t: 'Chercher un mot', l: [
    'Le dictionnaire donne les noms au <b>singulier</b>, les adjectifs au <b>masculin singulier</b> et les verbes à l\'<b>infinitif</b>.',
    'Pour un verbe conjugué, cherche son infinitif : « nous sautons » → sauter.'
  ], ex: 'des animaux → animal · jolies → joli · il prenait → prendre' });
cours('CE2/francais/comprehension', { t: 'Comprendre un texte', l: [
  'Lis la question <b>avant</b> de relire le texte : tu sais ce que tu cherches.',
  'Repère le mot important de la question : qui ? où ? quand ? pourquoi ? combien ?',
  'Retrouve la phrase du texte qui répond et relis-la bien.',
  'Pour « pourquoi », cherche la raison dans le texte, même si elle n\'est pas écrite avec « parce que ».'
] });
cours('CE2/francais/dictee', { t: 'Bien écrire un mot', l: [
  'Écoute le mot plusieurs fois avec 🔊.',
  'Découpe-le en syllabes et écris chaque son.',
  'Pense aux lettres muettes : trouve un mot de la même famille (un chat → une chatte).',
  'Pense aux accents (é, è, ê) et aux lettres doubles (ll, ss, tt…).'
], ex: 'un bavard → on entend le d dans « bavarde »' });

// ---- Questionner le monde
cours('CE2/monde/quiz-vivant',
  { t: 'Les chaînes alimentaires', si: /chaîne|flèche/i, l: [
    'Une chaîne alimentaire montre <b>qui mange qui</b>.',
    'La flèche → veut dire « est mangé par ».',
    'Elle commence presque toujours par un végétal (une plante), mangé par un herbivore, lui-même mangé par un carnivore.',
    'Les décomposeurs (vers de terre, champignons) transforment les restes en terre.'
  ], ex: 'maïs → poule → renard : la poule mange le maïs, le renard mange la poule.' },
  { t: 'Les plantes', l: [
    'Une plante a besoin d\'<b>eau</b>, de <b>lumière</b> et d\'<b>air</b> pour vivre. Sans lumière, elle jaunit.',
    'Les racines puisent l\'eau, la tige tient la plante, les feuilles fabriquent sa nourriture grâce à la lumière.',
    'La graine germe et donne une nouvelle plante. La fleur, pollinisée par les insectes, devient un fruit qui contient les graines.',
    'Les animaux qui ne mangent que des plantes sont des herbivores.'
  ] });
cours('CE2/monde/quiz-animaux',
  { t: 'Classer les animaux', si: /groupe|recouvre|vertébr/i, l: [
    'Les <b>vertébrés</b> ont un squelette avec une colonne vertébrale. Les autres sont des invertébrés (insectes, araignées, escargots, vers…).',
    'Mammifères : des poils, les petits boivent le lait de leur mère. Oiseaux : des plumes et un bec.',
    'Poissons : des écailles et des nageoires. Reptiles : des écailles, ils pondent des œufs sur terre. Amphibiens : une peau nue et humide.',
    'Attention : la baleine, le dauphin et la chauve-souris sont des mammifères !'
  ] },
  { t: 'Ce que mangent les animaux', si: /est…$|herbivore/i, l: [
    'Herbivore : il ne mange que des plantes.',
    'Carnivore : il mange d\'autres animaux (de la viande).',
    'Omnivore : il mange de tout, des plantes et des animaux.'
  ] },
  { t: 'La vie des animaux', l: [
    'Un animal naît, grandit, se reproduit et meurt : c\'est son cycle de vie.',
    'Certains animaux changent complètement de forme : c\'est la <b>métamorphose</b> (œuf → têtard → grenouille ; œuf → chenille → chrysalide → papillon).',
    'Les ovipares pondent des œufs ; les petits des mammifères naissent du ventre de leur mère.',
    'Les insectes ont 6 pattes, les araignées 8. Les poissons respirent avec des branchies.'
  ] });
cours('CE2/monde/quiz-matiere',
  { t: 'Solide, liquide, gaz', si: /Dans quel état|forme/i, l: [
    '<b>Solide</b> : il a sa propre forme, on peut le prendre dans la main.',
    '<b>Liquide</b> : il coule et prend la forme du récipient ; sa surface est plate et horizontale.',
    '<b>Gaz</b> : on ne peut pas le saisir, il remplit tout l\'espace (l\'air, la vapeur d\'eau).',
    'Le sable et le sel sont des solides en petits grains.'
  ] },
  { t: 'Les changements d\'état', si: /changement d'état/i, l: [
    'Solide → liquide : la <b>fusion</b> (la glace fond).',
    'Liquide → solide : la <b>solidification</b> (l\'eau gèle).',
    'Liquide → gaz : l\'<b>évaporation</b> (l\'eau sèche ou bout).',
    'Gaz → liquide : la <b>condensation</b> (la buée, la rosée).'
  ] },
  { t: 'Les mélanges', si: /dissout|filtr|sel|sable/i, l: [
    'Certaines matières se <b>dissolvent</b> dans l\'eau : on ne les voit plus, mais elles sont toujours là (on peut les goûter).',
    'D\'autres ne se dissolvent pas : on les voit encore, elles tombent au fond ou flottent.',
    'On sépare un solide d\'un liquide en <b>filtrant</b>. On récupère ce qui est dissous en laissant l\'eau s\'évaporer.'
  ] },
  { t: 'L\'eau autour de nous', l: [
    'L\'eau gèle à 0 °C et bout à 100 °C. On mesure la température avec un thermomètre.',
    'Quand la glace fond, sa masse ne change pas.',
    'Le cycle de l\'eau : l\'eau s\'évapore, forme des nuages, retombe en pluie, rejoint les rivières et la mer.',
    'L\'air est de la matière : il a une masse.'
  ] });
cours('CE2/monde/quiz-electricite',
  { t: 'Le circuit électrique', si: /ampoule|circuit|courant|conducteur|isolant|interrupteur/i, l: [
    'Pour que l\'ampoule s\'allume, le courant doit faire <b>un tour complet</b> : de la pile, par les fils et l\'ampoule, jusqu\'à l\'autre borne de la pile. C\'est un circuit <b>fermé</b>.',
    'Si le circuit est coupé (fil cassé, interrupteur ouvert), il est <b>ouvert</b> : l\'ampoule reste éteinte.',
    'Les métaux (fer, cuivre, aluminium) laissent passer le courant : ce sont des <b>conducteurs</b>.',
    'Le plastique, le bois, le verre, le papier ne le laissent pas passer : ce sont des <b>isolants</b>.'
  ] },
  { t: 'Les aimants', si: /aimant/i, l: [
    'Un aimant attire les objets en <b>fer</b> ou en <b>acier</b> (et la fonte, qui contient du fer).',
    'Il n\'attire pas le bois, le plastique, le verre, le papier… ni l\'aluminium, le cuivre ou l\'or !',
    'Deux aimants peuvent s\'attirer ou se repousser selon le côté.'
  ] },
  { t: 'Attention, danger !', l: [
    'Le courant des prises de la maison est très dangereux : on ne joue jamais avec.',
    'Eau et électricité ne font pas bon ménage : jamais d\'appareil électrique près du bain.',
    'Une petite pile, elle, n\'est pas dangereuse : on peut faire des expériences.',
    'Un fil abîmé ? On n\'y touche pas et on prévient un adulte.'
  ] });
cours('CE2/monde/quiz-corps',
  { t: 'Os, muscles et articulations', si: /os|squelette|crâne|côtes|articulation|muscle|biceps/i, l: [
    'Le <b>squelette</b> est l\'ensemble des os : il soutient le corps et protège les organes (le crâne protège le cerveau, les côtes protègent le cœur et les poumons).',
    'Les <b>muscles</b>, attachés aux os, les font bouger. Quand un muscle se contracte, il devient dur et gonflé.',
    'Les <b>articulations</b> (genou, coude, épaule…) sont les endroits où les os bougent l\'un par rapport à l\'autre.'
  ] },
  { t: 'Les dents', si: /dents?\b/i, l: [
    'Les incisives (devant) coupent, les canines (pointues) déchirent, les molaires (au fond) écrasent.',
    'Un enfant a 20 dents de lait ; un adulte en a en général 32.',
    'On se brosse les dents au moins 2 fois par jour, 2 minutes. Le sucre abîme les dents.'
  ] },
  { t: 'Bien manger', si: /aliment|fruits|boire|boisson|petit-déjeuner/i, l: [
    'Les familles d\'aliments : fruits et légumes, féculents (pain, pâtes, riz…), produits laitiers, viande-poisson-œufs, produits sucrés.',
    'Il faut manger de tout, avec au moins 5 fruits et légumes par jour, et peu de sucreries.',
    'La meilleure boisson, c\'est l\'eau. Le petit-déjeuner donne de l\'énergie pour la matinée.'
  ] },
  { t: 'Être en bonne santé', l: [
    'Un enfant de 8 ans a besoin d\'environ 10 heures de sommeil. Les écrans le soir empêchent de bien dormir.',
    'Le sport garde le corps en forme ; quand on court, le cœur bat plus vite.',
    'On se lave les mains avant de manger et après les toilettes.',
    'Le cœur pompe le sang ; les poumons servent à respirer.'
  ] });
cours('CE2/monde/quiz-histoire',
  { t: 'Les siècles', si: /siècle/i, l: [
    'Un siècle dure 100 ans. On l\'écrit en chiffres romains : I = 1, V = 5, X = 10.',
    'De l\'an 1 à l\'an 100 : Ier siècle ; de 101 à 200 : IIe siècle ; de 1901 à 2000 : XXe siècle.',
    'Astuce : prends les chiffres avant les deux derniers et ajoute 1.'
  ], ex: 'L\'an 1356 → 13 + 1 = 14 → XIVe siècle' },
  { t: 'Les grandes périodes', si: /période/i, l: [
    'La frise se lit de gauche (le plus ancien) à droite (le plus récent).',
    'Préhistoire (jusqu\'à l\'invention de l\'écriture) → Antiquité (Gaulois, Romains) → Moyen Âge (châteaux forts) → Temps modernes (à partir de 1492) → époque contemporaine (à partir de 1789).',
    'Préhistoire : grottes peintes, outils en silex. Antiquité : Gaulois et Romains. Moyen Âge : chevaliers et Jeanne d\'Arc. Temps modernes : Christophe Colomb, Louis XIV. Époque contemporaine : avions, voyage sur la Lune.'
  ] },
  { t: 'Calculer une durée', si: /naissances/i, l: [
    'Pour trouver combien d\'années séparent deux dates, on fait une soustraction : la plus récente moins la plus ancienne.'
  ], ex: 'De 1968 à 1995 : 1995 − 1968 = <b>27 ans</b>' },
  { t: 'La vie autrefois', l: [
    'Un siècle = 100 ans ; un millénaire = 1 000 ans. Nous vivons au XXIe siècle.',
    'Autrefois, sans électricité, on s\'éclairait à la bougie ; on lavait le linge au lavoir ; on écrivait à la plume ; on voyageait à cheval.',
    'Nos grands-parents peuvent nous raconter le passé. Les archéologues étudient les objets enfouis.',
    'L\'invention de l\'écriture marque la fin de la Préhistoire ; les nomades se déplaçaient sans cesse ; la Révolution française commence en 1789.'
  ] });
cours('CE2/monde/quiz-geo',
  { t: 'Les points cardinaux', si: /au nord|au sud|à l'est|à l'ouest|par rapport à la maison|boussole|cardinaux|soleil se/i, l: [
    'Il y a 4 points cardinaux : nord, sud, est, ouest.',
    'Sur une carte, le <b>nord</b> est en haut, le <b>sud</b> en bas, l\'<b>est</b> à droite, l\'<b>ouest</b> à gauche.',
    'Astuce pour s\'en souvenir : « N-E-S-O » dans le sens des aiguilles d\'une montre.',
    'La boussole indique toujours le nord. Le soleil se lève à l\'est et se couche à l\'ouest.'
  ] },
  { t: 'Plans et cartes', si: /plan|carte|légende/i, l: [
    'Un plan ou une carte représente un lieu vu <b>de dessus</b>.',
    'La <b>légende</b> explique ce que veulent dire les couleurs et les symboles.',
    'L\'eau (mer, rivières) est souvent en bleu, les forêts en vert.'
  ] },
  { t: 'La France', si: /fleuve|montagne|mont |mer |océan|capitale|ville|pays|Pyrénées|Alpes/i, l: [
    'La France est en Europe ; sa capitale est Paris. Ses voisins : Belgique, Luxembourg, Allemagne, Suisse, Italie, Espagne…',
    'Fleuves : la Loire (le plus long), la Seine (Paris), le Rhône (Lyon), la Garonne (Bordeaux).',
    'Montagnes : les Alpes (le mont Blanc, le plus haut sommet), les Pyrénées (vers l\'Espagne), le Massif central, les Vosges, le Jura.',
    'Mers et océan : la Manche, l\'océan Atlantique à l\'ouest, la mer Méditerranée au sud (Marseille).'
  ] },
  { t: 'Le monde et les paysages', l: [
    'Les continents : Europe, Asie, Afrique, Amérique, Océanie, Antarctique (couvert de glace).',
    'Les océans couvrent la plus grande partie de la Terre ; le Pacifique est le plus grand.',
    'Paysage urbain (ville), rural (campagne), de montagne, de littoral (bord de mer).',
    'Lions et girafes vivent en Afrique, kangourous en Océanie, pandas en Asie.'
  ] });
cours('CE2/emc/quiz-emc',
  { t: 'Les symboles de la République', si: /drapeau|devise|Marianne|hymne|fête nationale|Liberté/i, l: [
    'Le drapeau est bleu, blanc, rouge.',
    'La devise est : Liberté, Égalité, Fraternité. On la lit sur les écoles et les mairies.',
    'L\'hymne national s\'appelle La Marseillaise. Marianne représente la République ; son buste est dans les mairies.',
    'La fête nationale a lieu le 14 juillet.'
  ] },
  { t: 'Les droits de l\'enfant', si: /droit/i, l: [
    'La Convention internationale des droits de l\'enfant protège tous les enfants du monde.',
    'Chaque enfant a droit à un nom, à l\'école, aux soins, à jouer, à être protégé.',
    'Les filles et les garçons ont les mêmes droits.'
  ] },
  { t: 'Les règles et le respect', si: /règle|sanction|harcel|respect|accord|pays|délégués|discussion|cassé/i, l: [
    'Les règles s\'appliquent à tout le monde : élèves et adultes. Elles servent à bien vivre et apprendre ensemble.',
    'Quand on ne respecte pas une règle, il y a une sanction juste, pour réparer.',
    'Se moquer, bousculer ou mettre à l\'écart quelqu\'un encore et encore, c\'est du harcèlement : on en parle à un adulte de confiance.',
    'On règle les désaccords en discutant calmement, on s\'excuse quand on a fait une bêtise, on respecte chacun.'
  ] },
  { t: 'Vivre en citoyen', l: [
    'Le maire dirige la commune ; le président de la République dirige la France. On vote à partir de 18 ans.',
    'Numéros d\'urgence : 15 (SAMU), 17 (police), 18 (pompiers), 119 (enfance en danger).',
    'Sur Internet, on ne donne jamais son adresse à un inconnu.',
    'On trie ses déchets, on porte un casque à vélo, on traverse quand le petit bonhomme est vert.'
  ] });
cours('CE2/arts/quiz-arts',
  { t: 'Les couleurs', si: /couleur|blanc|primaires/i, l: [
    'Les couleurs <b>primaires</b> sont le rouge, le jaune et le bleu.',
    'En les mélangeant deux à deux, on obtient les couleurs <b>secondaires</b> : orange, vert, violet.',
    'Couleurs <b>chaudes</b> (comme le feu) : rouge, orange, jaune. Couleurs <b>froides</b> (comme l\'eau) : bleu, vert, violet.',
    'Avec du blanc, on éclaircit une couleur.'
  ] },
  { t: 'Les œuvres d\'art', si: /peintre|musée|tableau|sculpture|Joconde|œuvre/i, l: [
    'Un <b>portrait</b> représente une personne ; un <b>paysage</b> représente la nature ; une <b>sculpture</b> est en trois dimensions.',
    'Léonard de Vinci a peint La Joconde, exposée au Louvre à Paris.',
    'Van Gogh a peint des tournesols et La Nuit étoilée ; Monet a peint des nénuphars.'
  ] },
  { t: 'La musique', l: [
    'Les familles d\'instruments : les <b>cordes</b> (on les frotte ou on les pince), les <b>vents</b> (on souffle), les <b>percussions</b> (on tape ou on secoue).',
    'Un son peut être <b>aigu</b> (comme un oiseau) ou <b>grave</b> (comme l\'orage).',
    '« Piano » veut dire doucement, « forte » veut dire fort.',
    'Une chorale chante ensemble ; un orchestre joue avec un chef. Mozart a composé La Flûte enchantée.'
  ] });
