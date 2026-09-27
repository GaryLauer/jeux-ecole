// Mon animal : un bébé panthère bleu foncé (la grande, CM1) ou un bébé panda (la petite, CP) à élever.
// Il grandit avec l'XP gagnée en faisant les exercices. Tout ce qu'on lui donne s'achète à la boutique
// avec les pattes 🐾, et les pattes se gagnent seulement en travaillant les cours.

/* ---------- La boutique : tous les articles ---------- */
const RAYONS = [
  { id: 'bebe', nom: 'Bébé', ic: '🍼' },
  { id: 'repas', nom: 'Repas', ic: '🍎' },
  { id: 'boisson', nom: 'Boissons', ic: '🥤' },
  { id: 'toilette', nom: 'Toilette', ic: '🛁' },
  { id: 'soins', nom: 'Soins', ic: '💊' },
  { id: 'jouets', nom: 'Jouets', ic: '⚽' },
  { id: 'habits', nom: 'Habits', ic: '👗' },
  { id: 'maison', nom: 'Maison', ic: '🏠' }
];
const SLOTS = { tete: 'Tête', yeux: 'Lunettes', cou: 'Cou', corps: 'Habits', dos: 'Dos', pieds: 'Pieds' };
const JAUGES = [
  { id: 'ventre', nom: 'Ventre', ic: '🍗' },
  { id: 'eau', nom: 'Soif', ic: '💧' },
  { id: 'proprete', nom: 'Propreté', ic: '🛁' },
  { id: 'energie', nom: 'Énergie', ic: '⚡' },
  { id: 'bonheur', nom: 'Bonheur', ic: '😊' },
  { id: 'sante', nom: 'Santé', ic: '❤️' }
];
const BEBE = { max: 'enfant' }, SOLIDE = { min: 'enfant' };

