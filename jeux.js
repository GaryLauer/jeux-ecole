// Contenu des jeux : matières, jeux et générateurs de questions.
// Chaque question : { visuel, enonce, choix: [...], bonne, dire, direEn, aide }

const alea = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pioche = arr => arr[Math.floor(Math.random() * arr.length)];
const melange = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const uniques = arr => [...new Set(arr.map(String))];

// Construit une question à choix : la bonne réponse + des mauvaises (sans doublon).
function qcm(base, bonne, fausses, nb = 4) {
  const f = uniques(fausses).filter(x => x !== String(bonne));
  const choix = melange([String(bonne), ...melange(f).slice(0, nb - 1)]);
  return { ...base, choix, bonne: String(bonne) };
}
// Réponses numériques proches de la bonne.
function voisins(n, ecart = 3, min = 0) {
  const s = new Set();
  let essais = 0;
  while (s.size < 3 && essais++ < 50) { const v = n + alea(-ecart, ecart); if (v !== n && v >= min) s.add(v); }
  return [...s];
}
// Tire une question d'une liste fixe, sans répéter dans la partie.
function depuisListe(liste) {
  let restant = [];
  return () => {
    if (!restant.length) restant = melange(liste);
    const it = restant.pop();
    return qcm({ visuel: it.v || '', enonce: it.q, dire: it.q }, it.b, it.f);
  };
}

/* ---------------- CP ---------------- */
const OBJETS = ['🍎', '⭐', '🐟', '🎈', '🚗', '🌸', '🐞', '⚽', '🍓', '🐥'];

const MOTS_CP = [
  ['chat', '🐱'], ['lion', '🦁'], ['pomme', '🍎'], ['banane', '🍌'], ['soleil', '☀️'], ['maison', '🏠'],
  ['vache', '🐄'], ['poisson', '🐟'], ['fraise', '🍓'], ['tomate', '🍅'], ['robot', '🤖'], ['lune', '🌙'],
  ['gâteau', '🎂'], ['arbre', '🌳'], ['oiseau', '🐦'], ['nuage', '☁️'], ['dauphin', '🐬'], ['zèbre', '🦓'],
  ['kiwi', '🥝'], ['renard', '🦊'], ['tortue', '🐢'], ['cheval', '🐴'], ['lapin', '🐰'], ['souris', '🐭'],
  ['carotte', '🥕'], ['bateau', '⛵'], ['avion', '✈️'], ['train', '🚆'], ['fleur', '🌸'], ['mouton', '🐑'],
  ['cochon', '🐷'], ['pizza', '🍕'], ['girafe', '🦒'], ['hibou', '🦉'], ['escargot', '🐌'], ['citron', '🍋'],
  ['ours', '🐻'], ['vélo', '🚲'], ['ballon', '⚽'], ['papillon', '🦋'], ['loup', '🐺'], ['pain', '🍞']
];
const SYLLABES = [
  ['chat', '🐱', 1], ['ours', '🐻', 1], ['train', '🚆', 1], ['loup', '🐺', 1], ['pain', '🍞', 1], ['lit', '🛏️', 1],
  ['lapin', '🐰', 2], ['bateau', '⛵', 2], ['cochon', '🐷', 2], ['robot', '🤖', 2], ['gâteau', '🎂', 2], ['kiwi', '🥝', 2],
  ['crayon', '✏️', 2], ['soleil', '☀️', 2], ['poisson', '🐟', 2], ['mouton', '🐑', 2], ['hibou', '🦉', 2], ['citron', '🍋', 2],
  ['ananas', '🍍', 3], ['chocolat', '🍫', 3], ['éléphant', '🐘', 3], ['papillon', '🦋', 3], ['escargot', '🐌', 3],
  ['pantalon', '👖', 3], ['kangourou', '🦘', 3], ['ordinateur', '💻', 4], ['télévision', '📺', 4]
];
const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

