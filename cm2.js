// Contenu du CM2 (10 ans) : matières, jeux et petits cours.
(() => {
  /* ---------- Outils ---------- */
  const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  // Nombre décimal v / 10^k écrit à la française, sans zéro inutile : nb(3450, 3) -> "3,45".
  const nb = (v, k = 0) => {
    const neg = v < 0; v = Math.abs(Math.round(v));
    let s = String(v);
    if (k > 0) s = s.padStart(k + 1, '0');
    const ent = k > 0 ? s.slice(0, -k) : s, fr = k > 0 ? s.slice(-k).replace(/0+$/, '') : '';
    return (neg ? '−' : '') + sp(ent) + (fr ? ',' + fr : '');
  };
  const mil = m => nb(m, 3); // un nombre en millièmes -> texte
  const euros = c => { const e = Math.floor(c / 100), r = c % 100; return sp(e) + (r ? ',' + String(r).padStart(2, '0') : '') + ' €'; };
  const r1 = x => Math.round(x * 10) / 10;
  const gros = t => `<b style="font-size:1.5em">${t}</b>`;
  const phrase = t => `<span style="font-weight:normal">${t}</span>`;
  const tirage = liste => { let r = []; return () => { if (!r.length) r = melange(liste); return r.pop(); }; };
  const pgcd = (a, b) => b ? pgcd(b, a % b) : a;
  const val = s => { // valeur d'une réponse « 3/4 », « 0,75 » ou « 2 + 1/3 »
    return String(s).split('+').reduce((t, x) => {
      x = x.trim();
      if (x.includes('/')) { const [a, b] = x.split('/').map(Number); return t + a / b; }
      return t + Number(x.replace(/\s/g, '').replace(',', '.'));
    }, 0);
  };
  const differentDe = bon => x => Math.abs(val(x) - val(bon)) > 1e-9;
  // Ce que la voix lit : les symboles deviennent des mots.
  const aDire = s => String(s).replace(/<[^>]+>/g, ' ').replace(/(\d)\/(\d)/g, '$1 sur $2').replace(/×/g, ' fois ').replace(/÷/g, ' divisé par ')
    .replace(/−/g, ' moins ').replace(/ \+ /g, ' plus ').replace(/ = \?/g, ' égale combien ?').replace(/=/g, ' égale ').replace(/%/g, ' pour cent')
    .replace(/cm²/g, 'centimètres carrés').replace(/dm²/g, 'décimètres carrés').replace(/m²/g, 'mètres carrés')
    .replace(/([\d?]) (km|hm|dam|dm|cm|mm|m|kg|hg|dag|dg|cg|mg|g|t|hL|daL|dL|cL|mL|L)(?![\wÀ-ÿ²])/g, (_, a, u) => `${a} ${NOMS_U[u]}`).replace(/\s+/g, ' ').trim();
  const NOMS_U = { km: 'kilomètres', hm: 'hectomètres', dam: 'décamètres', m: 'mètres', dm: 'décimètres', cm: 'centimètres', mm: 'millimètres', t: 'tonnes', kg: 'kilogrammes', hg: 'hectogrammes', dag: 'décagrammes', g: 'grammes', dg: 'décigrammes', cg: 'centigrammes', mg: 'milligrammes', hL: 'hectolitres', daL: 'décalitres', L: 'litres', dL: 'décilitres', cL: 'centilitres', mL: 'millilitres', 'm²': 'mètres carrés', 'dm²': 'décimètres carrés', 'cm²': 'centimètres carrés' };
  const avecDire = gen => () => { const q = gen(); if (!q.dire && /[×÷−+=/%²]/.test(q.enonce)) q.dire = aDire(q.enonce); return q; };

  // Les nombres en lettres (orthographe traditionnelle).
  const U = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
  const DIZ = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];
  function cent99(n) {
    if (n <= 16) return U[n];
    if (n < 20) return 'dix-' + U[n - 10];
    const d = Math.floor(n / 10), u = n % 10;
    if (d < 7) return DIZ[d] + (u === 1 ? ' et un' : u ? '-' + U[u] : '');
    if (d === 7) return 'soixante' + (u === 1 ? ' et onze' : '-' + cent99(10 + u));
    if (d === 8) return u ? 'quatre-vingt-' + U[u] : 'quatre-vingts';
    return 'quatre-vingt-' + cent99(10 + u);
  }
  function sous1000(n, fin) { // fin = false devant « mille » : pas de s à cent et vingt
    const c = Math.floor(n / 100), r = n % 100;
    let s = '';
    if (c) s = (c > 1 ? U[c] + ' ' : '') + 'cent' + (c > 1 && !r && fin ? 's' : '');
    if (r) { let t = cent99(r); if (!fin && t.endsWith('vingts')) t = t.slice(0, -1); s += (s ? ' ' : '') + t; }
    return s;
  }
  function lettres(n) {
    if (n === 0) return 'zéro';
    const g = Math.floor(n / 1e9), m = Math.floor(n / 1e6) % 1000, k = Math.floor(n / 1000) % 1000, u = n % 1000, p = [];
    if (g) p.push(sous1000(g, true) + ' milliard' + (g > 1 ? 's' : ''));
    if (m) p.push(sous1000(m, true) + ' million' + (m > 1 ? 's' : ''));
    if (k) p.push(k === 1 ? 'mille' : sous1000(k, false) + ' mille');
    if (u) p.push(sous1000(u, true));
    return p.join(' ');
  }
  const ROMAINS = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  const romain = n => { let s = ''; ROMAINS.forEach(([v, l]) => { while (n >= v) { s += l; n -= v; } }); return s; };
  const siecle = n => `${romain(n)}e siècle`;

  /* ---------- Dessins ---------- */
  const TRAIT = 'stroke="currentColor" stroke-width="2"';
  const REMPLI = 'fill="rgba(79,142,247,.25)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"';
  const ROUGE = '#e5484d', BLEU = '#4f8ef7';
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
  function polygone(pts, traits = [], droits = []) {
    let s = `<polygon points="${pts.map(p => p.join(',')).join(' ')}" ${REMPLI}/>`;
    const n = pts.length;
    pts.forEach((p, i) => { if (traits[i]) s += codage(p, pts[(i + 1) % n], traits[i]); });
    droits.forEach(i => { s += angleDroit(pts[i], pts[(i + 1) % n], pts[(i + n - 1) % n]); });
    return s;
  }
  const texte = (x, y, t, anc = 'middle', taille = 8, coul = 'currentColor') => `<text x="${x}" y="${y}" font-size="${taille}" fill="${coul}" text-anchor="${anc}" font-family="sans-serif">${t}</text>`;
  const pointilles = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ROUGE}" stroke-width="2" stroke-dasharray="5 4"/>`;
  const tableau = lignes => `<table style="border-collapse:collapse;margin:auto;font-size:1.1em">${lignes.map(l => `<tr>${l.map((c, i) => `<td style="border:2px solid currentColor;padding:.3em .6em;${i === 0 ? 'font-weight:normal;text-align:left' : ''}">${c}</td>`).join('')}</tr>`).join('')}</table>`;

  /* ======================= MATHS ======================= */
  const RANGS = [['unités de mille', 3], ['dizaines de mille', 4], ['centaines de mille', 5], ['unités de millions', 6], ['dizaines de millions', 7], ['centaines de millions', 8]];
  const genGrandsNombres = () => {
    const t = alea(0, 6);
    if (t === 0) {
      const n = alea(100000000, 999999999), s = String(n), [nom, pos] = pioche(RANGS);
      return qcm({ visuel: gros(sp(n)), enonce: `Quel est le chiffre des ${nom} ?` }, s[s.length - 1 - pos], [...s.split(''), '0', '1', '5', '9']);
    }
    if (t === 1) {
      const milliard = Math.random() < 0.25;
      const a = milliard ? alea(1, 9) : alea(1, 999), b = pioche([0, alea(1, 99), alea(100, 999)]), c = pioche([0, alea(1, 99), alea(100, 999)]);
      const g = milliard ? pioche([0, alea(1, 999)]) : 0;
      const n = milliard ? a * 1e9 + g * 1e6 + b * 1e3 + c : a * 1e6 + b * 1e3 + c;
      const f = milliard
        ? [a * 1e6 + g * 1e3 + b, a * 1e9 + b * 1e3 + c, a * 1e9 + g * 1e6 + c * 1e3 + b, a * 1e8 + g * 1e6 + b * 1e3 + c]
        : [Number(`${a}${b || ''}${c || ''}`), a * 1e6 + c * 1e3 + b, a * 1e5 + b * 1e3 + c, a * 1e7 + b * 1e3 + c, a * 1e9 + b * 1e3 + c];
      return qcm({ visuel: '✍️', enonce: `Écris en chiffres :<br>${phrase(lettres(n))}`, dire: 'Écris en chiffres : ' + lettres(n) }, sp(n), f.filter(x => x !== n && x > 0).map(sp));
    }
    if (t === 2) {
      if (Math.random() < 0.5) {
        const n = alea(1000000, 99999999), s = String(n), r = Math.floor(n / 1000);
        return qcm({ visuel: gros(sp(n)), enonce: `Combien y a-t-il de milliers en tout dans ce nombre ?`, aide: 'Attention : on ne demande pas le chiffre des milliers !' }, sp(r), [s[s.length - 4], Math.floor(n / 1e6), Math.floor(n / 100), Math.floor(n / 10000)].map(x => sp(x)));
      }
      const n = alea(10000000, 999999999), s = String(n), r = Math.floor(n / 1e6);
      return qcm({ visuel: gros(sp(n)), enonce: `Combien y a-t-il de millions en tout dans ce nombre ?`, aide: 'Attention : on ne demande pas le chiffre des millions !' }, sp(r), [s[s.length - 7], Math.floor(n / 1000), Math.floor(n / 1e5), r + 1].map(x => sp(x)));
    }
    if (t === 3) {
      const base = String(alea(1000000, 99999999)).split(''), vus = new Set([base.join('')]);
      let essais = 0;
      while (vus.size < 4 && essais++ < 100) {
        const d = [...base], i = alea(0, d.length - 1), j = alea(0, d.length - 1);
        if (Math.random() < 0.7) [d[i], d[j]] = [d[j], d[i]]; else d[i] = String(alea(0, 9));
        if (d[0] !== '0') vus.add(d.join(''));
      }
      const v = [...vus].map(Number), grand = Math.random() < 0.5, bon = grand ? Math.max(...v) : Math.min(...v);
      return qcm({ visuel: '⚖️', enonce: `Quel est le nombre le plus ${grand ? 'grand' : 'petit'} ?`, aide: 'Compare le nombre de chiffres, puis les chiffres de gauche à droite.' }, sp(bon), v.filter(x => x !== bon).map(sp));
    }
    if (t === 4) {
      const million = Math.random() < 0.5, p = million ? 1e6 : 1000;
      let n; do { n = million ? alea(2000000, 99999999) : alea(20000, 999999); } while (Math.floor(n / (p / 10)) % 10 === 5 || n % p === 0);
      const bon = Math.round(n / p) * p, bas = Math.floor(n / p) * p;
      return qcm({ visuel: gros(sp(n)), enonce: `Arrondis ce nombre ${million ? 'au million' : 'au millier'} le plus proche.`, aide: `Regarde le chiffre juste à droite des ${million ? 'millions' : 'milliers'}.` }, sp(bon), [bas, bas + p, bon + p, bon - p, Math.round(n / (p * 10)) * p * 10].filter(x => x > 0 && x !== bon).map(sp));
    }
    if (t === 5) {
      const p = pioche([100, 1000, 10000, 100000, 1000000]);
      const n = (alea(10, 999) * 10 + 9) * p + alea(0, p - 1), bon = n + p;
      return qcm({ visuel: '➕', enonce: `${sp(n)} + ${sp(p)} = ?`, aide: 'Attention à la retenue quand un chiffre 9 devient 10 !' }, sp(bon), [n - 9 * p, n + 10 * p, n + p / 10, bon + 10 * p, n + 2 * p].filter(x => x !== bon).map(sp));
    }
    const a = alea(2, 999), b = alea(1, 999), c = pioche([0, alea(1, 999)]);
    const n = a * 1e6 + b * 1e3 + c;
    const f = [b * 1e6 + a * 1e3 + c, a * 1e9 + b * 1e3 + c, a * 1e6 + b + c * 1000, a * 1e6 + b * 1e3].filter(x => x !== n).map(lettres);
    return qcm({ visuel: gros(sp(n)), enonce: 'Comment s\'écrit ce nombre en lettres ?', dire: 'Comment s\'écrit ce nombre en lettres ?' }, lettres(n), f);
  };

  const genDecimaux = () => {
    const t = alea(0, 5);
    if (t === 0) {
      let r; do { r = alea(1, 9) * 100 + alea(1, 9) * 10 + alea(1, 9); } while (new Set(String(r)).size < 3);
      const e = alea(10, 99), n = e * 1000 + r, s = String(r);
      const [nom, bon] = pioche([['dixièmes', s[0]], ['centièmes', s[1]], ['millièmes', s[2]], ['dizaines', String(e)[0]]]);
      return qcm({ visuel: gros(mil(n)), enonce: `Dans ce nombre, quel est le chiffre des ${nom} ?` }, bon, [...s.split(''), ...String(e).split(''), '0']);
    }
    if (t === 1) {
      const e = alea(0, 30), d = alea(2, 8), vals = new Set();
      const modeles = [() => d * 100, () => d * 100 + alea(1, 9) * 10, () => d * 100 + alea(0, 9) * 10 + alea(1, 9), () => (d + pioche([-1, 1])) * 100 + alea(1, 99), () => alea(1, 9) * 10 + alea(0, 9), () => d * 10 + alea(1, 9)];
      while (vals.size < 4) vals.add(e * 1000 + pioche(modeles)());
      const v = [...vals], grand = Math.random() < 0.5, bon = grand ? Math.max(...v) : Math.min(...v);
      return qcm({ visuel: '⚖️', enonce: `Quel est le nombre le plus ${grand ? 'grand' : 'petit'} ?`, aide: 'Compare les dixièmes, puis les centièmes, puis les millièmes.' }, mil(bon), v.filter(x => x !== bon).map(mil));
    }
    if (t === 2) {
      const e = alea(1, 40);
      if (Math.random() < 0.5) {
        let r; do { r = alea(1, 99) * 10; } while (r % 100 === 0 || Math.floor(r / 100) === e);
        const n = e * 1000 + r, d1 = Math.floor(r / 100);
        return qcm({ visuel: gros(mil(n)), enonce: 'Entre quels nombres entiers qui se suivent se trouve ce nombre ?' }, `${e} et ${e + 1}`, [`${e - 1} et ${e}`, `${e + 1} et ${e + 2}`, `${d1} et ${d1 + 1}`]);
      }
      let d, c; do { d = alea(0, 9); c = alea(1, 9); } while (c === d || c === 9);
      const n = e * 1000 + d * 100 + c * 10, lo = e * 1000 + d * 100;
      return qcm({ visuel: gros(mil(n)), enonce: 'Encadre ce nombre entre deux nombres qui se suivent, avec un seul chiffre après la virgule.' }, `${mil(lo)} et ${mil(lo + 100)}`,
        [`${mil(lo - 100)} et ${mil(lo)}`, `${mil(lo + 100)} et ${mil(lo + 200)}`, `${mil(e * 1000 + c * 100)} et ${mil(e * 1000 + c * 100 + 100)}`].filter(x => !x.includes('−')));
    }
    if (t === 3) {
      const e = alea(0, 60);
      if (Math.random() < 0.5) {
        let d; do { d = alea(0, 9); } while (d === 5);
        const n = e * 1000 + d * 100 + alea(1, 9) * 10 + alea(0, 9), bon = d >= 5 ? e + 1 : e;
        return qcm({ visuel: gros(mil(n)), enonce: 'Arrondis ce nombre à l\'unité.', aide: 'Regarde le chiffre des dixièmes.' }, String(bon), [bon === e ? e + 1 : e, bon + 1, bon - 1].filter(x => x >= 0).map(String).concat(mil(Math.floor(n / 100) * 100)));
      }
      let d, c; do { d = alea(0, 8); c = alea(1, 9); } while (c === 5);
      const n = e * 1000 + d * 100 + c * 10, bas = e * 1000 + d * 100, bon = c >= 5 ? bas + 100 : bas;
      return qcm({ visuel: gros(mil(n)), enonce: 'Arrondis ce nombre au dixième.', aide: 'Regarde le chiffre des centièmes.' }, mil(bon), [bon === bas ? bas + 100 : bas, bon + 100, e * 1000 + c * 100, Math.round(n / 1000) * 1000].filter(x => x !== bon).map(mil));
    }
    if (t === 4) {
      const fin = Math.random() < 0.4, k = alea(1, 9);
      const base = fin ? alea(0, 9) * 1000 + alea(0, 9) * 100 : alea(0, 20) * 1000, pas = fin ? 10 : 100;
      const x0 = 8, L = 84, y = 50;
      let s = `<line x1="${x0}" y1="${y}" x2="${x0 + L}" y2="${y}" ${TRAIT}/>`;
      for (let i = 0; i <= 10; i++) { const x = r1(x0 + i * L / 10), gr = i % 10 === 0, mi = i === 5; s += `<line x1="${x}" y1="${y - (gr ? 7 : mi ? 5 : 3.5)}" x2="${x}" y2="${y + (gr ? 7 : mi ? 5 : 3.5)}" stroke="currentColor" stroke-width="${gr ? 2 : 1}"/>`; }
      s += texte(x0, y + 18, mil(base), 'middle', 8) + texte(x0 + L, y + 18, mil(base + 10 * pas), 'middle', 8);
      const px = r1(x0 + k * L / 10);
      s += `<circle cx="${px}" cy="${y}" r="3.5" fill="${ROUGE}"/>${texte(px, y - 11, 'A', 'middle', 10, ROUGE)}`;
      const bon = base + k * pas;
      return qcm({ visuel: svg(s, 220), enonce: 'Quel nombre correspond au point A ?', aide: 'Cherche combien vaut un petit intervalle.' }, mil(bon), [base + k * pas / 10, base + (k + 1) * pas, base + (k - 1) * pas, base + k * pas * 10].filter(x => x !== bon && x >= 0).map(mil));
    }
    const m = alea(0, 2);
    if (m === 0) {
      const n = alea(1001, 9999);
      if (n % 10 === 0) return genDecimaux();
      return qcm({ visuel: gros(`${n}/1000`), enonce: `${n}/1000 = ?`, dire: `${n} millièmes, c'est égal à combien ?` }, mil(n), [nb(n, 2), nb(n, 1), nb(n, 4)]);
    }
    if (m === 1) {
      const k = alea(1, 9), [den, n] = pioche([[100, nb(k, 2)], [1000, nb(k, 3)], [10, nb(k, 1)]]);
      return qcm({ visuel: gros(n), enonce: 'Quelle fraction décimale est égale à ce nombre ?' }, `${k}/${den}`, [`${k}/10`, `${k}/100`, `${k}/1000`, `1/${k}`, `${k}0/100`].filter(x => x !== `${k}/${den}` && differentDe(`${k}/${den}`)(x)));
    }
    const e = alea(1, 30), k = alea(1, 9), [nom, dec] = pioche([['millièmes', 3], ['centièmes', 2]]);
    const bon = e * 10 ** dec + k;
    return qcm({ visuel: '✍️', enonce: `Écris en chiffres : ${e} unité${e > 1 ? 's' : ''} et ${k} ${k > 1 ? nom : nom.slice(0, -1)}.` }, nb(bon, dec), [nb(e * 10 + k, 1), nb(e * 100 + k, 2), nb(e * 1000 + k, 3), nb(e * 10000 + k, 4)].filter(x => x !== nb(bon, dec)));
  };

  // Fractions
  const FRAC_DEC = [['1/2', '0,5'], ['1/4', '0,25'], ['3/4', '0,75'], ['1/5', '0,2'], ['2/5', '0,4'], ['3/5', '0,6'], ['4/5', '0,8'], ['3/2', '1,5'], ['5/4', '1,25'], ['7/4', '1,75'], ['5/2', '2,5'], ['7/10', '0,7'], ['9/100', '0,09'], ['13/10', '1,3'], ['1/100', '0,01'], ['3/100', '0,03'], ['9/2', '4,5'], ['6/5', '1,2']];
  const genFractions = () => {
    const t = alea(0, 5);
    if (t === 0) {
      let p, q; do { q = alea(2, 10); p = alea(1, 12); } while (p === q || pgcd(p, q) !== 1);
      const k = alea(2, 6), a = p * k, b = q * k, bon = `${p}/${q}`;
      const f = [`${p + 1}/${q}`, `${p}/${q + 1}`, `${q}/${p}`, `${a - k}/${b - k}`, `${a / k + k}/${b / k + k}`, `${p * 2}/${q * 3}`].filter(x => !/^(\d+)\/\1$/.test(x) && differentDe(bon)(x));
      return qcm({ visuel: gros(`${a}/${b}`), enonce: `Simplifie la fraction ${a}/${b} le plus possible.`, aide: 'Divise le numérateur et le dénominateur par le même nombre.' }, bon, f);
    }
    if (t === 1) {
      let a, b, c, d;
      if (Math.random() < 0.3) { a = alea(1, 7); b = alea(a + 1, 9); d = alea(b + 1, 12); c = a; }
      else {
        b = pioche([2, 3, 4, 5]); const m = pioche([2, 3]); d = b * m;
        a = alea(1, b - 1); c = pioche([a * m, a * m - 1, a * m + 1].filter(x => x > 0 && x < d));
      }
      const A = `${a}/${b}`, B = `${c}/${d}`, ega = a * d === b * c;
      const bon = ega ? 'Elles sont égales.' : (a * d > b * c ? A : B);
      return { visuel: '⚖️', enonce: `Quelle est la plus grande fraction : ${A} ou ${B} ?`, dire: aDire(`Quelle est la plus grande fraction : ${A} ou ${B} ?`), choix: melange([A, B, 'Elles sont égales.']), bonne: bon, aide: 'Écris-les avec le même dénominateur.' };
    }
    if (t === 2) {
      const d = pioche([3, 4, 5, 6, 8, 10]), k = alea(1, d - 1), m = alea(3, 30), q = d * m, r = k * m;
      const [unite, v] = pioche([['€', '💶'], ['km', '🚲'], ['élèves', '🧒'], ['pages', '📖'], ['litres', '🪣'], ['kg', '⚖️']]);
      return qcm({ visuel: v, enonce: `Combien font ${k}/${d} de ${q} ${unite} ?` }, `${r} ${unite}`, [m, q - r, r + m, k * q, r - m].filter(x => x > 0 && x !== r).map(x => `${x} ${unite}`));
    }
    if (t === 3) {
      const [fr, de] = pioche(FRAC_DEC), [a, b] = fr.split('/');
      const autresDec = FRAC_DEC.map(x => x[1]), autresFr = FRAC_DEC.map(x => x[0]);
      if (Math.random() < 0.5) return qcm({ visuel: gros(fr), enonce: `Quel nombre décimal est égal à ${fr} ?` }, de, [`${a},${b}`, `${b},${a}`, `0,${a}${b}`, ...melange(autresDec)].filter(differentDe(de)));
      return qcm({ visuel: gros(de), enonce: `Quelle fraction est égale à ${de} ?` }, fr, [`${b}/${a}`, `1/${de.replace(/^0,0?/, '').replace(',', '')}`, ...melange(autresFr)].filter(x => !/\/0|\/$/.test(x) && differentDe(fr)(x)));
    }
    if (t === 4) {
      const d = alea(3, 12);
      if (Math.random() < 0.6) {
        const a = alea(1, d - 1), b = alea(1, d - 1), bon = `${a + b}/${d}`;
        return qcm({ visuel: '➕', enonce: `${a}/${d} + ${b}/${d} = ?`, aide: 'Même dénominateur : on additionne seulement les numérateurs.' }, bon, [`${a + b}/${2 * d}`, `${a * b}/${d}`, `${a + b + 1}/${d}`, `${a + b}/${d * d}`].filter(differentDe(bon)));
      }
      const a = alea(1, d - 1), bon = `${d - a}/${d}`;
      return qcm({ visuel: '➖', enonce: `1 − ${a}/${d} = ?`, aide: `1 = ${d}/${d}` }, bon, [`${a}/${d}`, `${d - a + 1}/${d}`, `${d - a}/${d - 1}`, `${a - 1}/${d}`].filter(x => !/^0\//.test(x) && differentDe(bon)(x)));
    }
    let d, n; do { d = alea(2, 9); n = alea(d + 1, 5 * d); } while (n % d === 0);
    const q = Math.floor(n / d), r = n % d;
    if (Math.random() < 0.5) {
      const bon = `${q} + ${r}/${d}`;
      return qcm({ visuel: gros(`${n}/${d}`), enonce: `${n}/${d} = ?`, aide: `${d}/${d} = 1` }, bon, [`${q + 1} + ${r}/${d}`, `${r} + ${q}/${d}`, `${q} + ${d}/${r}`, `${q} + ${r + 1}/${d}`, `${q - 1} + ${r}/${d}`].filter(x => !/^0 |\/1$|\+ (\d+)\/\1$/.test(x) && differentDe(bon)(x)));
    }
    return qcm({ visuel: gros(`${n}/${d}`), enonce: `Entre quels nombres entiers qui se suivent se trouve ${n}/${d} ?` }, `${q} et ${q + 1}`, [`${q - 1} et ${q}`, `${q + 1} et ${q + 2}`, `${r} et ${r + 1}`, `${d} et ${d + 1}`].filter(x => x !== `${q} et ${q + 1}`));
  };

  // Calculs avec les décimaux (en millièmes)
  const decA = k => alea(11, 999) * 10 ** (3 - k); // nombre à k décimales
  const genCalculsDecimaux = () => {
    const t = alea(0, 5);
    if (t === 0) {
      const ka = alea(1, 2), kb = 3 - ka, a = decA(ka), b = decA(kb), r = a + b;
      const decale = a * 10 ** (ka - kb) + b; // virgules mal alignées
      return qcm({ visuel: '🧮', enonce: `${mil(a)} + ${mil(b)} = ?`, aide: 'Pose l\'opération en alignant les virgules.' }, mil(r), [decale, r + 100, r - 10, r + 1000, r + 10].filter(x => x !== r && x > 0).map(mil));
    }
    if (t === 1) {
      const b = alea(101, 999) * 10, a = (Math.floor(b / 1000) + alea(1, 20)) * 1000 + pioche([0, alea(1, 9) * 100]), r = a - b;
      const oubli = Math.abs(a - b + 1000); // retenue oubliée
      return qcm({ visuel: '🧮', enonce: `${mil(a)} − ${mil(b)} = ?`, aide: 'Complète avec des zéros : 7 = 7,00.' }, mil(r), [oubli, r + 100, r - 100, r + 20].filter(x => x !== r && x > 0).map(mil));
    }
    if (t === 2) {
      const k = alea(1, 2), a = decA(k), m = alea(3, 9), r = a * m;
      return qcm({ visuel: '✖️', enonce: `${mil(a)} × ${m} = ?`, aide: 'Calcule sans la virgule, puis replace-la : autant de chiffres après la virgule que dans le nombre décimal.' }, mil(r), [r * 10, r % 10 === 0 ? r / 10 : r + 1, r + a, r - a, r + 1000].filter(x => x !== r && x > 0).map(mil));
    }
    if (t === 3) {
      const a = alea(1, 9999), p = pioche([10, 100, 1000]), r = a * p; // a en millièmes
      return qcm({ visuel: '🔟', enonce: `${mil(a)} × ${sp(p)} = ?`, aide: 'Chaque chiffre prend une valeur 10, 100 ou 1 000 fois plus grande.' }, mil(r), [r * 10, r / 10, a * p / 100, a + p * 1000].filter(x => Number.isInteger(x) && x !== r).map(mil));
    }
    if (t === 4) {
      const p = pioche([10, 100, 1000]), j = String(p).length - 1, k = alea(0, 3 - j), a = alea(12, 9999) * 10 ** (3 - k); // a a k décimales
      const r10 = a * 10 / p; // résultat en dix-millièmes
      return qcm({ visuel: '🔟', enonce: `${mil(a)} ÷ ${sp(p)} = ?`, aide: 'Chaque chiffre prend une valeur 10, 100 ou 1 000 fois plus petite.' }, nb(r10, 4), [r10 * 10, r10 / 10, a * p * 10, r10 * 100].filter(Number.isInteger).map(x => nb(x, 4)).filter(x => x !== nb(r10, 4) && !/,\d{5}/.test(x)));
    }
    let c; do { c = alea(11, 99); } while (c % 10 === 0);
    const e = alea(0, 9), dix = Math.random() < 0.5 && e > 0, a = e * 1000 + c * 10, cible = dix ? 10000 : (e + 1) * 1000, r = cible - a;
    const naif = (10 - Math.floor(c / 10)) * 100 + (10 - c % 10) * 10 + (dix ? (9 - e) * 1000 : e * 0);
    return qcm({ visuel: '🎯', enonce: `Combien faut-il ajouter à ${mil(a)} pour obtenir ${mil(cible)} ?`, aide: 'Complète d\'abord jusqu\'à l\'unité suivante.' }, mil(r), [naif, r + 100, r + 1000, r - 10, r + 10].filter(x => x > 0 && x !== r).map(mil));
  };

  const genDivisions = () => {
    const t = alea(0, 5);
    if (t === 0) {
      const b = pioche([alea(3, 9), alea(11, 25)]), q = alea(12, 250), r = alea(1, b - 1), a = b * q + r;
      const fmt = (x, y) => `quotient ${x}, reste ${y}`;
      return qcm({ visuel: '➗', enonce: `Division de ${sp(a)} par ${b} : quels sont le quotient et le reste ?`, aide: `Le reste doit être plus petit que ${b}.` }, fmt(q, r), [fmt(q + 1, r), fmt(q - 1, r + b), fmt(q, r + 1 < b ? r + 1 : r - 1), fmt(q + 10, r), fmt(r, q)].filter(x => x !== fmt(q, r)));
    }
    if (t === 1) {
      const b = alea(3, 9), q = Math.random() < 0.6 ? alea(1, 9) * 100 + alea(1, 9) : alea(101, 999), a = b * q;
      const sansZero = Number(String(q).replace(/0/g, ''));
      return qcm({ visuel: '➗', enonce: `${sp(a)} ÷ ${b} = ?`, aide: 'Pose la division. N\'oublie pas les zéros au quotient !' }, sp(q), [sansZero, q + 1, q - 1, q + 10, q * 10].filter(x => x !== q).map(sp));
    }
    if (t === 2) {
      if (Math.random() < 0.5) {
        const b = pioche([2, 4, 5, 8]); let a; do { a = alea(11, 199); } while (a % b === 0);
        const r = a * 1000 / b, q = Math.floor(a / b), reste = a % b;
        return qcm({ visuel: '➗', enonce: `${a} ÷ ${b} = ?`, aide: 'Quand il y a un reste, mets une virgule au quotient et continue avec des zéros.' }, mil(r), [`${q},${reste}`, mil(r + 100), mil(r - 100), mil(r * 10), String(q)].filter(x => x !== mil(r)));
      }
      const b = alea(2, 9), q = alea(11, 199) * 10 ** alea(1, 2), a = q * b; // q en millièmes (1 ou 2 décimales)
      return qcm({ visuel: '➗', enonce: `${mil(a)} ÷ ${b} = ?`, aide: 'Quand on abaisse le premier chiffre après la virgule, on met la virgule au quotient.' }, mil(q), [q * 10, q / 10, q + 100, q - 10].filter(x => Number.isInteger(x) && x > 0 && x !== q).map(mil));
    }
    if (t === 3) {
      const b = alea(4, 12); let a; do { a = alea(25, 150); } while (a % b === 0);
      const q = Math.floor(a / b), r = a % b;
      const [qui, quoi, v, plein] = pioche([
        ['enfants', `minibus de ${b} places`, '🚐', 'Combien de minibus faut-il pour transporter tout le monde ?'],
        ['œufs', `boîtes de ${b}`, '🥚', 'Combien de boîtes faut-il pour ranger tous les œufs ?'],
        ['livres', `cartons de ${b} livres`, '📦', 'Combien de cartons faut-il pour ranger tous les livres ?'],
        ['élèves', `tables de ${b} places`, '🍽️', 'Combien de tables faut-il pour asseoir tous les élèves ?'],
        ['photos', `pages de ${b} photos`, '📷', 'Combien de pages faut-il pour coller toutes les photos ?']]);
      if (Math.random() < 0.6) return qcm({ visuel: v, enonce: `Il y a ${a} ${qui}. On utilise des ${quoi}. ${plein}`, aide: 'Attention au reste : il faut aussi de la place pour lui !' }, q + 1, [q, r, q + 2, b]);
      return qcm({ visuel: v, enonce: `Il y a ${a} ${qui}. On remplit des ${quoi}. Combien de ${quoi.split(' ')[0]} seront complètement pleins ?`.replace('pleins', /boîtes|tables|pages/.test(quoi) ? 'pleines' : 'pleins'), aide: 'On ne compte que les paquets complets.' }, q, [q + 1, r, q - 1, b].filter(x => x > 0));
    }
    if (t === 4) {
      const b = alea(3, 9), q = alea(12, 99), r = alea(1, b - 1), a = b * q + r;
      return qcm({ visuel: '✅', enonce: `On a trouvé : ${a} ÷ ${b} → quotient ${q}, reste ${r}. Quel calcul permet de le vérifier ?` }, `(${b} × ${q}) + ${r} = ${a}`, [`(${b} × ${r}) + ${q} = ${a}`, `(${q} × ${r}) + ${b} = ${a}`, `(${b} + ${q}) × ${r} = ${a}`, `(${b} × ${q}) − ${r} = ${a}`]);
    }
    const b = pioche([2, 4, 5]); let a; do { a = alea(11, 150); } while (a % b === 0);
    const c = a * 100 / b, q = Math.floor(a / b), reste = a % b;
    const [qui, v] = pioche([['amis', '🧑‍🤝‍🧑'], ['frères et sœurs', '👧'], ['joueurs', '⚽'], ['cousins', '👦']]);
    return qcm({ visuel: v, enonce: `${b} ${qui} se partagent ${a} € à parts égales. Combien chacun reçoit-il ?` }, euros(c), [q * 100 + reste * 10, q * 100, c + 50, c - 50, c + 100].filter(x => x > 0 && x !== c).map(euros));
  };

  const genDivisibilite = () => {
    const t = alea(0, 5);
    if (t === 0) {
      const d = pioche([3, 9, 3, 9, 2, 5]), ok = n => n % d === 0;
      const bon = d * alea(Math.ceil(120 / d), Math.floor(9999 / d));
      const f = new Set();
      while (f.size < 3) { const n = alea(100, 9999); if (!ok(n) && (d !== 9 || Math.random() < 0.5 || n % 3 === 0)) f.add(n); }
      const regle = { 2: 'Le chiffre des unités est pair.', 3: 'La somme des chiffres est dans la table de 3.', 5: 'Il se termine par 0 ou 5.', 9: 'La somme des chiffres est dans la table de 9.' }[d];
      return qcm({ visuel: '🔍', enonce: `Quel nombre est divisible par ${d} ?`, aide: regle }, sp(bon), [...f].map(sp));
    }
    if (t === 1) {
      const d = pioche([3, 9, 5, 10, 2, 9, 3]), n = Math.random() < 0.5 ? d * alea(12, 999) : alea(100, 9999);
      return { visuel: gros(sp(n)), enonce: `Le nombre ${sp(n)} est-il divisible par ${d} ?`, choix: ['oui', 'non'], bonne: n % d === 0 ? 'oui' : 'non' };
    }
    if (t === 2) {
      const n = pioche([12, 15, 16, 18, 20, 21, 24, 28, 30, 32, 36, 40, 42, 45]);
      const div = []; for (let x = 1; x <= n; x++) if (n % x === 0) div.push(x);
      const non = []; for (let x = 2; x < n; x++) if (n % x) non.push(x);
      const moins = div.filter(x => x !== 1 && x !== n);
      const f = [div.filter(x => x !== pioche(moins)), div.filter(x => x !== n), [...div, pioche(non)].sort((a, b) => a - b), div.filter(x => x !== 1)];
      return qcm({ visuel: gros(n), enonce: `Quelle est la liste de TOUS les diviseurs de ${n} ?`, aide: 'Cherche les paires : 1 × …, 2 × …, 3 × …' }, div.join(', '), f.map(x => x.join(', ')));
    }
    if (t === 3) {
      const [a, b] = pioche([[2, 3], [3, 4], [4, 6], [3, 5], [2, 5], [5, 6], [4, 5], [6, 9], [2, 7], [3, 7]]);
      const L = a * b / pgcd(a, b), bon = L * alea(1, Math.floor(99 / L) + 1);
      const f = new Set(); let essais = 0;
      while (f.size < 3 && essais++ < 200) { const n = alea(Math.max(4, bon - 20), bon + 20); if (n % L && (n % a === 0 || n % b === 0)) f.add(n); }
      return qcm({ visuel: '🔢', enonce: `Quel nombre est à la fois un multiple de ${a} et de ${b} ?` }, bon, [...f]);
    }
    if (t === 4) {
      const d = pioche([3, 9]), long = alea(3, 4), pos = alea(1, long - 1);
      let ch, s; do { ch = Array.from({ length: long }, (_, i) => i === 0 ? alea(1, 9) : alea(0, 9)); s = ch.reduce((x, y, i) => i === pos ? x : x + y, 0); } while (s % d === 0 && d === 9);
      const bons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => (s + x) % d === 0), mauvais = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => (s + x) % d);
      const aff = ch.map((x, i) => i === pos ? '?' : x).join('');
      return qcm({ visuel: gros(aff), enonce: `Quel chiffre peut remplacer ? pour que ${aff} soit divisible par ${d} ?`, dire: `Quel chiffre peut remplacer le point d'interrogation pour que ce nombre soit divisible par ${d} ?`, aide: `Additionne les chiffres : la somme doit être dans la table de ${d}.` }, pioche(bons), mauvais);
    }
    const n = pioche([24, 30, 36, 40, 42, 48, 54, 56, 60, 72, 84, 90, 96]);
    const div = [], non = []; for (let x = 2; x <= 15; x++) (n % x ? non : div).push(x);
    return qcm({ visuel: gros(n), enonce: `Quel nombre n'est PAS un diviseur de ${n} ?` }, pioche(non), melange(div).slice(0, 3));
  };

  const genProportionnalite = () => {
    const t = alea(0, 6);
    if (t === 0) {
      const [obj, v, pmin, pmax] = pioche([['cahiers', '📒', 12, 40], ['croissants', '🥐', 9, 15], ['stylos', '🖊️', 5, 25], ['places de cinéma', '🎟️', 60, 120], ['kilos de pommes', '🍎', 15, 40], ['bouteilles de jus', '🧃', 12, 35]]);
      const u = alea(pmin, pmax) * 10, n1 = alea(2, 6); let n2; do { n2 = alea(2, 12); } while (n2 === n1);
      const bon = u * n2;
      return qcm({ visuel: v, enonce: `${n1} ${obj} coûtent ${euros(u * n1)}. Combien coûtent ${n2} ${obj} ?`, aide: 'Cherche d\'abord le prix d\'un seul.' }, euros(bon), [u * n1 + (n2 - n1) * 100, u * (n2 + 1), u * n1 * n2, bon + 50, bon - 10].filter(x => x > 0 && x !== bon).map(euros));
    }
    if (t === 1) {
      const k = alea(2, 9), xs = melange([2, 3, 4, 5, 6, 8, 10, 12]).slice(0, 4).sort((a, b) => a - b), i = alea(1, 3);
      const [l1, l2] = pioche([['Nombre de paquets', 'Nombre de gâteaux'], ['Nombre de tours', 'Distance (km)'], ['Nombre de billets', 'Prix (€)'], ['Nombre de boîtes', 'Nombre de crayons']]);
      const ligne2 = xs.map((x, j) => j === i ? '<b style="color:#e5484d">?</b>' : x * k);
      const bon = xs[i] * k;
      return qcm({ visuel: tableau([[l1, ...xs], [l2, ...ligne2]]), enonce: 'C\'est un tableau de proportionnalité. Quel nombre remplace le point d\'interrogation ?', aide: 'On passe de la première ligne à la deuxième en multipliant toujours par le même nombre.' }, bon, [bon + k, bon - k, xs[i] + k, xs[i] + (xs[0] * k - xs[0]), bon + 1].filter(x => x > 0 && x !== bon));
    }
    if (t === 2) {
      const p = pioche([10, 25, 50]), q = p === 25 ? alea(1, 30) * 4 : p === 50 ? alea(3, 90) * 2 : alea(2, 50) * 10, r = q * p / 100;
      if (Math.random() < 0.5) {
        const ctx = [
          [`Une école compte ${q} élèves. ${p} % d'entre eux viennent à pied. Combien d'élèves viennent à pied ?`, '🧒', 40, 500],
          [`Un parc compte ${q} arbres. ${p} % de ces arbres sont des chênes. Combien y a-t-il de chênes ?`, '🌳', 20, 500],
          [`Un livre a ${q} pages. Tom en a déjà lu ${p} %. Combien de pages a-t-il lues ?`, '📖', 60, 400],
          [`Un club de sport compte ${q} membres. ${p} % d'entre eux sont des enfants. Combien y a-t-il d'enfants ?`, '🏅', 20, 300],
          [`Un sac contient ${q} billes. ${p} % des billes sont rouges. Combien y a-t-il de billes rouges ?`, '🔴', 4, 120]].filter(c => q >= c[2] && q <= c[3]);
        if (!ctx.length) return genProportionnalite();
        const [texteQ, v] = pioche(ctx);
        return qcm({ visuel: v, enonce: texteQ, aide: p === 10 ? '10 %, c\'est 1/10 : on divise par 10.' : p === 25 ? '25 %, c\'est 1/4 : on divise par 4.' : '50 %, c\'est la moitié.' }, r, [p, q - r, r * 2, r + 10, q / 5].filter(x => Number.isInteger(x) && x > 0 && x !== r));
      }
      const objs = [['Un pull', '👕', 20, 80], ['Un jeu vidéo', '🎮', 20, 70], ['Un ballon', '⚽', 10, 40], ['Une paire de baskets', '👟', 30, 120], ['Un sac à dos', '🎒', 20, 60], ['Un vélo', '🚲', 100, 500], ['Une trottinette', '🛴', 40, 200], ['Une console de jeux', '🕹️', 150, 500]].filter(o => q >= o[2] && q <= o[3]);
      if (!objs.length) return genProportionnalite();
      const [obj, v] = pioche(objs), f = /^Une/.test(obj) && !/paire/.test(obj) || /paire/.test(obj);
      return qcm({ visuel: v, enonce: `${obj} coûte ${q} €. ${f ? 'Elle est soldée' : 'Il est soldé'} à −${p} %. Quel est son nouveau prix ?`, aide: `Calcule d'abord ${p} % de ${q} €, puis enlève-le.` }, `${q - r} €`, [r, q - p, q + r, q - r - 10, q - r + 5].filter(x => x > 0 && x !== q - r).map(x => `${x} €`));
    }
    if (t === 3) {
      const m = alea(0, 2);
      if (m === 0) {
        const [unite, e] = pioche([['km', alea(2, 9)], ['km', 10], ['m', alea(2, 5)]]), c = alea(3, 12), bon = e * c;
        return qcm({ visuel: '🗺️', enonce: `Sur une carte, 1 cm représente ${e} ${unite}. Deux lieux sont à ${c} cm l'un de l'autre sur la carte. Quelle est la distance réelle ?` }, `${bon} ${unite}`, [c + e, bon + e, bon * 10, e * (c + 1)].filter(x => x !== bon).map(x => `${x} ${unite}`));
      }
      if (m === 1) {
        const e = alea(2, 9), c = alea(3, 12), reel = e * c;
        return qcm({ visuel: '🗺️', enonce: `Sur une carte, 1 cm représente ${e} km. La distance réelle entre deux villes est de ${reel} km. Combien de centimètres les séparent sur la carte ?` }, `${c} cm`, [reel * e, reel - e, c + 1, c - 1, reel].filter(x => x > 0 && x !== c).map(x => `${x} cm`));
      }
      const [ech, rep] = pioche([['1/100', '1 m'], ['1/1 000', '10 m'], ['1/10 000', '100 m'], ['1/100 000', '1 km'], ['1/1 000 000', '10 km']]);
      return qcm({ visuel: '📐', enonce: `Sur un plan à l'échelle ${ech}, 1 cm représente…`, dire: `Sur un plan à l'échelle 1 sur ${ech.slice(2)}, 1 centimètre représente…`, aide: `1 cm dans la réalité correspond à ${ech.slice(2)} cm en vrai.` }, rep, ['1 m', '10 m', '100 m', '1 km', '10 km', '100 km']);
    }
    if (t === 4) {
      const k = alea(2, 9), xs = melange([1, 2, 3, 4, 5, 6, 8, 10]).slice(0, 4).sort((a, b) => a - b), prop = Math.random() < 0.5;
      let ys = xs.map(x => x * k);
      if (!prop) { if (Math.random() < 0.5) { const c = alea(1, 5); ys = xs.map(x => x * k + c); } else { const i = alea(1, 3); ys[i] += pioche([-1, 1, 2]); } }
      return { visuel: tableau([['', ...xs], ['', ...ys]]), enonce: 'Ce tableau est-il un tableau de proportionnalité ?', aide: 'Vérifie que l\'on multiplie toujours par le même nombre.', choix: ['oui', 'non'], bonne: prop ? 'oui' : 'non' };
    }
    if (t === 5) {
      const n1 = pioche([2, 4, 6, 8]); let n2; do { n2 = pioche([2, 3, 4, 5, 6, 8, 10, 12]); } while (n2 === n1);
      const [ing, unite, par] = pioche([['farine', 'g', pioche([25, 50, 75, 100])], ['lait', 'cL', pioche([10, 15, 20, 25])], ['sucre', 'g', pioche([20, 25, 30, 40])], ['beurre', 'g', pioche([15, 20, 25])]]);
      const t1 = par * n1, bon = par * n2;
      return qcm({ visuel: '🥞', enonce: `Pour ${n1} personnes, il faut ${t1} ${unite} de ${ing}. Combien en faut-il pour ${n2} personnes ?`, aide: 'Cherche d\'abord la quantité pour 1 personne.' }, `${sp(bon)} ${unite}`, [t1 + (n2 - n1), bon + par, bon - par, t1 * n2].filter(x => x > 0 && x !== bon).map(x => `${sp(x)} ${unite}`));
    }
    const v = pioche([40, 60, 80, 90, 100, 120, 160, 200, 240, 300]), [mn, lib] = pioche([[30, '30 min'], [15, '15 min'], [45, '45 min'], [90, '1 h 30 min'], [120, '2 h'], [180, '3 h']]);
    const bon = v * mn / 60;
    if (!Number.isInteger(bon)) return genProportionnalite();
    const vh = [['Un train', '🚆', 80, 160], ['Une voiture', '🚗', 40, 120], ['Un car', '🚌', 40, 90], ['Un TGV', '🚄', 200, 300]].filter(x => v >= x[2] && v <= x[3]);
    if (!vh.length) return genProportionnalite();
    const [qui, e] = pioche(vh);
    return qcm({ visuel: e, enonce: `${qui} roule toujours à ${v} km par heure. Quelle distance parcourt-il en ${lib} ?`.replace('parcourt-il', /^Une/.test(qui) ? 'parcourt-elle' : 'parcourt-il'), aide: '30 min, c\'est la moitié d\'une heure ; 15 min, le quart.' }, `${bon} km`, [v * mn, v + mn, bon * 2, bon + v, v / 2].filter(x => Number.isInteger(x) && x !== bon).map(x => `${sp(x)} km`));
  };

  // Conversions
  const ECHELLES = {
    longueur: [['km', 3], ['hm', 2], ['dam', 1], ['m', 0], ['dm', -1], ['cm', -2], ['mm', -3]],
    masse: [['t', 6], ['kg', 3], ['hg', 2], ['dag', 1], ['g', 0], ['dg', -1], ['cg', -2], ['mg', -3]],
    contenance: [['hL', 2], ['daL', 1], ['L', 0], ['dL', -1], ['cL', -2], ['mL', -3]],
    aire: [['m²', 0], ['dm²', -2], ['cm²', -4]]
  };
  const puiss = (v, E) => E >= 0 ? nb(v * 10 ** E, 0) : nb(v, -E);
  const genMesures = () => {
    const t = alea(0, 4);
    if (t <= 2) {
      const type = t === 2 ? 'aire' : pioche(['longueur', 'masse', 'contenance', 'longueur']), U2 = ECHELLES[type];
      let a, b; do { a = pioche(U2); b = pioche(U2); } while (a === b || Math.abs(a[1] - b[1]) > (type === 'aire' ? 4 : 3) || (Math.random() < 0.6 && [a[0], b[0]].some(u => /^(hg|dag|dg|cg|daL)$/.test(u))) || (type === 'aire' && a[1] < b[1] && b[1] - a[1] > 2));
      const k = type === 'aire' ? (a[1] > b[1] ? alea(0, 1) : 0) : alea(0, 2), v = type === 'aire' ? alea(2, 99) : alea(2, 999);
      if (k && v % 10 === 0) return genMesures();
      const E = a[1] - b[1] - k, bon = puiss(v, E);
      if (/,\d{4}/.test(bon) || bon.replace(/\D/g, '').length > 8) return genMesures();
      const f = [E + 1, E - 1, E + 2, E - 2].map(x => puiss(v, x)).filter(x => x !== bon && !/,\d{5}/.test(x));
      return qcm({ visuel: { longueur: '📏', masse: '⚖️', contenance: '🧴', aire: '⬛' }[type], enonce: `${nb(v, k)} ${a[0]} = ? ${b[0]}`, dire: `${nb(v, k)} ${NOMS_U[a[0]]}, c'est égal à combien de ${NOMS_U[b[0]]} ?`, aide: type === 'aire' ? '1 m² = 100 dm² = 10 000 cm²' : 'Utilise un tableau de conversion.' }, `${bon} ${b[0]}`, f.map(x => `${x} ${b[0]}`));
    }
    if (t === 3) {
      const type = pioche(['longueur', 'masse']), base = type === 'longueur' ? alea(8, 40) * 100 : alea(2, 9) * 1000; // en m ou en g
      const vals = new Set([base]);
      while (vals.size < 4) vals.add(base + pioche([-1, 1]) * alea(1, 9) * pioche([10, 100]));
      const unites = type === 'longueur' ? [['km', 3], ['hm', 2], ['m', 0], ['dam', 1]] : [['kg', 3], ['g', 0], ['hg', 2]];
      const ecrire = x => { const u = pioche(unites.filter(([, e]) => x % 10 ** Math.max(0, e - 3) === 0)); return `${puiss(x, -u[1])} ${u[0]}`; };
      const v = [...vals], grand = Math.random() < 0.5, bon = grand ? Math.max(...v) : Math.min(...v);
      return qcm({ visuel: type === 'longueur' ? '📏' : '⚖️', enonce: `Quelle est la ${type} la plus ${grand ? 'grande' : 'petite'} ?`, aide: 'Convertis tout dans la même unité avant de comparer.' }, ecrire(bon), v.filter(x => x !== bon).map(ecrire));
    }
    const [q, b, f] = pioche([
      ['1 m² = ? cm²', '10 000 cm²', ['100 cm²', '1 000 cm²', '10 cm²']], ['1 m² = ? dm²', '100 dm²', ['10 dm²', '1 000 dm²', '10 000 dm²']],
      ['1 t = ? kg', '1 000 kg', ['100 kg', '10 kg', '10 000 kg']], ['1 L = ? mL', '1 000 mL', ['100 mL', '10 mL', '10 000 mL']],
      ['1 km = ? m', '1 000 m', ['100 m', '10 m', '10 000 m']], ['1 dm² = ? cm²', '100 cm²', ['10 cm²', '1 000 cm²', '1 cm²']],
      ['1 kg = ? mg', '1 000 000 mg', ['1 000 mg', '100 000 mg', '10 000 mg']], ['1 cm = ? mm', '10 mm', ['100 mm', '1 000 mm', '1 mm']],
      ['1 hL = ? L', '100 L', ['10 L', '1 000 L', '1 L']], ['1 L = ? cL', '100 cL', ['10 cL', '1 000 cL', '1 cL']]]);
    const [ua, ub] = q.replace(/^1 /, '').split(' = ? '), un = NOMS_U[ua].replace(/s\b/g, '');
    return qcm({ visuel: '📋', enonce: q, dire: `Combien y a-t-il de ${NOMS_U[ub]} dans ${ua === 't' ? 'une' : 'un'} ${un} ?` }, b, f);
  };

  // Durées et horaires
  const heure = (h, m) => `${h} h ${String(m).padStart(2, '0')}`;
  const deMinutes = t => heure(Math.floor(t / 60) % 24, t % 60);
  const duree = mn => { const h = Math.floor(mn / 60), m = mn % 60; return h ? (m ? `${h} h ${m} min` : `${h} h`) : `${m} min`; };
  const genDurees = () => {
    const t = alea(0, 5);
    if (t === 0) {
      const m = alea(0, 3);
      if (m === 0) { const h = alea(2, 9), mn = alea(1, 11) * 5, r = h * 60 + mn; return qcm({ visuel: '⏱️', enonce: `${h} h ${mn} min = ? min` }, `${r} min`, [h * 100 + mn, r + 60, r - 60, h * 10 + mn, r + 10].filter(x => x !== r).map(x => `${x} min`)); }
      if (m === 1) { let n; do { n = alea(25, 119) * 5; } while (n % 60 === 0); const naif = Math.floor(n / 100) * 60 + n % 100; return qcm({ visuel: '⏱️', enonce: `${n} min = ?` }, duree(n), [duree(naif === n ? n + 40 : naif), duree(n + 60), duree(n - 60), duree(n + 10)].filter(x => x !== duree(n))); }
      if (m === 2) { const mn = alea(1, 9), s = alea(1, 11) * 5, r = mn * 60 + s; return qcm({ visuel: '⏱️', enonce: `${mn} min ${s} s = ? s` }, `${r} s`, [mn * 100 + s, r + 60, r - 60, mn * 10 + s].filter(x => x > 0 && x !== r).map(x => `${x} s`)); }
      const [q, b, f] = pioche([
        ['1,5 h = ?', '1 h 30 min', ['1 h 50 min', '1 h 5 min', '1 h 15 min']], ['2,5 h = ?', '2 h 30 min', ['2 h 50 min', '2 h 5 min', '2 h 15 min']],
        ['0,5 h = ?', '30 min', ['50 min', '5 min', '15 min']], ['un quart d\'heure = ?', '15 min', ['25 min', '4 min', '30 min']],
        ['trois quarts d\'heure = ?', '45 min', ['34 min', '75 min', '30 min']], ['1/3 h = ?', '20 min', ['30 min', '13 min', '33 min']],
        ['3 jours = ? h', '72 h', ['36 h', '60 h', '300 h']], ['2 semaines et 3 jours = ? jours', '17 jours', ['23 jours', '14 jours', '10 jours']],
['1 millénaire = ? ans', '1 000 ans', ['100 ans', '10 000 ans', '10 ans']],
        ['2 h = ? s', '7 200 s', ['120 s', '3 600 s', '200 s']], ['1 jour = ? min', '1 440 min', ['240 min', '1 000 min', '2 400 min']]]);
      return qcm({ visuel: '⏱️', enonce: q, dire: aDire(q).replace(/\bh\b/g, 'heure').replace(/1 sur 3/, 'un tiers d\'') }, b, f);
    }
    if (t === 1) {
      let debut, d, fin; do { debut = alea(6 * 60, 18 * 60); d = alea(35, 300); fin = debut + d; } while (fin % 60 >= debut % 60 || fin >= 24 * 60);
      const naif = (Math.floor(fin / 60) - Math.floor(debut / 60)) * 60 + (debut % 60 - fin % 60);
      const [quoi, v, pron] = pioche([['Un train part', '🚆', 'le trajet'], ['Un avion décolle', '✈️', 'le vol'], ['Un bus part', '🚌', 'le trajet'], ['Une randonnée commence', '🥾', 'la randonnée'], ['Un bateau quitte le port', '⛴️', 'la traversée']]);
      return qcm({ visuel: v, enonce: `${quoi} à ${deMinutes(debut)} et arrive à ${deMinutes(fin)}. Combien de temps dure ${pron} ?`.replace(' et arrive à', quoi.includes('commence') ? ' et se termine à' : ' et arrive à'), aide: 'Avance jusqu\'à l\'heure pile, puis compte le reste.' }, duree(d), [naif, d + 60, d - 60, d + 10, d - 5].filter(x => x > 0 && x !== d).map(duree));
    }
    if (t === 2) {
      const debut = alea(6 * 12, 16 * 12) * 5, d = alea(7, 60) * 5, fin = debut + d;
      const [quoi, v] = pioche([['Le film dure', '🎬'], ['Le trajet dure', '🚗'], ['La course dure', '🏃'], ['Le spectacle dure', '🎭'], ['La visite du musée dure', '🖼️']]);
      return qcm({ visuel: v, enonce: `Il est ${deMinutes(debut)}. ${quoi} ${duree(d)}. À quelle heure se termine-t-il ?`.replace('se termine-t-il', /^La/.test(quoi) ? 'se termine-t-elle' : 'se termine-t-il'), aide: 'Ajoute d\'abord les heures, puis les minutes.' }, deMinutes(fin), [fin + 60, fin - 60, fin + 10, fin - 10, fin + 40].filter(x => x > debut).map(deMinutes));
    }
    if (t === 3) {
      let y; do { y = alea(500, 2025); } while (y % 100 === 0 && Math.random() < 0.7);
      const s = Math.floor((y - 1) / 100) + 1;
      return qcm({ visuel: '📜', enonce: `En quel siècle se trouve l'année ${y} ?`, dire: `En quel siècle se trouve l'année ${y} ?`, aide: 'L\'an 1 à l\'an 100 : Ier siècle. 101 à 200 : IIe siècle…' }, siecle(s), [s - 1, s + 1, s + 2].filter(x => x > 0).map(siecle));
    }
    if (t === 4) {
      const s = alea(5, 21), d0 = (s - 1) * 100 + 1;
      return qcm({ visuel: '📜', enonce: `Le ${siecle(s)} va…`, dire: `Le ${s}e siècle va…` }, `de ${d0} à ${d0 + 99}`, [`de ${d0 + 100} à ${d0 + 199}`, `de ${d0 - 100} à ${d0 - 1}`, `de ${d0 + 99} à ${d0 + 198}`]);
    }
    const [a, b] = pioche([[1789, 1914], [1870, 1914], [1914, 1918], [1939, 1945], [1492, 1789], [1515, 1789], [1804, 1815], [1944, 2024], [1958, 2008], [1905, 2005], [1881, 1958], [1800, 1914], [1643, 1715]]);
    const r = b - a;
    return qcm({ visuel: '🗓️', enonce: `Combien d'années séparent ${a} et ${b} ?` }, `${r} ans`, [r + 10, r - 10, r + 100, r + 1].filter(x => x > 0).map(x => `${x} ans`));
  };

  // Périmètre, aire, volume
  const rectSvg = (L, l, u = 'cm') => {
    const k = 62 / Math.max(L, l * 1.4), w = r1(L * k), h = r1(l * k), x = r1((100 - w) / 2 + 9), y = r1((100 - h) / 2 + 3);
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${REMPLI}/>${texte(50, r1(y - 4), L + ' ' + u)}${texte(r1(x - 3), r1(y + h / 2 + 3), l + ' ' + u, 'end')}`;
  };
  function cubes(a, b, c) { // pavé de a × b × c petits cubes vus en perspective
    const s = Math.min(12, 88 / ((a + b) * 0.87), 88 / ((a + b) * 0.5 + c)), cx = s * 0.87, cy = s * 0.5;
    const ox = 50 - (a - b) * cx / 2, oy = 50 - ((a + b) * cy - c * s) / 2;
    const P = (i, j, k) => [ox + (i - j) * cx, oy + (i + j) * cy - k * s];
    const liste = [];
    for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) for (let k = 0; k < c; k++) liste.push([i, j, k]);
    liste.sort((p, q) => (p[0] + p[1] + p[2]) - (q[0] + q[1] + q[2]) || p[2] - q[2]);
    const poly = (pts, f) => `<polygon points="${pts.map(p => p.map(r1).join(',')).join(' ')}" fill="${f}" stroke="currentColor" stroke-width=".7"/>`;
    return liste.map(([i, j, k]) => {
      const A = P(i, j, k + 1), B = P(i + 1, j, k + 1), C = P(i + 1, j + 1, k + 1), D = P(i, j + 1, k + 1), E = P(i + 1, j, k), F = P(i + 1, j + 1, k), G = P(i, j + 1, k);
      return poly([A, B, C, D], '#a9c7fb') + poly([B, C, F, E], '#6d9ef0') + poly([D, C, F, G], '#4f8ef7');
    }).join('');
  }
  const genPerimetreAire = () => {
    const t = alea(0, 6);
    if (t === 0) {
      const u = pioche(['m', 'cm']), L = alea(6, 25), l = alea(3, L - 2);
      if (Math.random() < 0.5) return qcm({ visuel: svg(rectSvg(L, l, u)), enonce: 'Quel est le périmètre de ce rectangle ?' }, `${2 * (L + l)} ${u}`, [`${L + l} ${u}`, `${L * l} ${u}`, `${2 * L + l} ${u}`, `${2 * (L + l)} ${u}²`]);
      return qcm({ visuel: svg(rectSvg(L, l, u)), enonce: 'Quelle est l\'aire de ce rectangle ?' }, `${L * l} ${u}²`, [`${2 * (L + l)} ${u}²`, `${L + l} ${u}²`, `${L * l} ${u}`, `${L * l + L} ${u}²`]);
    }
    if (t === 1) {
      let a, b; do { a = alea(3, 14); b = alea(3, 12); } while ((a * b) % 2);
      const k = 70 / Math.max(a, b), x0 = 18, y0 = 85, X = r1(x0 + a * k), Y = r1(y0 - b * k);
      const d = polygone([[x0, y0], [X, y0], [x0, Y]], [], [0]) + texte(r1((x0 + X) / 2), y0 + 10, a + ' cm') + texte(x0 - 3, r1((y0 + Y) / 2), b + ' cm', 'end');
      const bon = a * b / 2;
      return qcm({ visuel: svg(d), enonce: 'Quelle est l\'aire de ce triangle rectangle ?', aide: 'Ce triangle est la moitié d\'un rectangle.' }, `${bon} cm²`, [a * b, a + b, bon + a, 2 * (a + b)].filter(x => x !== bon).map(x => `${x} cm²`));
    }
    if (t === 2) {
      const d = alea(2, 20), rayon = Math.random() < 0.4 && d % 2 === 0, bon = d * 314; // en centièmes
      const des = `<circle cx="50" cy="50" r="38" ${REMPLI}/><circle cx="50" cy="50" r="2" fill="currentColor"/>` + (rayon ? `<line x1="50" y1="50" x2="88" y2="50" stroke="${ROUGE}" stroke-width="2.5"/>${texte(69, 45, (d / 2) + ' cm', 'middle', 9, ROUGE)}` : `<line x1="12" y1="50" x2="88" y2="50" stroke="${ROUGE}" stroke-width="2.5"/>${texte(50, 45, d + ' cm', 'middle', 9, ROUGE)}`);
      return qcm({ visuel: svg(des), enonce: `${rayon ? 'Le rayon' : 'Le diamètre'} de ce cercle mesure ${rayon ? d / 2 : d} cm. Quel est son périmètre environ ? (Prends 3,14.)`, dire: `${rayon ? 'Le rayon' : 'Le diamètre'} de ce cercle mesure ${rayon ? d / 2 : d} centimètres. Quel est son périmètre environ ? Prends 3 virgule 14.`, aide: 'Périmètre du cercle ≈ 3,14 × diamètre.' }, `${nb(bon, 2)} cm`, [bon / 2, bon * 2, d * 300, d * 4 * 100].filter(x => Number.isInteger(x) && x !== bon).map(x => `${nb(x, 2)} cm`));
    }
    if (t === 3) {
      const a = alea(2, 5), b = alea(2, 4), c = alea(1, 4), v = a * b * c;
      return qcm({ visuel: svg(cubes(a, b, c), 190), enonce: 'Combien de petits cubes forment ce pavé ?', aide: 'Compte les cubes d\'un étage, puis multiplie par le nombre d\'étages.' }, v, [a * b + c, a * b * (c + 1), 2 * (a * b + b * c + a * c), a + b + c, v - a].filter(x => x > 0 && x !== v));
    }
    if (t === 4) {
      const c = alea(3, 15);
      if (Math.random() < 0.5) return qcm({ visuel: '⬜', enonce: `Un carré a un périmètre de ${4 * c} cm. Combien mesure son côté ?` }, `${c} cm`, [2 * c, 4 * c, c + 4, c * c].filter(x => x !== c).map(x => `${x} cm`));
      return qcm({ visuel: '⬜', enonce: `Quelle est l'aire d'un carré de ${c} m de côté ?` }, `${c * c} m²`, [4 * c, 2 * c, c * c + c].map(x => `${x} m²`).concat(`${c * c} m`));
    }
    if (t === 5) {
      const L = alea(7, 12), l = alea(5, L - 1), a = alea(2, Math.min(4, l - 2)), b = alea(2, Math.min(4, L - 3));
      const k = 70 / L, X = x => r1(15 + x * k), Y = y => r1(20 + y * k);
      const pts = [[X(0), Y(0)], [X(L - b), Y(0)], [X(L - b), Y(a)], [X(L), Y(a)], [X(L), Y(l)], [X(0), Y(l)]];
      const d = `<polygon points="${pts.map(p => p.join(',')).join(' ')}" ${REMPLI}/>` + texte(r1((X(0) + X(L)) / 2), Y(l) + 9, L + ' m') + texte(X(0) - 2, r1((Y(0) + Y(l)) / 2), l + ' m', 'end') + texte(r1((X(L - b) + X(L)) / 2), Y(a) - 3, b + ' m', 'middle', 7) + texte(X(L) + 2, r1((Y(0) + Y(a)) / 2 + 2), a + ' m', 'start', 7) + `<rect x="${X(L - b)}" y="${Y(0)}" width="${r1(b * k)}" height="${r1(a * k)}" fill="none" stroke="currentColor" stroke-dasharray="3 3" opacity=".5"/>`;
      const bon = L * l - a * b;
      return qcm({ visuel: svg(d), enonce: 'Un jardin a cette forme : un rectangle auquel on a enlevé un coin rectangulaire. Quelle est son aire ?', aide: 'Calcule l\'aire du grand rectangle, puis enlève celle du coin.' }, `${bon} m²`, [L * l, L * l + a * b, bon - a, 2 * (L + l)].filter(x => x !== bon).map(x => `${x} m²`));
    }
    const [q, b, f] = pioche([
      ['Un rectangle de 6 cm sur 4 cm et un carré de 5 cm de côté : lequel a le plus grand périmètre ?', 'Ils ont le même périmètre.', ['le rectangle', 'le carré', 'On ne peut pas savoir.']],
      ['Combien de carrés de 1 cm de côté faut-il pour recouvrir un carré de 4 cm de côté ?', '16', ['4', '8', '12']],
      ['Un rectangle de 8 cm sur 2 cm et un carré de 4 cm de côté : lequel a la plus grande aire ?', 'Ils ont la même aire.', ['le rectangle', 'le carré', 'On ne peut pas savoir.']],
      ['On double la longueur des côtés d\'un carré. Son périmètre…', 'double', ['reste le même', 'triple', 'est divisé par 2']],
      ['Deux figures ont la même aire. Ont-elles forcément le même périmètre ?', 'non', ['oui', 'seulement si ce sont des carrés', 'seulement si ce sont des triangles']],
      ['On coupe un rectangle en deux par sa diagonale. L\'aire de chaque triangle obtenu est…', 'la moitié de l\'aire du rectangle', ['le double de l\'aire du rectangle', 'la même que celle du rectangle', 'le quart de l\'aire du rectangle']]]);
    return qcm({ visuel: '📐', enonce: q }, b, f);
  };

  // Géométrie
  const TRIANGLES = {
    'un triangle rectangle': () => polygone([[20, 85], [88, 85], [20, 30]], [], [0]),
    'un triangle isocèle': () => polygone([[50, 12], [78, 85], [22, 85]], [1, 0, 1]),
    'un triangle équilatéral': () => polygone([[15, 80], [85, 80], [50, 19.4]], [1, 1, 1]),
    'un triangle quelconque': () => polygone([[12, 80], [90, 68], [38, 16]]),
    'un triangle rectangle isocèle': () => polygone([[20, 85], [80, 85], [20, 25]], [1, 0, 1], [0])
  };
  const EXCLUS_TRI = { 'un triangle équilatéral': ['un triangle isocèle'], 'un triangle rectangle isocèle': ['un triangle rectangle', 'un triangle isocèle'] };
  const regulier = (n, r = 38) => Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [r1(50 + r * Math.cos(a)), r1(52 + r * Math.sin(a))]; });
  const QUADRI = {
    'un carré': () => polygone([[25, 25], [75, 25], [75, 75], [25, 75]], [1, 1, 1, 1], [0, 1, 2, 3]),
    'un rectangle': () => polygone([[12, 30], [88, 30], [88, 70], [12, 70]], [1, 2, 1, 2], [0, 1, 2, 3]),
    'un losange': () => polygone([[50, 8], [80, 50], [50, 92], [20, 50]], [1, 1, 1, 1]),
    'un parallélogramme': () => polygone([[28, 30], [90, 30], [72, 70], [10, 70]], [1, 2, 1, 2]),
    'un trapèze': () => polygone([[32, 28], [70, 28], [90, 72], [10, 72]]),
    'un pentagone': () => polygone(regulier(5)),
    'un hexagone': () => polygone(regulier(6))
  };
  const EXCLUS_QUA = { 'un carré': ['un rectangle', 'un losange', 'un parallélogramme', 'un trapèze'], 'un rectangle': ['un parallélogramme', 'un trapèze'], 'un losange': ['un parallélogramme', 'un trapèze'], 'un parallélogramme': ['un trapèze'] };
  const nommer = (dessins, exclus, aide) => {
    const noms = Object.keys(dessins), nom = pioche(noms);
    return qcm({ visuel: svg(dessins[nom]()), enonce: 'Comment s\'appelle cette figure ?', aide }, nom, noms.filter(n => n !== nom && !(exclus[nom] || []).includes(n)));
  };
  // Un patron de 6 carrés se plie-t-il en cube ? On fait rouler un dé sur le patron.
  function estPatronDeCube(cases) {
    const cle = ([x, y]) => x + ',' + y, dans = new Set(cases.map(cle));
    const vus = new Map([[cle(cases[0]), { h: 'H', b: 'B', n: 'N', s: 'S', e: 'E', o: 'O' }]]), file = [cases[0]];
    while (file.length) {
      const [x, y] = file.shift(), d = vus.get(cle([x, y]));
      const voisins = [[[x + 1, y], { b: d.e, e: d.h, h: d.o, o: d.b, n: d.n, s: d.s }], [[x - 1, y], { b: d.o, o: d.h, h: d.e, e: d.b, n: d.n, s: d.s }],
        [[x, y + 1], { b: d.s, s: d.h, h: d.n, n: d.b, e: d.e, o: d.o }], [[x, y - 1], { b: d.n, n: d.h, h: d.s, s: d.b, e: d.e, o: d.o }]];
      voisins.forEach(([c, nd]) => { if (dans.has(cle(c)) && !vus.has(cle(c))) { vus.set(cle(c), nd); file.push(c); } });
    }
    return new Set([...vus.values()].map(d => d.b)).size === 6;
  }
  function hexamino() {
    const cases = [[0, 0]], cle = ([x, y]) => x + ',' + y;
    while (cases.length < 6) {
      const [x, y] = pioche(cases), [dx, dy] = pioche([[1, 0], [-1, 0], [0, 1], [0, -1]]), c = [x + dx, y + dy];
      if (!cases.some(k => cle(k) === cle(c))) cases.push(c);
    }
    const mx = Math.min(...cases.map(c => c[0])), my = Math.min(...cases.map(c => c[1]));
    return cases.map(([x, y]) => [x - mx, y - my]);
  }
  const genGeometrie = () => {
    const t = alea(0, 8);
    if (t === 0) return nommer(TRIANGLES, EXCLUS_TRI, 'Les petits traits rouges montrent les côtés de même longueur.');
    if (t === 1) return nommer(QUADRI, EXCLUS_QUA, 'Observe les angles droits et les côtés de même longueur (même codage).');
    if (t === 2) {
      const type = pioche(['droit', 'aigu', 'obtus']);
      const a = type === 'droit' ? 90 : type === 'aigu' ? alea(20, 70) : alea(110, 165);
      const rad = a * Math.PI / 180, x = r1(50 + 42 * Math.cos(rad)), y = r1(80 - 42 * Math.sin(rad));
      let d = `<line x1="50" y1="80" x2="94" y2="80" ${TRAIT}/><line x1="50" y1="80" x2="${x}" y2="${y}" ${TRAIT}/><circle cx="50" cy="80" r="2" fill="currentColor"/>`;
      if (Math.random() < 0.5) d = `<g transform="translate(100,0) scale(-1,1)">${d}</g>`;
      return qcm({ visuel: svg(d), enonce: 'Cet angle est…', aide: 'Compare-le à un angle droit.' }, `un angle ${type}`, ['un angle droit', 'un angle aigu', 'un angle obtus']);
    }
    if (t === 3) {
      const vertical = Math.random() < 0.5, N = 10, c = 8, o = 10;
      const P = (i, j) => vertical ? [o + i * c, o + j * c] : [o + j * c, o + i * c]; // i : côté de l'axe
      let d = '';
      for (let k = 0; k <= N; k++) d += `<line x1="${o + k * c}" y1="${o}" x2="${o + k * c}" y2="${o + N * c}" stroke="currentColor" stroke-width=".4" opacity=".5"/><line x1="${o}" y1="${o + k * c}" x2="${o + N * c}" y2="${o + k * c}" stroke="currentColor" stroke-width=".4" opacity=".5"/>`;
      d += vertical ? pointilles(50, 4, 50, 96) : pointilles(4, 50, 96, 50);
      const i = alea(1, 4), j = alea(1, 9), sym = [10 - i, j];
      const cand = melange([[i + 5, j], [10 - i, j + 2], [10 - i, j - 2], [11 - i, j], [9 - i, j + 1], [10 - i + 1, j - 1]])
        .filter(([x, y]) => x > 5 && x <= 10 && y >= 0 && y <= 10 && !(x === sym[0] && y === sym[1]));
      const pts = [sym, ...cand.filter((p, k) => cand.findIndex(q => q[0] === p[0] && q[1] === p[1]) === k).slice(0, 3)];
      const lettresP = melange(['B', 'C', 'D', 'E']).slice(0, pts.length);
      const [ax, ay] = P(i, j);
      d += `<circle cx="${ax}" cy="${ay}" r="2.8" fill="${BLEU}"/>${texte(ax - 4, ay - 3, 'A', 'end', 8, BLEU)}`;
      pts.forEach((p, k) => { const [x, y] = P(p[0], p[1]); d += `<circle cx="${x}" cy="${y}" r="2.3" fill="currentColor"/>${texte(x + 3.5, y - 3, lettresP[k], 'start', 8)}`; });
      return { visuel: svg(d, 200), enonce: 'Quel point est le symétrique de A par rapport à la droite rouge ?', aide: 'Le symétrique est à la même distance de l\'axe, de l\'autre côté, sur la même ligne perpendiculaire à l\'axe.', choix: [...lettresP].sort(), bonne: lettresP[0] };
    }
    if (t === 4) {
      const voulu = Math.random() < 0.5;
      let cases, essais = 0;
      do { cases = hexamino(); } while (estPatronDeCube(cases) !== voulu && essais++ < 300);
      const w = Math.max(...cases.map(c => c[0])) + 1, h = Math.max(...cases.map(c => c[1])) + 1, s = Math.min(16, 84 / Math.max(w, h));
      const ox = r1((100 - w * s) / 2), oy = r1((100 - h * s) / 2);
      const d = cases.map(([x, y]) => `<rect x="${r1(ox + x * s)}" y="${r1(oy + y * s)}" width="${r1(s)}" height="${r1(s)}" ${REMPLI}/>`).join('');
      return { visuel: svg(d), enonce: 'Avec ce patron, peut-on fabriquer un cube en pliant ?', aide: 'Imagine que tu plies : deux carrés ne doivent jamais se retrouver l\'un sur l\'autre.', choix: ['oui', 'non'], bonne: estPatronDeCube(cases) ? 'oui' : 'non' };
    }
    if (t === 5) {
      const [q, b, f] = pioche([
        ['Combien de faces a un cube ?', '6', ['4', '8', '12']], ['Combien d\'arêtes a un cube ?', '12', ['6', '8', '4']], ['Combien de sommets a un cube ?', '8', ['6', '12', '4']],
        ['Quelle est la forme des faces d\'un cube ?', 'des carrés', ['des rectangles non carrés', 'des triangles', 'des disques']],
        ['Combien de faces a un pavé droit ?', '6', ['4', '8', '12']], ['Combien d\'arêtes a un pavé droit ?', '12', ['6', '8', '10']],
        ['Combien de faces a une pyramide à base carrée ?', '5', ['4', '6', '8']], ['Combien de sommets a une pyramide à base carrée ?', '5', ['4', '6', '8']],
        ['Combien d\'arêtes a une pyramide à base carrée ?', '8', ['5', '6', '12']], ['Combien de faces a un prisme droit à base triangulaire ?', '5', ['3', '6', '9']],
        ['Combien d\'arêtes a un prisme droit à base triangulaire ?', '9', ['6', '5', '12']],
        ['Un dé à jouer a la forme…', 'd\'un cube', ['d\'une pyramide', 'd\'un cylindre', 'd\'une boule']],
        ['Une boîte à chaussures a la forme…', 'd\'un pavé droit', ['d\'un cube', 'd\'un cône', 'd\'une pyramide']],
        ['Une canette de boisson a la forme…', 'd\'un cylindre', ['d\'un cône', 'd\'un pavé droit', 'd\'une pyramide']],
        ['Un cornet de glace a la forme…', 'd\'un cône', ['d\'un cylindre', 'd\'un cube', 'd\'un prisme']],
        ['Quel solide n\'a aucune face plane ?', 'la boule', ['le cube', 'le cylindre', 'le cône']],
        ['Combien de côtés a un hexagone ?', '6', ['5', '7', '8']], ['Combien de côtés a un octogone ?', '8', ['6', '10', '12']],
        ['Un polygone à 5 côtés s\'appelle…', 'un pentagone', ['un hexagone', 'un octogone', 'un quadrilatère']]]);
      return qcm({ visuel: '🧊', enonce: q }, b, f);
    }
    if (t === 6) {
      const [q, b, f] = pioche([
        ['Les côtés opposés d\'un parallélogramme sont…', 'parallèles et de même longueur', ['perpendiculaires', 'tous de même longueur', 'de longueurs différentes']],
        ['Un carré est aussi…', 'un rectangle et un losange', ['un triangle', 'un pentagone', 'un cercle']],
        ['Deux droites perpendiculaires forment…', '4 angles droits', ['2 angles aigus', 'aucun angle', '1 angle obtus']],
        ['Combien d\'angles droits a un rectangle ?', '4', ['2', '1', '0']],
        ['Tous les points d\'un cercle sont à la même distance…', 'du centre', ['du diamètre', 'du bord de la feuille', 'du rayon']],
        ['Combien de diagonales a un quadrilatère ?', '2', ['1', '4', '0']],
        ['Combien d\'axes de symétrie a un carré ?', '4', ['2', '1', '0']],
        ['Combien d\'axes de symétrie a un rectangle qui n\'est pas un carré ?', '2', ['4', '1', '0']],
        ['Combien d\'axes de symétrie a un triangle équilatéral ?', '3', ['1', '2', '0']],
        ['Combien d\'axes de symétrie a un triangle isocèle qui n\'est pas équilatéral ?', '1', ['2', '3', '0']],
        ['Combien d\'axes de symétrie a un cercle ?', 'une infinité', ['1', '2', '4']],
        ['Un losange a…', '4 côtés de même longueur', ['4 angles droits', '3 côtés', '2 côtés seulement de même longueur']],
        ['Les diagonales d\'un losange sont…', 'perpendiculaires', ['parallèles', 'toujours de même longueur', 'courbes']]]);
      return qcm({ visuel: '📐', enonce: q }, b, f);
    }
    if (t === 7) {
      const type = pioche(['parallèles', 'perpendiculaires', 'ni parallèles ni perpendiculaires']);
      const a = pioche([0, 20, 35, 60, 90, 110, 145]) * Math.PI / 180;
      const ligne = (cx, cy, ang) => `<line x1="${r1(cx - 45 * Math.cos(ang))}" y1="${r1(cy - 45 * Math.sin(ang))}" x2="${r1(cx + 45 * Math.cos(ang))}" y2="${r1(cy + 45 * Math.sin(ang))}" ${TRAIT}/>`;
      let d;
      if (type === 'parallèles') { const ox = -Math.sin(a) * 15, oy = Math.cos(a) * 15; d = ligne(50 + ox, 50 + oy, a) + ligne(50 - ox, 50 - oy, a); }
      else if (type === 'perpendiculaires') { const b = a + Math.PI / 2; d = ligne(50, 50, a) + ligne(50, 50, b) + angleDroit([50, 50], [50 + Math.cos(a) * 10, 50 + Math.sin(a) * 10], [50 + Math.cos(b) * 10, 50 + Math.sin(b) * 10]); }
      else { const b = a + pioche([40, 55, 130]) * Math.PI / 180; d = ligne(50, 50, a) + ligne(50, 50, b); }
      return qcm({ visuel: svg(d), enonce: 'Ces deux droites sont…', aide: 'Le petit carré rouge code un angle droit.' }, type, ['parallèles', 'perpendiculaires', 'ni parallèles ni perpendiculaires']);
    }
    const r = alea(3, 19) * 5; // rayon en dixièmes de cm
    if (Math.random() < 0.5) return qcm({ visuel: '⭕', enonce: `Le rayon d'un cercle mesure ${nb(r, 1)} cm. Combien mesure son diamètre ?` }, `${nb(2 * r, 1)} cm`, [r / 2, 4 * r, r + 10, r * 3].filter(Number.isInteger).map(x => `${nb(x, 1)} cm`));
    return qcm({ visuel: '⭕', enonce: `Le diamètre d'un cercle mesure ${nb(2 * r, 1)} cm. Combien mesure son rayon ?` }, `${nb(r, 1)} cm`, [2 * r, 4 * r, r + 10, r - 5].filter(x => x > 0).map(x => `${nb(x, 1)} cm`));
  };

  // Problèmes à plusieurs étapes
  const genProblemes = () => {
    const t = alea(0, 7);
    if (t === 0) {
      const n = alea(2, 5), p = alea(12, 45) * 10, s = alea(80, 350) * 5, billet = pioche([1000, 2000, 5000].filter(b => b > n * p + s));
      const [obj, obj2] = pioche([['cahiers', 'un stylo'], ['paquets de gâteaux', 'une bouteille d\'eau'], ['magazines', 'un livre'], ['classeurs', 'une trousse']]);
      const bon = billet - n * p - s;
      return qcm({ visuel: '🛒', enonce: `Léa achète ${n} ${obj} à ${euros(p)} l'un et ${obj2} à ${euros(s)}. Elle paie avec un billet de ${billet / 100} €. Combien lui rend-on ?` }, euros(bon), [billet - p - s, n * p + s, bon + 100, bon - 50, billet - n * (p + s)].filter(x => x > 0 && x !== bon).map(euros));
    }
    if (t === 1) {
      const r = alea(10, 25), pl = alea(12, 30), tot = r * pl, occ = alea(Math.floor(tot / 3), tot - 10), bon = tot - occ;
      return qcm({ visuel: '🎭', enonce: `Une salle de spectacle a ${r} rangées de ${pl} places. ${occ} places sont occupées. Combien de places sont libres ?` }, bon, [tot, r + pl - occ, bon + pl, bon - r, occ - r].filter(x => x > 0 && x !== bon));
    }
    if (t === 2) {
      const b = pioche([6, 10, 12]), nbB = alea(15, 60), prix = pioche([2, 3, 4, 5]), oeufs = b * nbB, bon = nbB * prix;
      return qcm({ visuel: '🥚', enonce: `Un fermier ramasse ${oeufs} œufs. Il les range dans des boîtes de ${b}, puis vend chaque boîte ${prix} €. Combien gagne-t-il s'il vend toutes les boîtes ?` }, `${bon} €`, [oeufs * prix, nbB, bon + prix, oeufs / prix, bon - prix].filter(x => Number.isInteger(x) && x > 0 && x !== bon).map(x => `${sp(x)} €`));
    }
    if (t === 3) {
      const k = pioche([2, 3, 4]), petit = alea(8, 40), tot = petit * (k + 1);
      const [a, b, quoi] = pioche([['Tom', 'Léo', 'billes'], ['Inès', 'Sarah', 'images'], ['Hugo', 'Nina', 'timbres'], ['Emma', 'Yanis', 'coquillages']]);
      return qcm({ visuel: '🔵', enonce: `${a} a ${k} fois plus de ${quoi} que ${b}. À eux deux, ils ont ${tot} ${quoi}. Combien de ${quoi} ${b} a-t-il ?`.replace('a-t-il', /^(Sarah|Nina)$/.test(b) ? 'a-t-elle' : 'a-t-il'), aide: `Fais un schéma : ${b} = 1 part, ${a} = ${k} parts.` }, petit, [tot / 2, petit * k, tot / k, tot - petit, petit + k].filter(x => Number.isInteger(x) && x !== petit));
    }
    if (t === 4) {
      const d = alea(15, 60), m = alea(5, 25), mo = alea(5, 25), d2 = alea(3, 20), m2 = alea(3, 20), bon = d - m + mo - d2 + m2;
      if (bon < 1 || d - m < 1) return genProblemes();
      return qcm({ visuel: '🚌', enonce: `Un bus part avec ${d} passagers. Au 1er arrêt, ${m} descendent et ${mo} montent. Au 2e arrêt, ${d2} descendent et ${m2} montent. Combien y a-t-il de passagers maintenant ?` }, bon, [d + m + mo + d2 + m2, d - m - mo - d2 - m2, bon + 2, bon - 1, d + mo + m2].filter(x => x > 0 && x !== bon));
    }
    if (t === 5) {
      const d = pioche([3, 4, 5]), k = alea(1, d - 1), n = d * alea(5, 9);
      const [grp, act, v] = pioche([['Une classe de', 'mangent à la cantine', '🍽️'], ['Un club de', 'viennent à vélo', '🚲'], ['Un groupe de', 'savent nager', '🏊']]);
      const oui = n * k / d, bon = n - oui;
      return qcm({ visuel: v, enonce: `${grp} ${n} enfants : les ${k}/${d} ${act}. Combien d'enfants ne le font pas ?`, dire: `${grp} ${n} enfants : les ${k} sur ${d} ${act}. Combien d'enfants ne le font pas ?` }, bon, [oui, n / d, n - k, bon + 1].filter(x => Number.isInteger(x) && x !== bon));
    }
    if (t === 6) {
      const matin = alea(15, 60) * 100, k = pioche([2, 3]), bon = matin * (k + 1); // en mètres
      return qcm({ visuel: '🥾', enonce: `Une randonneuse marche ${mil(matin)} km le matin, et ${k} fois plus l'après-midi. Quelle distance parcourt-elle dans la journée ?` }, `${mil(bon)} km`, [matin * k, matin + k * 1000, matin * (k + 2), bon + 1000].filter(x => x !== bon).map(x => `${mil(x)} km`));
    }
    const prix = alea(4, 12), n = alea(20, 30), accomp = alea(2, 4), bus = alea(15, 30) * 10, bon = (n + accomp) * prix + bus;
    return qcm({ visuel: '🏛️', enonce: `Une classe de ${n} élèves visite un musée avec ${accomp} adultes. L'entrée coûte ${prix} € par personne et le car coûte ${bus} €. Quel est le prix total de la sortie ?` }, `${sp(bon)} €`, [n * prix + bus, (n + accomp) * prix, (n + accomp) * (prix + bus), bon + prix, n * prix + accomp + bus].filter(x => x !== bon).map(x => `${sp(x)} €`));
  };

  ajouterMatiere('CM2', {
    id: 'maths', titre: 'Maths', emoji: '🔢', couleur: '#4f8ef7', jeux: [
      { id: 'grands-nombres', titre: 'Grands nombres', emoji: '🔭', gen: avecDire(genGrandsNombres) },
      { id: 'decimaux', titre: 'Nombres décimaux', emoji: '🔟', gen: avecDire(genDecimaux) },
      { id: 'fractions', titre: 'Fractions', emoji: '🍕', gen: avecDire(genFractions) },
      { id: 'calculs-decimaux', titre: 'Calculer avec les décimaux', emoji: '🧮', gen: avecDire(genCalculsDecimaux) },
      { id: 'divisions', titre: 'Divisions', emoji: '➗', gen: avecDire(genDivisions) },
      { id: 'divisibilite', titre: 'Multiples et diviseurs', emoji: '🧩', gen: avecDire(genDivisibilite) },
      { id: 'proportionnalite', titre: 'Proportionnalité', emoji: '📊', gen: avecDire(genProportionnalite) },
      { id: 'mesures', titre: 'Conversions', emoji: '📏', gen: avecDire(genMesures) },
      { id: 'durees', titre: 'Durées et horaires', emoji: '⏰', gen: avecDire(genDurees) },
      { id: 'perimetre-aire', titre: 'Périmètre, aire, volume', emoji: '⬛', gen: avecDire(genPerimetreAire) },
      { id: 'geometrie', titre: 'Géométrie', emoji: '📐', gen: avecDire(genGeometrie) },
      { id: 'problemes', titre: 'Problèmes', emoji: '🧠', gen: avecDire(genProblemes) }
    ]
  });

  /* ======================= FRANÇAIS ======================= */
  // Conjugaison : pres, imp (radical), fut (radical), ps, pp, aux, imper (tu, nous, vous)
  const er = rad => ({ pres: ['e', 'es', 'e', 'ons', 'ez', 'ent'].map(x => rad + x), imp: rad, fut: rad + 'er', ps: ['ai', 'as', 'a', 'âmes', 'âtes', 'èrent'].map(x => rad + x), pp: rad + 'é', imper: [rad + 'e', rad + 'ons', rad + 'ez'] });
  const ir2 = rad => ({ pres: ['is', 'is', 'it', 'issons', 'issez', 'issent'].map(x => rad + x), imp: rad + 'iss', fut: rad + 'ir', ps: ['is', 'is', 'it', 'îmes', 'îtes', 'irent'].map(x => rad + x), pp: rad + 'i', imper: [rad + 'is', rad + 'issons', rad + 'issez'] });
  const CONJ = {
    chanter: er('chant'), parler: er('parl'), jouer: er('jou'), regarder: er('regard'), écouter: er('écout'), danser: er('dans'), marcher: er('march'),
    arriver: { ...er('arriv'), aux: 'être' }, tomber: { ...er('tomb'), aux: 'être' }, rester: { ...er('rest'), aux: 'être' },
    finir: ir2('fin'), choisir: ir2('chois'), grandir: ir2('grand'), réussir: ir2('réuss'),
    être: { pres: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'], imp: 'ét', fut: 'ser', ps: ['fus', 'fus', 'fut', 'fûmes', 'fûtes', 'furent'], pp: 'été', imper: ['sois', 'soyons', 'soyez'] },
    avoir: { pres: ['ai', 'as', 'a', 'avons', 'avez', 'ont'], imp: 'av', fut: 'aur', ps: ['eus', 'eus', 'eut', 'eûmes', 'eûtes', 'eurent'], pp: 'eu', imper: ['aie', 'ayons', 'ayez'] },
    aller: { pres: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'], imp: 'all', fut: 'ir', ps: ['allai', 'allas', 'alla', 'allâmes', 'allâtes', 'allèrent'], pp: 'allé', aux: 'être', imper: ['va', 'allons', 'allez'] },
    faire: { pres: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'], imp: 'fais', fut: 'fer', ps: ['fis', 'fis', 'fit', 'fîmes', 'fîtes', 'firent'], pp: 'fait', imper: ['fais', 'faisons', 'faites'] },
    venir: { pres: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'], imp: 'ven', fut: 'viendr', ps: ['vins', 'vins', 'vint', 'vînmes', 'vîntes', 'vinrent'], pp: 'venu', aux: 'être', imper: ['viens', 'venons', 'venez'] },
    prendre: { pres: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'], imp: 'pren', fut: 'prendr', ps: ['pris', 'pris', 'prit', 'prîmes', 'prîtes', 'prirent'], pp: 'pris', imper: ['prends', 'prenons', 'prenez'] },
    dire: { pres: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'], imp: 'dis', fut: 'dir', ps: ['dis', 'dis', 'dit', 'dîmes', 'dîtes', 'dirent'], pp: 'dit', imper: ['dis', 'disons', 'dites'] },
    pouvoir: { pres: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'], imp: 'pouv', fut: 'pourr', ps: ['pus', 'pus', 'put', 'pûmes', 'pûtes', 'purent'], pp: 'pu' },
    voir: { pres: ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'], imp: 'voy', fut: 'verr', ps: ['vis', 'vis', 'vit', 'vîmes', 'vîtes', 'virent'], pp: 'vu', imper: ['vois', 'voyons', 'voyez'] },
    vouloir: { pres: ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'], imp: 'voul', fut: 'voudr', ps: ['voulus', 'voulus', 'voulut', 'voulûmes', 'voulûtes', 'voulurent'], pp: 'voulu' },
    partir: { pres: ['pars', 'pars', 'part', 'partons', 'partez', 'partent'], imp: 'part', fut: 'partir', ps: ['partis', 'partis', 'partit', 'partîmes', 'partîtes', 'partirent'], pp: 'parti', aux: 'être', imper: ['pars', 'partons', 'partez'] },
    mettre: { pres: ['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent'], imp: 'mett', fut: 'mettr', ps: ['mis', 'mis', 'mit', 'mîmes', 'mîtes', 'mirent'], pp: 'mis', imper: ['mets', 'mettons', 'mettez'] },
    lire: { pres: ['lis', 'lis', 'lit', 'lisons', 'lisez', 'lisent'], imp: 'lis', fut: 'lir', ps: ['lus', 'lus', 'lut', 'lûmes', 'lûtes', 'lurent'], pp: 'lu', imper: ['lis', 'lisons', 'lisez'] },
    écrire: { pres: ['écris', 'écris', 'écrit', 'écrivons', 'écrivez', 'écrivent'], imp: 'écriv', fut: 'écrir', ps: ['écrivis', 'écrivis', 'écrivit', 'écrivîmes', 'écrivîtes', 'écrivirent'], pp: 'écrit', imper: ['écris', 'écrivons', 'écrivez'] }
  };
  const PRON = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
  const T_IMP = ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'], T_FUT = ['ai', 'as', 'a', 'ons', 'ez', 'ont'];
  const NOMS_T = { present: 'présent', imparfait: 'imparfait', futur: 'futur', pc: 'passé composé', ps: 'passé simple', pqp: 'plus-que-parfait', cond: 'conditionnel présent' };
  // Forme conjuguée (sans pronom). Avec l'auxiliaire être, participe au masculin (+ s au pluriel).
  function conj(v, t, p) {
    const c = CONJ[v];
    if (t === 'present') return c.pres[p];
    if (t === 'imparfait') return c.imp + T_IMP[p];
    if (t === 'futur') return c.fut + T_FUT[p];
    if (t === 'cond') return c.fut + T_IMP[p];
    if (t === 'ps') return c.ps[p];
    const etre = c.aux === 'être', pp = c.pp + (etre && p >= 3 ? 's' : '');
    if (t === 'pc') return (etre ? CONJ.être.pres[p] : CONJ.avoir.pres[p]) + ' ' + pp;
    if (t === 'pqp') return (etre ? 'ét' : 'av') + T_IMP[p] + ' ' + pp;
  }
  const pron = (p, f) => p === 0 && /^[aeiouéèêâh]/.test(f) ? 'j\'' + f : PRON[p] + ' ' + f;
  // Les temps qui donnent exactement cette forme (pour éviter les questions ambiguës : « il finit »…)
  const tempsDe = (v, f, p, liste) => liste.filter(t => conj(v, t, p) === f);
  function questionConj(temps, visuel, verbes = Object.keys(CONJ), personnes = [0, 1, 2, 3, 4, 5]) {
    const v = pioche(verbes), t = pioche(temps), p = pioche(personnes);
    const bon = pron(p, conj(v, t, p));
    const f = [];
    ['present', 'imparfait', 'futur', 'pc', 'ps', 'cond', 'pqp'].forEach(t2 => { if (t2 !== t && conj(v, t2, p) !== conj(v, t, p)) f.push(pron(p, conj(v, t2, p))); });
    [0, 1, 2, 3, 4, 5].forEach(p2 => { const x = conj(v, t, p2); if (x !== conj(v, t, p)) f.push(pron(p, x)); });
    const proches = f.filter(x => temps.some(t2 => x === pron(p, conj(v, t2, p))) || x.split(' ').length === bon.split(' ').length);
    const auT = t => /^[aeiouéè]/.test(NOMS_T[t]) ? `à l'${NOMS_T[t]}` : `au ${NOMS_T[t]}`;
    return qcm({ visuel, enonce: `Conjugue « ${v} » ${auT(t)}, avec « ${PRON[p]} ».`, dire: `Conjugue le verbe ${v} ${auT(t)}, avec ${PRON[p]}.` }, bon, [...melange(proches), ...melange(f)].slice(0, 6));
  }
  function questionTemps(choixTemps, visuel, personnes = [0, 1, 2, 3, 4, 5]) {
    for (let essai = 0; essai < 50; essai++) {
      const v = pioche(Object.keys(CONJ)), t = pioche(choixTemps), p = pioche(personnes), f = conj(v, t, p);
      if (tempsDe(v, f, p, ['present', 'imparfait', 'futur', 'pc', 'ps', 'cond', 'pqp']).length !== 1) continue;
      return qcm({ visuel, enonce: `À quel temps est conjugué le verbe : « ${pron(p, f)} » ?` }, NOMS_T[t], choixTemps.map(x => NOMS_T[x]));
    }
    return questionConj(choixTemps, visuel);
  }
  const PHRASES_TEMPS = [
    ['Demain, nous … (partir) en classe de mer.', 'partirons', ['partions', 'sommes partis', 'partîmes']],
    ['Autrefois, les enfants … (aller) à l\'école à pied.', 'allaient', ['iront', 'vont', 'iraient']],
    ['L\'année prochaine, tu … (être) au collège.', 'seras', ['étais', 'as été', 'fus']],
    ['Quand elle était petite, elle … (avoir) un chien.', 'avait', ['aura', 'aurait', 'ont']],
    ['Hier, elles … (faire) une longue promenade.', 'ont fait', ['font', 'feront', 'faisons']],
    ['Regarde ! Le chat … (dormir) sur le canapé.', 'dort', ['dormira', 'dormait', 'dormit']],
    ['Dans dix ans, vous … (pouvoir) conduire une voiture.', 'pourrez', ['pouviez', 'avez pu', 'pûtes']],
    ['La semaine dernière, nous … (voir) un spectacle.', 'avons vu', ['voyons', 'verrons', 'avons voir']],
    ['En ce moment, les élèves … (lire) un roman.', 'lisent', ['liront', 'ont lu', 'lurent']],
    ['Au Moyen Âge, les seigneurs … (vivre) dans des châteaux forts.', 'vivaient', ['vivront', 'vivent', 'vivraient']],
    ['Il y a deux jours, tu … (prendre) le train.', 'as pris', ['prends', 'prendras', 'prendrais']],
    ['L\'été prochain, ils … (visiter) Rome.', 'visiteront', ['visitaient', 'ont visité', 'visitèrent']],
    ['Maintenant, je … (savoir) nager.', 'sais', ['saurai', 'savais', 'ai su']],
    ['Plus tard, vous … (devenir) de grands sportifs.', 'deviendrez', ['devenez', 'deveniez', 'êtes devenus']]
  ];
  const tirePhraseTemps = tirage(PHRASES_TEMPS);
  const genConjugaison = () => {
    const t = alea(0, 6);
    if (t <= 3) return questionConj(['present', 'imparfait', 'futur', 'pc'], '⏳');
    if (t <= 5) return questionTemps(['present', 'imparfait', 'futur', 'pc'], '🔎');
    const [p, b, f] = tirePhraseTemps();
    return qcm({ visuel: '✍️', enonce: `Complète avec le verbe au bon temps :<br>${phrase(p)}`, dire: 'Complète avec le verbe au bon temps : ' + p.replace('…', ' blanc ').replace(/\((\S+)\)/, ', verbe $1,'), aide: 'Cherche les mots qui indiquent le moment : hier, demain, autrefois…' }, b, f);
  };

  const genPasseSimple = () => {
    const t = alea(0, 5);
    if (t <= 2) return questionConj(['ps'], '📜', Object.keys(CONJ), [2, 5]);
    if (t === 3) return questionConj(['pqp'], '⏮️');
    if (t === 4) return questionTemps(['ps', 'imparfait', 'pqp', 'pc'], '🔎', [2, 5]);
    const [debut, v, p] = pioche([['Soudain, le loup', 'sortir', 2], ['Le roi', 'prendre', 2], ['Les chevaliers', 'partir', 5], ['À cet instant, la fée', 'apparaître', 2], ['Les enfants', 'courir', 5], ['Le prince', 'voir', 2], ['Les soldats', 'faire', 5], ['Alors, la sorcière', 'dire', 2], ['Les oiseaux', 's\'envoler', 5], ['Le géant', 'avoir', 2], ['Ils', 'venir', 5], ['Elle', 'être', 2]]);
    const PS_SUP = { sortir: ['sortit', 'sortirent'], apparaître: ['apparut', 'apparurent'], courir: ['courut', 'coururent'], 's\'envoler': ['s\'envola', 's\'envolèrent'] };
    const FAUX_SUP = {
      sortir: [['sortait', 'sorta', 'sortut'], ['sortaient', 'sortèrent', 'sortiront']], apparaître: [['apparaissait', 'apparaîtit', 'apparit'], ['apparaissaient', 'apparaîtirent', 'apparirent']],
      courir: [['courait', 'courit', 'coura'], ['couraient', 'courirent', 'courèrent']], 's\'envoler': [['s\'envolait', 's\'envolit', 's\'envolut'], ['s\'envolaient', 's\'envolirent', 's\'envolurent']]
    };
    const forme = PS_SUP[v] ? PS_SUP[v][p === 2 ? 0 : 1] : conj(v, 'ps', p);
    const faux2 = FAUX_SUP[v] ? FAUX_SUP[v][p === 2 ? 0 : 1] : [conj(v, 'imparfait', p), conj(v, 'present', p), p === 2 ? conj(v, 'ps', 5) : conj(v, 'ps', 2), conj(v, 'futur', p)];
    return qcm({ visuel: '📖', enonce: `Complète au passé simple :<br>${phrase(`${debut} … (${v})`)}`, dire: `Complète au passé simple : ${debut}… verbe ${v}.` }, forme, faux2.filter(x => x !== forme));
  };

  const genCondImper = () => {
    const t = alea(0, 5);
    if (t <= 1) return questionConj(['cond'], '💭');
    if (t === 2) return questionTemps(['cond', 'futur', 'imparfait'], '🔎', [0, 1]);
    if (t === 3) {
      const [si, v, p, fin] = pioche([['Si j\'avais des ailes,', 'voler', 0, 'jusqu\'aux nuages.'], ['Si tu étais riche,', 'acheter', 1, 'un château.'], ['Si nous avions le temps,', 'aller', 3, 'à la mer.'], ['Si elle le pouvait,', 'venir', 2, 'avec nous.'], ['Si vous gagniez,', 'être', 4, 'très contents.'], ['S\'ils le savaient,', 'dire', 5, 'la vérité.'], ['Si j\'étais magicien,', 'faire', 0, 'disparaître la pluie.'], ['Si nous étions en vacances,', 'partir', 3, 'en voyage.']]);
      const c = v === 'voler' ? er('vol') : v === 'acheter' ? { ...er('achet'), fut: 'achèter', pres: ['achète', 'achètes', 'achète', 'achetons', 'achetez', 'achètent'] } : CONJ[v];
      const bonF = c.fut + T_IMP[p], fut = c.fut + T_FUT[p], imp = c.imp + T_IMP[p];
      const aff = x => pron(p, x);
      return qcm({ visuel: '💭', enonce: `Complète avec le conditionnel présent :<br>${phrase(`${si} … (${v}) ${fin}`)}`, dire: `Complète avec le conditionnel présent : ${si} … verbe ${v}, ${fin}`, aide: 'Conditionnel = radical du futur + terminaisons de l\'imparfait.' }, aff(bonF), [aff(fut), aff(imp), aff(c.pres[p])]);
    }
    const imp = Object.keys(CONJ).filter(v => CONJ[v].imper), v = pioche(imp), i = alea(0, 2), nom = ['2e personne du singulier (tu)', '1re personne du pluriel (nous)', '2e personne du pluriel (vous)'][i];
    const bon = CONJ[v].imper[i], p = [1, 3, 4][i];
    const f = [CONJ[v].pres[p], CONJ[v].imper[(i + 1) % 3], CONJ[v].imper[(i + 2) % 3], conj(v, 'futur', p), i === 0 && !/s$/.test(bon) ? bon + 's' : conj(v, 'imparfait', p)];
    return qcm({ visuel: '📢', enonce: `Conjugue « ${v} » à l'impératif présent, ${nom}.`, aide: 'À l\'impératif, il n\'y a pas de sujet. Les verbes en -er ne prennent pas de s à la 2e personne du singulier.' }, bon, f.filter(x => x !== bon));
  };

  // Accords : [phrase avec ___ (mot de base), bonne, fausses]
  const ACCORDS = [
    ['Au fond du jardin ___ de vieux arbres. (pousser)', 'poussent', ['pousse', 'pousses']],
    ['Les enfants de ma voisine ___ au football. (jouer)', 'jouent', ['joue', 'jouez']],
    ['Le bruit des vagues ___ les promeneurs. (bercer)', 'berce', ['bercent', 'berces']],
    ['Toi et moi ___ les meilleurs amis du monde. (être)', 'sommes', ['sont', 'êtes']],
    ['Ta sœur et toi ___ en retard. (être)', 'êtes', ['sont', 'est']],
    ['Ces bonbons, les enfants les ___ en cachette. (manger)', 'mangent', ['mange', 'manges']],
    ['Chaque matin, le facteur nous ___ le courrier. (apporter)', 'apporte', ['apportons', 'apportent']],
    ['Que ___ ces enfants dans le grenier ? (faire)', 'font', ['fait', 'fais']],
    ['Le chat de mes voisins ___ sur le mur. (dormir)', 'dort', ['dorment', 'dors']],
    ['Mes parents leur ___ une carte postale. (écrire)', 'écrivent', ['écrit', 'écrivons']],
    ['Mes cousines sont ___ hier soir. (arriver)', 'arrivées', ['arrivés', 'arrivé', 'arrivée']],
    ['La fusée est ___ ce matin. (partir)', 'partie', ['parti', 'partis', 'parties']],
    ['Les feuilles sont ___ de l\'arbre. (tomber)', 'tombées', ['tombés', 'tombé', 'tombée']],
    ['Nos voisins sont ___ en Italie. (aller)', 'allés', ['allé', 'allées', 'aller']],
    ['Ma grand-mère est ___ en 1950. (naître)', 'née', ['né', 'nés', 'nées']],
    ['Les garçons sont ___ à l\'heure. (venir)', 'venus', ['venu', 'venues', 'venue']],
    ['Les filles ont ___ une chanson. (chanter)', 'chanté', ['chantées', 'chantés', 'chanter']],
    ['Elle a ___ ses devoirs avant le dîner. (finir)', 'fini', ['finie', 'finis', 'finit']],
    ['Nous avons ___ nos amis au parc. (retrouver)', 'retrouvé', ['retrouvés', 'retrouver', 'retrouvez']],
    ['Les hirondelles ont ___ vers l\'Afrique. (voler)', 'volé', ['volées', 'voler', 'volés']],
    ['Marie a ___ une lettre à son oncle. (écrire)', 'écrit', ['écrite', 'écris', 'écrits']],
    ['Des chemises ___ sèchent au soleil. (blanc)', 'blanches', ['blancs', 'blanche', 'blanc']],
    ['Il a toujours des idées ___. (génial)', 'géniales', ['géniaux', 'génials', 'géniale']],
    ['Les journaux ___ parlent de cette fête. (national)', 'nationaux', ['nationals', 'nationales', 'national']],
    ['C\'est une ___ amie de ma mère. (vieux)', 'vieille', ['vieux', 'vieil', 'vieilles']],
    ['Quel ___ arbre ! (beau)', 'bel', ['beau', 'belle', 'beaux']],
    ['Mes tantes sont très ___. (gentil)', 'gentilles', ['gentiles', 'gentils', 'gentille']],
    ['Ils ont acheté deux voitures ___. (neuf)', 'neuves', ['neufs', 'neuve', 'neuf']],
    ['Une robe et une jupe ___ sont dans l\'armoire. (bleu)', 'bleues', ['bleus', 'bleue', 'bleu']],
    ['Il porte un pantalon et une veste ___. (noir)', 'noirs', ['noires', 'noir', 'noire']],
    ['Le dimanche, les rues sont ___. (désert)', 'désertes', ['déserts', 'déserte', 'désert']],
    ['Ces exercices me semblent ___. (facile)', 'faciles', ['facile', 'facils', 'facilent']],
    ['Ma sœur est une fille très ___. (sportif)', 'sportive', ['sportif', 'sportives', 'sportifs']],
    ['Les murs de ce château sont ___. (épais)', 'épais', ['épaisses', 'épaises', 'épaisse']],
    ['Mes amies sont ___ de leur voyage. (ravi)', 'ravies', ['ravis', 'ravie', 'ravi']],
    ['Les chattes se sont ___ au soleil. (installer)', 'installées', ['installés', 'installé', 'installer']]
  ];
  const tireAccord = tirage(ACCORDS);
  const genAccords = () => {
    const [p, b, f] = tireAccord(), base = /\(([^)]+)\)$/.exec(p)[1], texteP = p.replace(/ \([^)]+\)$/, '');
    return qcm({ visuel: '✅', enonce: `Choisis la bonne orthographe (${base}) :<br>${phrase(texteP)}`, dire: 'Choisis la bonne orthographe du mot ' + base + ' : ' + texteP.replace('___', '…'), aide: 'Cherche le mot avec lequel il faut accorder : le sujet ou le nom.' }, b, f);
  };

  // Fonctions dans la phrase
  const FONC = { S: 'sujet', COD: 'complément d\'objet direct (COD)', COI: 'complément d\'objet indirect (COI)', CCL: 'complément circonstanciel de lieu', CCT: 'complément circonstanciel de temps', CCM: 'complément circonstanciel de manière', ATT: 'attribut du sujet' };
  const FONCTIONS = [
    ['Chaque soir, [mon grand-père] lit le journal.', 'S'], ['Dans le ciel volent [des oiseaux migrateurs].', 'S'], ['[Les élèves de CM2] préparent une exposition.', 'S'],
    ['[Le vent du nord] souffle depuis hier.', 'S'], ['[Nous] partirons à l\'aube.', 'S'], ['Sur la colline se dresse [un vieux moulin].', 'S'],
    ['Le chat attrape [une souris grise].', 'COD'], ['Mon frère répare [son vélo] dans le garage.', 'COD'], ['Les pompiers ont éteint [l\'incendie].', 'COD'],
    ['Nous regardons [les étoiles] chaque soir.', 'COD'], ['Le jardinier arrose [ses tomates].', 'COD'], ['Les élèves lisent [un roman d\'aventures].', 'COD'],
    ['Léo parle [à son professeur].', 'COI'], ['Nous pensons souvent [à nos vacances].', 'COI'], ['Cette maison appartient [à mes grands-parents].', 'COI'],
    ['Les enfants obéissent [à leurs parents].', 'COI'], ['Je me souviens [de ce voyage].', 'COI'], ['Tom téléphone [à sa tante].', 'COI'],
    ['Les enfants jouent [dans la cour].', 'CCL'], ['[Au bord de la mer], nous construisons des châteaux de sable.', 'CCL'], ['Le chat dort [sous la table].', 'CCL'],
    ['Mon oncle travaille [dans une usine].', 'CCL'], ['[Dans la forêt], les promeneurs ramassent des champignons.', 'CCL'],
    ['[Pendant les vacances], nous faisons du vélo.', 'CCT'], ['Le train partira [dans dix minutes].', 'CCT'], ['[Hier soir], nous avons regardé un film.', 'CCT'],
    ['Les hirondelles reviennent [au printemps].', 'CCT'], ['Mon père se lève [à six heures].', 'CCT'],
    ['La tortue avance [lentement].', 'CCM'], ['Le chevalier combat [avec courage].', 'CCM'], ['Les élèves écoutent [en silence].', 'CCM'],
    ['Elle chante [joyeusement].', 'CCM'], ['Il a ouvert la porte [sans bruit].', 'CCM'],
    ['Le ciel devient [gris].', 'ATT'], ['Ma sœur est [infirmière].', 'ATT'], ['Ces fruits semblent [mûrs].', 'ATT'], ['Le lion paraît [fatigué].', 'ATT'], ['Mon voisin reste [calme].', 'ATT']
  ];
  const tireFonction = tirage(FONCTIONS);
  const genFonctions = () => {
    const [p, code] = tireFonction(), html = p.replace(/\[(.+?)\]/, '<u>$1</u>');
    const proches = { S: ['COD', 'ATT', 'CCL'], COD: ['COI', 'S', 'ATT'], COI: ['COD', 'CCL', 'S'], CCL: ['CCT', 'COI', 'CCM'], CCT: ['CCL', 'CCM', 'COD'], CCM: ['CCT', 'CCL', 'ATT'], ATT: ['COD', 'CCM', 'S'] }[code];
    return qcm({ visuel: '🧐', enonce: `Quelle est la fonction du groupe souligné ?<br>${phrase(html)}`, dire: 'Quelle est la fonction du groupe souligné ? ' + p.replace(/[[\]]/g, '') + ' Le groupe souligné est : ' + /\[(.+?)\]/.exec(p)[1] }, FONC[code], proches.map(c => FONC[c]));
  };

  // Groupe nominal et phrase
  const NOYAUX = [
    ['le grand château du roi', 'château', ['grand', 'roi']], ['une petite maison au toit rouge', 'maison', ['toit', 'petite']],
    ['les chaussures neuves de mon frère', 'chaussures', ['frère', 'neuves']], ['un délicieux gâteau au chocolat', 'gâteau', ['chocolat', 'délicieux']],
    ['la voiture rapide du pilote', 'voiture', ['pilote', 'rapide']], ['ce vieux livre de contes', 'livre', ['contes', 'vieux']],
    ['les belles fleurs du jardin', 'fleurs', ['jardin', 'belles']], ['une tasse de thé brûlant', 'tasse', ['thé', 'brûlant']],
    ['le chat noir de la voisine', 'chat', ['voisine', 'noir']], ['un immense bateau à voiles', 'bateau', ['voiles', 'immense']]
  ];
  const GN_FONC = [
    ['un gâteau [au chocolat]', 'complément du nom'], ['une [petite] maison', 'épithète'], ['une robe [rouge]', 'épithète'],
    ['la maison [de mes grands-parents]', 'complément du nom'], ['un sac [à dos]', 'complément du nom'], ['des chaussures [en cuir]', 'complément du nom'],
    ['un [énorme] camion', 'épithète'], ['une machine [à laver]', 'complément du nom'], ['un chien [très obéissant]', 'épithète'],
    ['une [jolie] fleur des champs', 'épithète'], ['une jolie fleur [des champs]', 'complément du nom'], ['le [vieux] port de Marseille', 'épithète']
  ];
  const EPI_ATT = [
    ['La mer [calme] brille au soleil.', 'épithète'], ['La mer est [calme].', 'attribut du sujet'], ['Ce gâteau [délicieux] a disparu.', 'épithète'],
    ['Ce gâteau semble [délicieux].', 'attribut du sujet'], ['Les enfants [sages] reçoivent une image.', 'épithète'], ['Les enfants restent [sages].', 'attribut du sujet'],
    ['Mon chien devient [vieux].', 'attribut du sujet'], ['Mon [vieux] chien dort au soleil.', 'épithète'], ['Tes mains sont [froides].', 'attribut du sujet'],
    ['Une [épaisse] fumée sort de la cheminée.', 'épithète'], ['Cette histoire paraît [incroyable].', 'attribut du sujet'], ['Une histoire [incroyable] circule dans l\'école.', 'épithète']
  ];
  // [phrase, nombre de verbes conjugués]
  const PHRASES_C = [
    ['Le chat dort sur le canapé.', 1], ['Le chat dort et le chien joue.', 2], ['Il pleut, nous restons à la maison.', 2],
    ['Mes amis et moi jouons au ballon dans le parc.', 1], ['Quand il fait beau, nous allons à la plage.', 2], ['Le vieux pêcheur répare son filet sur le port.', 1],
    ['Je lis un livre pendant que ma sœur dessine.', 2], ['Après le repas, les enfants courent dans le jardin.', 1], ['Tom ouvre la porte, regarde dehors et sourit.', 3],
    ['Nous voulons partir tôt demain matin.', 1], ['Le soleil brille mais il fait froid.', 2], ['Pendant la nuit, la neige a recouvert toute la vallée.', 1],
    ['Elle prend son sac, met son manteau et sort.', 3], ['Les oiseaux chantent, les fleurs s\'ouvrent, le printemps arrive.', 3]
  ];
  const JUX_COORD = [
    ['Il pleut, nous restons à la maison.', 'juxtaposées'], ['Il pleut, donc nous restons à la maison.', 'coordonnées'], ['Le soleil brille mais il fait froid.', 'coordonnées'],
    ['Je cours, je saute, je nage.', 'juxtaposées'], ['Tu viens avec nous ou tu restes ici ?', 'coordonnées'], ['Elle chante ; son frère danse.', 'juxtaposées'],
    ['Léo a faim car il n\'a pas déjeuné.', 'coordonnées'], ['Le vent souffle : les volets claquent.', 'juxtaposées'], ['Le chien aboie et le chat s\'enfuit.', 'coordonnées']
  ];
  const tireNoyau = tirage(NOYAUX), tireGnF = tirage(GN_FONC), tireEA = tirage(EPI_ATT), tirePC = tirage(PHRASES_C), tireJC = tirage(JUX_COORD);
  const souligne = p => p.replace(/\[(.+?)\]/, '<u>$1</u>');
  const genGN = () => {
    const t = alea(0, 5);
    if (t === 0) { const [gn, b, f] = tireNoyau(); return qcm({ visuel: '🏷️', enonce: `Quel est le nom noyau de ce groupe nominal ?<br>${phrase('« ' + gn + ' »')}`, aide: 'Le nom noyau est le nom principal : on ne peut pas le supprimer.' }, b, f.concat(gn.split(' ')[0])); }
    if (t === 1) { const [gn, b] = tireGnF(); return qcm({ visuel: '🔗', enonce: `Dans ce groupe nominal, le mot ou groupe souligné est…<br>${phrase('« ' + souligne(gn) + ' »')}`, dire: 'Dans le groupe nominal ' + gn.replace(/[[\]]/g, '') + ', le groupe ' + /\[(.+?)\]/.exec(gn)[1] + ' est…' }, b, ['épithète', 'complément du nom', 'nom noyau', 'déterminant']); }
    if (t === 2) { const [p, b] = tireEA(); return { visuel: '🎨', enonce: `L'adjectif souligné est…<br>${phrase(souligne(p))}`, dire: p.replace(/[[\]]/g, '') + ' L\'adjectif ' + /\[(.+?)\]/.exec(p)[1] + ' est…', choix: ['épithète', 'attribut du sujet'], bonne: b, aide: 'Un attribut est relié au sujet par un verbe comme être, sembler, devenir, rester, paraître.' }; }
    if (t === 3) { const [p, n] = tirePC(); return { visuel: '🧩', enonce: `Cette phrase est-elle simple ou complexe ?<br>${phrase(p)}`, dire: p + ' Cette phrase est-elle simple ou complexe ?', choix: ['simple', 'complexe'], bonne: n > 1 ? 'complexe' : 'simple', aide: 'Compte les verbes conjugués.' }; }
    if (t === 4) { const [p, n] = tirePC(); return qcm({ visuel: '🧩', enonce: `Combien de propositions y a-t-il dans cette phrase ?<br>${phrase(p)}`, dire: p + ' Combien de propositions ?', aide: 'Il y a autant de propositions que de verbes conjugués.' }, n, [1, 2, 3, 4]); }
    const [p, b] = tireJC();
    return { visuel: '🔗', enonce: `Les propositions de cette phrase sont…<br>${phrase(p)}`, dire: p + ' Les propositions sont…', choix: ['juxtaposées', 'coordonnées'], bonne: b, aide: 'Juxtaposées : séparées par une virgule, un point-virgule ou deux-points. Coordonnées : reliées par mais, ou, et, donc, or, ni, car.' };
  };

  // Homophones : [phrase, bonne, groupe]
  const GROUPES_H = { ces: ['ces', 'ses', 'c\'est', 's\'est'], leur: ['leur', 'leurs'], quand: ['quand', 'quant', 'qu\'en'], ce: ['ce', 'se'], la: ['la', 'l\'a', 'là'], peu: ['peu', 'peut', 'peux'] };
  const HOMOPHONES = [
    ['___ un très bon film.', 'c\'est', 'ces'], ['Le chat ___ caché sous le lit.', 's\'est', 'ces'], ['Le chat lèche ___ pattes.', 'ses', 'ces'],
    ['Regarde ___ nuages noirs là-bas !', 'ces', 'ces'], ['Elle ___ coupée au doigt.', 's\'est', 'ces'], ['___ mon anniversaire demain.', 'c\'est', 'ces'],
    ['___ fleurs-ci sont plus belles que celles-là.', 'ces', 'ces'], ['Julie ferme ___ yeux pour s\'endormir.', 'ses', 'ces'],
    ['Les enfants rangent ___ jouets.', 'leurs', 'leur'], ['Je ___ ai prêté mon livre.', 'leur', 'leur'], ['Mes voisins ont repeint ___ maison.', 'leur', 'leur'],
    ['Les oiseaux nourrissent ___ petits.', 'leurs', 'leur'], ['Dis-___ de venir !', 'leur', 'leur'], ['Mes cousins promènent ___ chien.', 'leur', 'leur'],
    ['___ il neige, nous faisons de la luge.', 'quand', 'quand'], ['___ à moi, je préfère rester ici.', 'quant', 'quand'], ['___ penses-tu ?', 'qu\'en', 'quand'],
    ['___ arriveras-tu ?', 'quand', 'quand'], ['Il ne se baigne ___ été.', 'qu\'en', 'quand'], ['___ aux enfants, ils jouent dehors.', 'quant', 'quand'],
    ['Il ___ brosse les dents.', 'se', 'ce'], ['___ matin, il fait froid.', 'ce', 'ce'], ['Les enfants ___ lavent les mains.', 'se', 'ce'],
    ['___ livre est passionnant.', 'ce', 'ce'], ['Ils ___ sont perdus dans la forêt.', 'se', 'ce'],
    ['Mon vélo ? Papa ___ réparé.', 'l\'a', 'la'], ['Pose ton sac ___, près de la porte.', 'là', 'la'], ['Je regarde ___ télévision.', 'la', 'la'],
    ['Qui est ___ ?', 'là', 'la'], ['Cette chanson, Léa ___ apprise par cœur.', 'l\'a', 'la'],
    ['Tu ___ venir avec nous.', 'peux', 'peu'], ['Il ___ pleuvoir cet après-midi.', 'peut', 'peu'], ['J\'ai un ___ froid.', 'peu', 'peu'],
    ['Je ___ t\'aider si tu veux.', 'peux', 'peu'], ['Elle mange très ___.', 'peu', 'peu'], ['On ___ partir maintenant.', 'peut', 'peu'],
    ['Nous allons ___ au parc.', 'jouer', ['jouer', 'joué', 'jouez']], ['Il a ___ tout le gâteau.', 'mangé', ['mangé', 'manger', 'mangez']],
    ['Vous devez ___ la porte.', 'fermer', ['fermer', 'fermé', 'fermez']], ['J\'ai ___ mes clés partout.', 'cherché', ['cherché', 'chercher', 'cherchez']],
    ['Elle veut ___ un gâteau.', 'préparer', ['préparer', 'préparé', 'préparez']], ['Ils ont ___ toute la nuit.', 'dansé', ['dansé', 'danser', 'dansez']],
    ['Le bébé commence à ___.', 'marcher', ['marcher', 'marché', 'marchez']], ['Nous avons ___ la fin du film.', 'regardé', ['regardé', 'regarder', 'regardez']]
  ];
  const tireHomo = tirage(HOMOPHONES);
  const genHomophones = () => {
    const [p, b, g] = tireHomo(), choix = Array.isArray(g) ? g : GROUPES_H[g];
    const maj = s => s[0].toUpperCase() + s.slice(1), debut = p.startsWith('___');
    const bon = debut ? maj(b) : b;
    return { visuel: '🔀', enonce: `Complète la phrase :<br>${phrase(p)}`, dire: 'Complète la phrase : ' + p.replace('___', '…'), choix: melange(choix.map(c => debut ? maj(c) : c)), bonne: bon, aide: 'Remplace par un autre mot pour vérifier (était, son, lui…).' };
  };

  // Vocabulaire
  const PREFIXES = [['bicyclette', 'bi-', 'deux'], ['tricycle', 'tri-', 'trois'], ['refaire', 're-', 'de nouveau'], ['préhistoire', 'pré-', 'avant'], ['téléphone', 'télé-', 'loin'],
    ['impossible', 'im-', 'le contraire'], ['sous-marin', 'sous-', 'en dessous'], ['monorail', 'mono-', 'un seul'], ['autoportrait', 'auto-', 'soi-même'], ['antivol', 'anti-', 'contre'], ['multicolore', 'multi-', 'plusieurs']];
  const SENS_PREF = PREFIXES.map(x => x[2]);
  const SUFFIXES = [['lavable', '-able', 'qu\'on peut (laver)'], ['maisonnette', '-ette', 'petit'], ['nageur', '-eur', 'celui qui fait l\'action'], ['boulangerie', '-erie', 'le lieu où l\'on fabrique ou vend'],
    ['lentement', '-ment', 'de quelle manière'], ['pommier', '-ier', 'l\'arbre qui porte ce fruit'], ['arrosage', '-age', 'l\'action de (arroser)']];
  const SENS_SUF = SUFFIXES.map(x => x[2]);
  const SENS_PF = [
    ['Cette nouvelle m\'a <u>glacé</u> le sang.', 'figuré'], ['Le lac est <u>glacé</u> tout l\'hiver.', 'propre'], ['Il a une <u>montagne</u> de devoirs.', 'figuré'],
    ['Nous avons escaladé une <u>montagne</u>.', 'propre'], ['Elle a <u>brûlé</u> les étapes.', 'figuré'], ['Il s\'est <u>brûlé</u> la main.', 'propre'],
    ['Ce film m\'a <u>ouvert</u> les yeux.', 'figuré'], ['Le bébé a <u>ouvert</u> les yeux.', 'propre'], ['Il est <u>tombé</u> des nues.', 'figuré'],
    ['Le vase est <u>tombé</u> par terre.', 'propre'], ['Une <u>pluie</u> de cadeaux l\'attendait.', 'figuré'], ['La <u>pluie</u> tombe depuis ce matin.', 'propre'],
    ['Il a un caractère de <u>cochon</u>.', 'figuré'], ['Le <u>cochon</u> se roule dans la boue.', 'propre'], ['Ce géant a un cœur de <u>pierre</u>.', 'figuré'], ['Le mur est construit en <u>pierre</u>.', 'propre']
  ];
  const SYN = [['une demeure', 'une habitation', ['un jardin', 'un voyage', 'une rue']], ['achever', 'terminer', ['commencer', 'acheter', 'chercher']],
    ['effrayant', 'terrifiant', ['amusant', 'rassurant', 'étonné']], ['un périple', 'un long voyage', ['un péril', 'une promenade en ville', 'un repos']],
    ['bavarder', 'discuter', ['se taire', 'écouter', 'bâiller']], ['épuisé', 'très fatigué', ['en pleine forme', 'très content', 'très pressé']],
    ['la crainte', 'la peur', ['la joie', 'la colère', 'la surprise']], ['exquis', 'délicieux', ['immangeable', 'amer', 'fade']],
    ['dérober', 'voler', ['donner', 'rendre', 'acheter']], ['un bambin', 'un petit enfant', ['un vieillard', 'un bandit', 'un animal']],
    ['vaste', 'très grand', ['étroit', 'minuscule', 'lointain']], ['se hâter', 'se dépêcher', ['traîner', 'se reposer', 'hésiter']]];
  const ANT = [['généreux', 'avare', ['gentil', 'aimable', 'riche']], ['ancien', 'moderne', ['vieux', 'antique', 'usé']], ['augmenter', 'diminuer', ['grandir', 'ajouter', 'monter']],
    ['courageux', 'peureux', ['brave', 'hardi', 'fort']], ['accepter', 'refuser', ['accueillir', 'recevoir', 'prendre']], ['ralentir', 'accélérer', ['freiner', 'arrêter', 'stopper']],
    ['la victoire', 'la défaite', ['le triomphe', 'le succès', 'la réussite']], ['bruyant', 'silencieux', ['sonore', 'fort', 'tapageur']], ['honnête', 'malhonnête', ['sincère', 'franc', 'loyal']],
    ['l\'entrée', 'la sortie', ['la porte', 'le couloir', 'l\'accès']]];
  const NIVEAUX_L = [['une bagnole', 'familier'], ['une voiture', 'courant'], ['un bouquin', 'familier'], ['un livre', 'courant'], ['un ouvrage', 'soutenu'],
    ['bosser', 'familier'], ['travailler', 'courant'], ['un gamin', 'familier'], ['un enfant', 'courant'], ['la bouffe', 'familier'], ['la nourriture', 'courant'],
    ['crevé', 'familier'], ['fatigué', 'courant'], ['exténué', 'soutenu'], ['se marrer', 'familier'], ['rire', 'courant'], ['une godasse', 'familier'], ['une chaussure', 'courant'],
    ['avoir la trouille', 'familier'], ['avoir peur', 'courant'], ['une demeure', 'soutenu'], ['un logement', 'courant'], ['le fric', 'familier'], ['l\'argent', 'courant']];
  const GENERIQUES = [['pomme, poire, cerise', 'des fruits', ['des légumes', 'des arbres', 'des fleurs']], ['rose, tulipe, marguerite', 'des fleurs', ['des arbres', 'des fruits', 'des légumes']],
    ['marteau, tournevis, scie', 'des outils', ['des meubles', 'des jouets', 'des instruments de musique']], ['chaise, armoire, table', 'des meubles', ['des outils', 'des vêtements', 'des bâtiments']],
    ['piano, violon, flûte', 'des instruments de musique', ['des outils', 'des jouets', 'des meubles']], ['chêne, sapin, bouleau', 'des arbres', ['des fleurs', 'des fruits', 'des légumes']],
    ['jupe, pantalon, chemise', 'des vêtements', ['des chaussures', 'des meubles', 'des tissus']], ['train, avion, bateau', 'des moyens de transport', ['des métiers', 'des outils', 'des sports']],
    ['colère, joie, tristesse', 'des sentiments', ['des couleurs', 'des métiers', 'des saisons']], ['boulanger, pompier, infirmière', 'des métiers', ['des sports', 'des loisirs', 'des outils']]];
  const genVocabulaire = () => {
    const t = alea(0, 7);
    if (t === 0) { const [m, p, s] = pioche(PREFIXES); return qcm({ visuel: '🧩', enonce: `Dans le mot « ${m} », que signifie le préfixe « ${p} » ?` }, s, SENS_PREF); }
    if (t === 1) { const [m, x, s] = pioche(SUFFIXES); return qcm({ visuel: '🧩', enonce: `Dans le mot « ${m} », que signifie le suffixe « ${x} » ?` }, s, SENS_SUF); }
    if (t === 2) { const [p, b] = pioche(SENS_PF); return { visuel: '💡', enonce: `Le mot souligné est employé au sens…<br>${phrase(p)}`, dire: `${p.replace(/<[^>]+>/g, '').replace(/ \./, '.')} Le mot « ${/<u>(.+?)<\/u>/.exec(p)[1]} » est employé au sens…`, choix: ['propre', 'figuré'], bonne: b }; }
    if (t === 3) { const [m, b, f] = pioche(SYN); return qcm({ visuel: '🟰', enonce: `Quel est le synonyme de « ${m} » ?` }, b, f); }
    if (t === 4) { const [m, b, f] = pioche(ANT); return qcm({ visuel: '↔️', enonce: `Quel est le contraire de « ${m} » ?` }, b, f); }
    if (t === 5) { const [m, b] = pioche(NIVEAUX_L); return { visuel: '🎩', enonce: `À quel niveau de langue appartient « ${m} » ?`, choix: ['familier', 'courant', 'soutenu'], bonne: b }; }
    if (t === 6) { const [l, b, f] = pioche(GENERIQUES); return qcm({ visuel: '🗂️', enonce: `Quel mot générique regroupe : ${l} ?` }, b, f); }
    const [b, f] = pioche([['inoubliable', ['oublier', 'oubli', 'oubliette']], ['incassable', ['cassure', 'casser', 'recasser']], ['déménagement', ['ménage', 'ménager', 'déménager']], ['impatiemment', ['patient', 'patience', 'impatient']], ['relecture', ['lecteur', 'lire', 'relire']]]);
    return qcm({ visuel: '🧩', enonce: 'Quel mot est formé avec un préfixe ET un suffixe ?' }, b, f);
  };

  // Compréhension de textes
  const TEXTES = [
    { v: '🏔️', t: 'Le 8 août 1786, deux hommes de Chamonix, le médecin Michel Paccard et le chercheur de cristaux Jacques Balmat, atteignent pour la première fois le sommet du mont Blanc. Ils n\'ont ni cordes modernes ni vêtements chauds adaptés. Pendant la descente, Balmat souffre du froid et Paccard revient presque aveugle, ébloui par la neige.', qs: [
      ['Pourquoi Paccard revient-il presque aveugle ?', 'La neige l\'a ébloui.', ['Il est tombé dans une crevasse.', 'Il a perdu ses lunettes dans le froid.', 'Il faisait nuit.']],
      ['Quel est l\'exploit raconté dans ce texte ?', 'La première ascension du mont Blanc', ['La traversée des Alpes à pied', 'La découverte de Chamonix', 'La construction d\'un refuge']]] },
    { v: '🧪', t: 'En 1885, un jeune Alsacien de neuf ans, Joseph Meister, est mordu par un chien enragé. À l\'époque, la rage est toujours mortelle. Sa mère l\'emmène à Paris, chez Louis Pasteur, qui a mis au point un vaccin testé seulement sur des animaux. Pasteur hésite, puis décide de le soigner. Joseph guérit : c\'est une immense victoire pour la médecine.', qs: [
      ['Pourquoi Pasteur hésite-t-il ?', 'Son vaccin n\'avait jamais été essayé sur un humain.', ['Il ne connaissait pas la famille.', 'Il n\'aimait pas les enfants.', 'Le voyage jusqu\'à Paris était trop long.']],
      ['Que peut-on dire de Joseph Meister ?', 'Il a été le premier humain sauvé de la rage par ce vaccin.', ['Il est devenu médecin.', 'Il a été mordu par un loup.', 'Il est mort de la rage.']]] },
    { v: '🌊', t: 'Chaque jour, la mer monte puis descend : c\'est la marée. À marée basse, l\'eau se retire parfois très loin et laisse apparaître le sable, les rochers et les algues. Les pêcheurs à pied en profitent pour ramasser des coques et des crevettes. Mais attention : la mer remonte vite, et chaque année, des promeneurs imprudents se retrouvent encerclés par l\'eau.', qs: [
      ['Que font les pêcheurs à pied ?', 'Ils ramassent des coquillages et des crevettes à marée basse.', ['Ils pêchent en bateau au large.', 'Ils nagent jusqu\'aux rochers.', 'Ils attendent la marée haute.']],
      ['Pourquoi certains promeneurs se retrouvent-ils en danger ?', 'Ils n\'ont pas fait attention à la mer qui remonte.', ['Ils ont glissé sur les algues.', 'Ils ont mangé des coques.', 'Le sable était trop chaud.']]] },
    { v: '📮', t: 'Ma chère Louise, je t\'écris de la ferme de mon oncle, dans le Jura. Ici, pas de télévision et presque pas de réseau ! Au début, je m\'ennuyais un peu, mais maintenant je ne voudrais plus partir. Ce matin, j\'ai aidé à traire les vaches, et cet après-midi, nous irons chercher des myrtilles. Je te raconterai tout à la rentrée. Ton amie, Zoé.', qs: [
      ['Qui a écrit cette lettre ?', 'Zoé', ['Louise', 'L\'oncle de Zoé', 'Un fermier']],
      ['Comment les sentiments de Zoé ont-ils changé ?', 'Elle s\'ennuyait au début, maintenant elle se plaît.', ['Elle était contente, puis elle s\'est ennuyée.', 'Elle s\'ennuie toujours autant.', 'Elle veut rentrer tout de suite.']],
      ['Que fera Zoé cet après-midi ?', 'Elle ira cueillir des myrtilles.', ['Elle traira les vaches.', 'Elle regardera la télévision.', 'Elle rentrera chez elle.']]] },
    { v: '🦇', t: 'Contrairement à ce que l\'on croit souvent, la chauve-souris n\'est pas un oiseau : c\'est un mammifère, le seul capable de voler vraiment. La nuit, elle pousse des cris très aigus que nous ne pouvons pas entendre. Ces cris rebondissent sur les obstacles et sur les insectes, puis reviennent à ses oreilles. Ainsi, elle « voit » avec ses oreilles ! Une seule chauve-souris peut manger des centaines de moustiques en une nuit.', qs: [
      ['Comment la chauve-souris se repère-t-elle dans le noir ?', 'Grâce à l\'écho de ses cris', ['Grâce à ses très bons yeux', 'Grâce à son odorat', 'Grâce à la lumière de la lune']],
      ['Pourquoi peut-on dire que la chauve-souris est utile ?', 'Elle mange beaucoup de moustiques.', ['Elle fait peur aux voleurs.', 'Elle pollinise les fleurs de jour.', 'Elle chante la nuit.']]] },
    { v: '🚂', t: 'En 1830, le voyage de Paris à Marseille durait plusieurs jours en diligence, une voiture tirée par des chevaux. Avec l\'arrivée du chemin de fer, il ne faut plus qu\'une journée vers 1860. Aujourd\'hui, le TGV relie les deux villes en un peu plus de trois heures. En moins de deux siècles, le voyage est devenu des dizaines de fois plus rapide !', qs: [
      ['Comment voyageait-on de Paris à Marseille en 1830 ?', 'En diligence tirée par des chevaux', ['En train à vapeur', 'En TGV', 'En avion']],
      ['Quelle est l\'idée principale de ce texte ?', 'Les voyages sont devenus de plus en plus rapides.', ['Marseille est plus belle que Paris.', 'Les chevaux étaient plus rapides que les trains.', 'Le TGV existe depuis 1830.']]] },
    { v: '🕯️', t: 'La panne d\'électricité dura toute la soirée. Maman alluma des bougies et sortit un vieux jeu de cartes du placard. D\'abord, Nathan bouda : il ne pourrait pas terminer sa partie de jeu vidéo. Mais bientôt, toute la famille riait autour de la table. Quand la lumière revint, vers vingt-deux heures, personne ne se leva pour allumer la télévision.', qs: [
      ['Pourquoi Nathan boude-t-il au début ?', 'Il ne peut plus jouer à son jeu vidéo.', ['Il a peur du noir.', 'Il a perdu aux cartes.', 'Il veut aller se coucher.']],
      ['Pourquoi personne n\'allume la télévision à la fin ?', 'Ils s\'amusent trop bien ensemble.', ['La télévision est cassée.', 'Il est trop tard pour regarder un film.', 'L\'électricité ne marche toujours pas.']]] },
    { v: '🌳', t: 'Le baobab est un arbre d\'Afrique et de Madagascar. Son tronc énorme peut stocker des milliers de litres d\'eau, ce qui l\'aide à survivre pendant la longue saison sèche. Ses fruits, appelés « pain de singe », sont riches en vitamines. Certains baobabs ont plus de mille ans. Dans de nombreux villages, on se réunit à son ombre pour discuter et prendre des décisions.', qs: [
      ['Comment le baobab survit-il à la saison sèche ?', 'Il garde de l\'eau dans son tronc.', ['Il perd toutes ses racines.', 'Les villageois l\'arrosent.', 'Il pousse près des rivières.']],
      ['Comment appelle-t-on le fruit du baobab ?', 'Le pain de singe', ['La noix de coco', 'Le fruit de la passion', 'La mangue sauvage']]] },
    { v: '🗳️', t: 'Dans la classe de CM2 de Mme Diallo, les élèves élisent deux délégués. Chaque candidat présente ses idées : Samir propose un coin lecture, Léna veut organiser un tournoi de ballon, et Hugo promet des bonbons à tout le monde. Après le vote à bulletin secret, Samir et Léna sont élus. Hugo, déçu, comprend que ses camarades ont préféré des projets utiles pour la classe.', qs: [
      ['Qui a été élu délégué ?', 'Samir et Léna', ['Hugo et Léna', 'Samir et Hugo', 'Mme Diallo']],
      ['Pourquoi Hugo n\'a-t-il pas été élu, d\'après le texte ?', 'Ses camarades ont préféré des projets utiles.', ['Il n\'avait pas de bonbons.', 'Il était absent le jour du vote.', 'La maîtresse l\'a interdit.']]] },
    { v: '🛰️', t: 'Thomas Pesquet est un astronaute français. Il a séjourné plusieurs mois dans la Station spatiale internationale, qui tourne autour de la Terre à environ 400 kilomètres d\'altitude. Là-haut, tout flotte : il faut s\'attacher pour dormir et boire avec une paille dans des poches fermées. Depuis la station, il a pris des milliers de photos de notre planète.', qs: [
      ['Pourquoi faut-il boire dans des poches fermées ?', 'Parce que tout flotte dans la station.', ['Parce que l\'eau est trop froide.', 'Parce qu\'il n\'y a pas de verres.', 'Parce que c\'est plus rapide.']],
      ['Où se trouve la Station spatiale internationale ?', 'Autour de la Terre, à environ 400 km', ['Sur la Lune', 'Sur Mars', 'Au fond de l\'océan']]] },
    { v: '🐝', t: 'Depuis quelques années, les abeilles sont moins nombreuses. Plusieurs causes sont connues : certains produits chimiques utilisés dans les champs, des maladies, et la disparition des fleurs sauvages. Or, les abeilles transportent le pollen de fleur en fleur, ce qui permet aux plantes de produire des fruits. Sans elles, nous aurions beaucoup moins de pommes, de fraises ou de cerises.', qs: [
      ['Pourquoi les abeilles sont-elles importantes pour nous ?', 'Elles permettent aux plantes de produire des fruits.', ['Elles mangent les insectes nuisibles.', 'Elles fabriquent du sucre en poudre.', 'Elles protègent les champs du froid.']],
      ['Laquelle de ces causes du déclin des abeilles est citée dans le texte ?', 'La disparition des fleurs sauvages', ['Le froid de l\'hiver', 'Les oiseaux qui les mangent', 'Le bruit des villes']]] },
    { v: '🏛️', t: 'Le 4 septembre 1870, après la défaite de l\'empereur Napoléon III contre la Prusse, la République est proclamée à Paris, à l\'Hôtel de Ville. Les débuts sont difficiles : il faut encore quelques années pour que la IIIe République s\'installe vraiment. Peu à peu, elle se dote de symboles : La Marseillaise devient l\'hymne national en 1879, et le 14 Juillet devient la fête nationale en 1880.', qs: [
      ['Que se passe-t-il le 4 septembre 1870 ?', 'La République est proclamée.', ['Napoléon III devient empereur.', 'La Marseillaise est composée.', 'La première fête nationale a lieu.']],
      ['Depuis quand le 14 Juillet est-il la fête nationale ?', 'Depuis 1880', ['Depuis 1789', 'Depuis 1870', 'Depuis 1879']]] }
  ];
  const Q_TEXTES = [];
  TEXTES.forEach(x => x.qs.forEach(q => Q_TEXTES.push([x, q])));
  const tireTexte = tirage(Q_TEXTES);
  const genComprehension = () => {
    const [x, [q, b, f]] = tireTexte();
    return qcm({ visuel: x.v, enonce: `<span style="font-weight:normal;display:block;text-align:left;margin-bottom:.6em">${x.t}</span><b>${q}</b>`, dire: x.t + ' ' + q }, b, f);
  };

  // Dictée : [mot, phrase d'exemple, variantes acceptées]
  const DICTEE = [
    ['cependant', 'Il fait beau, cependant il fait froid.'], ['désormais', 'Désormais, je me lèverai plus tôt.'], ['quelqu\'un', 'Quelqu\'un frappe à la porte.'],
    ['parmi', 'Il y a un intrus parmi nous.'], ['plutôt', 'Au goûter, je prends plutôt du chocolat.'], ['lorsque', 'Lorsque la cloche sonne, nous rentrons.'],
    ['pourtant', 'Il a perdu, pourtant il avait bien joué.'], ['davantage', 'Il faut travailler davantage.'], ['autour', 'Les enfants dansent autour du feu.'],
    ['soudain', 'Soudain, l\'orage éclata.'], ['puisque', 'Reste ici, puisque tu es fatigué.'], ['néanmoins', 'C\'est difficile, néanmoins j\'y arriverai.'],
    ['événement', 'Ce mariage est un grand événement.', ['évènement']], ['paysage', 'Le paysage est magnifique.'], ['village', 'Mon village compte trois cents habitants.'],
    ['accueil', 'Merci pour ton accueil chaleureux.'], ['orgueil', 'Son orgueil l\'empêche de s\'excuser.'], ['feuillage', 'Le feuillage des arbres devient roux.'],
    ['habitude', 'J\'ai l\'habitude de lire le soir.'], ['honnête', 'C\'est un garçon très honnête.'], ['exercice', 'Cet exercice est facile.'],
    ['exemple', 'Donne-moi un exemple.'], ['occasion', 'C\'est une belle occasion.'], ['différence', 'Quelle est la différence entre ces deux dessins ?'],
    ['intelligent', 'Le dauphin est un animal intelligent.'], ['rythme', 'Il danse en suivant le rythme.'], ['sympathique', 'Ton cousin est très sympathique.'],
    ['photographie', 'Cette photographie date de 1900.'], ['géographie', 'J\'adore les cours de géographie.'], ['bibliothèque', 'J\'emprunte des livres à la bibliothèque.'],
    ['athlète', 'Cet athlète court très vite.'], ['monument', 'La tour Eiffel est un monument célèbre.'], ['gouvernement', 'Le gouvernement prépare une loi.'],
    ['république', 'La France est une république.'], ['citoyen', 'Chaque citoyen peut voter à dix-huit ans.'], ['élection', 'L\'élection a lieu dimanche.'],
    ['guerre', 'La guerre a duré quatre ans.'], ['soldat', 'Le soldat écrit à sa famille.'], ['paix', 'Tout le monde souhaite la paix.'],
    ['victoire', 'L\'équipe fête sa victoire.'], ['usine', 'Mon grand-père travaillait dans une usine.'], ['machine', 'La machine à vapeur a changé le monde.'],
    ['vapeur', 'La vapeur sort de la casserole.'], ['charbon', 'Les mineurs extrayaient du charbon.'], ['énergie', 'Le vent est une énergie renouvelable.'],
    ['planète', 'Mars est une planète rouge.'], ['système', 'Le système solaire compte huit planètes.'], ['oxygène', 'Nous respirons de l\'oxygène.'],
    ['squelette', 'Le squelette protège nos organes.'], ['poumon', 'L\'air entre dans le poumon.'], ['estomac', 'J\'ai mal à l\'estomac.'],
    ['circulation', 'La circulation est difficile ce matin.'], ['aujourd\'hui', 'Aujourd\'hui, nous allons au musée.'], ['longtemps', 'Nous avons attendu longtemps.'],
    ['beaucoup', 'Il y a beaucoup de monde.'], ['immense', 'Cette forêt est immense.'], ['commencer', 'Le spectacle va commencer.'],
    ['appeler', 'Je vais appeler ma grand-mère.'], ['apprendre', 'J\'aime apprendre de nouvelles choses.'], ['attraper', 'Le chat veut attraper la souris.'],
    ['succès', 'Son livre a eu un grand succès.'], ['accident', 'Il n\'y a pas eu d\'accident.'], ['silhouette', 'On aperçoit une silhouette dans le brouillard.'],
    ['aquarium', 'Les poissons nagent dans l\'aquarium.'], ['spectacle', 'Le spectacle était magnifique.'],
    ['piqûre', 'L\'infirmière m\'a fait une piqûre.', ['piqure']], ['maîtrise', 'Il a la maîtrise de son vélo.', ['maitrise']], ['paraître', 'Son livre va paraître bientôt.', ['paraitre']],
    ['œuvre', 'La Joconde est une œuvre célèbre.', ['oeuvre']], ['nœud', 'Fais un nœud à tes lacets.', ['noeud']], ['vœu', 'Fais un vœu avant de souffler les bougies.', ['voeu']]
  ];
  const tireDictee = tirage(DICTEE);
  const genDictee = () => {
    const [mot, ex, acc] = tireDictee();
    const q = { type: 'saisie', visuel: '🎧', enonce: 'Écoute bien, puis écris le mot.', aide: 'Appuie sur le haut-parleur pour réécouter.', dire: `${mot}. ${ex} ${mot}.`, bonne: mot };
    if (acc) q.accepte = acc;
    return q;
  };

  ajouterMatiere('CM2', {
    id: 'francais', titre: 'Français', emoji: '✏️', couleur: '#e5484d', jeux: [
      { id: 'conjugaison', titre: 'Les temps de l\'indicatif', emoji: '⏳', gen: genConjugaison },
      { id: 'passe-simple', titre: 'Passé simple et plus-que-parfait', emoji: '📜', gen: genPasseSimple },
      { id: 'conditionnel-imperatif', titre: 'Conditionnel et impératif', emoji: '💭', gen: genCondImper },
      { id: 'accords', titre: 'Les accords', emoji: '✅', gen: genAccords },
      { id: 'fonctions', titre: 'Fonctions dans la phrase', emoji: '🧐', gen: genFonctions },
      { id: 'groupe-nominal', titre: 'Groupe nominal et phrase', emoji: '🏷️', gen: genGN },
      { id: 'homophones', titre: 'Les homophones', emoji: '🔀', gen: genHomophones },
      { id: 'vocabulaire', titre: 'Vocabulaire', emoji: '📚', gen: genVocabulaire },
      { id: 'comprehension', titre: 'Compréhension de texte', emoji: '🔍', gen: genComprehension },
      { id: 'dictee', titre: 'Dictée de mots', emoji: '🎧', gen: genDictee }
    ]
  });

  /* ======================= HISTOIRE ======================= */
  const REPUBLIQUE = [
    { q: 'En quelle année la IIIe République est-elle proclamée ?', v: '🇫🇷', b: '1870', f: ['1789', '1914', '1958'] },
    { q: 'Quel empereur est fait prisonnier à Sedan en 1870, ce qui entraîne la fin du Second Empire ?', v: '👑', b: 'Napoléon III', f: ['Napoléon Ier', 'Louis XVI', 'Charlemagne'] },
    { q: 'Contre quel pays la France perd-elle la guerre en 1870 ?', b: 'La Prusse', f: ['L\'Angleterre', 'L\'Espagne', 'L\'Italie'] },
    { q: 'Quel ministre a rendu l\'école gratuite, laïque et obligatoire ?', v: '🏫', b: 'Jules Ferry', f: ['Victor Hugo', 'Louis Pasteur', 'Jean Jaurès'] },
    { q: 'En quelles années sont votées les lois Jules Ferry sur l\'école ?', v: '🏫', b: '1881-1882', f: ['1789-1790', '1914-1918', '1958-1959'] },
    { q: 'Avec les lois Jules Ferry, l\'école devient obligatoire pour les enfants de…', v: '🧒', b: '6 à 13 ans', f: ['3 à 16 ans', '10 à 18 ans', '2 à 6 ans'] },
    { q: 'À l\'école publique de Jules Ferry, « laïque » veut dire…', b: 'qu\'on n\'y enseigne pas de religion', f: ['qu\'elle est payante', 'qu\'elle est réservée aux garçons', 'qu\'on y apprend le latin'] },
    { q: 'Comment surnommait-on les instituteurs de la IIIe République ?', v: '👨‍🏫', b: 'Les hussards noirs de la République', f: ['Les poilus', 'Les sans-culottes', 'Les mousquetaires'] },
    { q: 'Que décide la loi de 1905 ?', v: '⚖️', b: 'La séparation des Églises et de l\'État', f: ['Le droit de vote des femmes', 'La fin de l\'esclavage', 'La création de l\'euro'] },
    { q: 'En quelle année La Marseillaise devient-elle officiellement l\'hymne national ?', v: '🎵', b: '1879', f: ['1789', '1905', '1958'] },
    { q: 'Depuis 1880, que célèbre-t-on chaque 14 juillet ?', v: '🎆', b: 'La fête nationale', f: ['La fin de la guerre', 'La fête du travail', 'Le jour de l\'an'] },
    { q: 'En quelle année l\'esclavage est-il définitivement aboli dans les colonies françaises ?', v: '⛓️', b: '1848', f: ['1789', '1905', '1945'] },
    { q: 'Qui a fait voter l\'abolition de l\'esclavage en 1848 ?', b: 'Victor Schœlcher', f: ['Jules Ferry', 'Napoléon III', 'Charles de Gaulle'] },
    { q: 'En 1848, le suffrage universel est accordé, mais seulement…', v: '🗳️', b: 'aux hommes', f: ['aux femmes', 'aux enfants', 'aux rois'] },
    { q: 'En quelle année les femmes obtiennent-elles le droit de vote en France ?', v: '🗳️', b: '1944', f: ['1789', '1870', '1968'] },
    { q: 'En quelle année la Ve République est-elle fondée ?', v: '🇫🇷', b: '1958', f: ['1870', '1918', '2002'] },
    { q: 'Qui est le premier président de la Ve République ?', b: 'Charles de Gaulle', f: ['Jules Ferry', 'Napoléon III', 'Jean Moulin'] },
    { q: 'Depuis 1962, le président de la République est élu…', v: '🗳️', b: 'directement par tous les citoyens', f: ['par le roi', 'par les députés seulement', 'par tirage au sort'] },
    { q: 'En 1957, six pays, dont la France, signent le traité de Rome. Que créent-ils ?', v: '🇪🇺', b: 'La Communauté économique européenne', f: ['L\'ONU', 'L\'euro', 'Le tunnel sous la Manche'] },
    { q: 'Depuis quand les billets et les pièces en euros sont-ils utilisés en France ?', v: '💶', b: '2002', f: ['1958', '1989', '2020'] },
    { q: 'En quelle année l\'âge du droit de vote passe-t-il de 21 à 18 ans ?', v: '🗳️', b: '1974', f: ['1789', '1905', '2002'] },
    { q: 'En quelle année la peine de mort est-elle abolie en France ?', v: '⚖️', b: '1981', f: ['1789', '1848', '1905'] },
    { q: 'Quelle savante, deux fois prix Nobel, a découvert le radium ?', v: '🔬', b: 'Marie Curie', f: ['Simone Veil', 'Jeanne d\'Arc', 'Louise Michel'] },
    { q: 'Quel est le régime politique de la France depuis 1870 (sauf pendant la Seconde Guerre mondiale) ?', b: 'La République', f: ['La monarchie', 'L\'Empire', 'La dictature'] }
  ];
  const INDUSTRIE = [
    { q: 'Quelle machine, perfectionnée par James Watt, fait tourner les premières usines ?', v: '⚙️', b: 'La machine à vapeur', f: ['Le moulin à vent', 'L\'ordinateur', 'Le moteur électrique'] },
    { q: 'Quel combustible alimente les machines à vapeur ?', v: '⛏️', b: 'Le charbon', f: ['Le bois de chêne', 'L\'uranium', 'Le vent'] },
    { q: 'Où travaillent les mineurs au XIXe siècle ?', v: '⛏️', b: 'Dans les mines de charbon', f: ['Dans les châteaux', 'Dans les champs de blé', 'Sur les bateaux de pêche'] },
    { q: 'Quel nouveau moyen de transport se développe au XIXe siècle grâce à la machine à vapeur ?', v: '🚂', b: 'Le chemin de fer', f: ['L\'avion', 'Le TGV', 'La fusée'] },
    { q: 'Comment appelle-t-on le départ de nombreux paysans vers les villes pour travailler à l\'usine ?', v: '🏭', b: 'L\'exode rural', f: ['La Révolution', 'Les croisades', 'Les grandes découvertes'] },
    { q: 'Au XIXe siècle, qui travaille aussi dans les usines et les mines, parfois dès 8 ans ?', v: '🧒', b: 'Des enfants', f: ['Des robots', 'Des chevaliers', 'Des rois'] },
    { q: 'Comment s\'appellent les personnes qui travaillent dans les usines ?', v: '🏭', b: 'Les ouvriers', f: ['Les seigneurs', 'Les serfs', 'Les chevaliers'] },
    { q: 'Comment appelle-t-on l\'arrêt du travail pour réclamer de meilleures conditions ?', v: '✊', b: 'Une grève', f: ['Une fête', 'Une récolte', 'Un sacre'] },
    { q: 'Qui a inventé une ampoule électrique qui dure longtemps, en 1879 ?', v: '💡', b: 'Thomas Edison', f: ['Louis Pasteur', 'Gustave Eiffel', 'Jules Verne'] },
    { q: 'Qui a inventé le téléphone en 1876 ?', v: '☎️', b: 'Graham Bell', f: ['Thomas Edison', 'Les frères Lumière', 'Louis Blériot'] },
    { q: 'Qui a inventé le cinématographe en 1895 ?', v: '🎬', b: 'Les frères Lumière', f: ['Les frères Montgolfier', 'Graham Bell', 'Jules Ferry'] },
    { q: 'Quel savant a mis au point le vaccin contre la rage en 1885 ?', v: '💉', b: 'Louis Pasteur', f: ['Marie Curie', 'Thomas Edison', 'Victor Hugo'] },
    { q: 'Quel aviateur traverse la Manche en avion pour la première fois, en 1909 ?', v: '✈️', b: 'Louis Blériot', f: ['Neil Armstrong', 'Gustave Eiffel', 'Christophe Colomb'] },
    { q: 'Pour quel grand événement la tour Eiffel est-elle construite en 1889 ?', v: '🗼', b: 'L\'Exposition universelle', f: ['Les Jeux olympiques', 'Le couronnement d\'un roi', 'La fin de la guerre'] },
    { q: 'Quelle énergie se répand dans les villes à la fin du XIXe siècle et éclaire les rues ?', v: '⚡', b: 'L\'électricité', f: ['Le nucléaire', 'L\'énergie solaire', 'Le vent'] },
    { q: 'En quelle année ouvre la première ligne du métro de Paris ?', v: '🚇', b: '1900', f: ['1789', '1850', '1950'] },
    { q: 'Quels nouveaux commerces apparaissent dans les grandes villes, comme le Bon Marché à Paris ?', v: '🛍️', b: 'Les grands magasins', f: ['Les supermarchés en ligne', 'Les marchés du Moyen Âge', 'Les foires gauloises'] },
    { q: 'Quel écrivain a raconté la vie difficile des mineurs dans le roman Germinal ?', v: '📚', b: 'Émile Zola', f: ['Jules Verne', 'Molière', 'Jean de La Fontaine'] },
    { q: 'Sous Napoléon III, quel préfet transforme Paris avec de larges avenues ?', v: '🏙️', b: 'Le baron Haussmann', f: ['Gustave Eiffel', 'Jules Ferry', 'Louis Pasteur'] },
    { q: 'Quel écrivain imagine des voyages extraordinaires comme Vingt Mille Lieues sous les mers ?', v: '🐙', b: 'Jules Verne', f: ['Émile Zola', 'Victor Hugo', 'Charles Perrault'] },
    { q: 'Au XIXe siècle, les ouvriers travaillent souvent…', v: '⏰', b: 'plus de 12 heures par jour', f: ['4 heures par jour', 'seulement le week-end', 'un jour sur deux'] }
  ];
  const GUERRES = [
    { q: 'En quelles années a lieu la Première Guerre mondiale ?', v: '🪖', b: '1914-1918', f: ['1870-1871', '1939-1945', '1789-1799'] },
    { q: 'Comment surnomme-t-on les soldats français de la Première Guerre mondiale ?', v: '🪖', b: 'Les poilus', f: ['Les hussards', 'Les résistants', 'Les chevaliers'] },
    { q: 'Dans quoi vivent les soldats sur le front pendant la Première Guerre mondiale ?', v: '🪖', b: 'Dans des tranchées', f: ['Dans des châteaux forts', 'Dans des igloos', 'Dans des tentes de luxe'] },
    { q: 'Quelle terrible bataille a lieu en 1916 dans l\'est de la France ?', v: '💥', b: 'La bataille de Verdun', f: ['La bataille d\'Alésia', 'La bataille de Marignan', 'La bataille de Waterloo'] },
    { q: 'À quelle date l\'armistice de la Première Guerre mondiale est-il signé ?', v: '🕊️', b: 'Le 11 novembre 1918', f: ['Le 14 juillet 1918', 'Le 8 mai 1945', 'Le 1er janvier 1914'] },
    { q: 'Quel pays est l\'ennemi principal de la France pendant les deux guerres mondiales ?', b: 'L\'Allemagne', f: ['L\'Angleterre', 'Les États-Unis', 'L\'Espagne'] },
    { q: 'Quel monument trouve-t-on dans presque chaque commune de France depuis la Première Guerre mondiale ?', v: '🗿', b: 'Un monument aux morts', f: ['Une tour Eiffel', 'Un arc de triomphe', 'Un château fort'] },
    { q: 'Environ combien de soldats français sont morts pendant la Première Guerre mondiale ?', b: 'Environ 1,4 million', f: ['Environ 14 000', 'Environ 140', 'Environ 140 millions'] },
    { q: 'Comment appelait-on les soldats revenus de la guerre avec le visage abîmé ?', b: 'Les gueules cassées', f: ['Les poilus', 'Les sans-culottes', 'Les hussards noirs'] },
    { q: 'En quelles années a lieu la Seconde Guerre mondiale ?', v: '✈️', b: '1939-1945', f: ['1914-1918', '1870-1871', '1958-1962'] },
    { q: 'Qui dirige l\'Allemagne nazie pendant la Seconde Guerre mondiale ?', b: 'Adolf Hitler', f: ['Napoléon III', 'Guillaume Ier', 'Charles de Gaulle'] },
    { q: 'Depuis Londres, qui lance un appel à continuer le combat le 18 juin 1940 ?', v: '📻', b: 'Le général de Gaulle', f: ['Le maréchal Pétain', 'Jules Ferry', 'Jean Jaurès'] },
    { q: 'Qui dirige le régime de Vichy, qui collabore avec l\'Allemagne ?', b: 'Le maréchal Pétain', f: ['Le général de Gaulle', 'Jean Moulin', 'Clemenceau'] },
    { q: 'Comment appelle-t-on les Français qui luttent en secret contre l\'occupant ?', v: '✊', b: 'Les résistants', f: ['Les poilus', 'Les collaborateurs', 'Les chevaliers'] },
    { q: 'Quel grand résistant a unifié la Résistance intérieure française ?', b: 'Jean Moulin', f: ['Jules Ferry', 'Philippe Pétain', 'Louis Blériot'] },
    { q: 'Comment appelle-t-on l\'extermination des Juifs d\'Europe par les nazis ?', b: 'La Shoah', f: ['L\'exode rural', 'L\'armistice', 'La Libération'] },
    { q: 'Environ combien de Juifs ont été assassinés pendant la Shoah ?', b: 'Environ 6 millions', f: ['Environ 6 000', 'Environ 60 000', 'Environ 600'] },
    { q: 'Quelle jeune fille juive a écrit un célèbre journal en se cachant à Amsterdam ?', v: '📔', b: 'Anne Frank', f: ['Marie Curie', 'Simone Veil', 'Jeanne d\'Arc'] },
    { q: 'Comment appelle-t-on les personnes qui ont caché et sauvé des Juifs au péril de leur vie ?', v: '🤝', b: 'Les Justes', f: ['Les poilus', 'Les collaborateurs', 'Les députés'] },
    { q: 'Où a lieu le débarquement allié du 6 juin 1944 ?', v: '🚢', b: 'En Normandie', f: ['En Provence', 'En Bretagne', 'À Paris'] },
    { q: 'En quel mois de 1944 Paris est-il libéré ?', v: '🇫🇷', b: 'En août', f: ['En janvier', 'En mai', 'En décembre'] },
    { q: 'À quelle date l\'Allemagne capitule-t-elle en Europe, à la fin de la Seconde Guerre mondiale ?', v: '🕊️', b: 'Le 8 mai 1945', f: ['Le 11 novembre 1918', 'Le 14 juillet 1945', 'Le 6 juin 1944'] },
    { q: 'Quelle organisation est créée en 1945 pour maintenir la paix dans le monde ?', v: '🌍', b: 'L\'ONU', f: ['L\'Union européenne', 'La Croix-Rouge', 'Les Jeux olympiques'] }
  ];

  /* ======================= GÉOGRAPHIE ======================= */
  const DEPLACER = [
    { q: 'En quelle année la première ligne de TGV, entre Paris et Lyon, a-t-elle été inaugurée ?', v: '🚄', b: '1981', f: ['1900', '1950', '2010'] },
    { q: 'À quelle vitesse roule environ un TGV sur une ligne à grande vitesse ?', v: '🚄', b: 'Environ 300 km/h', f: ['Environ 30 km/h', 'Environ 100 km/h', 'Environ 1 000 km/h'] },
    { q: 'Quel tunnel relie la France et l\'Angleterre depuis 1994 ?', v: '🚇', b: 'Le tunnel sous la Manche', f: ['Le tunnel du Mont-Blanc', 'Le tunnel de Fréjus', 'Le tunnel de la mer du Nord'] },
    { q: 'Quel est le plus grand aéroport de France ?', v: '✈️', b: 'Paris-Charles-de-Gaulle', f: ['Nice-Côte d\'Azur', 'Lyon-Saint-Exupéry', 'Toulouse-Blagnac'] },
    { q: 'Le réseau des autoroutes et des TGV en France a la forme d\'une étoile autour de…', v: '⭐', b: 'Paris', f: ['Lyon', 'Marseille', 'Bordeaux'] },
    { q: 'Quel moyen de transport rejette le moins de CO2 pour un voyage de Paris à Lyon ?', v: '🌱', b: 'Le train', f: ['L\'avion', 'La voiture avec une seule personne', 'Le camion'] },
    { q: 'Partager sa voiture avec d\'autres personnes qui font le même trajet, c\'est…', v: '🚗', b: 'le covoiturage', f: ['le transport en commun', 'l\'autostop interdit', 'le fret'] },
    { q: 'Quel moyen de transport est le plus utilisé pour transporter des marchandises à travers les océans ?', v: '🚢', b: 'Le porte-conteneurs', f: ['L\'avion', 'Le train', 'Le camion'] },
    { q: 'Pour traverser l\'océan Atlantique en quelques heures, on prend…', v: '🌊', b: 'l\'avion', f: ['le TGV', 'le car', 'le vélo'] },
    { q: 'Par où passent la plupart des données d\'Internet entre les continents ?', v: '🌐', b: 'Par des câbles sous les océans', f: ['Par la poste', 'Par des pigeons voyageurs', 'Par des tunnels de métro'] },
    { q: 'Grâce à quoi un GPS sait-il où l\'on se trouve ?', v: '🛰️', b: 'Grâce à des satellites', f: ['Grâce à la Lune', 'Grâce aux nuages', 'Grâce à une boussole'] },
    { q: 'Comment appelle-t-on un message envoyé par Internet ?', v: '📧', b: 'Un courriel (un e-mail)', f: ['Un télégramme', 'Un colis', 'Un fax'] },
    { q: 'Pourquoi n\'est-il pas la même heure partout sur la Terre ?', v: '🌍', b: 'Parce que la Terre tourne et que le Soleil n\'en éclaire qu\'une moitié', f: ['Parce que les montres sont mal réglées', 'Parce que chaque pays choisit au hasard', 'Parce que la Lune cache le Soleil'] },
    { q: 'Quel est le premier port de commerce de France ?', v: '⚓', b: 'Marseille', f: ['Brest', 'Lyon', 'Strasbourg'] },
    { q: 'Qu\'est-ce qu\'un écoquartier ?', v: '🏘️', b: 'Un quartier conçu pour respecter l\'environnement', f: ['Un quartier sans habitants', 'Un quartier réservé aux voitures', 'Un quartier construit dans l\'eau'] },
    { q: 'Dans quelle poubelle met-on les bouteilles en verre ?', v: '♻️', b: 'Dans le conteneur à verre', f: ['Dans le compost', 'Dans la nature', 'Dans les toilettes'] },
    { q: 'Que peut-on mettre dans un composteur ?', v: '🍂', b: 'Des épluchures de fruits et légumes', f: ['Des piles', 'Des bouteilles en plastique', 'Des canettes'] },
    { q: 'Pourquoi isoler les murs et les toits des maisons ?', v: '🏠', b: 'Pour moins chauffer et économiser l\'énergie', f: ['Pour que la maison soit plus bruyante', 'Pour faire entrer le froid', 'Pour agrandir les fenêtres'] },
    { q: 'Dans une ville durable, que crée-t-on pour encourager le vélo ?', v: '🚲', b: 'Des pistes cyclables', f: ['Des autoroutes', 'Des parkings géants', 'Des aéroports'] },
    { q: 'Dans quel type de lieu vit la majorité des Français ?', v: '🏙️', b: 'En ville', f: ['À la montagne', 'Sur des îles', 'Dans des fermes isolées'] }
  ];
  const UE = [['l\'Allemagne', 'Berlin', '🇩🇪'], ['l\'Autriche', 'Vienne', '🇦🇹'], ['la Belgique', 'Bruxelles', '🇧🇪'], ['la Bulgarie', 'Sofia', '🇧🇬'], ['Chypre', 'Nicosie', '🇨🇾'],
    ['la Croatie', 'Zagreb', '🇭🇷'], ['le Danemark', 'Copenhague', '🇩🇰'], ['l\'Espagne', 'Madrid', '🇪🇸'], ['l\'Estonie', 'Tallinn', '🇪🇪'], ['la Finlande', 'Helsinki', '🇫🇮'],
    ['la France', 'Paris', '🇫🇷'], ['la Grèce', 'Athènes', '🇬🇷'], ['la Hongrie', 'Budapest', '🇭🇺'], ['l\'Irlande', 'Dublin', '🇮🇪'], ['l\'Italie', 'Rome', '🇮🇹'],
    ['la Lettonie', 'Riga', '🇱🇻'], ['la Lituanie', 'Vilnius', '🇱🇹'], ['le Luxembourg', 'Luxembourg', '🇱🇺'], ['Malte', 'La Valette', '🇲🇹'], ['les Pays-Bas', 'Amsterdam', '🇳🇱'],
    ['la Pologne', 'Varsovie', '🇵🇱'], ['le Portugal', 'Lisbonne', '🇵🇹'], ['la République tchèque', 'Prague', '🇨🇿'], ['la Roumanie', 'Bucarest', '🇷🇴'], ['la Slovaquie', 'Bratislava', '🇸🇰'],
    ['la Slovénie', 'Ljubljana', '🇸🇮'], ['la Suède', 'Stockholm', '🇸🇪']];
  const CONNUS = ['l\'Allemagne', 'la Belgique', 'l\'Espagne', 'l\'Italie', 'le Portugal', 'la Grèce', 'les Pays-Bas', 'la Pologne', 'la Suède', 'l\'Autriche', 'l\'Irlande', 'le Danemark', 'la Finlande', 'la Hongrie', 'la République tchèque', 'la Roumanie', 'la Croatie'];
  const HORS_UE = ['la Suisse', 'la Norvège', 'l\'Islande', 'la Serbie', 'l\'Albanie', 'le Maroc', 'le Canada', 'le Japon'];
  const CONTINENTS = [['l\'Égypte', 'l\'Afrique'], ['le Maroc', 'l\'Afrique'], ['le Sénégal', 'l\'Afrique'], ['Madagascar', 'l\'Afrique'], ['le Brésil', 'l\'Amérique'], ['le Canada', 'l\'Amérique'],
    ['le Mexique', 'l\'Amérique'], ['l\'Argentine', 'l\'Amérique'], ['le Japon', 'l\'Asie'], ['la Chine', 'l\'Asie'], ['l\'Inde', 'l\'Asie'], ['le Viêt Nam', 'l\'Asie'],
    ['l\'Australie', 'l\'Océanie'], ['la Nouvelle-Zélande', 'l\'Océanie'], ['la Norvège', 'l\'Europe'], ['la Pologne', 'l\'Europe']];
  const NOMS_CONT = ['l\'Afrique', 'l\'Amérique', 'l\'Asie', 'l\'Océanie', 'l\'Europe', 'l\'Antarctique'];
  const MONDE = [
    { q: 'Combien de continents compte-t-on habituellement à l\'école en France ?', v: '🌍', b: '6', f: ['2', '3', '12'] },
    { q: 'Combien y a-t-il d\'océans ?', v: '🌊', b: '5', f: ['2', '7', '12'] },
    { q: 'Quel océan sépare l\'Europe de l\'Amérique ?', v: '🌊', b: 'L\'océan Atlantique', f: ['L\'océan Pacifique', 'L\'océan Indien', 'L\'océan Arctique'] },
    { q: 'Quel est le plus grand océan du monde ?', v: '🌊', b: 'L\'océan Pacifique', f: ['L\'océan Atlantique', 'L\'océan Indien', 'L\'océan Arctique'] },
    { q: 'Quel océan entoure le pôle Nord ?', v: '🧊', b: 'L\'océan Arctique', f: ['L\'océan Indien', 'L\'océan Austral', 'L\'océan Pacifique'] },
    { q: 'Quel continent se trouve autour du pôle Sud ?', v: '🐧', b: 'L\'Antarctique', f: ['L\'Océanie', 'L\'Afrique', 'L\'Asie'] },
    { q: 'Quelle est la plus haute montagne du monde ?', v: '🏔️', b: 'L\'Everest', f: ['Le mont Blanc', 'Le Kilimandjaro', 'Le mont Fuji'] },
    { q: 'Quel est le plus grand pays du monde par sa superficie ?', v: '🗺️', b: 'La Russie', f: ['La France', 'Le Brésil', 'L\'Australie'] },
    { q: 'Quel est le plus grand désert chaud du monde ?', v: '🐪', b: 'Le Sahara', f: ['Le Gobi', 'L\'Atacama', 'La Beauce'] },
    { q: 'Combien de pays font partie de l\'Union européenne ?', v: '🇪🇺', b: '27', f: ['12', '6', '50'] },
    { q: 'Quelle ligne imaginaire partage la Terre en deux hémisphères, Nord et Sud ?', v: '🌐', b: 'L\'équateur', f: ['Le méridien de Greenwich', 'Le tropique du Cancer', 'La frontière'] },
    { q: 'Dans quelle ville siège le Parlement européen ?', v: '🇪🇺', b: 'Strasbourg', f: ['Paris', 'Rome', 'Madrid'] }
  ];
  const tireMonde = tirage(MONDE);
  const genEurope = () => {
    const t = alea(0, 4);
    if (t === 0) { const [p, c, e] = pioche(UE.filter(x => CONNUS.includes(x[0]))); return qcm({ visuel: e, enonce: `Quelle est la capitale ${/^le /.test(p) ? p.replace(/^le /, 'du ') : /^les /.test(p) ? p.replace(/^les /, 'des ') : 'de ' + p} ?` }, c, UE.map(x => x[1])); }
    if (t === 1) { const [p, c, e] = pioche(UE.filter(x => CONNUS.includes(x[0]) && x[1] !== 'Luxembourg')); return qcm({ visuel: '🏙️', enonce: `${c} est la capitale de quel pays ?` }, p.replace(/^./, m => m.toUpperCase()), UE.filter(x => CONNUS.includes(x[0])).map(x => x[0].replace(/^./, m => m.toUpperCase()))); }
    if (t === 2) { const [p] = pioche(UE); return qcm({ visuel: '🇪🇺', enonce: 'Lequel de ces pays fait partie de l\'Union européenne ?' }, p.replace(/^./, m => m.toUpperCase()), HORS_UE.map(x => x.replace(/^./, m => m.toUpperCase()))); }
    if (t === 3) { const [p, c] = pioche(CONTINENTS); return qcm({ visuel: '🌍', enonce: `Sur quel continent se trouve ${p} ?` }, c.replace(/^./, m => m.toUpperCase()), NOMS_CONT.map(x => x.replace(/^./, m => m.toUpperCase()))); }
    const it = tireMonde();
    return qcm({ visuel: it.v || '', enonce: it.q }, it.b, it.f);
  };

  /* ======================= SCIENCES ======================= */
  const RENOUV = ['le soleil', 'le vent', 'la force de l\'eau des rivières', 'la chaleur de la Terre (géothermie)', 'le bois des forêts gérées', 'les marées'];
  const NON_RENOUV = ['le pétrole', 'le charbon', 'le gaz naturel', 'l\'uranium'];
  const ENERGIE = [
    { q: 'Pour qu\'une lampe s\'allume, le circuit électrique doit être…', v: '💡', b: 'fermé, sans coupure', f: ['ouvert', 'coupé en deux', 'relié à un seul fil'] },
    { q: 'Quel matériau est un bon conducteur d\'électricité ?', v: '⚡', b: 'Le cuivre', f: ['Le plastique', 'Le bois sec', 'Le verre'] },
    { q: 'Quel matériau est un isolant électrique ?', v: '🔌', b: 'Le plastique', f: ['Le cuivre', 'L\'aluminium', 'Le fer'] },
    { q: 'Pourquoi les fils électriques sont-ils entourés de plastique ?', v: '🔌', b: 'Parce que le plastique est un isolant qui protège', f: ['Pour faire joli', 'Pour que le courant aille plus vite', 'Pour qu\'ils soient plus lourds'] },
    { q: 'Relier directement les deux bornes d\'une pile avec un fil, c\'est dangereux : c\'est…', v: '🔋', b: 'un court-circuit', f: ['un circuit fermé normal', 'un interrupteur', 'une ampoule'] },
    { q: 'Pourquoi ne faut-il jamais jouer avec les prises électriques de la maison ?', v: '⚠️', b: 'Le courant du secteur peut électrocuter et tuer', f: ['Elles sont fragiles', 'Cela use l\'électricité', 'Cela fait du bruit'] },
    { q: 'Quel objet permet d\'ouvrir ou de fermer un circuit électrique ?', v: '🎚️', b: 'L\'interrupteur', f: ['La pile', 'L\'ampoule', 'Le fil'] },
    { q: 'Une pile transforme de l\'énergie chimique en énergie…', v: '🔋', b: 'électrique', f: ['solaire', 'éolienne', 'nucléaire'] },
    { q: 'Un panneau solaire photovoltaïque transforme la lumière en…', v: '☀️', b: 'électricité', f: ['pétrole', 'eau', 'vent'] },
    { q: 'Quand on mélange du sucre dans l\'eau et qu\'on ne le voit plus, on obtient…', v: '🥤', b: 'une solution (mélange homogène)', f: ['un mélange hétérogène', 'de la glace', 'du sable'] },
    { q: 'On ajoute du sel dans l\'eau jusqu\'à ce qu\'il ne se dissolve plus. La solution est…', v: '🧂', b: 'saturée', f: ['vide', 'gelée', 'évaporée'] },
    { q: 'L\'eau boueuse repose : la terre tombe au fond. Comment s\'appelle cette technique ?', v: '🫙', b: 'La décantation', f: ['La dissolution', 'L\'ébullition', 'La fusion'] },
    { q: 'Quelle technique permet de séparer le sable de l\'eau avec un papier spécial ?', v: '☕', b: 'La filtration', f: ['La dissolution', 'La condensation', 'La décantation seulement'] },
    { q: 'Comment récupérer le sel de l\'eau de mer ?', v: '🌊', b: 'En faisant évaporer l\'eau', f: ['En filtrant l\'eau', 'En congelant l\'eau', 'En secouant l\'eau'] },
    { q: 'Sur un vélo, qu\'est-ce qui transmet le mouvement des pédales à la roue arrière ?', v: '🚲', b: 'La chaîne', f: ['Le guidon', 'La selle', 'Le frein'] },
    { q: 'Deux roues dentées qui s\'emboîtent pour transmettre un mouvement forment…', v: '⚙️', b: 'un engrenage', f: ['un circuit', 'un aimant', 'un levier'] },
    { q: 'Dans une centrale nucléaire, quel combustible produit la chaleur ?', v: '🏭', b: 'L\'uranium', f: ['Le bois', 'Le vent', 'Le sel'] },
    { q: 'Pourquoi faut-il économiser l\'énergie ?', v: '🌍', b: 'Pour préserver les ressources et polluer moins', f: ['Parce que l\'énergie est gratuite', 'Pour user les appareils', 'Ça ne sert à rien'] }
  ];
  function circuit() {
    const cas = pioche(['ok', 'ok', 'ouvert', 'coupe', 'court']), allume = cas === 'ok';
    const L = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${TRAIT} stroke-linecap="round"/>`;
    let d = L(15, 25, 42, 25) + L(58, 25, 85, 25) + L(85, 25, 85, 45) + L(85, 61, 85, 80) + L(15, 80, 15, 62) + L(15, 42, 15, 25);
    d += cas === 'coupe' ? L(85, 80, 58, 80) + L(44, 80, 15, 80) : L(85, 80, 15, 80);
    d += `<rect x="9" y="42" width="12" height="20" rx="2" fill="#f5c542" stroke="currentColor" stroke-width="1.5"/>${texte(15, 50, '+', 'middle', 7, '#333')}${texte(15, 59, '−', 'middle', 7, '#333')}`;
    d += `<circle cx="50" cy="25" r="8" fill="${allume ? '#ffe066' : 'rgba(255,255,255,.85)'}" stroke="currentColor" stroke-width="1.5"/><path d="M45 20 L55 30 M55 20 L45 30" stroke="#333" stroke-width="1"/>`;
    if (allume) d += `<path d="M50 13 V7 M40 16 L36 12 M60 16 L64 12" stroke="#f5a623" stroke-width="1.5"/>`;
    d += `<circle cx="85" cy="45" r="1.8" fill="currentColor"/><circle cx="85" cy="61" r="1.8" fill="currentColor"/>`;
    d += cas === 'ouvert' ? L(85, 61, 95, 49) : L(85, 61, 85, 45);
    if (cas === 'court') d += `<path d="M36 25 Q50 48 64 25" fill="none" stroke="${ROUGE}" stroke-width="2"/>`;
    return { d, allume, cas };
  }
  const tireEnergie = tirage(ENERGIE);
  const genEnergie = () => {
    const t = alea(0, 5);
    if (t === 0) {
      const { d, allume, cas } = circuit();
      return { visuel: svg(d), enonce: 'La lampe s\'allume-t-elle ?', aide: cas === 'court' ? 'Le fil rouge relie directement les deux côtés de la lampe.' : 'Le courant doit pouvoir faire tout le tour du circuit.', choix: ['oui', 'non'], bonne: allume ? 'oui' : 'non' };
    }
    if (t === 1) {
      const ren = Math.random() < 0.5;
      if (ren) return qcm({ visuel: '♻️', enonce: 'Quelle source d\'énergie est renouvelable ?' }, pioche(RENOUV), NON_RENOUV);
      return qcm({ visuel: '🛢️', enonce: 'Quelle source d\'énergie n\'est PAS renouvelable ?' }, pioche(NON_RENOUV), RENOUV);
    }
    const it = tireEnergie();
    return qcm({ visuel: it.v || '', enonce: it.q }, it.b, it.f);
  };
  const VIVANT = [
    { q: 'De quoi tous les êtres vivants sont-ils constitués ?', v: '🔬', b: 'De cellules', f: ['De pierres', 'De plastique', 'D\'atomes de métal seulement'] },
    { q: 'Quel instrument permet d\'observer des cellules ?', v: '🔬', b: 'Le microscope', f: ['Le télescope', 'La loupe de poche seulement', 'Le thermomètre'] },
    { q: 'Quel animal est un mammifère ?', v: '🦇', b: 'La chauve-souris', f: ['Le pingouin', 'Le requin', 'La tortue'] },
    { q: 'Qu\'ont en commun les oiseaux, les poissons, les reptiles et les mammifères ?', v: '🦴', b: 'Un squelette interne avec une colonne vertébrale', f: ['Des plumes', 'Des écailles', 'Six pattes'] },
    { q: 'Quel animal a des écailles et respire dans l\'eau grâce à des branchies ?', v: '🐟', b: 'Le poisson', f: ['Le dauphin', 'La baleine', 'La grenouille adulte'] },
    { q: 'La baleine respire…', v: '🐋', b: 'avec des poumons, en remontant à la surface', f: ['avec des branchies', 'par la peau seulement', 'sans jamais respirer'] },
    { q: 'Un animal dont le petit se développe dans le ventre de sa mère est…', v: '🤰', b: 'vivipare', f: ['ovipare', 'herbivore', 'invertébré'] },
    { q: 'Un animal qui pond des œufs est…', v: '🥚', b: 'ovipare', f: ['vivipare', 'carnivore', 'mammifère'] },
    { q: 'Quelle partie de la fleur devient le fruit ?', v: '🌸', b: 'L\'ovaire, au cœur du pistil', f: ['Les pétales', 'La tige', 'Les racines'] },
    { q: 'Que contient un fruit, qui permet de donner une nouvelle plante ?', v: '🍎', b: 'Des graines', f: ['Des feuilles', 'Des racines', 'Des pétales'] },
    { q: 'Dans quel ordre les aliments passent-ils dans le tube digestif ?', v: '🍽️', b: 'bouche, œsophage, estomac, intestin grêle, gros intestin', f: ['bouche, estomac, œsophage, gros intestin, intestin grêle', 'bouche, poumons, estomac, intestin', 'estomac, bouche, œsophage, intestin'] },
    { q: 'Où les nutriments passent-ils dans le sang ?', v: '🩸', b: 'Dans l\'intestin grêle', f: ['Dans la bouche', 'Dans l\'œsophage', 'Dans les poumons'] },
    { q: 'Dans la bouche, quel liquide commence à transformer les aliments ?', v: '👄', b: 'La salive', f: ['Le sang', 'Le lait', 'La sueur'] },
    { q: 'Quel gaz de l\'air nos poumons font-ils passer dans le sang ?', v: '🫁', b: 'L\'oxygène', f: ['Le dioxyde de carbone', 'La vapeur d\'eau', 'L\'hélium'] },
    { q: 'Quel gaz rejetons-nous en expirant, en plus grande quantité que dans l\'air inspiré ?', v: '💨', b: 'Le dioxyde de carbone', f: ['L\'oxygène', 'L\'hélium', 'Le gaz naturel'] },
    { q: 'Par quel tuyau l\'air descend-il de la bouche et du nez jusqu\'aux poumons ?', v: '🫁', b: 'La trachée', f: ['L\'œsophage', 'L\'intestin', 'Une veine'] },
    { q: 'Quels vaisseaux sanguins transportent le sang du cœur vers les organes ?', v: '🫀', b: 'Les artères', f: ['Les veines', 'Les nerfs', 'Les muscles'] },
    { q: 'Quels vaisseaux ramènent le sang des organes vers le cœur ?', v: '🫀', b: 'Les veines', f: ['Les artères', 'Les os', 'Les tendons'] },
    { q: 'Quand on court, le cœur…', v: '🏃', b: 'bat plus vite', f: ['s\'arrête', 'bat plus lentement', 'ne change pas'] },
    { q: 'Quels aliments donnent surtout de l\'énergie pour la journée ?', v: '🍝', b: 'Les féculents (pâtes, riz, pain)', f: ['Les bonbons', 'Le sel', 'Les boissons sucrées'] },
    { q: 'Quels aliments apportent le calcium pour les os ?', v: '🧀', b: 'Les produits laitiers', f: ['Les frites', 'Les bonbons', 'Les chips'] },
    { q: 'Combien de portions de fruits et légumes conseille-t-on de manger par jour ?', v: '🥦', b: 'Au moins 5', f: ['Aucune', '1 par semaine', '20'] },
    { q: 'Quelle est la seule boisson indispensable à notre corps ?', v: '💧', b: 'L\'eau', f: ['Le soda', 'Le jus de fruits', 'Le sirop'] },
    { q: 'Combien d\'heures un enfant de 10 ans devrait-il dormir par nuit ?', v: '😴', b: 'Environ 10 heures', f: ['Environ 4 heures', 'Environ 6 heures', 'Environ 16 heures'] },
    { q: 'Quels aliments aident à construire les muscles ?', v: '🥚', b: 'Ceux qui contiennent des protéines (viande, poisson, œufs, lentilles)', f: ['Les sucreries', 'Le beurre seulement', 'Les boissons gazeuses'] }
  ];
  const PLANETES = ['Mercure', 'Vénus', 'la Terre', 'Mars', 'Jupiter', 'Saturne', 'Uranus', 'Neptune'];
  const CIEL = [
    { q: 'Le Soleil est…', v: '☀️', b: 'une étoile', f: ['une planète', 'un satellite', 'une comète'] },
    { q: 'Quelle planète est surnommée la « planète rouge » ?', v: '🔴', b: 'Mars', f: ['Vénus', 'Jupiter', 'Neptune'] },
    { q: 'Quelle planète est célèbre pour ses grands anneaux bien visibles ?', v: '🪐', b: 'Saturne', f: ['Mars', 'Mercure', 'Vénus'] },
    { q: 'Quelle est la plus grande planète du système solaire ?', v: '🪐', b: 'Jupiter', f: ['La Terre', 'Saturne', 'Neptune'] },
    { q: 'Quelle planète est la plus chaude, à cause de son atmosphère très épaisse ?', v: '🔥', b: 'Vénus', f: ['Mercure', 'Mars', 'Neptune'] },
    { q: 'Quelles planètes sont rocheuses ?', v: '🪨', b: 'Mercure, Vénus, la Terre et Mars', f: ['Jupiter, Saturne, Uranus et Neptune', 'Toutes les planètes', 'Aucune planète'] },
    { q: 'Depuis 2006, Pluton n\'est plus une planète mais…', v: '🧊', b: 'une planète naine', f: ['une étoile', 'un satellite de la Terre', 'une comète'] },
    { q: 'Pourquoi la Lune brille-t-elle la nuit ?', v: '🌕', b: 'Elle renvoie la lumière du Soleil', f: ['Elle produit sa propre lumière', 'Elle est en feu', 'Elle reflète les lumières des villes'] },
    { q: 'Combien de temps dure environ un cycle complet des phases de la Lune ?', v: '🌗', b: 'Environ un mois (29 jours et demi)', f: ['Un jour', 'Une semaine', 'Un an'] },
    { q: 'Comment appelle-t-on la phase où l\'on ne voit pas du tout la Lune ?', v: '🌑', b: 'La nouvelle lune', f: ['La pleine lune', 'Le premier quartier', 'Le croissant'] },
    { q: 'Lors d\'une éclipse de Soleil, qu\'est-ce qui se place entre le Soleil et la Terre ?', v: '🌒', b: 'La Lune', f: ['Mars', 'Un nuage', 'Jupiter'] },
    { q: 'Qu\'est-ce qui cause les saisons sur la Terre ?', v: '🌍', b: 'L\'inclinaison de l\'axe de la Terre', f: ['La distance à la Lune', 'Les nuages', 'La vitesse du vent'] },
    { q: 'Combien de temps met la lumière du Soleil pour arriver jusqu\'à la Terre ?', v: '☀️', b: 'Environ 8 minutes', f: ['Environ 8 secondes', 'Environ 8 jours', 'Environ 8 ans'] },
    { q: 'Qui a été le premier homme à voyager dans l\'espace, en 1961 ?', v: '🚀', b: 'Youri Gagarine', f: ['Neil Armstrong', 'Thomas Pesquet', 'Christophe Colomb'] },
    { q: 'Qu\'est-ce qui retient les planètes autour du Soleil ?', v: '🧲', b: 'La gravitation', f: ['Le vent solaire', 'Des cordes invisibles', 'La lumière'] },
    { q: 'Quelle planète est la seule où l\'on connaît la vie ?', v: '🌍', b: 'La Terre', f: ['Mars', 'Vénus', 'Jupiter'] }
  ];
  const tireVivant = tirage(VIVANT), tireCiel = tirage(CIEL);
  const genVivant = () => { const it = tireVivant(); return qcm({ visuel: it.v || '', enonce: it.q }, it.b, it.f); };
  const genCiel = () => {
    if (Math.random() < 0.4) {
      const i = alea(0, 7), maj = s => s.replace(/^./, m => m.toUpperCase());
      if (Math.random() < 0.5) return qcm({ visuel: '☀️🪐', enonce: `En partant du Soleil, quelle est la ${i === 0 ? '1re' : (i + 1) + 'e'} planète ?` }, maj(PLANETES[i]), PLANETES.map(maj));
      const j = alea(0, 6);
      return qcm({ visuel: '☀️🪐', enonce: `En partant du Soleil, quelle planète vient juste après ${PLANETES[j]} ?` }, maj(PLANETES[j + 1]), PLANETES.filter((_, k) => k !== j).map(maj));
    }
    const it = tireCiel(); return qcm({ visuel: it.v || '', enonce: it.q }, it.b, it.f);
  };

  /* ======================= ANGLAIS ======================= */
  const PAYS_EN = [['l\'Angleterre', 'England', '🇬🇧', 'p'], ['le Royaume-Uni', 'the United Kingdom', '🇬🇧', 'p'], ['l\'Espagne', 'Spain', '🇪🇸', 'p'], ['l\'Allemagne', 'Germany', '🇩🇪', 'p'],
    ['l\'Italie', 'Italy', '🇮🇹', 'p'], ['les États-Unis', 'the United States', '🇺🇸', 'p'], ['la Chine', 'China', '🇨🇳', 'p'], ['le Japon', 'Japan', '🇯🇵', 'p'], ['l\'Irlande', 'Ireland', '🇮🇪', 'p'],
    ['la Grèce', 'Greece', '🇬🇷', 'p'], ['le Mexique', 'Mexico', '🇲🇽', 'p'], ['le Brésil', 'Brazil', '🇧🇷', 'p'], ['l\'Inde', 'India', '🇮🇳', 'p'], ['l\'Écosse', 'Scotland', '🏞️', 'p'],
    ['français (la nationalité)', 'French', '🇫🇷', 'n'], ['anglais (la nationalité)', 'English', '🇬🇧', 'n'], ['espagnol (la nationalité)', 'Spanish', '🇪🇸', 'n'], ['allemand (la nationalité)', 'German', '🇩🇪', 'n'],
    ['italien (la nationalité)', 'Italian', '🇮🇹', 'n'], ['américain (la nationalité)', 'American', '🇺🇸', 'n'], ['chinois (la nationalité)', 'Chinese', '🇨🇳', 'n'], ['japonais (la nationalité)', 'Japanese', '🇯🇵', 'n'],
    ['irlandais (la nationalité)', 'Irish', '🇮🇪', 'n'], ['grec (la nationalité)', 'Greek', '🇬🇷', 'n']];
  const genPaysEn = () => {
    const [fr, en, e, g] = pioche(PAYS_EN);
    const autres = PAYS_EN.filter(x => x[3] === g && x[2] !== e).map(x => x[1]);
    return qcm({ visuel: e, enonce: `Comment dit-on « ${fr} » en anglais ?` }, en, autres);
  };
  const HEURES_EN = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const HEURES_FR = ['une heure', 'deux heures', 'trois heures', 'quatre heures', 'cinq heures', 'six heures', 'sept heures', 'huit heures', 'neuf heures', 'dix heures', 'onze heures', 'midi'];
  function horloge(h, m) {
    const ah = ((h % 12) + m / 60) * 30 * Math.PI / 180, am = m * 6 * Math.PI / 180;
    let d = `<circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.08)" ${TRAIT}/>`;
    for (let i = 1; i <= 12; i++) { const a = i * 30 * Math.PI / 180; d += texte(r1(50 + 35 * Math.sin(a)), r1(50 - 35 * Math.cos(a) + 3), i, 'middle', 9); }
    d += `<line x1="50" y1="50" x2="${r1(50 + 22 * Math.sin(ah))}" y2="${r1(50 - 22 * Math.cos(ah))}" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`;
    d += `<line x1="50" y1="50" x2="${r1(50 + 37 * Math.sin(am))}" y2="${r1(50 - 37 * Math.cos(am))}" stroke="${ROUGE}" stroke-width="2" stroke-linecap="round"/><circle cx="50" cy="50" r="2.5" fill="currentColor"/>`;
    return svg(d, 150);
  }
  const ORD_EN = { 1: 'first', 2: 'second', 3: 'third', 4: 'fourth', 5: 'fifth', 6: 'sixth', 7: 'seventh', 8: 'eighth', 9: 'ninth', 10: 'tenth', 11: 'eleventh', 12: 'twelfth', 20: 'twentieth', 21: 'twenty-first', 22: 'twenty-second', 23: 'twenty-third', 30: 'thirtieth' };
  const CARD_EN = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve', 20: 'twenty', 21: 'twenty-one', 22: 'twenty-two', 23: 'twenty-three', 30: 'thirty' };
  const MOIS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const genHeureEn = () => {
    if (Math.random() < 0.65) {
      const h = alea(1, 11), type = pioche(['pile', 'demie', 'quart', 'moins']), suiv = h + 1;
      const en = { pile: `It's ${HEURES_EN[h - 1]} o'clock.`, demie: `It's half past ${HEURES_EN[h - 1]}.`, quart: `It's quarter past ${HEURES_EN[h - 1]}.`, moins: `It's quarter to ${HEURES_EN[suiv - 1]}.` };
      const fr = { pile: `Il est ${HEURES_FR[h - 1]}.`, demie: `Il est ${HEURES_FR[h - 1]} et demie.`, quart: `Il est ${HEURES_FR[h - 1]} et quart.`, moins: `Il est ${HEURES_FR[suiv - 1]} moins le quart.` }[type];
      const m = { pile: 0, demie: 30, quart: 15, moins: 45 }[type];
      const f = [...Object.values(en), `It's quarter past ${HEURES_EN[suiv - 1]}.`, `It's quarter to ${HEURES_EN[h - 1]}.`, `It's half past ${HEURES_EN[suiv - 1]}.`];
      return qcm({ visuel: horloge(h, m), enonce: `Comment dit-on « ${fr} » en anglais ?` }, en[type], f);
    }
    const j = pioche(Object.keys(ORD_EN).map(Number)); let mo; do { mo = alea(0, 11); } while (mo === 1 && j === 30);
    const moisFr = MOIS[mo], jourFr = j === 1 ? '1er' : String(j);
    const bon = `the ${ORD_EN[j]} of ${MOIS_EN[mo]}`, ords = Object.keys(ORD_EN).map(Number);
    const voisin = ords[(ords.indexOf(j) + 1) % ords.length];
    return qcm({ visuel: '📅', enonce: `Comment dit-on « le ${jourFr} ${moisFr} » en anglais ?` }, bon, [`the ${CARD_EN[j]} of ${MOIS_EN[mo]}`, `the ${ORD_EN[j]} of ${MOIS_EN[(mo + 1) % 12]}`, `the ${ORD_EN[voisin]} of ${MOIS_EN[mo]}`, `the ${ORD_EN[j]} of ${MOIS_EN[(mo + 11) % 12]}`]);
  };
  const PHRASES_EN = [
    ['Comment dit-on « Je sais nager. » en anglais ?', '', 'I can swim.', ['I can\'t swim.', 'I like swimming.', 'I am swimming.']],
    ['Comment dit-on « Sais-tu faire du vélo ? » en anglais ?', '', 'Can you ride a bike?', ['Do you like bikes?', 'Have you got a bike?', 'Can I ride a bike?']],
    ['Comment dit-on « Il y a un chat sous la table. » en anglais ?', '', 'There is a cat under the table.', ['There are cats on the table.', 'It is a cat under the table.', 'There is a cat on the table.']],
    ['Comment dit-on « Il y a trois pommes dans le panier. » en anglais ?', '', 'There are three apples in the basket.', ['There is three apples in the basket.', 'They are three apples in the basket.', 'There are three apples on the basket.']],
    ['Comment dit-on « Elle aime danser. » en anglais ?', '', 'She likes dancing.', ['She like dancing.', 'He likes dancing.', 'She doesn\'t like dancing.']],
    ['Comment dit-on « Il ne joue pas au football. » en anglais ?', '', 'He doesn\'t play football.', ['He don\'t play football.', 'He plays football.', 'She doesn\'t play football.']],
    ['Comment dit-on « D\'où viens-tu ? » en anglais ?', '', 'Where are you from?', ['Where do you live?', 'How are you?', 'Who are you?']],
    ['Comment dit-on « Quelle est ta couleur préférée ? » en anglais ?', '', 'What\'s your favourite colour?', ['What colour is it?', 'What\'s your name?', 'Do you like colours?']],
    ['Comment dit-on « Quel temps fait-il ? » en anglais ?', '', 'What\'s the weather like?', ['What time is it?', 'What day is it?', 'Where is the weather?']],
    ['Comment dit-on « Combien de frères as-tu ? » en anglais ?', '', 'How many brothers have you got?', ['How old is your brother?', 'Have you got a brother?', 'How many sisters have you got?']],
    ['Comment dit-on « Mon père travaille dans un hôpital. » en anglais ?', '', 'My father works in a hospital.', ['My father work in a hospital.', 'My mother works in a hospital.', 'My father is a hospital.']],
    ['Comment dit-on « Je ne sais pas chanter. » en anglais ?', '', 'I can\'t sing.', ['I can sing.', 'I don\'t like singing.', 'I am not singing.']],
    ['Comment dit-on « Nous allons à l\'école à pied. » en anglais ?', '', 'We go to school on foot.', ['We go to school by bus.', 'We are at school.', 'We walk in the park.']],
    ['Que veut dire « There are twenty pupils in my class. » ?', 'There are twenty pupils in my class.', 'Il y a vingt élèves dans ma classe.', ['Il y a douze élèves dans ma classe.', 'Ma classe a vingt tables.', 'Il n\'y a pas d\'élèves dans ma classe.']],
    ['Que veut dire « Can I open the window, please? » ?', 'Can I open the window, please?', 'Est-ce que je peux ouvrir la fenêtre, s\'il vous plaît ?', ['Peux-tu fermer la fenêtre ?', 'Où est la fenêtre ?', 'J\'aime cette fenêtre.']],
    ['Que veut dire « She gets up at seven o\'clock. » ?', 'She gets up at seven o\'clock.', 'Elle se lève à sept heures.', ['Elle se couche à sept heures.', 'Il se lève à sept heures.', 'Elle a sept ans.']],
    ['Que veut dire « I\'m from Scotland. » ?', 'I\'m from Scotland.', 'Je viens d\'Écosse.', ['J\'habite en Irlande.', 'Je vais en Écosse demain.', 'J\'aime l\'Écosse.']],
    ['Que veut dire « He doesn\'t like spinach. » ?', 'He doesn\'t like spinach.', 'Il n\'aime pas les épinards.', ['Il aime les épinards.', 'Elle n\'aime pas les épinards.', 'Il mange des épinards.']],
    ['Que veut dire « What\'s the matter? » ?', 'What\'s the matter?', 'Qu\'est-ce qui ne va pas ?', ['Quelle heure est-il ?', 'Qu\'est-ce que c\'est ?', 'Comment t\'appelles-tu ?']],
    ['Que veut dire « It\'s my turn! » ?', 'It\'s my turn!', 'C\'est mon tour !', ['C\'est mon jouet !', 'J\'ai gagné !', 'Tourne à droite !']],
    ['Que veut dire « My sister can play the piano. » ?', 'My sister can play the piano.', 'Ma sœur sait jouer du piano.', ['Ma sœur n\'aime pas le piano.', 'Mon frère sait jouer du piano.', 'Ma sœur a un piano.']],
    ['Quelle est la bonne réponse à « Can you swim? » ?', 'Can you swim?', 'Yes, I can.', ['Yes, I do.', 'Yes, I am.', 'Yes, it is.']],
    ['Quelle est la bonne réponse à « Do you like football? » ?', 'Do you like football?', 'Yes, I do.', ['Yes, I can.', 'Yes, I am.', 'Yes, it is.']],
    ['Quelle est la bonne réponse à « Where are you from? » ?', 'Where are you from?', 'I\'m from France.', ['I\'m ten.', 'I live in a house.', 'I\'m fine, thank you.']],
    ['Quelle est la bonne réponse à « What\'s the weather like? » ?', 'What\'s the weather like?', 'It\'s sunny.', ['It\'s Monday.', 'It\'s ten o\'clock.', 'It\'s blue.']],
    ['Quelle est la bonne réponse à « Is there a cinema in your town? » ?', 'Is there a cinema in your town?', 'Yes, there is.', ['Yes, there are.', 'Yes, I can.', 'Yes, I do.']],
    ['Quelle est la bonne réponse à « What time is it? » ?', 'What time is it?', 'It\'s half past two.', ['It\'s Tuesday.', 'It\'s sunny.', 'I\'m two.']],
    ['Quelle est la bonne réponse à « When is your birthday? » ?', 'When is your birthday?', 'It\'s on the third of March.', ['I\'m ten years old.', 'It\'s a big cake.', 'Happy birthday!']],
    ['Quelle est la bonne réponse à « What do you do on Saturdays? » ?', 'What do you do on Saturdays?', 'I play tennis.', ['I am tennis.', 'It\'s Saturday.', 'I\'m ten.']],
    ['Quelle est la bonne réponse à « Does your brother like cats? » ?', 'Does your brother like cats?', 'No, he doesn\'t.', ['No, he isn\'t.', 'No, I don\'t.', 'No, he can\'t.']]
  ];
  const tirePhraseEn = tirage(PHRASES_EN);
  const genPhrasesEn = () => {
    const [q, en, b, f] = tirePhraseEn();
    const base = { visuel: '🇬🇧', enonce: q, dire: q };
    if (en) { base.dire = q.replace(/«[^»]*»/, 'ceci'); base.direEn = en; }
    return qcm(base, b, f);
  };

  /* ======================= EMC ======================= */
  const INSTITUTIONS = [
    { q: 'Pour combien d\'années le président de la République est-il élu ?', v: '🗳️', b: '5 ans', f: ['2 ans', '7 ans', '10 ans'] },
    { q: 'Qui nomme le Premier ministre ?', v: '🏛️', b: 'Le président de la République', f: ['Le maire de Paris', 'Les enfants', 'Le roi'] },
    { q: 'Comment s\'appelle l\'ensemble des ministres dirigé par le Premier ministre ?', v: '🏛️', b: 'Le gouvernement', f: ['Le conseil municipal', 'La mairie', 'Le tribunal'] },
    { q: 'Le Parlement français est formé de l\'Assemblée nationale et…', v: '⚖️', b: 'du Sénat', f: ['de la mairie', 'de l\'Élysée', 'du Conseil de classe'] },
    { q: 'Combien y a-t-il de députés à l\'Assemblée nationale ?', v: '🏛️', b: '577', f: ['27', '101', '1 000'] },
    { q: 'Dans quel bâtiment siège l\'Assemblée nationale ?', v: '🏛️', b: 'Le palais Bourbon', f: ['Le palais de l\'Élysée', 'Le château de Versailles', 'Le Louvre'] },
    { q: 'Dans quel bâtiment siège le Sénat ?', v: '🏛️', b: 'Le palais du Luxembourg', f: ['Le palais Bourbon', 'Le palais de l\'Élysée', 'La tour Eiffel'] },
    { q: 'Qui vote les lois en France ?', v: '⚖️', b: 'Le Parlement (députés et sénateurs)', f: ['Le maire', 'Les policiers', 'Le président seul'] },
    { q: 'Quel texte fixe les règles de fonctionnement de la Ve République depuis 1958 ?', v: '📜', b: 'La Constitution', f: ['Le Code de la route', 'Le règlement de l\'école', 'La Déclaration de l\'enfant'] },
    { q: 'Qui élit les conseillers municipaux ?', v: '🗳️', b: 'Les habitants de la commune qui ont le droit de vote', f: ['Le président de la République', 'Les élèves', 'Le préfet'] },
    { q: 'Qui représente l\'État dans chaque département ?', v: '🏛️', b: 'Le préfet', f: ['Le maire', 'Le député', 'Le directeur d\'école'] },
    { q: 'Environ combien de communes compte la France ?', v: '🏘️', b: 'Environ 35 000', f: ['Environ 350', 'Environ 3 500 000', 'Environ 13'] },
    { q: 'Quelles sont les conditions pour voter en France ?', v: '🗳️', b: 'Avoir 18 ans, être français et être inscrit sur les listes', f: ['Avoir 10 ans', 'Être propriétaire', 'Être un homme'] },
    { q: 'Le vote en France est…', v: '🗳️', b: 'secret et personnel', f: ['public et obligatoire', 'réservé aux adultes riches', 'fait à main levée'] },
    { q: 'Quand les citoyens répondent directement par oui ou non à une question, c\'est…', v: '🗳️', b: 'un référendum', f: ['un conseil de classe', 'un procès', 'un sondage'] },
    { q: 'Tous les combien d\'années élit-on les députés européens ?', v: '🇪🇺', b: '5 ans', f: ['1 an', '10 ans', '20 ans'] },
    { q: 'Comment est le drapeau de l\'Union européenne ?', v: '🇪🇺', b: 'Douze étoiles jaunes en cercle sur fond bleu', f: ['Bleu, blanc, rouge', 'Une étoile rouge sur fond blanc', 'Vingt-sept étoiles blanches sur fond vert'] },
    { q: 'Quel est l\'hymne européen ?', v: '🎵', b: 'L\'Ode à la joie de Beethoven', f: ['La Marseillaise', 'Frère Jacques', 'Le Boléro de Ravel'] },
    { q: 'Quelle est la devise de l\'Union européenne ?', v: '🇪🇺', b: '« Unis dans la diversité »', f: ['« Liberté, Égalité, Fraternité »', '« Un pour tous, tous pour un »', '« Toujours plus loin »'] },
    { q: 'Quel jour célèbre-t-on la Journée de l\'Europe ?', v: '🇪🇺', b: 'Le 9 mai', f: ['Le 14 juillet', 'Le 11 novembre', 'Le 1er janvier'] }
  ];
  const CITOYEN = [
    { q: 'Quel texte de 1789 affirme que « les hommes naissent et demeurent libres et égaux en droits » ?', v: '📜', b: 'La Déclaration des droits de l\'homme et du citoyen', f: ['Le Code civil', 'La Constitution de 1958', 'Le règlement intérieur'] },
    { q: 'Lequel de ces éléments est un devoir du citoyen ?', v: '⚖️', b: 'Respecter les lois', f: ['Aller au cinéma', 'Avoir un téléphone', 'Partir en vacances'] },
    { q: 'Traiter quelqu\'un moins bien à cause de son origine, de sa religion ou de son handicap, c\'est…', v: '🚫', b: 'une discrimination, interdite par la loi', f: ['une règle de politesse', 'un droit', 'une tradition'] },
    { q: 'Dans une école publique, que garantit la laïcité ?', v: '🏫', b: 'La liberté de croire ou de ne pas croire, et le respect de tous', f: ['L\'obligation de prier', 'Une seule religion pour tous', 'L\'interdiction de parler de religion en histoire'] },
    { q: 'Quel document, affiché dans les écoles depuis 2013, explique la laïcité ?', v: '📋', b: 'La charte de la laïcité', f: ['Le Code de la route', 'La carte d\'électeur', 'Le carnet de santé'] },
    { q: 'Que faut-il faire avant de publier sur Internet la photo d\'un camarade ?', v: '📸', b: 'Lui demander son accord', f: ['Rien, c\'est permis', 'Le dire après', 'Changer sa couleur'] },
    { q: 'Ton mot de passe, tu dois…', v: '🔐', b: 'le garder secret', f: ['le donner à tes amis', 'l\'écrire sur ton cartable', 'le publier en ligne'] },
    { q: 'Quel mot de passe est le plus sûr ?', v: '🔐', b: 'Chat!Vert7Lune', f: ['123456', 'motdepasse', 'Léo'] },
    { q: 'Une personne rencontrée sur Internet te propose de te voir en vrai. Que fais-tu ?', v: '⚠️', b: 'J\'en parle tout de suite à mes parents', f: ['J\'y vais seul en cachette', 'Je lui donne mon adresse', 'Je n\'en parle à personne'] },
    { q: 'Un message te dit : « Bravo, tu as gagné un téléphone, clique ici ! » C\'est probablement…', v: '🎣', b: 'une arnaque', f: ['un vrai cadeau', 'un message de l\'école', 'une bonne affaire'] },
    { q: 'Quelle information ne faut-il pas donner sur Internet ?', v: '🏠', b: 'Son adresse', f: ['Sa couleur préférée', 'Son animal préféré', 'Le titre de son livre préféré'] },
    { q: 'Quel numéro gratuit peut-on appeler en cas de harcèlement ou de cyberharcèlement ?', v: '📞', b: '3018', f: ['18', '15', '112'] },
    { q: 'Tu lis une information étonnante sur Internet. Que fais-tu avant de la partager ?', v: '🔎', b: 'Je vérifie la source et d\'autres sites sérieux', f: ['Je la partage tout de suite', 'Je la recopie', 'Je l\'envoie à tout le monde'] },
    { q: 'Comment appelle-t-on une fausse information diffusée pour tromper les gens ?', v: '📰', b: 'Une infox (fake news)', f: ['Un reportage', 'Une encyclopédie', 'Un dictionnaire'] },
    { q: 'Au conseil d\'élèves ou au conseil de classe, on peut…', v: '🗣️', b: 'proposer des idées et débattre calmement', f: ['se moquer des autres', 'décider seul pour tout le monde', 'crier plus fort que les autres'] },
    { q: 'Dans un débat, pour bien argumenter, on…', v: '💬', b: 'donne des raisons et écoute les autres', f: ['coupe la parole', 'se moque', 'répète la même chose plus fort'] },
    { q: 'Qui paie l\'école publique, les routes et les hôpitaux ?', v: '💶', b: 'Les impôts payés par les citoyens', f: ['Personne, c\'est gratuit à fabriquer', 'Les enfants', 'Les touristes seulement'] },
    { q: 'Les femmes et les hommes ont…', v: '⚖️', b: 'les mêmes droits', f: ['des droits différents selon leur métier', 'des droits seulement à 30 ans', 'aucun droit'] },
    { q: 'Quel organisme européen permet de circuler librement pour voyager et travailler entre ses pays ?', v: '🇪🇺', b: 'L\'Union européenne', f: ['L\'ONU', 'L\'OTAN', 'La FIFA'] }
  ];

  ajouterMatiere('CM2', { id: 'histoire', titre: 'Histoire', emoji: '🏛️', couleur: '#c77d2e', jeux: [
    { id: 'quiz-republique', titre: 'Le temps de la République', emoji: '🇫🇷', gen: depuisListe(REPUBLIQUE) },
    { id: 'quiz-industrie', titre: 'L\'âge industriel', emoji: '🏭', gen: depuisListe(INDUSTRIE) },
    { id: 'quiz-guerres', titre: 'Les guerres mondiales', emoji: '🕊️', gen: depuisListe(GUERRES) }
  ] });
  ajouterMatiere('CM2', { id: 'geo', titre: 'Géographie', emoji: '🗺️', couleur: '#1fa5a5', jeux: [
    { id: 'quiz-deplacer', titre: 'Se déplacer et habiter', emoji: '🚄', gen: depuisListe(DEPLACER) },
    { id: 'quiz-europe', titre: 'L\'Europe et le monde', emoji: '🇪🇺', gen: genEurope }
  ] });
  ajouterMatiere('CM2', { id: 'sciences', titre: 'Sciences', emoji: '🔬', couleur: '#3bb273', jeux: [
    { id: 'quiz-energie', titre: 'Énergie et matière', emoji: '⚡', gen: genEnergie },
    { id: 'quiz-vivant', titre: 'Le vivant et le corps', emoji: '🫀', gen: genVivant },
    { id: 'quiz-ciel', titre: 'Le Soleil et les planètes', emoji: '🪐', gen: genCiel }
  ] });
  ajouterMatiere('CM2', { id: 'anglais', titre: 'Anglais', emoji: '🇬🇧', couleur: '#8e5cd9', jeux: [
    { id: 'countries-en', titre: 'Countries', emoji: '🌍', gen: genPaysEn },
    { id: 'time-en', titre: 'Time and dates', emoji: '🕒', gen: genHeureEn },
    { id: 'sentences-en', titre: 'Sentences', emoji: '🗨️', gen: genPhrasesEn }
  ] });
  ajouterMatiere('CM2', { id: 'emc', titre: 'Vivre ensemble', emoji: '🤝', couleur: '#d94f9c', jeux: [
    { id: 'quiz-institutions', titre: 'Les institutions', emoji: '🏛️', gen: depuisListe(INSTITUTIONS) },
    { id: 'quiz-citoyen', titre: 'Citoyen et Internet', emoji: '💻', gen: depuisListe(CITOYEN) }
  ] });
})();

// Petits cours du bouton « ? » pour le CM2.
// ---- Maths
cours('CM2/maths/grands-nombres',
  { t: 'Nombre de milliers, de millions', si: /en tout/i, l: [
    'Le <b>chiffre</b> des milliers, c\'est un seul chiffre.',
    'Le <b>nombre</b> de milliers, c\'est tout ce qui est écrit à gauche de la classe des unités.'
  ], ex: 'Dans 5 263 918 : le chiffre des milliers est 3, le nombre de milliers est 5 263.' },
  { t: 'Comparer de grands nombres', si: /plus (grand|petit)/i, l: [
    'Le nombre qui a le plus de chiffres est le plus grand.',
    'S\'ils ont autant de chiffres, compare chiffre par chiffre en partant de la gauche.'
  ], ex: '4 506 312 &lt; 4 560 123 : même début 4 5, puis 0 &lt; 6.' },
  { t: 'Arrondir', si: /Arrondis/i, l: [
    'Repère le rang demandé, puis regarde le chiffre juste à sa droite.',
    'S\'il vaut 0, 1, 2, 3 ou 4 : on garde le rang tel quel. S\'il vaut 5, 6, 7, 8 ou 9 : on ajoute 1 au rang.',
    'Tous les chiffres à droite deviennent des 0.'
  ], ex: '3 627 400 arrondi au million → 4 000 000 (car 6 ≥ 5).' },
  { t: 'Ajouter 100, 1 000, 10 000…', si: /\+/, l: [
    'On ajoute 1 au chiffre du rang concerné.',
    'Si ce chiffre est un 9, il devient 0 et on ajoute une retenue au rang de gauche.'
  ], ex: '2 095 000 + 10 000 = 2 105 000' },
  { t: 'Lire et écrire les grands nombres', l: [
    'On découpe le nombre en <b>classes</b> de 3 chiffres, à partir de la droite : unités, mille, millions, milliards.',
    'Dans chaque classe : centaines, dizaines, unités.',
    'On lit classe par classe, sans oublier les zéros : une classe vide s\'écrit 000.',
    '« Mille » ne prend jamais de s. « Cent » et « vingt » prennent un s s\'ils sont multipliés et terminent le nombre : deux cents, quatre-vingts (mais deux cent trois, deux cent mille).'
  ], ex: '7 080 016 → sept millions quatre-vingt mille seize' });
cours('CM2/maths/decimaux',
  { t: 'Comparer des décimaux', si: /plus (grand|petit)/i, l: [
    'Compare d\'abord la partie entière.',
    'Si elle est égale, compare les dixièmes, puis les centièmes, puis les millièmes.',
    'Attention : un nombre avec plus de chiffres après la virgule n\'est pas forcément plus grand !'
  ], ex: '5,4 &gt; 5,38 car 4 dixièmes &gt; 3 dixièmes.' },
  { t: 'Encadrer un décimal', si: /Encadre|Entre quels/i, l: [
    'Entre deux entiers : prends la partie entière, puis le nombre suivant.',
    'Au dixième : garde un seul chiffre après la virgule, puis ajoute 0,1.'
  ], ex: '6,37 est entre 6 et 7. Au dixième : 6,3 &lt; 6,37 &lt; 6,4.' },
  { t: 'Arrondir un décimal', si: /Arrondis/i, l: [
    'À l\'unité : regarde le chiffre des dixièmes. Au dixième : regarde le chiffre des centièmes.',
    'De 0 à 4 : on garde. De 5 à 9 : on monte au suivant.'
  ], ex: '12,68 arrondi à l\'unité → 13. Au dixième → 12,7.' },
  { t: 'Placer sur une droite graduée', si: /point A/i, l: [
    'Regarde les deux nombres écrits et compte combien de petits intervalles les séparent.',
    'Calcule ce que vaut un intervalle, puis avance depuis le premier nombre.'
  ], ex: 'De 3 à 4 en 10 intervalles : chaque intervalle vaut 0,1. Le 7e trait après 3 → 3,7.' },
  { t: 'Chiffres d\'un nombre décimal', l: [
    'Après la virgule : <b>dixièmes</b>, puis <b>centièmes</b>, puis <b>millièmes</b>.',
    '1/10 = 0,1 · 1/100 = 0,01 · 1/1 000 = 0,001',
    'Autant de zéros au dénominateur que de chiffres après la virgule.'
  ], ex: '8,264 → 8 unités, 2 dixièmes, 6 centièmes, 4 millièmes.<br>8 264/1 000 = 8,264' });
cours('CM2/maths/fractions',
  { t: 'Simplifier une fraction', si: /Simplifie/i, l: [
    'Divise le numérateur et le dénominateur par le <b>même nombre</b>.',
    'Recommence tant que c\'est possible : la fraction est alors la plus simple.'
  ], ex: '18/42 = 9/21 = 3/7 (on divise par 2, puis par 3).' },
  { t: 'Comparer des fractions', si: /plus grande fraction/i, l: [
    'Même dénominateur : la plus grande a le plus grand numérateur.',
    'Même numérateur : la plus grande a le plus petit dénominateur (les parts sont plus grosses).',
    'Sinon, écris-les avec le même dénominateur.'
  ], ex: '5/7 et 11/14 : 5/7 = 10/14, et 10/14 &lt; 11/14.' },
  { t: 'Fraction d\'une quantité', si: /Combien font/i, l: [
    'Divise la quantité par le dénominateur (une part), puis multiplie par le numérateur.'
  ], ex: '3/7 de 28 : 28 ÷ 7 = 4, puis 4 × 3 = 12.' },
  { t: 'Fractions et décimaux', si: /décimal|fraction est égale/i, l: [
    'Une fraction décimale a pour dénominateur 10, 100 ou 1 000 : 7/100 = 0,07.',
    'À connaître : 1/2 = 0,5 · 1/4 = 0,25 · 3/4 = 0,75 · 1/5 = 0,2 · 3/2 = 1,5',
    'Astuce : 3/20 = 15/100 = 0,15.'
  ] },
  { t: 'Ajouter et soustraire des fractions', si: /\+|1 −/, l: [
    'Avec le même dénominateur, on ajoute (ou on soustrait) les numérateurs. Le dénominateur ne change pas.',
    '1 entier, c\'est une fraction dont le numérateur et le dénominateur sont égaux.'
  ], ex: '4/15 + 7/15 = 11/15 · 1 − 4/15 = 11/15' },
  { t: 'Fractions plus grandes que 1', l: [
    'Cherche combien de fois le dénominateur « rentre » dans le numérateur : ce sont les unités entières.',
    'Ce qui reste forme la fraction.'
  ], ex: '25/11 = 2 + 3/11, car 22/11 = 2 et il reste 3/11.' });
cours('CM2/maths/calculs-decimaux',
  { t: 'Multiplier ou diviser par 10, 100, 1 000', si: /[×÷] (10|100|1 000)\b/, l: [
    '× 10 : chaque chiffre prend une valeur 10 fois plus grande (la virgule se déplace d\'un rang vers la droite). × 100 : deux rangs. × 1 000 : trois rangs.',
    '÷ 10, ÷ 100, ÷ 1 000 : chaque chiffre prend une valeur plus petite (la virgule se déplace vers la gauche).',
    'Ajoute des zéros si besoin.'
  ], ex: '4,7 × 100 = 470 · 38 ÷ 1 000 = 0,038' },
  { t: 'Multiplier un décimal par un entier', si: /×/, l: [
    'Calcule comme s\'il n\'y avait pas de virgule.',
    'Mets dans le résultat autant de chiffres après la virgule que dans le nombre décimal.'
  ], ex: '3,14 × 6 : 314 × 6 = 1 884 → 18,84' },
  { t: 'Compléter à l\'unité', si: /ajouter/i, l: [
    'Complète d\'abord les centièmes jusqu\'à la dizaine, puis les dixièmes jusqu\'à l\'unité.',
    'Vérifie en faisant l\'addition.'
  ], ex: '6,38 + ? = 7 → 6,38 + 0,02 = 6,4, puis + 0,6 = 7. Réponse : 0,62.' },
  { t: 'Additionner et soustraire des décimaux', l: [
    'Pose l\'opération en <b>alignant les virgules</b> (unités sous unités, dixièmes sous dixièmes…).',
    'Complète avec des zéros : 8 = 8,00 et 2,5 = 2,50.',
    'N\'oublie pas la virgule dans le résultat.'
  ], ex: '14,6 + 3,08 = 17,68 · 9 − 2,35 = 6,65' });
cours('CM2/maths/divisions',
  { t: 'Quotient et reste', si: /quotient|reste/i, l: [
    'Dans la division euclidienne : dividende = diviseur × quotient + reste.',
    'Le reste est toujours <b>plus petit</b> que le diviseur.'
  ], ex: '100 ÷ 7 → quotient 14, reste 2, car 7 × 14 + 2 = 100.' },
  { t: 'Problèmes de partage', si: /faut-il|pleins|pleines/i, l: [
    'Fais la division, puis réfléchis au <b>reste</b>.',
    'Si on doit tout ranger ou transporter tout le monde, il faut une boîte (ou un véhicule) de plus pour le reste.',
    'Si on compte seulement les paquets pleins, on garde le quotient.'
  ], ex: '47 élèves, voitures de 5 places : 47 = 5 × 9 + 2 → 9 voitures pleines, mais il en faut 10.' },
  { t: 'La division décimale', si: /,|partagent/, l: [
    'Quand on abaisse le premier chiffre après la virgule, on écrit la virgule au quotient.',
    'S\'il reste quelque chose, on ajoute un 0 et on continue la division.'
  ], ex: '27 ÷ 4 : 4 × 6 = 24, reste 3 → 30 dixièmes ÷ 4 = 7, reste 2 → 20 centièmes ÷ 4 = 5. Donc 6,75.' },
  { t: 'Poser une division', l: [
    'Prends le premier morceau du dividende assez grand pour contenir le diviseur.',
    'Cherche combien de fois il y va (tables !), écris le résultat, soustrais, puis abaisse le chiffre suivant.',
    'Si le diviseur ne va pas dans un morceau, écris <b>0</b> au quotient.'
  ], ex: '1 624 ÷ 8 = 203 (16 ÷ 8 = 2 ; 2 ÷ 8 = 0 ; 24 ÷ 8 = 3)' });
cours('CM2/maths/divisibilite',
  { t: 'Les diviseurs', si: /diviseur/i, l: [
    'Un diviseur partage un nombre <b>sans reste</b>.',
    'Pour les trouver tous, cherche les paires : 1 × …, 2 × …, 3 × … jusqu\'à ce qu\'elles se rejoignent.',
    '1 et le nombre lui-même sont toujours des diviseurs.'
  ], ex: 'Diviseurs de 44 : 1 × 44, 2 × 22, 4 × 11 → 1, 2, 4, 11, 22, 44' },
  { t: 'Les multiples', si: /multiple/i, l: [
    'Un multiple de 6 est un nombre de la table de 6 : 6, 12, 18, 24…',
    'Un multiple de deux nombres est dans leurs deux tables.'
  ], ex: 'Multiples communs de 4 et de 10 : 20, 40, 60…' },
  { t: 'Les critères de divisibilité', l: [
    'Par <b>2</b> : le chiffre des unités est pair (0, 2, 4, 6, 8).',
    'Par <b>5</b> : il se termine par 0 ou 5. Par <b>10</b> : il se termine par 0.',
    'Par <b>3</b> : la somme de ses chiffres est dans la table de 3.',
    'Par <b>9</b> : la somme de ses chiffres est dans la table de 9.'
  ], ex: '7 461 : 7 + 4 + 6 + 1 = 18 → divisible par 3 et par 9.' });
cours('CM2/maths/proportionnalite',
  { t: 'Les pourcentages', si: /%/, l: [
    '10 %, c\'est 10 sur 100, donc 1/10 : on divise par 10.',
    '50 %, c\'est la moitié. 25 %, c\'est le quart (on divise par 4).',
    'Une réduction de 25 % : on calcule 25 %, puis on l\'enlève du prix.'
  ], ex: '25 % de 60 € = 15 €. Prix soldé : 60 − 15 = 45 €.' },
  { t: 'Les échelles', si: /carte|plan|échelle/i, l: [
    'L\'échelle dit ce que représente 1 cm sur la carte.',
    'Distance réelle = distance sur la carte × valeur d\'1 cm.',
    'Échelle 1/500 : 1 cm sur le plan = 500 cm en vrai = 5 m.'
  ], ex: '1 cm → 3 km. 11 cm sur la carte → 33 km en vrai.' },
  { t: 'La vitesse', si: /km par heure/i, l: [
    '90 km par heure : en 1 h, on parcourt 90 km.',
    'En 30 min (la moitié d\'une heure), on parcourt la moitié ; en 15 min, le quart ; en 2 h, le double.'
  ], ex: 'À 70 km par heure, en 1 h 30 min : 70 + 35 = 105 km.' },
  { t: 'Le tableau de proportionnalité', si: /tableau/i, l: [
    'On passe d\'une ligne à l\'autre en multipliant <b>toujours par le même nombre</b>.',
    'On peut aussi additionner deux colonnes, ou multiplier une colonne.',
    'Si ce n\'est pas toujours le même multiplicateur, ce n\'est pas un tableau de proportionnalité.'
  ], ex: '3 → 21 et 5 → 35 : on multiplie toujours par 7.' },
  { t: 'Règle de trois', l: [
    'Cherche d\'abord la valeur pour <b>1</b> (on divise), puis pour la quantité demandée (on multiplie).',
    'Vérifie : si la quantité double, le résultat doit doubler.'
  ], ex: '4 billets coûtent 28 € → 1 billet coûte 7 € → 9 billets coûtent 63 €.' });
cours('CM2/maths/mesures',
  { t: 'Les unités d\'aire', si: /²/, l: [
    'Pour les aires, on multiplie par <b>100</b> à chaque unité : 1 m² = 100 dm² · 1 dm² = 100 cm² · 1 m² = 10 000 cm²',
    'Dans le tableau de conversion des aires, chaque unité a <b>deux</b> colonnes.'
  ], ex: '3 dm² = 300 cm² · 5 m² = 50 000 cm²' },
  { t: 'Comparer des mesures', si: /plus (grande|petite)/i, l: [
    'Convertis toutes les mesures dans la <b>même unité</b>, puis compare les nombres.'
  ], ex: '2,1 km et 1 900 m : 2,1 km = 2 100 m, donc 2,1 km est plus long.' },
  { t: 'Les conversions', l: [
    'Longueurs : km · hm · dam · m · dm · cm · mm (chaque unité vaut 10 fois la suivante).',
    'Masses : t (1 000 kg) · kg · hg · dag · g · dg · cg · mg. Contenances : hL · daL · L · dL · cL · mL.',
    'Vers une unité plus petite : le nombre devient plus grand. Vers une unité plus grande : il devient plus petit.',
    'Astuce : écris le nombre dans le tableau de conversion, le chiffre des unités dans la colonne de l\'unité de départ.'
  ], ex: '4,7 km = 4 700 m · 350 g = 0,35 kg · 2,5 L = 250 cL' });
cours('CM2/maths/durees',
  { t: 'Les siècles', si: /siècle/i, l: [
    'Le Ier siècle va de l\'an 1 à l\'an 100, le IIe de 101 à 200…',
    'Pour trouver le siècle : enlève les deux derniers chiffres et ajoute 1 (sauf pour les années « pile » comme 1900, qui terminent un siècle).',
    'Les siècles s\'écrivent en chiffres romains : I = 1, V = 5, X = 10.'
  ], ex: 'L\'année 1453 : 14 + 1 = 15 → XVe siècle. Le XIIe siècle va de 1101 à 1200.' },
  { t: 'Calculer une durée', si: /Combien de temps|Combien d'années/i, l: [
    'Avance d\'abord jusqu\'à l\'heure pile, puis jusqu\'à l\'heure d\'arrivée.',
    'Additionne les morceaux. Attention : 1 h = 60 min, pas 100 !',
    'Entre deux années, on soustrait : la plus récente moins la plus ancienne.'
  ], ex: 'De 8 h 40 à 11 h 15 : 20 min + 2 h + 15 min = 2 h 35 min.' },
  { t: 'Trouver l\'heure de fin', si: /À quelle heure/i, l: [
    'Ajoute d\'abord les heures, puis les minutes.',
    'Si tu dépasses 60 minutes, transforme 60 min en 1 h.'
  ], ex: '10 h 45 + 1 h 30 min = 11 h 75 min = 12 h 15.' },
  { t: 'Convertir des durées', l: [
    '1 h = 60 min · 1 min = 60 s · 1 jour = 24 h · 1 semaine = 7 jours',
    '1/2 h = 30 min · 1/4 h = 15 min · 3/4 h = 45 min',
    'Attention : 1,5 h n\'est pas 1 h 50 min ! 0,5 h est une demi-heure.'
  ], ex: '3 h 20 min = 180 + 20 = 200 min · 150 s = 2 min 30 s' });
cours('CM2/maths/perimetre-aire',
  { t: 'Le périmètre du cercle', si: /cercle/i, l: [
    'Périmètre du cercle ≈ <b>3,14 × diamètre</b>.',
    'Si on connaît le rayon, on le double d\'abord pour avoir le diamètre.'
  ], ex: 'Diamètre 50 cm → 3,14 × 50 = 157 cm.' },
  { t: 'Compter les cubes', si: /cubes/i, l: [
    'Compte les cubes d\'une rangée, puis le nombre de rangées : tu as un étage.',
    'Multiplie par le nombre d\'étages. Volume = longueur × largeur × hauteur.',
    'N\'oublie pas les cubes cachés derrière !'
  ], ex: '6 cubes par rangée, 3 rangées, 2 étages : 6 × 3 × 2 = 36 cubes.' },
  { t: 'Aire du triangle rectangle', si: /triangle/i, l: [
    'Un triangle rectangle est la moitié d\'un rectangle.',
    'Aire = côté × côté (les deux côtés de l\'angle droit) ÷ 2.'
  ], ex: 'Côtés de l\'angle droit 16 cm et 5 cm : 16 × 5 ÷ 2 = 40 cm².' },
  { t: 'Le périmètre', si: /périmètre|côté/i, l: [
    'Le périmètre, c\'est la longueur du <b>tour</b> de la figure.',
    'Rectangle : 2 × (longueur + largeur). Carré : 4 × côté.',
    'Il s\'exprime en m, cm… (pas en m²).'
  ], ex: 'Rectangle de 30 m sur 12 m : 2 × (30 + 12) = 84 m.' },
  { t: 'L\'aire', l: [
    'L\'aire, c\'est la mesure de la <b>surface</b>, en cm², m²…',
    'Rectangle : longueur × largeur. Carré : côté × côté.',
    'Figure compliquée : découpe-la en rectangles, ou calcule le grand rectangle et enlève le morceau en trop.'
  ], ex: 'Rectangle de 30 m sur 12 m : 30 × 12 = 360 m².' });
cours('CM2/maths/geometrie',
  { t: 'Les triangles', si: /triangle/i, l: [
    'Triangle <b>rectangle</b> : un angle droit. <b>Isocèle</b> : deux côtés égaux. <b>Équilatéral</b> : trois côtés égaux.',
    'Un triangle peut être rectangle et isocèle à la fois.',
    'Les petits traits rouges identiques montrent des côtés de même longueur.'
  ] },
  { t: 'Les quadrilatères et polygones', si: /quadrilatère|losange|carré|parallélogramme|polygone|pentagone|hexagone|octogone|trapèze|côtés|diagonales/i, l: [
    'Carré : 4 côtés égaux et 4 angles droits · Rectangle : 4 angles droits · Losange : 4 côtés de même longueur · Parallélogramme : côtés opposés parallèles et de même longueur · Trapèze : seulement deux côtés parallèles',
    'Les petits traits rouges identiques montrent des côtés de même longueur.',
    'Pentagone : 5 côtés · Hexagone : 6 côtés · Octogone : 8 côtés'
  ] },
  { t: 'Les angles', si: /angle/i, l: [
    'Angle <b>droit</b> : comme le coin d\'une feuille.',
    'Angle <b>aigu</b> : plus petit qu\'un angle droit. Angle <b>obtus</b> : plus grand qu\'un angle droit.'
  ] },
  { t: 'La symétrie axiale', si: /symétri/i, l: [
    'Le symétrique d\'un point est de l\'autre côté de l\'axe, <b>à la même distance</b>, sur une ligne perpendiculaire à l\'axe.',
    'Sur un quadrillage, compte les carreaux jusqu\'à l\'axe, puis autant de l\'autre côté.',
    'Un axe de symétrie partage une figure en deux moitiés qui se superposent par pliage.'
  ] },
  { t: 'Les patrons du cube', si: /patron/i, l: [
    'Un patron de cube a <b>6 carrés</b>.',
    'Imagine le pliage : chaque carré doit devenir une face différente, sans que deux carrés se superposent.',
    'Un bloc de 4 carrés en carré (2 × 2) ne marche jamais.'
  ] },
  { t: 'Les solides', si: /faces|arêtes|sommets|forme|solide/i, l: [
    'Une <b>face</b> est une surface plane, une <b>arête</b> est un segment où deux faces se touchent, un <b>sommet</b> est un coin.',
    'Pour compter les arêtes, compte celles du dessus, celles du dessous, puis celles des côtés.',
    'Le cylindre, le cône et la boule ont des surfaces courbes.'
  ] },
  { t: 'Droites et cercles', si: /droite|cercle|rayon|diamètre|parallèle|perpendiculaire|centre/i, l: [
    '<b>Parallèles</b> : elles ne se coupent jamais. <b>Perpendiculaires</b> : elles se coupent en formant un angle droit.',
    'Le <b>diamètre</b> d\'un cercle vaut 2 fois le <b>rayon</b>.'
  ], ex: 'Rayon 3,5 cm → diamètre 7 cm.' },
  { t: 'La géométrie', l: [
    'Observe bien la figure : les petits carrés rouges codent des angles droits, les petits traits des côtés égaux.',
    'L\'équerre sert à vérifier les angles droits, le compas à tracer des cercles, la règle à tracer des droites.'
  ] });
cours('CM2/maths/problemes', { t: 'Résoudre un problème à étapes', l: [
  '1. Lis tout l\'énoncé et repère la <b>question finale</b>.',
  '2. Cherche ce qu\'il faut calculer <b>d\'abord</b> (les questions intermédiaires).',
  '3. Écris chaque calcul avec une phrase : « Le prix des cahiers est… ».',
  '4. Vérifie que la réponse a du sens (unité, ordre de grandeur).',
  'Partage inégal : fais un schéma avec des parts (« 3 fois plus » = 3 parts contre 1).'
], ex: 'Des places à 6 € pour 4 enfants et 2 adultes : 4 + 2 = 6 personnes, puis 6 × 6 = 36 €.' });

// ---- Français
cours('CM2/francais/conjugaison',
  { t: 'Le présent', si: /présent/i, l: [
    'Verbes en -er : -e, -es, -e, -ons, -ez, -ent. Verbes comme finir : -is, -is, -it, -issons, -issez, -issent.',
    'Verbes irréguliers à connaître : être, avoir, aller, faire, dire, prendre, venir, pouvoir, vouloir, voir…'
  ], ex: 'je danse, nous dansons · je grandis, nous grandissons' },
  { t: 'L\'imparfait', si: /imparfait/i, l: [
    'Terminaisons pour tous les verbes : <b>-ais, -ais, -ait, -ions, -iez, -aient</b>.',
    'On part du radical du « nous » au présent : nous buvons → je buvais.'
  ], ex: 'courir : je courais, nous courions, ils couraient' },
  { t: 'Le futur', si: /futur/i, l: [
    'Terminaisons : <b>-ai, -as, -a, -ons, -ez, -ont</b>, ajoutées le plus souvent à l\'infinitif.',
    'Radicaux spéciaux : être → ser-, avoir → aur-, aller → ir-, faire → fer-, venir → viendr-, voir → verr-, pouvoir → pourr-.'
  ], ex: 'courir : je courrai, nous courrons' },
  { t: 'Le passé composé', si: /passé composé/i, l: [
    'Auxiliaire <b>avoir</b> ou <b>être</b> au présent + participe passé.',
    'Avec être (aller, venir, partir, arriver, tomber, rester…), le participe s\'accorde avec le sujet.'
  ], ex: 'Il a couru. Elles sont descendues.' },
  { t: 'Choisir le bon temps', l: [
    'Cherche les indices : hier, autrefois → passé ; demain, plus tard → futur ; maintenant, en ce moment → présent.',
    'Imparfait : une habitude ou une description dans le passé. Passé composé : une action terminée.'
  ] });
cours('CM2/francais/passe-simple',
  { t: 'Le plus-que-parfait', si: /plus-que-parfait/i, l: [
    'C\'est un temps composé : auxiliaire <b>avoir</b> ou <b>être</b> à l\'<b>imparfait</b> + participe passé.',
    'Il indique une action passée qui a eu lieu <b>avant</b> une autre action passée.'
  ], ex: 'J\'avais couru. Elle était descendue. Nous avions ri.' },
  { t: 'Le passé simple', l: [
    'C\'est le temps des récits et des contes, surtout à la 3e personne.',
    'Verbes en -er : il chant<b>a</b>, ils chant<b>èrent</b>.',
    'Autres verbes : il fin<b>it</b> / ils fin<b>irent</b> ; il cour<b>ut</b> / ils cour<b>urent</b> ; il v<b>int</b> / ils v<b>inrent</b>.',
    'Être : il fut · ils furent · Avoir : il eut · ils eurent'
  ], ex: 'Le dragon cracha du feu. Les villageois s\'enfuirent.' });
cours('CM2/francais/conditionnel-imperatif',
  { t: 'L\'impératif', si: /impératif/i, l: [
    'L\'impératif sert à donner un ordre ou un conseil. Il n\'y a <b>pas de sujet</b>.',
    'Seulement 3 personnes : tu, nous, vous.',
    'Verbes en -er : pas de s avec « tu » (mange !). Les autres verbes le gardent (bois !).',
    'Être : sois · soyons · soyez · Avoir : aie · ayons · ayez'
  ], ex: 'Rangez vos affaires ! Marche doucement. Partons !' },
  { t: 'Le conditionnel présent', l: [
    'Il exprime un souhait, une hypothèse (souvent après « si… ») ou une demande polie.',
    'On prend le <b>radical du futur</b> et les <b>terminaisons de l\'imparfait</b> : -ais, -ais, -ait, -ions, -iez, -aient.',
    'Ne pas confondre : futur « je courrai » / conditionnel « je courrais ».'
  ], ex: 'Si j\'étais un oiseau, je volerais. Je voudrais un verre d\'eau.' });
cours('CM2/francais/accords',
  { t: 'Le participe passé', si: /\((arriver|partir|tomber|aller|naître|venir|chanter|finir|retrouver|voler|écrire|installer)\)/i, l: [
    'Avec l\'auxiliaire <b>être</b>, le participe passé s\'accorde avec le sujet : elles sont sorties.',
    'Avec l\'auxiliaire <b>avoir</b>, il ne s\'accorde pas avec le sujet : elles ont couru.'
  ], ex: 'Les voitures sont passées. Les voitures ont roulé.' },
  { t: 'L\'accord de l\'adjectif', si: /\((blanc|génial|national|vieux|beau|gentil|neuf|bleu|noir|désert|facile|sportif|épais|ravi)\)/i, l: [
    'L\'adjectif s\'accorde en genre et en nombre avec le nom qu\'il qualifie.',
    'Pour deux noms, il se met au pluriel ; s\'il y a un nom masculin, l\'adjectif est au masculin.',
    'Pluriels particuliers : -al → -aux (loyal → loyaux). Féminins : -f → -ve, -x → -se.'
  ], ex: 'une chemise et un pull verts · des amis loyaux · une voix vive' },
  { t: 'L\'accord sujet-verbe', l: [
    'Trouve le sujet : pose la question « Qui est-ce qui… ? » devant le verbe.',
    'Le sujet peut être placé <b>après</b> le verbe ou loin de lui.',
    'Attention aux pièges : les mots « nous », « les », « leur » placés avant le verbe ne sont pas toujours le sujet.',
    'Toi et moi → nous. Toi et lui → vous.'
  ], ex: 'Dans la mare nagent des canards. (Qui est-ce qui nage ? des canards)' });
cours('CM2/francais/fonctions', { t: 'Les fonctions dans la phrase', l: [
  '<b>Sujet</b> : répond à « Qui est-ce qui… ? ». Le verbe s\'accorde avec lui.',
  '<b>COD</b> : répond à « quoi ? » ou « qui ? » juste après le verbe, sans préposition.',
  '<b>COI</b> : relié au verbe par une préposition (à, de) : parler <b>à</b> quelqu\'un, se souvenir <b>de</b>.',
  '<b>Compléments circonstanciels</b> : on peut les déplacer ou les supprimer. Ils disent où (lieu), quand (temps), comment (manière).',
  '<b>Attribut du sujet</b> : après être, sembler, devenir, paraître, rester ; il donne une qualité du sujet.'
], ex: 'Le soir, Lucas raconte une histoire à sa sœur.<br>Le soir → temps · Lucas → sujet · une histoire → COD · à sa sœur → COI' });
cours('CM2/francais/groupe-nominal',
  { t: 'Le groupe nominal', si: /noyau|groupe nominal/i, l: [
    'Le <b>nom noyau</b> est le nom principal du groupe : on ne peut pas le supprimer.',
    'On peut l\'enrichir avec un adjectif <b>épithète</b> (collé au nom) ou un <b>complément du nom</b> (introduit par à, de, en…).'
  ], ex: 'une grande tarte aux pommes → noyau : tarte · grande : épithète · aux pommes : complément du nom' },
  { t: 'Épithète ou attribut ?', si: /adjectif souligné/i, l: [
    'L\'adjectif <b>épithète</b> est placé à côté du nom, dans le groupe nominal.',
    'L\'<b>attribut du sujet</b> est séparé du sujet par un verbe d\'état : être, sembler, paraître, devenir, rester.'
  ], ex: 'Un ciel bleu (épithète). Le ciel est bleu (attribut).' },
  { t: 'Phrase simple, phrase complexe', l: [
    'Une <b>proposition</b> contient un verbe conjugué. Compte les verbes conjugués (pas les infinitifs).',
    'Phrase <b>simple</b> : une seule proposition. Phrase <b>complexe</b> : plusieurs propositions.',
    'Propositions <b>juxtaposées</b> : séparées par une virgule, un point-virgule ou deux-points.',
    'Propositions <b>coordonnées</b> : reliées par mais, ou, et, donc, or, ni, car.'
  ], ex: 'Il neige, les enfants sortent leurs luges. → 2 propositions juxtaposées' });
cours('CM2/francais/homophones',
  { t: 'ces, ses, c\'est, s\'est', si: /c'est|s'est|\bses\b|\bces\b/i, l: [
    '<b>ses</b> : les siens (on peut dire « ses » → « son », « sa »). <b>ces</b> : on montre (ces… -là).',
    '<b>c\'est</b> = cela est (on peut dire « c\'était »). <b>s\'est</b> : devant un participe passé, avec un verbe pronominal (il s\'est levé).'
  ], ex: 'C\'est Léo : il s\'est blessé à la main, il soigne ses doigts. Regarde ces pansements !' },
  { t: 'leur ou leurs', si: /leurs?/i, l: [
    '<b>leur</b> devant un verbe = « lui » au pluriel : il ne prend jamais de s.',
    '<b>leur / leurs</b> devant un nom : s\'accorde avec le nom (leur maison, leurs maisons).'
  ], ex: 'Je leur donne des pommes. Ils mangent leurs pommes. Ils rangent leur chambre.' },
  { t: 'quand, quant, qu\'en', si: /quand|quant|qu'en/i, l: [
    '<b>quand</b> = lorsque, ou question sur le moment (à quel moment ?).',
    '<b>quant</b> est toujours suivi de « à, au, aux » : quant à moi.',
    '<b>qu\'en</b> = que + en (qu\'en dis-tu ? il ne sort qu\'en été).'
  ] },
  { t: 'ce ou se', si: /\b(ce|se)\b/i, l: [
    '<b>se</b> est devant un verbe : il se lave (on peut dire « je me lave »).',
    '<b>ce</b> est devant un nom (ce chien), ou veut dire « cela » (ce sont…).'
  ] },
  { t: 'la, l\'a, là', si: /\b(la|là|l'a)\b/i, l: [
    '<b>l\'a</b> = l\'avait (verbe avoir).',
    '<b>là</b> indique un lieu (ici, là-bas).',
    '<b>la</b> est un déterminant (la mer) ou un pronom (je la vois).'
  ] },
  { t: 'peu, peut, peux', si: /\bpeu[tx]?\b/i, l: [
    '<b>peux, peut</b> : verbe pouvoir (on peut dire « pouvait ») : je peux, tu peux, il peut.',
    '<b>peu</b> = pas beaucoup.'
  ] },
  { t: 'Infinitif (-er) ou participe (-é) ?', l: [
    'Remplace par un verbe comme <b>vendre</b> ou <b>prendre</b>.',
    'Si tu peux dire « vendre », écris <b>-er</b> (infinitif). Si tu peux dire « vendu », écris <b>-é</b> (participe passé).',
    'Après « il a », « nous avons », « elle est »… c\'est souvent le participe passé.'
  ], ex: 'Je vais nager (vendre). J\'ai nagé (vendu).' });
cours('CM2/francais/vocabulaire',
  { t: 'Préfixes et suffixes', si: /préfixe|suffixe/i, l: [
    'Un <b>préfixe</b> se place avant le radical et change le sens.',
    'Quelques préfixes : re- = de nouveau · in-/im- = le contraire · pré- = avant · sous- = en dessous · bi- = deux',
    'Un <b>suffixe</b> se place après le radical.',
    'Quelques suffixes : -ette = petit · -eur = celui qui fait l\'action · -ier = souvent un arbre ou un métier'
  ], ex: 'dé + color + ation → décoloration' },
  { t: 'Sens propre, sens figuré', si: /sens/i, l: [
    'Au sens <b>propre</b>, le mot garde son sens habituel, concret.',
    'Au sens <b>figuré</b>, il est employé comme une image.'
  ], ex: 'Le verre est brisé (propre). Il a le cœur brisé (figuré).' },
  { t: 'Les niveaux de langue', si: /niveau/i, l: [
    '<b>Familier</b> : on parle entre amis, en famille.',
    '<b>Courant</b> : on parle à tout le monde, à l\'école.',
    '<b>Soutenu</b> : dans les livres, les discours, une langue recherchée.'
  ], ex: 'se barrer (familier) · partir (courant) · prendre congé (soutenu)' },
  { t: 'Les mots et leur sens', l: [
    '<b>Synonymes</b> : des mots de sens proche. <b>Contraires</b> (antonymes) : de sens opposé.',
    'Un mot <b>générique</b> regroupe plusieurs mots : « animaux » pour chien, chat, lapin.'
  ], ex: 'joyeux / gai (synonymes) · joyeux / triste (contraires)' });
cours('CM2/francais/comprehension', { t: 'Comprendre un texte', l: [
  'Lis la question, puis retrouve dans le texte le passage qui en parle.',
  'Certaines réponses ne sont pas écrites mot pour mot : il faut les <b>déduire</b> (comprendre pourquoi, deviner un sentiment).',
  'L\'idée principale, c\'est ce que tout le texte explique, pas un petit détail.',
  'Méfie-toi des réponses qui reprennent des mots du texte mais changent le sens.'
] });
cours('CM2/francais/dictee', { t: 'Bien écrire un mot', l: [
  'Écoute le mot plusieurs fois avec 🔊 et découpe-le en syllabes.',
  'Pense aux lettres muettes : cherche un mot de la même famille.',
  'Pense aux accents (é, è, ê), aux doubles consonnes et aux sons difficiles (ph = f, y = i, qu = k).',
  'Relis ton mot lettre par lettre avant de valider.'
], ex: 'un regard → regarder (on entend le d)' });

// ---- Histoire
cours('CM2/histoire/quiz-republique',
  { t: 'La IIIe République et l\'école', si: /1870|Sedan|Prusse|Ferry|école|laïque|instituteurs|hussards|1905|Marseillaise|14 juillet|régime/i, l: [
    'En 1870, après la défaite de Napoléon III contre la Prusse, la République est proclamée : c\'est la IIIe République.',
    'Elle adopte ses symboles : La Marseillaise devient l\'hymne national (1879), le 14 Juillet la fête nationale (1880).',
    'Les lois Jules Ferry (1881-1882) rendent l\'école publique gratuite, laïque et obligatoire de 6 à 13 ans. Les instituteurs sont surnommés les hussards noirs de la République.',
    'En 1905, une loi sépare les Églises et l\'État.'
  ] },
  { t: 'Le vote et les droits', si: /vote|suffrage|esclavage|Schœlcher|peine de mort|Curie|1944|1962/i, l: [
    'En 1848, l\'esclavage est aboli grâce à Victor Schœlcher, et le suffrage universel est accordé aux hommes.',
    'Les femmes obtiennent le droit de vote en 1944. En 1974, on peut voter dès 18 ans.',
    'Depuis 1962, les citoyens élisent directement le président. La peine de mort est abolie en 1981.',
    'Marie Curie, savante, reçoit deux prix Nobel.'
  ] },
  { t: 'La Ve République et l\'Europe', l: [
    'La Ve République est fondée en 1958 ; son premier président est Charles de Gaulle.',
    'En 1957, six pays, dont la France, signent le traité de Rome : c\'est le début de la construction européenne.',
    'Depuis 2002, on paie en euros.'
  ] });
cours('CM2/histoire/quiz-industrie',
  { t: 'Machines, usines et ouvriers', si: /machine|charbon|mine|usines?|ouvriers|exode|enfants|grève|heures|Germinal|Zola/i, l: [
    'Au XIXe siècle, la machine à vapeur, perfectionnée par James Watt, fait tourner les usines. Elle fonctionne au charbon, extrait par les mineurs.',
    'Beaucoup de paysans quittent les campagnes pour travailler en ville : c\'est l\'exode rural.',
    'Les ouvriers, et même des enfants, travaillent plus de 12 heures par jour. Pour réclamer de meilleures conditions, ils font grève.',
    'L\'écrivain Émile Zola raconte la vie des mineurs dans Germinal.'
  ] },
  { t: 'Inventions et transports', l: [
    'Le chemin de fer se développe grâce à la machine à vapeur. Le métro de Paris ouvre en 1900.',
    'Inventions : le téléphone (Graham Bell, 1876), l\'ampoule électrique (Edison, 1879), le cinéma (les frères Lumière, 1895), le vaccin contre la rage (Pasteur, 1885).',
    'Louis Blériot traverse la Manche en avion en 1909. La tour Eiffel est construite pour l\'Exposition universelle de 1889.',
    'Les villes changent : électricité, grands magasins, larges avenues du baron Haussmann à Paris. Jules Verne imagine des voyages extraordinaires.'
  ] });
cours('CM2/histoire/quiz-guerres',
  { t: 'La Première Guerre mondiale', si: /Première|1914|1916|1918|poilus|tranchées|Verdun|armistice|monument|gueules|ennemi/i, l: [
    'La Première Guerre mondiale dure de 1914 à 1918. La France et ses alliés combattent l\'Allemagne.',
    'Les soldats français, les poilus, vivent dans des tranchées. La bataille de Verdun (1916) est terrible.',
    'L\'armistice est signé le 11 novembre 1918. Environ 1,4 million de soldats français sont morts ; beaucoup reviennent blessés (les gueules cassées).',
    'Chaque commune a son monument aux morts.'
  ] },
  { t: 'La Seconde Guerre mondiale', l: [
    'La Seconde Guerre mondiale dure de 1939 à 1945. L\'Allemagne nazie d\'Adolf Hitler envahit la France en 1940.',
    'Le 18 juin 1940, depuis Londres, le général de Gaulle appelle à continuer le combat. Le maréchal Pétain dirige le régime de Vichy, qui collabore avec l\'occupant.',
    'Les résistants luttent en secret ; Jean Moulin unifie la Résistance.',
    'Les nazis exterminent environ 6 millions de Juifs : c\'est la Shoah. Anne Frank a écrit son journal en se cachant. Les Justes ont sauvé des Juifs.',
    'Débarquement en Normandie le 6 juin 1944, libération de Paris en août 1944, capitulation de l\'Allemagne le 8 mai 1945. L\'ONU est créée en 1945 pour la paix.'
  ] });

// ---- Géographie
cours('CM2/geo/quiz-deplacer',
  { t: 'Se déplacer', si: /TGV|tunnel|aéroport|étoile|train|voiture|covoiturage|transport|océan|port|porte-conteneurs|vitesse/i, l: [
    'Le TGV roule à environ 300 km/h ; la première ligne (Paris-Lyon) date de 1981.',
    'Les réseaux de transport français forment une étoile autour de Paris. Le plus grand aéroport est Paris-Charles-de-Gaulle.',
    'Le tunnel sous la Manche relie la France et l\'Angleterre depuis 1994.',
    'Les marchandises traversent les océans sur des porte-conteneurs ; Marseille est le premier port de commerce français.',
    'Le train et le covoiturage polluent moins que la voiture avec une seule personne.'
  ] },
  { t: 'Communiquer', si: /Internet|GPS|courriel|message|heure/i, l: [
    'Les données d\'Internet voyagent surtout dans des câbles posés au fond des océans. Les satellites permettent le GPS.',
    'Un courriel (e-mail) est un message envoyé par Internet.',
    'La Terre tourne : quand il fait jour d\'un côté, il fait nuit de l\'autre. C\'est pour cela que l\'heure change selon les pays.'
  ] },
  { t: 'Mieux habiter', l: [
    'Une ville durable limite la pollution : pistes cyclables, transports en commun, espaces verts, écoquartiers.',
    'On trie ses déchets : le verre dans le conteneur à verre, les épluchures dans le compost.',
    'Bien isoler une maison permet de moins chauffer. La plupart des Français vivent en ville.'
  ] });
cours('CM2/geo/quiz-europe',
  { t: 'L\'Union européenne', si: /capitale|Union européenne|Parlement/i, l: [
    'L\'Union européenne compte 27 pays. Son Parlement siège à Strasbourg.',
    'Quelques capitales : Berlin (Allemagne), Madrid (Espagne), Rome (Italie), Lisbonne (Portugal), Bruxelles (Belgique), Athènes (Grèce), Varsovie (Pologne), Vienne (Autriche).',
    'La Suisse et la Norvège sont en Europe, mais ne font pas partie de l\'Union européenne.'
  ] },
  { t: 'Continents et océans', l: [
    '6 continents : l\'Afrique, l\'Amérique, l\'Antarctique, l\'Asie, l\'Europe, l\'Océanie.',
    '5 océans : Pacifique (le plus grand), Atlantique, Indien, Arctique (au nord), Austral (au sud).',
    'L\'équateur partage la Terre en deux hémisphères. L\'Everest, en Asie, est la plus haute montagne ; le Sahara, en Afrique, le plus grand désert chaud ; la Russie, le plus grand pays.'
  ] });

// ---- Sciences
cours('CM2/sciences/quiz-energie',
  { t: 'Le circuit électrique', si: /lampe|circuit|conducteur|isolant|fils|pile|court|prises|interrupteur/i, l: [
    'Pour qu\'une lampe brille, le courant doit faire tout le tour : le circuit doit être <b>fermé</b>, sans coupure.',
    'Un interrupteur ouvert coupe le circuit. Un fil qui relie directement les deux bornes de la lampe ou de la pile fait un <b>court-circuit</b> : la lampe s\'éteint et la pile chauffe.',
    'Les métaux (cuivre, fer…) sont conducteurs ; le plastique, le bois, le verre sont isolants.',
    'Le courant des prises de la maison est dangereux : on n\'y touche jamais.'
  ] },
  { t: 'Les sources d\'énergie', si: /énergie|renouvelable|panneau|centrale|uranium/i, l: [
    'Énergies <b>renouvelables</b> : le soleil, le vent, l\'eau qui coule, la chaleur de la Terre, le bois des forêts replantées.',
    'Énergies <b>non renouvelables</b> (elles s\'épuisent) : le pétrole, le charbon, le gaz naturel, l\'uranium des centrales nucléaires.',
    'Une pile transforme de l\'énergie chimique en énergie électrique ; un panneau solaire, la lumière en électricité.'
  ] },
  { t: 'Mélanges et objets techniques', l: [
    'Dans une solution, on ne voit plus ce qui est dissous (sucre dans l\'eau). Quand plus rien ne se dissout, la solution est saturée.',
    'Pour séparer : la décantation (on laisse reposer), la filtration (avec un filtre), l\'évaporation (pour récupérer le sel).',
    'Un engrenage (roues dentées) ou une chaîne transmettent un mouvement, comme sur un vélo.'
  ] });
cours('CM2/sciences/quiz-vivant',
  { t: 'Le corps humain', si: /aliments|digestif|nutriments|bouche|salive|poumons|gaz|air|vaisseaux|cœur|sang|trachée/i, l: [
    'Digestion : bouche (salive) → œsophage → estomac → intestin grêle → gros intestin. Les nutriments passent dans le sang au niveau de l\'intestin grêle.',
    'Respiration : l\'air passe par la trachée jusqu\'aux poumons ; l\'oxygène entre dans le sang, le dioxyde de carbone est rejeté.',
    'Circulation : le cœur pompe le sang. Les artères partent du cœur, les veines y reviennent. Quand on fait un effort, le cœur bat plus vite.'
  ] },
  { t: 'Bien manger, bien vivre', si: /aliment|calcium|fruits|boisson|dormir|muscles|énergie/i, l: [
    'Les féculents (pâtes, riz, pain) donnent de l\'énergie. Les produits laitiers apportent le calcium des os.',
    'Les protéines (viande, poisson, œufs, lentilles) construisent les muscles. Au moins 5 fruits et légumes par jour.',
    'L\'eau est la seule boisson indispensable. Un enfant de 10 ans a besoin d\'environ 10 heures de sommeil.'
  ] },
  { t: 'Le monde vivant', l: [
    'Tous les êtres vivants sont faits de cellules, qu\'on observe au microscope.',
    'Les vertébrés (poissons, amphibiens, reptiles, oiseaux, mammifères) ont un squelette interne avec une colonne vertébrale.',
    'Les mammifères allaitent leurs petits et respirent avec des poumons (même la baleine et la chauve-souris !). Les poissons respirent avec des branchies.',
    'Ovipare : pond des œufs. Vivipare : le petit grandit dans le ventre de sa mère.',
    'Chez les plantes à fleurs, après la fécondation, l\'ovaire, au cœur du pistil, devient un fruit qui contient des graines.'
  ] });
cours('CM2/sciences/quiz-ciel',
  { t: 'Les planètes', si: /planète|Pluton|Mars|Saturne|Jupiter|Vénus|rocheuses/i, l: [
    'Dans l\'ordre depuis le Soleil : Mercure, Vénus, la Terre, Mars, Jupiter, Saturne, Uranus, Neptune.',
    'Moyen mnémotechnique : « Me Voici Tout Mouillé, J\'ai Suivi Un Nuage ».',
    'Les 4 premières sont rocheuses, les 4 autres sont des géantes gazeuses. Jupiter est la plus grande ; Saturne a de grands anneaux ; Mars est rouge ; Vénus est la plus chaude.',
    'Pluton est une planète naine depuis 2006.'
  ] },
  { t: 'Le Soleil, la Terre et la Lune', l: [
    'Le Soleil est une étoile ; sa lumière met environ 8 minutes pour arriver jusqu\'à nous. La gravitation retient les planètes autour de lui.',
    'La Lune ne brille pas : elle renvoie la lumière du Soleil. Ses phases (nouvelle lune, croissant, premier quartier, pleine lune…) durent environ un mois.',
    'Éclipse de Soleil : la Lune passe entre le Soleil et la Terre.',
    'Les saisons viennent de l\'inclinaison de l\'axe de la Terre.',
    'Youri Gagarine est le premier homme dans l\'espace (1961). La Terre est la seule planète où l\'on connaît la vie.'
  ] });

// ---- Vivre ensemble
cours('CM2/emc/quiz-institutions',
  { t: 'Les institutions de la France', si: /président|Premier ministre|gouvernement|Parlement|Sénat|députés|Assemblée|lois|Constitution|préfet|communes|conseillers/i, l: [
    'Le président de la République est élu pour 5 ans. Il nomme le Premier ministre, qui dirige le gouvernement (les ministres).',
    'Le Parlement vote les lois : l\'Assemblée nationale (577 députés, au palais Bourbon) et le Sénat (au palais du Luxembourg).',
    'La Constitution de 1958 fixe les règles de la Ve République.',
    'La France compte environ 35 000 communes. Les habitants élisent les conseillers municipaux, qui élisent le maire. Le préfet représente l\'État dans le département.'
  ] },
  { t: 'Voter', si: /vot|référendum/i, l: [
    'Pour voter : avoir 18 ans, être français et être inscrit sur les listes électorales.',
    'Le vote est secret (isoloir) et personnel.',
    'Lors d\'un référendum, les citoyens répondent directement par oui ou par non à une question.'
  ] },
  { t: 'L\'Union européenne', l: [
    'Le drapeau européen : douze étoiles jaunes en cercle sur fond bleu. L\'hymne : l\'Ode à la joie de Beethoven.',
    'La devise : « Unis dans la diversité ». On fête l\'Europe le 9 mai.',
    'Les députés européens sont élus pour 5 ans.'
  ] });
cours('CM2/emc/quiz-citoyen',
  { t: 'Bien utiliser Internet', si: /Internet|photo|mot de passe|message|information|harcèlement|arnaque|infox/i, l: [
    'On garde son mot de passe secret. Un bon mot de passe est long et mélange lettres, chiffres et symboles.',
    'On ne donne jamais son adresse ou son numéro de téléphone. Si un inconnu propose un rendez-vous, on en parle à ses parents.',
    'Avant de publier la photo de quelqu\'un, on lui demande son accord (droit à l\'image).',
    'On vérifie une information avant de la partager : il existe des infox (fake news) et des arnaques.',
    'Harcèlement et cyberharcèlement : on appelle le 3018 (gratuit) et on en parle à un adulte.'
  ] },
  { t: 'Droits et devoirs', l: [
    'La Déclaration des droits de l\'homme et du citoyen (1789) : « Les hommes naissent et demeurent libres et égaux en droits ».',
    'Chaque citoyen a des droits et des devoirs : respecter les lois, payer des impôts qui financent les écoles, les routes et les hôpitaux.',
    'Les discriminations sont interdites. Les femmes et les hommes ont les mêmes droits.',
    'La laïcité garantit la liberté de croire ou de ne pas croire ; la charte de la laïcité est affichée dans les écoles.',
    'Dans un débat, on donne des raisons et on écoute les autres.'
  ] });
