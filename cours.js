// Mini cours du bouton « ? » : une ou plusieurs fiches par jeu.
// Clé : 'NIVEAU/matière/jeu' (ou 'NIVEAU/matière', ou '*/matière' pour toute une matière).
// Fiche : { t: titre, si: /regex testée sur la question/ (surEnonce : sur l'énoncé seulement, pas sur les choix), l: [lignes], ex: exemple (HTML) }.
// Une ligne « a · b · c » est une liste : l'élément qui contient la réponse est retiré.
// On montre les fiches dont « si » correspond à la question ; sinon celles qui n'ont pas de « si ».
// Les exemples utilisent d'autres nombres ou d'autres mots que ceux des questions.

const COURS = {};
function cours(cle, ...fiches) { COURS[cle] = fiches; }
// Mot entier (marche aussi avec les lettres accentuées, contrairement à \b).
const mots = (...m) => new RegExp(`(^|[^\\wÀ-ÿœ])(${m.join('|')})(?=$|[^\\wÀ-ÿœ])`, 'i');

/* ================= CP ================= */

// ---- Maths
cours('CP/maths/compter', { t: 'Compter', l: [
  'Touche chaque objet avec ton doigt, <b>un par un</b>.',
  'À chaque objet, dis le nombre suivant : 1, 2, 3…',
  'Le <b>dernier nombre</b> que tu dis, c\'est combien il y en a.',
  'Ne compte pas deux fois le même objet !'
], ex: '🐸 🐸 🐸 🐸<br>1 · 2 · 3 · 4 → il y a <b>4</b> grenouilles' });
cours('CP/maths/additions', { t: 'L\'addition', l: [
  'Le signe <b>+</b> veut dire : on <b>ajoute</b>, on met ensemble.',
  'Prends le premier nombre dans ta tête, puis avance avec tes doigts.',
  'Astuce : commence par le plus grand nombre, c\'est plus rapide !'
], ex: '2 + 3 : je pense <b>3</b>, puis j\'avance de 2 : 4, 5.<br>🍪🍪 + 🍪🍪🍪 = <b>5</b> 🍪' });
cours('CP/maths/soustractions', { t: 'La soustraction', l: [
  'Le signe <b>−</b> veut dire : on <b>enlève</b>, on retire.',
  'Pars du premier nombre et recule avec tes doigts.',
  'Le résultat est toujours plus petit que le nombre de départ.'
], ex: '6 − 2 : j\'ai 6 ballons, 2 s\'envolent.<br>🎈🎈🎈🎈<s>🎈🎈</s> → il en reste <b>4</b>' });
cours('CP/maths/comparer', { t: 'Le plus grand nombre', l: [
  'Regarde d\'abord le chiffre des <b>dizaines</b> (le chiffre de gauche).',
  'Le nombre qui a le plus de dizaines est le plus grand.',
  'Si les dizaines sont pareilles, regarde les <b>unités</b> (le chiffre de droite).',
  'Un nombre à 2 chiffres est plus grand qu\'un nombre à 1 chiffre.'
], ex: '<b>6</b>2 et <b>4</b>8 : 6 dizaines, c\'est plus que 4 dizaines.<br>Donc <b>62</b> est le plus grand.' });
cours('CP/maths/suite', { t: 'Le nombre d\'après', l: [
  'Le nombre d\'après, c\'est le nombre <b>+ 1</b>.',
  'Récite la comptine des nombres et arrête-toi juste après.',
  'Attention au passage de la dizaine : après …9, on change de dizaine !'
], ex: 'Après 43, il y a <b>44</b>.<br>Après 59, il y a <b>60</b>.' });
cours('CP/maths/dizaines', { t: 'Dizaines et unités', l: [
  'Une <b>dizaine</b>, c\'est un paquet de <b>10</b>.',
  'Dans un nombre à 2 chiffres, le chiffre de <b>gauche</b> compte les dizaines.',
  'Le chiffre de <b>droite</b> compte les unités (ce qui reste, tout seul).'
], ex: '<b>4</b>7 → 4 paquets de dix et 7 tout seuls.<br>📦📦📦📦 ●●●●●●●' });
cours('CP/maths/calcul20', { t: 'Calculer jusqu\'à 20', l: [
  'Compte ce que tu vois, ou calcule dans ta tête.',
  'Astuce : fais d\'abord <b>10</b>, puis ajoute le reste.',
  'Vérifie avec tes doigts si tu hésites.'
], ex: '8 + 5 : 8 + 2 = 10, puis 10 + 3 = <b>13</b>.' });
cours('CP/maths/complements', { t: 'Faire 10', l: [
  'On cherche combien il <b>manque</b> pour arriver à 10.',
  'Montre le premier nombre avec tes doigts : les doigts baissés, c\'est ce qui manque !',
  'Les amis de 10 : 1 et 9 · 2 et 8 · 3 et 7 · 4 et 6 · 5 et 5'
], ex: '6 + ? = 10 : je lève 6 doigts, 4 restent baissés.<br>6 + <b>4</b> = 10 ✋🤚' });
cours('CP/maths/doubles',
  { t: 'Le double', si: /double/i, l: [
    'Le double, c\'est <b>2 fois</b> le même nombre.',
    'On ajoute le nombre à lui-même.'
  ], ex: 'Le double de 3 : 3 + 3 = <b>6</b><br>🍒🍒🍒 + 🍒🍒🍒' },
  { t: 'La moitié', si: /moiti/i, l: [
    'La moitié, c\'est quand on <b>partage en 2 parts égales</b>.',
    'Pense au double à l\'envers : quel nombre + lui-même donne ce nombre ?'
  ], ex: 'La moitié de 8 : 4 + 4 = 8, donc c\'est <b>4</b>.<br>🍬🍬🍬🍬 | 🍬🍬🍬🍬' });
cours('CP/maths/formes', { t: 'Les formes', l: [
  '<b>Carré</b> : 4 côtés tous pareils. ◼️',
  '<b>Rectangle</b> : 4 côtés, 2 longs et 2 courts. ▬',
  '<b>Triangle</b> : 3 côtés. 🔺',
  '<b>Rond</b> (cercle) : pas de côté, tout arrondi. ⚪',
  'Pour compter les côtés, suis le bord avec ton doigt.'
] });
cours('CP/maths/heure', { t: 'Lire l\'heure', l: [
  'La <b>petite aiguille</b> montre les heures.',
  'La <b>grande aiguille</b> montre les minutes.',
  'Grande aiguille en haut, sur le 12 : c\'est l\'heure <b>pile</b>.',
  'Grande aiguille en bas, sur le 6 : c\'est <b>et demie</b>. La petite aiguille est alors entre deux nombres : on lit le plus petit.'
], ex: 'Petite aiguille sur 8, grande sur 12 → <b>8 heures</b>.' });
cours('CP/maths/monnaie', { t: 'Les euros', l: [
  'Regarde ce qui est écrit sur chaque pièce ou billet.',
  'Une pièce de 2 € vaut 2 euros, un billet de 5 € vaut 5 euros.',
  'Commence par le plus gros, puis ajoute les autres.'
], ex: 'Un billet de 5 € + une pièce de 2 € + une pièce de 1 €<br>5 + 2 + 1 = <b>8 €</b>' });
cours('CP/maths/problemes-cp',
  { t: 'On ajoute', si: /donne\s*[0-9]+\.|montent|en tout|maintenant/i, l: [
    'Lis bien l\'histoire. On a quelque chose, puis <b>on en reçoit</b> encore, ou on met tout ensemble.',
    'Mots qui aident : « on lui en donne », « en tout », « montent ».',
    'Quand on ajoute, on fait une <b>addition</b> (+).'
  ], ex: 'Sam a 4 fraises. On lui en donne 3.<br>4 + 3 = <b>7</b> fraises 🍓' },
  { t: 'On enlève', si: /reste|s'envolent|partent|mange/i, l: [
    'Lis bien l\'histoire. On a quelque chose, puis <b>on en perd</b> ou on en donne.',
    'Mots qui aident : « il en donne », « reste », « s\'envolent ».',
    'Quand on enlève, on fait une <b>soustraction</b> (−).'
  ], ex: 'Il y a 7 canards. 2 canards partent.<br>7 − 2 = <b>5</b> canards 🦆' });
