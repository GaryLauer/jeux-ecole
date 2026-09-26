// Contenu supplémentaire pour le CP (6 ans) : chargé après jeux.js.
(() => {
  /* ---------- Outils ---------- */
  // Jeu d'écoute : consigne en français, mot en anglais, choix en emoji.
  // liste : [anglais, emoji, groupe?] — deux éléments du même groupe ne sont jamais proposés ensemble.
  const ecouteEn = (liste, consigne = "Écoute, et touche la bonne image :") => () => {
    const [en, e, g] = pioche(liste);
    const autres = melange(liste.filter(x => x[1] !== e && (!g || x[2] !== g))).slice(0, 3).map(x => x[1]);
    return { visuel: '🔊', enonce: `Écoute : « ${en} »`, dire: consigne, direEn: en, choix: melange([e, ...autres]), bonne: e };
  };
  // Tire les éléments d'une liste sans répétition jusqu'à épuisement.
  const sac = liste => { let r = []; return () => { if (!r.length) r = melange(liste); return r.pop(); }; };
  const ligne = (items, dir = 'row') =>
    `<div style="display:flex;flex-direction:${dir};align-items:center;justify-content:center;gap:.35em">${items.map(x => `<span>${x}</span>`).join('')}</div>`;

  /* =====================================================================
     MATHS
     ===================================================================== */

  // Calcul jusqu'à 20, et calcul sur les dizaines entières.
  const calcul20 = () => {
    const t = alea(1, 4);
    if (t === 1) {
      const a = alea(2, 15), b = alea(1, 20 - a), r = a + b;
      return qcm({ visuel: `${a} + ${b}`, enonce: 'Combien ça fait ?', dire: `${a} plus ${b}, ça fait combien ?` }, r, voisins(r, 2, 0));
    }
    if (t === 2) {
      const a = alea(8, 20), b = alea(1, a - 1), r = a - b;
      return qcm({ visuel: `${a} − ${b}`, enonce: 'Combien ça fait ?', dire: `${a} moins ${b}, ça fait combien ?` }, r, voisins(r, 2, 0));
    }
    if (t === 3) {
      const a = alea(1, 8), b = alea(1, 10 - a), r = (a + b) * 10;
      return qcm({ visuel: `${a * 10} + ${b * 10}`, enonce: 'Combien ça fait ?', dire: `${a * 10} plus ${b * 10}, ça fait combien ?`, aide: `${a} dizaines + ${b} dizaines` },
        r, [r - 10, r + 10, r + 20, a + b, r + 1].filter(x => x > 0 && x <= 100));
    }
    const a = alea(2, 10), b = alea(1, a - 1), r = (a - b) * 10;
    return qcm({ visuel: `${a * 10} − ${b * 10}`, enonce: 'Combien ça fait ?', dire: `${a * 10} moins ${b * 10}, ça fait combien ?`, aide: `${a} dizaines − ${b} dizaines` },
      r, [r - 10, r + 10, r + 20, a - b, r + 1].filter(x => x > 0 && x <= 100));
  };

  const complements = () => {
    const n = alea(1, 9), r = 10 - n;
    return qcm({
      visuel: '<span style="font-size:.55em">' + '🔴'.repeat(n) + '⚪'.repeat(r) + '</span>',
      enonce: `${n} + ? = 10`,
      dire: `Combien faut-il ajouter à ${n} pour faire 10 ?`,
      aide: 'Compte les ronds blancs.'
    }, r, voisins(r, 2, 0));
  };

  const doubles = () => {
    const n = alea(1, 10), o = pioche(OBJETS);
    const petit = s => `<span style="font-size:${n > 5 ? '.45em' : '.6em'}">${s}</span>`;
    if (Math.random() < .5) {
      const r = 2 * n;
      return qcm({ visuel: petit(o.repeat(n) + ' ' + o.repeat(n)), enonce: `Le double de ${n}, c'est ?`, dire: `Quel est le double de ${n} ?` }, r, [...voisins(r, 2, 0), n, r + 2]);
    }
    return qcm({ visuel: petit(o.repeat(2 * n)), enonce: `La moitié de ${2 * n}, c'est ?`, dire: `Quelle est la moitié de ${2 * n} ?`, aide: 'Partage en deux parts égales.' },
      n, [...voisins(n, 2, 0), 2 * n, n + 2]);
  };

  // Formes : carré, rectangle, triangle, rond.
  const COULEURS_FORMES = ['#e5484d', '#4f8ef7', '#3bb273', '#f5a623', '#8e5cd9', '#d94f9c'];
  const dessinForme = f => {
    const c = pioche(COULEURS_FORMES), st = `fill="${c}" stroke="#333" stroke-width="2"`;
    if (f === 'carré') { const s = alea(44, 66), o = (100 - s) / 2; return `<rect x="${o}" y="${o}" width="${s}" height="${s}" ${st}/>`; }
    if (f === 'rectangle') {
      const w = alea(70, 86), h = alea(28, 38);
      return Math.random() < .75
        ? `<rect x="${(100 - w) / 2}" y="${(100 - h) / 2}" width="${w}" height="${h}" ${st}/>`
        : `<rect x="${(100 - h) / 2}" y="${(100 - w) / 2}" width="${h}" height="${w}" ${st}/>`;
    }
    if (f === 'triangle') {
      const pts = pioche([
        [[50, 14], [86, 82], [14, 82]], [[18, 18], [18, 84], [84, 84]], [[20, 80], [82, 80], [60, 20]],
        [[14, 20], [86, 20], [50, 84]], [[20, 16], [84, 50], [20, 84]]
      ]);
      return `<polygon points="${pts.map(p => p.join(',')).join(' ')}" ${st}/>`;
    }
    return `<circle cx="50" cy="50" r="${alea(26, 38)}" ${st}/>`;
  };
  const formes = () => {
    const f = pioche(['carré', 'rectangle', 'triangle', 'rond']);
    if (f !== 'rond' && Math.random() < .3) {
      const n = f === 'triangle' ? 3 : 4;
      return qcm({ visuel: svg(dessinForme(f)), enonce: 'Combien de côtés a cette forme ?', dire: 'Compte les côtés de cette forme. Combien y en a-t-il ?' }, n, [3, 4, 5, 6]);
    }
    return { visuel: svg(dessinForme(f)), enonce: 'Comment s\'appelle cette forme ?', dire: 'Regarde bien. Comment s\'appelle cette forme ?',
      choix: melange(['carré', 'rectangle', 'triangle', 'rond']), bonne: f };
  };

  // Horloge : heures justes et demi-heures.
  const horloge = (h, m) => {
    const pt = (deg, l) => { const a = deg * Math.PI / 180; return [(50 + l * Math.sin(a)).toFixed(1), (50 - l * Math.cos(a)).toFixed(1)]; };
    let s = '<circle cx="50" cy="50" r="46" fill="#fff" stroke="#333" stroke-width="3"/>';
    for (let i = 1; i <= 12; i++) {
      const [x, y] = pt(i * 30, 36);
      s += `<text x="${x}" y="${y}" font-size="10" font-weight="bold" font-family="sans-serif" fill="#222" text-anchor="middle" dominant-baseline="central">${i}</text>`;
      const [x1, y1] = pt(i * 30, 44), [x2, y2] = pt(i * 30, 41);
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#333" stroke-width="1.5"/>`;
    }
    const [hx, hy] = pt(((h % 12) + m / 60) * 30, 21), [mx, my] = pt(m * 6, 33);
    s += `<line x1="50" y1="50" x2="${mx}" y2="${my}" stroke="#1d4ed8" stroke-width="3" stroke-linecap="round"/>`;
    s += `<line x1="50" y1="50" x2="${hx}" y2="${hy}" stroke="#e5484d" stroke-width="5" stroke-linecap="round"/>`;
    s += '<circle cx="50" cy="50" r="3" fill="#333"/>';
    return svg(s, 200);
  };
  const nomHeure = (h, demie) => `${h} heure${h > 1 ? 's' : ''}${demie ? ' et demie' : ''}`;
  const heure = () => {
    const h = alea(1, 12), demie = Math.random() < .45;
    const suiv = h % 12 + 1, prec = (h + 10) % 12 + 1;
    const fausses = demie
      ? [nomHeure(suiv, true), nomHeure(h, false), nomHeure(suiv, false)]
      : [nomHeure(h, true), nomHeure(prec, true), nomHeure(suiv, false)];
    return qcm({ visuel: horloge(h, demie ? 30 : 0), enonce: 'Quelle heure est-il ?', dire: 'Regarde l\'horloge. Quelle heure est-il ?',
      aide: 'La petite aiguille rouge montre les heures.' }, nomHeure(h, demie), fausses);
  };

  // Monnaie : pièces de 1 € et 2 €, billets de 5 € et 10 €.
  const dessinArgent = (v, cx, cy) => {
    const t = (txt, taille = 7) => `<text x="${cx}" y="${cy}" font-size="${taille}" font-weight="bold" font-family="sans-serif" fill="#222" text-anchor="middle" dominant-baseline="central">${txt}</text>`;
    if (v === 1) return `<circle cx="${cx}" cy="${cy}" r="11" fill="#e0b64a" stroke="#8a6d1f"/><circle cx="${cx}" cy="${cy}" r="7.5" fill="#d4d4d4"/>` + t('1 €', 6);
    if (v === 2) return `<circle cx="${cx}" cy="${cy}" r="13" fill="#d4d4d4" stroke="#777"/><circle cx="${cx}" cy="${cy}" r="9" fill="#e0b64a"/>` + t('2 €', 6.5);
    const coul = v === 5 ? '#b9c2bd' : '#e8907f';
    return `<rect x="${cx - 15}" y="${cy - 10}" width="30" height="20" rx="2" fill="${coul}" stroke="#555"/>` + t(`${v} €`, 8);
  };
  const monnaie = () => {
    let items, total;
    do {
      const n = alea(2, 5);
      items = Array.from({ length: n }, () => pioche([1, 1, 2, 2, 5, 10]));
      total = items.reduce((a, b) => a + b, 0);
    } while (total > 20);
    items.sort((a, b) => b - a);
    const pos = [[17, 32], [50, 32], [83, 32], [17, 68], [50, 68], [83, 68]];
    const dessin = svg(items.map((v, i) => dessinArgent(v, ...pos[i])).join(''), 220);
    const fausses = [...voisins(total, 3, 1), items.length].map(x => `${x} €`);
    return qcm({ visuel: dessin, enonce: 'Combien d\'euros en tout ?', dire: 'Combien d\'euros y a-t-il en tout ?' }, `${total} €`, fausses);
  };

  // Petits problèmes lus à voix haute.
  const ENFANTS = [['Léa', 'elle'], ['Tom', 'il'], ['Inès', 'elle'], ['Noah', 'il'], ['Jade', 'elle'], ['Lucas', 'il'], ['Chloé', 'elle'], ['Adam', 'il']];
  const CHOSES = [['billes', '🔵'], ['bonbons', '🍬'], ['fleurs', '🌸'], ['pommes', '🍎'], ['images', '🖼️'], ['voitures', '🚗'], ['crayons', '✏️'], ['gâteaux', '🧁']];
  const problemes = () => {
    const [nom, pr] = pioche(ENFANTS), [obj, e] = pioche(CHOSES);
    const petit = s => `<span style="font-size:.45em">${s}</span>`;
    const t = alea(1, 5);
    let txt, r, vis;
    const deObj = /^[aeiouyéh]/.test(obj) ? `d'${obj}` : `de ${obj}`;
    if (t === 1) {
      const a = alea(2, 12), b = alea(2, 20 - a); r = a + b;
      txt = `${nom} a ${a} ${obj}. On lui en donne ${b}. Combien ${deObj} a-t-${pr} maintenant ?`;
      vis = petit(e.repeat(a) + ' ➕ ' + e.repeat(b));
    } else if (t === 2) {
      const a = alea(2, 12), b = alea(2, 20 - a); r = a + b;
      txt = `Dans le bus, il y a ${a} enfants. ${b} enfants montent. Combien d'enfants y a-t-il dans le bus maintenant ?`;
      vis = petit('🚌 ' + '🧒'.repeat(a) + ' ➕ ' + '🧒'.repeat(b));
    } else if (t === 3) {
      const a = alea(4, 20), b = alea(2, a - 2); r = a - b;
      txt = `${nom} a ${a} ${obj}. ${pr === 'il' ? 'Il' : 'Elle'} en donne ${b} à un ami. Combien ${deObj} lui reste-t-il ?`;
      vis = petit(e.repeat(a));
    } else if (t === 4) {
      const a = alea(4, 20), b = alea(2, a - 2); r = a - b;
      txt = `Il y a ${a} oiseaux sur un arbre. ${b} oiseaux s'envolent. Combien d'oiseaux restent sur l'arbre ?`;
      vis = petit('🌳 ' + '🐦'.repeat(a));
    } else {
      const a = alea(2, 10), b = alea(2, 10); r = a + b;
      txt = `${nom} a ${a} ${obj} dans sa chambre et ${b} ${obj} dans son cartable. Combien ${deObj} a-t-${pr} en tout ?`;
      vis = petit(e.repeat(a) + ' ➕ ' + e.repeat(b));
    }
    return qcm({ visuel: vis, enonce: txt, dire: txt }, r, voisins(r, 2, 0));
  };

  // Se repérer : gauche / droite / au-dessus / en dessous.
  const BETES = [['🐱', 'du chat'], ['🐶', 'du chien'], ['🐰', 'du lapin'], ['🐭', 'de la souris'], ['🐸', 'de la grenouille'], ['🐷', 'du cochon'],
    ['🐮', 'de la vache'], ['🐵', 'du singe'], ['🦊', 'du renard'], ['🐻', 'de l\'ours'], ['🐔', 'de la poule'], ['🐢', 'de la tortue']];
  const reperage = () => {
    const b = melange(BETES).slice(0, 4), trois = b.slice(0, 3), en = trois.map(x => x[0]);
    const horiz = Math.random() < .5;
    const vis = `<div style="font-size:.9em">${ligne(en, horiz ? 'row' : 'column')}</div>`;
    const choix = melange(b.map(x => x[0]));
    if (Math.random() < .6) {
      const avant = Math.random() < .5;
      const [mot, bonne] = horiz ? (avant ? ['à gauche', en[0]] : ['à droite', en[2]]) : (avant ? ['au-dessus', en[0]] : ['en dessous', en[2]]);
      return { visuel: vis, enonce: `Qui est ${mot} de ${en[1]} ?`,
        dire: `Qui est ${mot} ${trois[1][1]} ?`, choix, bonne };
    }
    const bout = Math.random() < .5;
    const [mot, bonne] = horiz ? (bout ? ['tout à gauche', en[0]] : ['tout à droite', en[2]]) : (bout ? ['tout en haut', en[0]] : ['tout en bas', en[2]]);
    return { visuel: vis, enonce: `Qui est ${mot} ?`, dire: `Quel animal est ${mot} ?`, choix, bonne };
  };

  ajouterJeux('CP', 'maths', [
    { id: 'calcul20', titre: 'Calcul jusqu\'à 20', emoji: '🧮', gen: calcul20 },
    { id: 'complements', titre: 'Faire 10', emoji: '🔟', gen: complements },
    { id: 'doubles', titre: 'Doubles et moitiés', emoji: '👯', gen: doubles },
    { id: 'formes', titre: 'Les formes', emoji: '🔺', gen: formes },
    { id: 'heure', titre: 'Lire l\'heure', emoji: '🕒', gen: heure },
    { id: 'monnaie', titre: 'Les euros', emoji: '💶', gen: monnaie },
    { id: 'problemes-cp', titre: 'Petits problèmes', emoji: '🤔', gen: problemes },
    { id: 'reperage', titre: 'Gauche, droite', emoji: '↔️', gen: reperage }
  ]);

  /* =====================================================================
     LECTURE
     ===================================================================== */

  // Sons : [mot, emoji, son cherché, autres sons présents dans le mot].
  const SONS = ['ou', 'on', 'an', 'oi', 'ch', 'in', 'o', 'gn', 'é', 'è', 'eu', 'u'];
  const MOTS_SONS = [
    ['loup', '🐺', 'ou'], ['poule', '🐔', 'ou'], ['souris', '🐭', 'ou'], ['ours', '🐻', 'ou'], ['bouche', '👄', 'ou', 'ch'], ['poussin', '🐤', 'ou', 'in'],
    ['lion', '🦁', 'on'], ['bonbon', '🍬', 'on'], ['citron', '🍋', 'on'], ['savon', '🧼', 'on'], ['mouton', '🐑', 'on', 'ou'], ['cochon', '🐷', 'on', 'o ch'],
    ['dent', '🦷', 'an'], ['gant', '🧤', 'an'], ['tente', '⛺', 'an'], ['enfant', '🧒', 'an'], ['serpent', '🐍', 'an', 'è'], ['éléphant', '🐘', 'an', 'é'], ['pantalon', '👖', 'an', 'on'],
    ['roi', '🤴', 'oi'], ['poire', '🍐', 'oi'], ['boîte', '📦', 'oi'], ['étoile', '⭐', 'oi', 'é'], ['voiture', '🚗', 'oi', 'u'], ['poisson', '🐟', 'oi', 'on'],
    ['chat', '🐱', 'ch'], ['vache', '🐄', 'ch'], ['chien', '🐶', 'ch', 'in'], ['chocolat', '🍫', 'ch', 'o'], ['cheval', '🐴', 'ch', 'eu'], ['chèvre', '🐐', 'ch', 'è'],
    ['lapin', '🐰', 'in'], ['sapin', '🎄', 'in'], ['train', '🚆', 'in'], ['pain', '🍞', 'in'], ['main', '✋', 'in'], ['dauphin', '🐬', 'in', 'o'],
    ['bateau', '⛵', 'o'], ['moto', '🏍️', 'o'], ['seau', '🪣', 'o'], ['robot', '🤖', 'o'], ['piano', '🎹', 'o'], ['gâteau', '🎂', 'o'], ['chapeau', '🎩', 'o', 'ch'],
    ['montagne', '🏔️', 'gn', 'on'], ['cygne', '🦢', 'gn'], ['champignon', '🍄', 'gn', 'ch an on'], ['araignée', '🕷️', 'gn', 'é è'], ['baignoire', '🛁', 'gn', 'é è oi'],
    ['bébé', '👶', 'é'], ['fée', '🧚', 'é'], ['clé', '🔑', 'é'], ['nez', '👃', 'é'], ['café', '☕', 'é'], ['épée', '🗡️', 'é'], ['vélo', '🚲', 'é', 'o'],
    ['fraise', '🍓', 'è'], ['zèbre', '🦓', 'è'], ['forêt', '🌲', 'è', 'o'], ['mer', '🌊', 'è'], ['fête', '🎉', 'è'], ['sirène', '🧜', 'è'],
    ['feu', '🔥', 'eu'], ['deux', '2️⃣', 'eu'], ['neuf', '9️⃣', 'eu'], ['œuf', '🥚', 'eu'], ['fleur', '🌸', 'eu'], ['yeux', '👀', 'eu'],
    ['lune', '🌙', 'u'], ['tortue', '🐢', 'u', 'o'], ['mur', '🧱', 'u'], ['jus', '🧃', 'u'], ['bus', '🚌', 'u'], ['plume', '🪶', 'u'], ['tulipe', '🌷', 'u']
  ];
  const sons = () => {
    const [mot, e, cible, autres = ''] = pioche(MOTS_SONS);
    const exclus = new Set([cible, ...autres.split(' ').filter(Boolean)]);
    return qcm({ visuel: e, enonce: 'Quel son entends-tu ?', dire: `Écoute bien : ${mot}. Quel son entends-tu dans ${mot} ?` },
      cible, SONS.filter(s => !exclus.has(s)));
  };

  // Lire une phrase et trouver l'image (la phrase n'est PAS lue à voix haute).
  const PHRASES = [
    ['Le chien a un os.', '🐶🦴', ['🐱🦴', '🐶⚽', '🐭🧀']],
    ['La souris mange du fromage.', '🐭🧀', ['🐱🧀', '🐭🍎', '🐶🦴']],
    ['Le lapin mange une carotte.', '🐰🥕', ['🐰🍎', '🐭🥕', '🐱🥕']],
    ['Papa lit un livre.', '👨📖', ['👩📖', '👨⚽', '👧📖']],
    ['Maman boit un café.', '👩☕', ['👨☕', '👩🍦', '👧🍦']],
    ['La fille a une fleur.', '👧🌸', ['👦🌸', '👧🍎', '👧⚽']],
    ['Le garçon mange une pomme.', '👦🍎', ['👧🍎', '👦🍌', '👦🍓']],
    ['Il pleut sur la maison.', '🌧️🏠', ['☀️🏠', '🌧️🌳', '❄️🏠']],
    ['Le soleil brille sur la mer.', '☀️🌊', ['🌧️🌊', '☀️🌳', '🌙🌊']],
    ['Le bébé dort dans son lit.', '👶🛏️', ['👶🛁', '🐱🛏️', '👶🍼']],
    ['Le bébé prend son bain.', '👶🛁', ['👶🛏️', '🐶🛁', '👶🍼']],
    ['La pomme est verte.', '🍏', ['🍎', '🍐', '🍋']],
    ['La pomme est rouge.', '🍎', ['🍏', '🍓', '🍒']],
    ['Le cœur est bleu.', '💙', ['❤️', '💚', '💛']],
    ['Le cœur est jaune.', '💛', ['❤️', '💚', '💙']],
    ['Le cœur est vert.', '💚', ['❤️', '💙', '💛']],
    ['L\'avion vole dans le ciel.', '✈️', ['🚗', '🚆', '⛵']],
    ['Le bateau est sur la mer.', '⛵', ['🚗', '✈️', '🚆']],
    ['Léo roule à vélo.', '🚲', ['🛴', '🚗', '🛹']],
    ['Il y a trois pommes.', '🍎🍎🍎', ['🍎🍎', '🍎🍎🍎🍎', '🍐🍐🍐']],
    ['Il y a deux chats.', '🐱🐱', ['🐱', '🐱🐱🐱', '🐶🐶']],
    ['Il y a un chien et un chat.', '🐶🐱', ['🐶🐶', '🐱🐱', '🐶🐭']],
    ['Il y a quatre étoiles.', '⭐⭐⭐⭐', ['⭐⭐⭐', '⭐⭐⭐⭐⭐', '🌙🌙🌙🌙']],
    ['Tom est triste.', '😢', ['😀', '😴', '😡']],
    ['Léa rit.', '😂', ['😢', '😴', '😡']],
    ['Le petit garçon dort.', '😴', ['😀', '😢', '😡']],
    ['Il est très en colère.', '😡', ['😀', '😢', '😴']],
    ['Il fait nuit.', '🌙', ['☀️', '🌈', '🌧️']],
    ['Il neige.', '❄️', ['☀️', '🌧️', '🌈']],
    ['Le singe mange une banane.', '🐵🍌', ['🐵🍎', '🐶🍌', '🐷🍌']],
    ['La poule a un œuf.', '🐔🥚', ['🐔🐤', '🦆🥚', '🐍🥚']],
    ['Le chien boit de l\'eau.', '🐶💧', ['🐶🦴', '🐱💧', '🐶🍖']],
    ['La fille mange une glace.', '👧🍦', ['👦🍦', '👧🍰', '👧🍕']],
    ['Le garçon a un chapeau.', '👦🎩', ['👧🎩', '👦👓', '👨🎩']],
    ['Papa conduit la voiture.', '👨🚗', ['👩🚗', '👨🚲', '👦🚲']],
    ['Le hibou regarde la lune.', '🦉🌙', ['🦉☀️', '🐦🌙', '🐱☀️']],
    ['La tortue mange une salade.', '🐢🥬', ['🐰🥬', '🐢🍓', '🐌🍓']],
    ['L\'escargot est sur la feuille.', '🐌🍃', ['🐛🍃', '🐌🌸', '🐞🌸']],
    ['Le poisson nage.', '🐟', ['🐦', '🐴', '🐱']],
    ['L\'oiseau vole.', '🐦', ['🐟', '🐌', '🐢']],
    ['Je mange une pizza.', '🍕', ['🍦', '🍰', '🍟']],
    ['Maman plante une fleur.', '👩🌷', ['👨🌷', '👩🍎', '👧🍎']]
  ];
  const phrases = (() => {
    let restant = [];
    return () => {
      if (!restant.length) restant = melange(PHRASES);
      const [p, b, f] = restant.pop();
      return qcm({ visuel: '📖', enonce: `<b>${p}</b>`, dire: 'Lis la phrase toute seule, puis touche la bonne image.' }, b, f);
    };
  })();

  // Comprendre un petit texte (lu à l'écran et à voix haute).
  const TEXTES = [
    ['Tom a un chat. Son chat est tout noir.', 'De quelle couleur est le chat ?', '⚫', ['⚪', '🔴', '🟠']],
    ['Léa va à la plage. Elle fait un château de sable.', 'Où est Léa ?', '🏖️', ['🏔️', '🏫', '🌲']],
    ['Papa prépare une soupe. Il coupe des carottes.', 'Que coupe papa ?', '🥕', ['🍎', '🍌', '🍞']],
    ['Il neige dehors. Noé met son bonnet.', 'Que met Noé ?', 'son bonnet', ['son maillot de bain', 'ses lunettes de soleil', 'son short']],
    ['Le chien de Sami s\'appelle Rex. Rex aime courir.', 'Comment s\'appelle le chien ?', 'Rex', ['Sami', 'Max', 'Rox']],
    ['Inès a cinq ans. Son frère a huit ans.', 'Quel âge a Inès ?', '5 ans', ['8 ans', '3 ans', '6 ans']],
    ['Lili plante une graine. Elle l\'arrose chaque jour.', 'Que fait Lili chaque jour ?', 'elle arrose la graine', ['elle chante', 'elle dort', 'elle court']],
    ['Le petit oiseau a froid. Il rentre dans son nid.', 'Où va l\'oiseau ?', 'dans son nid', ['dans l\'eau', 'dans la maison', 'dans la voiture']],
    ['Ce matin, Hugo prend le bus. Il va à l\'école.', 'Comment Hugo va-t-il à l\'école ?', '🚌', ['🚲', '🚗', '🚆']],
    ['Maman a acheté des fraises. Elles sont rouges et sucrées.', 'Qu\'a acheté maman ?', '🍓', ['🍒', '🍎', '🍌']],
    ['Le lapin a faim. Il mange une carotte.', 'Pourquoi le lapin mange-t-il ?', 'parce qu\'il a faim', ['parce qu\'il a froid', 'parce qu\'il est triste', 'parce qu\'il a sommeil']],
    ['Zoé a perdu son doudou. Elle pleure.', 'Comment est Zoé ?', '😢', ['😀', '😡', '😴']],
    ['Le soleil brille. Les enfants vont au parc.', 'Quel temps fait-il ?', '☀️', ['🌧️', '❄️', '🌩️']],
    ['Nina a un ballon rouge. Elle a aussi un ballon bleu.', 'Combien de ballons a Nina ?', '2', ['1', '3', '4']],
    ['Le chat monte dans l\'arbre. Il ne peut plus descendre.', 'Où est le chat ?', 'dans l\'arbre', ['sous le lit', 'dans la cuisine', 'dans sa panière']],
    ['Ce soir, Lucas lit un livre. Puis il s\'endort.', 'Que fait Lucas avant de dormir ?', '📖', ['⚽', '🎨', '🍕']],
    ['Il pleut très fort. Mila prend son parapluie.', 'Que prend Mila ?', '☂️', ['🕶️', '⚽', '🎒']],
    ['Le fermier a trois vaches. Elles mangent de l\'herbe.', 'Combien de vaches a le fermier ?', '3', ['2', '4', '5']],
    ['Adam fête son anniversaire. Il souffle six bougies.', 'Quel âge a Adam ?', '6 ans', ['5 ans', '7 ans', '3 ans']],
    ['La poule a pondu un œuf. Il est dans la paille.', 'Qu\'a pondu la poule ?', '🥚', ['🍎', '🧀', '🥔']],
    ['Jules joue au football. Il marque un but.', 'À quoi joue Jules ?', '⚽', ['🏀', '🎾', '🏓']],
    ['La maîtresse lit une histoire. Les enfants écoutent.', 'Que font les enfants ?', 'ils écoutent', ['ils dorment', 'ils mangent', 'ils dansent']],
    ['Rose a une robe verte. Elle a des chaussures blanches.', 'De quelle couleur est la robe ?', '🟢', ['⚪', '🔴', '🔵']],
    ['Le train part à midi. Mamie est dans le train.', 'Qui est dans le train ?', 'Mamie', ['Papa', 'Papi', 'le chat']],
    ['Le bébé dort. Il ne faut pas faire de bruit.', 'Que fait le bébé ?', '😴', ['😂', '😡', '😋']],
    ['Ali a mal aux dents. Il va chez le dentiste.', 'Où va Ali ?', 'chez le dentiste', ['à la piscine', 'au cinéma', 'au parc']],
    ['Emma mange une pomme. Puis elle boit du lait.', 'Que boit Emma ?', '🥛', ['🧃', '☕', '💧']],
    ['Le renard a vu une poule. Il court vers elle.', 'Qu\'a vu le renard ?', '🐔', ['🐰', '🐭', '🦆']],
    ['Dans la mare, il y a une grenouille. Elle saute sur une feuille.', 'Quel animal saute ?', '🐸', ['🐟', '🦆', '🐢']],
    ['Paul met ses bottes. Il va sauter dans les flaques.', 'Que met Paul ?', 'ses bottes', ['son pyjama', 'ses gants', 'son chapeau']],
    ['Le hérisson dort tout l\'hiver. Il se réveille au printemps.', 'Quand le hérisson se réveille-t-il ?', 'au printemps', ['en hiver', 'en été', 'en automne']],
    ['Mia a quatre bonbons. Elle en donne un à Léo.', 'Combien de bonbons Mia donne-t-elle ?', '1', ['4', '3', '2']],
    ['Le clown a un gros nez rouge. Les enfants rient.', 'Comment sont les enfants ?', '😂', ['😢', '😡', '😴']],
    ['Papi pêche au bord de la rivière. Il attrape un poisson.', 'Qu\'attrape Papi ?', '🐟', ['🐸', '🦆', '🐢']],
    ['Il fait nuit. On voit la lune et les étoiles.', 'Que voit-on dans le ciel ?', '🌙', ['☀️', '🌈', '🦋']],
    ['Lina range ses jouets. Sa chambre est propre.', 'Que fait Lina ?', 'elle range', ['elle mange', 'elle nage', 'elle chante']],
    ['Le camion des pompiers arrive. Il y a le feu !', 'Quel véhicule arrive ?', '🚒', ['🚓', '🚑', '🚌']],
    ['Tim a un chien. Il a aussi deux poissons.', 'Combien d\'animaux a Tim ?', '3', ['2', '1', '4']],
    ['Sara boit un chocolat chaud. Elle a froid aux mains.', 'Que boit Sara ?', 'un chocolat chaud', ['de l\'eau', 'du jus d\'orange', 'du lait froid']],
    ['Le singe grimpe à l\'arbre. Il cueille une banane.', 'Que cueille le singe ?', '🍌', ['🍎', '🥥', '🍐']]
  ];
  const comprendre = (() => {
    let restant = [];
    return () => {
      if (!restant.length) restant = melange(TEXTES);
      const [t, q, b, f] = restant.pop();
      return qcm({ visuel: '📖', enonce: `${t}<br><b>${q}</b>`, dire: `${t} ${q}` }, b, f);
    };
  })();

  // Écrire un mot simple avec les étiquettes-lettres.
  const MOTS_ECRIRE = [
    ['vélo', '🚲'], ['moto', '🏍️'], ['lune', '🌙'], ['tomate', '🍅'], ['kiwi', '🥝'], ['banane', '🍌'], ['pomme', '🍎'], ['poule', '🐔'],
    ['bébé', '👶'], ['fée', '🧚'], ['lama', '🦙'], ['lapin', '🐰'], ['sapin', '🎄'], ['robe', '👗'], ['mur', '🧱'], ['bus', '🚌'],
    ['livre', '📖'], ['avion', '✈️'], ['lion', '🦁'], ['chien', '🐶'], ['vache', '🐄'], ['singe', '🐵'], ['rose', '🌹'], ['nuage', '☁️'],
    ['train', '🚆'], ['pain', '🍞'], ['main', '✋'], ['fusée', '🚀'], ['tortue', '🐢'], ['bouche', '👄'], ['cheval', '🐴'], ['poire', '🍐'],
    ['melon', '🍈'], ['citron', '🍋'], ['mouton', '🐑'], ['zèbre', '🦓'], ['fourmi', '🐜'], ['judo', '🥋'], ['radio', '📻'], ['piano', '🎹'],
    ['tulipe', '🌷'], ['salade', '🥗'], ['panda', '🐼'], ['koala', '🐨'], ['bol', '🥣'], ['orange', '🍊'], ['cadeau', '🎁'], ['bateau', '⛵']
  ];
  const ecrire = () => {
    const [mot, e] = pioche(MOTS_ECRIRE);
    return { type: 'lettres', visuel: e, enonce: 'Écris le mot avec les lettres.', dire: `Écris le mot : ${mot}.`, bonne: mot };
  };

  // Mots-outils : on entend le mot (avec un exemple), on le retrouve écrit.
  const MOTS_OUTILS = [
    ['et', 'papa et maman'], ['est', 'le chat est noir'], ['le', 'le chien'], ['la', 'la lune'], ['les', 'les enfants'],
    ['un', 'un vélo'], ['une', 'une fleur'], ['il', 'il mange'], ['elle', 'elle chante'], ['dans', 'dans la boîte'],
    ['sur', 'sur la table'], ['sous', 'sous le lit'], ['avec', 'avec maman'], ['des', 'des pommes'], ['du', 'du pain'],
    ['pour', 'un cadeau pour toi'], ['je', 'je joue'], ['tu', 'tu cours'], ['nous', 'nous chantons'], ['mon', 'mon vélo'],
    ['ma', 'ma sœur'], ['ton', 'ton sac'], ['pas', 'je ne veux pas'], ['très', 'très grand'], ['aussi', 'moi aussi'],
    ['qui', 'qui est là ?'], ['au', 'au parc'], ['c\'est', 'c\'est beau'], ['mais', 'petit mais fort'], ['ils', 'ils jouent'],
    ['de', 'un verre de lait'], ['par', 'par la fenêtre']
  ];
  const HOMOPHONES_CP = [['et', 'est'], ['mais', 'mes'], ['il', 'ils'], ['elle', 'elles']];
  const motOutilSuivant = sac(MOTS_OUTILS);
  const motsOutils = () => {
    const [mot, ex] = motOutilSuivant();
    const groupe = HOMOPHONES_CP.find(g => g.includes(mot)) || [mot];
    const fausses = MOTS_OUTILS.map(x => x[0]).filter(w => !groupe.includes(w));
    return qcm({ visuel: '👂', enonce: 'Écoute et touche le bon mot.', dire: `Touche le mot : ${mot}. Comme dans : ${ex}.` }, mot, fausses);
  };

  ajouterJeux('CP', 'francais', [
    { id: 'sons', titre: 'Quel son ?', emoji: '👂', gen: sons },
    { id: 'phrases', titre: 'Lire une phrase', emoji: '📝', gen: phrases },
    { id: 'comprendre', titre: 'Petites histoires', emoji: '📚', gen: comprendre },
    { id: 'ecrire', titre: 'Écrire un mot', emoji: '✏️', gen: ecrire },
    { id: 'mots-outils', titre: 'Petits mots', emoji: '🔎', gen: motsOutils }
  ]);

  /* =====================================================================
     LE MONDE
     ===================================================================== */

  MONDE_CP.push(
    { q: 'Que faut-il faire après être allé aux toilettes ?', v: '🚽', b: 'se laver les mains', f: ['aller dormir', 'manger un bonbon', 'rien du tout'] },
    { q: 'Quand se brosse-t-on les dents ?', v: '🦷', b: 'après les repas', f: ['jamais', 'une fois par mois', 'seulement à Noël'] },
    { q: 'Qu\'est-ce qui est bon pour la santé ?', b: '🍎', f: ['🍭', '🍩', '🍟'] },
    { q: 'Quel animal a des plumes ?', b: '🐦', f: ['🐶', '🐟', '🐸'] },
    { q: 'Quel animal a des écailles ?', b: '🐟', f: ['🐱', '🐶', '🐰'] },
    { q: 'Quel animal a une carapace ?', b: '🐢', f: ['🐍', '🐸', '🐭'] },
    { q: 'Le têtard devient…', v: '💧', b: '🐸', f: ['🐟', '🐍', '🦆'] },
    { q: 'La chenille devient…', v: '🐛', b: '🦋', f: ['🐝', '🐞', '🐜'] },
    { q: 'Le veau est le bébé de quel animal ?', b: '🐄', f: ['🐴', '🐷', '🐑'] },
    { q: 'L\'agneau est le bébé de quel animal ?', b: '🐑', f: ['🐄', '🐷', '🐴'] },
    { q: 'Le chaton est le bébé de quel animal ?', b: '🐱', f: ['🐶', '🐰', '🐭'] },
    { q: 'Le poulain est le bébé de quel animal ?', b: '🐴', f: ['🐄', '🐷', '🐔'] },
    { q: 'Quand on plante une graine, que pousse-t-il ?', b: '🌱', f: ['🪨', '🚗', '🧸'] },
    { q: 'Quand un glaçon chauffe, il devient…', v: '🧊☀️', b: '💧', f: ['🪨', '🔥', '❄️'] },
    { q: 'Quel objet flotte sur l\'eau ?', v: '🌊', b: 'un bouchon', f: ['un caillou', 'une clé', 'une bille en fer'] },
    { q: 'Où bat ton cœur ?', v: '❤️', b: 'dans la poitrine', f: ['dans le pied', 'dans le nez', 'dans la main'] },
    { q: 'Quand on court, le cœur bat…', v: '🏃', b: 'plus vite', f: ['plus lentement', 'pas du tout'] },
    { q: 'Avec quoi touche-t-on ?', b: '✋', f: ['👂', '👁️', '👃'] },
    { q: 'Combien avons-nous de sens ?', v: '👁️👂👃👅✋', b: '5', f: ['3', '7', '10'] },
    { q: 'Quel aliment est fait avec du lait ?', b: '🧀', f: ['🍞', '🍎', '🥕'] },
    { q: 'Quel aliment nous donne la poule ?', b: '🥚', f: ['🧀', '🥛', '🍞'] },
    { q: 'D\'où tombe la pluie ?', b: '☁️', f: ['☀️', '🌈', '⭐'] },
    { q: 'Qu\'est-ce qui fond au soleil ?', b: '⛄', f: ['🪨', '🌳', '🏠'] },
    { q: 'Quel animal dort tout l\'hiver ?', v: '❄️💤', b: '🦔', f: ['🐶', '🐔', '🐄'] },
    { q: 'Quel animal vit à la ferme ?', b: '🐷', f: ['🦁', '🐬', '🐧'] },
    { q: 'Quel animal vit dans la forêt ?', b: '🦊', f: ['🐬', '🐙', '🐪'] },
    { q: 'Vers quel âge perd-on ses premières dents de lait ?', v: '🦷', b: 'vers 6 ans', f: ['à 1 an', 'à 30 ans', 'à 80 ans'] },
    { q: 'Sous la peau, qu\'est-ce qui nous tient debout ?', v: '🦴', b: 'les os', f: ['les cheveux', 'les ongles', 'les vêtements'] },
    { q: 'Qu\'est-ce qui n\'est pas vivant ?', b: '🪨', f: ['🐶', '🌳', '🐟'] },
    { q: 'De quoi un animal a-t-il besoin pour vivre ?', v: '🐶', b: 'de manger et de boire', f: ['de jouets', 'de télévision', 'de rien du tout'] }
  );

  // Se repérer dans le temps.
  const ETAPES = [
    [['🌰', 'on plante la graine'], ['💧', 'on arrose'], ['🌱', 'la pousse sort'], ['🌻', 'la fleur a poussé']],
    [['🥚', 'l\'œuf'], ['🐣', 'le poussin sort de l\'œuf'], ['🐥', 'le poussin'], ['🐔', 'la poule']],
    [['👶', 'le bébé'], ['🧒', 'l\'enfant'], ['🧑', 'l\'adulte'], ['👴', 'la personne âgée']],
    [['🌅', 'le matin'], ['☀️', 'midi'], ['🌙', 'la nuit']],
    [['🥚', 'l\'œuf'], ['🐛', 'la chenille'], ['🦋', 'le papillon']],
    [['❄️', 'il neige'], ['⛄', 'on fait un bonhomme de neige'], ['☀️', 'le bonhomme de neige fond']],
    [['🧼', 'on se lave les mains'], ['🍽️', 'on mange'], ['🦷', 'on se brosse les dents']],
    [['🥣', 'on mélange la pâte'], ['🔥', 'on fait cuire'], ['🎂', 'on mange le gâteau']],
    [['⏰', 'le réveil sonne'], ['🥣', 'le petit-déjeuner'], ['🎒', 'on part à l\'école']],
    [['✏️', 'on écrit la lettre'], ['📮', 'on la met dans la boîte aux lettres'], ['📨', 'le facteur apporte la lettre']]
  ];
  const MOMENTS = [
    { q: 'Quand prend-on le petit-déjeuner ?', v: '🥣', b: 'le matin', f: ['le soir', 'la nuit', 'l\'après-midi'] },
    { q: 'Quand prend-on le goûter ?', v: '🍪', b: 'l\'après-midi', f: ['le matin', 'la nuit', 'à midi'] },
    { q: 'Quand dîne-t-on ?', v: '🍲', b: 'le soir', f: ['le matin', 'à midi', 'l\'après-midi'] },
    { q: 'Quand déjeune-t-on à la cantine ?', v: '🍽️', b: 'à midi', f: ['le matin', 'le soir', 'la nuit'] },
    { q: 'Quand dort-on ?', v: '🛏️', b: 'la nuit', f: ['à midi', 'le matin', 'l\'après-midi'] },
    { q: 'Quand le soleil se lève-t-il ?', v: '🌅', b: 'le matin', f: ['le soir', 'à midi', 'la nuit'] },
    { q: 'Quand voit-on les étoiles ?', v: '⭐', b: 'la nuit', f: ['le matin', 'à midi', 'l\'après-midi'] },
    { q: 'Quel est le premier jour de la semaine ?', v: '📅', b: 'lundi', f: ['dimanche', 'mardi', 'samedi'] },
    { q: 'Quels sont les jours du week-end ?', v: '📅', b: 'samedi et dimanche', f: ['lundi et mardi', 'mercredi et jeudi', 'vendredi et lundi'] },
    { q: 'Quel est le premier mois de l\'année ?', v: '🗓️', b: 'janvier', f: ['décembre', 'mars', 'septembre'] },
    { q: 'En quel mois fête-t-on Noël ?', v: '🎄', b: 'décembre', f: ['janvier', 'juillet', 'mai'] },
    { q: 'En quel mois fait-on la rentrée des classes ?', v: '🎒', b: 'septembre', f: ['janvier', 'décembre', 'juillet'] },
    { q: 'Qu\'est-ce qui dure le plus longtemps ?', v: '⏳', b: 'une année', f: ['une journée', 'une semaine', 'un mois'] },
    { q: 'Qu\'est-ce qui dure le moins longtemps ?', v: '⏱️', b: 'une minute', f: ['une heure', 'un jour', 'une semaine'] },
    { q: 'Quel objet sert à lire l\'heure ?', b: '⏰', f: ['📅', '🌡️', '📏'] },
    { q: 'Quel objet montre les jours et les mois ?', b: '📅', f: ['⏰', '🌡️', '⚖️'] },
    { q: 'Le jour avant aujourd\'hui s\'appelle…', v: '⬅️', b: 'hier', f: ['demain', 'après-demain', 'ce soir'] },
    { q: 'Le jour après aujourd\'hui s\'appelle…', v: '➡️', b: 'demain', f: ['hier', 'avant-hier', 'ce matin'] },
    { q: 'Autrefois, sans électricité, avec quoi s\'éclairait-on ?', b: '🕯️', f: ['💡', '📱', '📺'] },
    { q: 'Quel objet n\'existait pas du temps des grands-parents de tes grands-parents ?', b: '📱', f: ['🕯️', '🪑', '🧺'] }
  ];
  const quizMoments = depuisListe(MOMENTS);
  const temps = () => {
    const t = Math.random();
    if (t < .3) {
      const i = alea(0, 6), sens = Math.random() < .5 ? 'hier' : 'demain';
      const r = JOURS[(i + (sens === 'demain' ? 1 : 6)) % 7];
      const q = `Aujourd'hui, c'est ${JOURS[i]}. ${sens === 'demain' ? 'Quel jour serons-nous demain' : 'Quel jour étions-nous hier'} ?`;
      return qcm({ visuel: '📅', enonce: q, dire: q }, r, JOURS.filter(j => j !== JOURS[i]));
    }
    if (t < .65) {
      const s = pioche(ETAPES), n = s.length, em = s.map(x => x[0]);
      const k = alea(0, 3);
      let q, e, bonne;
      if (k === 0) { bonne = em[0]; q = 'Qu\'est-ce qui vient en premier ?'; e = q; }
      else if (k === 1) { bonne = em[n - 1]; q = 'Qu\'est-ce qui vient en dernier ?'; e = q; }
      else if (k === 2) { const i = alea(0, n - 2); bonne = em[i + 1]; q = `Qu'est-ce qui vient juste après : ${s[i][1]} ?`; e = `Qu'est-ce qui vient juste après ${em[i]} ?`; }
      else { const i = alea(1, n - 1); bonne = em[i - 1]; q = `Qu'est-ce qui vient juste avant : ${s[i][1]} ?`; e = `Qu'est-ce qui vient juste avant ${em[i]} ?`; }
      return { visuel: '⏳', enonce: e, dire: q, choix: melange(em), bonne };
    }
    return quizMoments();
  };

  const CITOYEN = [
    { q: 'Que dit-on quand on arrive le matin ?', v: '🌅', b: 'Bonjour', f: ['Au revoir', 'Bonne nuit', 'Bon appétit'] },
    { q: 'Que dit-on quand on reçoit un cadeau ?', v: '🎁', b: 'Merci', f: ['Bonjour', 'Pardon', 'Au revoir'] },
    { q: 'Que dit-on pour demander poliment ?', v: '🙏', b: 'S\'il te plaît', f: ['Bonne nuit', 'Au revoir', 'Bon appétit'] },
    { q: 'Tu as bousculé un camarade sans faire exprès. Que dis-tu ?', v: '😬', b: 'Pardon', f: ['Bravo', 'Bonjour', 'Bon appétit'] },
    { q: 'Que dit-on avant de manger ?', v: '🍽️', b: 'Bon appétit', f: ['Bonne nuit', 'Pardon', 'Au revoir'] },
    { q: 'Que dit-on en partant de l\'école ?', v: '🏫', b: 'Au revoir', f: ['Bonjour', 'Bon appétit', 'Pardon'] },
    { q: 'En classe, pour parler, on…', v: '🙋', b: 'lève le doigt', f: ['crie très fort', 'tape sur la table', 'se met debout sur la chaise'] },
    { q: 'Quand la maîtresse parle, on…', v: '👩‍🏫', b: 'écoute', f: ['crie', 'court', 'chante'] },
    { q: 'Un camarade est tombé. Que fais-tu ?', v: '🤕', b: 'je l\'aide', f: ['je me moque', 'je le pousse', 'je pars en courant'] },
    { q: 'A-t-on le droit de taper un camarade ?', v: '✋', b: 'non, jamais', f: ['oui', 'oui, s\'il m\'embête'] },
    { q: 'Où jette-t-on un papier ?', v: '📄', b: 'dans la poubelle', f: ['par terre', 'dans la cour', 'sous la table'] },
    { q: 'Pour traverser la rue, on passe sur…', v: '🚸', b: 'le passage piéton', f: ['le milieu de la route', 'le parking', 'le rond-point'] },
    { q: 'Le petit bonhomme du feu est rouge. Que fais-tu ?', v: '🚦', b: 'je m\'arrête', f: ['je traverse', 'je cours vite'] },
    { q: 'Avant de traverser, on regarde…', v: '👀', b: 'à gauche et à droite', f: ['le ciel', 'ses chaussures', 'son cartable'] },
    { q: 'Dans la rue, avec un adulte, tu lui donnes…', v: '🚶', b: 'la main', f: ['un coup de pied', 'ton goûter', 'ton manteau'] },
    { q: 'Où marche-t-on dans la rue ?', v: '🏙️', b: 'sur le trottoir', f: ['au milieu de la route', 'sur la piste cyclable', 'sur les rails'] },
    { q: 'En voiture, on attache…', v: '🚗', b: 'sa ceinture', f: ['ses lacets', 'son manteau', 'son cartable'] },
    { q: 'À vélo, on protège sa tête avec…', v: '🚲', b: 'un casque', f: ['une casquette', 'un bonnet', 'un chapeau'] },
    { q: 'Quelles sont les couleurs du drapeau français ?', v: '❓', b: 'bleu, blanc, rouge', f: ['vert, blanc, rouge', 'bleu, jaune, rouge', 'noir, jaune, rouge'] },
    { q: 'Quel pays a un drapeau bleu, blanc, rouge ?', v: '🏳️', b: 'la France', f: ['l\'Italie', 'l\'Allemagne', 'l\'Espagne'] },
    { q: 'Le 14 juillet, c\'est…', v: '🎆', b: 'la fête nationale', f: ['Noël', 'la rentrée', 'Pâques'] },
    { q: 'Un camarade est triste. Que fais-tu ?', v: '😢', b: 'je le console', f: ['je me moque de lui', 'je lui prends son jouet'] },
    { q: 'Tu veux le jouet d\'un ami. Que fais-tu ?', v: '🧸', b: 'je lui demande', f: ['je le prends de force', 'je le tape'] },
    { q: 'Quand on n\'est pas d\'accord, on…', v: '🗣️', b: 'en parle calmement', f: ['se tape', 'dit des gros mots'] },
    { q: 'À la fin de la journée, on range ses affaires…', v: '🎒', b: 'à sa place', f: ['par terre', 'dans la poubelle'] },
    { q: 'Quel numéro appelle-t-on pour les pompiers ?', v: '📞', b: '18', f: ['81', '12', '10'] },
    { q: 'Qui éteint les incendies ?', v: '🔥', b: '🚒', f: ['🚓', '🚜', '🚌'] },
    { q: 'Tu trouves un médicament par terre. Que fais-tu ?', v: '💊', b: 'je le donne à un adulte', f: ['je le mange', 'je le goûte'] },
    { q: 'Un inconnu te propose des bonbons pour le suivre. Que fais-tu ?', v: '🍬', b: 'je dis non et je préviens un adulte', f: ['je le suis', 'je prends les bonbons'] },
    { q: 'Dans le couloir de l\'école, on…', v: '🏫', b: 'marche calmement', f: ['court très vite', 'crie fort'] },
    { q: 'À la cantine, on…', v: '🍽️', b: 'mange calmement', f: ['lance la nourriture', 'crie debout sur sa chaise'] },
    { q: 'Les filles et les garçons peuvent-ils jouer ensemble ?', v: '👧👦', b: 'oui, bien sûr', f: ['non, jamais', 'seulement le lundi'] },
    { q: 'Tout le monde a le droit…', v: '🤝', b: 'd\'être respecté', f: ['d\'être moqué', 'd\'être tapé'] },
    { q: 'Les règles de la classe servent à…', v: '📜', b: 'bien vivre ensemble', f: ['faire du bruit', 'se disputer'] },
    { q: 'Quelle couleur du feu dit aux voitures de s\'arrêter ?', v: '🚦', b: '🔴', f: ['🟢', '🔵'] },
    { q: 'Où attend-on le bus ?', v: '🚌', b: 'à l\'arrêt de bus', f: ['au milieu de la route', 'sur le passage piéton'] },
    { q: 'Quand on tousse, on met devant sa bouche…', v: '😷', b: 'son coude', f: ['rien du tout', 'la main de son voisin'] },
    { q: 'Pour être bien vu la nuit sur la route, on porte…', v: '🌙', b: 'un gilet jaune', f: ['un habit noir', 'un pyjama', 'un déguisement de fantôme'] },
    { q: 'Qui dirige la commune ?', v: '🏛️', b: 'le maire', f: ['le boulanger', 'le facteur', 'le maître'] },
    { q: 'Un camarade est nouveau dans la classe. Que fais-tu ?', v: '🧒', b: 'je l\'invite à jouer', f: ['je l\'ignore', 'je me moque de lui'] }
  ];

  const ESPACE = [
    { q: 'Un plan, c\'est un dessin vu…', v: '🗺️', b: 'd\'en haut', f: ['de côté', 'd\'en dessous'] },
    { q: 'Pour trouver son chemin, on utilise…', b: '🗺️', f: ['🧸', '🥄', '🎨'] },
    { q: 'Sur une carte, de quelle couleur est la mer ?', v: '🗺️', b: '🔵', f: ['🔴', '🟡', '🟤'] },
    { q: 'Sur une carte, la forêt est souvent en…', v: '🗺️', b: '🟢', f: ['🔵', '🔴', '⚫'] },
    { q: 'Qu\'est-ce qui montre les choses en vrai, comme on les voit ?', b: 'une photo', f: ['un plan', 'une carte'] },
    { q: 'Où mange-t-on à midi à l\'école ?', v: '🍽️', b: 'à la cantine', f: ['dans la cour', 'au gymnase', 'à la bibliothèque'] },
    { q: 'Où joue-t-on pendant la récréation ?', v: '⚽', b: 'dans la cour', f: ['à la cantine', 'dans le bureau du directeur', 'dans les toilettes'] },
    { q: 'Où emprunte-t-on des livres ?', v: '📚', b: 'à la bibliothèque', f: ['à la cantine', 'dans la cour', 'au gymnase'] },
    { q: 'Où fait-on du sport quand il pleut ?', v: '🤸', b: 'au gymnase', f: ['à la cantine', 'à la bibliothèque', 'dans la cour'] },
    { q: 'Où soigne-t-on les grands malades ?', v: '🤒', b: 'à l\'hôpital', f: ['à la boulangerie', 'à la piscine', 'à la gare'] },
    { q: 'Où achète-t-on du pain ?', v: '🥖', b: 'à la boulangerie', f: ['à la pharmacie', 'à la poste', 'à la gare'] },
    { q: 'Où prend-on le train ?', v: '🚆', b: 'à la gare', f: ['à l\'aéroport', 'au port', 'à la piscine'] },
    { q: 'Où prend-on l\'avion ?', v: '✈️', b: 'à l\'aéroport', f: ['à la gare', 'au port', 'à la mairie'] },
    { q: 'Où va-t-on pour nager ?', v: '🏊', b: 'à la piscine', f: ['à la boulangerie', 'à la bibliothèque', 'à la poste'] },
    { q: 'Où travaille le maire ?', v: '🏛️', b: 'à la mairie', f: ['à la piscine', 'à la ferme', 'à la gare'] },
    { q: 'Quel transport roule sur des rails ?', b: '🚆', f: ['🚗', '🚲', '⛵'] },
    { q: 'Quel transport vole dans le ciel ?', b: '✈️', f: ['🚆', '🚌', '⛵'] },
    { q: 'Quel transport va sur l\'eau ?', b: '⛵', f: ['🚆', '✈️', '🚗'] },
    { q: 'Quel transport n\'a pas de moteur ?', b: '🚲', f: ['🚗', '🚌', '🏍️'] },
    { q: 'Quel transport emmène beaucoup d\'enfants à l\'école ?', b: '🚌', f: ['🚲', '🏍️', '🛴'] },
    { q: 'Quel véhicule transporte les malades ?', b: '🚑', f: ['🚒', '🚜', '🚕'] },
    { q: 'Quel véhicule travaille dans les champs ?', b: '🚜', f: ['🚑', '🚓', '🚒'] },
    { q: 'Quel véhicule va dans l\'espace ?', b: '🚀', f: ['✈️', '🚁', '⛵'] },
    { q: 'Qu\'est-ce qui est le plus loin de nous ?', b: '⭐', f: ['🏠', '🌳', '🏫'] },
    { q: 'Pour aller dans un pays très loin, on prend…', b: '✈️', f: ['🛴', '🛹', '🚲'] },
    { q: 'Pour aller chez le voisin, tout près, on peut…', v: '🏠', b: 'marcher', f: ['prendre l\'avion', 'prendre la fusée', 'prendre le bateau'] },
    { q: 'Où y a-t-il beaucoup d\'immeubles et de magasins ?', v: '🏙️', b: 'en ville', f: ['à la campagne', 'au milieu de la forêt', 'sur une île déserte'] },
    { q: 'Où trouve-t-on des champs et des fermes ?', v: '🚜', b: 'à la campagne', f: ['en ville', 'au bord de la mer', 'dans le désert'] },
    { q: 'Où trouve-t-on du sable et des vagues ?', b: '🏖️', f: ['🏔️', '🏙️', '🌲'] },
    { q: 'Où trouve-t-on de hauts sommets et de la neige ?', b: '🏔️', f: ['🏖️', '🏙️', '🏜️'] },
    { q: 'Sur quelle planète vivons-nous ?', v: '🌍', b: 'la Terre', f: ['la Lune', 'le Soleil', 'Mars'] },
    { q: 'Qu\'est-ce qui est le plus grand ?', b: 'une ville', f: ['une maison', 'une école', 'une classe'] },
    { q: 'Pour voir tous les pays du monde, on regarde…', v: '🌐', b: 'un globe', f: ['un calendrier', 'une horloge', 'un thermomètre'] },
    { q: 'Où range-t-on la voiture à la maison ?', v: '🚗', b: 'au garage', f: ['dans la chambre', 'dans la cuisine', 'dans la baignoire'] },
    { q: 'Où dort-on à la maison ?', v: '🛏️', b: 'dans la chambre', f: ['dans le garage', 'dans le jardin', 'dans la cave'] },
    { q: 'Quel transport est le plus rapide ?', b: '✈️', f: ['🚲', '🛴', '🐴'] }
  ];

  ajouterJeux('CP', 'monde', [
    { id: 'temps', titre: 'Le temps qui passe', emoji: '⏳', gen: temps },
    { id: 'citoyen', titre: 'Vivre ensemble', emoji: '🤝', gen: depuisListe(CITOYEN) },
    { id: 'espace', titre: 'Se repérer', emoji: '🗺️', gen: depuisListe(ESPACE) }
  ]);

  /* =====================================================================
     ANGLAIS
     ===================================================================== */
  const CORPS_EN = [
    ['eye', '👁️'], ['ear', '👂'], ['nose', '👃'], ['mouth', '👄', 'bouche'], ['hand', '✋', 'main'], ['finger', '☝️', 'main'],
    ['foot', '🦶', 'jambe'], ['leg', '🦵', 'jambe'], ['arm', '💪'], ['tooth', '🦷'], ['tongue', '👅', 'bouche'], ['heart', '❤️'],
    ['brain', '🧠'], ['bone', '🦴'], ['hair', '💇']
  ];
  const BONJOUR_EN = [
    ['Hello!', '👋', 'salut'], ['Goodbye!', '👋🚪', 'salut'], ['Good morning!', '🌅'], ['Good night!', '🌙'], ['Thank you!', '🎁'],
    ['Yes', '👍'], ['No', '👎'], ['happy', '😀'], ['sad', '😢'], ['angry', '😠'], ['tired', '😴'], ['scared', '😱', 'bouche ouverte'],
    ['hot', '🥵'], ['cold', '🥶'], ['sick', '🤒'], ['hungry', '🍽️'], ['surprised', '😮', 'bouche ouverte']
  ];
  const MOTS_EN_2 = [
    ['pig', '🐷'], ['sheep', '🐑'], ['duck', '🦆'], ['chicken', '🐔'], ['rabbit', '🐰'], ['mouse', '🐭'], ['lion', '🦁'],
    ['elephant', '🐘'], ['monkey', '🐵'], ['bear', '🐻'], ['frog', '🐸'], ['snake', '🐍'], ['tiger', '🐯'], ['pear', '🍐'],
    ['strawberry', '🍓'], ['cake', '🎂'], ['bread', '🍞'], ['milk', '🥛'], ['cheese', '🧀'], ['egg', '🥚'], ['carrot', '🥕'],
    ['ice cream', '🍦'], ['chocolate', '🍫'], ['grapes', '🍇'], ['lemon', '🍋'], ['cherry', '🍒'], ['tomato', '🍅']
  ];
  ajouterJeux('CP', 'anglais', [
    { id: 'corps-en', titre: 'My body', emoji: '🖐️', gen: ecouteEn(CORPS_EN) },
    { id: 'bonjour-en', titre: 'Hello!', emoji: '👋', gen: ecouteEn(BONJOUR_EN) },
    { id: 'mots-en-2', titre: 'Animals and food', emoji: '🐷', gen: ecouteEn(MOTS_EN_2) }
  ]);

  /* =====================================================================
     ARTS ET MUSIQUE
     ===================================================================== */
  const MELANGES = [['🔴', '🟡', '🟠', 'rouge', 'jaune', 'orange'], ['🔵', '🟡', '🟢', 'bleu', 'jaune', 'vert'], ['🔴', '🔵', '🟣', 'rouge', 'bleu', 'violet']];
  const COULEURS_OBJETS = [
    ['🍌', 'la banane', '🟡'], ['🍓', 'la fraise', '🔴'], ['🥦', 'le brocoli', '🟢'], ['🍆', 'l\'aubergine', '🟣'], ['🥕', 'la carotte', '🟠'],
    ['🍊', 'l\'orange', '🟠'], ['🐸', 'la grenouille', '🟢'], ['🍋', 'le citron', '🟡'], ['🍫', 'le chocolat', '🟤'], ['🐻', 'l\'ours', '🟤'],
    ['🍅', 'la tomate', '🔴'], ['🍒', 'la cerise', '🔴'], ['🥒', 'le concombre', '🟢'], ['🍇', 'le raisin', '🟣'], ['🌽', 'le maïs', '🟡'],
    ['☁️', 'le nuage', '⚪'], ['🌰', 'la châtaigne', '🟤']
  ];
  const RONDS = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪'];
  const couleurs = () => {
    const t = Math.random();
    if (t < .35) {
      const m = pioche(MELANGES);
      const [a, b] = Math.random() < .5 ? [0, 1] : [1, 0];
      return qcm({ visuel: `${m[a]} + ${m[b]} = ?`, enonce: 'Quelle couleur obtiens-tu ?', dire: `Si on mélange du ${m[a + 3]} et du ${m[b + 3]}, quelle couleur obtient-on ?` },
        m[2], [...MELANGES.filter(x => x !== m).map(x => x[2]), '🟤', '⚫']);
    }
    if (t < .6) {
      const m = pioche(MELANGES);
      return qcm({ visuel: m[2], enonce: 'Quelles couleurs faut-il mélanger ?', dire: `Pour faire ${m[5] === 'orange' ? 'de l\'' : 'du '}${m[5]}, quelles couleurs faut-il mélanger ?` },
        `${m[0]} + ${m[1]}`, [...MELANGES.filter(x => x !== m).map(x => `${x[0]} + ${x[1]}`), '⚫ + ⚪']);
    }
    const [e, nom, c] = pioche(COULEURS_OBJETS);
    return qcm({ visuel: e, enonce: 'De quelle couleur ?', dire: `De quelle couleur est ${nom} ?` }, c, RONDS.filter(x => x !== c));
  };

  const INSTRUMENTS = [['🥁', 'le tambour'], ['🎸', 'la guitare'], ['🎹', 'le piano'], ['🎺', 'la trompette'], ['🎻', 'le violon'],
    ['🎷', 'le saxophone'], ['🪗', 'l\'accordéon'], ['🔔', 'la cloche']];
  const QUIZ_INSTRUMENTS = [
    { q: 'Dans quel instrument souffle-t-on ?', b: '🎺', f: ['🥁', '🎸', '🎹'] },
    { q: 'Quel instrument a des cordes ?', b: '🎸', f: ['🥁', '🎺', '🎷'] },
    { q: 'Quel instrument a des touches noires et blanches ?', b: '🎹', f: ['🥁', '🎻', '🎺'] },
    { q: 'Sur quel instrument tape-t-on avec des baguettes ?', b: '🥁', f: ['🎸', '🎺', '🎻'] },
    { q: 'Avec quel instrument utilise-t-on un archet ?', b: '🎻', f: ['🎸', '🥁', '🎺'] },
    { q: 'Avec quoi écoute-t-on la musique ?', b: '👂', f: ['👃', '👅', '🦶'] },
    { q: 'Qu\'est-ce qui sert à peindre ?', b: '🖌️', f: ['✂️', '🥄', '🔨'] },
    { q: 'Qu\'est-ce qui sert à découper le papier ?', b: '✂️', f: ['🖌️', '🥄', '🖍️'] }
  ];
  const quizInstr = depuisListe(QUIZ_INSTRUMENTS);
  const instrSuivant = sac(INSTRUMENTS);
  const instruments = () => {
    if (Math.random() < .3) return quizInstr();
    const [e, nom] = instrSuivant();
    const autres = melange(INSTRUMENTS.filter(x => x[0] !== e)).slice(0, 3).map(x => x[0]);
    return { visuel: '🎵', enonce: 'Écoute et touche le bon instrument.', dire: `Touche : ${nom}.`, choix: melange([e, ...autres]), bonne: e };
  };

  ajouterMatiere('CP', {
    id: 'arts', titre: 'Arts et musique', emoji: '🎨', couleur: '#d94f9c', jeux: [
      { id: 'couleurs', titre: 'Les couleurs', emoji: '🖍️', gen: couleurs },
      { id: 'instruments', titre: 'Les instruments', emoji: '🎸', gen: instruments }
    ]
  });
})();