const MONDE_CP = [
  { q: 'Avec quoi entend-on ?', b: '👂', f: ['👁️', '👃', '👅'] },
  { q: 'Avec quoi voit-on ?', b: '👁️', f: ['👂', '👃', '✋'] },
  { q: 'Avec quoi sent-on les odeurs ?', b: '👃', f: ['👂', '👁️', '👅'] },
  { q: 'Avec quoi goûte-t-on ?', b: '👅', f: ['👂', '👃', '✋'] },
  { q: 'Quel animal donne du lait ?', b: '🐄', f: ['🐷', '🐔', '🐟'] },
  { q: 'Quel animal pond des œufs ?', b: '🐔', f: ['🐄', '🐶', '🐱'] },
  { q: 'Quel animal vit dans la mer ?', b: '🐬', f: ['🐄', '🦒', '🐿️'] },
  { q: 'Quel animal fait « miaou » ?', b: '🐱', f: ['🐶', '🐄', '🐑'] },
  { q: 'Le poussin est le bébé de quel animal ?', b: '🐔', f: ['🐄', '🐱', '🦆'] },
  { q: 'Que met-on quand il pleut ?', b: '☂️', f: ['🕶️', '🩳', '👙'] },
  { q: 'Quand l\'eau gèle, elle devient…', b: '🧊', f: ['🔥', '☁️', '🌈'] },
  { q: 'En quelle saison neige-t-il le plus ?', v: '❄️⛄', b: 'l\'hiver', f: ['l\'été', 'le printemps', 'l\'automne'] },
  { q: 'En quelle saison les feuilles tombent-elles des arbres ?', v: '🍂', b: 'l\'automne', f: ['l\'été', 'le printemps', 'l\'hiver'] },
  { q: 'En quelle saison fait-il le plus chaud ?', v: '☀️🏖️', b: 'l\'été', f: ['l\'hiver', 'le printemps', 'l\'automne'] },
  { q: 'En quelle saison les fleurs repoussent-elles ?', v: '🌷🌱', b: 'le printemps', f: ['l\'hiver', 'l\'été', 'l\'automne'] },
  { q: 'Combien y a-t-il de jours dans une semaine ?', v: '📅', b: '7', f: ['5', '10', '12'] },
  { q: 'Combien y a-t-il de mois dans une année ?', v: '🗓️', b: '12', f: ['7', '10', '30'] },
  { q: 'Combien de doigts as-tu sur une main ?', v: '✋', b: '5', f: ['4', '6', '10'] },
  { q: 'Quand faut-il se laver les mains ?', v: '🧼', b: 'avant de manger', f: ['jamais', 'une fois par an', 'seulement le dimanche'] },
  { q: 'De quoi une plante a-t-elle besoin pour pousser ?', v: '🌱', b: 'd\'eau et de lumière', f: ['de bonbons', 'de chocolat', 'de rien du tout'] },
  { q: 'Qu\'est-ce qui est vivant ?', b: '🌳', f: ['🪨', '🚗', '⚽'] },
  { q: 'Qu\'est-ce qu\'on voit dans le ciel la nuit ?', b: '🌙', f: ['🌈', '☀️', '🦋'] },
  { q: 'Quel aliment est un fruit ?', b: '🍎', f: ['🥕', '🧀', '🥖'] },
  { q: 'Quel aliment est un légume ?', b: '🥕', f: ['🍌', '🍫', '🍓'] }
];