const CATALOGUE = [
  // Bébé
  { id: 'biberon-lait', cat: 'bebe', action: 'manger', nom: 'Biberon de lait', ic: '🍼', prix: 18, ef: { ventre: 30, eau: 10, bonheur: 3 }, ...BEBE, desc: 'Le repas préféré des bébés.' },
  { id: 'biberon-eau', cat: 'bebe', action: 'boire', nom: 'Biberon d\'eau', ic: '🍼', badge: '💧', prix: 9, ef: { eau: 35 }, ...BEBE, desc: 'De l\'eau fraîche pour les petits.' },
  { id: 'biberon-choco', cat: 'bebe', action: 'manger', nom: 'Biberon au chocolat', ic: '🍼', badge: '🍫', prix: 27, ef: { ventre: 30, bonheur: 10 }, ...BEBE, desc: 'Du lait tout chocolaté, miam !' },
  { id: 'biberon-fraise', cat: 'bebe', action: 'manger', nom: 'Biberon à la fraise', ic: '🍼', badge: '🍓', prix: 27, ef: { ventre: 28, eau: 5, bonheur: 10 }, ...BEBE, desc: 'Du lait rose à la fraise.' },
  { id: 'compote', cat: 'bebe', action: 'manger', nom: 'Petit pot de compote', ic: '🥣', badge: '🍏', prix: 21, ef: { ventre: 22, bonheur: 5, sante: 3 }, ...BEBE, desc: 'Pomme écrasée toute douce.' },
  { id: 'bouillie', cat: 'bebe', action: 'manger', nom: 'Bouillie de céréales', ic: '🥣', badge: '🌾', prix: 27, ef: { ventre: 40, energie: 5 }, ...BEBE, desc: 'Ça tient bien au ventre.' },
  { id: 'couches', cat: 'bebe', action: 'couche', nom: 'Paquet de couches', ic: '🧷', usages: 5, prix: 24, ...BEBE, desc: '5 couches propres. Change la couche quand elle est sale !' },
  // Repas
  { id: 'croquettes', cat: 'repas', action: 'manger', nom: 'Boîte de croquettes', ic: '🥫', usages: 3, prix: 42, ef: { ventre: 35 }, ...SOLIDE, desc: '3 repas complets.' },
  { id: 'pomme', cat: 'repas', action: 'manger', nom: 'Pomme', ic: '🍎', prix: 9, ef: { ventre: 10, sante: 4 }, ...SOLIDE, desc: 'Croquante et bonne pour la santé.' },
  { id: 'banane', cat: 'repas', action: 'manger', nom: 'Banane', ic: '🍌', prix: 9, ef: { ventre: 14, energie: 3 }, ...SOLIDE, desc: 'Pour avoir de l\'énergie.' },
  { id: 'carotte', cat: 'repas', action: 'manger', nom: 'Carotte', ic: '🥕', prix: 9, ef: { ventre: 10, sante: 5 }, ...SOLIDE, desc: 'Bonne pour les yeux.' },
  { id: 'fraises', cat: 'repas', action: 'manger', nom: 'Barquette de fraises', ic: '🍓', prix: 15, ef: { ventre: 8, bonheur: 8 }, ...SOLIDE, desc: 'Sucrées et juteuses.' },
  { id: 'pasteque', cat: 'repas', action: 'manger', nom: 'Tranche de pastèque', ic: '🍉', prix: 15, ef: { ventre: 10, eau: 15 }, ...SOLIDE, desc: 'Elle mange et boit en même temps !' },
  { id: 'pousses', cat: 'repas', action: 'manger', nom: 'Pousses de bambou', ic: '🌱', prix: 18, ef: { ventre: 22, sante: 3 }, ...SOLIDE, fav: 'panda', desc: 'Tendres et croquantes.' },
  { id: 'bambou', cat: 'repas', action: 'manger', nom: 'Grand bambou', ic: '🎋', prix: 27, ef: { ventre: 40, sante: 5 }, ...SOLIDE, fav: 'panda', desc: 'Le vrai repas des pandas.' },
  { id: 'poisson', cat: 'repas', action: 'manger', nom: 'Poisson frais', ic: '🐟', prix: 30, ef: { ventre: 38, sante: 5 }, ...SOLIDE, fav: 'panthere', desc: 'Pêché ce matin.' },
  { id: 'steak', cat: 'repas', action: 'manger', nom: 'Gros steak', ic: '🥩', prix: 36, ef: { ventre: 48, energie: 8 }, min: 'ado', fav: 'panthere', desc: 'Pour les grands félins.' },
  { id: 'poulet', cat: 'repas', action: 'manger', nom: 'Cuisse de poulet', ic: '🍗', prix: 30, ef: { ventre: 40, energie: 5 }, ...SOLIDE, desc: 'Rôtie et dorée.' },
  { id: 'riz', cat: 'repas', action: 'manger', nom: 'Bol de riz', ic: '🍚', prix: 18, ef: { ventre: 28 }, ...SOLIDE, desc: 'Tout simple et nourrissant.' },
  { id: 'pates', cat: 'repas', action: 'manger', nom: 'Assiette de pâtes', ic: '🍝', prix: 24, ef: { ventre: 32, bonheur: 5 }, ...SOLIDE, desc: 'Avec de la sauce tomate.' },
  { id: 'soupe', cat: 'repas', action: 'manger', nom: 'Soupe de légumes', ic: '🍲', prix: 21, ef: { ventre: 22, eau: 10, sante: 4 }, ...SOLIDE, desc: 'Bien chaude.' },
  { id: 'sandwich', cat: 'repas', action: 'manger', nom: 'Sandwich', ic: '🥪', prix: 21, ef: { ventre: 26 }, ...SOLIDE, desc: 'Pour un pique-nique.' },
  { id: 'miel', cat: 'repas', action: 'manger', nom: 'Pot de miel', ic: '🍯', prix: 18, ef: { ventre: 10, bonheur: 10, energie: 5 }, ...SOLIDE, desc: 'Doux et sucré.' },
  { id: 'crepe', cat: 'repas', action: 'manger', nom: 'Crêpes', ic: '🥞', prix: 24, ef: { ventre: 22, bonheur: 10 }, ...SOLIDE, desc: 'Un goûter de fête.' },
  { id: 'pizza', cat: 'repas', action: 'manger', nom: 'Pizza', ic: '🍕', prix: 33, ef: { ventre: 35, bonheur: 12, sante: -3 }, ...SOLIDE, desc: 'Délicieuse, mais pas tous les jours !' },
  { id: 'cookie', cat: 'repas', action: 'manger', nom: 'Cookie', ic: '🍪', prix: 12, ef: { ventre: 8, bonheur: 8 }, ...SOLIDE, desc: 'Aux pépites de chocolat.' },
  { id: 'glace', cat: 'repas', action: 'manger', nom: 'Glace', ic: '🍦', prix: 18, ef: { bonheur: 14, eau: 5 }, ...SOLIDE, desc: 'Vanille et fraise.' },
  { id: 'gateau', cat: 'repas', action: 'manger', nom: 'Gâteau d\'anniversaire', ic: '🎂', prix: 48, ef: { ventre: 20, bonheur: 25, sante: -3 }, ...SOLIDE, desc: 'Pour faire la fête !' },
  { id: 'bonbons', cat: 'repas', action: 'manger', nom: 'Bonbons', ic: '🍬', prix: 6, ef: { bonheur: 7, sante: -2 }, ...SOLIDE, desc: 'Attention aux dents !' },
  // Boissons
  { id: 'eau', cat: 'boisson', action: 'boire', nom: 'Bouteille d\'eau', ic: '💧', prix: 6, ef: { eau: 35 }, ...SOLIDE, desc: 'La meilleure boisson.' },
  { id: 'lait', cat: 'boisson', action: 'boire', nom: 'Verre de lait', ic: '🥛', prix: 12, ef: { eau: 20, ventre: 10, sante: 3 }, ...SOLIDE, desc: 'Pour des os solides.' },
  { id: 'jus-orange', cat: 'boisson', action: 'boire', nom: 'Jus d\'orange', ic: '🧃', badge: '🍊', prix: 12, ef: { eau: 28, sante: 4 }, ...SOLIDE, desc: 'Plein de vitamines.' },
  { id: 'jus-pomme', cat: 'boisson', action: 'boire', nom: 'Jus de pomme', ic: '🧃', badge: '🍏', prix: 12, ef: { eau: 28, bonheur: 4 }, ...SOLIDE, desc: 'Frais et doux.' },
  { id: 'limonade', cat: 'boisson', action: 'boire', nom: 'Limonade', ic: '🍋', prix: 15, ef: { eau: 25, bonheur: 8 }, ...SOLIDE, desc: 'Ça pétille !' },
  { id: 'smoothie', cat: 'boisson', action: 'boire', nom: 'Smoothie aux fruits', ic: '🥤', prix: 18, ef: { eau: 25, ventre: 10, bonheur: 6 }, ...SOLIDE, desc: 'Banane, fraise, mangue.' },
  { id: 'the-bambou', cat: 'boisson', action: 'boire', nom: 'Thé au bambou', ic: '🍵', prix: 15, ef: { eau: 25, sante: 6 }, ...SOLIDE, fav: 'panda', desc: 'La boisson des pandas.' },
  { id: 'chocolat', cat: 'boisson', action: 'boire', nom: 'Chocolat chaud', ic: '☕', prix: 15, ef: { eau: 18, bonheur: 12 }, ...SOLIDE, desc: 'Avec de la mousse.' },
  // Toilette
  { id: 'savon', cat: 'toilette', action: 'bain', nom: 'Savon doux', ic: '🧼', usages: 3, prix: 30, desc: 'Pour 3 bains. Il en faut pour laver !' },
  { id: 'shampooing', cat: 'toilette', action: 'bain', nom: 'Shampooing brillance', ic: '🧴', usages: 4, prix: 36, desc: 'Poils doux et brillants (4 bains).' },
  { id: 'moussant', cat: 'toilette', action: 'bain', nom: 'Bain moussant', ic: '🛁', badge: '✨', usages: 3, prix: 36, desc: 'Plein de mousse, il adore (3 bains).' },
  { id: 'canard', cat: 'toilette', nom: 'Canard de bain', ic: '🦆', durable: true, prix: 45, desc: 'Il flotte dans le bain. Coin coin !' },
  { id: 'serviette', cat: 'toilette', nom: 'Serviette toute douce', ic: '🧣', durable: true, prix: 60, desc: 'Pour bien sécher après le bain.' },
  { id: 'brosse-dents', cat: 'toilette', nom: 'Brosse à dents', ic: '🪥', durable: true, prix: 36, desc: 'Pour brosser les dents chaque jour.' },
  { id: 'dentifrice', cat: 'toilette', action: 'dents', nom: 'Dentifrice', ic: '🦷', usages: 5, prix: 18, desc: '5 brossages. Il faut aussi la brosse à dents.' },
  { id: 'parfum', cat: 'toilette', action: 'parfum', nom: 'Eau de toilette', ic: '🌸', usages: 3, prix: 24, ef: { bonheur: 8, proprete: 5 }, desc: 'Il sent bon les fleurs (3 fois).' },
  { id: 'sacs', cat: 'toilette', action: 'ramasser', nom: 'Sacs à crottes', ic: '💩', usages: 5, prix: 15, ...SOLIDE, desc: 'Pour ramasser ses crottes (5 fois).' },
  // Soins
  { id: 'vitamines', cat: 'soins', action: 'soigner', nom: 'Vitamines', ic: '💪', prix: 18, ef: { sante: 12, energie: 5 }, desc: 'Pour être en forme.' },
  { id: 'pansement', cat: 'soins', action: 'soigner', nom: 'Pansement', ic: '🩹', prix: 12, ef: { sante: 8, bonheur: 5 }, desc: 'Pour les petits bobos.' },
  { id: 'sirop', cat: 'soins', action: 'soigner', nom: 'Sirop', ic: '🧪', prix: 27, ef: { sante: 25 }, desc: 'Contre la toux et le rhume.' },
  { id: 'medicament', cat: 'soins', action: 'soigner', nom: 'Médicament', ic: '💊', prix: 42, ef: { sante: 40 }, guerit: true, desc: 'Il guérit quand il est malade.' },
  { id: 'veterinaire', cat: 'soins', action: 'soigner', nom: 'Visite chez le vétérinaire', ic: '🩺', prix: 75, ef: { sante: 100, bonheur: 5 }, guerit: true, desc: 'Le docteur le soigne complètement.' },
  { id: 'thermometre', cat: 'soins', nom: 'Thermomètre', ic: '🌡️', durable: true, prix: 24, desc: 'Pour savoir s\'il a de la fièvre.' },
  // Jouets
  { id: 'peluche', cat: 'jouets', action: 'calin', nom: 'Doudou nounours', ic: '🧸', usages: 8, prix: 36, ef: { bonheur: 15, energie: 3 }, desc: '8 gros câlins.' },
  { id: 'balle', cat: 'jouets', action: 'jouer', nom: 'Ballon', ic: '⚽', usages: 5, prix: 30, ef: { bonheur: 18, energie: -10, ventre: -5 }, desc: '5 parties d\'attrape-ballon.' },
  { id: 'pelote', cat: 'jouets', action: 'jouer', nom: 'Pelote de laine', ic: '🧶', usages: 5, prix: 30, ef: { bonheur: 20, energie: -8 }, fav: 'panthere', desc: 'Les félins adorent (5 parties).' },
  { id: 'ballons', cat: 'jouets', action: 'jouer', nom: 'Ballons de fête', ic: '🎈', usages: 3, prix: 24, ef: { bonheur: 18, energie: -6 }, desc: 'Éclate les ballons (3 parties).' },
  { id: 'livre', cat: 'jouets', action: 'histoire', nom: 'Livre d\'histoires', ic: '📖', usages: 5, prix: 30, ef: { bonheur: 15, energie: 5 }, desc: 'Lis-lui une histoire (5 fois).' },
  { id: 'tambour', cat: 'jouets', action: 'jouer', nom: 'Tambour', ic: '🥁', usages: 5, prix: 36, ef: { bonheur: 16, energie: -6 }, ...SOLIDE, desc: 'Boum boum ! (5 parties)' },
  { id: 'puzzle', cat: 'jouets', action: 'jouer', nom: 'Puzzle', ic: '🧩', usages: 5, prix: 30, ef: { bonheur: 14, energie: -4 }, ...SOLIDE, desc: 'Un jeu calme (5 parties).' },
  { id: 'frisbee', cat: 'jouets', action: 'jouer', nom: 'Frisbee', ic: '🥏', usages: 5, prix: 36, ef: { bonheur: 20, energie: -12, ventre: -6 }, ...SOLIDE, desc: 'Lance, il rattrape ! (5 parties)' },
  { id: 'cerf-volant', cat: 'jouets', action: 'jouer', nom: 'Cerf-volant', ic: '🪁', usages: 5, prix: 45, ef: { bonheur: 22, energie: -10 }, min: 'ado', desc: 'Il vole très haut (5 parties).' },
  { id: 'trottinette', cat: 'jouets', action: 'jouer', nom: 'Trottinette', ic: '🛴', usages: 6, prix: 66, ef: { bonheur: 24, energie: -14, ventre: -6 }, min: 'ado', desc: 'Zoum ! (6 balades)' },
  // Habits
  { id: 'noeud', cat: 'habits', slot: 'tete', nom: 'Nœud rose', ic: '🎀', durable: true, prix: 45 },
  { id: 'casquette', cat: 'habits', slot: 'tete', nom: 'Casquette', ic: '🧢', durable: true, prix: 60 },
  { id: 'paille', cat: 'habits', slot: 'tete', nom: 'Chapeau de paille', ic: '👒', durable: true, prix: 75 },
  { id: 'hautdeforme', cat: 'habits', slot: 'tete', nom: 'Chapeau de magicien', ic: '🎩', durable: true, prix: 105 },
  { id: 'fleurs', cat: 'habits', slot: 'tete', nom: 'Couronne de fleurs', ic: '🌸', durable: true, prix: 120 },
  { id: 'licorne', cat: 'habits', slot: 'tete', nom: 'Corne de licorne', ic: '🦄', durable: true, prix: 240, min: 'enfant' },
  { id: 'couronne', cat: 'habits', slot: 'tete', nom: 'Couronne royale', ic: '👑', durable: true, prix: 450, min: 'adulte' },
  { id: 'lunettes-rondes', cat: 'habits', slot: 'yeux', nom: 'Lunettes rondes', ic: '👓', durable: true, prix: 60 },
  { id: 'lunettes-soleil', cat: 'habits', slot: 'yeux', nom: 'Lunettes de soleil', ic: '🕶️', durable: true, prix: 75 },
  { id: 'lunettes-coeur', cat: 'habits', slot: 'yeux', nom: 'Lunettes cœur', ic: '💕', durable: true, prix: 105 },
  { id: 'lunettes-etoile', cat: 'habits', slot: 'yeux', nom: 'Lunettes étoiles', ic: '⭐', durable: true, prix: 105 },
  { id: 'papillon', cat: 'habits', slot: 'cou', nom: 'Nœud papillon', ic: '🎀', durable: true, prix: 45 },
  { id: 'bandana', cat: 'habits', slot: 'cou', nom: 'Bandana', ic: '🔺', durable: true, prix: 54 },
  { id: 'echarpe', cat: 'habits', slot: 'cou', nom: 'Écharpe rayée', ic: '🧣', durable: true, prix: 60 },
  { id: 'perles', cat: 'habits', slot: 'cou', nom: 'Collier de perles', ic: '📿', durable: true, prix: 120 },
  { id: 'medaille', cat: 'habits', slot: 'cou', nom: 'Médaille d\'or', ic: '🏅', durable: true, prix: 180, min: 'enfant' },
  { id: 'tshirt', cat: 'habits', slot: 'corps', nom: 'T-shirt étoile', ic: '👕', durable: true, prix: 75 },
  { id: 'pull', cat: 'habits', slot: 'corps', nom: 'Pull rayé', ic: '🧶', durable: true, prix: 90 },
  { id: 'salopette', cat: 'habits', slot: 'corps', nom: 'Salopette', ic: '👖', durable: true, prix: 105 },
  { id: 'pyjama', cat: 'habits', slot: 'corps', nom: 'Pyjama étoilé', ic: '🌙', durable: true, prix: 105 },
  { id: 'tutu', cat: 'habits', slot: 'corps', nom: 'Tutu de danseuse', ic: '🩰', durable: true, prix: 120 },
  { id: 'robe', cat: 'habits', slot: 'corps', nom: 'Robe à pois', ic: '👗', durable: true, prix: 135 },
  { id: 'princesse', cat: 'habits', slot: 'corps', nom: 'Robe de princesse', ic: '👸', durable: true, prix: 300, min: 'ado' },
  { id: 'sac', cat: 'habits', slot: 'dos', nom: 'Sac à dos', ic: '🎒', durable: true, prix: 90 },
  { id: 'cape', cat: 'habits', slot: 'dos', nom: 'Cape de super-héros', ic: '🦸', durable: true, prix: 150 },
  { id: 'ailes', cat: 'habits', slot: 'dos', nom: 'Ailes de fée', ic: '🧚', durable: true, prix: 210, min: 'enfant' },
  { id: 'chaussons', cat: 'habits', slot: 'pieds', nom: 'Chaussons', ic: '🥿', durable: true, prix: 60 },
  { id: 'bottes', cat: 'habits', slot: 'pieds', nom: 'Bottes de pluie', ic: '👢', durable: true, prix: 75 },
  { id: 'baskets', cat: 'habits', slot: 'pieds', nom: 'Baskets', ic: '👟', durable: true, prix: 90 },
  // Maison
  { id: 'lit', cat: 'maison', nom: 'Lit douillet', ic: '🛏️', durable: true, prix: 75, desc: 'Indispensable pour faire dodo.' },
  { id: 'veilleuse', cat: 'maison', nom: 'Veilleuse étoile', ic: '🌟', durable: true, prix: 45, desc: 'Il dort mieux et récupère plus vite.' },
  { id: 'decor-jungle', cat: 'maison', decor: 'jungle', nom: 'Décor jungle', ic: '🌴', durable: true, prix: 240 },
  { id: 'decor-bambous', cat: 'maison', decor: 'bambous', nom: 'Forêt de bambous', ic: '🎋', durable: true, prix: 240 },
  { id: 'decor-plage', cat: 'maison', decor: 'plage', nom: 'Décor plage', ic: '🏖️', durable: true, prix: 300 },
  { id: 'decor-neige', cat: 'maison', decor: 'neige', nom: 'Montagne enneigée', ic: '⛄', durable: true, prix: 330 },
  { id: 'decor-ocean', cat: 'maison', decor: 'ocean', nom: 'Fonds marins', ic: '🐠', durable: true, prix: 360 },
  { id: 'decor-chateau', cat: 'maison', decor: 'chateau', nom: 'Château de princesse', ic: '🏰', durable: true, prix: 450 },
  { id: 'decor-espace', cat: 'maison', decor: 'espace', nom: 'Voyage dans l\'espace', ic: '🚀', durable: true, prix: 450 },
  { id: 'decor-arcenciel', cat: 'maison', decor: 'arcenciel', nom: 'Pays arc-en-ciel', ic: '🌈', durable: true, prix: 600, min: 'ado' }
];
const ARTICLE = {};
CATALOGUE.forEach(it => { ARTICLE[it.id] = it; if (it.slot) it.dessin = DESSINS_HABITS[it.id]; });