cours('CP/maths/reperage',
  { t: 'Gauche et droite', si: /gauche|droite/i, l: [
    'Ta <b>droite</b>, c\'est la main avec laquelle tu écris souvent. ✍️',
    'Ta <b>gauche</b>, c\'est l\'autre main. Avec ta main gauche, pouce écarté, tu fais un <b>L</b> !',
    '« À droite de 🐶 », c\'est juste à côté de 🐶, du côté droit.',
    '« Tout à droite », c\'est au bout de la ligne, côté droit.'
  ], ex: '⬅️ gauche · 🐤 · droite ➡️' },
  { t: 'En haut et en bas', si: /haut|bas|dessus|dessous/i, l: [
    '<b>En haut</b>, c\'est vers le ciel ☁️. <b>En bas</b>, c\'est vers le sol.',
    '« Au-dessus de », c\'est juste plus haut. « En dessous de », c\'est juste plus bas.',
    '« Tout en haut », c\'est le premier de la colonne.'
  ], ex: '⬆️ haut<br>🐤<br>⬇️ bas' });

// ---- Lecture
cours('CP/francais/lettre', { t: 'La première lettre', l: [
  'Dis le mot tout doucement, en étirant le début : « ssss-oleil ».',
  'Le tout premier son que tu entends t\'aide à trouver la lettre.',
  'Attention : certaines lettres ne s\'entendent pas beaucoup, comme le <b>h</b>.'
], ex: '« mmmm-oto » → ça commence par <b>M</b> 🏍️' });
cours('CP/francais/lire', { t: 'Lire un mot', l: [
  'Lis le mot <b>syllabe par syllabe</b>, sans te presser.',
  'Regarde bien <b>toutes</b> les lettres, même celles du milieu.',
  'Les mots piégés ne changent souvent qu\'une seule lettre !'
], ex: 'ca-na-pé 🛋️ · pa-ra-pluie ☂️' });
cours('CP/francais/syllabes', { t: 'Les syllabes', l: [
  'Une syllabe, c\'est un morceau de mot qu\'on dit <b>d\'un seul coup de voix</b>.',
  'Tape dans tes mains à chaque morceau.',
  'Compte le nombre de fois où tu as tapé.'
], ex: 'to-ma-te 👏👏👏 → <b>3</b> syllabes<br>chien 👏 → <b>1</b> syllabe' });
cours('CP/francais/ecoute', { t: 'Écoute et trouve', l: [
  'Touche 🔊 Écouter pour entendre encore le mot.',
  'Regarde chaque image et dis son nom dans ta tête.',
  'Choisis l\'image dont le nom est exactement le mot entendu.'
] });
cours('CP/francais/sons', { t: 'Les sons', l: [
  'Dis le mot à voix haute, lentement.',
  'Cherche le son qui revient dans le mot.',
  'Certains sons s\'écrivent avec 2 lettres : <b>ch</b> (chat), <b>ou</b> (loup), <b>on</b> (bonbon), <b>an</b> (maman), <b>in</b> (lapin), <b>oi</b> (roi), <b>gn</b> (montagne), <b>eu</b> (feu).'
], ex: 'Dans « poule », on entend <b>ou</b>.' });
cours('CP/francais/phrases', { t: 'Lire une phrase', l: [
  'Lis la phrase <b>jusqu\'au point</b>.',
  'Cherche <b>qui</b> fait l\'action, et <b>ce qu\'il fait</b>.',
  'Regarde aussi les petits détails : combien ? de quelle couleur ?'
], ex: '« Le chat dort. » → 🐱💤' });
cours('CP/francais/comprendre', { t: 'Comprendre une histoire', l: [
  'Lis (ou écoute) toute la petite histoire.',
  'Lis ensuite la question : elle commence par <b>Qui ? Quoi ? Où ? Combien ?</b>',
  'Relis l\'histoire : la réponse est cachée dedans !'
], ex: '« Lou va au zoo. Elle voit un lion. »<br>Où est Lou ? → <b>au zoo</b>' });
cours('CP/francais/ecrire', { t: 'Écrire un mot', l: [
  'Dis le mot lentement, syllabe par syllabe.',
  'Écris les sons <b>dans l\'ordre</b> où tu les entends.',
  'Attention aux lettres muettes à la fin (on ne les entend pas).'
], ex: 'pou-le → p · ou · l · e' });
cours('CP/francais/mots-outils', { t: 'Les petits mots', l: [
  'Ce sont des mots très courts qu\'on lit partout : le, la, un, et, dans, avec…',
  'Il faut les connaître <b>par cœur</b>, en les regardant bien.',
  'Écoute le mot, puis compare les lettres de chaque bouton.'
], ex: '<b>sur</b> la table · <b>sous</b> le lit' });

// ---- Le monde
cours('CP/monde/quiz-monde',
  { t: 'Les 5 sens', si: /sens|entend|voit-on|goût|sent-on|touche/i, l: [
    'On a <b>5 sens</b> pour découvrir le monde.',
    'Les yeux pour voir. 👁️', 'Les oreilles pour entendre. 👂', 'Le nez pour sentir. 👃', 'La langue pour goûter. 👅', 'La peau et les mains pour toucher. ✋'
  ] },
  { t: 'Les animaux', si: /animal|bébé|têtard|chenille|plumes|écailles|carapace|lait|œufs/i, l: [
    'Les animaux ont des bébés : la vache a un veau, la brebis un agneau, la jument un poulain.',
    'Certains animaux pondent des œufs, d\'autres font du lait pour leurs petits.',
    'Les oiseaux ont des plumes, les poissons des écailles, la tortue une carapace.',
    'Certains se transforment en grandissant : c\'est la métamorphose.'
  ] },
  { t: 'Les saisons', si: /saison/i, l: [
    'Il y a <b>4 saisons</b> : printemps 🌷, été ☀️, automne 🍂, hiver ❄️.',
    'Au printemps, tout repousse. En été, il fait chaud.',
    'En automne, les feuilles tombent. En hiver, il fait froid.'
  ] },
  { t: 'L\'eau', si: mots('eau', 'glaçon', 'gèle', 'fond', 'pluie', 'flotte'), l: [
    'Quand il fait très froid, l\'eau devient de la <b>glace</b>.',
    'Quand la glace chauffe, elle <b>fond</b> et redevient de l\'eau.',
    'La pluie tombe des nuages.',
    'Les objets légers comme le bois flottent, les objets lourds coulent.'
  ] },
  { t: 'Mon corps et ma santé', si: mots('cœur', 'dents', 'mains?', 'toilettes', 'os', 'santé', 'doigts', 'court'), l: [
    'Le cœur bat dans la poitrine. Il bat plus vite quand on bouge.',
    'Les os nous tiennent debout.',
    'On se lave les mains avant de manger et après les toilettes. 🧼',
    'On se brosse les dents après les repas. 🪥',
    'Fruits et légumes sont bons pour la santé.'
  ] },
  { t: 'Le vivant', si: /vivant|plante|graine|besoin/i, l: [
    'Ce qui est vivant naît, grandit, se nourrit et meurt : les plantes, les animaux, les humains.',
    'Une pierre ou une voiture ne sont pas vivantes.',
    'Une plante a besoin d\'eau et de lumière pour pousser. Un animal a besoin de manger et de boire.'
  ] },
  { t: 'Le monde autour de moi', l: [
    'Observe bien l\'image et pense à ce que tu vois chaque jour.',
    'Une semaine a 7 jours, une année a 12 mois.'
  ] });
cours('CP/monde/jours',
  { t: 'Les jours de la semaine', si: /jour/i, l: [
    'Il y a <b>7 jours</b> : lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche.',
    'Après dimanche, la semaine recommence au lundi.',
    'Récite la comptine des jours et arrête-toi au bon endroit.'
  ] },
  { t: 'Les mois de l\'année', si: /mois/i, l: [
    'Il y a <b>12 mois</b> : janvier, février, mars, avril, mai, juin, juillet, août, septembre, octobre, novembre, décembre.',
    'Après décembre, une nouvelle année commence en janvier.',
    'Récite la liste et arrête-toi juste après le mois demandé.'
  ] });
