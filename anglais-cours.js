// Parcours d'anglais : le même pour toutes les classes, propre à chaque enfant.
// Des niveaux (Découverte, Débutant…) découpés en paliers ; chaque palier = 2 ou 3 leçons puis une évaluation.
// Une leçon apprend TOUS ses mots (la maîtresse montre, l'enfant répète au micro), puis un petit jeu sur ces mots.
// L'évaluation (8 bonnes réponses sur 10) débloque le palier suivant ; on peut la repasser autant qu'on veut.
var PARCOURS_EN;
(() => {
  // Mot ou phrase : [anglais, image, français, autres façons dont la reconnaissance vocale peut l'écrire]
  // images: true : la leçon peut se jouer « écoute et touche la bonne image » (des images toutes différentes).
  const NIVEAUX_EN = [
    { nom: 'Découverte', emoji: '🌱', mode: 'image', paliers: [
      { titre: 'Hello!', emoji: '👋', lecons: [
        { titre: 'Hello!', emoji: '👋', mots: [
          ['hello', '👋', 'bonjour', ['hallo', 'hullo']], ['goodbye', '🚪', 'au revoir', ['good bye', 'bye']], ['yes', '👍', 'oui', ['yeah', 'yep']],
          ['no', '👎', 'non', ['know']], ['thank you', '🎁', 'merci', ['thanks', 'thankyou']], ['please', '🙏', 's\'il te plaît', ['pleased']]] },
        { titre: 'Colours', emoji: '🎨', mots: [
          ['red', '🔴', 'rouge', ['read']], ['blue', '🔵', 'bleu', ['blew']], ['green', '🟢', 'vert', []], ['yellow', '🟡', 'jaune', []], ['purple', '🟣', 'violet', []]] },
        { titre: 'Numbers 1 to 5', emoji: '🖐️', mots: [
          ['one', '1', 'un', ['won', '1']], ['two', '2', 'deux', ['to', 'too', '2']], ['three', '3', 'trois', ['3', 'free', 'tree']],
          ['four', '4', 'quatre', ['for', '4']], ['five', '5', 'cinq', ['5']]] }
      ] },
      { titre: 'Colours and pets', emoji: '🐱', lecons: [
        { titre: 'More colours', emoji: '🖍️', mots: [
          ['orange', '🟠', 'orange', []], ['black', '⚫', 'noir', []], ['white', '⚪', 'blanc', []], ['brown', '🟤', 'marron', []]] },
        { titre: 'Numbers 6 to 10', emoji: '🔟', mots: [
          ['six', '6', 'six', ['6', 'sex', 'sicks']], ['seven', '7', 'sept', ['7']], ['eight', '8', 'huit', ['ate', '8']],
          ['nine', '9', 'neuf', ['9', 'nein']], ['ten', '10', 'dix', ['10']]] },
        { titre: 'Pets', emoji: '🐶', mots: [
          ['cat', '🐱', 'chat', []], ['dog', '🐶', 'chien', []], ['bird', '🐦', 'oiseau', []], ['fish', '🐟', 'poisson', []],
          ['rabbit', '🐰', 'lapin', []], ['hamster', '🐹', 'hamster', []]] }
      ] },
      { titre: 'Animals', emoji: '🐾', lecons: [
        { titre: 'On the farm', emoji: '🚜', mots: [
          ['cow', '🐮', 'vache', []], ['pig', '🐷', 'cochon', []], ['horse', '🐴', 'cheval', []], ['sheep', '🐑', 'mouton', []],
          ['duck', '🦆', 'canard', []], ['chicken', '🐔', 'poule', []]] },
        { titre: 'Wild animals', emoji: '🦁', mots: [
          ['lion', '🦁', 'lion', []], ['elephant', '🐘', 'éléphant', []], ['monkey', '🐵', 'singe', []], ['bear', '🐻', 'ours', ['bare']],
          ['tiger', '🐯', 'tigre', []], ['snake', '🐍', 'serpent', []]] },
        { titre: 'Little animals', emoji: '🐸', mots: [
          ['frog', '🐸', 'grenouille', []], ['mouse', '🐭', 'souris', []], ['bee', '🐝', 'abeille', ['be', 'b']], ['butterfly', '🦋', 'papillon', []],
          ['spider', '🕷️', 'araignée', []], ['snail', '🐌', 'escargot', []]] }
      ] },
      { titre: 'Family and feelings', emoji: '👨‍👩‍👧', lecons: [
        { titre: 'My family', emoji: '🏡', mots: [
          ['mum', '👩', 'maman', ['mom', 'mam', 'mummy']], ['dad', '👨', 'papa', ['daddy']], ['sister', '👧', 'sœur', []],
          ['brother', '👦', 'frère', []], ['baby', '👶', 'bébé', []]] },
        { titre: 'Grandparents and friends', emoji: '👵', mots: [
          ['grandma', '👵', 'mamie', ['grandmother', 'granny', 'grandmom']], ['grandpa', '👴', 'papi', ['grandfather', 'granddad', 'grandad']],
          ['friend', '🤝', 'ami, amie', ['friends']], ['family', '👨‍👩‍👧', 'famille', []]] },
        { titre: 'Feelings', emoji: '😀', mots: [
          ['happy', '😀', 'content', []], ['sad', '😢', 'triste', []], ['angry', '😠', 'en colère', []], ['tired', '😴', 'fatigué', []],
          ['scared', '😨', 'qui a peur', ['scarred']], ['hungry', '😋', 'qui a faim', []]] }
      ] },
      { titre: 'My body', emoji: '🙋', lecons: [
        { titre: 'My face', emoji: '👃', mots: [
          ['eye', '👁️', 'œil', ['i', 'aye', 'eyes']], ['ear', '👂', 'oreille', ['ears']], ['nose', '👃', 'nez', ['knows']],
          ['mouth', '👄', 'bouche', []], ['hair', '💇', 'cheveux', ['hare']], ['tooth', '🦷', 'dent', ['teeth']]] },
        { titre: 'My body', emoji: '💪', mots: [
          ['hand', '✋', 'main', ['hands']], ['arm', '💪', 'bras', ['arms']], ['leg', '🦵', 'jambe', ['legs']], ['foot', '🦶', 'pied', ['feet']],
          ['finger', '☝️', 'doigt', ['fingers']]] },
        { titre: 'Actions', emoji: '🏃', mots: [
          ['run', '🏃', 'courir', []], ['swim', '🏊', 'nager', []], ['sing', '🎤', 'chanter', []], ['dance', '💃', 'danser', []],
          ['sleep', '🛌', 'dormir', []], ['eat', '🍽️', 'manger', []]] }
      ] },
      { titre: 'Food', emoji: '🍎', lecons: [
        { titre: 'Fruit', emoji: '🍓', mots: [
          ['apple', '🍎', 'pomme', []], ['banana', '🍌', 'banane', []], ['orange', '🍊', 'orange (le fruit)', []], ['strawberry', '🍓', 'fraise', []],
          ['pear', '🍐', 'poire', ['pair']], ['grapes', '🍇', 'raisin', ['grape']]] },
        { titre: 'Food', emoji: '🍕', mots: [
          ['bread', '🍞', 'pain', ['bred']], ['cheese', '🧀', 'fromage', []], ['egg', '🥚', 'œuf', ['eggs']], ['cake', '🎂', 'gâteau', []],
          ['pizza', '🍕', 'pizza', []], ['ice cream', '🍦', 'glace', ['icecream', 'i scream']]] },
        { titre: 'Drinks and vegetables', emoji: '🥕', mots: [
          ['water', '💧', 'eau', []], ['milk', '🥛', 'lait', []], ['juice', '🧃', 'jus de fruit', ['juices']], ['carrot', '🥕', 'carotte', ['carat', 'carrots']],
          ['tomato', '🍅', 'tomate', ['tomatoes']], ['potato', '🥔', 'pomme de terre', ['potatoes']]] }
      ] },
      { titre: 'Clothes and weather', emoji: '👕', lecons: [
        { titre: 'Clothes', emoji: '👗', mots: [
          ['hat', '🎩', 'chapeau', []], ['T-shirt', '👕', 'tee-shirt', ['tshirt', 't shirt', 'tee shirt']], ['trousers', '👖', 'pantalon', ['trouser']],
          ['dress', '👗', 'robe', []], ['shoes', '👟', 'chaussures', ['shoe']], ['socks', '🧦', 'chaussettes', ['sock', 'sox']]] },
        { titre: 'Winter clothes', emoji: '🧣', mots: [
          ['coat', '🧥', 'manteau', []], ['scarf', '🧣', 'écharpe', []], ['gloves', '🧤', 'gants', ['glove']], ['boots', '👢', 'bottes', ['boot']],
          ['cap', '🧢', 'casquette', []]] },
        { titre: 'The weather', emoji: '🌦️', mots: [
          ['sun', '☀️', 'soleil', ['son']], ['rain', '🌧️', 'pluie', ['reign', 'rein']], ['snow', '❄️', 'neige', []], ['wind', '💨', 'vent', []],
          ['cloud', '☁️', 'nuage', ['clouds']], ['rainbow', '🌈', 'arc-en-ciel', ['rain bow']]] }
      ] },
      { titre: 'School and home', emoji: '🏫', lecons: [
        { titre: 'At school', emoji: '🎒', mots: [
          ['book', '📖', 'livre', []], ['pencil', '✏️', 'crayon', []], ['bag', '🎒', 'sac, cartable', []], ['ruler', '📏', 'règle', []],
          ['scissors', '✂️', 'ciseaux', []], ['teacher', '🧑‍🏫', 'maîtresse, maître', []]] },
        { titre: 'At home', emoji: '🏠', mots: [
          ['house', '🏠', 'maison', []], ['bed', '🛏️', 'lit', []], ['door', '🚪', 'porte', []], ['window', '🪟', 'fenêtre', []],
          ['chair', '🪑', 'chaise', []], ['bath', '🛁', 'baignoire', []]] },
        { titre: 'Toys and transport', emoji: '🚲', mots: [
          ['ball', '⚽', 'ballon', []], ['car', '🚗', 'voiture', []], ['bike', '🚲', 'vélo', []], ['bus', '🚌', 'bus', []],
          ['train', '🚂', 'train', []], ['plane', '✈️', 'avion', ['plain']]] }
      ] },
      { titre: 'Numbers to 20', emoji: '🔢', lecons: [
        { titre: 'Numbers 11 to 15', emoji: '1️⃣', mots: [
          ['eleven', '11', 'onze', ['11']], ['twelve', '12', 'douze', ['12']], ['thirteen', '13', 'treize', ['13']], ['fourteen', '14', 'quatorze', ['14']],
          ['fifteen', '15', 'quinze', ['15']]] },
        { titre: 'Numbers 16 to 20', emoji: '2️⃣', mots: [
          ['sixteen', '16', 'seize', ['16']], ['seventeen', '17', 'dix-sept', ['17']], ['eighteen', '18', 'dix-huit', ['18']], ['nineteen', '19', 'dix-neuf', ['19']],
          ['twenty', '20', 'vingt', ['20']]] },
        { titre: 'Big and small', emoji: '🐘', mots: [
          ['big', '🐘', 'grand, gros', []], ['small', '🐭', 'petit', []], ['hot', '🔥', 'chaud', []], ['cold', '🧊', 'froid', []],
          ['fast', '🐆', 'rapide', []], ['slow', '🐢', 'lent', []]] }
      ] }
    ] },
    { nom: 'Débutant', emoji: '🌿', mode: 'texte', paliers: [
      { titre: 'Nice to meet you!', emoji: '🤝', lecons: [
        { titre: 'Hello and goodbye', emoji: '🌅', mots: [
          ['Good morning!', '🌅', 'Bonjour ! (le matin)', []], ['Good afternoon!', '🌤️', 'Bonjour ! (l\'après-midi)', []],
          ['Good evening!', '🌆', 'Bonsoir !', []], ['Good night!', '🌙', 'Bonne nuit !', []], ['See you later!', '👋', 'À plus tard !', ['see ya later']]] },
        { titre: 'My name', emoji: '📛', mots: [
          ['What\'s your name?', '❓', 'Comment t\'appelles-tu ?', []], ['My name is Emma.', '📛', 'Je m\'appelle Emma.', ['my name\'s emma']],
          ['How old are you?', '🎂', 'Quel âge as-tu ?', []], ['I\'m six.', '6️⃣', 'J\'ai six ans.', ['i am 6', 'i am sex']],
          ['I\'m nine.', '9️⃣', 'J\'ai neuf ans.', ['i am 9']]] },
        { titre: 'How are you?', emoji: '😊', mots: [
          ['How are you?', '🤔', 'Comment vas-tu ?', []], ['I\'m fine, thank you.', '😊', 'Je vais bien, merci.', ['i am fine thanks', 'fine thank you']],
          ['I\'m very well.', '😃', 'Je vais très bien.', []], ['Not bad.', '🙂', 'Pas mal.', []], ['And you?', '👉', 'Et toi ?', []]] }
      ] },
      { titre: 'Days of the week', emoji: '📅', lecons: [
        { titre: 'Monday to Thursday', emoji: '📅', mots: [
          ['Monday', '📅', 'lundi', []], ['Tuesday', '📅', 'mardi', []], ['Wednesday', '📅', 'mercredi', []], ['Thursday', '📅', 'jeudi', []]] },
        { titre: 'Friday to Sunday', emoji: '🎉', mots: [
          ['Friday', '📅', 'vendredi', []], ['Saturday', '📅', 'samedi', []], ['Sunday', '📅', 'dimanche', []], ['the weekend', '🎉', 'le week-end', ['weekend']]] },
        { titre: 'Today', emoji: '👉', mots: [
          ['What day is it today?', '📅', 'Quel jour sommes-nous ?', []], ['It\'s Monday.', '📅', 'C\'est lundi.', ['it is monday']],
          ['today', '👇', 'aujourd\'hui', []], ['tomorrow', '➡️', 'demain', []], ['yesterday', '⬅️', 'hier', []]] }
      ] },
      { titre: 'Months and seasons', emoji: '🗓️', lecons: [
        { titre: 'January to June', emoji: '❄️', mots: [
          ['January', '🗓️', 'janvier', []], ['February', '🗓️', 'février', []], ['March', '🗓️', 'mars', []], ['April', '🗓️', 'avril', []],
          ['May', '🗓️', 'mai', []], ['June', '🗓️', 'juin', []]] },
        { titre: 'July to December', emoji: '☀️', mots: [
          ['July', '🗓️', 'juillet', []], ['August', '🗓️', 'août', []], ['September', '🗓️', 'septembre', []], ['October', '🗓️', 'octobre', []],
          ['November', '🗓️', 'novembre', []], ['December', '🗓️', 'décembre', []]] },
        { titre: 'Seasons', emoji: '🍂', images: true, mots: [
          ['spring', '🌷', 'le printemps', []], ['summer', '🏖️', 'l\'été', []], ['autumn', '🍂', 'l\'automne', ['fall']], ['winter', '⛄', 'l\'hiver', []],
          ['Happy birthday!', '🎂', 'Joyeux anniversaire !', []]] }
      ] },
      { titre: 'I like, I have, I can', emoji: '❤️', lecons: [
        { titre: 'I like…', emoji: '❤️', mots: [
          ['I like apples.', '🍎', 'J\'aime les pommes.', ['i like apple']], ['I don\'t like carrots.', '🥕', 'Je n\'aime pas les carottes.', ['i do not like carrots']],
          ['Do you like pizza?', '🍕', 'Aimes-tu la pizza ?', []], ['Yes, I do.', '👍', 'Oui (j\'aime ça).', []], ['No, I don\'t.', '👎', 'Non (je n\'aime pas ça).', ['no i do not']]] },
        { titre: 'I\'ve got…', emoji: '🐶', mots: [
          ['I\'ve got a dog.', '🐶', 'J\'ai un chien.', ['i have got a dog', 'i got a dog']], ['I haven\'t got a cat.', '🐱', 'Je n\'ai pas de chat.', ['i have not got a cat']],
          ['Have you got a pet?', '🐾', 'As-tu un animal ?', []], ['Yes, I have.', '👍', 'Oui (j\'en ai un).', []], ['No, I haven\'t.', '👎', 'Non (je n\'en ai pas).', ['no i have not']]] },
        { titre: 'I can…', emoji: '🏊', mots: [
          ['I can swim.', '🏊', 'Je sais nager.', []], ['I can\'t fly.', '🕊️', 'Je ne sais pas voler.', ['i cannot fly']],
          ['Can you jump?', '🤸', 'Sais-tu sauter ?', []], ['Yes, I can.', '👍', 'Oui (je sais).', []], ['No, I can\'t.', '👎', 'Non (je ne sais pas).', ['no i cannot']]] }
      ] },
      { titre: 'Weather and time', emoji: '⏰', lecons: [
        { titre: 'The weather', emoji: '🌦️', images: true, mots: [
          ['It\'s sunny.', '☀️', 'Il y a du soleil.', ['it is sunny']], ['It\'s raining.', '🌧️', 'Il pleut.', ['it is raining']],
          ['It\'s snowing.', '❄️', 'Il neige.', ['it is snowing']], ['It\'s windy.', '💨', 'Il y a du vent.', ['it is windy']],
          ['It\'s cold.', '🥶', 'Il fait froid.', ['it is cold']], ['It\'s hot.', '🥵', 'Il fait chaud.', ['it is hot']]] },
        { titre: 'What time is it?', emoji: '🕒', mots: [
          ['What time is it?', '⏰', 'Quelle heure est-il ?', []], ['It\'s one o\'clock.', '🕐', 'Il est une heure.', ['it is one o\'clock', 'it\'s 1 o\'clock', 'it\'s 1:00']],
          ['It\'s three o\'clock.', '🕒', 'Il est trois heures.', ['it is three o\'clock', 'it\'s 3 o\'clock', 'it\'s 3:00']],
          ['It\'s half past two.', '🕝', 'Il est deux heures et demie.', ['it is half past two', 'it\'s half past 2']],
          ['It\'s half past six.', '🕡', 'Il est six heures et demie.', ['it is half past six', 'it\'s half past 6']]] },
        { titre: 'In the classroom', emoji: '🧑‍🏫', mots: [
          ['Stand up!', '🧍', 'Lève-toi !', []], ['Sit down!', '🪑', 'Assieds-toi !', []], ['Listen!', '👂', 'Écoute !', []], ['Look!', '👀', 'Regarde !', []],
          ['Open your book.', '📖', 'Ouvre ton livre.', []], ['Be quiet!', '🤫', 'Silence !', []]] }
      ] },
      { titre: 'Numbers to 100', emoji: '💯', lecons: [
        { titre: '21 to 60', emoji: '🔢', images: true, mots: [
          ['twenty-one', '21', 'vingt et un', ['21']], ['thirty', '30', 'trente', ['30']], ['forty', '40', 'quarante', ['40']], ['fifty', '50', 'cinquante', ['50']],
          ['sixty', '60', 'soixante', ['60']]] },
        { titre: '70 to 100', emoji: '💯', images: true, mots: [
          ['seventy', '70', 'soixante-dix', ['70']], ['eighty', '80', 'quatre-vingts', ['80']], ['ninety', '90', 'quatre-vingt-dix', ['90']],
          ['one hundred', '100', 'cent', ['100', 'a hundred', 'hundred']]] },
        { titre: 'At the shop', emoji: '🛒', mots: [
          ['How many apples?', '🍎', 'Combien de pommes ?', []], ['How much is it?', '💶', 'Combien ça coûte ?', []],
          ['It\'s ten euros.', '💶', 'Ça coûte dix euros.', ['it is ten euros', 'it\'s 10 euros', 'it is 10 euros']],
          ['Can I have a cake, please?', '🎂', 'Je peux avoir un gâteau, s\'il te plaît ?', []], ['Here you are.', '🤲', 'Tiens, voilà.', []]] }
      ] }
    ] }
  ];
  // Les niveaux suivants, montrés verrouillés en attendant d'être écrits.
  const A_VENIR = [['Élémentaire', '🌳'], ['Intermédiaire', '🏅'], ['Avancé', '🚀'], ['Presque bilingue', '👑']];

  const SEUIL = 0.8;             // 8 bonnes réponses sur 10 pour réussir une évaluation
  const NB_EVAL = 10;
  const cle = id => 'EN:' + id;  // les étoiles du parcours ne dépendent pas de la classe choisie

  // Une question sur un mot déjà appris ; les mauvaises réponses sont prises parmi les mots de pool.
  function question(mot, pool, mode, nbChoix, indice) {
    const [en, img, fr] = mot;
    // n valeurs différentes (colonne k) prises dans d'autres mots que celui demandé
    const autres = (k, n, liste = pool) => {
      const vus = new Set([mot[k]]), r = [];
      for (const m of melange(liste)) if (m[0] !== en && m[2] !== fr && !vus.has(m[k]) && r.length < n) { vus.add(m[k]); r.push(m[k]); }
      return r;
    };
    const type = mode === 'image' ? 'ecoute' : pioche(mot.images ? ['ecoute', 'vers-en', 'vers-fr'] : ['vers-en', 'vers-fr']);
    if (type === 'ecoute')
      return { visuel: '🔊', enonce: 'Écoute et touche la bonne image', dire: 'Écoute, et touche la bonne image :', direEn: en, indice,
        choix: melange([img, ...autres(1, nbChoix - 1, pool.filter(m => m.images))]), bonne: img };
    if (type === 'vers-en')
      return { visuel: img, enonce: `Comment dit-on « ${fr} » en anglais ?`, indice, choix: melange([en, ...autres(0, nbChoix - 1)]), bonne: en };
    return { visuel: '🔊', enonce: `Que veut dire « ${en} » ?`, dire: 'Que veut dire :', direEn: en, indice, choix: melange([fr, ...autres(2, nbChoix - 1)]), bonne: fr };
  }

  const jeux = [], paliers = [];
  NIVEAUX_EN.forEach(niv => niv.paliers.forEach(pal => {
    const num = paliers.length + 1, nbChoix = num <= 3 ? 3 : 4, mode = niv.mode;
    const tous = [];
    const lecons = pal.lecons.map((l, li) => {
      const mots = l.mots.map(m => { const x = m.slice(); x.images = mode === 'image' || !!l.images; return x; });
      tous.push(...mots);
      return { id: `p${num}-l${li + 1}`, titre: l.titre, emoji: l.emoji, palier: num, mots, mode, nbChoix,
        gen: () => question(pioche(mots), mots, mode, nbChoix, true),
        sequence: () => {
          // D'abord la maîtresse apprend chaque mot, et l'enfant le répète au micro…
          const apprendre = melange(mots).flatMap(([en, img, fr, acc]) => [
            { type: 'decouvrir', visuel: img, enonce: en, sens: fr, dire: `${fr}, en anglais, ça se dit :`, direEn: en },
            { type: 'parler', visuel: img, enonce: en, sens: fr, bonne: en, accepte: acc, dire: 'À toi ! Répète après moi :', direEn: en }
          ]);
          // … puis un petit jeu : une question par mot qu'on vient d'apprendre.
          return [...apprendre, ...melange(mots).map(m => question(m, mots, mode, nbChoix, true))];
        } };
    });
    const evaluation = { id: `p${num}-eval`, titre: `Évaluation`, emoji: '📝', palier: num, evaluation: true,
      gen: () => question(pioche(tous), tous, mode, nbChoix, false),
      sequence: () => melange(tous).slice(0, NB_EVAL).map(m => question(m, tous, mode, nbChoix, false)) };
    paliers.push({ num, titre: pal.titre, emoji: pal.emoji, niveau: niv.nom, niveauEmoji: niv.emoji, lecons, evaluation });
    jeux.push(...lecons, evaluation);
  }));

  const fait = (p, j) => (p.scores[cle(j.id)] || 0) >= 1;
  const reussi = (p, pal) => !!p.scores[cle(pal.evaluation.id) + ':ok'];
  // Ouvert : la 1re leçon ; chaque leçon après la précédente ; l'évaluation après toutes les leçons du palier ;
  // le palier suivant après l'évaluation réussie.
  function ouvert(p, j) {
    const pal = paliers[j.palier - 1];
    if (j.evaluation) return pal.lecons.every(l => fait(p, l));
    const i = pal.lecons.indexOf(j);
    if (i > 0) return fait(p, pal.lecons[i - 1]);
    return pal.num === 1 || reussi(p, paliers[pal.num - 2]);
  }
  // Pour le défi du jour : révision d'un mot d'une leçon déjà faite (donc déjà appris), avec la réponse montrée si on se trompe.
  function revision(p) {
    const faites = paliers.flatMap(pal => pal.lecons).filter(l => fait(p, l));
    if (!faites.length) return null;
    return { id: 'revision-en', titre: 'Révision d\'anglais', emoji: '🇬🇧',
      gen: () => { const l = pioche(faites); return question(pioche(l.mots), l.mots, l.mode, l.nbChoix, true); } };
  }

  const matiere = { id: 'cours-anglais', titre: 'Anglais', emoji: '🇬🇧', couleur: '#2f6fd6', progressif: true, parcours: true, jeux };
  PARCOURS_EN = { matiere, paliers, aVenir: A_VENIR, seuil: SEUIL, cle, fait, reussi, ouvert, revision };
  // Un seul parcours, le même quelle que soit la classe choisie : il remplace les anciens jeux d'anglais par classe.
  CLASSES.forEach(c => {
    NIVEAUX[c].matieres = NIVEAUX[c].matieres.filter(m => m.id !== 'anglais');
    ajouterMatiere(c, matiere);
  });
})();