const DECORS = {
  chambre: { nom: 'Ma chambre', deco: [['🖼️', 14, 20, 1.3], ['🪟', 80, 20, 1.6], ['🪴', 90, 72, 1.5], ['🧸', 8, 78, 1]] },
  jungle: { nom: 'Jungle', deco: [['🌴', 8, 42, 3], ['🌿', 92, 70, 1.8], ['🦜', 82, 18, 1.2], ['🌺', 16, 80, 1], ['🍃', 70, 10, 1]] },
  bambous: { nom: 'Bambous', deco: [['🎋', 8, 40, 3], ['🎋', 90, 40, 3], ['🎍', 82, 78, 1.4], ['🦋', 22, 18, 1]] },
  plage: { nom: 'Plage', deco: [['☀️', 85, 12, 1.8], ['⛱️', 12, 62, 2.2], ['🐚', 88, 86, 1], ['🦀', 20, 88, .9]] },
  neige: { nom: 'Neige', deco: [['🌲', 8, 50, 2.6], ['⛄', 88, 68, 2], ['❄️', 30, 12, 1], ['❄️', 70, 22, .8], ['❄️', 55, 8, .7]] },
  ocean: { nom: 'Fonds marins', deco: [['🐠', 15, 25, 1.4], ['🐟', 82, 40, 1.2], ['🐙', 88, 80, 1.5], ['🐚', 12, 88, 1], ['🫧', 70, 15, 1]] },
  chateau: { nom: 'Château', deco: [['🏰', 85, 30, 2.4], ['🕯️', 10, 60, 1.2], ['🎀', 14, 16, 1.2], ['✨', 60, 10, 1]] },
  espace: { nom: 'Espace', deco: [['🪐', 14, 18, 2], ['🚀', 86, 26, 1.6], ['🌙', 60, 10, 1.2], ['⭐', 35, 28, .8], ['⭐', 75, 55, .7]] },
  arcenciel: { nom: 'Arc-en-ciel', deco: [['🌈', 50, 14, 3.2], ['☁️', 12, 30, 1.6], ['🦄', 88, 70, 1.8], ['🍭', 10, 78, 1.2]] }
};

const NOMS_ANIMAUX = {
  panthere: ['Saphir', 'Minuit', 'Bleuette', 'Onyx', 'Luna', 'Orage', 'Pépite', 'Myrtille'],
  panda: ['Pompon', 'Bambou', 'Mochi', 'Choupette', 'Nuage', 'Câline', 'Biscuit', 'Doudou']
};
const HISTOIRES = [
  n => [`Il était une fois un petit nuage tout gris. Il était triste, car personne ne jouait avec lui.`, `Un jour, ${n} lui fit un grand sourire. Le nuage rit si fort qu'il fit pleuvoir des bonbons !`, `Depuis, le nuage passe tous les jours dire bonjour. Fin !`],
  n => [`Dans la forêt vivait une petite tortue qui voulait voler.`, `${n} lui construisit des ailes en feuilles. La tortue sauta… et atterrit dans une flaque, plouf !`, `Elle éclata de rire : « Finalement, j'aime bien nager ! » Fin !`],
  n => [`Ce matin, la lune avait oublié de se coucher.`, `${n} lui chanta une berceuse toute douce, et la lune bâilla : « Aaah, merci ! »`, `Elle alla dormir, et le soleil put enfin se lever. Fin !`],
  n => [`Un escargot très pressé voulait arriver le premier à la fête.`, `${n} le posa sur son dos et courut, courut, courut !`, `Ils arrivèrent en premier, et l'escargot eut la plus grosse part de gâteau. Fin !`],
  n => [`Une étoile était tombée dans le jardin.`, `${n} la ramassa, la frotta pour la faire briller et la lança très haut dans le ciel.`, `Chaque soir, l'étoile fait un clin d'œil pour dire merci. Fin !`],
  n => [`Le petit ours avait perdu son doudou.`, `${n} chercha sous le lit, derrière l'arbre et dans le panier. Le voilà, dans la cuisine !`, `Le petit ours fit un énorme câlin. Fin !`]
];

/* ---------- La vie de l'animal ---------- */
function e(a) { return a.fille ? 'e' : ''; }
function nouvelAnimal(p, nom, fille) {
  return {
    espece: p.niveau === 'CP' ? 'panda' : 'panthere', nom, fille, ne: Date.now(), xp: 0,
    ventre: 70, eau: 70, proprete: 85, energie: 80, bonheur: 80, sante: 100,
    malade: false, dort: false, cacas: 0, couche: false, prochainCaca: 0, pansement: 0, brille: 0,
    maj: Date.now(), rythme: 20, tenue: {}, sac: { 'biberon-lait': 2, 'biberon-eau': 1, couches: 1 }, possede: {}, decor: 'chambre', vuStade: 'bebe'
  };
}
const borne = v => Math.max(0, Math.min(100, v));

// Le temps passe : l'animal a faim, soif, se salit… même quand l'appli est fermée (au plus 3 jours comptés).
// Croissance 20 fois plus lente depuis le 27/09/2026 : l'XP des animaux déjà nés est multipliée par 20
// pour qu'ils gardent leur âge et leur avancée ; seule la suite est plus lente.
function migrer(a) { if (!a.rythme) { a.xp = Math.round(a.xp * 20); a.rythme = 20; } }
function vivre(a) {
  migrer(a);
  const now = Date.now();
  let h = Math.min(Math.max(0, (now - (a.maj || now)) / 36e5), 72);
  a.maj = now;
  while (h > 0) {
    const d = Math.min(h, 0.25); h -= d;
    const lent = a.dort ? 0.5 : 1;
    a.ventre = borne(a.ventre - 4.5 * d * lent);
    a.eau = borne(a.eau - 5.5 * d * lent);
    a.proprete = borne(a.proprete - (2.5 + a.cacas * 3 + (a.couche ? 5 : 0)) * d);
    a.energie = borne(a.dort ? a.energie + 22 * d * (a.possede.veilleuse ? 1.4 : 1) : a.energie - 3.5 * d);
    const manque = a.ventre < 25 || a.eau < 25 || a.proprete < 25 || a.couche || a.cacas > 1;
    a.bonheur = borne(a.bonheur - (2.5 + (manque ? 4 : 0) + (a.malade ? 2 : 0)) * d * lent);
    if (a.ventre < 20 || a.eau < 20 || a.proprete < 15) a.sante -= 3 * d;
    else if (!a.malade && a.ventre >= 50 && a.eau >= 50 && a.proprete >= 50) a.sante += 2 * d;
    if (a.malade) a.sante -= 1 * d;
    a.sante = Math.max(5, Math.min(100, a.sante));
    if (a.sante < 35) a.malade = true;
    if (a.dort && a.energie >= 100) a.dort = false;
  }
  if (a.prochainCaca && now >= a.prochainCaca) {
    if (stadeDe(a.xp).id === 'bebe') a.couche = true;
    else a.cacas = Math.min(3, a.cacas + 1);
    a.prochainCaca = 0;
  }
}
function humeurDe(a) {
  if (a.dort) return 'dort';
  if (a.malade) return 'malade';
  if (a.couche || a.ventre < 20 || a.eau < 20 || a.bonheur < 25 || a.proprete < 20) return 'triste';
  return 'content';
}
function besoin(a) {
  const x = e(a);
  if (a.dort) return 'Zzz… Zzz…';
  if (a.malade) return 'Je ne me sens pas bien… 🤒 Il me faut un médicament.';
  if (a.couche) return 'Ouin ouin ! Ma couche est sale, change-moi !';
  if (a.cacas) return 'Oups, j\'ai fait caca ! Il faut ramasser.';
  if (a.ventre < 30) return 'J\'ai faim ! 🍗';
  if (a.eau < 30) return 'J\'ai soif ! 💧';
  if (a.proprete < 30) return `Je suis tout${x} sale, je veux un bain ! 🛁`;
  if (a.energie < 25) return `Je suis fatigué${x}… je veux faire dodo. 😴`;
  if (a.bonheur < 30) return 'Je m\'ennuie… on joue ? ⚽';
  if (a.sante < 60) return 'Des vitamines me feraient du bien.';
  return null;
}
function phraseContente(a, p) {
  return pioche([`Je t'aime, ${p.nom} ! 💖`, 'Tu as bien travaillé à l\'école ?', 'Fais des exercices pour gagner des pattes 🐾 !', `Je suis content${e(a)} de te voir !`, 'On joue ensemble ?', 'Quand je serai grand' + e(a) + ', je serai très fort' + e(a) + ' !', 'Tu me fais un câlin ?']);
}
function donnerXp(a, n) { a.xp += n; }
function gagnerPattes(p, reussies, nbEt, defi) {
  const n = reussies * 2 + nbEt * 3 + (defi && nbEt >= 1 ? 10 : 0);
  p.pattes = (p.pattes || 0) + n;
  if (p.animal) { migrer(p.animal); donnerXp(p.animal, reussies * 10); }
  return n;
}
function alerteAnimal(p) {
  if (!p.animal) return null;
  vivre(p.animal);
  return besoin(p.animal);
}
function libelleStade(id) { return (STADES.find(s => s.id === id) || {}).nom; }
function refusStade(a, it) {
  const r = rangStade(stadeDe(a.xp).id);
  if (it.min && r < rangStade(it.min)) return `Je suis encore trop petit${e(a)} ! Il faut que je sois ${libelleStade(it.min)}.`;
  if (it.max && r > rangStade(it.max)) return `Je suis trop grand${e(a)} pour ça maintenant !`;
  return null;
}
function combien(a, id) { return a.sac[id] || 0; }
function consommer(a, id) { if (a.sac[id]) { a.sac[id]--; if (!a.sac[id]) delete a.sac[id]; } }
function appliquer(a, ef = {}, bonus = 0) {
  Object.entries(ef).forEach(([k, v]) => { a[k] = k === 'sante' ? Math.max(5, Math.min(100, a[k] + v)) : borne(a[k] + v); });
  if (bonus) a.bonheur = borne(a.bonheur + bonus);
  if (a.malade) a.bonheur = Math.min(a.bonheur, 60);
}