cours('CP/monde/temps',
  { t: 'Hier, aujourd\'hui, demain', si: /hier|demain|aujourd/i, l: [
    '<b>Hier</b>, c\'est le jour d\'avant. <b>Demain</b>, c\'est le jour d\'après.',
    'Récite les jours : lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche.',
    'Pour demain, avance d\'un jour. Pour hier, recule d\'un jour.'
  ], ex: 'Si aujourd\'hui c\'est samedi : hier = vendredi, demain = dimanche.' },
  { t: 'Le moment de la journée', si: /Quand|matin|soir|nuit/i, l: [
    'Le <b>matin</b> : on se lève, on déjeune. 🌅',
    '<b>Midi</b> : on mange à la cantine. <b>L\'après-midi</b> : le goûter.',
    'Le <b>soir</b> : on dîne. La <b>nuit</b> : on dort et on voit les étoiles. 🌙'
  ] },
  { t: 'Jours et mois', si: /mois|semaine|week-end|Noël|rentrée/i, l: [
    'Les 7 jours : lundi · mardi · mercredi · jeudi · vendredi · samedi · dimanche',
    'Les 12 mois : janvier · février · mars · avril · mai · juin · juillet · août · septembre · octobre · novembre · décembre',
    'Le samedi et le dimanche, c\'est le week-end.'
  ] },
  { t: 'Dans l\'ordre', si: /vient|en premier|en dernier/i, l: [
    'Pense à ce qui se passe <b>d\'abord</b>, puis <b>ensuite</b>, puis <b>à la fin</b>.',
    'Un bébé devient un enfant, puis un adulte, puis une personne âgée.',
    'Une graine devient une pousse, puis une fleur.'
  ] },
  { t: 'Le temps qui passe', l: [
    'Une minute, c\'est court. Une heure, c\'est plus long. Un jour, une semaine, un mois, une année : de plus en plus long !',
    'L\'horloge donne l\'heure, le calendrier montre les jours et les mois.',
    'Autrefois, il n\'y avait ni électricité, ni téléphone portable.'
  ] });
cours('CP/monde/citoyen',
  { t: 'Être poli', si: /dit-on|Pardon|Merci|Bonjour|poliment/i, l: [
    'Les mots magiques : <b>bonjour</b>, <b>au revoir</b>, <b>s\'il te plaît</b>, <b>merci</b>, <b>pardon</b>.',
    'On les dit pour montrer du respect aux autres.'
  ] },
  { t: 'En sécurité', si: /rue|traverse|feu|vélo|voiture|inconnu|médicament|trottoir|bus|pompiers|nuit/i, l: [
    'Dans la rue, on marche sur le trottoir et on donne la main à un adulte.',
    'On traverse sur le passage piéton, quand le petit bonhomme est vert, en regardant à gauche et à droite.',
    'À vélo, on met un casque. En voiture, on attache sa ceinture.',
    'On ne suit jamais un inconnu. On ne touche pas aux médicaments.',
    'Les pompiers, c\'est le 18.'
  ] },
  { t: 'Vivre ensemble', l: [
    'Les règles servent à bien vivre ensemble.',
    'On écoute, on lève le doigt pour parler, on range ses affaires.',
    'On aide et on console les autres. On ne tape jamais.',
    'Filles et garçons ont les mêmes droits.',
    'Le drapeau de la France est bleu, blanc, rouge. La fête nationale, c\'est le 14 juillet.'
  ] });
cours('CP/monde/espace', { t: 'Se repérer', l: [
  'Chaque lieu a son métier : on achète le pain à la boulangerie, on se soigne à l\'hôpital, le maire travaille à la mairie.',
  'En ville, il y a beaucoup d\'immeubles. À la campagne, il y a des champs et des fermes.',
  'Un plan, c\'est un dessin vu d\'en haut. Sur une carte, la mer est bleue.',
  'Les transports : la voiture et le bus sur la route, le train sur des rails, le bateau sur l\'eau, l\'avion dans le ciel.',
  'Nous vivons sur la planète Terre. 🌍'
] });

// ---- Arts
cours('CP/arts/couleurs',
  { t: 'Mélanger les couleurs', si: /mélang|obtiens/i, l: [
    'Les 3 couleurs de base : <b>rouge</b> 🔴, <b>jaune</b> 🟡, <b>bleu</b> 🔵.',
    'En les mélangeant deux par deux, on fabrique d\'autres couleurs.',
    'Rouge + jaune = orange 🟠', 'Bleu + jaune = vert 🟢', 'Rouge + bleu = violet 🟣'
  ] },
  { t: 'Les couleurs', l: [
    'Pense à une chose que tu connais de cette couleur.',
    'Le ciel est bleu, l\'herbe est verte, le soleil est jaune, la tomate est rouge.'
  ] });
cours('CP/arts/instruments', { t: 'Les instruments', l: [
  'Il y a des instruments à <b>cordes</b> (guitare, violon), à <b>vent</b> où l\'on souffle (trompette, flûte), et à <b>percussion</b> où l\'on tape (tambour).',
  'Le piano a des touches noires et blanches.',
  'Écoute bien le son : est-il doux ? fort ? aigu ? grave ?'
] });

/* ================= CM1 ================= */

// ---- Maths
cours('CM1/maths/tables', { t: 'Les tables de multiplication', l: [
  '6 × 4, c\'est 6 fois 4 : 4 + 4 + 4 + 4 + 4 + 4.',
  'On peut échanger les nombres : 3 × 8 = 8 × 3.',
  'Table de 5 : ça finit par 0 ou 5. Table de 9 : si on additionne les deux chiffres du résultat, on trouve 9.',
  'Si tu bloques, pars d\'un résultat que tu connais, puis ajoute ou enlève une fois le nombre.'
], ex: '7 × 6 = 7 × 5 + 7 = 35 + 7 = <b>42</b>' });
cours('CM1/maths/divisions', { t: 'La division', l: [
  'Diviser, c\'est <b>partager en parts égales</b>.',
  '42 ÷ 6 : on cherche combien de fois 6 va dans 42.',
  'Utilise la table : 6 × ? = 42.'
], ex: '35 ÷ 5 → 5 × <b>7</b> = 35, donc 35 ÷ 5 = <b>7</b>.' });
cours('CM1/maths/grands-nombres', { t: 'Les grands nombres', l: [
  'On lit les chiffres de droite à gauche : unités, dizaines, centaines…',
  'Puis la classe des mille : unités de mille, dizaines de mille, centaines de mille.',
  'Un espace sépare les classes : 45 208 → 45 mille et 208.'
], ex: '3 6 2 · 4 1 7<br>c · d · u (mille) · c · d · u<br>Dans 362 417, le chiffre des centaines est <b>4</b>.' });
cours('CM1/maths/fractions', { t: 'Les fractions', l: [
  'Le nombre du <b>bas</b> (dénominateur) : en combien de parts égales on a partagé.',
  'Le nombre du <b>haut</b> (numérateur) : combien de parts on a coloriées.',
  'Compte bien <b>toutes</b> les parts, coloriées ou non.'
], ex: '🟦🟦⬜⬜⬜ → 2 parts coloriées sur 5 → <b>2/5</b>' });
cours('CM1/maths/mesures', { t: 'Les conversions', l: [
  '1 km = 1 000 m · 1 m = 100 cm · 1 m = 1 000 mm',
  '1 kg = 1 000 g · 1 L = 100 cL · 1 h = 60 min',
  'Pour passer à une unité plus petite, on <b>multiplie</b> : le nombre devient plus grand.'
], ex: '4 m = 4 × 100 cm = <b>400 cm</b>' });
cours('CM1/maths/problemes', { t: 'Résoudre un problème', l: [
  '1. Lis tout l\'énoncé et repère la <b>question</b>.',
  '2. Choisis l\'opération : « en tout » → +, « reste » → −, « dans plusieurs paquets » → ×, « partager » → ÷.',
  '3. Calcule, puis vérifie que le résultat a du sens.'
], ex: 'Une boîte a 6 œufs. Combien d\'œufs dans 4 boîtes ?<br>6 × 4 = <b>24</b> œufs' });
cours('CM1/maths/decimaux',
  { t: 'Chiffres d\'un nombre décimal', si: /chiffre des|Écris en chiffres|fraction décimale|\/10|\/100/i, l: [
    'Avant la virgule : la partie entière (unités, dizaines…).',
    'Après la virgule : les <b>dixièmes</b> (1er chiffre), puis les <b>centièmes</b> (2e chiffre).',
    '1/10 = 0,1 et 1/100 = 0,01.'
  ], ex: '5,38 → 5 unités, 3 dixièmes, 8 centièmes<br>38/100 = 0,38' },
  { t: 'Comparer des décimaux', si: /plus (grand|petit)/i, l: [
    'Compare d\'abord la partie entière.',
    'Si elle est pareille, compare les dixièmes, puis les centièmes.',
    'Piège : 2,7 est plus grand que 2,15 (7 dixièmes > 1 dixième).'
  ] },
  { t: 'Calculer avec des décimaux', l: [
    'Pose l\'opération en <b>alignant les virgules</b>.',
    'Ajoute des 0 si besoin : 3,5 = 3,50.',
    'Calcule comme d\'habitude, puis remets la virgule au même endroit.'
  ], ex: '2,40 + 1,35 = <b>3,75</b>' });
