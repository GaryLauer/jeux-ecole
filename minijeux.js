// Mini-jeux d'arcade (récompenses) : dessin sur canvas, emoji comme seuls graphismes.
// API : MINIJEUX = [{ id, titre, emoji, description, lancer(conteneur, options, fini) -> stop }]
//   options : { niveau: 'CP' | 'CM1', son(type), duree? (secondes, pour les tests), hauteur? (px) }
//   fini(score) est appelé une seule fois en fin de partie ; stop() nettoie tout sans appeler fini.
const MINIJEUX = (function () {
  'use strict';

  const POLICE = '"Comic Sans MS", "Chalkboard SE", "Trebuchet MS", system-ui, sans-serif';
  const POLICE_EMOJI = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
  const ORANGE = '#ff8a3d', VERT = '#3bb273', ROUGE = '#e5484d', CREME = '#fff8ec', TEXTE = '#2d2a32';

  const rand = (a, b) => a + Math.random() * (b - a);
  const choix = t => t[Math.floor(Math.random() * t.length)];
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, k) => a + (b - a) * clamp(k, 0, 1);
  const easeOutBack = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  function melanger(t) { for (let i = t.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [t[i], t[j]] = [t[j], t[i]]; } return t; }
  function rondRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* ================================================================
     Moteur commun : canvas, HUD, décompte, chrono, particules, fin.
     ================================================================ */
  function moteur(conteneur, options, fini, def) {
    options = options || {};
    const cp = options.niveau !== 'CM1';
    const duree = options.duree > 0 ? options.duree : def.duree;
    const son = t => { try { if (typeof options.son === 'function') options.son(t); } catch (e) { /* son facultatif */ } };

    conteneur.innerHTML = '';
    const racine = document.createElement('div');
    racine.style.cssText = `position:relative;width:100%;overflow:hidden;border-radius:18px;background:${CREME};` +
      `font-family:${POLICE};user-select:none;-webkit-user-select:none;touch-action:none;box-shadow:0 6px 0 rgba(0,0,0,.12);`;
    const hud = document.createElement('div');
    const HUD_H = 54;
    hud.style.cssText = `position:relative;display:flex;align-items:center;justify-content:space-between;gap:8px;height:${HUD_H}px;` +
      `padding:0 10px;background:${ORANGE};color:#fff;font-weight:bold;font-size:22px;box-sizing:border-box;`;
    const pastille = 'background:rgba(255,255,255,.28);border-radius:30px;padding:4px 14px;white-space:nowrap;';
    const elScore = document.createElement('div'); elScore.style.cssText = pastille;
    const elInfo = document.createElement('div');
    elInfo.style.cssText = 'flex:1;text-align:center;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:20px;';
    const elTemps = document.createElement('div'); elTemps.style.cssText = pastille + 'transition:transform .15s;';
    const barre = document.createElement('div');
    barre.style.cssText = 'position:absolute;left:0;bottom:0;height:5px;background:#fff;opacity:.85;width:100%;';
    hud.append(elScore, elInfo, elTemps, barre);
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;touch-action:none;cursor:pointer;';
    racine.append(hud, canvas);
    conteneur.appendChild(racine);
    const ctx = canvas.getContext('2d');

    let arrete = false, finiAppele = false, raf = 0, dernier = performance.now();
    let dpr = 1;
    const cache = new Map();

    const g = {
      cp, niveau: cp ? 'CP' : 'CM1', son, duree,
      W: 300, H: 300, u: 1, ctx,
      score: 0, t: 0, restant: duree, etat: 'decompte', tEtat: 0,
      appuye: false, info: '', secousse: 0, messageFin: '',
      particules: [], popups: [], minuteurs: [],
      ajouter(n, x, y, couleur) {
        g.score = Math.max(0, g.score + n);
        if (x !== undefined) g.popup(x, y, (n > 0 ? '+' : '') + n, couleur || (n > 0 ? VERT : ROUGE), n >= 3 ? 1.4 : 1);
        if (n > 0) pulseScore = 1;
      },
      popup(x, y, texte, couleur, taille) { g.popups.push({ x, y, texte, couleur: couleur || VERT, vie: 0, max: 1, taille: taille || 1 }); },
      eclat(x, y, o) {
        o = o || {};
        const n = o.n || 12, couleurs = o.couleurs || [ORANGE, VERT, '#ffd23f', '#4aa8ff'], v = (o.vitesse || 260) * g.u;
        for (let i = 0; i < n; i++) {
          const a = rand(0, Math.PI * 2), s = rand(0.35, 1) * v;
          g.particules.push({
            x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - (o.haut || 0) * g.u, vie: 0, max: rand(0.45, 0.9) * (o.duree || 1),
            couleur: choix(couleurs), taille: rand(4, 9) * g.u * (o.taille || 1), emoji: o.emoji ? choix(o.emoji) : null,
            gravite: (o.gravite === undefined ? 500 : o.gravite) * g.u, rot: rand(0, 6), vr: rand(-6, 6)
          });
        }
      },
      anneau(x, y, couleur, rayon) { g.particules.push({ anneau: true, x, y, vie: 0, max: 0.4, couleur: couleur || '#fff', rayon: rayon || 50 * g.u }); },
      apres(s, fn) { g.minuteurs.push({ t: s, fn }); },
      finir(message) { if (g.etat === 'jeu') { if (message) g.messageFin = message; terminer(); } },
      emoji(e, x, y, taille, o) {
        if (taille < 2) return;
        o = o || {};
        const base = Math.max(16, Math.min(256, Math.round(taille / 16) * 16));
        const cle = e + '|' + base;
        let c = cache.get(cle);
        if (!c) {
          if (cache.size > 250) cache.clear();
          c = document.createElement('canvas');
          const px = Math.ceil(base * dpr * 1.4);
          c.width = c.height = px;
          const cx = c.getContext('2d');
          cx.font = `${Math.round(base * dpr)}px ${POLICE_EMOJI}`;
          cx.textAlign = 'center'; cx.textBaseline = 'middle';
          cx.fillText(e, px / 2, px / 2 + base * dpr * 0.07);
          cache.set(cle, c);
        }
        const w = (c.width / dpr) * (taille / base);
        ctx.save();
        ctx.translate(x, y);
        if (o.rot) ctx.rotate(o.rot);
        if (o.sx !== undefined || o.sy !== undefined) ctx.scale(o.sx === undefined ? 1 : o.sx, o.sy === undefined ? 1 : o.sy);
        if (o.alpha !== undefined) ctx.globalAlpha *= clamp(o.alpha, 0, 1);
        ctx.drawImage(c, -w / 2, -w / 2, w, w);
        ctx.restore();
      },
      texte(s, x, y, taille, couleur, o) {
        o = o || {};
        ctx.save();
        ctx.font = `bold ${Math.round(taille)}px ${POLICE}`;
        ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
        if (o.alpha !== undefined) ctx.globalAlpha *= clamp(o.alpha, 0, 1);
        if (o.contour !== false) {
          ctx.lineJoin = 'round';
          ctx.lineWidth = Math.max(3, taille * 0.16);
          ctx.strokeStyle = o.contour || '#fff';
          ctx.strokeText(s, x, y);
        }
        ctx.fillStyle = couleur || TEXTE;
        ctx.fillText(s, x, y);
        ctx.restore();
      }
    };

    let pulseScore = 0, pulseTemps = 0;
    let dernierHud = '';

    function majHud() {
      const sec = Math.ceil(Math.max(0, g.restant));
      const cle = g.score + '|' + sec + '|' + g.info;
      if (cle !== dernierHud) {
        if (dernierHud && sec !== +dernierHud.split('|')[1] && sec <= 10 && g.etat === 'jeu') pulseTemps = 1;
        dernierHud = cle;
        elScore.textContent = '⭐ ' + g.score;
        elTemps.textContent = '⏱️ ' + sec;
        elTemps.style.background = sec <= 10 && g.etat === 'jeu' ? ROUGE : 'rgba(255,255,255,.28)';
        elInfo.textContent = g.info;
      }
      elScore.style.transform = `scale(${1 + pulseScore * 0.25})`;
      elTemps.style.transform = `scale(${1 + pulseTemps * 0.2})`;
      barre.style.width = (100 * clamp(g.restant / duree, 0, 1)).toFixed(2) + '%';
    }

    function redimensionner() {
      const w = Math.max(200, Math.floor(conteneur.clientWidth || racine.clientWidth || window.innerWidth));
      const hTot = Math.max(260, Math.floor(options.hauteur || (window.innerHeight - 90)));
      const h = hTot - HUD_H;
      dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.style.height = h + 'px';
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cache.clear();
      g.W = w; g.H = h;
      g.u = clamp(Math.min(w / 800, h / 600), 0.6, 1.4);
      hud.style.fontSize = w < 420 ? '18px' : '22px';
      elInfo.style.fontSize = w < 420 ? '15px' : '20px';
      if (def.redim) def.redim(g);
    }

    function position(e) {
      const r = canvas.getBoundingClientRect();
      return [(e.clientX - r.left) * (g.W / (r.width || 1)), (e.clientY - r.top) * (g.H / (r.height || 1))];
    }
    function onDown(e) {
      e.preventDefault();
      try { canvas.setPointerCapture(e.pointerId); } catch (er) { /* rien */ }
      g.appuye = true;
      const [x, y] = position(e);
      if (g.etat === 'jeu' && def.appui) def.appui(g, x, y, e);
    }
    function onMove(e) {
      const [x, y] = position(e);
      if (g.etat === 'jeu' && def.bouge) def.bouge(g, x, y, e);
    }
    function onUp(e) {
      g.appuye = false;
      const [x, y] = position(e);
      if (g.etat === 'jeu' && def.lache) def.lache(g, x, y, e);
    }
    function onKey(e) {
      if (g.etat === 'jeu' && def.touche && def.touche(g, e.key)) e.preventDefault();
    }
    const bloque = e => e.preventDefault();

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('contextmenu', bloque);
    racine.addEventListener('touchmove', bloque, { passive: false });
    racine.addEventListener('touchstart', bloque, { passive: false });
    window.addEventListener('resize', redimensionner);
    window.addEventListener('keydown', onKey);

    function terminer() {
      g.etat = 'fin'; g.tEtat = 0; g.appuye = false;
      son('bonus');
      g.particules.length = 0;
      g.eclat(g.W / 2, g.H * 0.45, { n: 30, vitesse: 560, emoji: ['⭐', '🎉', '✨'], taille: 1.1, gravite: 380, haut: 150, duree: 2 });
      g.eclat(g.W / 2, g.H * 0.45, { n: 30, vitesse: 480, couleurs: [ORANGE, VERT, '#ffd23f', '#4aa8ff', '#ff8fc8'], taille: 1.2, gravite: 380, haut: 150, duree: 2 });
    }

    function majParticules(dt) {
      for (let i = g.particules.length - 1; i >= 0; i--) {
        const p = g.particules[i];
        p.vie += dt;
        if (p.vie >= p.max) { g.particules.splice(i, 1); continue; }
        if (!p.anneau) { p.vy += p.gravite * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; }
      }
      for (let i = g.popups.length - 1; i >= 0; i--) {
        const p = g.popups[i];
        p.vie += dt; p.y -= 55 * g.u * dt;
        if (p.vie >= p.max) g.popups.splice(i, 1);
      }
    }
    function dessinerParticules() {
      for (const p of g.particules) {
        const k = p.vie / p.max;
        if (p.anneau) {
          ctx.save();
          ctx.globalAlpha = 1 - k;
          ctx.strokeStyle = p.couleur; ctx.lineWidth = 5 * g.u * (1 - k) + 1;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.rayon * (0.4 + k), 0, Math.PI * 2); ctx.stroke();
          ctx.restore();
        } else if (p.emoji) {
          g.emoji(p.emoji, p.x, p.y, p.taille * 3.2, { alpha: 1 - k * k, rot: p.rot });
        } else {
          ctx.globalAlpha = 1 - k * k;
          ctx.fillStyle = p.couleur;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.taille * (1 - k * 0.5), 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
      for (const p of g.popups) {
        const k = p.vie / p.max;
        const s = k < 0.2 ? easeOutBack(k / 0.2) : 1;
        g.texte(p.texte, p.x, p.y, 34 * g.u * p.taille * s, p.couleur, { alpha: 1 - Math.max(0, k - 0.6) / 0.4 });
      }
    }

    function voile(alpha) {
      ctx.fillStyle = `rgba(255,248,236,${alpha})`;
      ctx.fillRect(0, 0, g.W, g.H);
    }

    function dessinerDecompte() {
      voile(0.72);
      const t = g.tEtat, n = 3 - Math.floor(t);
      const k = t % 1;
      const s = easeOutBack(clamp(k / 0.35, 0, 1));
      const grand = Math.min(g.W, g.H);
      g.texte(def.titre || '', g.W / 2, g.H * 0.2, Math.min(44 * g.u, g.W / 12), ORANGE);
      if (def.consigne) {
        const taille = Math.min(26 * g.u, g.W / 17);
        ctx.font = `bold ${Math.round(taille)}px ${POLICE}`;
        const lignes = [];
        for (const para of String(def.consigne).split('\n')) {
          let ligne = '';
          for (const mot of para.split(' ')) {
            const essai = ligne ? ligne + ' ' + mot : mot;
            if (ligne && ctx.measureText(essai).width > g.W - 28) { lignes.push(ligne); ligne = mot; } else ligne = essai;
          }
          lignes.push(ligne);
        }
        lignes.forEach((l, i) => g.texte(l, g.W / 2, g.H * 0.2 + Math.min(48 * g.u, g.W / 10) + i * taille * 1.35, taille, TEXTE));
      }
      if (n >= 1) g.texte(String(n), g.W / 2, g.H * 0.6, grand * 0.3 * s, ORANGE, { contour: '#fff', alpha: 1 - Math.max(0, k - 0.8) * 5 });
      else g.texte('C\'est parti !', g.W / 2, g.H * 0.6, Math.min(grand * 0.14, g.W / 8) * s, VERT);
    }

    function dessinerFin() {
      const k = clamp(g.tEtat / 0.4, 0, 1);
      voile(0.65 * k);
      const s = easeOutBack(k);
      const taille = Math.min(g.W / 7, 80 * g.u);
      g.texte('Terminé !', g.W / 2, g.H * 0.36, taille * s, ORANGE);
      if (g.messageFin) g.texte(g.messageFin, g.W / 2, g.H * 0.36 + taille * 0.9, taille * 0.4 * s, TEXTE);
      g.texte('⭐ ' + g.score, g.W / 2, g.H * 0.62, taille * 0.9 * s, VERT);
    }

    const DECOMPTE = 3.7, DUREE_FIN = 2.3;

    function boucle(now) {
      if (arrete) return;
      raf = requestAnimationFrame(boucle);
      const dt = Math.min(0.05, Math.max(0, (now - dernier) / 1000));
      dernier = now;
      g.tEtat += dt;
      pulseScore = Math.max(0, pulseScore - dt * 4);
      pulseTemps = Math.max(0, pulseTemps - dt * 3);
      g.secousse = Math.max(0, g.secousse - dt * 2.5);

      if (g.etat === 'decompte') {
        if (g.tEtat >= DECOMPTE) { g.etat = 'jeu'; g.tEtat = 0; son('bonus'); }
      } else if (g.etat === 'jeu') {
        g.t += dt;
        g.restant = duree - g.t;
        for (let i = g.minuteurs.length - 1; i >= 0; i--) {
          const m = g.minuteurs[i];
          m.t -= dt;
          if (m.t <= 0) { g.minuteurs.splice(i, 1); m.fn(); if (arrete) return; }
        }
        if (g.etat === 'jeu') def.maj(g, dt);
        if (g.etat === 'jeu' && g.restant <= 0) { g.restant = 0; terminer(); }
      } else if (g.etat === 'fin') {
        if (g.tEtat >= DUREE_FIN && !finiAppele) {
          finiAppele = true;
          arrete = true;
          cancelAnimationFrame(raf);
          const score = Math.max(0, Math.round(g.score)) | 0;
          try { fini(score); } catch (e) { setTimeout(() => { throw e; }); }
          return;
        }
      }
      if (def.anim) def.anim(g, dt); // animations décoratives, même hors jeu
      majParticules(dt);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, g.W, g.H);
      ctx.save();
      if (g.secousse > 0) ctx.translate(Math.sin(now / 22) * 8 * g.secousse * g.u, Math.cos(now / 29) * 5 * g.secousse * g.u);
      def.dessin(g, ctx);
      if (g.etat !== 'fin') dessinerParticules();
      ctx.restore();
      if (g.etat === 'decompte') dessinerDecompte();
      else if (g.etat === 'fin') { dessinerFin(); dessinerParticules(); }
      majHud();
    }

    redimensionner();
    if (def.init) def.init(g);
    majHud();
    raf = requestAnimationFrame(boucle);

    return function stop() {
      if (arrete && !conteneur.firstChild) return;
      arrete = true;
      cancelAnimationFrame(raf);
      g.minuteurs.length = 0;
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('contextmenu', bloque);
      racine.removeEventListener('touchmove', bloque);
      racine.removeEventListener('touchstart', bloque);
      window.removeEventListener('resize', redimensionner);
      window.removeEventListener('keydown', onKey);
      cache.clear();
      conteneur.innerHTML = '';
    };
  }

  /* Décor : ciel + herbe */
  function ciel(g, ctx, haut, bas) {
    const d = ctx.createLinearGradient(0, 0, 0, g.H);
    d.addColorStop(0, haut || '#bfe9ff'); d.addColorStop(1, bas || CREME);
    ctx.fillStyle = d; ctx.fillRect(0, 0, g.W, g.H);
  }
  function nuageBlanc(ctx, x, y, s) {
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    ctx.beginPath();
    ctx.arc(x, y, 22 * s, 0, Math.PI * 2);
    ctx.arc(x + 26 * s, y - 10 * s, 28 * s, 0, Math.PI * 2);
    ctx.arc(x + 56 * s, y, 22 * s, 0, Math.PI * 2);
    ctx.rect(x, y, 56 * s, 22 * s);
    ctx.fill();
  }

  /* ================================================================
     1. Attrape les fruits
     ================================================================ */
  const FRUITS = ['🍎', '🍌', '🍓', '🍇', '🍊', '🍐', '🍉', '🍒', '🍑', '🍍', '🥝'];
  const jeuFruits = {
    titre: 'Attrape les fruits', duree: 50,
    consigne: 'Glisse ton doigt pour bouger le panier 🧺\nÉvite les nuages de pluie 🌧️',
    init(g) {
      g.p = { x: g.W / 2, cible: g.W / 2, squash: 0, secoue: 0 };
      g.objets = [];
      g.prochain = 0.4;
      g.deco = [0, 1, 2].map(i => ({ x: rand(0, g.W), y: rand(30, g.H * 0.35), v: rand(8, 20), s: rand(0.7, 1.2) }));
      g.info = 'Attrape les fruits !';
    },
    redim(g) { if (g.p) { g.p.x = clamp(g.p.x, 0, g.W); g.p.cible = clamp(g.p.cible, 0, g.W); } },
    appui(g, x) { g.p.cible = x; },
    bouge(g, x, y, e) { if (g.appuye || e.pointerType === 'mouse') g.p.cible = x; },
    touche(g, k) {
      if (k === 'ArrowLeft') { g.p.cible = g.p.x - 80 * g.u; return true; }
      if (k === 'ArrowRight') { g.p.cible = g.p.x + 80 * g.u; return true; }
      return false;
    },
    panier(g) {
      const w = (g.cp ? 150 : 118) * g.u;
      return { w, y: g.H - w * 0.5 - 16 * g.u };
    },
    anim(g, dt) {
      for (const d of g.deco) { d.x += d.v * dt; if (d.x > g.W + 80) d.x = -120; }
    },
    maj(g, dt) {
      const k = g.t / g.duree;
      const p = g.p, pan = jeuFruits.panier(g);
      p.cible = clamp(p.cible, pan.w / 2, g.W - pan.w / 2);
      p.x += (p.cible - p.x) * Math.min(1, dt * 16);
      p.squash = Math.max(0, p.squash - dt * 4);
      p.secoue = Math.max(0, p.secoue - dt * 3);

      g.prochain -= dt;
      if (g.prochain <= 0) {
        g.prochain = (g.cp ? lerp(1.0, 0.55, k) : lerp(0.75, 0.36, k)) * rand(0.8, 1.2);
        const r = Math.random();
        const type = g.t > 4 && r < 0.05 ? 'etoile' : r < 0.05 + (g.cp ? 0.1 : 0.15) && g.t > 2 ? 'pluie' : 'fruit';
        const taille = (g.cp ? 66 : 54) * g.u * (type === 'etoile' ? 0.95 : 1);
        const vit = (g.cp ? lerp(150, 270, k) : lerp(200, 400, k)) * g.u * rand(0.85, 1.15) * (type === 'etoile' ? 1.15 : 1);
        g.objets.push({
          type, e: type === 'fruit' ? choix(FRUITS) : type === 'etoile' ? '⭐' : '🌧️',
          x: rand(taille, g.W - taille), y: -taille, vy: vit, taille, rot: rand(-0.4, 0.4), vr: rand(-2, 2), ph: rand(0, 6), apparait: 0
        });
      }
      const haut = pan.y - pan.w * 0.25;
      for (let i = g.objets.length - 1; i >= 0; i--) {
        const o = g.objets[i];
        o.y += o.vy * dt;
        o.apparait = Math.min(1, o.apparait + dt * 5);
        o.rot += o.vr * dt;
        if (o.type === 'pluie') o.x += Math.sin(g.t * 2 + o.ph) * 40 * g.u * dt;
        if (o.y + o.taille * 0.3 >= haut && o.y - o.taille * 0.3 <= pan.y + pan.w * 0.2 && Math.abs(o.x - p.x) < pan.w * 0.5) {
          g.objets.splice(i, 1);
          const px = o.x, py = haut;
          if (o.type === 'fruit') {
            g.ajouter(1, px, py - 20 * g.u);
            g.son('bon');
            p.squash = 1;
            g.eclat(px, py, { n: 10, couleurs: ['#ff5a5a', '#ffd23f', VERT, ORANGE], vitesse: 220, haut: 150 });
          } else if (o.type === 'etoile') {
            g.ajouter(5, px, py - 30 * g.u, '#f5a300');
            g.son('bonus');
            p.squash = 1.3;
            g.eclat(px, py, { n: 16, emoji: ['✨', '⭐'], vitesse: 320, haut: 200 });
            g.anneau(px, py, '#ffd23f', 90 * g.u);
          } else {
            g.ajouter(-2, px, py - 20 * g.u);
            g.son('faux');
            p.secoue = 1; g.secousse = 0.6;
            g.eclat(px, py, { n: 14, couleurs: ['#4aa8ff', '#8ccfff', '#bfe3ff'], vitesse: 200, haut: 120 });
          }
          continue;
        }
        if (o.y - o.taille > g.H) g.objets.splice(i, 1);
      }
    },
    dessin(g, ctx) {
      ciel(g, ctx);
      g.emoji('☀️', g.W - 60 * g.u, 60 * g.u, 80 * g.u, { rot: g.tEtat * 0.2 });
      for (const d of g.deco) nuageBlanc(ctx, d.x, d.y, d.s * g.u);
      // herbe
      const hy = g.H - 40 * g.u;
      ctx.fillStyle = VERT; ctx.fillRect(0, hy, g.W, g.H - hy);
      ctx.fillStyle = '#2f9a60';
      for (let x = 0; x < g.W; x += 22 * g.u) { ctx.beginPath(); ctx.arc(x, hy, 12 * g.u, Math.PI, 0); ctx.fill(); }
      for (const o of g.objets) {
        const s = easeOutBack(o.apparait);
        const brille = o.type === 'etoile' ? 1 + Math.sin(g.t * 12) * 0.12 : 1;
        if (o.type === 'etoile') {
          ctx.fillStyle = 'rgba(255,215,60,.35)';
          ctx.beginPath(); ctx.arc(o.x, o.y, o.taille * 0.75 * brille, 0, Math.PI * 2); ctx.fill();
        }
        g.emoji(o.e, o.x, o.y, o.taille * s * brille, { rot: o.type === 'pluie' ? 0 : o.rot });
      }
      const p = g.p, pan = jeuFruits.panier(g);
      const sq = Math.sin(p.squash * Math.PI) * 0.18;
      const dx = Math.sin(g.tEtat * 50) * 8 * g.u * p.secoue;
      ctx.fillStyle = 'rgba(0,0,0,.15)';
      ctx.beginPath(); ctx.ellipse(p.x, pan.y + pan.w * 0.38, pan.w * 0.45, pan.w * 0.09, 0, 0, Math.PI * 2); ctx.fill();
      g.emoji('🧺', p.x + dx, pan.y, pan.w, { sx: 1 + sq, sy: 1 - sq });
    }
  };

  /* ================================================================
     2. Memory
     ================================================================ */
  const ANIMAUX = ['🐶', '🐱', '🐭', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🦉', '🐢', '🐙', '🦋'];
  const jeuMemory = {
    titre: 'Memory des animaux', duree: 60,
    consigne: 'Retourne les cartes et trouve les paires !',
    init(g) {
      const nPaires = g.cp ? 6 : 8;
      const choisis = melanger(ANIMAUX.slice()).slice(0, nPaires);
      g.cartes = melanger(choisis.concat(choisis)).map(e => ({ e, ouvert: false, trouve: false, f: 0, pop: 0, x: 0, y: 0, w: 0, h: 0, tTrouve: 0 }));
      g.ouvertes = []; g.bloque = false; g.paires = 0; g.nPaires = nPaires; g.essais = 0;
      jeuMemory.redim(g);
      g.info = `Paires : 0 / ${nPaires}`;
    },
    redim(g) {
      if (!g.cartes) return;
      const n = g.cartes.length;
      let cols = g.cp ? 4 : 4, rows = n / cols;
      if (g.cp && g.H > g.W * 1.1) { cols = 3; rows = 4; }
      const marge = 14 * g.u, gap = Math.max(8, 12 * g.u);
      const cw = (g.W - marge * 2 - gap * (cols - 1)) / cols;
      const ch = (g.H - marge * 2 - gap * (rows - 1)) / rows;
      const h = Math.min(ch, cw * 1.25), w = Math.min(cw, h * 0.95);
      const totW = cols * w + (cols - 1) * gap, totH = rows * h + (rows - 1) * gap;
      const x0 = (g.W - totW) / 2, y0 = (g.H - totH) / 2;
      g.cartes.forEach((c, i) => {
        c.w = w; c.h = h;
        c.x = x0 + (i % cols) * (w + gap);
        c.y = y0 + Math.floor(i / cols) * (h + gap);
      });
    },
    appui(g, x, y) {
      if (g.bloque) return;
      const c = g.cartes.find(c => x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h);
      if (!c || c.ouvert || c.trouve) return;
      c.ouvert = true; c.pop = 1;
      g.ouvertes.push(c);
      if (g.ouvertes.length < 2) return;
      const [a, b] = g.ouvertes;
      g.ouvertes = [];
      g.essais++;
      if (a.e === b.e) {
        g.bloque = true;
        g.apres(0.3, () => {
          a.trouve = b.trouve = true; a.tTrouve = b.tTrouve = g.t;
          a.pop = b.pop = 1;
          g.paires++;
          g.info = `Paires : ${g.paires} / ${g.nPaires}`;
          g.son('bon');
          for (const c of [a, b]) g.eclat(c.x + c.w / 2, c.y + c.h / 2, { n: 12, emoji: ['✨', '⭐', '💚'], vitesse: 260, haut: 100 });
          g.ajouter(5, (a.x + b.x + a.w) / 2, (a.y + b.y) / 2 + a.h / 2);
          g.bloque = false;
          if (g.paires === g.nPaires) {
            g.bloque = true;
            const bonus = Math.ceil(Math.max(0, g.restant) / 3);
            g.apres(0.6, () => {
              if (bonus > 0) { g.ajouter(bonus, g.W / 2, g.H / 2, '#f5a300'); g.popup(g.W / 2, g.H / 2 - 50 * g.u, 'Bonus temps !', ORANGE, 1.1); }
              g.son('bonus');
              g.apres(1.1, () => g.finir('Toutes les paires !'));
            });
          }
        });
      } else {
        g.bloque = true;
        g.apres(0.45, () => g.son('faux'));
        g.apres(g.cp ? 1.0 : 0.8, () => { a.ouvert = b.ouvert = false; g.bloque = false; });
      }
    },
    anim(g, dt) {
      if (!g.cartes) return;
      for (const c of g.cartes) {
        const cible = c.ouvert || c.trouve ? 1 : 0;
        c.f += clamp(cible - c.f, -dt * 5, dt * 5);
        c.pop = Math.max(0, c.pop - dt * 3);
      }
    },
    maj() {},
    dessin(g, ctx) {
      ciel(g, ctx, '#ffe7cf', CREME);
      // petits pois décoratifs
      ctx.fillStyle = 'rgba(255,138,61,.08)';
      for (let y = 20; y < g.H; y += 60) for (let x = (y / 60) % 2 ? 30 : 0; x < g.W; x += 60) { ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill(); }
      for (const c of g.cartes) {
        const sx = Math.abs(Math.cos(c.f * Math.PI));
        const face = c.f > 0.5;
        const pop = 1 + Math.sin(c.pop * Math.PI) * 0.08;
        const bob = c.trouve ? Math.sin((g.t - c.tTrouve) * 4 + c.x) * 2 * g.u : 0;
        const cx = c.x + c.w / 2, cy = c.y + c.h / 2 + bob;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(Math.max(0.02, sx) * pop, pop);
        const r = 14 * g.u;
        ctx.fillStyle = 'rgba(0,0,0,.14)';
        rondRect(ctx, -c.w / 2, -c.h / 2 + 5, c.w, c.h, r); ctx.fill();
        if (face) {
          ctx.fillStyle = c.trouve ? '#eafff1' : '#fff';
          rondRect(ctx, -c.w / 2, -c.h / 2, c.w, c.h, r); ctx.fill();
          ctx.lineWidth = 4 * g.u; ctx.strokeStyle = c.trouve ? VERT : '#ffd1ae';
          ctx.stroke();
          ctx.restore();
          g.emoji(c.e, cx, cy, Math.min(c.w, c.h) * 0.62, { sx: Math.max(0.02, sx) * pop, sy: pop });
        } else {
          const d = ctx.createLinearGradient(0, -c.h / 2, 0, c.h / 2);
          d.addColorStop(0, '#ffa463'); d.addColorStop(1, ORANGE);
          ctx.fillStyle = d;
          rondRect(ctx, -c.w / 2, -c.h / 2, c.w, c.h, r); ctx.fill();
          ctx.lineWidth = 4 * g.u; ctx.strokeStyle = '#fff'; ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,.9)';
          ctx.font = `bold ${Math.round(Math.min(c.w, c.h) * 0.45)}px ${POLICE}`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('?', 0, 2);
          ctx.restore();
        }
      }
    }
  };

  /* ================================================================
     3. Tape les taupes
     ================================================================ */
  const jeuTaupes = {
    titre: 'Tape les taupes', duree: 50,
    consigne: 'Tape les taupes 🐹 dès qu\'elles sortent !\nMais ne touche pas le lapin 🐰',
    init(g) {
      g.trous = [];
      for (let i = 0; i < 9; i++) g.trous.push({ occ: null, h: 0, phase: 'vide', t: 0, haut: 1, touche: false, reac: 0 });
      g.prochain = 0.3;
      g.fleurs = [];
      jeuTaupes.redim(g);
      g.info = 'Tape les taupes 🐹';
    },
    redim(g) {
      if (!g.trous) return;
      const haut = 20 * g.u;
      const cw = g.W / 3, ch = (g.H - haut) / 3;
      g.rTrou = Math.min(cw * 0.34, ch * 0.4) * (g.cp ? 1.05 : 0.95);
      g.trous.forEach((t, i) => {
        t.x = cw * (i % 3 + 0.5);
        t.y = haut + ch * (Math.floor(i / 3) + 0.68);
      });
      g.fleurs = [];
      for (let i = 0; i < 14; i++) g.fleurs.push({ x: rand(0, g.W), y: rand(0, g.H), e: choix(['🌼', '🌷', '🌱', '🍀']), s: rand(18, 30) * g.u });
    },
    appui(g, x, y) {
      const r = g.rTrou, ms = r * 1.5;
      let cible = null, meilleure = Infinity;
      for (const t of g.trous) {
        if (!t.occ || t.touche || t.h < 0.3) continue;
        const my = jeuTaupes.yTaupe(t, ms) ;
        const d = Math.hypot(x - t.x, y - my);
        if (d < ms * 0.75 && d < meilleure) { meilleure = d; cible = t; }
      }
      if (!cible) { g.anneau(x, y, 'rgba(120,80,40,.6)', 30 * g.u); return; }
      cible.touche = true; cible.reac = 1;
      cible.phase = 'haut'; cible.t = Math.max(cible.t, cible.haut - 0.35);
      const my = jeuTaupes.yTaupe(cible, ms) - ms * 0.4;
      if (cible.occ === 'taupe') {
        g.ajouter(1, cible.x, my);
        g.son('bon');
        g.eclat(cible.x, my + ms * 0.3, { n: 10, emoji: ['⭐', '✨'], vitesse: 240, haut: 180 });
        g.anneau(cible.x, my + ms * 0.4, '#ffd23f', ms * 0.8);
      } else {
        g.ajouter(-1, cible.x, my);
        g.popup(cible.x, my - 36 * g.u, 'Pas le lapin !', ROUGE, 0.7);
        g.son('faux');
        g.secousse = 0.4;
      }
    },
    yTaupe(t, ms) { return t.y + ms * 0.8 - t.h * ms * 1.05; },
    maj(g, dt) {
      const k = g.t / g.duree;
      const actifs = g.trous.filter(t => t.occ).length;
      const max = g.cp ? (k < 0.5 ? 2 : 3) : (k < 0.4 ? 3 : 4);
      g.prochain -= dt;
      if (g.prochain <= 0 && actifs < max) {
        g.prochain = (g.cp ? lerp(1.0, 0.6, k) : lerp(0.75, 0.4, k)) * rand(0.7, 1.3);
        const libres = g.trous.filter(t => !t.occ);
        if (libres.length) {
          const t = choix(libres);
          t.occ = g.t > 3 && Math.random() < (g.cp ? 0.15 : 0.22) ? 'lapin' : 'taupe';
          t.phase = 'monte'; t.t = 0; t.h = 0; t.touche = false; t.reac = 0;
          t.haut = (g.cp ? lerp(1.5, 1.0, k) : lerp(1.1, 0.65, k)) * (t.occ === 'lapin' ? 1.3 : 1);
        }
      }
      for (const t of g.trous) {
        if (!t.occ) continue;
        t.reac = Math.max(0, t.reac - dt * 2);
        if (t.phase === 'monte') { t.h += dt / 0.15; if (t.h >= 1) { t.h = 1; t.phase = 'haut'; t.t = 0; } }
        else if (t.phase === 'haut') { t.t += dt; if (t.t >= t.haut) t.phase = 'descend'; }
        else if (t.phase === 'descend') { t.h -= dt / (t.touche ? 0.2 : 0.15); if (t.h <= 0) { t.h = 0; t.occ = null; t.phase = 'vide'; } }
      }
    },
    dessin(g, ctx) {
      const d = ctx.createLinearGradient(0, 0, 0, g.H);
      d.addColorStop(0, '#8fdc8a'); d.addColorStop(1, '#4fbf6a');
      ctx.fillStyle = d; ctx.fillRect(0, 0, g.W, g.H);
      for (const f of g.fleurs) g.emoji(f.e, f.x, f.y, f.s, { alpha: 0.8 });
      const r = g.rTrou, ms = r * 1.5;
      for (const t of g.trous) {
        // monticule de terre
        ctx.fillStyle = '#a0703f';
        ctx.beginPath(); ctx.ellipse(t.x, t.y + r * 0.08, r * 1.12, r * 0.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#3d2718';
        ctx.beginPath(); ctx.ellipse(t.x, t.y, r, r * 0.36, 0, 0, Math.PI * 2); ctx.fill();
        if (t.occ) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(t.x - r * 2, t.y - ms * 3, r * 4, ms * 3);
          ctx.ellipse(t.x, t.y, r, r * 0.36, 0, 0, Math.PI * 2);
          ctx.clip();
          const my = jeuTaupes.yTaupe(t, ms);
          const sq = t.reac > 0 ? Math.sin(t.reac * Math.PI * 3) * 0.12 * t.reac : 0;
          const e = t.occ === 'taupe' ? '🐹' : '🐰';
          g.emoji(e, t.x, my, ms, { sx: 1 + sq, sy: 1 - sq });
          ctx.restore();
          if (t.touche && t.occ === 'taupe' && t.h > 0.5) g.emoji('💫', t.x, my - ms * 0.55, ms * 0.45, { rot: g.t * 4 });
          if (t.touche && t.occ === 'lapin' && t.h > 0.5) g.emoji('😮', t.x + ms * 0.45, my - ms * 0.45, ms * 0.35);
        }
        // lèvre avant du trou
        ctx.strokeStyle = '#8b5a2b'; ctx.lineWidth = r * 0.16;
        ctx.beginPath(); ctx.ellipse(t.x, t.y, r * 1.02, r * 0.38, 0, 0.05, Math.PI - 0.05); ctx.stroke();
      }
    }
  };

  /* ================================================================
     4. Éclate les bulles
     ================================================================ */
  const TYPES_BULLES = [
    { e: '🐟', c: '#4aa8ff', nom: 'les poissons' },
    { e: '🍎', c: '#ff5a5a', nom: 'les pommes' },
    { e: '🐤', c: '#ffc93c', nom: 'les poussins' },
    { e: '🐸', c: '#3bb273', nom: 'les grenouilles' },
    { e: '🍇', c: '#9b6bff', nom: 'les raisins' },
    { e: '🌸', c: '#ff8fc8', nom: 'les fleurs' }
  ];
  const jeuBulles = {
    titre: 'Éclate les bulles', duree: 50,
    consigne: 'Éclate seulement les bonnes bulles !\nRegarde bien en haut de l\'écran 👀',
    init(g) {
      g.types = g.cp ? TYPES_BULLES.slice(0, 4) : TYPES_BULLES.slice();
      g.bulles = [];
      g.cible = Math.floor(Math.random() * g.types.length);
      g.tCible = 0; g.annonce = 1.5;
      g.prochain = 0;
      g.info = 'Éclate : ' + g.types[g.cible].e;
      // quelques bulles déjà à l'écran
      for (let i = 0; i < 5; i++) jeuBulles.nouvelle(g, rand(g.H * 0.3, g.H));
    },
    nouvelle(g, y) {
      const k = g.t / g.duree;
      const arc = g.t > 5 && Math.random() < 0.04;
      const bonne = Math.random() < 0.4;
      let ti = g.cible;
      if (!bonne) { ti = Math.floor(Math.random() * (g.types.length - 1)); if (ti >= g.cible) ti++; }
      const r = (g.cp ? 50 : 40) * g.u * rand(0.9, 1.1);
      g.bulles.push({
        type: arc ? null : g.types[ti], ti: arc ? -1 : ti, arc,
        x0: 0, x: 0, y: y === undefined ? g.H + r : y, r,
        vy: (g.cp ? rand(65, 95) : rand(95, 145)) * g.u * (1 + 0.5 * k),
        amp: rand(10, 30) * g.u, f: rand(1, 2.2), ph: rand(0, 6), s: 0
      });
      const nb = g.bulles[g.bulles.length - 1];
      nb.x0 = nb.x = rand(r + nb.amp, g.W - r - nb.amp);
    },
    changerCible(g) {
      let n = Math.floor(Math.random() * (g.types.length - 1));
      if (n >= g.cible) n++;
      g.cible = n; g.tCible = 0; g.annonce = 1.6;
      g.info = 'Éclate : ' + g.types[g.cible].e;
    },
    appui(g, x, y) {
      let b = null, meilleure = Infinity;
      for (const c of g.bulles) {
        const d = Math.hypot(x - c.x, y - c.y);
        if (d < c.r * 1.2 && d < meilleure) { meilleure = d; b = c; }
      }
      if (!b) return;
      g.bulles.splice(g.bulles.indexOf(b), 1);
      if (b.arc) {
        g.ajouter(3, b.x, b.y, '#f5a300');
        g.son('bonus');
        g.eclat(b.x, b.y, { n: 18, couleurs: ['#ff5a5a', '#ffc93c', '#3bb273', '#4aa8ff', '#9b6bff'], vitesse: 300, gravite: 200 });
        g.anneau(b.x, b.y, '#fff', b.r * 1.3);
      } else if (b.ti === g.cible) {
        g.ajouter(1, b.x, b.y);
        g.son('bon');
        g.eclat(b.x, b.y, { n: 12, couleurs: [b.type.c, '#fff'], vitesse: 240, gravite: 200 });
        g.anneau(b.x, b.y, b.type.c, b.r * 1.2);
      } else {
        g.ajouter(-1, b.x, b.y);
        g.son('faux');
        g.eclat(b.x, b.y, { n: 8, couleurs: ['#aaa', '#ccc'], vitesse: 160, gravite: 400 });
        g.secousse = 0.3;
      }
    },
    anim(g, dt) { g.annonce = Math.max(0, g.annonce - dt); },
    maj(g, dt) {
      const k = g.t / g.duree;
      g.tCible += dt;
      if (g.tCible >= 10 && g.restant > 3) jeuBulles.changerCible(g);
      g.prochain -= dt;
      if (g.prochain <= 0) {
        g.prochain = (g.cp ? lerp(0.65, 0.45, k) : lerp(0.48, 0.3, k)) * rand(0.8, 1.2);
        jeuBulles.nouvelle(g);
      }
      for (let i = g.bulles.length - 1; i >= 0; i--) {
        const b = g.bulles[i];
        b.y -= b.vy * dt;
        b.s = Math.min(1, b.s + dt * 4);
        if (b.y < -b.r * 1.5) g.bulles.splice(i, 1);
      }
    },
    dessin(g, ctx) {
      ciel(g, ctx, '#c8ecff', '#eaf8ff');
      ctx.fillStyle = 'rgba(255,255,255,.35)';
      for (let i = 0; i < 6; i++) {
        const x = (i * 197 + g.tEtat * 12) % (g.W + 100) - 50, y = (i * 131) % g.H;
        ctx.beginPath(); ctx.arc(x, y, 30 + i * 6, 0, Math.PI * 2); ctx.fill();
      }
      const temps = g.tEtat + (g.etat === 'jeu' ? 0 : 0);
      for (const b of g.bulles) {
        b.x = b.x0 + Math.sin(temps * b.f + b.ph) * b.amp;
        const r = b.r * easeOutBack(b.s);
        const coul = b.arc ? null : b.type.c;
        const d = ctx.createRadialGradient(b.x - r * 0.3, b.y - r * 0.3, r * 0.1, b.x, b.y, r);
        if (b.arc) {
          d.addColorStop(0, 'rgba(255,255,255,.9)');
          d.addColorStop(0.5, `hsla(${(g.tEtat * 200) % 360},90%,70%,.5)`);
          d.addColorStop(1, `hsla(${(g.tEtat * 200 + 120) % 360},90%,60%,.8)`);
        } else {
          d.addColorStop(0, 'rgba(255,255,255,.85)');
          d.addColorStop(0.55, coul + '66');
          d.addColorStop(1, coul + 'cc');
        }
        ctx.fillStyle = d;
        ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 2.5 * g.u; ctx.stroke();
        g.emoji(b.arc ? '🌈' : b.type.e, b.x, b.y + r * 0.04, r * 1.05);
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        ctx.beginPath(); ctx.ellipse(b.x - r * 0.42, b.y - r * 0.45, r * 0.18, r * 0.1, -0.7, 0, Math.PI * 2); ctx.fill();
      }
      // bandeau de la cible
      const t = g.types[g.cible];
      const bw = Math.min(g.W - 20, 360 * g.u), bh = 56 * g.u;
      const bx = (g.W - bw) / 2, by = 10;
      const pulse = g.annonce > 0 ? 1 + Math.sin(g.annonce * 12) * 0.05 * g.annonce : 1;
      ctx.save();
      ctx.translate(g.W / 2, by + bh / 2); ctx.scale(pulse, pulse); ctx.translate(-g.W / 2, -(by + bh / 2));
      ctx.fillStyle = 'rgba(255,255,255,.92)';
      rondRect(ctx, bx, by, bw, bh, bh / 2); ctx.fill();
      ctx.lineWidth = 4 * g.u; ctx.strokeStyle = t.c; ctx.stroke();
      g.texte('Éclate ' + t.nom, g.W / 2 - bh * 0.4, by + bh / 2, Math.min(26 * g.u, bw / 12), TEXTE, { contour: false });
      ctx.fillStyle = t.c + '88';
      const ex = bx + bw - bh * 0.6;
      ctx.beginPath(); ctx.arc(ex, by + bh / 2, bh * 0.42, 0, Math.PI * 2); ctx.fill();
      g.emoji(t.e, ex, by + bh / 2, bh * 0.62);
      ctx.restore();
      // grande annonce au changement de cible
      if (g.annonce > 0 && g.etat === 'jeu') {
        const k = 1 - g.annonce / 1.6;
        const s = easeOutBack(clamp(k / 0.25, 0, 1));
        const a = g.annonce < 0.4 ? g.annonce / 0.4 : 1;
        g.emoji(t.e, g.W / 2, g.H * 0.45, Math.min(g.W, g.H) * 0.3 * s, { alpha: a * 0.9 });
        g.texte('Maintenant : ' + t.nom + ' !', g.W / 2, g.H * 0.45 + Math.min(g.W, g.H) * 0.22, Math.min(34 * g.u, g.W / 14), t.c, { alpha: a });
      }
    }
  };

  /* ================================================================
     5. Le lapin sauteur
     ================================================================ */
  const jeuSaut = {
    titre: 'Le lapin sauteur', duree: 60,
    consigne: 'Tape l\'écran pour sauter par-dessus les obstacles\net ramasse les carottes 🥕',
    init(g) {
      g.l = { h: 0, vh: 0, sol: true, inv: 0, tampon: 0, rot: 0 };
      g.coeurs = 3; g.carottes = 0; g.metres = 0; g.pointsDist = 0;
      g.obstacles = []; g.bonus = []; g.decor = 0;
      g.aProchain = 500; g.aCarotte = 250;
      g.nuagesS = [0, 1, 2, 3].map(i => ({ x: rand(0, 1) * 1200, y: rand(0.08, 0.35), s: rand(0.7, 1.2) }));
      jeuSaut.redim(g);
      jeuSaut.majInfo(g);
    },
    redim(g) {
      const cp = g.cp, u = g.u;
      g.sol = g.H > g.W * 1.2 ? g.H * 0.72 : g.H * 0.8;
      g.T = (cp ? 88 : 76) * u;
      g.O = (cp ? 50 : 56) * u;
      g.A = Math.min(g.O * 2.4, g.H * 0.45);
      g.Ta = cp ? 0.95 : 0.78;
      g.grav = 8 * g.A / (g.Ta * g.Ta);
      g.v0 = 4 * g.A / g.Ta;
      g.xL = Math.max(g.T * 0.8, g.W * 0.18);
    },
    majInfo(g) { g.info = `🥕 ${g.carottes}   📏 ${Math.floor(g.metres)} m`; },
    vitesse(g) {
      const k = g.t / g.duree;
      return (g.cp ? lerp(250, 360, k) : lerp(310, 500, k)) * g.u;
    },
    sauter(g) {
      const l = g.l;
      if (l.sol) { l.vh = g.v0; l.sol = false; g.eclat(g.xL, g.sol, { n: 6, couleurs: ['#c9a36b', '#e0c9a0'], vitesse: 120, haut: 60, gravite: 300 }); }
      else l.tampon = 0.15;
    },
    appui(g) { jeuSaut.sauter(g); },
    touche(g, k) { if (k === ' ' || k === 'ArrowUp' || k === 'Enter') { jeuSaut.sauter(g); return true; } return false; },
    anim(g, dt) {
      const v = g.etat === 'jeu' ? jeuSaut.vitesse(g) : g.etat === 'decompte' ? 60 * g.u : 0;
      g.decor += v * dt;
    },
    maj(g, dt) {
      const l = g.l, v = jeuSaut.vitesse(g);
      // physique du saut
      l.tampon = Math.max(0, l.tampon - dt);
      l.inv = Math.max(0, l.inv - dt);
      if (!l.sol) {
        l.vh -= g.grav * dt;
        l.h += l.vh * dt;
        l.rot = clamp(-l.vh / g.v0 * 0.35, -0.35, 0.35);
        if (l.h <= 0) {
          l.h = 0; l.vh = 0; l.sol = true; l.rot = 0;
          if (l.tampon > 0) { l.tampon = 0; jeuSaut.sauter(g); }
        }
      }
      // distance
      g.metres += v * dt / (45 * g.u);
      const pts = Math.floor(g.metres / 20);
      if (pts > g.pointsDist) {
        g.pointsDist = pts;
        g.ajouter(1);
        g.popup(g.W - 70 * g.u, 40 * g.u, `+1 · ${pts * 20} m`, '#4a7fd6', 0.7);
      }
      // apparitions
      g.aProchain -= v * dt;
      if (g.aProchain <= 0) {
        const e = choix(['🌵', '🪨', '🌵', '🪵']);
        g.obstacles.push({ x: g.W + g.O, e, taille: g.O * (e === '🪵' ? 1.05 : rand(0.95, 1.1)) });
        g.aProchain = v * (g.Ta + (g.cp ? rand(0.7, 1.6) : rand(0.45, 1.3)));
        if (Math.random() < 0.4) g.bonus.push({ x: g.W + g.O, h: g.A * 0.85, pris: false, ph: rand(0, 6) });
        g.aCarotte = Math.max(g.aCarotte, v * 0.5);
      }
      g.aCarotte -= v * dt;
      if (g.aCarotte <= 0) {
        if (g.aProchain > v * 0.45) g.bonus.push({ x: g.W + g.O, h: Math.random() < 0.5 ? g.T * 0.35 : g.A * 0.55, pris: false, ph: rand(0, 6) });
        g.aCarotte = v * rand(0.7, 1.4);
      }
      for (let i = g.obstacles.length - 1; i >= 0; i--) {
        const o = g.obstacles[i];
        o.x -= v * dt;
        if (o.x < -o.taille) { g.obstacles.splice(i, 1); continue; }
        if (l.inv <= 0) {
          const chevX = Math.abs(o.x - g.xL) < (o.taille * 0.35 + g.T * 0.28);
          const chevY = l.h < o.taille * 0.72;
          if (chevX && chevY) {
            g.coeurs--;
            l.inv = 1.5;
            g.son('faux');
            g.secousse = 0.8;
            g.eclat(g.xL, g.sol - g.T * 0.5, { n: 10, emoji: ['💔', '💫'], vitesse: 200, haut: 150, taille: 0.9 });
            if (g.coeurs <= 0) { g.finir('Plus de cœurs !'); return; }
          }
        }
      }
      const cy = g.sol - l.h - g.T * 0.45;
      for (let i = g.bonus.length - 1; i >= 0; i--) {
        const b = g.bonus[i];
        b.x -= v * dt;
        if (b.x < -60) { g.bonus.splice(i, 1); continue; }
        const by = g.sol - b.h - g.O * 0.4;
        if (Math.hypot(b.x - g.xL, by - cy) < (g.T + g.O) * 0.45) {
          g.bonus.splice(i, 1);
          g.carottes++;
          g.ajouter(1, b.x, by - 20 * g.u);
          g.son('bon');
          g.eclat(b.x, by, { n: 10, couleurs: [ORANGE, '#ffb36b', VERT], vitesse: 220, haut: 100 });
        }
      }
      jeuSaut.majInfo(g);
    },
    dessin(g, ctx) {
      ciel(g, ctx, '#9fdcff', '#fff3de');
      g.emoji('☀️', g.W - 70 * g.u, 60 * g.u, 70 * g.u);
      const d = g.decor;
      for (const n of g.nuagesS) {
        const L = g.W + 200;
        const x = ((n.x - d * 0.08) % L + L) % L - 100;
        nuageBlanc(ctx, x, n.y * g.H, n.s * g.u);
      }
      // collines lointaines
      ctx.fillStyle = '#a8e0a0';
      ctx.beginPath(); ctx.moveTo(0, g.sol);
      for (let x = 0; x <= g.W + 10; x += 10) ctx.lineTo(x, g.sol - 60 * g.u - Math.sin((x + d * 0.25) / (120 * g.u)) * 30 * g.u);
      ctx.lineTo(g.W, g.sol); ctx.fill();
      // sol
      ctx.fillStyle = '#c98f55'; ctx.fillRect(0, g.sol, g.W, g.H - g.sol);
      ctx.fillStyle = VERT; ctx.fillRect(0, g.sol - 4 * g.u, g.W, 16 * g.u);
      ctx.fillStyle = '#b07a45';
      const pas = 70 * g.u;
      for (let x = -((d) % pas); x < g.W; x += pas) { ctx.fillRect(x, g.sol + 30 * g.u, 26 * g.u, 7 * g.u); ctx.fillRect(x + pas * 0.5, g.sol + 55 * g.u, 18 * g.u, 6 * g.u); }
      // carottes
      for (const b of g.bonus) {
        const by = g.sol - b.h - g.O * 0.4 + Math.sin(g.tEtat * 5 + b.ph) * 5 * g.u;
        g.emoji('🥕', b.x, by, g.O * 0.9, { rot: -0.5 + Math.sin(g.tEtat * 4 + b.ph) * 0.15 });
      }
      // obstacles
      for (const o of g.obstacles) {
        ctx.fillStyle = 'rgba(0,0,0,.15)';
        ctx.beginPath(); ctx.ellipse(o.x, g.sol + 2, o.taille * 0.45, o.taille * 0.1, 0, 0, Math.PI * 2); ctx.fill();
        g.emoji(o.e, o.x, g.sol - o.taille * 0.45, o.taille);
      }
      // lapin
      const l = g.l;
      const ombre = 1 - clamp(l.h / (g.A * 1.3), 0, 0.7);
      ctx.fillStyle = 'rgba(0,0,0,.18)';
      ctx.beginPath(); ctx.ellipse(g.xL, g.sol + 2, g.T * 0.38 * ombre, g.T * 0.09 * ombre, 0, 0, Math.PI * 2); ctx.fill();
      const course = l.sol && g.etat !== 'fin' ? Math.abs(Math.sin(g.tEtat * 13)) : 0;
      const bob = course * 6 * g.u;
      const sq = l.sol ? course * 0.06 : 0;
      const visible = l.inv <= 0 || Math.floor(l.inv * 10) % 2 === 0;
      if (visible) g.emoji('🐇', g.xL, g.sol - l.h - g.T * 0.42 - bob, g.T, { sx: -(1 + sq), sy: 1 - sq, rot: -l.rot });
      // cœurs
      for (let i = 0; i < 3; i++) g.emoji(i < g.coeurs ? '❤️' : '🤍', 28 * g.u + i * 40 * g.u, 30 * g.u, 34 * g.u);
    }
  };

  function lanceur(def) {
    return (conteneur, options, fini) => moteur(conteneur, options, fini, def);
  }

  return [
    { id: 'fruits', titre: 'Attrape les fruits', emoji: '🧺', description: 'Attrape les fruits avec ton panier, mais évite la pluie !', lancer: lanceur(jeuFruits) },
    { id: 'memory', titre: 'Memory', emoji: '🧠', description: 'Retourne les cartes et retrouve les paires d\'animaux.', lancer: lanceur(jeuMemory) },
    { id: 'taupes', titre: 'Tape les taupes', emoji: '🐹', description: 'Tape vite les taupes, mais pas le lapin !', lancer: lanceur(jeuTaupes) },
    { id: 'bulles', titre: 'Éclate les bulles', emoji: '🎈', description: 'Éclate seulement les bulles demandées.', lancer: lanceur(jeuBulles) },
    { id: 'saut', titre: 'Le lapin sauteur', emoji: '🐇', description: 'Fais sauter le lapin et ramasse les carottes.', lancer: lanceur(jeuSaut) }
  ];
})();