/* ---------- La voix de l'animal ---------- */
function voixAnimal(a, texte) {
  if (!('speechSynthesis' in window) || !texte) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texte.replace(/[\u{1F000}-\u{1FFFF}☀-➿️]/gu, ''));
  u.lang = 'fr-FR';
  const v = typeof voixMaitresse === 'function' ? voixMaitresse() : null;
  if (v) u.voice = v;
  const bebe = stadeDe(a.xp).id === 'bebe';
  u.pitch = Math.min(2, (a.espece === 'panda' ? 1.7 : 1.45) + (bebe ? 0.25 : 0));
  u.rate = 1.05;
  speechSynthesis.speak(u);
}

/* ---------- Écran principal de l'animal ---------- */
let humeurForcee = null, minuteurHumeur = null, activite = null;

function ecranAnimal(p) {
  if (!p.animal) { adoption(p); return; }
  const a = p.animal;
  vivre(a); sauver();
  maitresseActive = null;
  activite = null; humeurForcee = null;
  afficher(`${a.espece === 'panda' ? '🐼' : '🐆'} ${a.nom}`, `
    <div class="animal-ecran">
      <div class="scene" id="scene">
        <div class="deco" id="deco"></div>
        <div class="fiche-animal" id="fiche"></div>
        <div class="bulle-animal" id="bulleAnimal"></div>
        <div class="zone-animal" id="zoneAnimal"></div>
        <div class="sol-objets" id="sol"></div>
        <div class="zzz"><span>Z</span><span>z</span><span>z</span></div>
      </div>
      <div class="panneau-animal">
        <div class="jauges" id="jauges"></div>
        <div class="actions-animal" id="actionsAnimal"></div>
      </div>
    </div>
    <div class="tiroir" id="tiroir" hidden></div>`, { retour: true, profil: p });
  rafraichirAnimal(p);
  const b = besoin(a);
  dire(a, b || `Coucou ${p.nom} !`);
  document.getElementById('zoneAnimal').onclick = () => {
    if (activite) return;
    if (a.dort) { dire(a, 'Chut… je dors. Zzz'); return; }
    montrerHumeur(p, 'joie', 1200);
    const zone = document.getElementById('zoneAnimal');
    zone.classList.remove('saute'); void zone.offsetWidth; zone.classList.add('saute');
    dire(a, besoin(a) || pioche(['Hi hi, ça chatouille !', 'Hé hé !', phraseContente(a, p)]));
  };
  const minuteur = setInterval(() => { vivre(a); sauver(); if (!activite) rafraichirAnimal(p); }, 15000);
  nettoyage = () => { clearInterval(minuteur); clearTimeout(minuteurHumeur); activite = null; };
  if (stadeDe(a.xp).id !== a.vuStade) setTimeout(() => ceremonieGrandir(p), 500);
}

function rafraichirAnimal(p) {
  const a = p.animal, st = stadeDe(a.xp);
  const scene = document.getElementById('scene');
  if (!scene) return;
  scene.className = `scene decor-${a.decor} ${a.dort ? 'nuit' : ''} ${a.possede.veilleuse ? 'veilleuse' : ''}`;
  document.getElementById('deco').innerHTML = (DECORS[a.decor] || DECORS.chambre).deco.map(([em, x, y, t]) => `<span style="left:${x}%;top:${y}%;font-size:${t}em">${em}</span>`).join('');
  const suivant = STADES[STADES.indexOf(st) + 1];
  const jours = Math.floor((Date.now() - a.ne) / 864e5) + 1;
  const pourcent = suivant ? Math.round((a.xp - st.xp) / (suivant.xp - st.xp) * 100) : 100;
  document.getElementById('fiche').innerHTML = `<b>${echapper(a.nom)}</b> ${a.fille ? '♀' : '♂'} · ${st.nom} · ${jours} jour${jours > 1 ? 's' : ''} · ${st.taille + Math.round(pourcent / 100 * 18)} cm
    <div class="barre-xp petite"><div style="width:${pourcent}%"></div></div>
    <small>${suivant ? `${a.xp - st.xp} / ${suivant.xp - st.xp} XP pour devenir ${suivant.nom}` : 'Adulte : il a fini de grandir ! 🏆'}</small>`;
  document.getElementById('zoneAnimal').innerHTML = dessinAnimal(a, { humeur: humeurForcee || humeurDe(a), dort: a.dort });
  document.getElementById('sol').innerHTML = Array.from({ length: a.cacas }, (_, i) => `<span style="left:${[14, 80, 26][i]}%">💩</span>`).join('');
  document.getElementById('jauges').innerHTML = JAUGES.map(j => {
    const v = Math.round(a[j.id]);
    return `<div class="jauge ${v < 25 ? 'bas' : v < 50 ? 'moyen' : ''}"><span>${j.ic}</span><div><i style="width:${v}%"></i></div><small>${j.nom}</small></div>`;
  }).join('');
  const bebe = st.id === 'bebe';
  const boutons = [
    ['manger', bebe ? '🍼' : '🍽️', 'Manger'],
    ['boire', '🥤', 'Boire'],
    ['bain', '🛁', 'Bain'],
    ['dents', '🪥', 'Dents'],
    ['jouer', '⚽', 'Jouer'],
    ['soigner', '💊', 'Soigner'],
    ['dodo', a.dort ? '☀️' : '😴', a.dort ? 'Réveiller' : 'Dodo'],
    ...(a.couche ? [['couche', '🧷', 'Changer', 'urgent']] : []),
    ...(a.cacas ? [['ramasser', '💩', 'Ramasser', 'urgent']] : []),
    ['habits', '👗', 'Habiller'],
    ['boutique', '🛒', 'Boutique', 'boutique']
  ];
  const zone = document.getElementById('actionsAnimal');
  zone.innerHTML = boutons.map(([id, ic, nom, cl]) => `<button class="action-animal ${cl || ''}" data-a="${id}"><span>${ic}</span>${nom}</button>`).join('');
  zone.querySelectorAll('[data-a]').forEach(b => b.onclick = () => action(p, b.dataset.a));
  majBourse(p);
}

function dire(a, texte) {
  const b = document.getElementById('bulleAnimal');
  if (!b || !texte) return;
  b.textContent = texte;
  b.classList.remove('visible'); void b.offsetWidth; b.classList.add('visible');
  voixAnimal(a, texte);
}
function montrerHumeur(p, humeur, ms) {
  humeurForcee = humeur;
  rafraichirAnimal(p);
  clearTimeout(minuteurHumeur);
  minuteurHumeur = setTimeout(() => { humeurForcee = null; if (document.getElementById('zoneAnimal') && !activite) rafraichirAnimal(p); }, ms);
}
function effetSurAnimal(texte, ou = 'tete', classe = '') {
  const zone = document.getElementById('zoneAnimal');
  if (!zone) return;
  const a = donneesAnimalCourant;
  const pt = a ? pointAnimal(a, ou) : { x: 50, y: 50 };
  const el = document.createElement('div');
  el.className = 'effet-animal ' + classe;
  el.textContent = texte;
  el.style.left = pt.x + (Math.random() * 20 - 10) + '%';
  el.style.top = pt.y + '%';
  zone.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}
let donneesAnimalCourant = null;
function coeurs(a, n = 4) { donneesAnimalCourant = a; for (let i = 0; i < n; i++) setTimeout(() => effetSurAnimal(pioche(['💖', '💕', '💗']), 'tete', 'monte'), i * 180); }

/* ---------- Les actions ---------- */
function action(p, id) {
  const a = p.animal;
  donneesAnimalCourant = a;
  if (id === 'boutique') { aller(() => boutique(p)); return; }
  if (id === 'habits') { aller(() => armoire(p)); return; }
  if (id === 'dodo') { dodo(p); return; }
  if (a.dort) { dire(a, 'Chut… je dors. Réveille-moi d\'abord ! 😴'); return; }
  if (id === 'bain') { preparerBain(p); return; }
  if (id === 'dents') { brosserDents(p); return; }
  if (id === 'couche') { changerCouche(p); return; }
  if (id === 'ramasser') { ramasser(p); return; }
  const filtres = {
    manger: it => it.action === 'manger',
    boire: it => it.action === 'boire',
    jouer: it => ['jouer', 'calin', 'histoire'].includes(it.action),
    soigner: it => it.action === 'soigner' || it.id === 'thermometre'
  };
  const rayon = { manger: stadeDe(a.xp).id === 'bebe' ? 'bebe' : 'repas', boire: stadeDe(a.xp).id === 'bebe' ? 'bebe' : 'boisson', jouer: 'jouets', soigner: 'soins' }[id];
  ouvrirTiroir(p, { manger: '🍽️ Donner à manger', boire: '🥤 Donner à boire', jouer: '⚽ Jouer', soigner: '💊 Soigner' }[id], CATALOGUE.filter(filtres[id]), rayon, it => utiliser(p, it));
}