cours('CM1/maths/geometrie',
  { t: 'Les angles', si: /angle/i, l: [
    'L\'<b>angle droit</b> : comme le coin d\'une feuille. On le vérifie avec l\'équerre.',
    'L\'<b>angle aigu</b> est plus petit (plus fermé) qu\'un angle droit.',
    'L\'<b>angle obtus</b> est plus grand (plus ouvert) qu\'un angle droit.'
  ] },
  { t: 'Le cercle', si: /cercle|rayon|diamètre|compas/i, l: [
    'On trace un cercle avec un <b>compas</b>. Son centre est souvent appelé O.',
    'Le <b>rayon</b> va du centre jusqu\'au cercle.',
    'Le <b>diamètre</b> traverse tout le cercle en passant par le centre : il vaut 2 rayons.'
  ], ex: 'Rayon 7 cm → diamètre 14 cm' },
  { t: 'Droites', si: /droites/i, l: [
    '<b>Parallèles</b> : elles ne se croisent jamais, comme des rails. 🛤️',
    '<b>Perpendiculaires</b> : elles se croisent en formant un angle droit (le petit carré).'
  ] },
  { t: 'La symétrie', si: /symétrie/i, l: [
    'Un axe de symétrie coupe une figure en deux moitiés <b>identiques</b>.',
    'Si on plie selon l\'axe, les deux moitiés se superposent exactement.'
  ] },
  { t: 'Les figures', l: [
    '<b>Carré</b> : 4 côtés égaux et 4 angles droits.',
    '<b>Rectangle</b> : 4 angles droits, côtés opposés égaux.',
    '<b>Losange</b> : 4 côtés égaux, pas forcément d\'angle droit.',
    'Triangle <b>isocèle</b> : 2 côtés égaux. <b>Équilatéral</b> : 3 côtés égaux. <b>Rectangle</b> : un angle droit.',
    'Un triangle a 3 côtés et 3 sommets. Les petits traits montrent les côtés de même longueur.'
  ] });
cours('CM1/maths/perimetre-aire',
  { t: 'Le périmètre', si: /périmètre/i, l: [
    'Le périmètre, c\'est la longueur du <b>tour</b> de la figure.',
    'On additionne tous les côtés.',
    'Rectangle : 2 × (longueur + largeur). Carré : 4 × côté.'
  ], ex: 'Rectangle 6 cm × 2 cm → 6 + 2 + 6 + 2 = <b>16 cm</b>' },
  { t: 'L\'aire', l: [
    'L\'aire, c\'est la <b>surface</b> à l\'intérieur de la figure.',
    'On peut compter les carreaux.',
    'Rectangle : longueur × largeur. Elle s\'écrit en cm² (centimètres carrés).'
  ], ex: 'Rectangle 6 cm × 2 cm → 6 × 2 = <b>12 cm²</b>' });
cours('CM1/maths/durees',
  { t: 'Lire l\'horloge', si: /horloge/i, l: [
    'La petite aiguille montre l\'heure, la grande (rouge) les minutes.',
    'Chaque chiffre vaut 5 minutes pour la grande aiguille : sur le 3 → 15 min, sur le 6 → 30 min, sur le 9 → 45 min.'
  ], ex: 'Petite aiguille après le 4, grande sur le 4 → <b>4 h 20</b>' },
  { t: 'Calculer une durée', si: /commence|dans \d+ min|Quelle heure sera/i, l: [
    'Avance d\'abord jusqu\'à l\'heure pile, puis ajoute le reste.',
    '1 h = 60 min.'
  ], ex: 'De 9 h 40 à 11 h 10 : 9 h 40 → 10 h = 20 min, 10 h → 11 h 10 = 1 h 10<br>Total : <b>1 h 30 min</b>' },
  { t: 'Heures et minutes', l: [
    '1 h = 60 min, 2 h = 120 min, 3 h = 180 min.',
    'Pour convertir : multiplie les heures par 60, puis ajoute les minutes.'
  ], ex: '3 h 20 min = 180 + 20 = <b>200 min</b>' });
cours('CM1/maths/multiplication-posee',
  { t: 'Multiplier par 10, 100, 20…', si: /× \d*0\b/, l: [
    '× 10 : on ajoute <b>un 0</b> au bout. × 100 : on ajoute <b>deux 0</b>.',
    '× 20, c\'est × 2 puis × 10.'
  ], ex: '43 × 30 = 43 × 3 × 10 = 129 × 10 = <b>1 290</b>' },
  { t: 'La multiplication posée', l: [
    'Multiplie chaque chiffre du haut par le chiffre du bas, en commençant par les unités.',
    'N\'oublie pas les <b>retenues</b>.',
    'Avec 2 chiffres en bas : la 2e ligne commence par un <b>0</b> (on multiplie par des dizaines), puis on additionne les lignes.'
  ], ex: '24 × 13 → 24 × 3 = 72, 24 × 10 = 240 → 72 + 240 = <b>312</b>' });
cours('CM1/maths/fractions-2',
  { t: 'Fraction d\'une quantité', si: /Combien font/i, l: [
    'Pour prendre 3/4 de quelque chose : partage en <b>4</b>, puis prends <b>3</b> parts.'
  ], ex: '3/4 de 20 : 20 ÷ 4 = 5, puis 5 × 3 = <b>15</b>' },
  { t: 'Comparer à 1', si: /est…/i, l: [
    'Si le haut est plus petit que le bas, la fraction est <b>plus petite que 1</b>.',
    'Si le haut et le bas sont égaux, elle vaut <b>1</b>.',
    'Si le haut est plus grand, elle est <b>plus grande que 1</b>.'
  ], ex: '5/8 &lt; 1 · 8/8 = 1 · 9/8 &gt; 1' },
  { t: 'Comparer des fractions', si: /plus (grande|petite)/i, l: [
    'Même dénominateur (même nombre en bas) : la plus grande est celle qui a le plus grand numérateur.'
  ], ex: '2/7 &lt; 5/7' },
  { t: 'Fractions égales', si: /égale/i, l: [
    'On obtient une fraction égale en multipliant le haut <b>et</b> le bas par le même nombre.'
  ], ex: '2/5 = 4/10 = 6/15' },
  { t: 'Fraction sur une droite', si: /point A/i, l: [
    'Compte en combien de parts l\'unité (de 0 à 1) est découpée : c\'est le dénominateur.',
    'Compte combien de parts il faut pour aller de 0 au point : c\'est le numérateur.'
  ] });
cours('CM1/maths/multiples',
  { t: 'Pair ou impair', si: /pair/i, l: [
    'Regarde seulement le chiffre des <b>unités</b>.',
    'Il finit par 0, 2, 4, 6 ou 8 → <b>pair</b>. Par 1, 3, 5, 7 ou 9 → <b>impair</b>.'
  ] },
  { t: 'Multiples et diviseurs', si: /multiple|diviseur|divisible/i, l: [
    'Un <b>multiple</b> de 7 est un résultat de la table de 7 : 7 × 1, 7 × 2, 7 × 3…',
    'Un <b>diviseur</b> d\'un nombre le partage en parts égales, <b>sans reste</b>. Pense aux tables : si 4 × ? tombe juste sur le nombre, 4 est un diviseur.',
    'Divisible par 2 : finit par un chiffre pair. Par 5 : finit par 0 ou 5. Par 10 : finit par 0.'
  ] },
  { t: 'Quotient et reste', l: [
    'On cherche combien de paquets <b>pleins</b> on peut faire (le quotient), et ce qui reste.',
    'Le reste est toujours plus petit que la taille d\'un paquet.'
  ], ex: '17 billes par 5 : 5 × 3 = 15, il reste 2.<br>Quotient <b>3</b>, reste <b>2</b>' });

