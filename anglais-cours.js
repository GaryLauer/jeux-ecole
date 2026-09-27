// Cours d'anglais débutant : des leçons à débloquer une par une.
// Chaque leçon = 5 mots à écouter et répéter au micro, puis 5 questions pour vérifier.
(() => {
  // [anglais, image, français, autres façons dont la reconnaissance vocale peut l'écrire]
  const LECONS = [
    { titre: 'Hello !', emoji: '👋', mots: [
      ['hello', '👋', 'bonjour', ['hallo', 'hullo']], ['goodbye', '🚪', 'au revoir', ['good bye', 'bye']], ['thank you', '🎁', 'merci', ['thanks', 'thankyou']],
      ['yes', '👍', 'oui', ['yeah', 'yep']], ['no', '👎', 'non', ['know']], ['please', '🙏', 's\'il te plaît', ['pleased']]] },
    { titre: 'Colours', emoji: '🎨', mots: [
      ['red', '🔴', 'rouge', ['read']], ['blue', '🔵', 'bleu', ['blew']], ['green', '🟢', 'vert', []], ['yellow', '🟡', 'jaune', []],
      ['orange', '🟠', 'orange', []], ['purple', '🟣', 'violet', []], ['black', '⚫', 'noir', []], ['white', '⚪', 'blanc', []], ['brown', '🟤', 'marron', []]] },
    { titre: 'Numbers', emoji: '🔢', mots: [
      ['one', '1', 'un', ['won', '1']], ['two', '2', 'deux', ['to', 'too', '2']], ['three', '3', 'trois', ['3', 'free']], ['four', '4', 'quatre', ['for', '4']],
      ['five', '5', 'cinq', ['5']], ['six', '6', 'six', ['6', 'sex']], ['seven', '7', 'sept', ['7']], ['eight', '8', 'huit', ['ate', '8']],
      ['nine', '9', 'neuf', ['9']], ['ten', '10', 'dix', ['10']]] },
    { titre: 'Animals', emoji: '🐾', mots: [
      ['cat', '🐱', 'chat', []], ['dog', '🐶', 'chien', []], ['bird', '🐦', 'oiseau', []], ['fish', '🐟', 'poisson', []], ['rabbit', '🐰', 'lapin', []],
      ['horse', '🐴', 'cheval', []], ['cow', '🐮', 'vache', []], ['pig', '🐷', 'cochon', []], ['duck', '🦆', 'canard', []], ['mouse', '🐭', 'souris', []]] },
    { titre: 'My family', emoji: '👨‍👩‍👧', mots: [
      ['mother', '👩', 'mère', ['mom', 'mum', 'mummy']], ['father', '👨', 'père', ['dad', 'daddy']], ['sister', '👧', 'sœur', []], ['brother', '👦', 'frère', []],
      ['baby', '👶', 'bébé', []], ['grandmother', '👵', 'grand-mère', ['grandma', 'granny', 'grand mother']], ['grandfather', '👴', 'grand-père', ['grandpa', 'grand father']]] },
    { titre: 'My body', emoji: '🙋', mots: [
      ['eye', '👁️', 'œil', ['i', 'aye', 'eyes']], ['ear', '👂', 'oreille', ['ears', 'here']], ['nose', '👃', 'nez', ['knows']], ['mouth', '👄', 'bouche', []],
      ['hand', '✋', 'main', ['hands']], ['foot', '🦶', 'pied', ['feet']], ['leg', '🦵', 'jambe', ['legs']], ['arm', '💪', 'bras', ['arms']]] },
    { titre: 'Food', emoji: '🍎', mots: [
      ['apple', '🍎', 'pomme', []], ['banana', '🍌', 'banane', []], ['bread', '🍞', 'pain', ['bred']], ['milk', '🥛', 'lait', []], ['water', '💧', 'eau', []],
      ['cake', '🎂', 'gâteau', []], ['cheese', '🧀', 'fromage', []], ['egg', '🥚', 'œuf', ['eggs']], ['carrot', '🥕', 'carotte', ['carat', 'carrots']]] },
    { titre: 'Clothes', emoji: '👕', mots: [
      ['hat', '🎩', 'chapeau', []], ['shoes', '👟', 'chaussures', ['shoe']], ['dress', '👗', 'robe', []], ['T-shirt', '👕', 't-shirt', ['tshirt', 't shirt', 'tee shirt']],
      ['trousers', '👖', 'pantalon', ['trouser']], ['socks', '🧦', 'chaussettes', ['sock', 'sox']], ['coat', '🧥', 'manteau', []]] },
    { titre: 'The weather', emoji: '🌦️', mots: [
      ['sun', '☀️', 'soleil', ['son']], ['rain', '🌧️', 'pluie', ['reign', 'rein']], ['snow', '❄️', 'neige', []], ['wind', '💨', 'vent', []],
      ['cloud', '☁️', 'nuage', ['clouds']], ['rainbow', '🌈', 'arc-en-ciel', ['rain bow']]] },
    { titre: 'At school', emoji: '🏫', mots: [
      ['book', '📖', 'livre', []], ['pencil', '✏️', 'crayon', []], ['bag', '🎒', 'cartable', []], ['ruler', '📏', 'règle', []],
      ['scissors', '✂️', 'ciseaux', []], ['teacher', '👩‍🏫', 'maîtresse', []], ['school', '🏫', 'école', []]] },
    { titre: 'Feelings', emoji: '😀', mots: [
      ['happy', '😀', 'content', []], ['sad', '😢', 'triste', []], ['angry', '😠', 'en colère', []], ['tired', '😴', 'fatigué', []],
      ['scared', '😨', 'qui a peur', ['scarred']], ['hungry', '😋', 'qui a faim', []]] }
  ];
  const LECONS_CM1 = [
    { titre: 'Days of the week', emoji: '📅', mots: [
      ['Monday', 'lun.', 'lundi', []], ['Tuesday', 'mar.', 'mardi', []], ['Wednesday', 'mer.', 'mercredi', []], ['Thursday', 'jeu.', 'jeudi', []],
      ['Friday', 'ven.', 'vendredi', []], ['Saturday', 'sam.', 'samedi', []], ['Sunday', 'dim.', 'dimanche', []]] },
    { titre: 'Little sentences', emoji: '💬', mots: [
      ['good morning', '🌅', 'bonjour (le matin)', []], ['how are you', '🤔', 'comment vas-tu ?', []], ['I am fine', '😊', 'je vais bien', ['i\'m fine']],
      ['what is your name', '❓', 'comment t\'appelles-tu ?', ['what\'s your name']], ['I am nine', '9️⃣', 'j\'ai neuf ans', ['i\'m nine', 'i am 9', 'i\'m 9']],
      ['I like apples', '🍎❤️', 'j\'aime les pommes', []], ['see you later', '👋', 'à plus tard', ['see ya later']]] },
    { titre: 'Numbers to 20', emoji: '🔟', mots: [
      ['eleven', '11', 'onze', ['11']], ['twelve', '12', 'douze', ['12']], ['thirteen', '13', 'treize', ['13']], ['fourteen', '14', 'quatorze', ['14']],
      ['fifteen', '15', 'quinze', ['15']], ['sixteen', '16', 'seize', ['16']], ['eighteen', '18', 'dix-huit', ['18']], ['twenty', '20', 'vingt', ['20']]] }
  ];

  const estImageEmoji = s => !/[a-z]/i.test(s);
  function lecon(l, niveau, index) {
    return {
      id: 'lecon-' + (index + 1), titre: `Leçon ${index + 1} : ${l.titre}`, emoji: l.emoji,
      gen: () => sequence()[0],
      sequence
    };
    function sequence() {
      const mots = melange(l.mots).slice(0, 5);
      const q = mots.map(([en, img, fr, acc]) => ({
        type: 'parler', visuel: img, enonce: en, sens: fr, bonne: en, accepte: acc,
        dire: 'Écoute bien, puis répète :', direEn: en
      }));
      const quiz = melange(mots).map(([en, img, fr], i) => {
        const autres = melange(l.mots.filter(m => m[0] !== en)).slice(0, 3);
        if (niveau === 'CP' || i < 3) {
          // Écoute le mot anglais et touche la bonne image.
          return { visuel: '🔊', enonce: 'Écoute et touche la bonne réponse', dire: 'Écoute, et touche la bonne réponse :', direEn: en,
            choix: melange([img, ...autres.map(m => m[1])]), bonne: img };
        }
        // CM1 : lis le mot français et choisis le mot anglais.
        return { visuel: estImageEmoji(img) ? img : '🇬🇧', enonce: `Comment dit-on « ${fr} » en anglais ?`, choix: melange([en, ...autres.map(m => m[0])]), bonne: en };
      });
      return [...q, ...quiz];
    }
  }

  ajouterMatiere('CP', { id: 'cours-anglais', titre: 'Cours d\'anglais', emoji: '🎓', couleur: '#2f6fd6', progressif: true,
    jeux: LECONS.map((l, i) => lecon(l, 'CP', i)) });
  ajouterMatiere('CM1', { id: 'cours-anglais', titre: 'Cours d\'anglais', emoji: '🎓', couleur: '#2f6fd6', progressif: true,
    jeux: [...LECONS, ...LECONS_CM1].map((l, i) => lecon(l, 'CM1', i)) });
})();