function ouvrirTiroir(p, titre, articles, rayon, choisir) {
  const a = p.animal;
  const miens = articles.filter(it => it.durable ? a.possede[it.id] : combien(a, it.id) > 0);
  const t = document.getElementById('tiroir');
  t.hidden = false;
  t.innerHTML = `<div class="tiroir-boite">
    <div class="tiroir-haut"><b>${titre}</b><button class="rond fermer" aria-label="Fermer">✖</button></div>
    ${miens.length ? `<div class="tiroir-liste">${miens.map(it => {
      const refus = refusStade(a, it);
      return `<button class="objet ${refus ? 'bloque' : ''}" data-id="${it.id}">${iconeArticle(it)}<span>${it.nom}</span><small>${it.durable ? '✔ À toi' : '×' + combien(a, it.id)}${it.fav === a.espece ? ' · ❤️ Préféré' : ''}</small></button>`;
    }).join('')}</div>` : `<p class="tiroir-vide">Ton sac est vide pour ça ! 🎒<br>Achète ce qu'il faut à la boutique avec tes pattes 🐾.</p>`}
    <div class="tiroir-bas"><span>🐾 ${p.pattes}</span><button class="bouton" id="versBoutique">🛒 Boutique</button></div>
  </div>`;
  t.onclick = ev => { if (ev.target === t) fermerTiroir(); };
  t.querySelector('.fermer').onclick = fermerTiroir;
  document.getElementById('versBoutique').onclick = () => { fermerTiroir(); aller(() => boutique(p, rayon)); };
  t.querySelectorAll('.objet').forEach(b => b.onclick = () => { const it = ARTICLE[b.dataset.id]; if (choisir(it) !== false) fermerTiroir(); });
}
function fermerTiroir() { const t = document.getElementById('tiroir'); if (t) { t.hidden = true; t.innerHTML = ''; } }
function iconeArticle(it) { return `<span class="ic-article">${it.ic}${it.badge ? `<i>${it.badge}</i>` : ''}</span>`; }

// Utiliser un objet du sac (manger, boire, soigner, jouer). Renvoie false pour laisser le tiroir ouvert.
function utiliser(p, it) {
  const a = p.animal;
  const refus = refusStade(a, it);
  if (refus) { son('faux'); dire(a, refus + (it.max ? '' : ' Donne-moi plutôt un biberon ! 🍼')); return false; }
  if (it.id === 'thermometre') { prendreTemperature(p); return; }
  if (it.action === 'manger' && a.ventre >= 95) { dire(a, 'Je n\'ai plus faim, merci ! 😋'); return false; }
  if (it.action === 'boire' && a.eau >= 95) { dire(a, 'Je n\'ai plus soif, merci !'); return false; }
  if (it.action === 'soigner' && it.guerit && !a.malade && a.sante >= 95) { dire(a, 'Je ne suis pas malade, je suis en pleine forme ! 💪'); return false; }
  if (['jouer', 'calin', 'histoire'].includes(it.action)) {
    if (a.malade && it.action === 'jouer') { dire(a, 'Je suis malade… je préfère me reposer. 🤒'); return false; }
    if (a.energie < 15 && it.action === 'jouer') { dire(a, `Je suis trop fatigué${e(a)} pour jouer… 😴`); return false; }
    if (it.action === 'jouer') { fermerTiroir(); partieJouet(p, it); return; }
    if (it.action === 'histoire') { fermerTiroir(); lireHistoire(p, it); return; }
  }
  consommer(a, it.id);
  const fav = it.fav === a.espece;
  appliquer(a, it.ef, fav ? 10 : 0);
  if (it.guerit) a.malade = false;
  if (it.id === 'pansement') a.pansement = Date.now() + 20 * 60e3;
  if (it.action === 'manger' && (it.ef.ventre || 0) >= 15 && !a.prochainCaca) a.prochainCaca = Date.now() + (40 + Math.random() * 60) * 60e3;
  donnerXp(a, 3);
  sauver();
  const zone = document.getElementById('zoneAnimal');
  if (it.action === 'manger' || it.action === 'boire') {
    montrerHumeur(p, 'mange', 1800);
    const pt = pointAnimal(a, 'bouche');
    const el = document.createElement('div');
    el.className = 'bouchee'; el.textContent = it.badge && it.ic === '🍼' ? '🍼' : it.ic;
    el.style.left = pt.x + '%'; el.style.top = pt.y + '%';
    zone.appendChild(el);
    setTimeout(() => el.remove(), 1700);
    son('tic'); setTimeout(() => son('tic'), 500); setTimeout(() => son('tic'), 1000);
    setTimeout(() => { montrerHumeur(p, 'joie', 1400); coeurs(a, fav ? 6 : 3); son('bon'); }, 1800);
    dire(a, fav ? 'Miam ! C\'est mon plat préféré ! 😍' : it.action === 'boire' ? pioche(['Glou glou glou… Ah, ça fait du bien !', 'Merci, j\'avais soif !']) : pioche(['Miam miam ! 😋', 'C\'est trop bon !', 'Merci, c\'était délicieux !', 'Hmm, encore !']));
  } else if (it.action === 'calin') {
    montrerHumeur(p, 'joie', 2500);
    const pt = pointAnimal(a, 'corps');
    const el = document.createElement('div');
    el.className = 'bouchee calin'; el.textContent = it.ic;
    el.style.left = pt.x + '%'; el.style.top = pt.y + '%';
    zone.appendChild(el);
    setTimeout(() => el.remove(), 2500);
    coeurs(a, 8); son('bonus');
    dire(a, pioche(['Un gros câlin ! 🤗', 'J\'adore mon doudou !', 'Je t\'aime fort fort fort !']));
  } else {
    montrerHumeur(p, 'joie', 1500);
    if (it.guerit) { effetSurAnimal('✨', 'tete', 'monte'); effetSurAnimal('✨', 'corps', 'monte'); }
    coeurs(a, 2); son('bon');
    dire(a, it.guerit ? 'Je me sens beaucoup mieux, merci ! 😊' : it.id === 'pansement' ? 'Merci, ça ne fait plus mal !' : pioche(['Merci ! Je me sens en forme ! 💪', 'Ça fait du bien !']));
  }
}

function prendreTemperature(p) {
  const a = p.animal;
  fermerTiroir();
  activite = 'thermo';
  document.getElementById('zoneAnimal').innerHTML = dessinAnimal(a, { humeur: a.malade ? 'malade' : 'content', thermo: true });
  dire(a, 'Je garde le thermomètre sous la langue…');
  setTimeout(() => {
    activite = null;
    const t = a.malade ? (38.6 + Math.random() * 0.8).toFixed(1) : (36.6 + Math.random() * 0.6).toFixed(1);
    rafraichirAnimal(p);
    dire(a, a.malade ? `${t.replace('.', ',')} degrés : j'ai de la fièvre ! 🤒 Il me faut un médicament.` : `${t.replace('.', ',')} degrés : tout va bien ! 😊`);
  }, 2500);
}

function dodo(p) {
  const a = p.animal;
  if (a.dort) { a.dort = false; sauver(); rafraichirAnimal(p); montrerHumeur(p, 'joie', 1200); dire(a, `Bonjour ! J'ai bien dormi ! ☀️`); return; }
  if (!a.possede.lit) { son('faux'); dire(a, 'Je n\'ai pas de lit pour dormir… Achète-moi un lit douillet à la boutique ! 🛏️'); return; }
  if (a.energie >= 90) { dire(a, `Je ne suis pas fatigué${e(a)} ! On joue plutôt ?`); return; }
  a.dort = true; sauver();
  humeurForcee = null; clearTimeout(minuteurHumeur);
  rafraichirAnimal(p);
  dire(a, 'Bonne nuit… Zzz');
}

function changerCouche(p) {
  const a = p.animal;
  if (!combien(a, 'couches')) { son('faux'); dire(a, 'Il n\'y a plus de couches ! Achète un paquet à la boutique 🧷'); ouvrirTiroir(p, '🧷 Changer la couche', [ARTICLE.couches], 'bebe', () => {}); return; }
  consommer(a, 'couches');
  a.couche = false; appliquer(a, { proprete: 15, bonheur: 10 }); donnerXp(a, 3); sauver();
  rafraichirAnimal(p); montrerHumeur(p, 'joie', 1500);
  effetSurAnimal('✨', 'corps', 'monte'); son('bon');
  dire(a, 'Merci ! Une couche toute propre ! 😊');
}

function ramasser(p) {
  const a = p.animal;
  if (!combien(a, 'sacs')) { son('faux'); dire(a, 'Il n\'y a plus de sacs à crottes ! Il faut en acheter.'); ouvrirTiroir(p, '💩 Ramasser', [ARTICLE.sacs], 'toilette', () => {}); return; }
  consommer(a, 'sacs');
  const sol = document.getElementById('sol');
  sol.querySelectorAll('span').forEach(s => s.classList.add('disparait'));
  a.cacas = 0; appliquer(a, { proprete: 10, bonheur: 5 }); donnerXp(a, 3); sauver();
  son('bon');
  setTimeout(() => { rafraichirAnimal(p); montrerHumeur(p, 'joie', 1200); dire(a, 'Merci ! C\'est tout propre maintenant.'); }, 600);
}

