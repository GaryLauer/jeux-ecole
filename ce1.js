// Contenu du CE1 (7 ans) : matières, jeux et petits cours.
(() => {
  /* =====================================================================
     OUTILS
     ===================================================================== */
  // Tire dans une liste sans répéter avant d'avoir tout vu.
  const tirage = liste => { let r = []; return () => { if (!r.length) r = melange(liste); return r.pop(); }; };
  // Quiz à partir d'une liste { q, b, f, v?, d? } (d = texte lu, sinon q).
  const quiz = (liste, visuel = '') => {
    const t = tirage(liste);
    return () => { const it = t(); return qcm({ visuel: it.v || visuel, enonce: it.q, dire: it.d || it.q }, it.b, it.f); };
  };
  // Choisit un générateur au hasard (poids éventuels).
  const auHasard = (...gens) => () => pioche(gens)();
  const phrase = t => `<span style="font-weight:normal">${t}</span>`;
  const petit = (s, t = '.5em') => `<span style="font-size:${t}">${s}</span>`;
  const gros = t => `<b style="font-size:.85em">${t}</b>`;
  // Dessin SVG rectangulaire.
  const dessin = (contenu, w, h, larg = 260) =>
    `<svg width="${larg}" height="${Math.round(larg * h / w)}" viewBox="0 0 ${w} ${h}" style="max-width:82vw;height:auto">${contenu}</svg>`;
  const txt = (x, y, t, taille = 8, coul = '#222', anc = 'middle') =>
    `<text x="${x}" y="${y}" font-size="${taille}" font-weight="bold" font-family="sans-serif" fill="${coul}" text-anchor="${anc}" dominant-baseline="central">${t}</text>`;
  const r1 = x => Math.round(x * 10) / 10;
  const deN = x => (/^[aeiouéèêâîôûh]/i.test(x) ? 'd\'' : 'de ') + x;
  const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const sansAccent = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const Maj = s => s[0].toUpperCase() + s.slice(1);

  // Nombres en lettres (orthographe traditionnelle), jusqu'à 999.
  const U = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const DIZ = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];
  const moins100 = n => {
    if (n < 20) return U[n];
    const d = Math.floor(n / 10), u = n % 10;
    if (d === 7) return n === 71 ? 'soixante et onze' : 'soixante-' + U[n - 60];
    if (d === 9) return 'quatre-vingt-' + U[n - 80];
    if (d === 8) return u ? 'quatre-vingt-' + U[u] : 'quatre-vingts';
    if (!u) return DIZ[d];
    return u === 1 ? DIZ[d] + ' et un' : DIZ[d] + '-' + U[u];
  };
  const enLettres = n => {
    if (n < 100) return moins100(n);
    const c = Math.floor(n / 100), r = n % 100;
    const cent = c === 1 ? 'cent' : U[c] + ' cent' + (r ? '' : 's');
    return r ? cent + ' ' + moins100(r) : cent;
  };

  const OBJETS_NOMS = [['🍎', 'pommes'], ['⭐', 'étoiles'], ['🐞', 'coccinelles'], ['🌸', 'fleurs'], ['🍪', 'biscuits'], ['🚗', 'voitures'], ['🎈', 'ballons'], ['🐟', 'poissons']];
  const PRENOMS = [['Léa', 'elle'], ['Tom', 'il'], ['Inès', 'elle'], ['Noah', 'il'], ['Jade', 'elle'], ['Lucas', 'il'], ['Chloé', 'elle'], ['Adam', 'il'], ['Sofia', 'elle'], ['Hugo', 'il']];

  /* =====================================================================
     MATHS
     ===================================================================== */

  // ---- Les nombres jusqu'à 1000
  const blocs = (c, d, u) => {
    let s = '';
    for (let i = 0; i < c; i++) {
      const px = 2 + (i % 5) * 25, py = 2 + Math.floor(i / 5) * 25;
      s += `<rect x="${px}" y="${py}" width="22" height="22" fill="#8fb6f9" stroke="#1d4ed8" stroke-width="1"/>`;
      for (let k = 1; k < 10; k++) s += `<line x1="${r1(px + k * 2.2)}" y1="${py}" x2="${r1(px + k * 2.2)}" y2="${py + 22}" stroke="#1d4ed8" stroke-width=".3"/><line x1="${px}" y1="${r1(py + k * 2.2)}" x2="${px + 22}" y2="${r1(py + k * 2.2)}" stroke="#1d4ed8" stroke-width=".3"/>`;
    }
    let x = c ? 2 + Math.min(c, 5) * 25 + 5 : 2;
    for (let i = 0; i < d; i++) {
      const px = x + i * 6;
      s += `<rect x="${px}" y="2" width="4" height="22" fill="#7fd1a4" stroke="#1f7a4d" stroke-width=".8"/>`;
      for (let k = 1; k < 10; k++) s += `<line x1="${px}" y1="${r1(2 + k * 2.2)}" x2="${px + 4}" y2="${r1(2 + k * 2.2)}" stroke="#1f7a4d" stroke-width=".4"/>`;
    }
    x += d ? d * 6 + 5 : 0;
    for (let i = 0; i < u; i++) s += `<rect x="${x + (i % 3) * 6}" y="${2 + Math.floor(i / 3) * 6}" width="4" height="4" fill="#f5b041" stroke="#a0620e" stroke-width=".8"/>`;
    x += u ? 18 : 0;
    const w = Math.max(x, 40), h = c > 5 ? 52 : 27;
    return dessin(s, w, h, Math.min(330, w * 2.8));
  };
  const genNombres = () => {
    const t = alea(0, 3);
    const c = alea(1, 9), d = t === 3 && Math.random() < .5 ? pioche([7, 8, 9]) : alea(0, 9), u = alea(0, 9), n = c * 100 + d * 10 + u;
    const proches = [c * 100 + u * 10 + d, d * 100 + c * 10 + u, n + 10, n - 10, n + 100, n - 100, n + 1].filter(x => x > 0 && x < 1000 && x !== n);
    if (t === 0) {
      return qcm({ visuel: blocs(c, d, u), enonce: 'Quel nombre est représenté ?',
        dire: 'Compte les centaines, les dizaines et les unités. Quel nombre est représenté ?',
        aide: 'Plaque bleue = 100 · barre verte = 10 · petit cube = 1' }, n, proches);
    }
    if (t === 1) {
      const [nom, i] = pioche([['centaines', 0], ['dizaines', 1], ['unités', 2]]), s = String(n), bon = s[i];
      return qcm({ visuel: gros(n), enonce: `Dans ${n}, quel est le chiffre des ${nom} ?`, dire: `Dans le nombre ${n}, quel est le chiffre des ${nom} ?` },
        bon, [...s.split(''), String((+bon + 1) % 10), String((+bon + 9) % 10), '0', '5']);
    }
    if (t === 2) {
      const parts = [[c, 'centaine', c * 100], [d, 'dizaine', d * 10], [u, 'unité', u]].filter(p => p[0] > 0);
      const naif = +parts.map(p => p[0]).join('');
      const f = [naif, ...proches].filter(x => x !== n);
      if (Math.random() < .5) {
        const mots = parts.map(p => `${p[0]} ${p[1]}${p[0] > 1 ? 's' : ''}`);
        const txtP = mots.length > 1 ? mots.slice(0, -1).join(', ') + ' et ' + mots[mots.length - 1] : mots[0];
        return qcm({ visuel: '🧱', enonce: `Quel nombre fait ${txtP} ?`, dire: `Quel nombre fait ${txtP} ?` }, n, f);
      }
      const termes = parts.map(p => p[2]), ordre = Math.random() < .35 ? melange(termes) : termes;
      return qcm({ visuel: gros(ordre.join(' + ') + ' = ?'), enonce: 'Quel nombre obtiens-tu ?', dire: `${ordre.join(' plus ')}, quel nombre obtiens-tu ?` }, n, f);
    }
    const mots = enLettres(n);
    return qcm({ visuel: '✍️', enonce: `Écris en chiffres :<br>${phrase(mots)}`, dire: `Écris en chiffres le nombre : ${mots}.` }, n, proches);
  };

  // ---- Comparer et ranger
  const troisChiffres = () => {
    const ch = melange([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]).slice(0, 3);
    if (ch[0] === 0) [ch[0], ch[1]] = [ch[1], ch[0]];
    return ch;
  };
  const genComparer = () => {
    const t = alea(0, 3);
    if (t === 0) {
      const vals = new Set();
      if (Math.random() < .5) {
        const ch = troisChiffres();
        const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map(p => p.map(i => ch[i])).filter(p => p[0] !== 0);
        melange(perms).slice(0, 4).forEach(p => vals.add(p[0] * 100 + p[1] * 10 + p[2]));
      } else {
        const c = alea(1, 9) * 100;
        while (vals.size < 4) vals.add(c + alea(0, 99));
      }
      const v = [...vals], grand = Math.random() < .5, bon = grand ? Math.max(...v) : Math.min(...v);
      const q = `Quel est le plus ${grand ? 'grand' : 'petit'} nombre ?`;
      return qcm({ visuel: '🐊', enonce: q, dire: q }, bon, v.filter(x => x !== bon));
    }
    if (t === 1) {
      const a = alea(100, 999);
      let b, gauche, dit;
      if (Math.random() < .3) {
        b = Math.random() < .5 ? a : a + pioche([-10, 10, -1, 1, 90, -90]);
        const c = Math.floor(b / 100), d = Math.floor(b / 10) % 10, u = b % 10;
        const termes = [c * 100, d * 10, u].filter(Boolean);
        gauche = termes.join(' + '); dit = termes.join(' plus ');
        const val = c * 100 + d * 10 + u;
        const bonne = val < a ? '<' : val > a ? '>' : '=';
        return { visuel: gros(`${gauche} … ${a}`), enonce: 'Quel signe faut-il mettre ?',
          dire: `Quel signe faut-il mettre entre ${dit}, et ${a} ? Plus petit que, égal, ou plus grand que ?`, choix: ['<', '=', '>'], bonne };
      }
      do { b = Math.random() < .5 ? a + alea(-30, 30) : +String(a).split('').reverse().join(''); } while (b === a || b < 100 || b > 999);
      const bonne = a < b ? '<' : '>';
      return { visuel: gros(`${a} … ${b}`), enonce: 'Quel signe faut-il mettre ?',
        dire: `Quel signe faut-il mettre entre ${a} et ${b} ? Plus petit que, égal, ou plus grand que ?`, choix: ['<', '=', '>'], bonne };
    }
    if (t === 2) {
      const vals = new Set(), c = alea(1, 8);
      while (vals.size < 3) vals.add(Math.random() < .6 ? c * 100 + alea(0, 99) : alea(100, 999));
      const v = [...vals], croissant = Math.random() < .6, sg = croissant ? ' < ' : ' > ';
      const tri = [...v].sort((x, y) => croissant ? x - y : y - x);
      const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map(p => p.map(i => v[i]).join(sg));
      const q = croissant ? 'Range du plus petit au plus grand.' : 'Range du plus grand au plus petit.';
      return qcm({ visuel: gros(melange(v).join(' · ')), enonce: q, dire: croissant ? 'Range ces nombres du plus petit au plus grand.' : 'Range ces nombres du plus grand au plus petit.' },
        tri.join(sg), perms);
    }
    let n; do { n = alea(101, 989); } while (n % 10 === 0);
    const c = Math.floor(n / 100) * 100, lo = Math.floor(n / 10) * 10;
    const e = (a, b) => `${a} et ${b}`;
    if (Math.random() < .55) {
      const q = `Entre quelles dizaines se trouve ${n} ?`;
      return qcm({ visuel: gros(`… < ${n} < …`), enonce: q, dire: q }, e(lo, lo + 10), [e(lo - 10, lo), e(lo + 10, lo + 20), e(lo - 20, lo - 10), e(lo + 20, lo + 30)].filter(x => !/^-/.test(x)));
    }
    const q = `Entre quelles centaines se trouve ${n} ?`;
    return qcm({ visuel: gros(`… < ${n} < …`), enonce: q, dire: q }, e(c, c + 100), [e(c - 100, c), e(c + 100, c + 200), e(c - 200, c - 100), e(c + 200, c + 300)].filter(x => !/^-/.test(x) && !/ 1[1-9]00$/.test(x)));
  };

  // ---- Suites et droite graduée
  const genSuites = () => {
    const t = alea(0, 2);
    if (t === 0) {
      const pas = pioche([2, 5, 10, 10, 100, -1, -10, 20]);
      const mini = pas < 0 ? -4 * pas + 10 : 0, maxi = pas < 0 ? 999 : 999 - 4 * pas;
      let depart = alea(mini, maxi);
      if (pas === 5 || pas === 20) depart -= depart % 5;
      if (pas === 2) depart -= depart % 2;
      const suite = [0, 1, 2, 3, 4].map(i => depart + i * pas), trou = alea(1, 4), bon = suite[trou];
      const aff = suite.map((x, i) => i === trou ? '?' : x).join(', ');
      return qcm({ visuel: gros(aff), enonce: 'Quel nombre manque ?', dire: `Voici une suite de nombres : ${suite.map((x, i) => i === trou ? 'point d\'interrogation' : x).join(', ')}. Quel nombre manque ?` },
        bon, [bon + 1, bon - 1, bon + 10, bon - 10, bon + pas * 2, bon + 100].filter(x => x >= 0 && x !== bon));
    }
    if (t === 1) {
      const pas = pioche([1, 10, 100]);
      const depart = pas === 1 ? alea(10, 98) * 10 : pas === 10 ? alea(0, 9) * 100 : 0;
      const k = pioche([1, 2, 3, 4, 6, 7, 8, 9]), bon = depart + k * pas;
      const x0 = 12, L = 196;
      let s = `<line x1="${x0 - 6}" y1="30" x2="${x0 + L + 6}" y2="30" stroke="#333" stroke-width="2"/>`;
      for (let i = 0; i <= 10; i++) {
        const x = x0 + i * L / 10;
        s += `<line x1="${r1(x)}" y1="${i % 5 ? 25 : 22}" x2="${r1(x)}" y2="${i % 5 ? 35 : 38}" stroke="#333" stroke-width="${i % 5 ? 1.2 : 2}"/>`;
        if (i % 5 === 0) s += txt(r1(x), 48, depart + i * pas, 9);
      }
      const xk = r1(x0 + k * L / 10);
      s += `<polygon points="${xk - 5},6 ${xk + 5},6 ${xk},16" fill="#e5484d"/>` + txt(xk, 2.5, '?', 7, '#e5484d');
      const f = [bon + pas, bon - pas, depart + k, bon + 2 * pas, bon - 2 * pas, bon + 5 * pas].filter(x => x >= 0 && x !== bon);
      return qcm({ visuel: dessin(s, 220, 56, 320), enonce: 'Quel nombre montre la flèche rouge ?', dire: 'Regarde la droite graduée. Quel nombre montre la flèche rouge ?',
        aide: 'Compte de combien on avance à chaque petit trait.' }, bon, f);
    }
    const apres = Math.random() < .5;
    let n;
    if (apres) n = pioche([alea(1, 9) * 100 - 1, alea(10, 99) * 10 + 9, alea(100, 998)]);
    else n = pioche([alea(1, 9) * 100, alea(10, 99) * 10, alea(101, 999)]);
    const bon = apres ? n + 1 : n - 1;
    const q = apres ? `Quel nombre vient juste après ${n} ?` : `Quel nombre vient juste avant ${n} ?`;
    return qcm({ visuel: gros(apres ? `${n} ➜ ?` : `? ➜ ${n}`), enonce: q, dire: q }, bon, [apres ? n - 1 : n + 1, bon + 10, bon - 10, bon + 100, bon + (apres ? 1 : -1)].filter(x => x >= 0 && x !== bon && x < 1001));
  };

  // ---- Additions et soustractions
  const posee = (a, b, op) => {
    const w = Math.max(String(a).length, String(b).length);
    const pad = n => String(n).padStart(w, ' ');
    return `<div style="display:inline-block;font-family:monospace;font-size:.72em;line-height:1.2;text-align:right;white-space:pre"> ${pad(a)}<br><span style="display:inline-block;border-bottom:4px solid currentColor">${op}${pad(b)}</span><br> ${' '.repeat(w - 1)}?</div>`;
  };
  const addSansRetenue = (a, b) => { let r = 0, m = 1; while (a || b) { r += ((a % 10 + b % 10) % 10) * m; a = Math.floor(a / 10); b = Math.floor(b / 10); m *= 10; } return r; };
  const petitDuGrand = (a, b) => { let r = 0, m = 1; while (a || b) { r += Math.abs(a % 10 - b % 10) * m; a = Math.floor(a / 10); b = Math.floor(b / 10); m *= 10; } return r; };
  const genAdditions = () => {
    const t = alea(0, 3);
    let a, b;
    if (t === 0) do { a = alea(15, 78); b = alea(12, 99 - a); } while (a % 10 + b % 10 < 10);
    else if (t === 1) do { a = alea(105, 890); b = alea(12, 99); } while (a % 10 + b % 10 < 10 || a + b > 999);
    else if (t === 2) do { a = alea(105, 700); b = alea(105, 700); } while (a + b > 999 || (a % 10 + b % 10 < 10 && (a % 100) + (b % 100) < 100));
    else { a = alea(110, 800); b = pioche([alea(1, 9) * 10, alea(1, 9) * 100, alea(11, 19) * 10]); if (a + b > 999) a = alea(110, 999 - b); }
    const r = a + b, enLigne = t === 3 || Math.random() < .35;
    const f = [addSansRetenue(a, b), r + 10, r - 10, r + 1, r - 1, r + 100].filter(x => x !== r && x > 0);
    return qcm({ visuel: enLigne ? gros(`${a} + ${b}`) : posee(a, b, '+'), enonce: enLigne ? `${a} + ${b} = ?` : 'Combien fait cette addition ?',
      dire: `${a} plus ${b}, ça fait combien ?`, aide: enLigne ? '' : 'Commence par les unités, et n\'oublie pas les retenues.' }, r, f);
  };
  const genSoustractions = () => {
    const t = alea(0, 3);
    let a, b;
    if (t === 0) do { a = alea(31, 99); b = alea(12, a - 5); } while (a % 10 >= b % 10);
    else if (t === 1) do { a = alea(120, 999); b = alea(12, 99); } while (a % 10 >= b % 10);
    else if (t === 2) do { a = alea(300, 999); b = alea(105, a - 50); } while (a % 10 >= b % 10 && a % 100 >= b % 100);
    else { a = alea(210, 999); b = pioche([alea(1, 9) * 10, alea(1, Math.floor(a / 100) - 1) * 100]); if (b >= a) b = 100; }
    const r = a - b, enLigne = t === 3 || Math.random() < .35;
    const f = [petitDuGrand(a, b), r + 10, r - 10, r + 1, r - 1, a + b].filter(x => x !== r && x >= 0);
    return qcm({ visuel: enLigne ? gros(`${a} − ${b}`) : posee(a, b, '−'), enonce: enLigne ? `${a} − ${b} = ?` : 'Combien fait cette soustraction ?',
      dire: `${a} moins ${b}, ça fait combien ?`, aide: enLigne ? '' : 'Si le chiffre du haut est trop petit, pense à la retenue.' }, r, f);
  };

  // ---- Calcul mental
  const genCalculMental = () => {
    const t = alea(0, 6);
    if (t === 0) {
      const n = pioche([alea(6, 49), alea(11, 45), alea(1, 9) * 10, alea(1, 4) * 100, pioche([15, 25, 35, 45, 150, 250])]), r = 2 * n;
      return qcm({ visuel: gros(`double de ${n}`), enonce: `Quel est le double de ${n} ?`, dire: `Quel est le double de ${n} ?` }, r, [r + 2, r - 2, r + 10, r - 10, n + 2, n].filter(x => x > 0 && x !== r));
    }
    if (t === 1) {
      const n = pioche([alea(2, 50) * 2, alea(1, 9) * 20, pioche([30, 50, 70, 90, 100, 200, 400, 600])]), r = n / 2;
      return qcm({ visuel: gros(`moitié de ${n}`), enonce: `Quelle est la moitié de ${n} ?`, dire: `Quelle est la moitié de ${n} ?` }, r, [r + 1, r - 1, r + 5, r + 10, r - 10, n * 2].filter(x => x > 0 && x !== r && Number.isInteger(x)));
    }
    if (t === 2) {
      if (Math.random() < .55) {
        const n = alea(1, 9) * 10, r = 100 - n;
        return qcm({ visuel: gros(`${n} + ? = 100`), enonce: `Combien faut-il ajouter à ${n} pour faire 100 ?`, dire: `Combien faut-il ajouter à ${n} pour faire 100 ?` }, r, [r + 10, r - 10, 10 - n / 10, r + 1].filter(x => x > 0 && x !== r));
      }
      let n; do { n = alea(11, 89); } while (n % 10 === 0);
      const r = 100 - n, err = (10 - n % 10) * 10 + (10 - Math.floor(n / 10));
      return qcm({ visuel: gros(`${n} + ? = 100`), enonce: `Combien faut-il ajouter à ${n} pour faire 100 ?`, dire: `Combien faut-il ajouter à ${n} pour faire 100 ?` }, r, [err, r + 10, r - 10, r + 1, r - 1].filter(x => x > 0 && x !== r));
    }
    if (t === 3) {
      let n; do { n = alea(12, 98); } while (n % 10 === 0);
      const d = Math.ceil(n / 10) * 10, r = d - n;
      return qcm({ visuel: gros(`${n} + ? = ${d}`), enonce: `Combien faut-il ajouter à ${n} pour arriver à ${d} ?`, dire: `Combien faut-il ajouter à ${n} pour arriver à ${d} ?` }, r, [r + 1, r - 1, r + 10, 10 - r].filter(x => x > 0 && x !== r));
    }
    if (t === 4) {
      const k = pioche([10, 100]), plus = Math.random() < .5;
      const n = plus ? alea(101, 999 - k) : alea(100 + k, 999), r = plus ? n + k : n - k;
      return qcm({ visuel: gros(`${n} ${plus ? '+' : '−'} ${k}`), enonce: `${n} ${plus ? '+' : '−'} ${k} = ?`, dire: `${n} ${plus ? 'plus' : 'moins'} ${k}, ça fait combien ?` },
        r, [plus ? n + 1 : n - 1, plus ? n + (110 - k) : n - (110 - k), r + (plus ? 1 : -1), plus ? r + 10 : r - 10].filter(x => x > 0 && x !== r));
    }
    if (t === 5) {
      const plus = Math.random() < .6, n = plus ? alea(12, 89) : alea(21, 99), r = plus ? n + 9 : n - 9;
      return qcm({ visuel: gros(`${n} ${plus ? '+' : '−'} 9`), enonce: `${n} ${plus ? '+' : '−'} 9 = ?`, dire: `${n} ${plus ? 'plus' : 'moins'} 9, ça fait combien ?`, aide: plus ? 'Astuce : + 10, puis − 1.' : 'Astuce : − 10, puis + 1.' },
        r, [r + 1, r - 1, plus ? n + 10 : n - 10, r + 2].filter(x => x !== r));
    }
    const big = Math.random() < .4, u = big ? 100 : 10;
    const a = alea(1, 8), b = alea(1, big ? 9 - a : 9), plus = Math.random() < .65;
    const [x, y] = plus ? [a * u, b * u] : [Math.max(a, b) * u + (a === b ? u : 0), Math.min(a, b) * u];
    const r = plus ? x + y : x - y;
    return qcm({ visuel: gros(`${x} ${plus ? '+' : '−'} ${y}`), enonce: `${x} ${plus ? '+' : '−'} ${y} = ?`, dire: `${x} ${plus ? 'plus' : 'moins'} ${y}, ça fait combien ?` },
      r, [r + u, r - u, r / u, r * 10, r + 1].filter(v => v > 0 && v !== r && Number.isInteger(v)));
  };

  // ---- La multiplication
  const genMultiplication = () => {
    const t = alea(0, 3);
    if (t === 0) {
      const r = alea(2, 5), c = alea(2, 6), [e, nom] = pioche(OBJETS_NOMS);
      const vis = petit(Array.from({ length: r }, () => e.repeat(c)).join('<br>'), '.45em');
      if (Math.random() < .5) {
        const q = `Combien de ${nom} en tout ?`;
        return qcm({ visuel: vis, enonce: q, dire: `Il y a ${r} rangées de ${c} ${nom}. Combien de ${nom} en tout ?` }, r * c, [r + c, r * c + c, r * c - c, r * c + 1, r * c - 1].filter(x => x > 0));
      }
      return qcm({ visuel: vis, enonce: 'Quelle multiplication correspond au dessin ?', dire: `Il y a ${r} rangées de ${c} ${nom}. Quelle multiplication correspond au dessin ?` },
        `${r} × ${c}`, [`${r} + ${c}`, `${r} × ${r}`, `${c} × ${c}`, `${r + 1} × ${c}`, `${r} × ${c + 1}`]);
    }
    if (t === 1) {
      const n = pioche([2, 3, 4, 5, 10]), k = alea(2, 5), somme = Array(k).fill(n).join(' + ');
      if (Math.random() < .5) {
        return qcm({ visuel: gros(somme), enonce: 'Quelle multiplication est égale à cette addition ?', dire: `${Array(k).fill(n).join(' plus ')}. Quelle multiplication est égale à cette addition ?` },
          `${k} × ${n}`, [`${n} + ${k}`, `${k} × ${k}`, `${n} × ${n}`, `${k + 1} × ${n}`, `${k - 1} × ${n}`].filter(x => x !== `${n} × ${k}`));
      }
      return qcm({ visuel: gros(`${k} × ${n}`), enonce: `${k} × ${n} = ?`, dire: `${k} fois ${n}, ça fait combien ?`, aide: `C'est ${somme}.` }, k * n, [k + n, k * n + n, k * n - n, k * n + 1].filter(x => x > 0 && x !== k * n));
    }
    const a = pioche([2, 3, 4, 5, 10]), b = alea(1, 10), r = a * b, [x, y] = Math.random() < .5 ? [a, b] : [b, a];
    return qcm({ visuel: '✖️', enonce: `${x} × ${y} = ?`, dire: `${x} fois ${y}, ça fait combien ?` }, r, [r + a, r - a, a + b, r + 1, r - 1, r + b].filter(v => v > 0 && v !== r));
  };

  // ---- Problèmes
  const genProblemes = () => {
    const [nom, pr] = pioche(PRENOMS), Pr = pr === 'il' ? 'Il' : 'Elle';
    const t = alea(0, 7);
    let q, r, f, v;
    if (t === 0) {
      const a = alea(120, 480), b = alea(110, 999 - a - 10); r = a + b;
      q = `Au zoo, il y a eu ${a} visiteurs le matin et ${b} visiteurs l'après-midi. Combien de visiteurs y a-t-il eu dans la journée ?`;
      f = [Math.abs(a - b), r + 10, r - 10, r + 100, r - 100]; v = '🦁';
    } else if (t === 1) {
      const a = alea(45, 99), b = alea(12, a - 10); r = a - b;
      q = `${nom} a ${a} images. ${Pr} en donne ${b} à son ami. Combien d'images lui reste-t-il ?`;
      f = [a + b, r + 1, r - 1, r + 10, r - 10]; v = '🖼️';
    } else if (t === 2) {
      const a = alea(122, 140), b = alea(98, a - 5); r = a - b;
      q = `${nom} mesure ${a} cm. Son petit frère mesure ${b} cm. De combien de centimètres ${nom} est-${pr} plus grand${pr === 'elle' ? 'e' : ''} que son frère ?`;
      f = [a + b, r + 1, r - 1, r + 10]; v = '📏';
    } else if (t === 3) {
      const k = pioche([2, 3, 4, 5, 10]), n = alea(2, 9), [e, obj] = pioche([['✏️', 'crayons'], ['🧁', 'gâteaux'], ['🔵', 'billes'], ['🍬', 'bonbons']]); r = n * k;
      q = `Il y a ${n} boîtes. Dans chaque boîte, il y a ${k} ${obj}. Combien de ${obj} y a-t-il en tout ?`;
      f = [n + k, r + k, r - k, r + 1]; v = e;
    } else if (t === 4) {
      const k = pioche([2, 3, 4, 5, 10]), qq = alea(2, 10), tot = k * qq; r = qq;
      q = `On partage ${tot} bonbons entre ${k} enfants. Chacun reçoit le même nombre de bonbons. Combien de bonbons chaque enfant reçoit-il ?`;
      f = [tot - k, qq + 1, qq - 1, qq + 2, tot + k]; v = '🍬';
    } else if (t === 5) {
      const a = alea(20, 60), g = alea(5, 30), b = a + g; r = g;
      q = `${nom} avait ${a} billes. Après la récréation, ${pr} en a ${b}. Combien de billes a-t-${pr} gagnées ?`;
      f = [a + b, g + 1, g - 1, g + 10]; v = '🔵';
    } else if (t === 6) {
      const p1 = alea(4, 19), p2 = alea(2, 9); r = p1 + p2;
      q = `${nom} achète un livre à ${p1} € et un stylo à ${p2} €. Combien paie-t-${pr} en tout ?`;
      const res = qcm({ visuel: '🛒', enonce: q, dire: q }, `${r} €`, [p1 - p2, r + 1, r - 1, r + 10].filter(x => x > 0 && x !== r).map(x => `${x} €`));
      return res;
    } else {
      const a = alea(20, 40), d = alea(3, 9), m = alea(3, 9); r = a - d + m;
      q = `Dans le bus, il y a ${a} passagers. À l'arrêt, ${d} passagers descendent et ${m} passagers montent. Combien de passagers y a-t-il maintenant ?`;
      f = [a + d + m, a - d - m, r + 1, r - 1]; v = '🚌';
    }
    return qcm({ visuel: v, enonce: q, dire: q }, r, f.filter(x => x > 0 && x !== r));
  };

  // ---- Euros et centimes
  const argent = (v, cx, cy) => {
    const t = (s, taille, coul = '#222') => txt(cx, cy, s, taille, coul);
    if (v >= 500) {
      const coul = { 500: '#b9c2bd', 1000: '#e8907f', 2000: '#8fb3e8', 5000: '#f2b45f' }[v];
      return `<rect x="${cx - 24}" y="${cy - 14}" width="48" height="28" rx="3" fill="${coul}" stroke="#555"/>` + t(`${v / 100} €`, 10);
    }
    const r = { 1: 9, 2: 10, 5: 11, 10: 11, 20: 12, 50: 13, 100: 13, 200: 14 }[v];
    if (v === 100) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#e0b64a" stroke="#8a6d1f"/><circle cx="${cx}" cy="${cy}" r="${r - 4}" fill="#d4d4d4"/>` + t('1 €', 7);
    if (v === 200) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#d4d4d4" stroke="#777"/><circle cx="${cx}" cy="${cy}" r="${r - 4}" fill="#e0b64a"/>` + t('2 €', 7.5);
    const cuivre = v <= 5;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${cuivre ? '#d08a5b' : '#e8c45a'}" stroke="${cuivre ? '#8a4f2a' : '#9a7a1f'}"/>` + t(`${v} c`, 7);
  };
  const dessinArgent = items => {
    const lignes = Math.ceil(items.length / 4);
    return dessin(items.map((v, i) => argent(v, 30 + (i % 4) * 60, 22 + Math.floor(i / 4) * 40)).join(''), 240, lignes * 40 + 4, 300);
  };
  const somme = t => { const e = Math.floor(t / 100), c = t % 100; return e && c ? `${e} € ${c} centimes` : e ? `${e} €` : `${c} centimes`; };
  const genMonnaie = () => {
    const t = alea(0, 4);
    if (t <= 2) {
      const pool = t === 0 ? [100, 200, 500, 1000, 2000, 5000] : t === 1 ? [1, 2, 5, 10, 20, 50] : [100, 200, 10, 20, 50];
      let items, total;
      do {
        items = Array.from({ length: alea(3, t === 0 ? 5 : 6) }, () => pioche(pool));
        total = items.reduce((a, b) => a + b, 0);
      } while ((t === 0 && total > 10000) || (t === 1 && total >= 100) || (t === 2 && (total % 100 === 0 || total < 100 || total > 900)));
      items.sort((a, b) => b - a);
      const pas = t === 0 ? [100, 500, 1000, -100, 200] : t === 1 ? [1, 5, 10, -1, -10] : [10, 100, -10, -100, 20];
      const f = pas.map(p => total + p).filter(x => x > 0).map(somme);
      if (t === 2) f.push(`${Math.floor(total / 100) + total % 100} €`);
      const q = t === 1 ? 'Combien de centimes en tout ?' : 'Combien d\'argent en tout ?';
      return qcm({ visuel: dessinArgent(items), enonce: q, dire: t === 1 ? 'Combien de centimes y a-t-il en tout ?' : 'Combien d\'argent y a-t-il en tout ?', aide: 'c = centimes · 1 € = 100 centimes' }, somme(total), f);
    }
    if (t === 3) {
      const k = pioche([0, 1, 2, 3]);
      if (k === 0) { const e = alea(2, 9); return qcm({ visuel: '💶', enonce: `${e} € = ? centimes`, dire: `${e} euro${e > 1 ? 's' : ''}, ça fait combien de centimes ?` }, e * 100, [e * 10, e * 1000, e, e * 100 + 10].map(sp)); }
      if (k === 1) { const e = alea(2, 9); return qcm({ visuel: '🪙', enonce: `${e * 100} centimes = ? €`, dire: `${e * 100} centimes, ça fait combien d'euros ?` }, `${e} €`, [`${e * 10} €`, `${e * 100} €`, `${e + 1} €`]); }
      if (k === 2) { const e = alea(1, 5), c = pioche([10, 20, 30, 40, 50, 60, 70, 80, 90]); return qcm({ visuel: '💶', enonce: `${e} € et ${c} centimes = ? centimes`, dire: `${e} euro${e > 1 ? 's' : ''} et ${c} centimes, ça fait combien de centimes ?` }, e * 100 + c, [e + c, e * 10 + c, e * 1000 + c, (e + 1) * 100 + c]); }
      const c = pioche([10, 20, 50]), n = 100 / c;
      return qcm({ visuel: argent(c, 20, 20).replace(/^/, '<svg width="80" height="80" viewBox="0 0 40 40">') + '</svg>', enonce: `Combien de pièces de ${c} centimes faut-il pour faire 1 € ?`, dire: `Combien de pièces de ${c} centimes faut-il pour faire 1 euro ?` },
        n, [n + 1, n - 1, c, 100].filter(x => x > 0 && x !== n));
    }
    const billet = pioche([5, 10, 20]), prix = alea(1, billet - 1), r = billet - prix;
    const [objet, e] = pioche([['un livre', '📕'], ['une glace', '🍦'], ['un ballon', '⚽'], ['un jeu', '🧩'], ['une petite voiture', '🚗'], ['un pot de fleurs', '🌷']]);
    const q = `Tu achètes ${objet} à ${prix} €. Tu paies avec un billet de ${billet} €. Combien la marchande te rend-elle ?`;
    return qcm({ visuel: e, enonce: q, dire: q }, `${r} €`, [prix, r + 1, r - 1, billet + prix, r + 2].filter(x => x > 0 && x !== r).map(x => `${x} €`));
  };

  // ---- L'heure (heures, demies, quarts)
  const horloge = (h, m) => {
    const pt = (deg, l) => { const a = deg * Math.PI / 180; return [(50 + l * Math.sin(a)).toFixed(1), (50 - l * Math.cos(a)).toFixed(1)]; };
    let s = '<circle cx="50" cy="50" r="46" fill="#fff" stroke="#333" stroke-width="3"/>';
    for (let i = 0; i < 60; i++) {
      const [x1, y1] = pt(i * 6, 44), [x2, y2] = pt(i * 6, i % 5 ? 42.5 : 40.5);
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#333" stroke-width="${i % 5 ? .6 : 1.5}"/>`;
    }
    for (let i = 1; i <= 12; i++) { const [x, y] = pt(i * 30, 34); s += txt(x, y, i, 10); }
    const [hx, hy] = pt(((h % 12) + m / 60) * 30, 21), [mx, my] = pt(m * 6, 34);
    s += `<line x1="50" y1="50" x2="${mx}" y2="${my}" stroke="#1d4ed8" stroke-width="3" stroke-linecap="round"/>`;
    s += `<line x1="50" y1="50" x2="${hx}" y2="${hy}" stroke="#e5484d" stroke-width="5" stroke-linecap="round"/>`;
    s += '<circle cx="50" cy="50" r="3" fill="#333"/>';
    return svg(s, 200);
  };
  const HMOTS = ['', 'une', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze'];
  const hMots = h => `${HMOTS[h]} heure${h > 1 ? 's' : ''}`;
  const enMots = (h, m) => m === 0 ? hMots(h) : m === 15 ? hMots(h) + ' et quart' : m === 30 ? hMots(h) + ' et demie' : hMots(h + 1) + ' moins le quart';
  const hNum = (h, m) => m ? `${h} h ${m}` : `${h} h`;
  const h12 = h => ((h - 1) % 12 + 12) % 12 + 1;
  const genHeure = () => {
    const t = alea(0, 3);
    const m = pioche([0, 15, 30, 45]);
    if (t === 0) {
      const h = alea(1, 12);
      const f = [0, 15, 30, 45].filter(x => x !== m).map(x => hNum(h, x));
      f.push(hNum(h12(h + 1), m), hNum(h12(h - 1), m));
      if (m) f.push(hNum(m / 5, (h * 5) % 60));
      return qcm({ visuel: horloge(h, m), enonce: 'Quelle heure est-il ?', dire: 'Regarde l\'horloge. Quelle heure est-il ?',
        aide: 'Petite aiguille rouge : les heures. Grande aiguille bleue : les minutes.' }, hNum(h, m), f);
    }
    if (t === 1) {
      const h = alea(1, 10);
      const f = [0, 15, 30, 45].filter(x => x !== m).map(x => enMots(h, x));
      if (h > 1) f.push(enMots(h - 1, m));
      if (h < 10) f.push(enMots(h + 1, m));
      return qcm({ visuel: horloge(h, m), enonce: 'Quelle heure est-il ?', dire: 'Regarde l\'horloge. Quelle heure est-il ?',
        aide: 'Petite aiguille rouge : les heures. Grande aiguille bleue : les minutes.' }, enMots(h, m), f);
    }
    if (t === 2) {
      const h = alea(1, 10), m0 = pioche([0, 15, 30]);
      const [ajout, dit] = pioche([[15, 'un quart d\'heure'], [30, 'une demi-heure'], [60, 'une heure']]);
      const fmt = x => hNum(h12(Math.floor(x / 60)), x % 60);
      const d = h * 60 + m0, r = d + ajout;
      const q = `Il est ${hNum(h, m0)}. Quelle heure sera-t-il dans ${dit} ?`;
      return qcm({ visuel: horloge(h, m0), enonce: q, dire: q }, fmt(r), [r + 15, r - 15, r + 30, r + 60, d].filter(x => x !== r).map(fmt));
    }
    const [q, b] = pioche([['Combien de minutes y a-t-il dans une heure ?', '60 minutes'], ['Combien de minutes dure une demi-heure ?', '30 minutes'],
      ['Combien de minutes dure un quart d\'heure ?', '15 minutes'], ['Combien de minutes durent trois quarts d\'heure ?', '45 minutes'],
      ['Combien de minutes durent deux heures ?', '120 minutes']]);
    return qcm({ visuel: '⏱️', enonce: q, dire: q }, b, ['15 minutes', '30 minutes', '45 minutes', '60 minutes', '100 minutes', '120 minutes']);
  };

  // ---- Longueurs et masses
  const regle = (debut, L, coul) => {
    const u = 16, x0 = 14;
    let s = `<rect x="4" y="36" width="${u * 13 + 20}" height="30" rx="2" fill="#f6e7b0" stroke="#b08d2f"/>`;
    for (let i = 0; i <= 13; i++) {
      const x = x0 + i * u;
      s += `<line x1="${x}" y1="36" x2="${x}" y2="48" stroke="#333" stroke-width="1"/>` + txt(x, 56, i, 7);
      if (i < 13) s += `<line x1="${x + u / 2}" y1="36" x2="${x + u / 2}" y2="42" stroke="#333" stroke-width=".6"/>`;
    }
    const xa = x0 + debut * u, xb = x0 + (debut + L) * u;
    s += `<rect x="${xa}" y="12" width="${xb - xa - 9}" height="14" fill="${coul}" stroke="#333"/><polygon points="${xb - 9},12 ${xb},19 ${xb - 9},26" fill="#f3d9a4" stroke="#333"/>`;
    s += `<line x1="${xa}" y1="26" x2="${xa}" y2="36" stroke="#e5484d" stroke-dasharray="2 2"/><line x1="${xb}" y1="19" x2="${xb}" y2="36" stroke="#e5484d" stroke-dasharray="2 2"/>`;
    return dessin(s, 13 * u + 28, 70, 330);
  };
  const UNITES = [
    ['la longueur d\'un crayon', 'centimètres'], ['la hauteur d\'un immeuble', 'mètres'], ['la longueur d\'une piscine', 'mètres'],
    ['la largeur d\'un cahier', 'centimètres'], ['la longueur d\'une gomme', 'centimètres'], ['la longueur d\'un camion', 'mètres'],
    ['la longueur de ton doigt', 'centimètres'], ['la longueur d\'un terrain de football', 'mètres'],
    ['la masse d\'une pomme', 'grammes'], ['la masse d\'un bonbon', 'grammes'], ['la masse d\'une lettre', 'grammes'], ['la masse d\'une gomme', 'grammes'],
    ['la masse d\'un sac de pommes de terre', 'kilogrammes'], ['la masse d\'un chien', 'kilogrammes'], ['la masse d\'une valise pleine', 'kilogrammes'], ['la masse d\'un enfant', 'kilogrammes']
  ];
  const genMesures = () => {
    const t = alea(0, 3);
    if (t === 0) {
      const debut = Math.random() < .65 ? 0 : alea(1, 3), L = alea(3, 12 - debut);
      const f = [debut + L, L + 1, L - 1, L + 2].filter(x => x > 0 && x !== L).map(x => `${x} cm`);
      return qcm({ visuel: regle(debut, L, pioche(['#e5484d', '#4f8ef7', '#3bb273', '#8e5cd9', '#f5a623'])), enonce: 'Combien mesure ce crayon ?', dire: 'Regarde la règle. Combien mesure ce crayon ?',
        aide: debut ? 'Attention : le crayon ne commence pas au 0 !' : '' }, `${L} cm`, f);
    }
    if (t === 1) {
      const [quoi, bon] = pioche(UNITES);
      const q = `Pour mesurer ${quoi}, quelle unité choisis-tu ?`;
      return qcm({ visuel: /masse/.test(quoi) ? '⚖️' : '📏', enonce: q, dire: q }, bon, ['mètres', 'centimètres', 'kilogrammes', 'grammes']);
    }
    if (t === 2) {
      const k = alea(0, 4), n = alea(1, 9);
      if (k === 0) return qcm({ visuel: '📏', enonce: `${n} m = ? cm`, dire: `${n} mètre${n > 1 ? 's' : ''}, combien de centimètres ?` }, sp(n * 100), [n * 10, n * 1000, n, n * 100 + 10].map(sp));
      if (k === 1) return qcm({ visuel: '⚖️', enonce: `${n} kg = ? g`, dire: `${n} kilogramme${n > 1 ? 's' : ''}, combien de grammes ?` }, sp(n * 1000), [n * 100, n * 10, n * 10000, n].map(sp));
      if (k === 2) { const c = alea(1, 9) * 10; return qcm({ visuel: '📏', enonce: `1 m ${c} cm = ? cm`, dire: `1 mètre et ${c} centimètres, combien de centimètres ?` }, sp(100 + c), [1 + c, 10 + c, 1000 + c, 200 + c].map(sp)); }
      if (k === 3) return qcm({ visuel: '📏', enonce: `${n * 100} cm = ? m`, dire: `${n * 100} centimètres, combien de mètres ?` }, `${n} m`, [`${n * 10} m`, `${n * 100} m`, `${n + 1} m`]);
      return qcm({ visuel: '⚖️', enonce: `${sp(n * 1000)} g = ? kg`, dire: `${n * 1000} grammes, combien de kilogrammes ?` }, `${n} kg`, [`${n * 10} kg`, `${n * 100} kg`, `${n + 1} kg`]);
    }
    const masse = Math.random() < .45, grand = Math.random() < .5;
    const vals = new Set();
    if (masse) {
      vals.add(1000 * alea(1, 2));
      while (vals.size < 4) vals.add(alea(1, 19) * 100);
    } else {
      vals.add(100 * alea(1, 3));
      while (vals.size < 4) vals.add(alea(3, 29) * 10);
    }
    const v = [...vals], bon = grand ? Math.max(...v) : Math.min(...v);
    const aff = x => masse ? (x % 1000 ? `${sp(x)} g` : `${x / 1000} kg`) : (x % 100 ? `${x} cm` : `${x / 100} m`);
    const q = masse ? `Quelle est la masse la plus ${grand ? 'lourde' : 'légère'} ?` : `Quelle est la longueur la plus ${grand ? 'grande' : 'petite'} ?`;
    return qcm({ visuel: masse ? '⚖️' : '📏', enonce: q, dire: q, aide: masse ? '1 kg = 1 000 g' : '1 m = 100 cm' }, aff(bon), v.filter(x => x !== bon).map(aff));
  };

  // ---- Géométrie
  const COULEURS = ['#e5484d', '#4f8ef7', '#3bb273', '#f5a623', '#8e5cd9', '#d94f9c'];
  const trait = 'stroke="#333" stroke-width="2" stroke-linejoin="round"';
  const forme = f => {
    const c = pioche(COULEURS), st = `fill="${c}" ${trait}`, rot = Math.random() < .35 ? alea(-30, 30) : 0;
    const g = s => rot ? `<g transform="rotate(${rot} 50 50)">${s}</g>` : s;
    if (f === 'carré') { const s = alea(40, 56), o = (100 - s) / 2; return g(`<rect x="${o}" y="${o}" width="${s}" height="${s}" ${st}/>`); }
    if (f === 'rectangle') { const w = alea(64, 76), h = alea(26, 36); return g(`<rect x="${(100 - w) / 2}" y="${(100 - h) / 2}" width="${w}" height="${h}" ${st}/>`); }
    if (f === 'triangle') {
      const pts = pioche([[[50, 14], [86, 82], [14, 82]], [[18, 18], [18, 84], [84, 84]], [[20, 80], [82, 80], [60, 20]], [[14, 20], [86, 20], [50, 84]], [[20, 16], [84, 50], [20, 84]]]);
      return `<polygon points="${pts.map(p => p.join(',')).join(' ')}" ${st}/>`;
    }
    return `<circle cx="50" cy="50" r="${alea(26, 38)}" ${st}/>`;
  };
  const ANGLES_DROITS = [
    [[[20, 25], [80, 25], [80, 75], [20, 75]], 4], [[[30, 15], [70, 15], [70, 85], [30, 85]], 4], [[[20, 80], [80, 80], [20, 25]], 1],
    [[[50, 15], [85, 80], [15, 80]], 0], [[[15, 25], [60, 25], [85, 80], [15, 80]], 2], [[[20, 45], [50, 10], [80, 45], [80, 85], [20, 85]], 2],
    [[[20, 25], [88, 70], [12, 82]], 0], [[[80, 20], [80, 80], [25, 80]], 1], [[[30, 20], [85, 20], [70, 80], [15, 80]], 0]
  ];
  const SOLIDES = {
    'un cube': () => {
      const A = [25, 78], B = [65, 78], C = [65, 38], D = [25, 38], E = [40, 63], F = [80, 63], G = [80, 23], H = [40, 23];
      const p = (...q) => q.map(x => x.join(',')).join(' ');
      return `<polygon points="${p(D, C, G, H)}" fill="#bcd3fb" ${trait}/><polygon points="${p(B, F, G, C)}" fill="#8fb6f9" ${trait}/><polygon points="${p(A, B, C, D)}" fill="#dce8fd" ${trait}/>`
        + `<path d="M${A} L${E} L${F} M${E} L${H}" fill="none" stroke="#333" stroke-width="1.2" stroke-dasharray="3 3"/>`;
    },
    'un pavé': () => {
      const A = [12, 78], B = [70, 78], C = [70, 50], D = [12, 50], E = [30, 62], F = [88, 62], G = [88, 34], H = [30, 34];
      const p = (...q) => q.map(x => x.join(',')).join(' ');
      return `<polygon points="${p(D, C, G, H)}" fill="#f9d9a8" ${trait}/><polygon points="${p(B, F, G, C)}" fill="#f5b86b" ${trait}/><polygon points="${p(A, B, C, D)}" fill="#fde9cc" ${trait}/>`
        + `<path d="M${A} L${E} L${F} M${E} L${H}" fill="none" stroke="#333" stroke-width="1.2" stroke-dasharray="3 3"/>`;
    },
    'une boule': () => `<defs><radialGradient id="boule-ce1" cx="35%" cy="35%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#e5484d"/></radialGradient></defs>`
      + `<circle cx="50" cy="50" r="36" fill="url(#boule-ce1)" ${trait}/><path d="M14 50 A36 10 0 0 0 86 50" fill="none" stroke="#333" stroke-width="1"/><path d="M14 50 A36 10 0 0 1 86 50" fill="none" stroke="#333" stroke-width="1" stroke-dasharray="3 3"/>`,
    'un cylindre': () => `<path d="M25 25 L25 75 A25 8 0 0 0 75 75 L75 25" fill="#bfe8d0" ${trait}/><ellipse cx="50" cy="25" rx="25" ry="8" fill="#e3f6ea" ${trait}/>`
      + `<path d="M25 75 A25 8 0 0 1 75 75" fill="none" stroke="#333" stroke-width="1.2" stroke-dasharray="3 3"/>`,
    'un cône': () => `<path d="M50 12 L22 78 A28 8 0 0 0 78 78 Z" fill="#f7c6e0" ${trait}/><path d="M22 78 A28 8 0 0 1 78 78" fill="none" stroke="#333" stroke-width="1.2" stroke-dasharray="3 3"/>`,
    'une pyramide': () => {
      const A = [18, 82], B = [64, 82], C = [84, 64], D = [38, 64], S = [52, 12];
      const p = (...q) => q.map(x => x.join(',')).join(' ');
      return `<polygon points="${p(S, A, B)}" fill="#fde68a" ${trait}/><polygon points="${p(S, B, C)}" fill="#f5c542" ${trait}/>`
        + `<path d="M${A} L${D} L${C} M${D} L${S}" fill="none" stroke="#333" stroke-width="1.2" stroke-dasharray="3 3"/>`;
    }
  };
  const NOMS_SOLIDES = Object.keys(SOLIDES);
  const FAITS_GEO = [
    { q: 'Combien de faces a un cube ?', v: '🎲', b: '6', f: ['4', '8', '12'] },
    { q: 'Quelle est la forme des faces d\'un cube ?', v: '🎲', b: 'des carrés', f: ['des triangles', 'des cercles', 'des rectangles longs'] },
    { q: 'Combien de sommets a un cube ?', v: '🎲', b: '8', f: ['4', '6', '12'] },
    { q: 'Quel solide peut rouler dans tous les sens ?', b: 'la boule', f: ['le cube', 'le pavé', 'la pyramide'] },
    { q: 'Un dé à jouer a la forme…', v: '🎲', b: 'd\'un cube', f: ['d\'une boule', 'd\'un cylindre', 'd\'une pyramide'] },
    { q: 'Un ballon de football a la forme…', v: '⚽', b: 'd\'une boule', f: ['d\'un cube', 'd\'un pavé', 'd\'un cône'] },
    { q: 'Une boîte de conserve a la forme…', v: '🥫', b: 'd\'un cylindre', f: ['d\'un cube', 'd\'une boule', 'd\'une pyramide'] },
    { q: 'Un carton de déménagement a souvent la forme…', v: '📦', b: 'd\'un pavé', f: ['d\'une boule', 'd\'un cylindre', 'd\'un cône'] },
    { q: 'Un cornet de glace a la forme…', v: '🍦', b: 'd\'un cône', f: ['d\'un cube', 'd\'un pavé', 'd\'une boule'] },
    { q: 'Quel instrument sert à vérifier un angle droit ?', v: '📐', b: 'l\'équerre', f: ['le compas', 'la gomme', 'le taille-crayon'] },
    { q: 'Quel instrument sert à tracer un cercle ?', b: 'le compas', f: ['l\'équerre', 'la règle', 'la gomme'] },
    { q: 'Combien de côtés a un triangle ?', v: '🔺', b: '3', f: ['4', '5', '2'] },
    { q: 'Combien d\'angles droits a un carré ?', b: '4', f: ['1', '2', '0'] },
    { q: 'Quelle figure a 4 côtés de la même longueur et 4 angles droits ?', b: 'le carré', f: ['le rectangle', 'le triangle', 'le cercle'] },
    { q: 'Quelle figure n\'a aucun côté droit ?', b: 'le cercle', f: ['le carré', 'le triangle', 'le rectangle'] }
  ];
  const quizGeo = quiz(FAITS_GEO, '📐');
  const genSymetrie = () => {
    const N = 6, axeVertical = Math.random() < .5, veutSym = Math.random() < .5;
    const cle = (c, r) => c + ',' + r;
    let cases;
    for (;;) {
      const moitie = new Set(), n = alea(3, 6);
      while (moitie.size < n) moitie.add(cle(alea(0, 2), alea(0, N - 1)));
      const g = [...moitie].map(s => s.split(',').map(Number));
      cases = new Set([...g.map(([c, r]) => cle(c, r)), ...g.map(([c, r]) => cle(N - 1 - c, r))]);
      if (!veutSym) {
        const droite = [...cases].filter(s => +s.split(',')[0] >= 3);
        cases.delete(pioche(droite));
        let ajout; do { ajout = cle(alea(3, 5), alea(0, N - 1)); } while (cases.has(ajout));
        cases.add(ajout);
      }
      const sym = [...cases].every(s => { const [c, r] = s.split(',').map(Number); return cases.has(cle(N - 1 - c, r)); });
      if (sym === veutSym) break;
    }
    const k = 13, o = 11;
    let s = '';
    for (let i = 0; i <= N; i++) s += `<line x1="${o + i * k}" y1="${o}" x2="${o + i * k}" y2="${o + N * k}" stroke="#bbb" stroke-width=".6"/><line x1="${o}" y1="${o + i * k}" x2="${o + N * k}" y2="${o + i * k}" stroke="#bbb" stroke-width=".6"/>`;
    const coul = pioche(COULEURS);
    cases.forEach(t => { const [c, r] = t.split(',').map(Number); const [x, y] = axeVertical ? [c, r] : [r, c]; s += `<rect x="${o + x * k}" y="${o + y * k}" width="${k}" height="${k}" fill="${coul}"/>`; });
    const m = o + 3 * k;
    s += axeVertical ? `<line x1="${m}" y1="3" x2="${m}" y2="97" stroke="#e5484d" stroke-width="2.5"/>` : `<line x1="3" y1="${m}" x2="97" y2="${m}" stroke="#e5484d" stroke-width="2.5"/>`;
    return { visuel: svg(s, 200), enonce: 'Cette figure est-elle symétrique par rapport à la ligne rouge ?', dire: 'Regarde bien la ligne rouge. Cette figure est-elle symétrique par rapport à cette ligne ?',
      aide: 'Si on plie sur la ligne rouge, les deux moitiés se superposent-elles ?', choix: ['oui', 'non'], bonne: veutSym ? 'oui' : 'non' };
  };
  const genGeometrie = () => {
    const t = alea(0, 5);
    if (t === 0) {
      const f = pioche(['carré', 'rectangle', 'triangle', 'cercle']);
      return { visuel: svg(forme(f)), enonce: 'Comment s\'appelle cette figure ?', dire: 'Regarde bien. Comment s\'appelle cette figure ?', choix: ['carré', 'rectangle', 'triangle', 'cercle'], bonne: f };
    }
    if (t === 1) {
      const droit = Math.random() < .5, a = droit ? 90 : pioche([45, 60, 120, 135]), rot = alea(0, 359) * Math.PI / 180;
      const l = 38, p1 = [50 + l * Math.cos(rot), 50 + l * Math.sin(rot)], p2 = [50 + l * Math.cos(rot + a * Math.PI / 180), 50 + l * Math.sin(rot + a * Math.PI / 180)];
      const s = `<line x1="50" y1="50" x2="${r1(p1[0])}" y2="${r1(p1[1])}" stroke="#333" stroke-width="3" stroke-linecap="round"/><line x1="50" y1="50" x2="${r1(p2[0])}" y2="${r1(p2[1])}" stroke="#333" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="50" r="3" fill="#e5484d"/>`;
      return { visuel: svg(s), enonce: 'Cet angle est-il un angle droit ?', dire: 'Regarde cet angle. Est-ce un angle droit ?', aide: 'Compare-le avec le coin d\'une feuille ou avec ton équerre.', choix: ['oui', 'non'], bonne: droit ? 'oui' : 'non' };
    }
    if (t === 2) {
      const [pts, n] = pioche(ANGLES_DROITS);
      return qcm({ visuel: svg(`<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${pioche(COULEURS)}" fill-opacity=".45" ${trait}/>`), enonce: 'Combien d\'angles droits a cette figure ?',
        dire: 'Combien d\'angles droits a cette figure ?', aide: 'Vérifie chaque coin avec le coin d\'une feuille.' }, n, [0, 1, 2, 3, 4]);
    }
    if (t === 3) return genSymetrie();
    if (t === 4) {
      const nom = pioche(NOMS_SOLIDES);
      return qcm({ visuel: svg(SOLIDES[nom]()), enonce: 'Comment s\'appelle ce solide ?', dire: 'Regarde ce solide. Comment s\'appelle-t-il ?', aide: 'Les pointillés montrent les arêtes cachées.' }, nom, NOMS_SOLIDES);
    }
    return quizGeo();
  };

  ajouterMatiere('CE1', {
    id: 'maths', titre: 'Maths', emoji: '🔢', couleur: '#4f8ef7', jeux: [
      { id: 'nombres', titre: 'Les nombres jusqu\'à 1000', emoji: '🧱', gen: genNombres },
      { id: 'comparer', titre: 'Comparer et ranger', emoji: '🐊', gen: genComparer },
      { id: 'suites', titre: 'Suites et droite graduée', emoji: '👣', gen: genSuites },
      { id: 'additions', titre: 'Additions', emoji: '➕', gen: genAdditions },
      { id: 'soustractions', titre: 'Soustractions', emoji: '➖', gen: genSoustractions },
      { id: 'calcul-mental', titre: 'Calcul mental', emoji: '🧠', gen: genCalculMental },
      { id: 'multiplication', titre: 'La multiplication', emoji: '✖️', gen: genMultiplication },
      { id: 'problemes', titre: 'Problèmes', emoji: '🤔', gen: genProblemes },
      { id: 'monnaie', titre: 'Euros et centimes', emoji: '💶', gen: genMonnaie },
      { id: 'heure', titre: 'Lire l\'heure', emoji: '🕒', gen: genHeure },
      { id: 'mesures', titre: 'Longueurs et masses', emoji: '📏', gen: genMesures },
      { id: 'geometrie', titre: 'Géométrie', emoji: '📐', gen: genGeometrie }
    ]
  });

  /* =====================================================================
     FRANÇAIS
     ===================================================================== */

  // ---- Les sons : [mot avec la partie cachée entre crochets, emoji, catégorie, fausses]
  const CONSIGNES_SONS = {
    son: ['Quelles lettres manquent ?', 'Quelles lettres manquent dans ce mot ?'],
    s: ['Complète avec « s » ou « ss ».', 'Faut-il écrire s, ou deux s ?'],
    c: ['Complète avec « c » ou « ç ».', 'Faut-il écrire c, ou c cédille ?'],
    g: ['Complète avec « g », « gu » ou « ge ».', 'Faut-il écrire g, g u, ou g e ?'],
    m: ['Complète avec « m » ou « n ».', 'Faut-il écrire m, ou n ?'],
    eil: ['Quelle est la fin du mot ?', 'Quelles lettres manquent à la fin du mot ?']
  };
  const MOTS_SONS = [
    ['kang[ou]rou', '🦘', 'son', ['on', 'oi', 'an']], ['ball[on]', '🎈', 'son', ['an', 'ou', 'in']], ['éléph[an]t', '🐘', 'son', ['on', 'oi', 'in']],
    ['serp[en]t', '🐍', 'son', ['on', 'oi', 'ou']], ['dauph[in]', '🐬', 'son', ['on', 'oi', 'an']], ['p[ain]', '🍞', 'son', ['on', 'oi', 'ou']],
    ['ét[oi]le', '⭐', 'son', ['ou', 'on', 'in']], ['p[oi]re', '🍐', 'son', ['ou', 'on', 'an']], ['[ch]âteau', '🏰', 'son', ['j', 's', 'c']],
    ['va[ch]e', '🐄', 'son', ['j', 's', 'g']], ['champi[gn]on', '🍄', 'son', ['n', 'nn', 'g']], ['monta[gn]e', '🏔️', 'son', ['n', 'nn', 'g']],
    ['arai[gn]ée', '🕷️', 'son', ['n', 'nn', 'g']], ['cy[gn]e', '🦢', 'son', ['n', 'nn', 'g']], ['pl[on]geur', '🤿', 'son', ['an', 'ou', 'oi']],
    ['poi[ss]on', '🐟', 's', ['s']], ['poi[s]on', '☠️', 's', ['ss']], ['ro[s]e', '🌹', 's', ['ss']], ['mai[s]on', '🏠', 's', ['ss']],
    ['chau[ss]ette', '🧦', 's', ['s']], ['ta[ss]e', '☕', 's', ['s']], ['ci[s]eaux', '✂️', 's', ['ss']], ['fu[s]ée', '🚀', 's', ['ss']], ['pou[ss]in', '🐤', 's', ['s']],
    ['gar[ç]on', '👦', 'c', ['c']], ['gla[ç]on', '🧊', 'c', ['c']], ['le[ç]on', '📖', 'c', ['c']], ['hame[ç]on', '🎣', 'c', ['c']], ['ma[ç]on', '🧱', 'c', ['c']],
    ['[c]itron', '🍋', 'c', ['ç']], ['[c]erise', '🍒', 'c', ['ç']], ['bi[c]yclette', '🚲', 'c', ['ç']], ['pou[c]e', '👍', 'c', ['ç']],
    ['[g]irafe', '🦒', 'g', ['gu', 'ge']], ['pi[ge]on', '🐦', 'g', ['g', 'gu']], ['[gu]itare', '🎸', 'g', ['g', 'ge']], ['ba[gu]e', '💍', 'g', ['g', 'ge']],
    ['oran[ge]', '🍊', 'g', ['g', 'gu']], ['[g]âteau', '🎂', 'g', ['gu', 'ge']], ['[g]orille', '🦍', 'g', ['gu', 'ge']], ['dra[g]on', '🐉', 'g', ['gu', 'ge']],
    ['bou[g]ie', '🕯️', 'g', ['gu', 'ge']], ['ba[gu]ette', '🥖', 'g', ['g', 'ge']],
    ['ja[m]be', '🦵', 'm', ['n']], ['po[m]pier', '🚒', 'm', ['n']], ['ta[m]bour', '🥁', 'm', ['n']], ['tro[m]pette', '🎺', 'm', ['n']], ['cha[m]bre', '🛏️', 'm', ['n']],
    ['e[n]fant', '🧒', 'm', ['m']], ['po[n]t', '🌉', 'm', ['m']], ['ma[n]teau', '🧥', 'm', ['m']], ['co[n]combre', '🥒', 'm', ['m']],
    ['sol[eil]', '☀️', 'eil', ['eille', 'ail']], ['ab[eille]', '🐝', 'eil', ['eil', 'aille']], ['or[eille]', '👂', 'eil', ['eil', 'aille']],
    ['rév[eil]', '⏰', 'eil', ['eille', 'ail']], ['faut[euil]', '💺', 'eil', ['eil', 'ail']], ['citr[ouille]', '🎃', 'eil', ['aille', 'eille']],
    ['gren[ouille]', '🐸', 'eil', ['eille', 'aille']], ['bout[eille]', '🍾', 'eil', ['eil', 'aille']], ['ort[eil]', '🦶', 'eil', ['eille', 'ail']],
    ['p[aille]', '🥤', 'eil', ['ail', 'eille']], ['méd[aille]', '🏅', 'eil', ['ail', 'eille']]
  ];
  const tireSon = tirage(MOTS_SONS);
  const genSons = () => {
    const [m, e, cat, fausses] = tireSon();
    const [, avant, cache, apres] = /^(.*)\[(.*)\](.*)$/.exec(m), mot = avant + cache + apres;
    const [consigne, dit] = CONSIGNES_SONS[cat];
    const trou = '<span style="display:inline-block;min-width:1.3em;border-bottom:4px solid #e5484d">&nbsp;</span>';
    return qcm({ visuel: e, enonce: `${consigne}<br>${phrase(avant + trou + apres)}`, dire: `Écoute bien : ${mot}. ${dit}` }, cache, fausses);
  };

  // ---- Lire des phrases (la phrase n'est pas lue à voix haute)
  const PHRASES_IMAGES = [
    ['Le garçon a deux ballons et une glace.', '👦🎈🎈🍦', ['👦🎈🍦🍦', '👧🎈🎈🍦', '👦🎈🎈🎈']],
    ['Il y a plus de pommes que de poires.', '🍎🍎🍎🍐', ['🍎🍐🍐🍐', '🍎🍎🍐🍐', '🍐🍐🍐🍐']],
    ['Il y a autant de chats que de chiens.', '🐱🐱🐶🐶', ['🐱🐱🐱🐶', '🐱🐶🐶🐶', '🐱🐱🐱🐱']],
    ['Ce n\'est pas un chien : c\'est un loup.', '🐺', ['🐶', '🦊', '🐱']],
    ['Le singe mange une banane, pas une pomme.', '🐵🍌', ['🐵🍎', '🐶🍌', '🐷🍎']],
    ['Mamie tricote une écharpe pour l\'hiver.', '👵🧣', ['👴🧣', '👵🧤', '👩🧣']],
    ['Papi lit le journal avec ses lunettes.', '👴👓📰', ['👵👓📰', '👴📰', '👴👓📖']],
    ['Le bébé pleure, car il a faim.', '👶😢🍼', ['👶😀🍼', '👶😴', '👧😢🍼']],
    ['Trois oiseaux volent au-dessus de la maison.', '🐦🐦🐦🏠', ['🐦🐦🏠', '🐦🐦🐦🏫', '🐟🐟🐟🏠']],
    ['Il neige et le petit garçon fait un bonhomme de neige.', '👦⛄', ['👧⛄', '👦🏖️', '👦⚽']],
    ['Maman achète trois carottes et une salade.', '🥕🥕🥕🥬', ['🥕🥕🥬', '🥕🥕🥕🍅', '🥕🥬🥬🥬']],
    ['Lucas joue au tennis avec sa sœur.', '👦🎾👧', ['👦⚽👧', '👦🎾👦', '👧🏀👧']],
    ['Le dragon crache du feu sur le château.', '🐉🔥🏰', ['🐉💧🏰', '🐉🔥🏠', '🦖🔥🏰']],
    ['Le pirate a trouvé un sac d\'or sur une île.', '💰🏝️', ['💰🏠', '⚓🏝️', '🍎🏝️']],
    ['Le chat regarde le poisson dans son bocal.', '🐱🐠', ['🐶🐠', '🐱🐦', '🐭🐠']],
    ['Dans la ferme, il y a deux cochons et une poule.', '🐷🐷🐔', ['🐷🐔🐔', '🐷🐷🐷', '🐮🐮🐔']],
    ['Le premier cœur est rouge, le deuxième est vert.', '❤️💚', ['💚❤️', '❤️💙', '💛💚']],
    ['Le cœur bleu est entre deux cœurs jaunes.', '💛💙💛', ['💙💛💙', '💛💛💙', '💙💙💛']],
    ['Le lion dort pendant que la girafe mange.', '🦁💤🦒🌿', ['🦁🌿🦒💤', '🦁💤🐘🌿', '🐯💤🦒🌿']],
    ['La fusée part vers la lune.', '🚀🌙', ['✈️🌙', '🚀☀️', '🚁🌙']],
    ['Le facteur apporte une lettre et un colis.', '✉️📦', ['✉️✉️', '📦📦', '✉️🎁']],
    ['Au petit-déjeuner, Léa boit du lait et mange une tartine.', '🥛🍞', ['☕🍞', '🥛🍰', '🧃🍞']],
    ['Il y a quatre étoiles et une seule lune.', '⭐⭐⭐⭐🌙', ['⭐⭐⭐🌙', '⭐⭐⭐⭐🌙🌙', '⭐🌙🌙🌙🌙']],
    ['J\'ai cinq ballons : trois rouges et deux bleus.', '🔴🔴🔴🔵🔵', ['🔴🔴🔵🔵🔵', '🔴🔴🔴🔴🔵', '🔴🔴🔵🔵']],
    ['L\'ours mange du miel.', '🐻🍯', ['🐻🐟', '🐼🍯', '🐻🍎']],
    ['Le pingouin glisse sur la glace.', '🐧🧊', ['🐧🏖️', '🦆🧊', '🐧🌴']],
    ['Le hérisson se cache sous les feuilles mortes.', '🦔🍂', ['🦔🌸', '🐿️🍂', '🐭🍂']],
    ['L\'écureuil ramasse des glands dans la forêt.', '🐿️🌰', ['🐿️🍎', '🐭🌰', '🦔🍎']],
    ['Ni le chat ni le chien ne dorment : ils jouent.', '🐱⚽🐶', ['🐱💤🐶', '🐱💤🐶💤', '🐭⚽🐶']],
    ['Le cheval est plus grand que le poney, mais plus petit que la girafe.', '🐴', ['🦒', '🐭', '🐘']]
  ];
  const tirePhraseImg = tirage(PHRASES_IMAGES);
  const genLecture = () => {
    const [p, b, f] = tirePhraseImg();
    if (/poney/.test(p)) return qcm({ visuel: '📖', enonce: `<b>${p}</b><br>${phrase('Qui est au milieu : ni le plus grand, ni le plus petit ?')}`, dire: 'Lis la phrase tout seul. Qui est au milieu, ni le plus grand, ni le plus petit, parmi le poney, le cheval et la girafe ?' }, b, f);
    return qcm({ visuel: '📖', enonce: `<b>${p}</b>`, dire: 'Lis la phrase tout seul, doucement, puis touche la bonne image.' }, b, f);
  };

  // ---- Petits textes
  const TEXTES = [
    { v: '🐱', t: 'Le chat de Léna s\'appelle Moustache. Il est gris, avec une tache blanche sur le nez. Le soir, il dort sur le lit de Léna. Le matin, il réclame son lait en miaulant.', qs: [
      ['De quelle couleur est Moustache ?', 'gris', ['marron', 'noir', 'roux']],
      ['Où dort Moustache le soir ?', 'sur le lit de Léna', ['dans son panier', 'dans le jardin', 'sous la table']]] },
    { v: '🍉', t: 'Samedi, Hugo est allé au marché avec son papa. Ils ont acheté des tomates, du fromage et un gros melon. En rentrant, Hugo a porté le panier tout seul. Il était très fier.', qs: [
      ['Avec qui Hugo est-il allé au marché ?', 'avec son papa', ['avec sa maman', 'avec sa sœur', 'tout seul']],
      ['Qu\'ont-ils acheté ?', 'des tomates, du fromage et un melon', ['des pommes et du pain', 'des carottes et un poulet', 'du lait et des œufs']],
      ['Pourquoi Hugo était-il fier ?', 'Il a porté le panier tout seul.', ['Il a choisi le melon.', 'Il a mangé une tomate.', 'Il a payé le fromage.']]] },
    { v: '🌧️', t: 'Il pleut depuis ce matin. Nina ne peut pas aller au parc. Alors, elle construit une cabane avec des couvertures dans le salon. Son petit frère vient jouer avec elle.', qs: [
      ['Pourquoi Nina ne va-t-elle pas au parc ?', 'Parce qu\'il pleut.', ['Parce qu\'elle est malade.', 'Parce que le parc est fermé.', 'Parce qu\'il fait nuit.']],
      ['Avec quoi Nina construit-elle sa cabane ?', 'avec des couvertures', ['avec des branches', 'avec des cartons', 'avec des pierres']],
      ['Qui vient jouer avec Nina ?', 'son petit frère', ['sa maman', 'son chat', 'sa copine']]] },
    { v: '🦔', t: 'Le hérisson est un petit animal couvert de piquants. Quand il a peur, il se roule en boule. Il mange des limaces, des vers et des insectes. En hiver, il dort dans un nid de feuilles.', qs: [
      ['Que fait le hérisson quand il a peur ?', 'Il se roule en boule.', ['Il court très vite.', 'Il saute dans l\'eau.', 'Il crie très fort.']],
      ['Que mange le hérisson ?', 'des limaces, des vers et des insectes', ['des carottes et des pommes', 'de l\'herbe', 'des poissons']],
      ['Où dort le hérisson en hiver ?', 'dans un nid de feuilles', ['en haut d\'un arbre', 'dans une grotte', 'dans l\'eau']]] },
    { v: '🎂', t: 'Aujourd\'hui, c\'est l\'anniversaire de Sami. Il a sept ans. Ses amis lui offrent un livre sur les dinosaures et un puzzle. Sa maman a préparé un gâteau aux fraises.', qs: [
      ['Quel âge a Sami ?', '7 ans', ['6 ans', '8 ans', '9 ans']],
      ['Quel gâteau sa maman a-t-elle préparé ?', 'un gâteau aux fraises', ['un gâteau au chocolat', 'une tarte aux pommes', 'un gâteau au citron']],
      ['De quoi parle le livre offert à Sami ?', 'des dinosaures', ['des chevaux', 'de l\'espace', 'des pirates']]] },
    { v: '🚌', t: 'Tous les matins, Julie prend le bus pour aller à l\'école. Elle s\'assoit toujours à côté de son amie Clara. Ce matin, Clara n\'est pas là : elle est malade. Julie est un peu triste.', qs: [
      ['Comment Julie va-t-elle à l\'école ?', 'en bus', ['à pied', 'à vélo', 'en voiture']],
      ['Pourquoi Clara n\'est-elle pas là ?', 'Elle est malade.', ['Elle est en vacances.', 'Elle a raté le bus.', 'Elle est fâchée.']],
      ['Comment se sent Julie ?', 'un peu triste', ['très en colère', 'très contente', 'très fatiguée']]] },
    { v: '🚜', t: 'Le fermier se lève très tôt. D\'abord, il donne à manger aux poules. Ensuite, il trait les vaches. Enfin, il part travailler dans les champs avec son tracteur.', qs: [
      ['Que fait le fermier en premier ?', 'Il donne à manger aux poules.', ['Il trait les vaches.', 'Il part dans les champs.', 'Il prend son tracteur.']],
      ['Que fait le fermier avec son tracteur ?', 'Il travaille dans les champs.', ['Il va au marché.', 'Il trait les vaches.', 'Il se promène en ville.']]] },
    { v: '🏔️', t: 'Pendant les vacances, Emma est partie à la montagne avec ses grands-parents. Ils ont fait une longue promenade jusqu\'à un lac. Emma a vu des marmottes. Elle a pris beaucoup de photos.', qs: [
      ['Où Emma est-elle partie en vacances ?', 'à la montagne', ['à la mer', 'à la campagne', 'en ville']],
      ['Avec qui Emma est-elle partie ?', 'avec ses grands-parents', ['avec ses parents', 'avec sa classe', 'avec son frère']],
      ['Quels animaux Emma a-t-elle vus ?', 'des marmottes', ['des vaches', 'des dauphins', 'des écureuils']]] },
    { v: '🥗', t: 'Pour faire une salade de fruits, Paul coupe une banane, deux pommes et une orange. Il met les morceaux dans un saladier. Il ajoute un peu de jus de citron. Puis il met le saladier au réfrigérateur.', qs: [
      ['Combien de pommes Paul coupe-t-il ?', '2', ['1', '3', '4']],
      ['Où Paul met-il le saladier à la fin ?', 'au réfrigérateur', ['sur la table', 'dans le four', 'dans le placard']]] },
    { v: '🐞', t: 'La coccinelle est un petit insecte rouge avec des points noirs. Elle a six pattes et deux ailes cachées sous sa carapace. Les jardiniers l\'aiment beaucoup, car elle mange les pucerons qui abîment les plantes.', qs: [
      ['Combien de pattes a la coccinelle ?', '6', ['4', '8', '2']],
      ['D\'après le texte, pourquoi les jardiniers aiment-ils la coccinelle ?', 'Elle mange les pucerons.', ['Elle fait du miel.', 'Elle arrose les plantes.', 'Elle chante le matin.']]] },
    { v: '⛈️', t: 'Ce soir, il y a de l\'orage. Le tonnerre gronde et les éclairs illuminent le ciel. Le petit chien Filou a très peur : il se cache sous le lit. Tom le rassure en le caressant.', qs: [
      ['Où se cache Filou ?', 'sous le lit', ['dans sa niche', 'dans le jardin', 'sous la table']],
      ['Pourquoi Filou se cache-t-il ?', 'Il a peur de l\'orage.', ['Il veut jouer.', 'Il a faim.', 'Il est puni.']],
      ['Que fait Tom pour rassurer Filou ?', 'Il le caresse.', ['Il le gronde.', 'Il lui donne un os.', 'Il allume la télévision.']]] },
    { v: '📚', t: 'À la bibliothèque, on peut emprunter des livres pour trois semaines. Il faut en prendre soin et les rapporter à temps. Dans la bibliothèque, on parle doucement pour ne pas déranger les lecteurs.', qs: [
      ['Pour combien de temps peut-on emprunter un livre ?', 'trois semaines', ['trois jours', 'un an', 'une semaine']],
      ['Pourquoi parle-t-on doucement à la bibliothèque ?', 'pour ne pas déranger les lecteurs', ['parce que c\'est la nuit', 'parce que les livres dorment', 'pour entendre la radio']]] },
    { v: '🌲', t: 'Le Petit Poucet était le plus jeune de sept frères. Un jour, ses parents les perdent dans la forêt. Mais Poucet avait semé des petits cailloux blancs sur le chemin. Grâce à eux, les enfants retrouvent leur maison.', qs: [
      ['Combien de frères y a-t-il en tout ?', '7', ['3', '5', '10']],
      ['Qu\'a semé Poucet sur le chemin ?', 'des petits cailloux blancs', ['des graines', 'des bonbons', 'des fleurs']]] },
    { v: '🌸', t: 'Le printemps est arrivé. Dans le jardin, les arbres se couvrent de fleurs. Les oiseaux construisent leur nid. Mamie sème des graines de radis et de carottes dans son potager.', qs: [
      ['Quelle saison est arrivée ?', 'le printemps', ['l\'hiver', 'l\'été', 'l\'automne']],
      ['Que sème Mamie dans son potager ?', 'des radis et des carottes', ['des tomates', 'des tulipes', 'des pommes de terre']]] },
    { v: '🦕', t: 'Mardi, la classe de CE1 visite le musée. Les élèves découvrent des squelettes de dinosaures. Le plus grand mesure plus de vingt mètres ! Au retour, chacun dessine son dinosaure préféré.', qs: [
      ['Quel jour la classe visite-t-elle le musée ?', 'mardi', ['lundi', 'jeudi', 'samedi']],
      ['Que font les élèves au retour ?', 'Ils dessinent un dinosaure.', ['Ils font du sport.', 'Ils mangent un gâteau.', 'Ils écrivent une lettre.']]] }
  ];
  const QUESTIONS_TEXTES = [];
  TEXTES.forEach(x => x.qs.forEach(q => QUESTIONS_TEXTES.push([x, q])));
  const tireTexte = tirage(QUESTIONS_TEXTES);
  const genTextes = () => {
    const [x, [q, b, f]] = tireTexte();
    return qcm({ visuel: x.v, enonce: `<span style="font-weight:normal;display:block;text-align:left;margin-bottom:.6em">${x.t}</span><b>${q}</b>`, dire: `${x.t} ${q}` }, b, f);
  };

  // ---- Ordre alphabétique
  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const MOTS_ALPHA = {
    a: ['abeille', 'ami', 'arbre', 'avion', 'ananas', 'armoire'], b: ['balle', 'banane', 'bateau', 'biscuit', 'bonbon', 'bouche', 'bureau', 'brosse'],
    c: ['cabane', 'cadeau', 'camion', 'carotte', 'cerise', 'chaise', 'cheval', 'citron', 'cochon', 'crayon'], d: ['dame', 'dauphin', 'dent', 'domino', 'dragon'],
    f: ['fée', 'fenêtre', 'fille', 'fleur', 'forêt', 'fraise', 'fusée'], l: ['lapin', 'lait', 'lune', 'loup', 'livre', 'lion'],
    m: ['maison', 'manteau', 'melon', 'mouton', 'mur', 'moto', 'miel'], p: ['panda', 'papa', 'pêche', 'pirate', 'poule', 'pomme', 'pull', 'prince'],
    r: ['radis', 'renard', 'robot', 'rose', 'ruche', 'rivière'], s: ['sable', 'salade', 'sapin', 'singe', 'soleil', 'souris', 'sucre'],
    t: ['table', 'tapis', 'tigre', 'tomate', 'tortue', 'train', 'tulipe']
  };
  const ordreAlpha = (a, b) => { const x = sansAccent(a), y = sansAccent(b); return x < y ? -1 : x > y ? 1 : 0; };
  const genAlphabet = () => {
    const t = alea(0, 3);
    if (t === 0) {
      const i = alea(1, 24), apres = Math.random() < .5, bon = ALPHA[apres ? i + 1 : i - 1];
      const q = `Quelle lettre vient juste ${apres ? 'après' : 'avant'} ${ALPHA[i]} ?`;
      return qcm({ visuel: gros(apres ? `${ALPHA[i]} ➜ ?` : `? ➜ ${ALPHA[i]}`), enonce: q, dire: `Dans l'alphabet, quelle lettre vient juste ${apres ? 'après' : 'avant'} la lettre ${ALPHA[i]} ?` },
        bon, [ALPHA[apres ? i - 1 : i + 1], ALPHA[i + 2] || 'A', ALPHA[Math.max(0, i - 2)], ALPHA[(i + 5) % 26]]);
    }
    let mots;
    if (t === 1 || t === 3) mots = melange(Object.keys(MOTS_ALPHA)).slice(0, t === 3 ? 3 : 4).map(l => pioche(MOTS_ALPHA[l]));
    else mots = melange(MOTS_ALPHA[pioche(Object.keys(MOTS_ALPHA))]).slice(0, 4);
    const tri = [...mots].sort(ordreAlpha);
    if (t === 3) {
      const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map(p => p.map(i => tri[i]).join(' – '));
      return qcm({ visuel: '🔤', enonce: `Range ces mots dans l'ordre alphabétique :<br>${phrase(melange(mots).join(' · '))}`, dire: 'Range ces trois mots dans l\'ordre alphabétique.' }, tri.join(' – '), perms);
    }
    const premier = Math.random() < .6, bon = premier ? tri[0] : tri[3];
    const q = `Quel mot vient en ${premier ? 'premier' : 'dernier'} dans l'ordre alphabétique ?`;
    return qcm({ visuel: '🔤', enonce: q, dire: q, aide: t === 2 ? 'Même première lettre : regarde la deuxième !' : '' }, bon, mots.filter(m => m !== bon));
  };

  // ---- Nom, verbe, adjectif, déterminant
  const NOMS_NATURE = { N: 'nom', V: 'verbe', A: 'adjectif', D: 'déterminant' };
  const PHRASES_NATURE = [
    'Le/D petit/A chien/N aboie/V', 'Ma/D sœur/N mange/V une/D pomme/N rouge/A', 'Les/D oiseaux/N chantent/V dans/x le/D jardin/N',
    'Une/D grande/A girafe/N boit/V', 'Papa/N lave/V sa/D voiture/N bleue/A', 'Le/D vent/N froid/A souffle/V',
    'Mon/D frère/N lit/V un/D gros/A livre/N', 'La/D maîtresse/N écrit/V au/x tableau/N', 'Cette/D jolie/A fleur/N pousse/V vite/x',
    'Nos/D voisins/N plantent/V des/D arbres/N', 'Le/D bébé/N dort/V dans/x son/D berceau/N', 'Léo/N porte/V un/D pull/N vert/A',
    'Ces/D enfants/N courent/V dans/x la/D cour/N', 'Le/D chat/N noir/A attrape/V une/D souris/N', 'Un/D vieux/A pêcheur/N répare/V son/D bateau/N',
    'Mes/D amis/N jouent/V au/x ballon/N', 'La/D neige/N blanche/A tombe/V', 'Ta/D tante/N chante/V une/D belle/A chanson/N',
    'Le/D lapin/N blanc/A mange/V une/D carotte/N', 'Les/D élèves/N écoutent/V une/D histoire/N drôle/A', 'Maman/N prépare/V une/D soupe/N chaude/A',
    'Le/D petit/A garçon/N ramasse/V des/D coquillages/N'
  ].map(p => p.split(' ').map(x => x.split('/')));
  const tireNature = tirage(PHRASES_NATURE);
  const genNature = () => {
    const mots = tireNature(), texte = mots.map(m => m[0]).join(' ') + '.';
    const utiles = mots.filter(m => m[1] !== 'x');
    if (Math.random() < .55) {
      const [mot, tag] = pioche(utiles);
      const html = mots.map(m => m[0] === mot ? `<u><b>${m[0]}</b></u>` : m[0]).join(' ') + '.';
      return { visuel: '🏷️', enonce: `Quelle est la nature du mot souligné ?<br>${phrase(html)}`, dire: `Dans la phrase : ${texte} Quelle est la nature du mot ${mot} ?`,
        choix: ['nom', 'verbe', 'adjectif', 'déterminant'], bonne: NOMS_NATURE[tag] };
    }
    const tags = Object.keys(NOMS_NATURE).filter(tg => utiles.filter(m => m[1] === tg).length === 1);
    const tag = pioche(tags), bon = utiles.find(m => m[1] === tag)[0];
    const art = tag === 'A' ? 'un adjectif' : tag === 'D' ? 'un déterminant' : 'un ' + NOMS_NATURE[tag];
    return qcm({ visuel: '🏷️', enonce: `Quel mot est ${art} ?<br>${phrase(texte)}`, dire: `Dans la phrase : ${texte} Quel mot est ${art} ?` },
      bon, utiles.filter(m => m[1] !== tag).map(m => m[0]));
  };

  // ---- Masculin, féminin, pluriel
  const FEMININS = [
    ['un lion', 'une lionne', ['une lione', 'une lionnesse']], ['un chien', 'une chienne', ['une chiene', 'une chienesse']],
    ['un voisin', 'une voisine', ['une voisinne', 'une voisin']], ['un boulanger', 'une boulangère', ['une boulangeuse', 'une boulangeresse']],
    ['un chanteur', 'une chanteuse', ['une chanteure', 'une chantrice']], ['un ami', 'une amie', ['une ami', 'une amite']],
    ['un fermier', 'une fermière', ['une fermieuse', 'une fermiere']], ['un cousin', 'une cousine', ['une cousinne', 'une cousin']],
    ['un roi', 'une reine', ['une roie', 'une roine']], ['un coq', 'une poule', ['une coque', 'une coquette']],
    ['un garçon', 'une fille', ['une garçon', 'une garçone']], ['un acteur', 'une actrice', ['une acteuse', 'une acteure']],
    ['un chat', 'une chatte', ['une chate', 'une chatesse']], ['un danseur', 'une danseuse', ['une danseure', 'une danstrice']],
    ['petit', 'petite', ['petitte', 'petits']], ['blanc', 'blanche', ['blance', 'blanque']], ['gros', 'grosse', ['grose', 'grosses']],
    ['gentil', 'gentille', ['gentile', 'gentilles']], ['heureux', 'heureuse', ['heureuxe', 'heureuze']], ['vert', 'verte', ['vertte', 'vère']]
  ];
  const PLURIELS_CE1 = [
    ['un gâteau', 'des gâteaux', ['des gâteaus', 'des gâteau']], ['un bateau', 'des bateaux', ['des bateaus', 'des bateau']],
    ['un jeu', 'des jeux', ['des jeus', 'des jeu']], ['un cheveu', 'des cheveux', ['des cheveus', 'des cheveu']],
    ['un oiseau', 'des oiseaux', ['des oiseaus', 'des oiseau']], ['un cheval', 'des chevaux', ['des chevals', 'des chevaus']],
    ['un animal', 'des animaux', ['des animals', 'des animaus']], ['un journal', 'des journaux', ['des journals', 'des journaus']],
    ['une souris', 'des souris', ['des sourises', 'des sourix']], ['un nez', 'des nez', ['des nezs', 'des nes']],
    ['une noix', 'des noix', ['des noixs', 'des noies']], ['un bras', 'des bras', ['des brass', 'des brax']],
    ['un bijou', 'des bijoux', ['des bijous', 'des bijou']], ['un chou', 'des choux', ['des chous', 'des chou']],
    ['un genou', 'des genoux', ['des genous', 'des genou']], ['un clou', 'des clous', ['des cloux', 'des clou']],
    ['un trou', 'des trous', ['des troux', 'des trou']], ['une fleur', 'des fleurs', ['des fleur', 'des fleurx']],
    ['un feu', 'des feux', ['des feus', 'des feu']], ['un tapis', 'des tapis', ['des tapiss', 'des tapix']]
  ];
  const NOMBRE_GROUPES = [
    ['les souris', 'pluriel'], ['la souris', 'singulier'], ['des bras', 'pluriel'], ['un bras', 'singulier'], ['le nez', 'singulier'],
    ['mes cheveux', 'pluriel'], ['un gâteau', 'singulier'], ['ces jeux', 'pluriel'], ['une noix', 'singulier'], ['des noix', 'pluriel'],
    ['les chevaux', 'pluriel'], ['ton tapis', 'singulier'], ['trois oiseaux', 'pluriel'], ['un vieux pull', 'singulier'], ['deux vieux pulls', 'pluriel'],
    ['le gros chat', 'singulier'], ['les gros chats', 'pluriel']
  ];
  const UN_UNE = [['girafe', 'une'], ['arbre', 'un'], ['orange', 'une'], ['éléphant', 'un'], ['étoile', 'une'], ['avion', 'un'], ['horloge', 'une'],
    ['écureuil', 'un'], ['armoire', 'une'], ['fourmi', 'une'], ['escargot', 'un'], ['ours', 'un'], ['araignée', 'une'], ['oreille', 'une'],
    ['œuf', 'un'], ['hérisson', 'un'], ['épée', 'une'], ['ananas', 'un'], ['usine', 'une'], ['igloo', 'un']];
  const tireFem = tirage(FEMININS), tirePlur = tirage(PLURIELS_CE1), tireGroupe = tirage(NOMBRE_GROUPES), tireUn = tirage(UN_UNE);
  const genGenreNombre = () => {
    const t = alea(0, 3);
    if (t === 0) {
      const [m, fe, f] = tireFem(), adj = !/^un /.test(m);
      const q = adj ? `Quel est le féminin de l'adjectif « ${m} » ?` : `Quel est le féminin de « ${m} » ?`;
      return qcm({ visuel: '👫', enonce: q, dire: q }, fe, f, 3);
    }
    if (t === 1) {
      const [s, p, f] = tirePlur(), q = `Quel est le pluriel de « ${s} » ?`;
      return qcm({ visuel: '👯', enonce: q, dire: q }, p, f, 3);
    }
    if (t === 2) {
      const [g, b] = tireGroupe();
      return { visuel: '🔎', enonce: `Ce groupe de mots est-il au singulier ou au pluriel ?<br>${phrase('« ' + g + ' »')}`, dire: `Lis ce groupe de mots : ${g}. Est-il au singulier ou au pluriel ?`, choix: ['singulier', 'pluriel'], bonne: b };
    }
    const [n, b] = tireUn();
    return { visuel: '🔎', enonce: `Choisis « un » ou « une » :<br>${phrase('… ' + n)}`, dire: `Faut-il dire un, ou une, ${n} ?`, choix: ['un', 'une'], bonne: b };
  };

  // ---- Conjugaison : présent (être, avoir, aller, verbes en -er), futur et passé composé
  const SUJETS = [['je', 0], ['tu', 1], ['il', 2], ['elle', 2], ['on', 2], ['nous', 3], ['vous', 4], ['ils', 5], ['elles', 5]];
  const VERBES_ER = ['chanter', 'jouer', 'danser', 'parler', 'regarder', 'marcher', 'aimer', 'écouter', 'manger', 'dessiner', 'sauter', 'ranger'];
  const IRREG = {
    être: { present: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'], fut: 'ser' },
    avoir: { present: ['ai', 'as', 'a', 'avons', 'avez', 'ont'], fut: 'aur' },
    aller: { present: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'], fut: 'ir' }
  };
  const presentCE1 = (v, p) => {
    if (IRREG[v]) return IRREG[v].present[p];
    const rad = v.slice(0, -2);
    return p === 3 && /g$/.test(rad) ? rad + 'eons' : rad + ['e', 'es', 'e', 'ons', 'ez', 'ent'][p];
  };
  const futurCE1 = (v, p) => (IRREG[v] ? IRREG[v].fut : v) + ['ai', 'as', 'a', 'ons', 'ez', 'ont'][p];
  const pcCE1 = (v, p) => IRREG.avoir.present[p] + ' ' + v.slice(0, -2) + 'é';
  const avecSujet = (s, f) => s === 'je' && /^[aeiouéèêh]/.test(f) ? 'j\'' + f : s + ' ' + f;
  const genConjugaison = () => {
    const t = alea(0, 3), [s, p] = pioche(SUJETS);
    if (t === 0) {
      const v = pioche([...VERBES_ER, 'être', 'avoir', 'aller', 'être', 'avoir', 'aller']);
      const bon = avecSujet(s, presentCE1(v, p));
      const f = [0, 1, 2, 3, 4, 5].map(p2 => avecSujet(s, presentCE1(v, p2))).concat(avecSujet(s, v));
      return qcm({ visuel: '⏳', enonce: `Conjugue au présent :<br>${phrase(`${s} (${v})`)}`, dire: `Conjugue le verbe ${v} au présent, avec ${s}.` }, bon, f);
    }
    if (t === 1) {
      const v = pioche(VERBES_ER), [marque, temps] = pioche([['Hier', 'pc'], ['En ce moment', 'present'], ['Demain', 'futur']]);
      const formes = { present: presentCE1, futur: futurCE1, pc: pcCE1 };
      const bon = avecSujet(s, formes[temps](v, p));
      const autres = Object.keys(formes).filter(x => x !== temps && !(temps === 'futur' && x === 'present'));
      const f = autres.map(x => avecSujet(s, formes[x](v, p)));
      const p2 = pioche([0, 1, 2, 3, 4, 5].filter(x => formes[temps](v, x) !== formes[temps](v, p)));
      f.push(avecSujet(s, formes[temps](v, p2)));
      if (temps === 'futur') f.push(avecSujet(s, formes.pc(v, pioche([0, 1, 2, 3, 4, 5].filter(x => x !== p)))));
      return qcm({ visuel: temps === 'pc' ? '⏪' : temps === 'futur' ? '⏩' : '▶️', enonce: `Choisis le verbe qui convient :<br>${phrase(`${marque}, ${s} … (${v})`)}`,
        dire: `${marque}, ${s}… Avec le verbe ${v}, que faut-il écrire ?` }, bon, f);
    }
    if (t === 2) {
      const v = pioche([...VERBES_ER, 'être', 'avoir', 'aller']);
      const temps = IRREG[v] ? pioche(['present', 'futur']) : pioche(['present', 'futur', 'pc']);
      const forme = avecSujet(s, (temps === 'present' ? presentCE1 : temps === 'futur' ? futurCE1 : pcCE1)(v, p));
      return { visuel: '🕰️', enonce: `Ce verbe parle-t-il du passé, du présent ou du futur ?<br>${phrase('« ' + forme + ' »')}`, dire: `${forme}. Est-ce le passé, le présent, ou le futur ?`,
        choix: ['passé', 'présent', 'futur'], bonne: temps === 'pc' ? 'passé' : temps === 'futur' ? 'futur' : 'présent' };
    }
    const v = pioche([...VERBES_ER, 'être', 'avoir', 'aller']), forme = avecSujet(s, presentCE1(v, p));
    const f = [presentCE1(v, p), IRREG[v] ? pioche(Object.keys(IRREG).filter(x => x !== v)) : v.slice(0, -2) + 'é', IRREG[v] ? IRREG[v].present[4] : v.slice(0, -1) + 'z', IRREG[v] ? 'faire' : v.slice(0, -2)];
    return qcm({ visuel: '🔎', enonce: `Quel est l'infinitif du verbe ?<br>${phrase('« ' + forme + ' »')}`, dire: `${forme}. Quel est l'infinitif de ce verbe ?` }, v, f);
  };

  // ---- Homophones
  const HOMOPHONES_CE1 = [
    ['Zoé ___ un chat roux.', 'a', 'à'], ['Nous allons ___ la piscine.', 'à', 'a'], ['Mon frère ___ sept ans.', 'a', 'à'], ['Il joue ___ la marelle.', 'à', 'a'],
    ['Papi ___ une grande barbe.', 'a', 'à'], ['Je vais ___ l\'école en bus.', 'à', 'a'], ['Le lapin ___ mangé la salade.', 'a', 'à'], ['Elle habite ___ Lyon.', 'à', 'a'],
    ['Tom ___ perdu son bonnet.', 'a', 'à'], ['On se retrouve ___ midi.', 'à', 'a'], ['C\'est une tasse ___ café.', 'à', 'a'],
    ['Le ciel ___ gris.', 'est', 'et'], ['J\'ai un crayon ___ une gomme.', 'et', 'est'], ['Ma maison ___ grande.', 'est', 'et'], ['Léa ___ Tom sont amis.', 'et', 'est'],
    ['Le chien ___ dans sa niche.', 'est', 'et'], ['Il mange du pain ___ du fromage.', 'et', 'est'], ['Cette soupe ___ trop chaude.', 'est', 'et'],
    ['Il saute ___ il rit.', 'et', 'est'], ['Mon cartable ___ lourd.', 'est', 'et'], ['Le chat ___ le chien jouent ensemble.', 'et', 'est'],
    ['Les enfants ___ dans la cour.', 'sont', 'son'], ['Léo range ___ vélo.', 'son', 'sont'], ['Mes chaussures ___ sales.', 'sont', 'son'],
    ['Elle cherche ___ doudou.', 'son', 'sont'], ['Les pommes ___ mûres.', 'sont', 'son'], ['Le bébé boit ___ biberon.', 'son', 'sont'],
    ['Tes amis ___ gentils.', 'sont', 'son'], ['Papa lave ___ pantalon.', 'son', 'sont'], ['Les fleurs ___ jolies.', 'sont', 'son'],
    ['Chaque élève prend ___ cahier.', 'son', 'sont']
  ];
  const tireHomo = tirage(HOMOPHONES_CE1);
  const genHomophones = () => {
    const [p, bon, faux] = tireHomo();
    const choix = [bon, faux].sort();
    return { visuel: '✍️', enonce: `Quel mot manque : ${choix.join(' ou ')} ?<br>${phrase(p)}`, dire: `Quel mot faut-il écrire ? ${p.replace(/\s*_+\s*/, ', blanc, ')}`, choix, bonne: bon };
  };

  // ---- La phrase et la ponctuation
  const PONCTUATION = [
    ['Le chat dort sur le canapé', '.'], ['Nous partons en vacances demain', '.'], ['Mon frère a huit ans', '.'], ['Il pleut depuis ce matin', '.'],
    ['La maîtresse lit une histoire', '.'], ['Les oiseaux chantent dans l\'arbre', '.'],
    ['Où as-tu mis ton cartable', '?'], ['Veux-tu jouer avec moi', '?'], ['Quel âge as-tu', '?'], ['Est-ce que tu aimes les frites', '?'],
    ['Comment s\'appelle ton chien', '?'], ['Pourquoi le ciel est-il bleu', '?'],
    ['Quelle belle surprise', '!'], ['Comme ce gâteau est bon', '!'], ['Oh, que tu as grandi', '!'], ['Hourra, nous avons gagné', '!'],
    ['Quel beau dessin', '!'], ['Au secours', '!']
  ];
  const PHRASES_OK = [
    'Le chien court dans le jardin.', 'Ma grand-mère fait une tarte.', 'Les enfants jouent au ballon.', 'Tom mange une pomme rouge.',
    'La maîtresse ouvre la fenêtre.', 'Le soleil brille dans le ciel.', 'Mon chat boit du lait.', 'Les poules picorent le grain.',
    'Papa répare le vélo.', 'Léa dessine une maison.', 'Le bébé dort dans son lit.', 'Nous lisons un livre.', 'Le fermier conduit le tracteur.',
    'Les oiseaux construisent un nid.', 'Zoé arrose les fleurs.'
  ];
  const DETS = /^(le|la|les|un|une|des|mon|ma|mes|son|sa|ses|du)$/i;
  const tirePonct = tirage(PONCTUATION), tireOk = tirage(PHRASES_OK);
  const genPhrase = () => {
    const t = alea(0, 2);
    if (t === 0) {
      const [p, b] = tirePonct();
      return { visuel: '❓', enonce: `Quel signe faut-il mettre à la fin ?<br>${phrase(p + ' …')}`, dire: `Lis la phrase : ${p}. Quel signe faut-il mettre à la fin : le point, le point d'interrogation, ou le point d'exclamation ?`,
        choix: ['.', '?', '!'], bonne: b };
    }
    if (t === 1) {
      const p = tireOk(), mots = p.slice(0, -1).split(' ');
      const sansMaj = p[0].toLowerCase() + p.slice(1), sansPoint = p.slice(0, -1);
      const i = mots.findIndex((m, k) => k < mots.length - 1 && DETS.test(m) && k > 0);
      const m2 = [...mots];
      if (i > 0) [m2[i], m2[i + 1]] = [m2[i + 1], m2[i]]; else [m2[0], m2[1]] = [m2[1].replace(/^./, c => c.toUpperCase()), m2[0].toLowerCase()];
      const melangee = m2.join(' ') + '.';
      return qcm({ visuel: '📝', enonce: 'Quelle phrase est bien écrite ?', dire: 'Lis bien. Quelle phrase est bien écrite, avec une majuscule, un point, et les mots dans le bon ordre ?' }, p, [sansMaj, sansPoint, melangee]);
    }
    const n = alea(1, 4), morceaux = [];
    const vus = new Set();
    while (morceaux.length < n) {
      const x = Math.random() < .5 ? tireOk() : tirePonct().join('');
      if (!vus.has(x)) { vus.add(x); morceaux.push(x); }
    }
    return qcm({ visuel: '🔢', enonce: `Combien y a-t-il de phrases dans ce texte ?<br>${phrase(morceaux.join(' '))}`, dire: 'Combien y a-t-il de phrases dans ce petit texte ?', aide: 'Une phrase commence par une majuscule et finit par un point.' },
      n, [1, 2, 3, 4, 5]);
  };

  // ---- Vocabulaire : contraires, familles, mots génériques
  const CONTRAIRES_CE1 = [
    ['grand', 'petit', ['gros', 'long', 'haut']], ['chaud', 'froid', ['tiède', 'brûlant', 'doux']], ['rapide', 'lent', ['vite', 'pressé', 'fort']],
    ['monter', 'descendre', ['grimper', 'sauter', 'marcher']], ['ouvrir', 'fermer', ['entrer', 'pousser', 'regarder']], ['le jour', 'la nuit', ['le matin', 'le soleil', 'midi']],
    ['propre', 'sale', ['neuf', 'lavé', 'joli']], ['plein', 'vide', ['rempli', 'gros', 'lourd']], ['gentil', 'méchant', ['poli', 'calme', 'joyeux']],
    ['lourd', 'léger', ['gros', 'solide', 'dur']], ['devant', 'derrière', ['dessus', 'dedans', 'à côté']], ['allumer', 'éteindre', ['brûler', 'briller', 'chauffer']],
    ['triste', 'joyeux', ['fâché', 'malade', 'seul']], ['vieux', 'jeune', ['ancien', 'âgé', 'grand']], ['entrer', 'sortir', ['rentrer', 'venir', 'ouvrir']],
    ['gagner', 'perdre', ['jouer', 'courir', 'finir']], ['dur', 'mou', ['solide', 'lourd', 'froid']], ['beaucoup', 'peu', ['trop', 'très', 'plus']],
    ['toujours', 'jamais', ['souvent', 'parfois', 'encore']], ['facile', 'difficile', ['simple', 'rapide', 'drôle']]
  ];
  const FAMILLES_CE1 = [
    ['jardin', 'jardinier', ['jaune', 'jambe', 'jupe']], ['dent', 'dentiste', ['danse', 'dindon', 'dans']], ['fleur', 'fleuriste', ['flûte', 'flèche', 'flaque']],
    ['lait', 'laitier', ['laine', 'laid', 'lapin']], ['boulanger', 'boulangerie', ['boule', 'bouton', 'bougie']], ['nager', 'nageur', ['neige', 'nuage', 'nappe']],
    ['chant', 'chanteur', ['champ', 'chameau', 'chance']], ['terre', 'terrier', ['tortue', 'tarte', 'tirer']], ['glace', 'glaçon', ['glisser', 'gland', 'gloire']],
    ['dessin', 'dessiner', ['dessert', 'dessous', 'désert']], ['coiffer', 'coiffeur', ['coffre', 'coin', 'couteau']], ['patin', 'patiner', ['patte', 'pâte', 'papier']],
    ['sel', 'salé', ['selle', 'ciel', 'sale']], ['ami', 'amitié', ['amande', 'ampoule', 'animal']], ['long', 'longueur', ['loup', 'lune', 'lion']]
  ];
  const INTRUS_FAMILLE = [
    [['dent', 'dentiste', 'dentifrice'], 'danse'], [['jardin', 'jardinier', 'jardinage'], 'jaguar'], [['lait', 'laitier', 'laitage'], 'laine'],
    [['chant', 'chanter', 'chanteuse'], 'champ'], [['nager', 'nageur', 'nage'], 'neige'], [['fleur', 'fleuriste', 'fleurir'], 'flèche'],
    [['glace', 'glaçon', 'glacier'], 'glisser'], [['dessin', 'dessiner', 'dessinateur'], 'dessert']
  ];
  const GENERIQUES = [
    ['un fruit', ['pomme', 'poire', 'cerise', 'banane', 'fraise'], ['carotte', 'poireau', 'salade']],
    ['un légume', ['carotte', 'poireau', 'haricot', 'courgette'], ['fraise', 'cerise', 'banane']],
    ['un vêtement', ['pantalon', 'jupe', 'manteau', 'chemise', 'pull'], ['cuillère', 'chaise', 'ballon']],
    ['un meuble', ['table', 'chaise', 'armoire', 'lit', 'bureau'], ['vélo', 'chapeau', 'pomme']],
    ['un instrument de musique', ['piano', 'flûte', 'violon', 'guitare', 'tambour'], ['ballon', 'crayon', 'râteau']],
    ['une couleur', ['rouge', 'vert', 'jaune', 'bleu', 'violet'], ['lundi', 'pomme', 'chaise']],
    ['un jour de la semaine', ['lundi', 'jeudi', 'samedi', 'mardi', 'dimanche'], ['juillet', 'hiver', 'midi']],
    ['un moyen de transport', ['bus', 'train', 'avion', 'bateau', 'vélo'], ['maison', 'arbre', 'lampe']],
    ['un animal', ['lion', 'chat', 'cheval', 'lapin', 'renard'], ['tulipe', 'caillou', 'nuage']]
  ];
  const tireContr = tirage(CONTRAIRES_CE1), tireFam = tirage(FAMILLES_CE1), tireIntrus = tirage(INTRUS_FAMILLE), tireGen = tirage(GENERIQUES);
  const genVocabulaire = () => {
    const t = alea(0, 3);
    if (t === 0) { const [m, b, f] = tireContr(), q = `Quel est le contraire de « ${m} » ?`; return qcm({ visuel: '↔️', enonce: q, dire: q }, b, f); }
    if (t === 1) { const [m, b, f] = tireFam(), q = `Quel mot est de la même famille que « ${m} » ?`; return qcm({ visuel: '👨‍👩‍👧', enonce: q, dire: q }, b, f); }
    if (t === 2) {
      const [fam, intrus] = tireIntrus();
      return qcm({ visuel: '🕵️', enonce: 'Quel mot n\'est pas de la même famille que les autres ?', dire: 'Quel mot n\'est pas de la même famille que les autres ?' }, intrus, fam);
    }
    const [cat, dedans, dehors] = tireGen();
    const q = `Quel mot n'est pas ${cat} ?`;
    return qcm({ visuel: '🕵️', enonce: q, dire: q }, pioche(dehors), melange(dedans).slice(0, 3));
  };

  // ---- Dictée de mots (le mot est lu, l'enfant l'écrit)
  const DICTEE_CE1 = [
    ['avec', 'Je joue avec mon frère.'], ['dans', 'Le chat dort dans le panier.'], ['sur', 'Le livre est sur la table.'], ['sous', 'Le chien est sous le lit.'],
    ['pour', 'Ce cadeau est pour toi.'], ['mais', 'Il est petit, mais il court vite.'], ['très', 'Il fait très chaud.'], ['après', 'Après l\'école, je goûte.'],
    ['avant', 'Lave-toi les mains avant le repas.'], ['aussi', 'Moi aussi, j\'aime les frites.'], ['alors', 'Il pleut, alors je prends mon parapluie.'],
    ['toujours', 'Mon chat dort toujours au soleil.'], ['jamais', 'Je ne mens jamais.'], ['souvent', 'Nous allons souvent au parc.'],
    ['beaucoup', 'Il y a beaucoup de monde.'], ['maintenant', 'Tu peux sortir maintenant.'], ['demain', 'Demain, nous irons à la piscine.'],
    ['hier', 'Hier, il a neigé.'], ['aujourd\'hui', 'Aujourd\'hui, il fait beau.'], ['ensuite', 'Je mange, ensuite je me brosse les dents.'],
    ['encore', 'Je veux encore jouer.'], ['déjà', 'Tu as déjà fini ?'], ['chez', 'Je vais chez ma grand-mère.'], ['comme', 'Il court comme un lapin.'],
    ['bientôt', 'Les vacances arrivent bientôt.'], ['longtemps', 'Nous avons attendu longtemps.'], ['pendant', 'Il a dormi pendant le film.'],
    ['maison', 'Ma maison a un jardin.'], ['école', 'Je vais à l\'école à pied.'], ['cartable', 'Mon cartable est lourd.'], ['crayon', 'Prends ton crayon.'],
    ['garçon', 'Ce garçon est mon ami.'], ['fille', 'La petite fille chante.'], ['maman', 'Maman prépare le repas.'], ['papa', 'Papa lit le journal.'],
    ['chien', 'Le chien aboie.'], ['lapin', 'Le lapin mange une carotte.'], ['poisson', 'Le poisson nage.'], ['oiseau', 'L\'oiseau chante.'],
    ['soleil', 'Le soleil brille.'], ['pomme', 'Je croque une pomme.'], ['gâteau', 'Ce gâteau est délicieux.'], ['bateau', 'Le bateau est sur la mer.'],
    ['jardin', 'Les fleurs poussent dans le jardin.'], ['matin', 'Ce matin, je suis en retard.'], ['soir', 'Le soir, je lis une histoire.'],
    ['jour', 'Il fait jour.'], ['nuit', 'La nuit, on voit les étoiles.'], ['hiver', 'En hiver, il fait froid.'], ['été', 'En été, nous allons à la mer.'],
    ['classe', 'Notre classe est grande.'], ['maîtresse', 'La maîtresse écrit au tableau.', ['maitresse']], ['livre', 'J\'ouvre mon livre.'],
    ['cahier', 'J\'écris dans mon cahier.'], ['chaise', 'Assieds-toi sur ta chaise.'], ['porte', 'Ferme la porte.'], ['fenêtre', 'Ouvre la fenêtre.'],
    ['frère', 'Mon frère a dix ans.'], ['sœur', 'Ma sœur est petite.', ['soeur']], ['vélo', 'Je roule à vélo.'], ['forêt', 'Le loup vit dans la forêt.'],
    ['lune', 'La lune brille la nuit.'], ['neige', 'La neige est blanche.'], ['montagne', 'Nous marchons dans la montagne.']
  ];
  const tireDictee = tirage(DICTEE_CE1);
  const genDictee = () => {
    const [mot, ex, acc] = tireDictee();
    const q = { type: 'saisie', visuel: '🎧', enonce: 'Écoute bien, puis écris le mot.', aide: 'Touche 🔊 Écouter pour l\'entendre encore.', dire: `Écris le mot : ${mot}. ${ex} ${mot}.`, bonne: mot };
    if (acc) q.accepte = acc;
    return q;
  };

  ajouterMatiere('CE1', {
    id: 'francais', titre: 'Français', emoji: '✏️', couleur: '#e5484d', jeux: [
      { id: 'sons', titre: 'Les sons', emoji: '👂', gen: genSons },
      { id: 'lecture', titre: 'Lire des phrases', emoji: '📝', gen: genLecture },
      { id: 'textes', titre: 'Petits textes', emoji: '📚', gen: genTextes },
      { id: 'alphabet', titre: 'Ordre alphabétique', emoji: '🔤', gen: genAlphabet },
      { id: 'nature', titre: 'Nom, verbe, adjectif', emoji: '🏷️', gen: genNature },
      { id: 'genre-nombre', titre: 'Masculin, féminin, pluriel', emoji: '👫', gen: genGenreNombre },
      { id: 'conjugaison', titre: 'Conjugaison', emoji: '⏳', gen: genConjugaison },
      { id: 'homophones', titre: 'a/à, et/est, son/sont', emoji: '🔀', gen: genHomophones },
      { id: 'phrase', titre: 'La phrase et la ponctuation', emoji: '❓', gen: genPhrase },
      { id: 'vocabulaire', titre: 'Contraires et familles', emoji: '🔁', gen: genVocabulaire },
      { id: 'dictee', titre: 'Dictée de mots', emoji: '🎧', gen: genDictee }
    ]
  });

  /* =====================================================================
     QUESTIONNER LE MONDE
     ===================================================================== */
  const VIVANT = [
    { q: 'Un animal qui mange seulement des plantes est…', v: '🐄', b: 'herbivore', f: ['carnivore', 'omnivore'] },
    { q: 'Le lion mange d\'autres animaux. Il est…', v: '🦁', b: 'carnivore', f: ['herbivore', 'omnivore'] },
    { q: 'Le lapin mange de l\'herbe et des carottes. Il est…', v: '🐰', b: 'herbivore', f: ['carnivore', 'omnivore'] },
    { q: 'L\'ours mange des fruits, du miel et des poissons : il mange de tout. Il est…', v: '🐻', b: 'omnivore', f: ['herbivore', 'carnivore'] },
    { q: 'Que mange la vache ?', v: '🐄', b: 'de l\'herbe', f: ['de la viande', 'des poissons', 'des insectes'] },
    { q: 'Que mange l\'araignée ?', v: '🕷️', b: 'des insectes', f: ['de l\'herbe', 'des graines', 'du lait'] },
    { q: 'Où vit le dauphin ?', v: '🐬', b: 'dans la mer', f: ['dans la forêt', 'dans le désert', 'dans une ferme'] },
    { q: 'Où vit l\'écureuil ?', v: '🐿️', b: 'dans la forêt', f: ['dans la mer', 'dans le désert', 'sur la banquise'] },
    { q: 'Où vit le chameau ?', v: '🐫', b: 'dans le désert', f: ['sur la banquise', 'dans la mer', 'dans la forêt'] },
    { q: 'Où vit l\'ours blanc ?', v: '🧊', b: 'sur la banquise', f: ['dans le désert', 'dans la jungle', 'dans une ferme'] },
    { q: 'Quel animal naît dans un œuf ?', v: '🥚', b: '🐢', f: ['🐶', '🐄', '🐱'] },
    { q: 'Quel animal a un bébé qui sort du ventre de sa maman ?', b: '🐴', f: ['🐔', '🐢', '🐟'] },
    { q: 'Comment s\'appelle le bébé de la grenouille ?', v: '🐸', b: 'le têtard', f: ['le poussin', 'le faon', 'la chenille'] },
    { q: 'Le faon est le petit de…', v: '🦌', b: 'la biche', f: ['la vache', 'la chèvre', 'la jument'] },
    { q: 'Dans quel ordre le papillon grandit-il ?', v: '🦋', b: 'œuf, chenille, chrysalide, papillon', f: ['chenille, œuf, papillon, chrysalide', 'papillon, œuf, chrysalide, chenille', 'œuf, papillon, chenille, chrysalide'] },
    { q: 'Que peut devenir une graine ?', v: '🌰', b: 'une plante', f: ['un caillou', 'un animal', 'un nuage'] },
    { q: 'Quand une graine commence à pousser, on dit qu\'elle…', v: '🌱', b: 'germe', f: ['fond', 'gèle', 's\'envole'] },
    { q: 'Quand une graine de haricot germe, qu\'est-ce qui sort en premier ?', v: '🫘', b: 'la racine', f: ['la fleur', 'le fruit', 'une feuille'] },
    { q: 'De quoi une graine a-t-elle besoin pour germer ?', v: '🌰', b: 'd\'eau', f: ['de sel', 'de sucre', 'de musique'] },
    { q: 'Par où la plante boit-elle l\'eau ?', v: '🌿', b: 'par ses racines', f: ['par ses fleurs', 'par ses feuilles', 'par ses fruits'] },
    { q: 'Dans quelle partie de la plante trouve-t-on les graines ?', v: '🍎', b: 'dans le fruit', f: ['dans la racine', 'dans la tige', 'dans la feuille'] },
    { q: 'Une plante qu\'on laisse longtemps dans le noir…', v: '🌑', b: 'jaunit et meurt', f: ['pousse plus vite', 'devient bleue', 'donne plus de fleurs'] },
    { q: 'Qu\'ont en commun tous les êtres vivants ?', v: '🌍', b: 'ils naissent, grandissent et meurent', f: ['ils ont des pattes', 'ils volent', 'ils vivent dans l\'eau'] },
    { q: 'Qu\'est-ce qui n\'est pas vivant ?', b: 'un caillou', f: ['un arbre', 'un escargot', 'un champignon'] },
    { q: 'Quel animal est un insecte ?', b: '🐝', f: ['🕷️', '🐌', '🐸'] },
    { q: 'Combien de pattes a une araignée ?', v: '🕷️', b: '8', f: ['6', '4', '10'] },
    { q: 'Quel animal se déplace en rampant ?', b: '🐍', f: ['🐇', '🐦', '🐎'] },
    { q: 'Le corps des oiseaux est couvert de…', v: '🐦', b: 'plumes', f: ['poils', 'écailles', 'piquants'] },
    { q: 'Le corps du chat est couvert de…', v: '🐱', b: 'poils', f: ['plumes', 'écailles', 'piquants'] },
    { q: 'Grâce à quoi le poisson respire-t-il dans l\'eau ?', v: '🐟', b: 'ses branchies', f: ['ses poumons', 'ses nageoires', 'ses écailles'] }
  ];
  const MATIERE = [
    { q: 'Quels sont les trois états de l\'eau ?', v: '💧', b: 'solide, liquide et gazeux', f: ['chaud, froid et tiède', 'rouge, bleu et vert', 'petit, moyen et grand'] },
    { q: 'La glace, c\'est de l\'eau à l\'état…', v: '🧊', b: 'solide', f: ['liquide', 'gazeux'] },
    { q: 'L\'eau du robinet est à l\'état…', v: '🚰', b: 'liquide', f: ['solide', 'gazeux'] },
    { q: 'La vapeur d\'eau, c\'est de l\'eau à l\'état…', v: '♨️', b: 'gazeux', f: ['solide', 'liquide'] },
    { q: 'Quand on met de l\'eau au congélateur, elle devient…', v: '❄️', b: 'de la glace', f: ['de la vapeur', 'du sable', 'de l\'huile'] },
    { q: 'Que fait un glaçon posé au soleil ?', v: '🧊☀️', b: 'il fond', f: ['il gèle', 'il grossit', 'il durcit'] },
    { q: 'Quand l\'eau bout dans une casserole, que s\'en échappe-t-il ?', v: '🍲', b: 'de la vapeur d\'eau', f: ['de la glace', 'du sable', 'de la neige'] },
    { q: 'Le linge mouillé sèche au soleil, car l\'eau…', v: '👕', b: 's\'évapore', f: ['gèle', 'devient du sel', 'devient de la glace'] },
    { q: 'La neige et la grêle, c\'est de l\'eau…', v: '🌨️', b: 'solide', f: ['liquide', 'gazeuse'] },
    { q: 'À quelle température l\'eau gèle-t-elle ?', v: '🌡️', b: '0 degré', f: ['50 degrés', '100 degrés', '20 degrés'] },
    { q: 'Qu\'est-ce qui est un solide ?', b: 'un caillou', f: ['du lait', 'du jus d\'orange', 'de l\'eau'] },
    { q: 'Qu\'est-ce qui est un liquide ?', b: 'le lait', f: ['le bois', 'la pierre', 'le verre'] },
    { q: 'Un liquide prend la forme…', v: '🥛', b: 'du récipient qui le contient', f: ['d\'un cube', 'd\'une boule', 'd\'une étoile'] },
    { q: 'Qu\'est-ce qui fond quand il fait très chaud ?', v: '☀️', b: 'le chocolat', f: ['le bois', 'la pierre', 'le verre'] },
    { q: 'Quel objet flotte sur l\'eau ?', v: '🌊', b: 'un bouchon', f: ['une clé', 'une pièce', 'un caillou'] },
    { q: 'Quel objet coule au fond de l\'eau ?', v: '🌊', b: 'une bille en fer', f: ['une plume', 'un bouchon', 'une feuille d\'arbre'] },
    { q: 'Qu\'est-ce qu\'un aimant attire ?', v: '🧲', b: 'un trombone en fer', f: ['une gomme', 'un crayon en bois', 'une feuille de papier'] },
    { q: 'L\'air est-il de la matière ?', v: '🎈', b: 'oui, même si on ne le voit pas', f: ['non, c\'est du vide', 'non, jamais'] },
    { q: 'Qu\'est-ce qui montre que l\'air existe ?', v: '🍃', b: 'le vent fait bouger les feuilles', f: ['la lune brille', 'les pierres sont dures', 'le sucre est sucré'] },
    { q: 'En quelle matière est faite une vitre ?', v: '🪟', b: 'en verre', f: ['en bois', 'en laine', 'en papier'] },
    { q: 'En quelle matière est fait un pull bien chaud ?', v: '🧶', b: 'en laine', f: ['en verre', 'en fer', 'en pierre'] },
    { q: 'Avec quoi fabrique-t-on le papier ?', v: '📄', b: 'avec du bois', f: ['avec du verre', 'avec du fer', 'avec de la laine'] },
    { q: 'Où trouve-t-on de l\'eau salée ?', v: '🧂', b: 'dans la mer', f: ['au robinet', 'dans la rivière', 'dans la pluie'] },
    { q: 'On met du sucre dans l\'eau et on remue. Que se passe-t-il ?', v: '🥄', b: 'il se dissout', f: ['il gèle', 'il flotte', 'il devient du sel'] }
  ];
  const CORPS = [
    { q: 'Combien de dents de lait a un enfant ?', v: '🦷', b: '20', f: ['10', '32', '50'] },
    { q: 'Combien de fois par jour faut-il se brosser les dents ?', v: '🦷', b: '2 fois : le matin et le soir', f: ['1 fois par semaine', 'jamais', '10 fois'] },
    { q: 'Combien de temps dure un bon brossage des dents ?', v: '⏱️', b: '2 minutes', f: ['2 secondes', '2 heures', '10 secondes'] },
    { q: 'Quelles dents, devant, coupent les aliments ?', v: '🦷', b: 'les incisives', f: ['les molaires', 'les canines'] },
    { q: 'Quelles dents, au fond de la bouche, écrasent les aliments ?', v: '🦷', b: 'les molaires', f: ['les incisives', 'les canines'] },
    { q: 'Qu\'est-ce qui abîme les dents ?', v: '🦷', b: 'les bonbons et le sucre', f: ['l\'eau', 'les légumes', 'le dentifrice'] },
    { q: 'Combien d\'heures un enfant de 7 ans doit-il dormir chaque nuit ?', v: '🛏️', b: 'environ 10 heures', f: ['environ 3 heures', 'environ 5 heures', 'environ 20 heures'] },
    { q: 'Avant de dormir, il vaut mieux…', v: '🌙', b: 'lire un livre au calme', f: ['jouer aux jeux vidéo', 'regarder un écran', 'boire un soda'] },
    { q: 'Quand on n\'a pas assez dormi, on…', v: '🥱', b: 'apprend moins bien', f: ['court plus vite', 'grandit plus vite', 'apprend mieux'] },
    { q: 'Quel repas donne de l\'énergie pour bien commencer la journée ?', v: '🥣', b: 'le petit-déjeuner', f: ['le goûter', 'le dîner', 'le pique-nique'] },
    { q: 'Quelle boisson est la meilleure pour la santé ?', v: '🥤', b: 'l\'eau', f: ['le soda', 'le sirop', 'le jus très sucré'] },
    { q: 'Combien de fruits et légumes faut-il manger chaque jour ?', v: '🥦', b: '5', f: ['0', '1', '20'] },
    { q: 'Quel aliment donne du calcium pour avoir des os solides ?', b: '🧀', f: ['🍬', '🍟', '🍭'] },
    { q: 'Les pâtes, le riz et le pain donnent…', v: '🍝', b: 'de l\'énergie', f: ['des caries', 'des boutons', 'le rhume'] },
    { q: 'Quels aliments faut-il manger rarement ?', v: '🍭', b: 'les bonbons', f: ['les pommes', 'les carottes', 'le poisson'] },
    { q: 'Un repas équilibré contient…', v: '🍽️', b: 'des aliments variés', f: ['seulement des frites', 'seulement du dessert', 'seulement du pain'] },
    { q: 'Pourquoi faut-il bouger et faire du sport ?', v: '🏃', b: 'pour garder un corps en bonne santé', f: ['pour tomber malade', 'pour abîmer ses dents', 'pour moins dormir'] },
    { q: 'Quand on respire, dans quoi l\'air entre-t-il ?', v: '🫁', b: 'dans les poumons', f: ['dans l\'estomac', 'dans le cœur', 'dans les os'] },
    { q: 'Où vont les aliments quand on les avale ?', v: '🍎', b: 'dans l\'estomac', f: ['dans les poumons', 'dans le cœur', 'dans la tête'] },
    { q: 'Pour ne pas attraper de microbes, il faut…', v: '🧼', b: 'se laver les mains souvent', f: ['ne jamais se laver', 'manger avec les doigts sales', 'partager sa brosse à dents'] },
    { q: 'Quand on éternue, on met devant sa bouche…', v: '🤧', b: 'son coude', f: ['la main de son voisin', 'rien du tout', 'son cahier'] },
    { q: 'Quel numéro appeler pour une urgence médicale (le SAMU) ?', v: '🚑', b: '15', f: ['17', '18', '12'] },
    { q: 'Quel numéro appeler pour joindre la police ?', v: '🚓', b: '17', f: ['15', '18', '10'] },
    { q: 'À la maison, quel produit est dangereux et ne se touche pas ?', v: '⚠️', b: 'l\'eau de Javel', f: ['l\'eau du robinet', 'le lait', 'le jus de pomme'] },
    { q: 'Pourquoi ne faut-il jamais mettre les doigts dans une prise électrique ?', v: '🔌', b: 'on peut s\'électrocuter', f: ['elle est trop froide', 'elle peut s\'envoler', 'elle est collante'] },
    { q: 'On s\'est brûlé un doigt. Que faut-il faire ?', v: '🔥', b: 'le mettre sous l\'eau froide', f: ['mettre du beurre dessus', 'ne rien dire', 'le cacher dans sa poche'] },
    { q: 'Au soleil, en été, on se protège avec…', v: '☀️', b: 'un chapeau et de la crème solaire', f: ['un bonnet de laine', 'une écharpe', 'rien du tout'] }
  ];
  const CITOYEN_CE1 = [
    { q: 'Qui décide des règles de vie de la classe ?', v: '📜', b: 'la classe, tous ensemble', f: ['le maire', 'le boulanger', 'un seul élève'] },
    { q: 'Si on ne respecte pas une règle, il peut y avoir…', v: '⚖️', b: 'une sanction', f: ['une récompense', 'un cadeau', 'une fête'] },
    { q: 'Un élève se moque tous les jours d\'un camarade. Que faut-il faire ?', v: '😟', b: 'en parler à un adulte', f: ['rire avec lui', 'ne rien dire', 'se moquer aussi'] },
    { q: 'Un nouvel élève arrive dans la classe. Que fais-tu ?', v: '🧒', b: 'je l\'aide et je l\'invite à jouer', f: ['je me moque de lui', 'je l\'ignore', 'je lui prends ses affaires'] },
    { q: 'Quels sont des symboles de la République française ?', v: '🇫🇷', b: 'le drapeau, la Marseillaise et Marianne', f: ['le roi, la couronne et le château', 'le soleil, la lune et les étoiles', 'le lion, l\'aigle et le loup'] },
    { q: 'Comment s\'appelle l\'hymne national de la France ?', v: '🎵', b: 'la Marseillaise', f: ['Frère Jacques', 'Au clair de la lune', 'Joyeux anniversaire'] },
    { q: 'Quelle est la devise de la France ?', v: '🇫🇷', b: 'Liberté, Égalité, Fraternité', f: ['Un pour tous, tous pour un', 'Paix et amour', 'Force et courage'] },
    { q: 'Quel jour est la fête nationale ?', v: '🎆', b: 'le 14 juillet', f: ['le 25 décembre', 'le 1er janvier', 'le 1er avril'] },
    { q: 'Comment s\'appelle la femme qui représente la République ?', v: '🏛️', b: 'Marianne', f: ['Cendrillon', 'Blanche-Neige', 'la reine'] },
    { q: 'Qui dirige la France ?', v: '🇫🇷', b: 'le président de la République', f: ['le roi', 'le maire', 'le directeur de l\'école'] },
    { q: 'À l\'école, nous sommes tous différents, mais nous avons…', v: '🤝', b: 'les mêmes droits', f: ['aucun droit', 'des droits seulement pour les grands', 'des droits seulement pour les garçons'] },
    { q: 'Tu as cassé le crayon d\'un camarade sans le faire exprès. Que fais-tu ?', v: '✏️', b: 'je m\'excuse', f: ['je le cache', 'j\'accuse un autre élève', 'je me moque de lui'] },
    { q: 'En classe, que faut-il faire quand quelqu\'un parle ?', v: '👂', b: 'l\'écouter', f: ['lui couper la parole', 'crier', 'se lever'] },
    { q: 'Pendant un débat en classe, on…', v: '🙋', b: 'lève le doigt et attend son tour', f: ['parle tous en même temps', 'se dispute', 'quitte la classe'] },
    { q: 'Que peut-on faire pour protéger la planète ?', v: '🌍', b: 'trier ses déchets', f: ['jeter ses papiers par terre', 'laisser la lumière allumée', 'laisser couler l\'eau'] },
    { q: 'Où jette-t-on une bouteille en plastique vide ?', v: '♻️', b: 'dans la poubelle de tri', f: ['dans la nature', 'dans la rivière', 'dans le lavabo'] },
    { q: 'Quand on se brosse les dents, pour économiser l\'eau, on…', v: '🚰', b: 'ferme le robinet', f: ['laisse couler l\'eau', 'prend un bain', 'remplit la baignoire'] },
    { q: 'En voiture, où s\'assoit un enfant de 7 ans ?', v: '🚗', b: 'à l\'arrière, sur un rehausseur, avec la ceinture', f: ['à l\'avant, sur les genoux d\'un adulte', 'dans le coffre', 'debout entre les sièges'] },
    { q: 'Pour traverser, de quelle couleur doit être le petit bonhomme ?', v: '🚦', b: 'vert', f: ['rouge', 'orange'] },
    { q: 'Où ne faut-il jamais jouer au ballon ?', v: '⚽', b: 'sur la route', f: ['dans la cour', 'au parc', 'dans le jardin'] },
    { q: 'Sur Internet, un inconnu te demande ton adresse. Que fais-tu ?', v: '💻', b: 'je ne réponds pas et je préviens un adulte', f: ['je lui donne mon adresse', 'je lui envoie une photo', 'je lui dis où est mon école'] },
    { q: 'Tous les enfants ont le droit…', v: '🧒', b: 'd\'aller à l\'école', f: ['de conduire une voiture', 'de voter', 'de travailler à l\'usine'] },
    { q: 'Un camarade est seul dans la cour et semble triste. Que peux-tu faire ?', v: '😢', b: 'aller lui parler', f: ['le montrer du doigt', 'rire de lui', 'lui lancer le ballon dessus'] }
  ];

  // ---- Le temps qui passe
  const ORDINAUX = ['premier', 'deuxième', 'troisième', 'quatrième', 'cinquième', 'sixième', 'septième', 'huitième', 'neuvième', 'dixième', 'onzième', 'douzième'];
  const SAISON_MOIS = [['janvier', 'l\'hiver'], ['février', 'l\'hiver'], ['avril', 'le printemps'], ['mai', 'le printemps'], ['juillet', 'l\'été'], ['août', 'l\'été'], ['octobre', 'l\'automne'], ['novembre', 'l\'automne']];
  const NB_JOURS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const FAITS_TEMPS = [
    { q: 'Combien de jours y a-t-il dans une année ?', v: '🗓️', b: '365', f: ['100', '12', '52'] },
    { q: 'Quel est le mois le plus court de l\'année ?', v: '🗓️', b: 'février', f: ['janvier', 'juin', 'décembre'] },
    { q: 'Combien d\'heures y a-t-il dans une journée ?', v: '🕛', b: '24', f: ['12', '60', '100'] },
    { q: 'Combien y a-t-il de saisons dans une année ?', v: '🍂', b: '4', f: ['2', '7', '12'] },
    { q: 'Quelle saison commence en décembre ?', v: '❄️', b: 'l\'hiver', f: ['le printemps', 'l\'été', 'l\'automne'] },
    { q: 'Tes grands-parents sont nés…', v: '👵', b: 'avant tes parents', f: ['après toi', 'le même jour que toi', 'après tes parents'] },
    { q: 'Autrefois, avant la machine à laver, où lavait-on le linge ?', v: '🧺', b: 'au lavoir', f: ['au lave-vaisselle', 'à la piscine', 'au garage'] },
    { q: 'Quel objet est le plus récent ?', b: 'la tablette', f: ['la bougie', 'la plume d\'oie', 'la lampe à huile'] },
    { q: 'Quel objet est le plus ancien ?', b: 'la plume d\'oie', f: ['le stylo à bille', 'l\'ordinateur', 'le téléphone portable'] },
    { q: 'Qu\'est-ce qui dure le plus longtemps ?', v: '⏳', b: 'un mois', f: ['une semaine', 'un jour', 'une heure'] },
    { q: 'Sur une frise du temps, où place-t-on ce qui s\'est passé il y a très longtemps ?', v: '➡️', b: 'au début, à gauche', f: ['à la fin, à droite', 'au milieu', 'n\'importe où'] }
  ];
  const quizTemps = quiz(FAITS_TEMPS, '📅');
  const PAPIS = ['Jean', 'Pierre', 'André', 'Michel'], MAMIES = ['Lucie', 'Rose', 'Odette', 'Monique'];
  const PAPAS = ['Marc', 'Karim', 'Julien', 'Thomas'], MAMANS = ['Sophie', 'Nadia', 'Claire', 'Julie'];
  const GARCONS = ['Léo', 'Nathan', 'Yanis', 'Arthur'], FILLES = ['Zoé', 'Lina', 'Manon', 'Alice'];
  const arbre = n => {
    const boite = (x, y, nom, e, coul) => `<rect x="${x - 30}" y="${y - 11}" width="60" height="22" rx="6" fill="${coul}" stroke="#555"/>` + txt(x, y + .5, `${e} ${nom}`, 8.5);
    const L = 'stroke="#555" stroke-width="1.5" fill="none"';
    return dessin(
      `<path d="M70 18 H130 M100 18 V42 H60 V58" ${L}/><path d="M90 69 H130 M110 69 V96 H60 V112 M110 96 H160 V112" ${L}/>`
      + boite(40, 18, n.papi, '👴', '#dbe8ff') + boite(160, 18, n.mamie, '👵', '#ffe0ef')
      + boite(60, 69, n.papa, '👨', '#dbe8ff') + boite(160, 69, n.maman, '👩', '#ffe0ef')
      + boite(60, 123, n.fils, '👦', '#dbe8ff') + boite(160, 123, n.fille, '👧', '#ffe0ef'), 200, 138, 300);
  };
  const genTemps = () => {
    const t = alea(0, 6);
    if (t === 0) {
      const i = alea(0, 6), [txtQ, dec] = pioche([['Quel jour serons-nous après-demain ?', 2], ['Quel jour étions-nous avant-hier ?', 5], ['Quel jour serons-nous dans une semaine ?', 7], ['Quel jour serons-nous demain ?', 1]]);
      const q = `Aujourd'hui, c'est ${JOURS[i]}. ${txtQ}`;
      return qcm({ visuel: '📅', enonce: q, dire: q }, JOURS[(i + dec) % 7], JOURS.filter((j, k) => k !== (i + dec) % 7));
    }
    if (t === 1) {
      const i = alea(0, 11);
      if (Math.random() < .5) {
        const q = `Quel est le ${ORDINAUX[i]} mois de l'année ?`;
        return qcm({ visuel: '🗓️', enonce: q, dire: q }, MOIS[i], [MOIS[(i + 1) % 12], MOIS[(i + 11) % 12], MOIS[(i + 2) % 12], MOIS[(i + 6) % 12]]);
      }
      const avant = Math.random() < .5, bon = MOIS[(i + (avant ? 11 : 1)) % 12];
      const q = `Quel mois vient juste ${avant ? 'avant' : 'après'} ${MOIS[i]} ?`;
      return qcm({ visuel: '🗓️', enonce: q, dire: q }, bon, [MOIS[(i + (avant ? 1 : 11)) % 12], MOIS[(i + (avant ? 10 : 2)) % 12], MOIS[(i + 6) % 12]]);
    }
    if (t === 2) {
      const [m, s] = pioche(SAISON_MOIS), q = `En quelle saison est le mois ${deN(m)} ?`;
      return qcm({ visuel: '🌦️', enonce: q, dire: q }, s, ['l\'hiver', 'le printemps', 'l\'été', 'l\'automne']);
    }
    if (t === 3) {
      const m = alea(0, 11), debut = alea(0, 6), nb = NB_JOURS[m];
      let cal = `<table style="border-collapse:collapse;font-size:.26em;margin:auto;background:#fff"><tr><th colspan="7" style="padding:4px;background:#3bb273;color:#fff">${Maj(MOIS[m])}</th></tr><tr>`
        + ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'].map(j => `<th style="padding:2px 5px;border:1px solid #ccc">${j}</th>`).join('') + '</tr><tr>';
      for (let k = 0; k < debut; k++) cal += '<td style="border:1px solid #eee"></td>';
      for (let d = 1; d <= nb; d++) {
        cal += `<td style="padding:2px 5px;border:1px solid #ccc;text-align:center">${d}</td>`;
        if ((debut + d) % 7 === 0 && d < nb) cal += '</tr><tr>';
      }
      cal += '</tr></table>';
      const k = alea(0, 2);
      if (k === 0) {
        const d = alea(1, nb), bon = JOURS[(debut + d - 1) % 7], q = `Sur ce calendrier, quel jour de la semaine est le ${d === 1 ? '1er' : d} ${MOIS[m]} ?`;
        return qcm({ visuel: cal, enonce: q, dire: q }, bon, JOURS.filter(j => j !== bon));
      }
      if (k === 1) {
        const j = alea(0, 6), nbJ = [...Array(nb)].filter((_, d) => (debut + d) % 7 === j).length, q = `Sur ce calendrier, combien y a-t-il de ${JOURS[j]}s en ${MOIS[m]} ?`;
        return qcm({ visuel: cal, enonce: q, dire: q }, nbJ, [3, 4, 5, 6]);
      }
      const j = alea(0, 6), premier = ((j - debut + 7) % 7) + 1, q = `Sur ce calendrier, quelle est la date du premier ${JOURS[j]} ${deN(MOIS[m])} ?`;
      return qcm({ visuel: cal, enonce: q, dire: q }, `le ${premier === 1 ? '1er' : premier}`, [1, 2, 3, 4, 5, 6, 7, 8].filter(x => x !== premier).map(x => `le ${x === 1 ? '1er' : x}`));
    }
    if (t === 4 || t === 5) {
      const n = { papi: pioche(PAPIS), mamie: pioche(MAMIES), papa: pioche(PAPAS), maman: pioche(MAMANS), fils: pioche(GARCONS), fille: pioche(FILLES) };
      const tous = Object.values(n), enfant = pioche(['fils', 'fille']), e = n[enfant], autre = n[enfant === 'fils' ? 'fille' : 'fils'];
      const QS = [
        [`Sur cet arbre, qui est le papa ${deN(e)} ?`, n.papa], [`Sur cet arbre, qui est la maman ${deN(e)} ?`, n.maman],
        [`Sur cet arbre, qui est le grand-père ${deN(e)} ?`, n.papi], [`Sur cet arbre, qui est la grand-mère ${deN(e)} ?`, n.mamie],
        [`Sur cet arbre, qui est ${enfant === 'fils' ? 'la sœur' : 'le frère'} ${deN(e)} ?`, autre],
        [`Qui sont les parents ${deN(n.papa)} ?`, `${n.papi} et ${n.mamie}`]
      ];
      if (Math.random() < .3) {
        const [q, b, f] = pioche([
          [`${n.mamie} est la … ${deN(n.papa)}.`, 'mère', ['sœur', 'fille', 'grand-mère']],
          [`${n.fils} est le … ${deN(n.papi)}.`, 'petit-fils', ['fils', 'frère', 'père']],
          [`${n.fille} est la … ${deN(n.maman)}.`, 'fille', ['mère', 'sœur', 'grand-mère']],
          ['Combien de générations y a-t-il sur cet arbre ?', '3', ['2', '4', '6']]
        ]);
        return qcm({ visuel: arbre(n), enonce: q, dire: q.replace('…', 'quoi') }, b, f);
      }
      const [q, b] = pioche(QS);
      const f = /parents/.test(q) ? [`${n.papa} et ${n.maman}`, `${n.fils} et ${n.fille}`, `${n.papi} et ${n.maman}`] : tous.filter(x => x !== b && x !== e);
      return qcm({ visuel: arbre(n), enonce: q, dire: q }, b, f);
    }
    return quizTemps();
  };

  // ---- Se repérer dans l'espace
  const LIEUX_PLAN = [['🏫', 'l\'école'], ['🏠', 'la maison'], ['🌳', 'l\'arbre'], ['⛲', 'la fontaine'], ['🏪', 'le magasin'], ['🚗', 'la voiture'],
    ['🐶', 'le chien'], ['🌸', 'la fleur'], ['⚽', 'le ballon'], ['🚲', 'le vélo'], ['🏥', 'l\'hôpital'], ['🚌', 'le bus']];
  const PAYSAGES = [
    ['la montagne', ['🏔️🌲⛷️', '🏔️🐐🌲', '⛰️🏔️🚠', '🏔️❄️⛷️']], ['la mer', ['🏖️🌊⛵', '🌊🐚🏖️', '⚓⛵🌊', '🦀🏖️🌊']],
    ['la campagne', ['🚜🐄🌾', '🌾🐑🏡', '🐓🚜🌻', '🐄🌳🌾']], ['la ville', ['🏙️🚕🏬', '🏢🚦🚌', '🏬🏢🚇', '🚕🏙️🚦']]
  ];
  const ESPACE_CE1 = [
    { q: 'Un plan est un dessin vu…', v: '🗺️', b: 'de dessus', f: ['de côté', 'de dessous', 'de derrière'] },
    { q: 'Sur une carte, à quoi sert la légende ?', v: '🗺️', b: 'à expliquer les couleurs et les symboles', f: ['à raconter une histoire', 'à donner l\'heure', 'à décorer'] },
    { q: 'Sur une carte, où est le nord ?', v: '🧭', b: 'en haut', f: ['en bas', 'à gauche', 'à droite'] },
    { q: 'Qu\'est-ce qu\'un globe ?', v: '🌐', b: 'une petite Terre en forme de boule', f: ['un plan de la ville', 'un plan de l\'école', 'une photo du ciel'] },
    { q: 'Sur le globe, que montre la couleur bleue ?', v: '🌐', b: 'les mers et les océans', f: ['les forêts', 'les villes', 'les montagnes'] },
    { q: 'Comment s\'appelle notre pays ?', v: '🇫🇷', b: 'la France', f: ['l\'Europe', 'Paris', 'la Terre'] },
    { q: 'Quelle est la capitale de la France ?', v: '🗼', b: 'Paris', f: ['Lyon', 'Marseille', 'Lille'] },
    { q: 'Sur quel continent se trouve la France ?', v: '🌍', b: 'l\'Europe', f: ['l\'Afrique', 'l\'Asie', 'l\'Amérique'] },
    { q: 'Du plus petit au plus grand, quel ordre est juste ?', v: '🔎', b: 'ma maison, ma ville, la France, la Terre', f: ['la Terre, ma ville, la France, ma maison', 'ma ville, ma maison, la Terre, la France', 'la France, ma maison, la Terre, ma ville'] },
    { q: 'Que trouve-t-on au bord de la mer ?', v: '🌊', b: 'une plage et un port', f: ['des pistes de ski', 'des glaciers', 'des sommets enneigés'] },
    { q: 'À la campagne, on trouve surtout…', v: '🌾', b: 'des champs et des fermes', f: ['des gratte-ciel', 'des stations de métro', 'des pistes de ski'] },
    { q: 'À la montagne, en hiver, on peut…', v: '🏔️', b: 'faire du ski', f: ['se baigner dans la mer', 'ramasser des coquillages', 'faire des châteaux de sable'] },
    { q: 'Qu\'est-ce qui montre le chemin de la maison à l\'école, vu de dessus ?', v: '🏫', b: 'un plan', f: ['un calendrier', 'une horloge', 'une photo de classe'] },
    { q: 'Quel objet permet de trouver le nord ?', v: '🧭', b: 'une boussole', f: ['une montre', 'une règle', 'un thermomètre'] },
    { q: 'Quels sont les quatre points cardinaux ?', v: '🧭', b: 'nord, sud, est, ouest', f: ['haut, bas, gauche, droite', 'devant, derrière, dessus, dessous', 'matin, midi, soir, nuit'] }
  ];
  const quizEspace = quiz(ESPACE_CE1, '🗺️');
  const genEspace = () => {
    const t = alea(0, 3);
    if (t <= 1) {
      const lieux = melange(LIEUX_PLAN).slice(0, 5), cases = melange([...Array(16).keys()]).slice(0, 5);
      const nomCase = k => 'ABCD'[k % 4] + (Math.floor(k / 4) + 1);
      let tab = '<table style="border-collapse:collapse;font-size:.42em;margin:auto;background:#fff"><tr><td></td>' + 'ABCD'.split('').map(l => `<th style="padding:0 6px;color:#3bb273">${l}</th>`).join('') + '</tr>';
      for (let r = 0; r < 4; r++) {
        tab += `<tr><th style="padding:0 6px;color:#3bb273">${r + 1}</th>`;
        for (let c = 0; c < 4; c++) { const i = cases.indexOf(r * 4 + c); tab += `<td style="width:1.5em;height:1.5em;border:2px solid #9bb;text-align:center">${i >= 0 ? lieux[i][0] : ''}</td>`; }
        tab += '</tr>';
      }
      tab += '</table>';
      const i = alea(0, 4), k = cases[i];
      if (t === 0) {
        const q = `Dans quelle case se trouve ${lieux[i][1]} ?`, bon = nomCase(k);
        const inv = 'ABCD'[Math.floor(k / 4)] + (k % 4 + 1);
        return qcm({ visuel: tab, enonce: q, dire: q, aide: 'On donne d\'abord la lettre (la colonne), puis le chiffre (la ligne).' }, bon, [inv, ...cases.filter(x => x !== k).map(nomCase), nomCase((k + 1) % 16)]);
      }
      const q = `Qu'y a-t-il dans la case ${nomCase(k)} ?`;
      return qcm({ visuel: tab, enonce: q, dire: q }, lieux[i][0], lieux.filter((_, j) => j !== i).map(x => x[0]));
    }
    if (t === 2) {
      const [nom, scenes] = pioche(PAYSAGES);
      return qcm({ visuel: pioche(scenes), enonce: 'Quel paysage vois-tu ?', dire: 'Regarde les images. Quel paysage est-ce ?' }, nom, PAYSAGES.map(p => p[0]));
    }
    return quizEspace();
  };

  ajouterMatiere('CE1', {
    id: 'monde', titre: 'Questionner le monde', emoji: '🌍', couleur: '#3bb273', jeux: [
      { id: 'quiz-vivant', titre: 'Animaux et plantes', emoji: '🌱', gen: quiz(VIVANT, '🌱') },
      { id: 'quiz-matiere', titre: 'L\'eau et la matière', emoji: '💧', gen: quiz(MATIERE, '💧') },
      { id: 'quiz-corps', titre: 'Corps, santé et sécurité', emoji: '🦷', gen: quiz(CORPS, '🧍') },
      { id: 'temps', titre: 'Le temps qui passe', emoji: '📅', gen: genTemps },
      { id: 'espace', titre: 'Se repérer dans l\'espace', emoji: '🗺️', gen: genEspace },
      { id: 'citoyen', titre: 'Vivre ensemble', emoji: '🤝', gen: quiz(CITOYEN_CE1, '🤝') }
    ]
  });

  /* =====================================================================
     ANGLAIS (chaque mot est d'abord appris, puis demandé)
     ===================================================================== */
  // [anglais, image, français]
  const ecoute = (en, e, fr, liste, consigne = 'Écoute, et touche la bonne image :') => {
    const autres = melange(liste.filter(x => x[1] !== e)).slice(0, 3).map(x => x[1]);
    return { visuel: '🔊', enonce: `Écoute : « ${en} »`, dire: consigne, direEn: en, fr, choix: melange([e, ...autres]), bonne: e };
  };
  const COULEURS_EN = [['red', '🔴', 'rouge'], ['blue', '🔵', 'bleu'], ['green', '🟢', 'vert'], ['yellow', '🟡', 'jaune'], ['orange', '🟠', 'orange'],
    ['purple', '🟣', 'violet'], ['black', '⚫', 'noir'], ['white', '⚪', 'blanc'], ['brown', '🟤', 'marron']];
  const NOMBRES_EN_20 = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  const genColoursNumbers = () => {
    if (Math.random() < .35) { const [en, e, fr] = pioche(COULEURS_EN); return ecoute(en, e, fr, COULEURS_EN, 'Écoute, et touche la bonne couleur :'); }
    const n = alea(1, 20), f = new Set();
    [n + 10, n - 10, n + 1, n - 1, n + 2].filter(x => x >= 1 && x <= 20).forEach(x => f.add(x));
    const fausses = melange([...f]).slice(0, 3).map(String);
    return { visuel: '🔊', enonce: `Écoute : « ${NOMBRES_EN_20[n]} »`, dire: 'Écoute, et touche le bon nombre :', direEn: NOMBRES_EN_20[n], fr: enLettres(n), choix: melange([String(n), ...fausses]), bonne: String(n) };
  };
  const ANIMAUX_EN = [['dog', '🐶', 'le chien'], ['cat', '🐱', 'le chat'], ['bird', '🐦', 'l\'oiseau'], ['fish', '🐟', 'le poisson'], ['horse', '🐴', 'le cheval'],
    ['cow', '🐮', 'la vache'], ['pig', '🐷', 'le cochon'], ['duck', '🦆', 'le canard'], ['rabbit', '🐰', 'le lapin'], ['mouse', '🐭', 'la souris'],
    ['lion', '🦁', 'le lion'], ['elephant', '🐘', 'l\'éléphant'], ['monkey', '🐵', 'le singe'], ['frog', '🐸', 'la grenouille'], ['bear', '🐻', 'l\'ours'], ['sheep', '🐑', 'le mouton']];
  const FAMILLE_EN = [['mother', '👩', 'la mère'], ['father', '👨', 'le père'], ['sister', '👧', 'la sœur'], ['brother', '👦', 'le frère'],
    ['baby', '👶', 'le bébé'], ['grandmother', '👵', 'la grand-mère'], ['grandfather', '👴', 'le grand-père']];
  const genAnimalsFamily = () => {
    const liste = Math.random() < .6 ? ANIMAUX_EN : FAMILLE_EN, [en, e, fr] = pioche(liste);
    return ecoute(en, e, fr, liste);
  };
  const HABITS_EN = [['hat', '🎩', 'le chapeau'], ['cap', '🧢', 'la casquette'], ['T-shirt', '👕', 'le tee-shirt'], ['trousers', '👖', 'le pantalon'], ['dress', '👗', 'la robe'],
    ['shoes', '👟', 'les chaussures'], ['socks', '🧦', 'les chaussettes'], ['coat', '🧥', 'le manteau'], ['scarf', '🧣', 'l\'écharpe'], ['gloves', '🧤', 'les gants'], ['boots', '👢', 'les bottes']];
  const SALUTS_EN = [['Hello!', '👋', 'Bonjour !'], ['Good morning!', '🌅', 'Bonjour ! (le matin)'], ['Good night!', '🌙', 'Bonne nuit !'], ['Thank you!', '🎁', 'Merci !']];
  const JOURS_EN = [['lundi', 'Monday'], ['mardi', 'Tuesday'], ['mercredi', 'Wednesday'], ['jeudi', 'Thursday'], ['vendredi', 'Friday'], ['samedi', 'Saturday'], ['dimanche', 'Sunday']];
  const genClothesDays = () => {
    const t = Math.random();
    if (t < .5) { const [en, e, fr] = pioche(HABITS_EN); return ecoute(en, e, fr, HABITS_EN); }
    if (t < .65) { const [en, e, fr] = pioche(SALUTS_EN); return ecoute(en, e, fr, SALUTS_EN); }
    const [fr, en] = pioche(JOURS_EN);
    return qcm({ visuel: '📅', enonce: `Comment dit-on « ${fr} » en anglais ?`, dire: `Comment dit-on ${fr} en anglais ?` }, en, JOURS_EN.map(x => x[1]));
  };

  ajouterMatiere('CE1', {
    id: 'anglais', titre: 'Anglais', emoji: '🇬🇧', couleur: '#8e5cd9', jeux: [
      { id: 'colours-numbers', titre: 'Colours and numbers', emoji: '🎨', gen: genColoursNumbers },
      { id: 'animals-family', titre: 'Animals and family', emoji: '🐾', gen: genAnimalsFamily },
      { id: 'clothes-days', titre: 'Clothes and days', emoji: '👕', gen: genClothesDays }
    ]
  });

  /* =====================================================================
     ARTS ET MUSIQUE
     ===================================================================== */
  const MELANGES_CE1 = [['🔴', '🟡', '🟠', 'rouge', 'jaune', 'orange'], ['🔵', '🟡', '🟢', 'bleu', 'jaune', 'vert'], ['🔴', '🔵', '🟣', 'rouge', 'bleu', 'violet']];
  const ARTS = [
    { q: 'Quelles sont les trois couleurs primaires ?', v: '🎨', b: 'rouge, jaune et bleu', f: ['vert, orange et violet', 'noir, blanc et gris', 'rose, marron et vert'] },
    { q: 'Pour rendre une couleur plus claire, on ajoute…', v: '🎨', b: 'du blanc', f: ['du noir', 'du marron', 'du violet'] },
    { q: 'Pour rendre une couleur plus foncée, on ajoute…', v: '🎨', b: 'du noir', f: ['du blanc', 'du jaune', 'de l\'eau'] },
    { q: 'Un tableau qui montre une personne s\'appelle…', v: '🖼️', b: 'un portrait', f: ['un paysage', 'une sculpture', 'une affiche'] },
    { q: 'Un tableau qui montre la campagne, la mer ou la montagne s\'appelle…', v: '🖼️', b: 'un paysage', f: ['un portrait', 'une sculpture', 'une photo d\'identité'] },
    { q: 'Une œuvre en pierre, en bois ou en métal, dont on peut faire le tour, c\'est…', v: '🗿', b: 'une sculpture', f: ['un dessin', 'un portrait', 'une peinture'] },
    { q: 'Où peut-on admirer des tableaux célèbres ?', v: '🖼️', b: 'au musée', f: ['à la piscine', 'à la boulangerie', 'au garage'] },
    { q: 'Quel grand peintre a peint La Joconde ?', v: '🖼️', b: 'Léonard de Vinci', f: ['Pablo Picasso', 'Claude Monet', 'Vincent van Gogh'] },
    { q: 'Quel peintre a peint un célèbre bouquet de tournesols ?', v: '🌻', b: 'Vincent van Gogh', f: ['Léonard de Vinci', 'Pablo Picasso', 'Henri Matisse'] },
    { q: 'Avec quel outil étale-t-on la peinture ?', b: '🖌️', f: ['✂️', '📏', '🔨'] },
    { q: 'Sur quoi le peintre mélange-t-il ses couleurs ?', v: '🎨', b: 'sur une palette', f: ['sur une assiette à soupe', 'sur un ballon', 'sur une fenêtre'] },
    { q: 'Quelle couleur est une couleur chaude ?', b: '🟠', f: ['🔵', '🟢', '🟣'] },
    { q: 'Quelle couleur est une couleur froide ?', b: '🔵', f: ['🔴', '🟠', '🟡'] }
  ];
  const quizArts = quiz(ARTS, '🎨');
  const genCouleurs = () => {
    if (Math.random() < .35) {
      const m = pioche(MELANGES_CE1), [a, b] = Math.random() < .5 ? [0, 1] : [1, 0];
      return qcm({ visuel: `${m[a]} + ${m[b]} = ?`, enonce: 'Quelle couleur obtiens-tu ?', dire: `Si on mélange du ${m[a + 3]} et du ${m[b + 3]}, quelle couleur obtient-on ?` },
        m[2], [...MELANGES_CE1.filter(x => x !== m).map(x => x[2]), '🟤', '⚫']);
    }
    return quizArts();
  };
  const INSTR_FAMILLES = [
    ['le violon', 'à cordes', '🎻'], ['la guitare', 'à cordes', '🎸'], ['la harpe', 'à cordes', '🎶'], ['la contrebasse', 'à cordes', '🎻'],
    ['la trompette', 'à vent', '🎺'], ['la flûte', 'à vent', '🎶'], ['le saxophone', 'à vent', '🎷'], ['la clarinette', 'à vent', '🎶'],
    ['le tambour', 'à percussion', '🥁'], ['le triangle', 'à percussion', '🔺'], ['les maracas', 'à percussion', '🎶'], ['le xylophone', 'à percussion', '🎶'], ['les cymbales', 'à percussion', '🎶']
  ];
  const MUSIQUE = [
    { q: 'Quel son est le plus aigu ?', v: '🎵', b: 'le chant d\'un petit oiseau', f: ['le rugissement d\'un lion', 'le bruit du tonnerre', 'la corne de brume d\'un bateau'] },
    { q: 'Quel son est le plus grave ?', v: '🎵', b: 'le bruit du tonnerre', f: ['le chant d\'un petit oiseau', 'un sifflet', 'le miaulement d\'un chaton'] },
    { q: 'Qu\'est-ce qui fait un son très fort ?', v: '🔊', b: 'la sirène des pompiers', f: ['une plume qui tombe', 'un chat qui marche', 'quelqu\'un qui chuchote'] },
    { q: 'Qu\'est-ce qui fait un son très doux ?', v: '🔈', b: 'quelqu\'un qui chuchote', f: ['un marteau-piqueur', 'un avion qui décolle', 'la sirène des pompiers'] },
    { q: 'Qui dirige un orchestre ?', v: '🎼', b: 'le chef d\'orchestre', f: ['le batteur', 'le chanteur', 'le public'] },
    { q: 'Comment s\'appelle un groupe de personnes qui chantent ensemble ?', v: '🎤', b: 'une chorale', f: ['un orchestre de rue', 'une équipe', 'une récréation'] },
    { q: 'Combien y a-t-il de notes dans la gamme : do, ré, mi, fa, sol, la, si ?', v: '🎼', b: '7', f: ['5', '8', '10'] },
    { q: 'Quelle note vient après « do, ré » ?', v: '🎼', b: 'mi', f: ['fa', 'sol', 'si'] },
    { q: 'Quelle note vient juste après « sol » ?', v: '🎼', b: 'la', f: ['fa', 'si', 'do'] },
    { q: 'Avec quoi joue-t-on du violon ?', v: '🎻', b: 'avec un archet', f: ['avec des baguettes', 'en soufflant', 'avec les pieds'] },
    { q: 'Comment appelle-t-on la musique qu\'on entend dans un film ?', v: '🎬', b: 'la bande originale', f: ['la bande dessinée', 'le générique de fin', 'la partition vide'] }
  ];
  const quizMusique = quiz(MUSIQUE, '🎵');
  const genMusique = () => {
    if (Math.random() < .45) {
      const [nom, fam, e] = pioche(INSTR_FAMILLES), q = `${Maj(nom)} ${/^les /.test(nom) ? 'sont des instruments' : 'est un instrument'}…`;
      return { visuel: e, enonce: q, dire: q.replace('…', '.') + ' À cordes, à vent, ou à percussion ?', choix: ['à cordes', 'à vent', 'à percussion'], bonne: fam };
    }
    return quizMusique();
  };

  ajouterMatiere('CE1', {
    id: 'arts', titre: 'Arts et musique', emoji: '🎨', couleur: '#d94f9c', jeux: [
      { id: 'quiz-couleurs', titre: 'Couleurs et peinture', emoji: '🖌️', gen: genCouleurs },
      { id: 'quiz-musique', titre: 'La musique', emoji: '🎵', gen: genMusique }
    ]
  });
})();

/* =====================================================================
   PETITS COURS DU CE1 (bouton « ? »)
   ===================================================================== */

// ---- Maths
cours('CE1/maths/nombres',
  { t: 'Écrire un nombre en chiffres', si: /Écris en chiffres/i, l: [
    'Cherche d\'abord les <b>centaines</b> : « six cent… » → 6 centaines.',
    'Puis les dizaines et les unités : « cinquante-deux » → 52.',
    'Attention : soixante-dix = 70 · quatre-vingts = 80 · quatre-vingt-dix = 90.',
    'S\'il n\'y a pas de dizaine, écris un <b>0</b> au milieu : « cent sept » → 107.'
  ], ex: 'six cent cinquante-deux → 6 | 52 → <b>652</b>' },
  { t: 'Centaines, dizaines, unités', l: [
    'Dans un nombre à 3 chiffres, on lit de gauche à droite : les <b>centaines</b>, les <b>dizaines</b>, puis les <b>unités</b>.',
    '1 centaine = 10 dizaines = 100 unités. 1 dizaine = 10 unités.',
    'Le <b>0</b> garde la place quand il n\'y a rien : 4 centaines et 6 unités, c\'est 406.'
  ], ex: '<b>2</b> centaines, <b>7</b> dizaines, <b>5</b> unités → <b>275</b><br>200 + 70 + 5 = 275' });
cours('CE1/maths/comparer',
  { t: 'Les signes < et >', si: /signe/i, l: [
    '<b>&lt;</b> veut dire « est plus petit que ». <b>&gt;</b> veut dire « est plus grand que ».',
    'La pointe du signe montre toujours le plus <b>petit</b> nombre, comme une bouche de crocodile ouverte vers le plus grand ! 🐊',
    '<b>=</b> veut dire que les deux côtés valent pareil.'
  ], ex: '518 &lt; 581 · 700 &gt; 699' },
  { t: 'Encadrer un nombre', si: /Entre quelles/i, l: [
    'Pour encadrer entre deux dizaines : garde les centaines et les dizaines, puis mets 0 aux unités. La dizaine suivante est 10 de plus.',
    'Pour encadrer entre deux centaines : garde les centaines, mets 00, puis ajoute 100.'
  ], ex: '463 est entre <b>460 et 470</b>, et entre <b>400 et 500</b>.' },
  { t: 'Comparer et ranger', l: [
    'Compare d\'abord les <b>centaines</b>. Le nombre qui a le plus de centaines est le plus grand.',
    'Si les centaines sont pareilles, compare les <b>dizaines</b>, puis les <b>unités</b>.',
    'Pour ranger, trouve d\'abord le plus petit, puis le suivant…'
  ], ex: '<b>6</b>12 et <b>2</b>98 → 612 est le plus grand, car 6 centaines &gt; 2 centaines.' });
cours('CE1/maths/suites',
  { t: 'La droite graduée', si: /flèche|droite/i, l: [
    'Regarde les nombres écrits sous les grands traits.',
    'Cherche de combien on avance à chaque petit trait : de 1 ? de 10 ? de 100 ?',
    'Compte les petits traits jusqu\'à la flèche.'
  ], ex: 'De 0 à 50 en 5 petits pas : chaque pas vaut <b>10</b>.' },
  { t: 'Juste avant, juste après', si: /juste (après|avant)/i, l: [
    'Juste après = le nombre <b>+ 1</b>. Juste avant = le nombre <b>− 1</b>.',
    'Attention aux 9 : après 9 unités, on passe à la dizaine suivante ; après 99, on passe à la centaine suivante !'
  ], ex: 'Après 589 → <b>590</b>. Après 699 → <b>700</b>. Avant 300 → <b>299</b>.' },
  { t: 'Les suites de nombres', l: [
    'Regarde deux nombres qui se suivent : de combien augmente-t-on (ou diminue-t-on) ?',
    'Continue avec le même écart.',
    'Vérifie avec le nombre d\'après !'
  ], ex: '215, 220, 225, … → on ajoute 5 à chaque fois.' });
cours('CE1/maths/additions', { t: 'L\'addition posée', l: [
  'On aligne bien les chiffres : unités sous les unités, dizaines sous les dizaines…',
  'On commence toujours par les <b>unités</b>, à droite.',
  'Si le résultat d\'une colonne dépasse 9, on écrit les unités et on met la <b>retenue</b> (1 dizaine) en haut de la colonne suivante.'
], ex: '  48<br>+ 37<br>8 + 7 = 15 : j\'écris 5, je retiens 1.<br>1 + 4 + 3 = 8 → <b>85</b>' });
cours('CE1/maths/soustractions', { t: 'La soustraction posée', l: [
  'On aligne bien les chiffres, et on commence par les <b>unités</b>.',
  'Si le chiffre du haut est plus petit que celui du bas, on ajoute <b>10</b> en haut, et on ajoute <b>1</b> au chiffre du bas de la colonne suivante : c\'est la retenue.',
  'Pour vérifier : résultat + nombre enlevé = nombre du départ.'
], ex: '  52<br>− 17<br>2 − 7 impossible → 12 − 7 = 5, je retiens 1.<br>5 − (1 + 1) = 3 → <b>35</b>' });
cours('CE1/maths/calcul-mental',
  { t: 'Le double', si: /double/i, l: [
    'Le double, c\'est le nombre <b>+ lui-même</b> (2 fois le nombre).',
    'Pour un grand nombre, double les dizaines, puis les unités, et ajoute.'
  ], ex: 'Double de 34 : double de 30 = 60, double de 4 = 8 → <b>68</b>' },
  { t: 'La moitié', si: /moitié/i, l: [
    'La moitié, c\'est partager en <b>2 parts égales</b>.',
    'Pense au double à l\'envers : quel nombre, ajouté à lui-même, donne ce nombre ?'
  ], ex: 'Moitié de 80 : 40 + 40 = 80 → <b>40</b>' },
  { t: 'Compléter jusqu\'à 100 ou jusqu\'à la dizaine', si: /pour faire 100|pour arriver/i, l: [
    'Avance d\'abord jusqu\'à la dizaine suivante, puis de dizaine en dizaine.',
    'Les amis de 100 avec des dizaines : 10 et 90 · 20 et 80 · 30 et 70 · 40 et 60 · 50 et 50.'
  ], ex: '56 + ? = 100 : 56 → 60 (4), 60 → 100 (40) → <b>44</b>' },
  { t: 'Ajouter ou enlever 10 ou 100', si: /[+−] 10{1,2} /, l: [
    '+ 10 : le chiffre des <b>dizaines</b> augmente de 1. + 100 : le chiffre des <b>centaines</b> augmente de 1.',
    'Les unités ne bougent pas !',
    'Attention quand il y a un 9 : 395 + 10 = 405.'
  ], ex: '627 + 10 = <b>637</b> · 627 − 100 = <b>527</b>' },
  { t: 'Ajouter ou enlever 9', si: /[+−] 9 /, l: [
    'Ajouter 9, c\'est ajouter 10 puis enlever 1.',
    'Enlever 9, c\'est enlever 10 puis ajouter 1.'
  ], ex: '47 + 9 → 57 − 1 = <b>56</b>' },
  { t: 'Calculer avec des dizaines', l: [
    'Calcule avec les chiffres des dizaines, puis remets le 0.',
    'Même astuce avec les centaines : 300 + 200, c\'est 3 + 2 centaines.'
  ], ex: '60 + 70 → 6 + 7 = 13 dizaines → <b>130</b>' });
cours('CE1/maths/multiplication',
  { t: 'Multiplier, c\'est ajouter plusieurs fois', l: [
    '6 × 2, c\'est <b>6 fois 2</b> : 2 + 2 + 2 + 2 + 2 + 2.',
    'Dans un dessin en rangées : nombre de rangées × nombre d\'objets dans une rangée.',
    'On peut échanger les nombres : 7 × 2 = 2 × 7.',
    'Table de 10 : on ajoute un 0 · Table de 5 : ça finit par 0 ou 5 · Table de 2 : ce sont les doubles.'
  ], ex: '🍓🍓🍓🍓🍓🍓🍓<br>🍓🍓🍓🍓🍓🍓🍓 → 2 rangées de 7 → 2 × 7 = 7 + 7 = <b>14</b>' });
cours('CE1/maths/problemes',
  { t: 'Chercher combien en tout', si: /dans la journée|en tout/i, l: [
    'On réunit deux quantités : on fait une <b>addition</b>.',
    'S\'il y a plusieurs paquets pareils, on peut faire une <b>multiplication</b>.'
  ], ex: '3 sacs de 10 billes → 3 × 10 = <b>30</b> billes.' },
  { t: 'Chercher ce qui reste', si: /reste/i, l: [
    'On avait une quantité, on en enlève : on fait une <b>soustraction</b>.',
    'Le résultat est plus petit que le nombre de départ.'
  ], ex: 'J\'ai 30 cartes, j\'en perds 8 → 30 − 8 = <b>22</b>.' },
  { t: 'Comparer deux quantités', si: /De combien/i, l: [
    'Pour savoir combien l\'un a <b>de plus</b> que l\'autre, on fait une <b>soustraction</b> : grand − petit.'
  ], ex: 'Tour A : 90 cm, tour B : 75 cm → 90 − 75 = <b>15 cm</b> de plus.' },
  { t: 'Partager', si: /partage/i, l: [
    'Partager en parts égales : chacun reçoit le même nombre.',
    'Cherche dans les tables : combien de fois le nombre d\'enfants pour arriver au total ?'
  ], ex: '12 images pour 3 enfants : 3 × 4 = 12 → <b>4</b> images chacun.' },
  { t: 'Chercher ce qui a changé', si: /gagnées/i, l: [
    'On connaît le début et la fin : on cherche ce qu\'on a ajouté.',
    'Avance du nombre de départ jusqu\'au nombre d\'arrivée, ou fais fin − début.'
  ], ex: 'Avant : 12 billes, après : 20 billes → 20 − 12 = <b>8</b> billes gagnées.' },
  { t: 'Deux étapes', si: /descendent/i, l: [
    'Fais les calculs dans l\'ordre de l\'histoire : d\'abord ceux qui descendent (−), puis ceux qui montent (+).'
  ], ex: '10 personnes, 2 descendent, 5 montent → 10 − 2 = 8, puis 8 + 5 = <b>13</b>.' },
  { t: 'Résoudre un problème', l: [
    'Lis bien toute l\'histoire, puis la question.',
    'Demande-toi : on ajoute ? on enlève ? on répète ? on partage ?',
    'Calcule, puis vérifie que ta réponse a du sens.'
  ] });
cours('CE1/maths/monnaie',
  { t: 'Rendre la monnaie', si: /rend/i, l: [
    'On cherche combien il faut <b>ajouter au prix</b> pour arriver au billet donné.',
    'C\'est aussi : billet − prix.'
  ], ex: 'Prix 13 €, billet de 20 € : 13 + 7 = 20 → on rend <b>7 €</b>.' },
  { t: 'Euros et centimes', l: [
    '<b>1 € = 100 centimes.</b>',
    'Compte d\'abord les billets et les pièces en euros, puis les pièces en centimes (c).',
    'Commence par les plus grosses valeurs, puis ajoute les petites.',
    'Pièces en centimes : 1 c, 2 c, 5 c, 10 c, 20 c, 50 c. Pièces en euros : 1 €, 2 €. Billets : 5 €, 10 €, 20 €, 50 €…'
  ], ex: 'billet de 10 € + pièce de 2 € + pièce de 50 c → <b>12 € 50 centimes</b>' });
cours('CE1/maths/heure',
  { t: 'Les minutes', si: /Combien de minutes/i, l: [
    'En une heure, la grande aiguille fait <b>un tour complet</b>. Compte les minutes : 5 petits traits entre deux nombres, et 12 nombres.',
    'Une demi-heure, c\'est la moitié d\'une heure. Un quart d\'heure, c\'est une heure coupée en 4.'
  ], ex: 'Une minute, c\'est 60 secondes : le temps de compter doucement jusqu\'à 60.' },
  { t: 'Avancer dans le temps', si: /Quelle heure sera-t-il/i, l: [
    'Un quart d\'heure = 15 min · une demi-heure = 30 min · une heure = 60 min.',
    'Avance la grande aiguille dans ta tête, et regarde où elle arrive.'
  ], ex: 'Il est 5 h 15. Dans une demi-heure : 5 h 15 + 30 min = <b>5 h 45</b>.' },
  { t: 'Lire l\'heure', l: [
    'La <b>petite aiguille</b> (rouge) montre les heures. La <b>grande aiguille</b> (bleue) montre les minutes.',
    'Grande aiguille sur le 12 → heure pile · sur le 3 → et quart (15) · sur le 6 → et demie (30) · sur le 9 → moins le quart (45)',
    'Quand la grande aiguille est sur le 9, la petite est presque sur l\'heure suivante : on dit « moins le quart » avec l\'heure suivante.'
  ], ex: 'Petite aiguille entre 2 et 3, grande sur le 6 → <b>2 h 30</b>, deux heures et demie.' });
cours('CE1/maths/mesures',
  { t: 'Mesurer avec une règle', si: /mesure ce crayon/i, l: [
    'On mesure à partir du <b>0</b> de la règle.',
    'Si l\'objet ne commence pas au 0, compte les centimètres entre le début et la fin (ou fais fin − début).'
  ], ex: 'Un crayon de 3 à 10 → 10 − 3 = <b>7 cm</b>.' },
  { t: 'Choisir la bonne unité', si: /quelle unité/i, l: [
    'Pour une <b>longueur</b> : mètres (m) pour les grandes choses, centimètres (cm) pour les petites.',
    'Pour une <b>masse</b> : kilogrammes (kg) pour les objets lourds, grammes (g) pour les objets légers.'
  ], ex: 'Un bus → en mètres. Une fraise → en grammes.' },
  { t: 'Convertir', si: /= \?/, l: [
    '<b>1 m = 100 cm</b>.',
    '<b>1 kg = 1 000 g</b>.'
  ], ex: '4 m = 400 cm · 1 m 50 cm = 150 cm · 6 kg = 6 000 g' },
  { t: 'Comparer des mesures', l: [
    'Pour comparer, écris toutes les mesures dans la <b>même unité</b>.',
    '1 m = 100 cm et 1 kg = 1 000 g.'
  ], ex: '2 m = 200 cm, donc 2 m est plus long que 180 cm.' });
cours('CE1/maths/geometrie',
  { t: 'L\'angle droit', si: /angles? droits?/i, surEnonce: true, l: [
    'Un angle droit, c\'est comme le <b>coin d\'une feuille</b> ou d\'un carré.',
    'On le vérifie avec une <b>équerre</b>.',
    'Même penché, un angle droit reste un angle droit !'
  ] },
  { t: 'La symétrie', si: /symétrique/i, l: [
    'Une figure est symétrique si, en la pliant sur la ligne, les deux moitiés se superposent exactement.',
    'Chaque case coloriée d\'un côté a sa jumelle de l\'autre côté, à la même distance de la ligne.'
  ], ex: '🟥⬜|⬜🟥 → symétrique' },
  { t: 'Les solides', si: /solide|cube|boule|cylindre|cône|pavé|dé à jouer|carton|boîte de conserve|cornet|faces|sommets/i, l: [
    '<b>Cube</b> : 6 faces carrées, toutes pareilles, comme un dé.',
    '<b>Pavé</b> : 6 faces rectangulaires, comme une boîte à chaussures.',
    '<b>Boule</b> : toute ronde, elle roule dans tous les sens.',
    '<b>Cylindre</b> : comme une boîte de conserve. <b>Cône</b> : comme un chapeau pointu. <b>Pyramide</b> : une base et des faces triangulaires qui se rejoignent en haut.'
  ] },
  { t: 'Les figures', l: [
    '<b>Carré</b> : 4 côtés de même longueur et 4 angles droits.',
    '<b>Rectangle</b> : 4 angles droits, 2 grands côtés et 2 petits côtés.',
    '<b>Triangle</b> : 3 côtés. <b>Cercle</b> : tout rond, on le trace avec un compas.',
    'Un carré penché reste un carré !'
  ] });

// ---- Français
cours('CE1/francais/sons',
  { t: 's ou ss ?', si: /« ss »/, l: [
    'Entre deux voyelles, un seul <b>s</b> chante [z] : une vali<b>s</b>e.',
    'Pour entendre [s] entre deux voyelles, on écrit <b>ss</b> : une bro<b>ss</b>e.'
  ], ex: 'un coussin [s] · un cousin [z]' },
  { t: 'c ou ç ?', si: /« ç »/, l: [
    'Devant <b>e</b> et <b>i</b> (et y), le c chante déjà [s] : une ci-gale, un ce-rceau.',
    'Devant <b>a</b>, <b>o</b>, <b>u</b>, il faut une cédille pour entendre [s] : ç.'
  ], ex: 'une balan<b>ç</b>oire · il re<b>ç</b>oit · une <b>c</b>igale' },
  { t: 'g, gu ou ge ?', si: /« gu »/, l: [
    'Devant <b>a, o, u</b>, le g chante [g] : ga-lette.',
    'Devant <b>e, i</b>, le g chante [j] : gi-let. Pour entendre [g] devant e ou i, on écrit <b>gu</b> : gui-rlande.',
    'Pour entendre [j] devant a ou o, on écrit <b>ge</b> : nous man-<b>ge</b>ons.'
  ], ex: 'une <b>g</b>omme · une <b>gu</b>irlande · un <b>g</b>ilet · un bour<b>ge</b>on' },
  { t: 'm ou n ?', si: /« m » ou « n »/, l: [
    'Devant <b>m</b>, <b>b</b> et <b>p</b>, on écrit <b>m</b> à la place du n : am, em, im, om.',
    'Partout ailleurs, on écrit <b>n</b>.'
  ], ex: 'une o<b>m</b>bre · i<b>m</b>possible · u<b>n</b>e ha<b>n</b>che' },
  { t: 'eil ou eille ? ail ou aille ?', si: /fin du mot/, l: [
    'Après un nom <b>masculin</b> (un…), on écrit souvent -eil, -ail, -euil : un conseil, un rail.',
    'Après un nom <b>féminin</b> (une…), on écrit souvent -eille, -aille, -euille, -ouille : une groseille, une feuille.'
  ], ex: 'un év<b>eil</b> · une corb<b>eille</b> · un chandail · une bataille' },
  { t: 'Les sons à plusieurs lettres', l: [
    'Dis le mot lentement et écoute le son qui manque.',
    'Certains sons s\'écrivent avec 2 lettres : <b>ou</b> (loup), <b>on</b> (bonbon), <b>an/en</b> (maman, dent), <b>in/ain</b> (lapin, main), <b>oi</b> (roi), <b>ch</b> (chat), <b>gn</b> (ligne).',
    'Si tu hésites, pense à un mot que tu connais bien avec le même son.'
  ], ex: 'une m<b>ou</b>che · un b<b>on</b>bon · la li<b>gn</b>e' });
cours('CE1/francais/lecture', { t: 'Lire une phrase', l: [
  'Lis la phrase <b>jusqu\'au point</b>, doucement, en entier.',
  'Cherche <b>qui</b> fait l\'action, <b>ce qu\'il fait</b>, et les détails : combien ? quelle couleur ?',
  'Attention aux petits mots qui changent tout : <b>pas</b>, <b>ni</b>, <b>plus que</b>, <b>autant que</b>, <b>entre</b>.',
  'Compare bien chaque image avec la phrase avant de choisir.'
], ex: '« Il n\'y a pas de chat, mais deux chiens. » → 🐶🐶' });
cours('CE1/francais/textes', { t: 'Comprendre un petit texte', l: [
  'Écoute ou lis tout le texte une première fois.',
  'Lis bien la question : Qui ? Quoi ? Où ? Quand ? Combien ? Pourquoi ?',
  'Retourne dans le texte : la réponse y est écrite. Relis la bonne phrase.',
  'Pour « Pourquoi ? », cherche les mots <b>car</b>, <b>parce que</b>, <b>alors</b>.'
], ex: '« Lou met son manteau, car il fait froid. »<br>Pourquoi Lou met-elle son manteau ? → parce qu\'il fait froid.' });
cours('CE1/francais/alphabet',
  { t: 'L\'alphabet', si: /lettre vient/i, l: [
    'Récite l\'alphabet dans ta tête : A B C D E F G H I J K L M N O P Q R S T U V W X Y Z.',
    'Arrête-toi à la lettre demandée, puis regarde juste avant ou juste après.'
  ] },
  { t: 'L\'ordre alphabétique', l: [
    'On range les mots d\'après leur <b>première lettre</b>, dans l\'ordre de l\'alphabet.',
    'Si la première lettre est la même, on regarde la <b>deuxième</b>, puis la troisième…'
  ], ex: 'gomme · grenouille · guitare → o, r, u' });
cours('CE1/francais/nature', { t: 'Nom, verbe, adjectif, déterminant', l: [
  '<b>Nom</b> : une personne, un animal, une chose. On peut mettre « le » ou « un » devant.',
  '<b>Verbe</b> : ce qu\'on fait. Il change si on dit « hier » ou « demain ».',
  '<b>Adjectif</b> : il dit comment est le nom (petit, rouge, joli…).',
  '<b>Déterminant</b> : le petit mot juste devant le nom (le, la, les, un, une, des, mon, ta, ces…).'
], ex: '<b>Une</b> (dét.) <b>souris</b> (nom) <b>grise</b> (adj.) <b>grignote</b> (verbe).' });
cours('CE1/francais/genre-nombre',
  { t: 'Le féminin', si: /féminin/i, l: [
    'Souvent, on ajoute un <b>e</b> : un marchand → une marchande.',
    'Parfois, la fin change : -er → -ère · -eur → -euse · -en → -enne · -on → -onne · -eux → -euse.',
    'Parfois, c\'est un autre mot : un taureau → une vache.'
  ], ex: 'un berger → une bergère · un nageur → une nageuse' },
  { t: 'Le pluriel', si: /pluriel de/i, l: [
    'En général, on ajoute un <b>s</b> : un livre → des livres.',
    'Les mots en <b>-eau</b>, <b>-eu</b> prennent un <b>x</b>. Les mots en <b>-al</b> deviennent souvent <b>-aux</b>.',
    'Les mots en <b>-ou</b> prennent un <b>s</b>, sauf 7 mots à apprendre par cœur, comme hibou ou caillou, qui prennent un <b>x</b>.',
    'Les mots qui finissent déjà par <b>s</b>, <b>x</b> ou <b>z</b> ne changent pas.'
  ], ex: 'un rideau → des rideaux · un hôpital → des hôpitaux · un fou → des fous' },
  { t: 'Singulier ou pluriel ?', si: /singulier ou au pluriel/i, l: [
    'Regarde le <b>déterminant</b> : le, la, un, une, mon, ton → singulier. Les, des, mes, ces, deux, trois → pluriel.',
    'Attention : certains mots finissent par s ou x même au singulier (un prix, une croix, un pays).'
  ], ex: 'le tapis → singulier · les tapis → pluriel' },
  { t: 'Un ou une ?', l: [
    'Les noms <b>masculins</b> vont avec « un » ou « le ». Les noms <b>féminins</b> vont avec « une » ou « la ».',
    'Quand le nom commence par une voyelle, « l\' » ne dit rien : essaie avec « un » et « une » à voix haute !'
  ], ex: 'un <b>i</b>nsecte · une <b>a</b>ssiette' });
cours('CE1/francais/conjugaison',
  { t: 'Passé, présent, futur', si: /Hier|En ce moment|Demain|passé, du présent/i, l: [
    '<b>Passé</b> (hier) : c\'est déjà fait. Passé composé = avoir + verbe en -é : j\'ai nagé, nous avons nagé.',
    '<b>Présent</b> (en ce moment) : ça se passe maintenant : je nage.',
    '<b>Futur</b> (demain) : ça va se passer. On ajoute -rai, -ras, -ra, -rons, -rez, -ront : je nagerai.'
  ], ex: 'Hier, j\'ai crié. En ce moment, je crie. Demain, je crierai.' },
  { t: 'L\'infinitif', si: /infinitif/i, l: [
    'L\'infinitif, c\'est le verbe « au repos », sans personne : on dit « il faut… » devant.',
    'Beaucoup finissent par <b>-er</b> : crier, nager. Mais certains verbes sont spéciaux : ils changent beaucoup quand on les conjugue !'
  ], ex: 'vous nagez → il faut <b>nager</b> · elle fait → il faut <b>faire</b>' },
  { t: 'Le présent', l: [
    'Verbes en -er : je crie · tu cries · il crie · nous crions · vous criez · ils crient',
    '<b>Être</b>, <b>avoir</b> et <b>aller</b> sont des verbes spéciaux : on les apprend par cœur. Récite-les dans l\'ordre (je, tu, il, nous, vous, ils) jusqu\'à la bonne personne.'
  ], ex: 'Être : je suis, nous sommes · Avoir : j\'ai, nous avons · Aller : je vais, nous allons' });
cours('CE1/francais/homophones',
  { t: 'a ou à', si: /manque : a ou à/, l: [
    '<b>a</b> (sans accent), c\'est le verbe avoir : on peut dire <b>avait</b> à la place.',
    '<b>à</b> (avec accent) ne peut pas être remplacé par « avait » : il indique un lieu, un moment…'
  ], ex: 'Lily <b>a</b> un chat (Lily avait un chat). Elle va <b>à</b> la plage.' },
  { t: 'et ou est', si: /manque : est ou et/, l: [
    '<b>est</b>, c\'est le verbe être : on peut dire <b>était</b> à la place.',
    '<b>et</b> relie deux mots ou deux idées : on peut dire <b>et puis</b>.'
  ], ex: 'Le chat <b>est</b> noir <b>et</b> blanc.' },
  { t: 'son ou sont', si: /manque : son ou sont/, l: [
    '<b>sont</b>, c\'est le verbe être : on peut dire <b>étaient</b> à la place.',
    '<b>son</b> veut dire « le sien » : on peut dire <b>mon</b> ou <b>ton</b> à la place.'
  ], ex: 'Ses stylos <b>sont</b> bleus. Il prend <b>son</b> stylo.' });
cours('CE1/francais/phrase',
  { t: 'La ponctuation', si: /signe/i, l: [
    'Le <b>point</b> (.) finit une phrase qui raconte ou explique.',
    'Le <b>point d\'interrogation</b> (?) finit une question.',
    'Le <b>point d\'exclamation</b> (!) montre une émotion : la joie, la surprise, la peur…'
  ], ex: 'Il fait beau. · Tu viens ? · Quelle chance !' },
  { t: 'La phrase', l: [
    'Une phrase commence par une <b>majuscule</b> et se termine par un <b>point</b>.',
    'Les mots sont dans un ordre qui a du <b>sens</b>.',
    'Pour compter les phrases, compte les points (. ? !).'
  ], ex: 'Le lion rugit. Les enfants ont peur ! → 2 phrases' });
cours('CE1/francais/vocabulaire',
  { t: 'Les contraires', si: /contraire/i, l: [
    'Un contraire veut dire l\'<b>inverse</b>.',
    'Essaie de dire : « ce n\'est pas… , c\'est… »'
  ], ex: 'fort ↔ faible · allumer ↔ éteindre · dedans ↔ dehors' },
  { t: 'Les familles de mots', si: /famille/i, l: [
    'Les mots d\'une même famille ont un <b>morceau commun</b> et un <b>sens proche</b>.',
    'Attention aux mots qui se ressemblent mais n\'ont pas le même sens !'
  ], ex: 'Famille de <b>long</b> : long, longueur, allonger… mais pas « loup » !' },
  { t: 'Les mots qui rangent', l: [
    'Un mot comme « fruit », « meuble » ou « animal » range plusieurs mots ensemble.',
    'Demande-toi pour chaque mot : est-ce bien un… ?'
  ], ex: 'outils : marteau, scie, tournevis (pas « tulipe » !)' });
cours('CE1/francais/dictee', { t: 'Bien écrire un mot', l: [
  'Écoute le mot avec 🔊 autant de fois que tu veux.',
  'Découpe-le en syllabes et écris chaque son dans l\'ordre.',
  'Pense aux lettres muettes à la fin : trouve un mot de la même famille (gran<b>d</b> → gran<b>d</b>e).',
  'Pense aux accents (é, è, ê, à) et aux doubles lettres.',
  'Les petits mots invariables (avec, dans, toujours…) s\'apprennent par cœur.'
], ex: 'un cham<b>p</b> → on l\'entend dans « champêtre »' });

// ---- Questionner le monde
cours('CE1/monde/quiz-vivant',
  { t: 'Ce que mangent les animaux', si: /mange|herbivore|carnivore|omnivore/i, l: [
    'Un <b>herbivore</b> mange des plantes · un <b>carnivore</b> mange d\'autres animaux · un <b>omnivore</b> mange de tout',
    'Observe les dents : les carnivores ont des crocs pointus.'
  ] },
  { t: 'Où vivent les animaux', si: /Où vit/i, l: [
    'Chaque animal vit dans un milieu adapté : mer · forêt · désert · banquise · ferme',
    'Il y trouve sa nourriture et un abri.'
  ] },
  { t: 'Naître et grandir', si: /œuf|bébé|petit de|naît|grandit|ventre/i, l: [
    'Certains animaux naissent dans un <b>œuf</b> (oiseaux, tortues, poissons…).',
    'D\'autres sortent du <b>ventre</b> de leur mère (chien, cheval, humain…).',
    'Certains changent beaucoup en grandissant : c\'est la métamorphose (grenouille, papillon).'
  ] },
  { t: 'Les plantes', si: /graine|plante|germ|racine|fruit|noir/i, l: [
    'Une graine plantée dans la terre humide <b>germe</b> : il en sort une petite racine, puis une tige et des feuilles.',
    'Une plante a besoin d\'<b>eau</b>, de <b>lumière</b> et d\'<b>air</b> pour vivre.',
    'Elle boit par ses racines. Ses graines se trouvent dans ses fruits.'
  ] },
  { t: 'Le vivant', l: [
    'Un être vivant naît, se nourrit, grandit, se reproduit et meurt.',
    'Les oiseaux ont des plumes, les mammifères des poils, les poissons des écailles.',
    'Un insecte a 6 pattes. L\'araignée n\'est pas un insecte.'
  ] });
cours('CE1/monde/quiz-matiere',
  { t: 'Les états de l\'eau', si: /eau|glace|glaçon|neige|vapeur|gèle|congélateur|linge/i, l: [
    'L\'eau existe sous 3 états : <b>solide</b> (glace, neige) · <b>liquide</b> (eau du robinet, pluie) · <b>gazeux</b> (vapeur d\'eau)',
    'Quand il fait très froid (0 degré), l\'eau gèle. Quand la glace se réchauffe, elle fond.',
    'Quand l\'eau chauffe, elle s\'évapore et devient de la vapeur.'
  ] },
  { t: 'Solides et liquides', si: /solide|liquide|forme|fond/i, l: [
    'Un <b>solide</b> garde sa forme : on peut le prendre dans la main.',
    'Un <b>liquide</b> coule et prend la forme du récipient.',
    'Certains solides fondent quand il fait chaud (glace, beurre, chocolat).'
  ] },
  { t: 'Les objets et les matières', l: [
    'Chaque objet est fait d\'une matière : bois · verre · métal · laine · plastique · papier',
    'Les objets légers flottent, les objets lourds et petits coulent souvent.',
    'Un aimant attire le fer. L\'air ne se voit pas, mais on le sent quand il y a du vent.'
  ] });
cours('CE1/monde/quiz-corps',
  { t: 'Mes dents', si: /dent|brossage|incisives|molaires/i, l: [
    'On se brosse les dents matin et soir, pendant environ 2 minutes.',
    'Devant, les <b>incisives</b> coupent. Au fond, les <b>molaires</b> écrasent. Les canines déchirent.',
    'Le sucre abîme les dents : il fait des caries.'
  ] },
  { t: 'Le sommeil', si: /dormir|dormi|sommeil/i, l: [
    'À 7 ans, on a besoin de beaucoup de sommeil chaque nuit.',
    'Sans assez de sommeil, on est fatigué et on apprend moins bien.',
    'Avant de dormir, on évite les écrans et on se calme.'
  ] },
  { t: 'Bien manger', si: /repas|boisson|fruits|aliment|calcium|pâtes|énergie/i, l: [
    'On mange de tout, en quantités raisonnables : c\'est un repas équilibré.',
    'Fruits et légumes à chaque repas. Les produits laitiers donnent du calcium pour les os.',
    'Pâtes, riz et pain donnent de l\'énergie. Les sucreries, c\'est rarement.',
    'La meilleure boisson, c\'est l\'eau.'
  ] },
  { t: 'Rester en sécurité', si: /numéro|produit|prise|brûlé|soleil/i, l: [
    'Numéros d\'urgence : 15 · 17 · 18 · 112',
    'Les produits ménagers et les médicaments sont dangereux : on n\'y touche pas.',
    'On ne touche jamais une prise électrique. Une brûlure se met sous l\'eau froide.'
  ] },
  { t: 'Mon corps en bonne santé', l: [
    'Bouger et faire du sport garde le corps en forme ; le cœur bat plus vite quand on court.',
    'L\'air va dans les poumons, les aliments vont dans l\'estomac.',
    'On se lave les mains souvent pour éviter les microbes.'
  ] });
cours('CE1/monde/temps',
  { t: 'Les jours de la semaine', si: /aujourd'hui|jour de la semaine|combien y a-t-il de/i, l: [
    'Les 7 jours : lundi · mardi · mercredi · jeudi · vendredi · samedi · dimanche',
    'Demain = 1 jour après · après-demain = 2 jours après · hier = 1 jour avant · avant-hier = 2 jours avant.',
    'Dans une semaine, c\'est 7 jours plus tard.'
  ] },
  { t: 'Les mois et les saisons', si: /mois|saison/i, l: [
    'Les 12 mois : janvier · février · mars · avril · mai · juin · juillet · août · septembre · octobre · novembre · décembre',
    'Les 4 saisons : l\'hiver · le printemps · l\'été · l\'automne'
  ] },
  { t: 'Lire un calendrier', si: /calendrier/i, l: [
    'Chaque colonne correspond à un jour de la semaine (lun, mar, mer…).',
    'Pour trouver le jour d\'une date, cherche le nombre, puis remonte en haut de sa colonne.',
    'Pour compter les mercredis, compte les nombres dans la colonne « mer ».'
  ] },
  { t: 'L\'arbre de famille', si: /arbre|parents|générations|…/i, l: [
    'En haut : les <b>grands-parents</b>. Au milieu : les <b>parents</b>. En bas : les <b>enfants</b>.',
    'Les parents de ton papa sont tes grands-parents. Tu es leur petit-fils ou leur petite-fille.',
    'Chaque étage de l\'arbre est une <b>génération</b>.'
  ] },
  { t: 'Avant, maintenant', l: [
    'Autrefois, il n\'y avait ni électricité ni écrans : on s\'éclairait à la bougie et on écrivait à la plume.',
    'Sur une frise, le passé est à gauche et le présent à droite.',
    'Une année a 12 mois et 365 jours ; une journée a 24 heures.'
  ] });
cours('CE1/monde/espace',
  { t: 'Se repérer sur un quadrillage', si: /case/i, l: [
    'Chaque case a un nom : d\'abord la <b>lettre</b> de sa colonne (en haut), puis le <b>chiffre</b> de sa ligne (à gauche).',
    'Pose un doigt sur la lettre, un autre sur le chiffre, et fais-les se rejoindre.'
  ] },
  { t: 'Les paysages', si: /paysage/i, l: [
    'À la <b>montagne</b> : des sommets, de la neige, des sapins.',
    'Au bord de la <b>mer</b> : une plage, des vagues, des bateaux.',
    'À la <b>campagne</b> : des champs, des fermes, des animaux.',
    'En <b>ville</b> : des immeubles, des magasins, beaucoup de circulation.'
  ] },
  { t: 'Plans, cartes et globe', l: [
    'Un plan ou une carte, c\'est un dessin vu de dessus. La légende explique ses couleurs et ses symboles.',
    'Sur une carte, le nord est en haut. Une boussole indique le nord.',
    'Le globe est une petite Terre : le bleu montre les mers et les océans.',
    'J\'habite dans une ville, en France, en Europe, sur la Terre.'
  ] });
cours('CE1/monde/citoyen',
  { t: 'Les symboles de la République', si: /République|hymne|devise|fête nationale|Marianne|France/i, l: [
    'Le drapeau est bleu, blanc, rouge. L\'hymne national s\'appelle la Marseillaise.',
    'La devise : Liberté, Égalité, Fraternité. Marianne représente la République.',
    'La fête nationale a lieu le 14 juillet. Le président de la République dirige le pays.'
  ] },
  { t: 'En sécurité', si: /voiture|traverser|route|Internet|bonhomme/i, l: [
    'En voiture, un enfant s\'assoit à l\'arrière, attaché, sur un rehausseur.',
    'On traverse sur le passage piéton, quand le petit bonhomme le permet. On ne joue jamais sur la route.',
    'Sur Internet, on ne donne jamais son nom, son adresse ou sa photo à un inconnu.'
  ] },
  { t: 'Protéger la planète', si: /planète|bouteille|économiser|robinet/i, l: [
    'On trie ses déchets : le plastique, le papier et le verre peuvent être recyclés.',
    'On ferme le robinet et on éteint la lumière pour ne pas gaspiller.'
  ] },
  { t: 'Vivre ensemble', l: [
    'Les règles de la classe sont faites pour bien vivre ensemble ; tout le monde les respecte.',
    'On écoute les autres, on lève le doigt, on s\'excuse quand on fait une erreur.',
    'On ne se moque pas. Si quelqu\'un est embêté ou seul, on l\'aide et on en parle à un adulte.',
    'Filles et garçons, tous les enfants ont les mêmes droits.'
  ] });

// ---- Arts et musique
cours('CE1/arts/quiz-couleurs',
  { t: 'Mélanger les couleurs', si: /mélang|obtiens|primaires/i, l: [
    'Il y a 3 couleurs <b>primaires</b> : on ne peut pas les fabriquer en mélangeant d\'autres couleurs.',
    'En les mélangeant deux par deux, on obtient les couleurs <b>secondaires</b> : orange, vert, violet.',
    'Pour trouver, imagine les deux peintures sur ta palette, et mélange-les dans ta tête.'
  ], ex: 'Blanc + rouge = rose · Blanc + noir = gris' },
  { t: 'Couleurs chaudes et froides', si: /chaude|froide/i, l: [
    'Couleurs <b>chaudes</b> : ce sont les couleurs du feu et du soleil.',
    'Couleurs <b>froides</b> : ce sont les couleurs de l\'eau, de la glace et de la nuit.'
  ] },
  { t: 'Les arts', l: [
    'Un <b>portrait</b> montre une personne. Un <b>paysage</b> montre la nature ou une ville. Une <b>sculpture</b> se regarde de tous les côtés.',
    'Le blanc rend une couleur plus claire, le noir la rend plus foncée.',
    'Le peintre mélange ses couleurs sur une palette et peint avec un pinceau.',
    'Les œuvres célèbres sont exposées dans les musées.'
  ] });
cours('CE1/arts/quiz-musique',
  { t: 'Les familles d\'instruments', si: /instrument/i, l: [
    '<b>À cordes</b> : on frotte ou on pince des cordes (comme le violoncelle ou le banjo).',
    '<b>À vent</b> : on souffle dedans (comme le trombone ou l\'harmonica).',
    '<b>À percussion</b> : on tape ou on secoue (comme la batterie ou le tambourin).'
  ] },
  { t: 'Écouter les sons', si: /son/i, l: [
    'Un son <b>aigu</b> est haut et fin, comme un sifflet. Un son <b>grave</b> est bas et gros, comme un tambour géant.',
    'Un son <b>fort</b> s\'entend de loin. Un son <b>doux</b> (faible) s\'entend à peine.'
  ] },
  { t: 'La musique', l: [
    'La gamme commence par <b>do</b> et finit par <b>si</b>. Chante-la dans ta tête, note par note !',
    'Le chef d\'orchestre dirige les musiciens. Une chorale est un groupe de chanteurs.',
    'Le violon se joue avec un archet.'
  ] });
