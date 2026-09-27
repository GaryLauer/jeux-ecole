// Dans l'appli Android (APK), la page n'a pas de voix ni de micro à elle :
// on branche speechSynthesis et SpeechRecognition sur ceux d'Android (window.AndroidVoix).
(function () {
  const A = window.AndroidVoix;
  if (!A) return;
  let n = 0, ecouteEnCours = null;
  const enCours = {};

  function Enonce(texte) {
    this.text = texte || ''; this.lang = 'fr-FR'; this.rate = 1; this.pitch = 1; this.volume = 1; this.voice = null;
    this.onstart = this.onend = this.onerror = null;
  }
  const synthese = {
    speaking: false, pending: false, paused: false, onvoiceschanged: null,
    getVoices: () => [],
    speak(u) {
      const id = 'u' + (++n);
      enCours[id] = u;
      synthese.speaking = true;
      A.parler(id, String(u.text), u.lang || 'fr-FR', +u.rate || 1, +u.pitch || 1);
    },
    cancel() {
      for (const k in enCours) delete enCours[k];
      synthese.speaking = false;
      A.taire();
    },
    pause() {}, resume() {}, addEventListener() {}, removeEventListener() {}
  };

  function Ecoute() { this.lang = 'en-GB'; this.maxAlternatives = 5; this.onresult = this.onerror = this.onend = null; }
  Ecoute.prototype.start = function () { ecouteEnCours = this; A.ecouter(this.lang || 'en-GB'); };
  Ecoute.prototype.stop = Ecoute.prototype.abort = function () { if (ecouteEnCours === this) ecouteEnCours = null; A.arreterEcoute(); };

  // Appelé par Android quand une phrase commence ou finit, ou quand le micro a entendu quelque chose.
  window.__androidVoix = (quoi, id, type, donnees) => {
    if (quoi === 'voix') {
      const u = enCours[id];
      if (!u) return;
      if (type === 'start') { u.onstart && u.onstart({ utterance: u }); return; }
      delete enCours[id];
      if (!Object.keys(enCours).length) synthese.speaking = false;
      if (type === 'end') u.onend && u.onend({ utterance: u });
      else u.onerror && u.onerror({ utterance: u, error: 'synthesis-failed' });
    } else if (quoi === 'reco') {
      const r = ecouteEnCours;
      if (!r) return;
      ecouteEnCours = null;
      if (type === 'result') r.onresult && r.onresult({ results: [(donnees || []).map(a => ({ transcript: a.t, confidence: a.c }))] });
      else r.onerror && r.onerror({ error: type });
      r.onend && r.onend({});
    }
  };

  try { Object.defineProperty(window, 'speechSynthesis', { value: synthese, configurable: true, writable: true }); }
  catch (e) { try { Object.assign(window.speechSynthesis, synthese); } catch (e2) {} }
  window.SpeechSynthesisUtterance = Enonce;
  window.SpeechRecognition = window.webkitSpeechRecognition = Ecoute;
  document.documentElement.classList.add('apk');
})();