/* ---------- Activités au doigt : bain, dents, jeux ---------- */
// Crée une couche qui suit le doigt au-dessus de l'animal. surGlisse(x, y, distance) reçoit la position en px.
function coucheDoigt(zone, outil, surGlisse) {
  const couche = document.createElement('div');
  couche.className = 'couche-doigt';
  const curseur = document.createElement('div');
  curseur.className = 'outil'; curseur.innerHTML = outil; curseur.hidden = true;
  couche.appendChild(curseur);
  zone.appendChild(couche);
  let dernier = null;
  const pos = ev => { const r = zone.getBoundingClientRect(); return { x: ev.clientX - r.left, y: ev.clientY - r.top }; };
  couche.onpointerdown = ev => { couche.setPointerCapture && couche.setPointerCapture(ev.pointerId); dernier = pos(ev); curseur.hidden = false; bouge(ev); };
  const bouge = ev => {
    if (!dernier) return;
    const q = pos(ev);
    curseur.style.left = q.x + 'px'; curseur.style.top = q.y + 'px';
    const d = Math.hypot(q.x - dernier.x, q.y - dernier.y);
    dernier = q;
    surGlisse(q.x, q.y, d);
  };
  couche.onpointermove = bouge;
  couche.onpointerup = couche.onpointercancel = () => { dernier = null; curseur.hidden = true; };
  return { couche, changerOutil: h => { curseur.innerHTML = h; }, fin: () => couche.remove() };
}
function barreActivite(texte) {
  const scene = document.getElementById('scene');
  let b = scene.querySelector('.barre-activite');
  if (!b) { b = document.createElement('div'); b.className = 'barre-activite'; b.innerHTML = '<b></b><div><i></i></div>'; scene.appendChild(b); }
  b.querySelector('b').textContent = texte;
  return v => { b.querySelector('i').style.width = Math.min(100, v * 100) + '%'; };
}
function finActivite(p) {
  activite = null;
  const scene = document.getElementById('scene');
  if (!scene) return;
  scene.querySelectorAll('.barre-activite,.baignoire,.options-bain').forEach(x => x.remove());
  scene.classList.remove('en-bain');
  rafraichirAnimal(p);
}

function preparerBain(p) {
  const a = p.animal;
  if (!combien(a, 'savon')) { son('faux'); dire(a, 'Il n\'y a plus de savon ! Il en faut pour me laver. 🧼'); ouvrirTiroir(p, '🛁 Le bain', CATALOGUE.filter(it => it.cat === 'toilette'), 'toilette', () => false); return; }
  if (a.malade) { dire(a, 'Je suis malade… soigne-moi d\'abord ! 🤒'); return; }
  const extras = ['shampooing', 'moussant'].filter(id => combien(a, id));
  if (!extras.length) { bain(p, []); return; }
  const scene = document.getElementById('scene');
  const choix = document.createElement('div');
  choix.className = 'options-bain';
  choix.innerHTML = `<b>Ajouter dans le bain ?</b>
    <div>${extras.map(id => `<button class="option on" data-id="${id}">${ARTICLE[id].ic} ${ARTICLE[id].nom} <small>×${combien(a, id)}</small></button>`).join('')}</div>
    <button class="bouton" id="goBain">🛁 C'est parti !</button>`;
  scene.appendChild(choix);
  activite = 'bain';
  choix.querySelectorAll('.option').forEach(b => b.onclick = () => b.classList.toggle('on'));
  document.getElementById('goBain').onclick = () => {
    const pris = [...choix.querySelectorAll('.option.on')].map(b => b.dataset.id);
    choix.remove();
    bain(p, pris);
  };
}

function bain(p, extras) {
  const a = p.animal;
  activite = 'bain';
  const scene = document.getElementById('scene'), zone = document.getElementById('zoneAnimal');
  const moussant = extras.includes('moussant');
  scene.classList.add('en-bain');
  zone.innerHTML = dessinAnimal(a, { humeur: 'content', taches: Math.max(2, a.proprete < 70 ? Math.ceil((70 - a.proprete) / 10) : 2) });
  const tub = document.createElement('div');
  tub.className = 'baignoire';
  tub.innerHTML = `<div class="eau-bain"></div>${a.possede.canard ? '<span class="canard">🦆</span>' : ''}`;
  scene.appendChild(tub);
  const avance = barreActivite('1. Frotte avec le savon 🧼');
  dire(a, 'Frotte-moi bien partout avec le savon !');
  let etape = 'frotter', total = 0, derniereBulle = 0;
  const bulles = [];
  const R = () => zone.getBoundingClientRect();
  const doigt = coucheDoigt(zone, '🧼', (x, y, d) => {
    if (etape === 'frotter') {
      total += d; derniereBulle += d;
      if (derniereBulle > (moussant ? 12 : 18) && bulles.length < (moussant ? 110 : 70)) {
        derniereBulle = 0;
        const b = document.createElement('i');
        b.className = 'mousse';
        const t = (moussant ? 22 : 14) + Math.random() * 22;
        b.style.cssText = `left:${x + Math.random() * 30 - 15}px;top:${y + Math.random() * 30 - 15}px;width:${t}px;height:${t}px`;
        zone.insertBefore(b, doigt.couche); bulles.push(b);
        if (Math.random() < 0.15) son('tic');
      }
      const v = total / 2000;
      avance(v);
      zone.querySelectorAll('.tache').forEach(tc => tc.style.opacity = Math.max(0, 0.75 * (1 - v)));
      if (v >= 1) {
        etape = 'rincer'; son('bon');
        doigt.changerOutil('🚿');
        barreActivite('2. Rince avec la douche 🚿')(0);
        dire(a, 'Hi hi, ça mousse ! Maintenant, rince-moi !');
        montrerHumeurActivite(a, 'joie');
      }
    } else if (etape === 'rincer') {
      if (Math.random() < 0.5) { const g = document.createElement('i'); g.className = 'goutte'; g.style.left = x + Math.random() * 40 - 20 + 'px'; g.style.top = y + 'px'; zone.appendChild(g); setTimeout(() => g.remove(), 700); }
      for (let i = bulles.length - 1; i >= 0; i--) {
        const b = bulles[i];
        if (Math.hypot(parseFloat(b.style.left) - x, parseFloat(b.style.top) - y) < 55) { b.classList.add('pop'); setTimeout(() => b.remove(), 300); bulles.splice(i, 1); }
      }
      const n0 = moussant ? 110 : 70;
      barreActivite('2. Rince avec la douche 🚿')(1 - bulles.length / n0);
      if (bulles.length <= 4) { bulles.forEach(b => b.remove()); bulles.length = 0; secher(); }
    } else if (etape === 'secher') {
      for (let i = gouttes.length - 1; i >= 0; i--) {
        const g = gouttes[i];
        if (Math.hypot(parseFloat(g.style.left) - x, parseFloat(g.style.top) - y) < 50) { g.remove(); gouttes.splice(i, 1); }
      }
      barreActivite('3. Sèche avec la serviette')(1 - gouttes.length / 14);
      if (!gouttes.length) terminer(true);
    }
  });
  const gouttes = [];
  function secher() {
    etape = 'secher'; son('bon');
    const r = R();
    if (a.possede.serviette) {
      doigt.changerOutil('<span class="serviette"></span>');
      for (let i = 0; i < 14; i++) {
        const g = document.createElement('i');
        g.className = 'goutte-posee'; g.textContent = '💧';
        g.style.left = r.width * (0.3 + Math.random() * 0.4) + 'px'; g.style.top = r.height * (0.3 + Math.random() * 0.55) + 'px';
        zone.insertBefore(g, doigt.couche); gouttes.push(g);
      }
      barreActivite('3. Sèche avec la serviette')(0);
      dire(a, 'Sèche-moi avec la serviette toute douce !');
    } else {
      doigt.fin();
      barreActivite('3. Il s\'ébroue !')(1);
      zone.classList.add('ebroue');
      for (let i = 0; i < 10; i++) setTimeout(() => effetSurAnimal('💧', 'corps', 'eclabousse'), i * 60);
      dire(a, 'Brrr ! J\'ai froid… Une serviette, ce serait mieux !');
      setTimeout(() => { zone.classList.remove('ebroue'); terminer(false); }, 1500);
    }
  }
  function terminer(serviette) {
    doigt.fin();
    consommer(a, 'savon');
    extras.forEach(id => consommer(a, id));
    a.proprete = 100;
    appliquer(a, { sante: 3 }, 12 + (moussant ? 10 : 0) + (a.possede.canard ? 5 : 0) + (serviette ? 0 : -8));
    a.brille = Date.now() + (extras.includes('shampooing') ? 4 : 1) * 36e5;
    donnerXp(a, 5);
    sauver();
    finActivite(p);
    montrerHumeur(p, 'joie', 2000);
    confettis(document.getElementById('zoneAnimal'), 30); son('bonus');
    dire(a, `Je suis tout${e(a)} propre et je sens bon ! ✨`);
  }
}
function montrerHumeurActivite(a, humeur) {
  const zone = document.getElementById('zoneAnimal');
  const svg = zone && zone.querySelector('svg');
  if (!svg) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = dessinAnimal(a, { humeur, taches: 0 });
  svg.replaceWith(tmp.firstElementChild);
}

function brosserDents(p) {
  const a = p.animal;
  if (!a.possede['brosse-dents'] || !combien(a, 'dentifrice')) {
    son('faux');
    dire(a, !a.possede['brosse-dents'] ? 'Il me faut une brosse à dents ! 🪥' : 'Il n\'y a plus de dentifrice ! 🦷');
    ouvrirTiroir(p, '🪥 Les dents', [ARTICLE['brosse-dents'], ARTICLE.dentifrice], 'toilette', () => false);
    return;
  }
  activite = 'dents';
  const zone = document.getElementById('zoneAnimal');
  montrerHumeurActivite(a, 'joie');
  const avance = barreActivite('Brosse les dents 🪥');
  dire(a, 'Aaaah ! Brosse bien mes dents, en haut et en bas !');
  const pt = pointAnimal(a, 'bouche');
  let total = 0, derniere = 0;
  const doigt = coucheDoigt(zone, '🪥', (x, y, d) => {
    const r = zone.getBoundingClientRect();
    if (Math.hypot(x - r.width * pt.x / 100, y - r.height * pt.y / 100) > r.width * 0.25) return;
    total += d; derniere += d;
    if (derniere > 25) { derniere = 0; const b = document.createElement('i'); b.className = 'mousse petite'; b.style.cssText = `left:${x + Math.random() * 20 - 10}px;top:${y + Math.random() * 16 - 8}px;width:12px;height:12px`; zone.insertBefore(b, doigt.couche); setTimeout(() => b.remove(), 1500); }
    avance(total / 1400);
    if (total >= 1400) {
      doigt.fin();
      consommer(a, 'dentifrice');
      appliquer(a, { sante: 6, proprete: 5 }, 5);
      donnerXp(a, 3); sauver();
      finActivite(p);
      montrerHumeur(p, 'joie', 1800);
      effetSurAnimal('✨', 'bouche', 'monte'); effetSurAnimal('🦷', 'bouche', 'monte'); son('bonus');
      dire(a, 'Mes dents sont toutes blanches ! ✨');
    }
  });
}