// ---- Français
cours('CM1/francais/conjugaison',
  { t: 'Le présent', si: /présent/i, l: [
    'Verbes en -er : je chante, tu chantes, il chante, nous chantons, vous chantez, ils chantent.',
    'Verbes comme finir : je finis, tu finis, il finit, nous finissons, vous finissez, ils finissent.',
    'Être : je suis, tu es, il est, nous sommes, vous êtes, ils sont. Avoir : j\'ai, tu as, il a, nous avons, vous avez, ils ont.'
  ] },
  { t: 'L\'imparfait', si: /imparfait/i, l: [
    'Les terminaisons sont les mêmes pour tous les verbes : <b>-ais, -ais, -ait, -ions, -iez, -aient</b>.',
    'On part du « nous » au présent : nous jouons → je jou<b>ais</b>.'
  ], ex: 'danser : je dansais, nous dansions, ils dansaient' },
  { t: 'Le futur', si: /futur/i, l: [
    'Les terminaisons : <b>-rai, -ras, -ra, -rons, -rez, -ront</b>.',
    'On les ajoute souvent à l\'infinitif : jouer → je jouerai.',
    'Verbes spéciaux : être → je serai, avoir → j\'aurai, aller → j\'irai, faire → je ferai.'
  ], ex: 'parler : je parlerai, nous parlerons, ils parleront' },
  { t: 'Conjuguer', l: [
    'Trouve le temps (présent, imparfait, futur) et la personne (je, tu, il…).',
    'La terminaison change selon la personne.'
  ] });
cours('CM1/francais/homophones',
  { t: 'a ou à', si: mots('a', 'à'), l: [
    '<b>a</b> est le verbe avoir : on peut le remplacer par <b>avait</b>.',
    '<b>à</b> est un petit mot qui indique un lieu, un moment… On ne peut pas dire « avait ».'
  ], ex: 'Léo <b>a</b> un vélo (Léo avait un vélo). Il va <b>à</b> l\'école.' },
  { t: 'et ou est', si: mots('et', 'est'), l: [
    '<b>est</b> est le verbe être : on peut le remplacer par <b>était</b>.',
    '<b>et</b> relie deux mots : on peut dire « et puis ».'
  ], ex: 'Le ciel <b>est</b> gris <b>et</b> il fait froid.' },
  { t: 'son ou sont', si: mots('son', 'sont'), l: [
    '<b>sont</b> est le verbe être : on peut dire <b>étaient</b>.',
    '<b>son</b> veut dire « le sien » : on peut dire <b>mon</b>.'
  ], ex: 'Ses chats <b>sont</b> gris. Il caresse <b>son</b> chat.' },
  { t: 'on ou ont', si: mots('on', 'ont'), l: [
    '<b>ont</b> est le verbe avoir : on peut dire <b>avaient</b>.',
    '<b>on</b> est un pronom : on peut le remplacer par <b>il</b>.'
  ], ex: 'Les enfants <b>ont</b> soif. <b>On</b> boit de l\'eau.' },
  { t: 'ou ou où', si: mots('ou', 'où'), l: [
    '<b>ou</b> sans accent : on peut dire <b>ou bien</b> (un choix).',
    '<b>où</b> avec accent : il indique un <b>lieu</b>.'
  ], ex: 'Tu veux une pomme <b>ou</b> une poire ? <b>Où</b> est ma trousse ?' },
  { t: 'Les homophones', l: [
    'Ces mots se prononcent pareil mais s\'écrivent différemment.',
    'Astuce : essaie de remplacer le mot (par avait, était, il, mon…) pour trouver le bon.'
  ] });
cours('CM1/francais/nature', { t: 'La nature des mots', l: [
  '<b>Nom</b> : désigne une personne, un animal, une chose (on peut mettre « le » ou « un » devant).',
  '<b>Verbe</b> : dit ce qu\'on fait ; il se conjugue (hier…, demain…).',
  '<b>Adjectif</b> : dit comment est le nom (petit, rouge, calme…).',
  '<b>Déterminant</b> : petit mot devant le nom (le, une, mes, cette…).',
  '<b>Pronom</b> : remplace un nom (je, tu, il, nous, elles…).'
], ex: '<b>Ma</b> (dét.) <b>tortue</b> (nom) <b>verte</b> (adj.) <b>marche</b> (verbe). <b>Elle</b> (pronom) est lente.' });
cours('CM1/francais/pluriels', { t: 'Les pluriels', l: [
  'En général, on ajoute un <b>-s</b>.',
  'Les mots en -s, -x, -z ne changent pas.',
  'Les mots en -eau, -au, -eu prennent un <b>-x</b> (sauf pneu, bleu…).',
  'Les mots en -al deviennent souvent <b>-aux</b> (sauf bal, festival, carnaval…).',
  '7 mots en -ou prennent un -x : bijou, caillou, chou, genou, hibou, joujou, pou. Les autres : -s.',
  'Quelques pluriels spéciaux : un œil → des yeux ; un travail → des travaux.'
], ex: 'un gâteau → des gâteaux · un animal → des animaux · un trou → des trous' });
cours('CM1/francais/passe-compose',
  { t: 'Avoir ou être ?', si: /auxiliaire/i, l: [
    'La plupart des verbes utilisent <b>avoir</b> : j\'ai mangé.',
    'Les verbes de mouvement ou de changement d\'état utilisent <b>être</b> : aller, venir, arriver, partir, entrer, sortir, monter, descendre, tomber, rester, naître, mourir…'
  ] },
  { t: 'Le participe passé', si: /participe/i, l: [
    'Verbes en -er → <b>-é</b> (chanter → chanté).',
    'Verbes comme finir → <b>-i</b> (finir → fini).',
    'Autres : prendre → pris · faire → fait · voir → vu · lire → lu · écrire → écrit · mettre → mis'
  ] },
  { t: 'Le passé composé', l: [
    'Passé composé = auxiliaire <b>avoir</b> ou <b>être</b> au présent + <b>participe passé</b>.',
    'Avec <b>être</b>, le participe s\'accorde avec le sujet : elle est partie, ils sont partis.',
    'Avec <b>avoir</b>, il ne s\'accorde pas avec le sujet : elles ont chanté.'
  ], ex: 'Nous (sortir) → nous <b>sommes sortis</b>. Tu (voir) → tu <b>as vu</b>.' });
cours('CM1/francais/grammaire', { t: 'Sujet, verbe, compléments', l: [
  '<b>Verbe</b> : ce qu\'on fait ; il change si on dit « hier » ou « demain ».',
  '<b>Sujet</b> : qui fait l\'action. Pose la question « <b>Qui est-ce qui</b> + verbe ? »',
  '<b>Complément du verbe</b> : on ne peut pas le déplacer ni souvent l\'enlever (« il mange quoi ? »).',
  '<b>Complément de phrase</b> : on peut le <b>déplacer</b> ou le <b>supprimer</b> (où ? quand ?).'
], ex: '<b>Le soir</b> (compl. de phrase), <b>mon frère</b> (sujet) <b>lit</b> (verbe) <b>une BD</b> (compl. du verbe).' });
cours('CM1/francais/accords',
  { t: 'Accord sujet-verbe', l: [
    'Le verbe s\'accorde avec son <b>sujet</b> : trouve « qui est-ce qui » fait l\'action.',
    'Attention aux pièges : dans « le chien des voisins », le sujet est « le chien » (singulier).',
    'Le sujet peut être après le verbe : « Dans le pré courent des chevaux. »'
  ] },
  { t: 'Accord de l\'adjectif', l: [
    'L\'adjectif s\'accorde avec le nom : au <b>féminin</b> on ajoute souvent <b>-e</b>, au <b>pluriel</b> <b>-s</b>.',
    'Cherche le nom qu\'il décrit : masculin ou féminin ? singulier ou pluriel ?',
    'Quelques féminins spéciaux : blanc → blanche · doux → douce · frais → fraîche · long → longue'
  ], ex: 'un pull noir · une jupe noir<b>e</b> · des pulls noir<b>s</b> · des jupes noir<b>es</b>' });
cours('CM1/francais/types-phrases',
  { t: 'Forme affirmative ou négative', si: /forme/i, l: [
    'Une phrase <b>négative</b> contient deux petits mots : <b>ne… pas</b>, ne… jamais, ne… plus, ne… rien.',
    'Sinon, elle est <b>affirmative</b>.'
  ], ex: 'Il ne pleut jamais ici. → négative' },
  { t: 'Les types de phrases', l: [
    '<b>Déclarative</b> : elle raconte ou donne une information. Elle finit par un point.',
    '<b>Interrogative</b> : elle pose une question. Elle finit par <b>?</b>',
    '<b>Impérative</b> : elle donne un ordre ou un conseil, sans sujet écrit.',
    '<b>Exclamative</b> : elle montre une émotion. Elle finit par <b>!</b>'
  ], ex: 'Range ta chambre. → impérative (un ordre)' });