const ANGLAIS_CP = [
  ['red', '🔴', 'rouge'], ['blue', '🔵', 'bleu'], ['green', '🟢', 'vert'], ['yellow', '🟡', 'jaune'],
  ['orange', '🟠', 'orange'], ['purple', '🟣', 'violet'], ['black', '⚫', 'noir'], ['white', '⚪', 'blanc'],
  ['cat', '🐱', 'chat'], ['dog', '🐶', 'chien'], ['bird', '🐦', 'oiseau'], ['fish', '🐟', 'poisson'],
  ['horse', '🐴', 'cheval'], ['cow', '🐄', 'vache'], ['apple', '🍎', 'pomme'], ['banana', '🍌', 'banane'],
  ['sun', '☀️', 'soleil'], ['house', '🏠', 'maison'], ['car', '🚗', 'voiture'], ['ball', '⚽', 'ballon']
];
const NOMBRES_EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/* ---------------- CM1 ---------------- */
const PRONOMS = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
const VERBES = {
  'chanter': { present: ['chante', 'chantes', 'chante', 'chantons', 'chantez', 'chantent'], imp: 'chant', fut: 'chanter' },
  'jouer': { present: ['joue', 'joues', 'joue', 'jouons', 'jouez', 'jouent'], imp: 'jou', fut: 'jouer' },
  'finir': { present: ['finis', 'finis', 'finit', 'finissons', 'finissez', 'finissent'], imp: 'finiss', fut: 'finir' },
  'être': { present: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'], imp: 'ét', fut: 'ser' },
  'avoir': { present: ['ai', 'as', 'a', 'avons', 'avez', 'ont'], imp: 'av', fut: 'aur' },
  'aller': { present: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'], imp: 'all', fut: 'ir' },
  'faire': { present: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'], imp: 'fais', fut: 'fer' },
  'venir': { present: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'], imp: 'ven', fut: 'viendr' },
  'prendre': { present: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'], imp: 'pren', fut: 'prendr' },
  'dire': { present: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'], imp: 'dis', fut: 'dir' },
  'pouvoir': { present: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'], imp: 'pouv', fut: 'pourr' },
  'voir': { present: ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'], imp: 'voy', fut: 'verr' },
  'vouloir': { present: ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'], imp: 'voul', fut: 'voudr' }
};
const FIN_IMP = ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'];
const FIN_FUT = ['ai', 'as', 'a', 'ons', 'ez', 'ont'];
const TEMPS = { present: 'présent', imparfait: 'imparfait', futur: 'futur' };
function forme(verbe, temps, p) {
  const v = VERBES[verbe];
  if (temps === 'present') return v.present[p];
  if (temps === 'imparfait') return v.imp + FIN_IMP[p];
  return v.fut + FIN_FUT[p];
}
function avecPronom(p, f) {
  if (p === 0 && /^[aeiouéèêh]/.test(f)) return 'j\'' + f;
  return PRONOMS[p] + ' ' + f;
}

const HOMOPHONES = [
  ['Léo ___ un vélo rouge.', 'a', 'à'], ['Je vais ___ la piscine.', 'à', 'a'], ['Elle ___ mangé une pomme.', 'a', 'à'],
  ['Il habite ___ Paris.', 'à', 'a'], ['Mon frère ___ neuf ans.', 'a', 'à'], ['Nous jouons ___ la balle.', 'à', 'a'],
  ['Le chat ___ noir.', 'est', 'et'], ['J\'aime les pommes ___ les poires.', 'et', 'est'], ['Papa ___ en retard.', 'est', 'et'],
  ['Il court ___ il saute.', 'et', 'est'], ['La soupe ___ chaude.', 'est', 'et'],
  ['Les enfants ___ à l\'école.', 'sont', 'son'], ['Il range ___ cartable.', 'son', 'sont'], ['Mes amis ___ gentils.', 'sont', 'son'],
  ['Elle promène ___ chien.', 'son', 'sont'], ['Les oiseaux ___ faim.', 'ont', 'on'], ['___ va au parc demain.', 'On', 'Ont'],
  ['Mes parents ___ une voiture.', 'ont', 'on'], ['Ce soir, ___ mange des crêpes.', 'on', 'ont'],
  ['___ as-tu mis ton manteau ?', 'Où', 'Ou'], ['Tu veux du lait ___ du jus ?', 'ou', 'où']
];
const NATURE = [
  ['Le PETIT chat dort.', 'adjectif'], ['Le petit chat DORT.', 'verbe'], ['LE petit chat dort.', 'déterminant'],
  ['Le petit CHAT dort.', 'nom'], ['Ma sœur LIT un livre.', 'verbe'], ['Nous mangeons une pomme ROUGE.', 'adjectif'],
  ['Les ENFANTS jouent dans la cour.', 'nom'], ['CETTE maison est grande.', 'déterminant'], ['Le chien ABOIE fort.', 'verbe'],
  ['Un GRAND arbre pousse ici.', 'adjectif'], ['Mon père répare la VOITURE.', 'nom'], ['IL chante bien.', 'pronom'],
  ['ELLES dansent dans le salon.', 'pronom'], ['MES crayons sont neufs.', 'déterminant'], ['La mer est CALME.', 'adjectif'],
  ['Les élèves ÉCRIVENT une lettre.', 'verbe'], ['NOUS partons en vacances.', 'pronom'], ['La MAÎTRESSE sourit.', 'nom']
];
const PLURIELS = [
  ['un cheval', 'des chevaux', ['des chevals', 'des chevaus']], ['un journal', 'des journaux', ['des journals', 'des journauxs']],
  ['un bijou', 'des bijoux', ['des bijous', 'des bijeaux']], ['un chou', 'des choux', ['des chous', 'des chouxs']],
  ['un genou', 'des genoux', ['des genous', 'des genouxs']], ['un clou', 'des clous', ['des cloux', 'des clouxs']],
  ['un bateau', 'des bateaux', ['des bateaus', 'des bateau']], ['un jeu', 'des jeux', ['des jeus', 'des jeu']],
  ['un pneu', 'des pneus', ['des pneux', 'des pneu']], ['un feu', 'des feux', ['des feus', 'des feu']],
  ['un nez', 'des nez', ['des nezs', 'des nes']], ['une souris', 'des souris', ['des souriss', 'des sourix']],
  ['un oiseau', 'des oiseaux', ['des oiseaus', 'des oiseau']], ['un festival', 'des festivals', ['des festivaux', 'des festivales']],
  ['un travail', 'des travaux', ['des travails', 'des travailles']], ['un œil', 'des yeux', ['des œils', 'des œuils']]
];

const HISTOIRE = [
  { q: 'Comment appelle-t-on les habitants de la Gaule avant les Romains ?', b: 'Les Gaulois', f: ['Les Vikings', 'Les Francs', 'Les Grecs'] },
  { q: 'Quel chef gaulois a combattu Jules César ?', b: 'Vercingétorix', f: ['Clovis', 'Charlemagne', 'Louis XIV'] },
  { q: 'En quelle année a eu lieu la bataille d\'Alésia ?', b: '52 av. J.-C.', f: ['800', '1515', '1789'] },
  { q: 'Quel roi des Francs s\'est fait baptiser vers l\'an 500 ?', b: 'Clovis', f: ['Henri IV', 'Charlemagne', 'Louis XVI'] },
  { q: 'Qui a été couronné empereur en l\'an 800 ?', b: 'Charlemagne', f: ['Clovis', 'Napoléon', 'François Ier'] },
  { q: 'Comment s\'appelle la période des châteaux forts et des chevaliers ?', b: 'Le Moyen Âge', f: ['La Préhistoire', 'L\'Antiquité', 'Aujourd\'hui'] },
  { q: 'Les peintures de la grotte de Lascaux datent de…', v: '🦬', b: 'la Préhistoire', f: ['le Moyen Âge', 'la Révolution', 'l\'Antiquité romaine'] },
  { q: 'Quelle jeune femme a mené les armées françaises pendant la guerre de Cent Ans ?', b: 'Jeanne d\'Arc', f: ['Marie-Antoinette', 'Catherine de Médicis', 'Marie Curie'] },
  { q: 'Quel roi est surnommé « Saint Louis » ?', b: 'Louis IX', f: ['Louis XIV', 'Louis XVI', 'Henri IV'] },
  { q: 'Quel roi a gagné la bataille de Marignan en 1515 ?', b: 'François Ier', f: ['Louis XIV', 'Clovis', 'Henri IV'] },
  { q: 'Quel roi a signé l\'édit de Nantes en 1598 pour la paix entre catholiques et protestants ?', b: 'Henri IV', f: ['Louis IX', 'François Ier', 'Charlemagne'] },
  { q: 'Quel roi était surnommé le « Roi-Soleil » ?', v: '☀️👑', b: 'Louis XIV', f: ['Louis IX', 'Henri IV', 'Clovis'] },
  { q: 'Quel château Louis XIV a-t-il fait agrandir ?', v: '🏰', b: 'Versailles', f: ['Chambord', 'Carcassonne', 'le Louvre'] },
  { q: 'Quelle invention de Gutenberg a permis de fabriquer beaucoup de livres ?', v: '📚', b: 'L\'imprimerie', f: ['Le téléphone', 'La télévision', 'L\'ordinateur'] },
  { q: 'En quelle année Christophe Colomb arrive-t-il en Amérique ?', v: '⛵', b: '1492', f: ['800', '1789', '1914'] },
  { q: 'En quelle année commence la Révolution française ?', b: '1789', f: ['1515', '1492', '1914'] },
  { q: 'Que s\'est-il passé le 14 juillet 1789 ?', b: 'La prise de la Bastille', f: ['Le baptême de Clovis', 'La bataille d\'Alésia', 'Le sacre de Charlemagne'] },
  { q: 'Quelle est la devise de la République française ?', v: '🇫🇷', b: 'Liberté, Égalité, Fraternité', f: ['Un pour tous, tous pour un', 'Force et honneur', 'Paix et amour'] },
  { q: 'À quoi servaient les aqueducs construits par les Romains ?', b: 'À transporter l\'eau', f: ['À se défendre', 'À faire du commerce', 'À prier'] },
  { q: 'Qui vivait dans un château fort au Moyen Âge ?', v: '🏰', b: 'Le seigneur', f: ['Le pharaon', 'Le président', 'L\'empereur romain'] }
];
const GEOGRAPHIE = [
  { q: 'Quelle est la capitale de la France ?', v: '🇫🇷', b: 'Paris', f: ['Lyon', 'Marseille', 'Toulouse'] },
  { q: 'Quel est le plus long fleuve de France ?', b: 'La Loire', f: ['La Seine', 'Le Rhône', 'La Garonne'] },
  { q: 'Quel fleuve traverse Paris ?', b: 'La Seine', f: ['La Loire', 'Le Rhône', 'La Garonne'] },
  { q: 'Quel fleuve passe à Lyon et se jette dans la mer Méditerranée ?', b: 'Le Rhône', f: ['La Seine', 'La Loire', 'La Garonne'] },
  { q: 'Quelle est la plus haute montagne de France ?', v: '🏔️', b: 'Le mont Blanc', f: ['Le mont Saint-Michel', 'Le puy de Dôme', 'Le Vignemale'] },
  { q: 'Dans quelles montagnes se trouve le mont Blanc ?', v: '🏔️', b: 'Les Alpes', f: ['Les Pyrénées', 'Le Massif central', 'Les Vosges'] },
  { q: 'Quelles montagnes séparent la France et l\'Espagne ?', b: 'Les Pyrénées', f: ['Les Alpes', 'Le Jura', 'Les Vosges'] },
  { q: 'Quelle mer borde le sud de la France ?', v: '🌊', b: 'La mer Méditerranée', f: ['La mer du Nord', 'La mer Rouge', 'La mer Noire'] },
  { q: 'Quel océan borde l\'ouest de la France ?', v: '🌊', b: 'L\'océan Atlantique', f: ['L\'océan Pacifique', 'L\'océan Indien', 'L\'océan Arctique'] },
  { q: 'Sur quel continent se trouve la France ?', v: '🌍', b: 'L\'Europe', f: ['L\'Afrique', 'L\'Asie', 'L\'Amérique'] },
  { q: 'Quel est le plus grand océan du monde ?', v: '🌏', b: 'L\'océan Pacifique', f: ['L\'océan Atlantique', 'L\'océan Indien', 'La mer Méditerranée'] },
  { q: 'Quel pays est voisin de la France ?', b: 'L\'Espagne', f: ['Le Portugal', 'La Pologne', 'La Suède'] },
  { q: 'Combien y a-t-il de régions en France métropolitaine ?', b: '13', f: ['5', '22', '101'] },
  { q: 'Quelle grande île française se trouve dans la mer Méditerranée ?', v: '🏝️', b: 'La Corse', f: ['La Martinique', 'La Réunion', 'La Guadeloupe'] },
  { q: 'Sur une carte, où se trouve le nord ?', v: '🧭', b: 'En haut', f: ['En bas', 'À gauche', 'À droite'] },
  { q: 'De quel côté le soleil se lève-t-il ?', v: '🌅', b: 'À l\'est', f: ['À l\'ouest', 'Au nord', 'Au sud'] },
  { q: 'Au bord de quelle mer se trouve Marseille ?', b: 'La Méditerranée', f: ['La Manche', 'La mer du Nord', 'L\'Atlantique'] },
  { q: 'Comment s\'appelle le dessin d\'un lieu vu de dessus, comme un quartier ?', v: '🗺️', b: 'Un plan', f: ['Un portrait', 'Un paysage', 'Une frise'] },
  { q: 'Dans quelle région se trouve Paris ?', b: 'L\'Île-de-France', f: ['La Bretagne', 'La Normandie', 'L\'Occitanie'] }
];
const SCIENCES = [
  { q: 'À quelle température l\'eau gèle-t-elle ?', v: '🧊', b: '0 °C', f: ['10 °C', '50 °C', '100 °C'] },
  { q: 'À quelle température l\'eau bout-elle ?', v: '♨️', b: '100 °C', f: ['0 °C', '37 °C', '50 °C'] },
  { q: 'Comment s\'appelle l\'eau à l\'état solide ?', b: 'La glace', f: ['La vapeur', 'La pluie', 'Le brouillard'] },
  { q: 'Comment s\'appelle l\'eau à l\'état gazeux ?', b: 'La vapeur d\'eau', f: ['La glace', 'La neige', 'La grêle'] },
  { q: 'Quand la glace devient liquide, on parle de…', b: 'fusion', f: ['solidification', 'évaporation', 'condensation'] },
  { q: 'Quand l\'eau liquide devient de la glace, on parle de…', b: 'solidification', f: ['fusion', 'évaporation', 'ébullition'] },
  { q: 'Un animal qui ne mange que des plantes est…', v: '🐄', b: 'herbivore', f: ['carnivore', 'omnivore', 'insectivore'] },
  { q: 'Un animal qui mange de la viande est…', v: '🦁', b: 'carnivore', f: ['herbivore', 'végétarien', 'frugivore'] },
  { q: 'Dans la chaîne herbe → lapin → renard, qui mange le lapin ?', b: 'Le renard', f: ['L\'herbe', 'Le lapin', 'Personne'] },
  { q: 'Quel organe pompe le sang dans le corps ?', v: '🫀', b: 'Le cœur', f: ['Les poumons', 'L\'estomac', 'Le cerveau'] },
  { q: 'Avec quels organes respire-t-on ?', v: '🫁', b: 'Les poumons', f: ['Le cœur', 'Les reins', 'Le foie'] },
  { q: 'Comment s\'appelle l\'ensemble des os du corps ?', v: '🦴', b: 'Le squelette', f: ['Les muscles', 'La peau', 'Le sang'] },
  { q: 'Quelles dents servent à broyer les aliments ?', v: '🦷', b: 'Les molaires', f: ['Les incisives', 'Les canines', 'Les gencives'] },
  { q: 'Combien de temps met la Terre pour faire le tour du Soleil ?', v: '🌍☀️', b: 'Un an', f: ['Un jour', 'Un mois', 'Une semaine'] },
  { q: 'Combien de temps met la Terre pour tourner sur elle-même ?', v: '🌍', b: 'Un jour (24 h)', f: ['Une heure', 'Un an', 'Un mois'] },
  { q: 'La Lune est…', v: '🌙', b: 'un satellite de la Terre', f: ['une étoile', 'une planète', 'un soleil'] },
  { q: 'Quelle énergie est renouvelable ?', b: 'Le vent', f: ['Le pétrole', 'Le charbon', 'Le gaz'] },
  { q: 'Qu\'est-ce qu\'un aimant attire ?', v: '🧲', b: 'Le fer', f: ['Le bois', 'Le plastique', 'Le papier'] },
  { q: 'Quel matériau laisse passer l\'électricité ?', v: '💡', b: 'Le cuivre', f: ['Le bois', 'Le plastique', 'Le verre'] },
  { q: 'Quel insecte transporte le pollen de fleur en fleur ?', v: '🌼', b: 'L\'abeille', f: ['La fourmi', 'Le moustique', 'La coccinelle'] },
  { q: 'De quoi les plantes vertes ont-elles besoin pour fabriquer leur nourriture ?', v: '🌿', b: 'De lumière', f: ['De sucre', 'De viande', 'De sel'] }
];
const ANGLAIS_CM1 = [
  ['chien', 'dog'], ['chat', 'cat'], ['cheval', 'horse'], ['oiseau', 'bird'], ['lapin', 'rabbit'],
  ['lundi', 'Monday'], ['mercredi', 'Wednesday'], ['vendredi', 'Friday'], ['dimanche', 'Sunday'],
  ['rouge', 'red'], ['vert', 'green'], ['jaune', 'yellow'], ['bleu', 'blue'],
  ['mère', 'mother'], ['père', 'father'], ['frère', 'brother'], ['sœur', 'sister'],
  ['pain', 'bread'], ['lait', 'milk'], ['eau', 'water'], ['pomme', 'apple'],
  ['école', 'school'], ['livre', 'book'], ['crayon', 'pencil'], ['maison', 'house'],
  ['bonjour', 'hello'], ['merci', 'thank you'], ['au revoir', 'goodbye'],
  ['douze', 'twelve'], ['quinze', 'fifteen'], ['vingt', 'twenty'], ['treize', 'thirteen']
];

/* ---------------- Catalogue ---------------- */
const NIVEAUX = {
  CP: {
    nom: 'CP', lecture: true, matieres: [
      {
        id: 'maths', titre: 'Maths', emoji: '🔢', couleur: '#4f8ef7', jeux: [
          { id: 'compter', titre: 'Compter', emoji: '🍎', gen: () => {
            const n = alea(1, 10), o = pioche(OBJETS);
            return qcm({ visuel: o.repeat(n), enonce: 'Combien y en a-t-il ?', dire: 'Combien y en a-t-il ?' }, n, voisins(n, 2, 1));
          } },
          { id: 'additions', titre: 'Additions', emoji: '➕', gen: () => {
            const a = alea(1, 6), b = alea(1, 10 - a), o = pioche(OBJETS);
            return qcm({ visuel: `${o.repeat(a)} + ${o.repeat(b)}`, enonce: `${a} + ${b} = ?`, dire: `${a} plus ${b}, ça fait combien ?` }, a + b, voisins(a + b, 2));
          } },
          { id: 'soustractions', titre: 'Soustractions', emoji: '➖', gen: () => {
            const a = alea(2, 10), b = alea(1, a);
            return qcm({ visuel: '🍪'.repeat(a - b) + '<span style="opacity:.25">' + '🍪'.repeat(b) + '</span>', enonce: `${a} − ${b} = ?`, dire: `${a} moins ${b}, ça fait combien ?`, aide: `Il y avait ${a} biscuits, on en mange ${b}.` }, a - b, voisins(a - b, 2));
          } },
          { id: 'comparer', titre: 'Le plus grand', emoji: '🐊', gen: () => {
            const a = alea(0, 99); let b; do { b = alea(0, 99); } while (b === a);
            return { visuel: '🐊', enonce: 'Quel est le plus grand nombre ?', dire: 'Touche le plus grand nombre.', choix: melange([String(a), String(b)]), bonne: String(Math.max(a, b)) };
          } },
          { id: 'suite', titre: 'Le nombre d\'après', emoji: '👣', gen: () => {
            const n = alea(0, 98);
            return qcm({ visuel: `${n} ➜ ?`, enonce: `Quel nombre vient après ${n} ?`, dire: `Quel nombre vient après ${n} ?` }, n + 1, [n - 1, n + 2, n + 10].filter(x => x >= 0));
          } },
          { id: 'dizaines', titre: 'Dizaines et unités', emoji: '🧱', gen: () => {
            const d = alea(1, 9), u = alea(0, 9), n = d * 10 + u;
            return qcm({ visuel: '🟦'.repeat(d) + ' ' + '▫️'.repeat(u), enonce: `Combien de dizaines dans ${n} ?`, dire: `Combien de dizaines dans ${n} ?`, aide: 'Une barre bleue = 10' }, d, [u, n, d + 1, d - 1].filter(x => x >= 0));
          } }
        ]
      },
      {
        id: 'francais', titre: 'Lecture', emoji: '📖', couleur: '#e5484d', jeux: [
          { id: 'lettre', titre: 'La première lettre', emoji: '🔤', gen: () => {
            const [mot, e] = pioche(MOTS_CP);
            const l = mot[0].normalize('NFD')[0].toUpperCase();
            const fausses = melange('ABCDEFGHIJKLMNOPRSTUVZ'.split('').filter(x => x !== l));
            return qcm({ visuel: e, enonce: 'Par quelle lettre commence ce mot ?', dire: `Par quelle lettre commence le mot ${mot} ?` }, l, fausses);
          } },
          { id: 'lire', titre: 'Lire le bon mot', emoji: '👓', gen: () => {
            const [mot, e] = pioche(MOTS_CP);
            return qcm({ visuel: e, enonce: 'Quel est le bon mot ?', dire: 'Regarde l\'image. Quel est le bon mot ?' }, mot, MOTS_CP.map(m => m[0]).filter(m => m !== mot));
          } },
          { id: 'syllabes', titre: 'Taper les syllabes', emoji: '👏', gen: () => {
            const [mot, e, n] = pioche(SYLLABES);
            return qcm({ visuel: e, enonce: `Combien de syllabes dans « ${mot} » ?`, dire: `Tape dans tes mains : ${mot}. Combien de syllabes ?` }, n, [1, 2, 3, 4]);
          } },
          { id: 'ecoute', titre: 'Écoute et trouve', emoji: '👂', gen: () => {
            const [mot, e] = pioche(MOTS_CP);
            const autres = melange(MOTS_CP.filter(m => m[0] !== mot)).slice(0, 3).map(m => m[1]);
            return { visuel: '🔊', enonce: 'Écoute bien et touche la bonne image.', dire: `Touche : ${mot}.`, choix: melange([e, ...autres]), bonne: e };
          } }
        ]
      },
      {
        id: 'monde', titre: 'Le monde', emoji: '🌍', couleur: '#3bb273', jeux: [
          { id: 'quiz-monde', titre: 'Nature et corps', emoji: '🌱', gen: depuisListe(MONDE_CP) },
          { id: 'jours', titre: 'Jours et mois', emoji: '📅', gen: () => {
            if (Math.random() < .6) {
              const i = alea(0, 6), j = JOURS[i];
              return qcm({ visuel: '📅', enonce: `Quel jour vient après ${j} ?`, dire: `Quel jour vient après ${j} ?` }, JOURS[(i + 1) % 7], JOURS);
            }
            const i = alea(0, 11), m = MOIS[i];
            return qcm({ visuel: '🗓️', enonce: `Quel mois vient après ${m} ?`, dire: `Quel mois vient après ${m} ?` }, MOIS[(i + 1) % 12], MOIS);
          } }
        ]
      },
      {
        id: 'anglais', titre: 'Anglais', emoji: '🇬🇧', couleur: '#8e5cd9', jeux: [
          { id: 'mots-en', titre: 'Listen!', emoji: '🎧', gen: () => {
            const [en, e] = pioche(ANGLAIS_CP);
            const autres = melange(ANGLAIS_CP.filter(x => x[0] !== en)).slice(0, 3).map(x => x[1]);
            return { visuel: '🔊', enonce: `Écoute : « ${en} »`, dire: 'Écoute, et touche la bonne image :', direEn: en, choix: melange([e, ...autres]), bonne: e };
          } },
          { id: 'nombres-en', titre: 'Numbers', emoji: '🔟', gen: () => {
            const n = alea(1, 10);
            return { ...qcm({ visuel: '🔊', enonce: `Écoute : « ${NOMBRES_EN[n]} »`, dire: 'Écoute, et touche le bon nombre :', direEn: NOMBRES_EN[n] }, n, voisins(n, 3, 1)) };
          } }
        ]
      }
    ]
  },
  CM1: {
    nom: 'CM1', lecture: false, matieres: [
      {
        id: 'maths', titre: 'Maths', emoji: '🔢', couleur: '#4f8ef7', jeux: [
          { id: 'tables', titre: 'Tables de multiplication', emoji: '✖️', gen: () => {
            const a = alea(2, 10), b = alea(2, 10), r = a * b;
            return qcm({ visuel: '🧮', enonce: `${a} × ${b} = ?` }, r, [r + a, r - a, r + b, r - b, (a + 1) * (b + 1)].filter(x => x > 0));
          } },
          { id: 'divisions', titre: 'Divisions', emoji: '➗', gen: () => {
            const b = alea(2, 9), q = alea(2, 10);
            return qcm({ visuel: '🍬', enonce: `${b * q} ÷ ${b} = ?`, aide: `Pense à la table de ${b}.` }, q, voisins(q, 2, 1));
          } },
          { id: 'grands-nombres', titre: 'Grands nombres', emoji: '🔭', gen: () => {
            const n = alea(10000, 999999), s = String(n);
            const rangs = [['unités', 1], ['dizaines', 2], ['centaines', 3], ['unités de mille', 4], ['dizaines de mille', 5]];
            const [nom, pos] = pioche(rangs), bon = s[s.length - pos];
            const affiche = s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            return qcm({ visuel: affiche, enonce: `Quel est le chiffre des ${nom} ?` }, bon, [...s.split(''), '0', '1', '5', '9']);
          } },
          { id: 'fractions', titre: 'Fractions', emoji: '🍕', gen: () => {
            const d = alea(2, 8), k = alea(1, d - 1);
            return qcm({ visuel: '🟧'.repeat(k) + '⬜'.repeat(d - k), enonce: 'Quelle fraction est coloriée en orange ?' }, `${k}/${d}`, [`${d - k}/${d}`, `${d}/${k}`, `${k}/${d + 1}`, `${k}/${d - k}`]);
          } },
          { id: 'mesures', titre: 'Mesures', emoji: '📏', gen: () => {
            const c = pioche([['m', 'cm', 100], ['km', 'm', 1000], ['kg', 'g', 1000], ['h', 'min', 60], ['L', 'cL', 100], ['m', 'mm', 1000]]);
            const n = alea(2, 9), r = n * c[2];
            return qcm({ visuel: '📏', enonce: `${n} ${c[0]} = ? ${c[1]}` }, r, [n * 10, r * 10, r / 10, n * 100, n * 1000].filter(x => x !== r && Number.isInteger(x)));
          } },
          { id: 'problemes', titre: 'Problèmes', emoji: '🧠', gen: () => {
            const t = alea(0, 3);
            if (t === 0) { const a = alea(20, 60), b = alea(5, 19); return qcm({ visuel: '🔵', enonce: `Lina a ${a} billes. Elle en donne ${b} à son frère. Combien lui en reste-t-il ?` }, a - b, [a + b, a - b + 10, a - b - 1, a - b + 1]); }
            if (t === 1) { const a = alea(3, 9), b = alea(3, 9); return qcm({ visuel: '🍪', enonce: `Un paquet contient ${a} gâteaux. Combien de gâteaux y a-t-il dans ${b} paquets ?` }, a * b, [a + b, a * b + a, a * b - b, a * (b - 1)]); }
            if (t === 2) { const n = alea(2, 6), q = alea(3, 9); return qcm({ visuel: '🍬', enonce: `On partage ${n * q} bonbons entre ${n} enfants. Combien de bonbons chaque enfant reçoit-il ?` }, q, [q + 1, q - 1, n * q - n, q + n]); }
            const a = alea(8, 25), b = alea(2, 9), c = alea(1, 5);
            return qcm({ visuel: '🛒', enonce: `Un livre coûte ${a} €, un stylo ${b} € et une gomme ${c} €. Combien paie-t-on en tout ?` }, a + b + c, [a + b, a + b + c + 1, a + b + c - 1, a + b + c + 10]);
          } }
        ]
      },
      {
        id: 'francais', titre: 'Français', emoji: '✏️', couleur: '#e5484d', jeux: [
          { id: 'conjugaison', titre: 'Conjugaison', emoji: '⏳', gen: () => {
            const v = pioche(Object.keys(VERBES)), t = pioche(Object.keys(TEMPS)), p = alea(0, 5);
            const bon = avecPronom(p, forme(v, t, p));
            const fausses = [];
            Object.keys(TEMPS).forEach(t2 => { if (t2 !== t) fausses.push(avecPronom(p, forme(v, t2, p))); });
            [0, 1, 2, 3, 4, 5].forEach(p2 => { const f = forme(v, t, p2); if (f !== forme(v, t, p)) fausses.push(avecPronom(p, f)); });
            return qcm({ visuel: '⏳', enonce: `« ${v} » au ${TEMPS[t]}, avec « ${PRONOMS[p]} »` }, bon, fausses);
          } },
          { id: 'homophones', titre: 'a/à, et/est…', emoji: '🔀', gen: () => {
            const [phrase, bon, faux] = pioche(HOMOPHONES);
            return { visuel: '✍️', enonce: phrase, choix: melange([bon, faux]), bonne: bon };
          } },
          { id: 'nature', titre: 'Nature des mots', emoji: '🏷️', gen: () => {
            const [phrase, bon] = pioche(NATURE);
            const html = phrase.replace(/([A-ZÀÂÉÈÊÎÔÛÇ]{2,})/, m => `<u>${m.toLowerCase()}</u>`);
            return qcm({ visuel: '🏷️', enonce: `Quelle est la nature du mot souligné ?<br><span style="font-weight:normal">${html}</span>` }, bon, ['nom', 'verbe', 'adjectif', 'déterminant', 'pronom']);
          } },
          { id: 'pluriels', titre: 'Les pluriels', emoji: '👯', gen: () => {
            const [sing, bon, faux] = pioche(PLURIELS);
            return qcm({ visuel: '👯', enonce: `Quel est le pluriel de « ${sing} » ?` }, bon, faux, 3);
          } }
        ]
      },
      { id: 'histoire', titre: 'Histoire', emoji: '🏰', couleur: '#c77d2e', jeux: [{ id: 'quiz-histoire', titre: 'Quiz d\'histoire', emoji: '📜', gen: depuisListe(HISTOIRE) }] },
      { id: 'geo', titre: 'Géographie', emoji: '🗺️', couleur: '#1fa5a5', jeux: [{ id: 'quiz-geo', titre: 'Quiz de géographie', emoji: '🧭', gen: depuisListe(GEOGRAPHIE) }] },
      { id: 'sciences', titre: 'Sciences', emoji: '🔬', couleur: '#3bb273', jeux: [{ id: 'quiz-sciences', titre: 'Quiz de sciences', emoji: '🧪', gen: depuisListe(SCIENCES) }] },
      {
        id: 'anglais', titre: 'Anglais', emoji: '🇬🇧', couleur: '#8e5cd9', jeux: [
          { id: 'vocab-en', titre: 'Vocabulary', emoji: '💬', gen: () => {
            const [fr, en] = pioche(ANGLAIS_CM1);
            return qcm({ visuel: '🇬🇧', enonce: `Comment dit-on « ${fr} » en anglais ?` }, en, ANGLAIS_CM1.map(x => x[1]));
          } }
        ]
      }
    ]
  }
};

// Extensions : les fichiers cp-plus.js et cm1-plus.js ajoutent des jeux et des matières.
function ajouterMatiere(niveau, matiere) { NIVEAUX[niveau].matieres.push(matiere); }
function ajouterJeux(niveau, matiereId, jeux) {
  const m = NIVEAUX[niveau].matieres.find(x => x.id === matiereId);
  if (!m) throw new Error('Matière inconnue : ' + niveau + '/' + matiereId);
  m.jeux.push(...jeux);
}
// Petit dessin SVG réutilisable (horloge, formes, angles…)
function svg(contenu, taille = 160, vb = 100) {
  return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${vb} ${vb}" style="max-width:60vw;height:auto">${contenu}</svg>`;
}