// Petit jeu avec un jouet : attraper l'objet qui bouge (6 fois).
function partieJouet(p, it) {
  const a = p.animal;
  activite = 'jeu';
  const scene = document.getElementById('scene'), zone = document.getElementById('zoneAnimal');
  const avance = barreActivite(`${it.ic} Touche le jouet !`);
  dire(a, it.id === 'ballons' ? 'Éclate les ballons avec moi !' : it.id === 'tambour' ? 'Tape sur le tambour en rythme !' : it.id === 'puzzle' ? 'Trouve les pièces du puzzle !' : 'Lance-moi le jouet, je vais l\'attraper !');
  let n = 0;
  const cible = document.createElement('button');
  cible.className = 'cible-jouet'; cible.textContent = it.ic;
  scene.appendChild(cible);
  const placer = () => { cible.style.left = 10 + Math.random() * 75 + '%'; cible.style.top = 12 + Math.random() * 60 + '%'; cible.classList.remove('apparait'); void cible.offsetWidth; cible.classList.add('apparait'); };
  placer();
  cible.onclick = () => {
    n++;
    avance(n / 6);
    son(it.id === 'tambour' ? 'tic' : 'bon');
    if (it.id === 'ballons') texteVolant(cible, '💥');
    zone.classList.remove('saute'); void zone.offsetWidth; zone.classList.add('saute');
    montrerHumeurActivite(a, 'joie');
    if (n >= 6) {
      cible.remove();
      consommer(a, it.id);
      const fav = it.fav === a.espece;
      appliquer(a, it.ef, fav ? 10 : 0);
      donnerXp(a, 5); sauver();
      finActivite(p);
      montrerHumeur(p, 'joie', 2000);
      coeurs(a, 5); son('bonus');
      dire(a, fav ? 'C\'est mon jeu préféré ! Encore ! 😍' : pioche(['C\'était trop bien ! 🎉', 'Youpi ! On rejoue bientôt ?', 'Je me suis bien amusé' + e(a) + ' !']));
    } else placer();
  };
}

function lireHistoire(p, it) {
  const a = p.animal;
  activite = 'histoire';
  const pages = pioche(HISTOIRES)(a.nom);
  let i = 0;
  const scene = document.getElementById('scene');
  const livre = document.createElement('div');
  livre.className = 'livre-histoire';
  scene.appendChild(livre);
  montrerHumeurActivite(a, 'joie');
  const page = () => {
    livre.innerHTML = `<p>📖 ${echapper(pages[i])}</p><button class="bouton">${i < pages.length - 1 ? 'Page suivante ➜' : 'Fin 💤'}</button>`;
    parler(pages[i]);
    livre.querySelector('button').onclick = () => {
      i++;
      if (i < pages.length) { page(); return; }
      livre.remove(); taire();
      consommer(a, it.id);
      appliquer(a, it.ef);
      donnerXp(a, 5); sauver();
      finActivite(p);
      coeurs(a, 4); son('bon');
      dire(a, 'Merci pour l\'histoire ! J\'adore quand tu me lis des livres. 📚');
    };
  };
  page();
}

function ceremonieGrandir(p) {
  const a = p.animal, st = stadeDe(a.xp);
  if (rangStade(st.id) <= rangStade(a.vuStade)) { a.vuStade = st.id; sauver(); return; }
  a.vuStade = st.id; sauver();
  const scene = document.getElementById('scene');
  if (!scene) return;
  const zone = document.getElementById('zoneAnimal');
  zone.classList.add('grandit');
  confettis(zone, 60); son('bonus');
  const mot = { enfant: 'Maintenant je peux manger de la vraie nourriture !', ado: 'Je suis un' + (a.fille ? 'e' : '') + ' ado maintenant !', adulte: 'Je suis adulte ! Merci de t\'être si bien occupé de moi !' }[st.id] || '';
  const fen = document.createElement('div');
  fen.className = 'fenetre-grandir';
  fen.innerHTML = `<div><div class="gros">🎉</div><b>${echapper(a.nom)} a grandi !</b><p>Âge : ${st.nom}</p><small>${mot}</small><br><button class="bouton">Youpi !</button></div>`;
  scene.appendChild(fen);
  fen.querySelector('button').onclick = () => { fen.remove(); zone.classList.remove('grandit'); };
  dire(a, `J'ai grandi ! ${mot}`);
}

/* ---------- Adoption ---------- */
function adoption(p) {
  const espece = p.niveau === 'CP' ? 'panda' : 'panthere';
  const nomEspece = espece === 'panda' ? 'bébé panda' : 'bébé panthère';
  const temp = { espece, xp: 0, proprete: 100, cacas: 0, tenue: {}, nom: '' };
  let fille = null;
  maitresseActive = p.maitresse;
  afficher('🐾 Adoption', `
    <div class="adoption">
      <p class="sous-titre">Un ${nomEspece} t'attend dans son panier !<br><small>Touche-le pour le réveiller.</small></p>
      <button class="panier" id="panier"><div class="zone-adoption">${dessinAnimal(temp, { humeur: 'dort' })}</div><span class="panier-avant"></span></button>
      <div id="etape"></div>
    </div>`, { retour: true, profil: p });
  parler(`Un ${nomEspece} t'attend dans son panier ! Touche-le pour le réveiller.`);
  document.getElementById('panier').onclick = () => {
    const pan = document.getElementById('panier');
    if (pan.dataset.reveille) return;
    pan.dataset.reveille = 1;
    pan.querySelector('.zone-adoption').innerHTML = dessinAnimal(temp, { humeur: 'joie' });
    pan.classList.add('saute'); confettis(pan, 30); son('bonus');
    document.querySelector('.adoption .sous-titre').innerHTML = 'Ton bébé s\'est réveillé ! 💖';
    choixSexe();
  };
  function choixSexe() {
    document.getElementById('etape').innerHTML = `<p class="sous-titre">C'est une fille ou un garçon ?</p>
      <div class="choix-duo"><button class="bouton" data-f="1" style="background:#ff7eb6">♀ Une fille</button><button class="bouton" data-f="0" style="background:#4f8ef7">♂ Un garçon</button></div>`;
    parler('C\'est une fille ou un garçon ?');
    document.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { fille = b.dataset.f === '1'; choixNom(); });
  }
  function choixNom() {
    document.getElementById('etape').innerHTML = `<p class="sous-titre">Comment ${fille ? 'va-t-elle' : 'va-t-il'} s'appeler ?</p>
      <div class="noms">${NOMS_ANIMAUX[espece].map(n => `<button class="nom-propose">${n}</button>`).join('')}</div>
      <div class="saisie"><input id="nomAnimal" maxlength="14" placeholder="Ou écris un nom" autocomplete="off"><button class="bouton" id="adopter">💖 Adopter</button></div>`;
    parler(`Comment ${fille ? 'va-t-elle' : 'va-t-il'} s'appeler ? Choisis un nom.`);
    const input = document.getElementById('nomAnimal');
    document.querySelectorAll('.nom-propose').forEach(b => b.onclick = () => { input.value = b.textContent; parler(b.textContent); });
    document.getElementById('adopter').onclick = () => {
      const nom = input.value.trim();
      if (!nom) { input.classList.remove('faux'); void input.offsetWidth; input.classList.add('faux'); son('faux'); return; }
      p.animal = nouvelAnimal(p, nom.charAt(0).toUpperCase() + nom.slice(1), fille);
      sauver();
      ecranAnimal(p);
      setTimeout(() => { if (p.animal) dire(p.animal, `Coucou ! Je m'appelle ${p.animal.nom}. Merci de m'adopter ! J'ai un petit cadeau : deux biberons et une couche.`); }, 300);
    };
  }
}