cours('CM1/francais/vocabulaire',
  { t: 'Synonymes et contraires', si: /synonyme|contraire/i, l: [
    'Un <b>synonyme</b> veut dire presque la même chose : content → joyeux.',
    'Un <b>contraire</b> veut dire l\'inverse : ouvrir → fermer.',
    'Certains contraires se font avec un préfixe : poli → <b>im</b>poli, faire → <b>dé</b>faire.'
  ] },
  { t: 'Préfixe et suffixe', si: /préfixe|suffixe/i, l: [
    'Le <b>préfixe</b> est au <b>début</b> du mot : <b>re</b>venir, <b>dé</b>coller.',
    'Le <b>suffixe</b> est à la <b>fin</b> : jardin<b>ier</b>, fill<b>ette</b>.'
  ] },
  { t: 'Famille de mots', si: /famille/i, l: [
    'Les mots d\'une même famille ont un morceau en commun (le radical) et un sens proche.'
  ], ex: 'terre : terrain, terrier, enterrer' },
  { t: 'Sens propre ou figuré', si: /sens/i, l: [
    'Sens <b>propre</b> : le vrai sens du mot.',
    'Sens <b>figuré</b> : une image, on ne le prend pas au pied de la lettre.'
  ], ex: 'Il a une faim de loup. → sens figuré (il n\'est pas un loup !)' });
cours('CM1/francais/dictionnaire',
  { t: 'Les abréviations', si: /abréviation/i, l: [
    'Le dictionnaire écrit certains mots en abrégé : <b>n.</b> = nom, <b>v.</b> = verbe, <b>m.</b> = masculin, <b>f.</b> = féminin, <b>adj.</b> = adjectif, <b>adv.</b> = adverbe, <b>pl.</b> = pluriel.'
  ] },
  { t: 'L\'ordre alphabétique', l: [
    'Les mots sont rangés dans l\'ordre de l\'alphabet : a, b, c, d…',
    'Si la 1re lettre est la même, regarde la 2e, puis la 3e…'
  ], ex: 'cabane → cadeau → canard (b, puis d, puis n)' });
cours('CM1/francais/comprehension', { t: 'Comprendre un texte', l: [
  'Lis la question <b>avant</b> de relire le texte : tu sais ce que tu cherches.',
  'Repère les mots importants de la question (qui ? où ? quand ? pourquoi ?).',
  'Retrouve la phrase du texte qui en parle et relis-la bien.',
  'Méfie-toi des réponses qui utilisent des mots du texte mais changent le sens.'
] });
cours('CM1/francais/dictee', { t: 'Bien écrire un mot', l: [
  'Écoute le mot plusieurs fois avec 🔊.',
  'Découpe-le en syllabes et écris chaque son.',
  'Pense aux lettres muettes : trouve un mot de la même famille (gran<b>d</b> → gran<b>d</b>e).',
  'Pense aux accents (é, è, ê) et aux doubles lettres.'
], ex: 'un cham<b>p</b> → on entend le p dans « champêtre »' });

// ---- Histoire, géo, sciences, EMC : fiches par thème
cours('CM1/histoire/quiz-histoire',
  { t: 'La Préhistoire', si: /Préhistoire|préhistoriques|Néolithique|feu|menhirs|Lascaux|écriture/i, l: [
    'La Préhistoire commence avec les premiers humains et se termine avec l\'invention de l\'écriture.',
    'Les hommes préhistoriques maîtrisent le feu, peignent dans des grottes comme Lascaux.',
    'Au Néolithique, ils deviennent agriculteurs et éleveurs et vivent dans des villages : ils sont sédentaires. Ils dressent des menhirs.'
  ] },
  { t: 'Gaulois et Romains', si: /Gaul|Rom|César|Alésia|aqueduc|Lutèce|Massalia|gallo/i, l: [
    'Les Gaulois vivaient en Gaule. Les Grecs y ont fondé Massalia (Marseille).',
    'Le chef gaulois Vercingétorix a combattu Jules César ; il est vaincu à Alésia en 52 av. J.-C.',
    'Les Romains construisent des routes, des villes et des aqueducs pour transporter l\'eau, comme le pont du Gard.',
    'Le mélange des deux donne la civilisation gallo-romaine. Paris s\'appelait Lutèce.'
  ] },
  { t: 'Le Moyen Âge', si: /Moyen Âge|château fort|seigneur|chevalier|adoubement|paysans|Clovis|Francs|baptis|l'an 800|Charlemagne|Capet|Saint Louis|Cent Ans|Jeanne/i, l: [
    'Le Moyen Âge, c\'est l\'époque des châteaux forts et des chevaliers.',
    'Clovis, roi des Francs, est baptisé à Reims. Charlemagne est couronné empereur en 800. Hugues Capet devient roi en 987.',
    'Le seigneur vit dans le château ; les paysans cultivent ses terres. Un jeune devient chevalier lors de l\'adoubement.',
    'Louis IX est appelé Saint Louis.',
    'Pendant la guerre de Cent Ans contre l\'Angleterre, Jeanne d\'Arc mène les armées françaises ; elle est brûlée à Rouen en 1431.'
  ] },
  { t: 'Les Temps modernes', si: /Renaissance|XVIe|François|Léonard|Chambord|Marignan|Villers|Gutenberg|imprimerie|Colomb|Henri IV|Nantes|Louis XIV|Versailles|Roi-Soleil|absolue/i, l: [
    'Gutenberg invente l\'imprimerie vers 1450. Christophe Colomb arrive en Amérique en 1492.',
    'La Renaissance (XVIe siècle) : François Ier gagne à Marignan en 1515, invite Léonard de Vinci et fait construire Chambord. À Villers-Cotterêts (1539), il impose le français dans les actes officiels.',
    'Henri IV signe l\'édit de Nantes en 1598 pour la paix entre catholiques et protestants.',
    'Louis XIV, le Roi-Soleil, règne 72 ans et agrandit Versailles. Il décide de tout : c\'est la monarchie absolue.'
  ] },
  { t: 'La Révolution et Napoléon', si: /Révolution|1789|Bastille|Louis XVI|guillotin|reine|Marie|États généraux|privilèges|Déclaration|République|devise|métrique|départements|Napoléon|Waterloo|Sainte-Hélène|Corse|lycées|Code civil|Légion/i, l: [
    'En 1789, Louis XVI réunit les États généraux. Le 14 juillet 1789, le peuple prend la Bastille.',
    'Dans la nuit du 4 août, les privilèges sont abolis. Le 26 août, on adopte la Déclaration des droits de l\'homme et du citoyen.',
    'La République est proclamée en 1792. Louis XVI et la reine Marie-Antoinette sont guillotinés en 1793. La France est découpée en départements ; on crée le système métrique.',
    'Napoléon Bonaparte, né en Corse, est sacré empereur en 1804. Il crée le Code civil, les lycées, la Légion d\'honneur.',
    'Il est battu à Waterloo en 1815 et meurt en exil à Sainte-Hélène.'
  ] },
  { t: 'Se repérer dans l\'histoire', l: [
    'Préhistoire → Antiquité (Gaulois, Romains) → Moyen Âge (châteaux forts) → Temps modernes (Renaissance, Louis XIV) → Révolution française (1789).'
  ] });