/* ---------- La boutique ---------- */
let rayonBoutique = null;
function boutique(p, rayon) {
  const a = p.animal;
  vivre(a);
  const st = stadeDe(a.xp);
  rayonBoutique = rayon || rayonBoutique || (st.id === 'bebe' ? 'bebe' : 'repas');
  const conseil = conseilBoutique(a);
  maitresseActive = null;
  afficher('🛒 La boutique', `
    <div class="boutique">
      <div class="boutique-haut">
        <div class="porte-monnaie"><span>🐾</span><b id="soldePattes">${p.pattes}</b><small>pattes</small></div>
        <div class="vendeur"><div class="mini-animal">${dessinAnimal(a, { humeur: 'content', serre: true })}</div><div class="bulle petite">${conseil ? conseil.texte : 'Qu\'est-ce que tu vas m\'acheter ? 😊'}${conseil ? `<br><button class="lien-rayon" data-r="${conseil.rayon}">Voir le rayon ${RAYONS.find(r => r.id === conseil.rayon).ic}</button>` : ''}</div></div>
      </div>
      <div class="onglets">${RAYONS.map(r => `<button class="onglet ${r.id === rayonBoutique ? 'actif' : ''}" data-r="${r.id}"><span>${r.ic}</span>${r.nom}</button>`).join('')}</div>
      <div class="rayon" id="rayon"></div>
      <p class="astuce">Les pattes 🐾 se gagnent en faisant les exercices : 2 par bonne réponse, 3 par étoile, 10 pour le défi du jour.</p>
    </div>`, { retour: true, profil: p });
  $ecran.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { rayonBoutique = b.dataset.r; afficherRayon(p); $ecran.querySelectorAll('.onglet').forEach(o => o.classList.toggle('actif', o.dataset.r === rayonBoutique)); });
  afficherRayon(p);
  if (conseil) voixAnimal(a, conseil.texte);
}
function conseilBoutique(a) {
  const bebe = stadeDe(a.xp).id === 'bebe';
  if (a.malade && !combien(a, 'medicament') && !combien(a, 'veterinaire')) return { texte: 'Je suis malade… il me faut un médicament ! 🤒', rayon: 'soins' };
  if (a.couche && !combien(a, 'couches')) return { texte: 'Ma couche est sale et il n\'y en a plus !', rayon: 'bebe' };
  if (a.cacas && !combien(a, 'sacs')) return { texte: 'Il faut des sacs pour ramasser mes crottes !', rayon: 'toilette' };
  if (a.ventre < 50) return { texte: 'J\'ai faim ! Tu m\'achètes à manger ?', rayon: bebe ? 'bebe' : 'repas' };
  if (a.eau < 50) return { texte: 'J\'ai soif ! Une boisson, s\'il te plaît ?', rayon: bebe ? 'bebe' : 'boisson' };
  if (a.proprete < 50 && !combien(a, 'savon')) return { texte: 'Il me faut du savon pour le bain !', rayon: 'toilette' };
  if (a.energie < 40 && !a.possede.lit) return { texte: 'Je voudrais un lit pour dormir… 🛏️', rayon: 'maison' };
  if (a.bonheur < 50) return { texte: 'Un jouet me ferait plaisir !', rayon: 'jouets' };
  return null;
}
function afficherRayon(p) {
  const a = p.animal;
  const liste = CATALOGUE.filter(it => it.cat === rayonBoutique);
  const zone = document.getElementById('rayon');
  let html = '';
  if (rayonBoutique === 'habits') {
    Object.entries(SLOTS).forEach(([slot, nom]) => {
      html += `<h3 class="titre-rayon">${nom}</h3><div class="grille-articles">${liste.filter(it => it.slot === slot).map(it => carteArticle(p, it)).join('')}</div>`;
    });
  } else html = `<div class="grille-articles">${liste.map(it => carteArticle(p, it)).join('')}</div>`;
  zone.innerHTML = html;
  zone.querySelectorAll('.acheter').forEach(b => b.onclick = () => acheter(p, ARTICLE[b.dataset.id], b.closest('.article')));
  zone.querySelectorAll('.mettre').forEach(b => b.onclick = () => { porter(p, ARTICLE[b.dataset.id]); afficherRayon(p); });
}
function carteArticle(p, it) {
  const a = p.animal, propre = { ...a, proprete: 100, couche: false, cacas: 0, brille: 0, pansement: 0 };
  const r = rangStade(stadeDe(a.xp).id);
  const tropJeune = it.min && r < rangStade(it.min), tropGrand = it.max && r > rangStade(it.max);
  const possede = it.durable && a.possede[it.id];
  const visuel = it.slot ? `<div class="apercu">${dessinAnimal(propre, { tenue: { [it.slot]: it.id }, humeur: 'content', serre: true })}</div>`
    : it.decor ? `<div class="apercu decor-${it.decor} mini-decor">${DECORS[it.decor].deco.map(([em, x, y, t]) => `<span style="left:${x}%;top:${y}%;font-size:${t * 0.55}em">${em}</span>`).join('')}</div>`
      : `<div class="ic-grand">${iconeArticle(it)}</div>`;
  const effets = it.ef ? `<div class="effets">${Object.entries(it.ef).map(([k, v]) => `<span class="${v < 0 ? 'moins' : ''}">${JAUGES.find(j => j.id === k).ic} ${v > 0 ? '+' : ''}${v}</span>`).join('')}</div>` : '';
  let bas;
  if (possede && it.slot) bas = `<button class="mettre ${a.tenue[it.slot] === it.id ? 'porte' : ''}" data-id="${it.id}">${a.tenue[it.slot] === it.id ? '✔ Porté' : '👗 Mettre'}</button>`;
  else if (possede && it.decor) bas = `<button class="mettre ${a.decor === it.decor ? 'porte' : ''}" data-id="${it.id}">${a.decor === it.decor ? '✔ Installé' : '🏠 Installer'}</button>`;
  else if (possede) bas = '<span class="deja">✔ À toi</span>';
  else if (tropJeune) bas = `<span class="verrou-age">🔒 Âge ${libelleStade(it.min)}</span>`;
  else if (tropGrand) bas = '<span class="verrou-age">Trop grand' + e(a) + ' maintenant</span>';
  else bas = `<button class="acheter ${p.pattes < it.prix ? 'cher' : ''}" data-id="${it.id}">${it.prix} 🐾</button>`;
  const stock = !it.durable && combien(a, it.id) ? `<span class="stock">🎒 ${combien(a, it.id)}</span>` : '';
  return `<div class="article ${tropJeune || tropGrand ? 'bloque' : ''} ${possede ? 'possede' : ''}">
    ${it.fav === a.espece ? '<span class="ruban">❤️ Son préféré</span>' : ''}${stock}
    ${visuel}
    <b>${it.nom}</b>
    ${it.desc ? `<small>${it.desc}</small>` : ''}
    ${it.usages ? `<small class="usages">${it.usages} utilisations</small>` : ''}
    ${effets}
    <div class="article-bas">${bas}</div>
  </div>`;
}
function acheter(p, it, carte) {
  const a = p.animal;
  if (p.pattes < it.prix) {
    son('faux');
    carte.classList.remove('faux'); void carte.offsetWidth; carte.classList.add('faux');
    const manque = it.prix - p.pattes;
    fenetre(`<div class="gros">🐾</div><p>Il te manque <b>${manque} pattes</b> pour acheter : ${it.nom}.</p><p><small>Fais des exercices pour en gagner !</small></p>`,
      [['📚 Faire des exercices', () => aller(() => matieres(p))], ['OK', null]]);
    voixAnimal(a, `Il te manque ${manque} pattes. Fais des exercices pour en gagner !`);
    return;
  }
  const faire = () => {
    p.pattes -= it.prix;
    if (it.durable) a.possede[it.id] = true;
    else a.sac[it.id] = combien(a, it.id) + (it.usages || 1);
    sauver();
    son('piece');
    texteVolant(carte, `-${it.prix} 🐾`);
    document.getElementById('soldePattes').textContent = p.pattes;
    majBourse(p);
    afficherRayon(p);
    if (it.slot) porter(p, it, true), afficherRayon(p);
    if (it.decor) { a.decor = it.decor; sauver(); afficherRayon(p); }
    const nouvelle = [...document.querySelectorAll('.article')].find(c => c.querySelector(`[data-id="${it.id}"]`) || c.querySelector('b').textContent === it.nom);
    if (nouvelle) { nouvelle.classList.add('achete'); confettis(nouvelle, 14); }
    voixAnimal(a, pioche(['Merci !', 'Super !', 'Youpi, merci !', 'Génial !']));
  };
  if (it.prix >= 100) fenetre(`${it.slot ? `<div class="apercu-fenetre">${dessinAnimal(a, { tenue: { ...a.tenue, [it.slot]: it.id }, humeur: 'joie', taches: 0, serre: true })}</div>` : `<div class="gros">${it.ic}</div>`}<p>Acheter <b>${it.nom}</b> pour <b>${it.prix} 🐾</b> ?</p><small>Il te restera ${p.pattes - it.prix} pattes.</small>`, [['✔ Oui, j\'achète', faire], ['Non', null]]);
  else faire();
}
function porter(p, it, silencieux) {
  const a = p.animal;
  if (it.decor) { a.decor = it.decor; sauver(); return; }
  if (a.tenue[it.slot] === it.id) delete a.tenue[it.slot];
  else a.tenue[it.slot] = it.id;
  sauver();
  if (!silencieux) son('tic');
}
function fenetre(html, boutons) {
  const f = document.createElement('div');
  f.className = 'fenetre';
  f.innerHTML = `<div class="fenetre-boite">${html}<div class="fenetre-boutons">${boutons.map(([t], i) => `<button class="bouton ${i ? 'second' : ''}" data-i="${i}">${t}</button>`).join('')}</div></div>`;
  document.body.appendChild(f);
  f.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { f.remove(); const fn = boutons[b.dataset.i][1]; fn && fn(); });
  f.onclick = ev => { if (ev.target === f) f.remove(); };
}

/* ---------- L'armoire : habiller et décorer ---------- */
let ongletArmoire = 'tete';
function armoire(p) {
  const a = p.animal;
  maitresseActive = null;
  const onglets = [...Object.entries(SLOTS), ['decor', 'Décor']];
  const liste = ongletArmoire === 'decor'
    ? [{ id: 'decor-chambre', decor: 'chambre', nom: 'Ma chambre', ic: '🛏️' }, ...CATALOGUE.filter(it => it.decor && a.possede[it.id])]
    : CATALOGUE.filter(it => it.slot === ongletArmoire && a.possede[it.id]);
  const portes = ongletArmoire === 'decor' ? a.decor : a.tenue[ongletArmoire];
  afficher(`👗 L'armoire de ${a.nom}`, `
    <div class="armoire">
      <div class="scene decor-${a.decor} miroir"><div class="deco">${(DECORS[a.decor] || DECORS.chambre).deco.map(([em, x, y, t]) => `<span style="left:${x}%;top:${y}%;font-size:${t}em">${em}</span>`).join('')}</div><div class="zone-animal">${dessinAnimal(a, { humeur: 'joie', taches: 0 })}</div></div>
      <div class="penderie">
        <div class="onglets">${onglets.map(([id, nom]) => `<button class="onglet ${id === ongletArmoire ? 'actif' : ''}" data-o="${id}">${nom}</button>`).join('')}</div>
        <div class="grille-articles petite">
          ${liste.map(it => `<button class="habit ${(ongletArmoire === 'decor' ? it.decor === portes : it.id === portes) ? 'porte' : ''}" data-id="${it.id}">${iconeArticle(it)}<span>${it.nom}</span></button>`).join('') || '<p class="tiroir-vide">Tu n\'as encore rien ici. Va voir à la boutique ! 🛒</p>'}
        </div>
        <p style="text-align:center"><button class="bouton" id="plusHabits">🛒 Acheter des habits</button> ${Object.keys(a.tenue).length ? '<button class="bouton second" id="toutEnlever">Tout enlever</button>' : ''}</p>
      </div>
    </div>`, { retour: true, profil: p });
  $ecran.querySelectorAll('[data-o]').forEach(b => b.onclick = () => { ongletArmoire = b.dataset.o; armoire(p); });
  $ecran.querySelectorAll('.habit').forEach(b => b.onclick = () => {
    const it = ARTICLE[b.dataset.id] || { decor: 'chambre' };
    porter(p, it);
    armoire(p);
    voixAnimal(a, pioche(['Je suis beau' + (a.fille ? 'lle' : '') + ' ?', 'J\'adore !', 'Trop joli !', 'Merci !']));
  });
  document.getElementById('plusHabits').onclick = () => aller(() => boutique(p, ongletArmoire === 'decor' ? 'maison' : 'habits'));
  const te = document.getElementById('toutEnlever');
  if (te) te.onclick = () => { a.tenue = {}; sauver(); armoire(p); };
}