cours('CM1/geo/quiz-geo',
  { t: 'La France et ses voisins', si: /pays|frontière|continent|Hexagone|Berlin|habitants|régions|départements|capitale|Paris|Marseille|Toulouse|ville/i, l: [
    'La France est en Europe. On la surnomme l\'Hexagone, à cause de sa forme à six côtés.',
    'Ses voisins : Belgique, Luxembourg, Allemagne, Suisse, Italie, Monaco, Andorre, Espagne.',
    'Elle compte environ 68 millions d\'habitants, 13 régions en métropole et 101 départements.',
    'Grandes villes : Paris (la capitale), Marseille, Lyon, Toulouse (la « ville rose »), Bordeaux…'
  ] },
  { t: 'Mers, montagnes et fleuves', si: /mer|océan|montagne|mont|massif|Alpes|Pyrénées|fleuve|Loire|Seine|Rhône|Garonne|Corse|île|Guyane|Réunion|Mayotte/i, l: [
    'La France est bordée par la Manche, l\'océan Atlantique et la mer Méditerranée.',
    'Montagnes : les Alpes (avec le mont Blanc, le plus haut sommet), les Pyrénées, le Massif central (anciens volcans), le Jura, les Vosges.',
    'Fleuves : la Loire (le plus long), la Seine (Paris), le Rhône (Lyon), la Garonne (Bordeaux).',
    'La France a aussi des territoires loin : la Guyane en Amérique du Sud, La Réunion et Mayotte dans l\'océan Indien. La Corse est une île de la Méditerranée.',
    'Le plus grand océan du monde est le Pacifique.'
  ] },
  { t: 'Cartes et plans', si: /carte|plan\b|légende|nord|ouest|soleil/i, l: [
    'Un plan est un dessin vu de dessus. La légende explique les symboles et les couleurs.',
    'Sur une carte, le nord est en haut, le sud en bas, l\'est à droite, l\'ouest à gauche.',
    'Le soleil se lève le matin du côté opposé à celui où il se couche le soir. Il se couche à l\'ouest.'
  ] },
  { t: 'Eau et énergie', si: /eau|électricité|énergie|pétrole|barrage|potable|épuration/i, l: [
    'L\'eau potable peut se boire sans danger. Le château d\'eau la stocke et la distribue ; la station d\'épuration nettoie les eaux usées.',
    'L\'eau est précieuse : il faut l\'économiser.',
    'En France, la plus grande partie de l\'électricité vient des centrales nucléaires. Un barrage l\'obtient grâce à la force de l\'eau.',
    'Le pétrole s\'épuisera un jour ; le vent et le soleil sont des énergies renouvelables.'
  ] },
  { t: 'Habiter et se déplacer', l: [
    'On habite en maison ou en immeuble (plusieurs appartements). Autour d\'une grande ville, il y a la banlieue.',
    'La commune est dirigée par le maire, à la mairie.',
    'La marche et le vélo ne polluent pas. Acheter près de chez soi au producteur, c\'est un circuit court.',
    'On emprunte des livres à la médiathèque ; on voit des tableaux au musée.'
  ] });
cours('CM1/sciences/quiz-sciences',
  { t: 'Le corps humain', si: mots('organe', 'cœur', 'squelette', 'os', 'dents', 'molaires', 'respire', 'poumons'), l: [
    'Le cœur pompe le sang. Les poumons servent à respirer.',
    'L\'ensemble des os forme le squelette.',
    'Les incisives coupent, les canines déchirent, les molaires broient.'
  ] },
  { t: 'Les animaux', si: /animal|insecte|pattes|araignée|mammifère|vertébré|plumes|œufs|têtard|grenouille|métamorphose|lait|herbivore|carnivore/i, l: [
    'Un insecte a <b>6 pattes</b> ; l\'araignée en a 8, ce n\'est pas un insecte.',
    'Les mammifères ont des poils et nourrissent leurs petits avec du lait (le dauphin aussi !). Les oiseaux ont des plumes.',
    'Les vertébrés ont une colonne vertébrale.',
    'La grenouille pond des œufs, qui donnent des têtards : c\'est une métamorphose.',
    'Herbivore : mange des plantes. Carnivore : mange de la viande.'
  ] },
  { t: 'Chaînes alimentaires et plantes', si: /chaîne|végétal|plantes|pollen|pollinisation|graine|germination|décompos|feuilles/i, l: [
    'Une chaîne alimentaire commence souvent par un végétal. La flèche → veut dire « est mangé par ».',
    'Les plantes vertes fabriquent leur nourriture grâce à la lumière.',
    'Une graine qui commence à pousser : c\'est la germination. L\'abeille transporte le pollen ; après la pollinisation, la fleur devient un fruit.',
    'Les décomposeurs (vers de terre, champignons) transforment les feuilles mortes en terre.'
  ] },
  { t: 'L\'eau et la matière', si: mots('eau', 'glace', 'vapeur', 'fusion', 'solidification', 'condensation', '°C', 'mélangée?s?', 'mélange', 'dissout', 'dissous', 'filtration', 'air', 'état'), l: [
    'L\'eau existe en 3 états : <b>solide</b> (glace, qui a une forme propre), <b>liquide</b>, <b>gazeux</b> (vapeur).',
    'Glace → liquide : fusion. Liquide → glace : solidification. Vapeur → liquide : condensation.',
    'L\'eau gèle à 0 °C et bout à 100 °C.',
    'Le sel se dissout dans l\'eau ; on le récupère en faisant évaporer l\'eau. On sépare le sable de l\'eau par filtration.',
    'Eau + huile : on voit les deux, c\'est un mélange hétérogène.', 'L\'air ne se voit pas, mais un ballon gonflé est plus lourd qu\'un ballon dégonflé.'
  ] },
  { t: 'Le ciel et la Terre', si: /Terre|Soleil|planète|Lune|étoile|jour et la nuit|Jupiter|Mercure/i, l: [
    'Le Soleil est une étoile. 8 planètes tournent autour ; Mercure est la plus proche, Jupiter la plus grande.',
    'La Terre tourne sur elle-même en un jour (24 h) : c\'est ce qui fait le jour et la nuit.',
    'Elle fait le tour du Soleil en un an : c\'est la révolution.',
    'La Lune est le satellite de la Terre.'
  ] },
  { t: 'Énergie, électricité, matériaux', l: [
    'Pour que l\'ampoule s\'allume, le circuit doit être fermé. Les métaux comme le cuivre laissent passer l\'électricité.',
    'Un aimant attire le fer.',
    'Le vent fait tourner les éoliennes : c\'est une énergie renouvelable. Éteindre la lumière économise l\'énergie.',
    'Le papier vient du bois, le verre du sable, la plupart des plastiques du pétrole.'
  ] });
cours('CM1/emc/quiz-emc',
  { t: 'Les symboles de la République', si: /drapeau|Marianne|devise|Marseillaise|hymne|fête nationale|Bastille|Rouget|Fraternité/i, l: [
    'Le drapeau est bleu, blanc, rouge. Marianne représente la République.',
    'La devise : Liberté, Égalité, Fraternité.',
    'L\'hymne national est La Marseillaise, composée par Rouget de Lisle en 1792.',
    'La fête nationale, le 14 juillet, rappelle la prise de la Bastille (1789).'
  ] },
  { t: 'Les droits de l\'enfant', si: /droit|Convention|ONU|instruction|laïcité|filles|femmes/i, l: [
    'La Convention internationale des droits de l\'enfant a été adoptée par l\'ONU en 1989 (fêtée le 20 novembre).',
    'Chaque enfant a droit à un nom, une nationalité, l\'école, la santé, les loisirs et la protection.',
    'En France, l\'instruction est obligatoire de 3 à 16 ans. Filles et garçons ont les mêmes droits.',
    'La laïcité à l\'école : chacun est libre de croire ou de ne pas croire (loi de 1905).'
  ] },
  { t: 'Voter et décider', si: /vot|élu|président|maire|conseil|lois|députés|Élysée|urne|isoloir|délégués/i, l: [
    'On vote à partir de 18 ans : on passe dans l\'isoloir, puis on glisse son bulletin dans l\'urne.',
    'Le président est élu par les citoyens pour 5 ans ; il travaille à l\'Élysée.',
    'Les conseillers municipaux sont élus pour 6 ans ; ce sont eux qui élisent le maire.',
    'Les lois sont votées par les députés et les sénateurs (le Parlement).',
    'À l\'école, les délégués représentent leur classe.'
  ] },
  { t: 'Urgences et sécurité', si: /numéro|secours|blessé|traverser|Protéger|pompiers|SAMU|police|Allô/i, l: [
    'Numéros d\'urgence : <b>15</b> SAMU, <b>17</b> police, <b>18</b> pompiers, <b>112</b> partout en Europe, <b>119</b> enfance en danger.',
    'Pour porter secours : Protéger, Alerter, Secourir. On dit qui on est, où on est et ce qui se passe.',
    'On traverse sur le passage piéton, quand le petit bonhomme est vert.'
  ] },
  { t: 'Vivre ensemble', l: [
    'Les règles servent à bien vivre et apprendre ensemble ; elles valent pour tout le monde.',
    'Se moquer ou mettre à l\'écart quelqu\'un encore et encore, c\'est du harcèlement (sur Internet : cyberharcèlement). On en parle à un adulte de confiance.',
    'En cas de désaccord, on discute calmement.'
  ] });

/* ================= Anglais (les deux niveaux) ================= */
const FICHE_ANGLAIS = { t: 'Trouver le mot anglais', l: [
  'Écoute le mot avec 🔊 autant de fois que tu veux.',
  'Beaucoup de mots anglais ressemblent au français : banana, chocolate, lion, orange…',
  'Attention, l\'anglais ne se lit pas comme le français : « eye » se dit « aï ».',
  'Si tu hésites, écarte d\'abord les réponses dont tu es sûre qu\'elles sont fausses.'
] };
cours('*/anglais',
  { t: 'Les nombres en anglais', surEnonce: true, si: mots('one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', '[a-z]+teen', '[a-z]+ty', 'hundred', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'quatre-vingts?', 'quatre-vingt-dix', 'cent'), l: [
    'one 1 · two 2 · three 3 · four 4 · five 5 · six 6 · seven 7 · eight 8 · nine 9 · ten 10',
    'De 13 à 19, ils finissent par <b>-teen</b> : fourteen, sixteen…',
    'Les dizaines finissent par <b>-ty</b> : twenty 20, thirty 30, forty 40…'
  ] },
  { t: 'Répondre en anglais', si: /réponse à/i, l: [
    'Écoute bien le premier mot de la question : <b>What</b> = quoi, <b>Where</b> = où, <b>How old</b> = quel âge, <b>How are you</b> = comment vas-tu.',
    'La bonne réponse parle de la même chose que la question.'
  ], ex: '« What\'s your favourite colour? » → « My favourite colour is green. »' },
  FICHE_ANGLAIS);
cours('*/cours-anglais', { t: 'Ma leçon d\'anglais', l: [
  'Au début de la leçon, la maîtresse t\'apprend chaque mot : regarde l\'image et écoute bien.',
  'Répète le mot à voix haute, comme elle, pour t\'en souvenir.',
  'Dans le quiz, touche 🔊 pour réécouter. Si tu te trompes, la bonne réponse s\'allume : retiens-la bien !'
] });

/* ================= Choix des fiches ================= */
const sansBalises = s => String(s || '').replace(/<[^>]+>/g, ' ');
const pourComparer = s => sansBalises(s).toLowerCase().replace(/[’`]/g, '\'').replace(/️/g, '').replace(/\s+/g, ' ').trim();
const EMOJI = /\p{Extended_Pictographic}/u;

// Ce que la fiche ne doit pas montrer : la réponse de la question (et, en anglais, le mot demandé).
function motsInterdits(q, mid, strict, pourExemple, pourListe) {
  const cibles = [];
  const brut = pourComparer(q.bonne), court = brut.replace(/^((le|la|les|un|une|des|du|de|au|aux|à la|à|en|dans la|dans le|dans|sur) |l'|d'|à l')+/, '').trim();
  const b = court.length >= 3 ? court : brut;
  if (/^(est|sont|oui|non|les|des|une|pas|vrai|faux)$/.test(b)) return cibles; // trop courants pour être cachés
  const chiffres = b.replace(/\D/g, '');
  if (EMOJI.test(b) || (/[a-zà-ÿœ]/.test(b) && b.length >= 3) || (/^\d/.test(b) && (strict || pourExemple || pourListe || chiffres.length >= 3))) cibles.push(b);
  const v = pourComparer(q.visuel);
  if (v && [...v.replace(/\s/g, '')].length <= 4 && [...v.replace(/\s/g, '')].every(c => EMOJI.test(c) || /[‍]/.test(c))) cibles.push(v);
  const cite = /«\s*(.+?)\s*»/.exec(sansBalises(q.enonce));
  if ((/anglais/.test(mid) || pourListe) && cite && cite[1].length >= 2) cibles.push(pourComparer(cite[1]));
  return cibles;
}
function contient(ligne, cible) {
  const l = pourComparer(ligne);
  if (EMOJI.test(cible)) return l.includes(cible);
  const i = l.indexOf(cible);
  if (i < 0) return false;
  const avant = l[i - 1], apres = l[i + cible.length];
  const lettre = c => c && /[\wà-ÿœ]/.test(c);
  const pluriel = /[sx]/.test(apres || '') && !lettre(l[i + cible.length + 1]); // têtard → têtards
  return !lettre(avant) && (!lettre(apres) || pluriel) || contient(l.slice(i + 1), cible);
}

// Renvoie les fiches à montrer pour cette question (ou null s'il n'y a pas de cours pour ce jeu).
function fichesCours(q, jeu, m, niveau) {
  const mid = (q.matiere || m || {}).id, jid = (q.jeu || jeu || {}).id;
  const liste = COURS[`${niveau}/${mid}/${jid}`] || COURS[`${niveau}/${mid}`] || COURS[`*/${mid}`];
  if (!liste) return null;
  const enonce = sansBalises(q.enonce) + ' ' + sansBalises(q.avant);
  const tout = enonce + ' ' + (q.choix || []).join(' ');
  let f = liste.filter(x => x.si && x.si.test(enonce));
  if (!f.length) f = liste.filter(x => x.si && !x.surEnonce && x.si.test(tout));
  if (!f.length) f = liste.filter(x => !x.si);
  if (!f.length) f = liste;
  const strict = /quiz|monde|citoyen|espace|temps|jours|dictee|ecrire/.test(jid) || /anglais/.test(mid);
  const interdits = motsInterdits(q, mid, strict), interditsEx = motsInterdits(q, mid, strict, true);
  const interditsListe = motsInterdits(q, mid, strict, false, true);
  const cache = s => interdits.some(c => contient(s, c));
  // Un exemple qui contient le résultat de la question serait la réponse : on le cache.
  const cacheEx = s => interditsEx.some(c => contient(s, c));
  // Une ligne « a · b · c » est une liste : on n'enlève que l'élément qui donnerait la réponse.
  // Une règle (a ou à, parallèles ou perpendiculaires…) ne donne pas la réponse : on la garde entière.
  // Dans les quiz de connaissances, on enlève la phrase qui contient la réponse.
  const garder = l => l.includes(' · ') ? l.split(' · ').filter(x => !interditsListe.some(c => contient(x, c))).join(' · ') : strict && cache(l) ? '' : l;
  f = f.map(x => ({ ...x, l: x.l.map(garder).filter(Boolean), ex: x.ex && !cacheEx(x.ex) ? x.ex : '' })).filter(x => x.l.length);
  return f.length ? f : [{ t: 'Un petit conseil', l: ['Relis bien la question, doucement.', 'Enlève d\'abord les réponses qui sont sûrement fausses.', 'Tu peux toucher 🔊 Écouter pour l\'entendre encore.'] }];
}

// Ouvre la fenêtre du petit cours par-dessus la question. On ne perd rien en l'ouvrant.
function ouvrirCours(p, fiches, lireTout) {
  fermerCours();
  const fen = document.createElement('div');
  fen.className = 'fenetre cours-fenetre';
  fen.innerHTML = `<div class="fenetre-boite cours-boite">
    <div class="cours-tete"><div class="cours-prof">${dessinMaitresse(p.maitresse, 'contente')}</div><div class="cours-titre">📖 Petit cours</div></div>
    ${fiches.map(f => `<section class="fiche"><h3>${typo(f.t)}</h3><ul>${f.l.map(l => `<li>${typo(l)}</li>`).join('')}</ul>${f.ex ? `<div class="exemple"><span>Exemple</span>${typo(f.ex)}</div>` : ''}</section>`).join('')}
    <div class="fenetre-boutons"><button class="bouton second lire-cours">🔊 Écouter</button><button class="bouton fermer-cours">J'ai compris ✓</button></div>
  </div>`;
  document.body.appendChild(fen);
  const aDire = s => sansBalises(s).replace(/\p{Extended_Pictographic}|️|‍/gu, ' ').replace(/ · /g, ', ').replace(/→/g, ', ').replace(/\s+/g, ' ').trim();
  // On lit phrase par phrase : sur Android, une trop longue phrase peut être coupée.
  const phrases = fiches.flatMap(f => [f.t + '.', ...f.l, f.ex ? 'Par exemple : ' + f.ex : ''].map(aDire).filter(Boolean));
  const lire = () => {
    taire();
    const file = phrases.slice();
    const suite = () => { const x = file.shift(); if (x && fen.isConnected) parler(x, 'fr-FR', suite); };
    suite();
  };
  fen.querySelector('.lire-cours').onclick = lire;
  fen.querySelector('.fermer-cours').onclick = () => { son('tic'); fermerCours(); };
  fen.onclick = e => { if (e.target === fen) fermerCours(); };
  if (lireTout) setTimeout(lire, 300);
}
function fermerCours() {
  const f = document.querySelector('.cours-fenetre');
  if (f) { f.remove(); taire(); }
}
