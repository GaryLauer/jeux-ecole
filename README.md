# Mes Petits Jeux d'École

Jeux éducatifs du CP au CM2 (maths, français, monde, histoire, géographie, sciences, anglais).
Application web installable sur tablette, qui fonctionne sans internet.

Installation sur Android : installer le fichier `jeux-ecole.apk`, ou ouvrir le site dans Chrome, menu ⋮, « Ajouter à l'écran d'accueil ».

Mises à jour : changer `CACHE` dans `sw.js` à chaque modification. Un bouton vert 🔄 apparaît alors dans l'appli ; un toucher installe la nouvelle version sans perdre les progrès.

Mon animal : la grande élève une panthère bleu foncé, la petite un panda (animal.js, animal-dessin.js). Il grandit (bébé, enfant, ado, adulte) avec l'XP des exercices. Tout ce qu'on lui donne s'achète à la boutique avec les pattes 🐾, gagnées seulement en faisant les exercices.

Classes : CP, CE1, CE2, CM1, CM2 (contenu dans jeux.js, cp-plus.js, cm1-plus.js, ce1.js, ce2.js, cm2.js ; petits cours du bouton « ? » dans cours.js et en bas de ce1.js, ce2.js, cm2.js). L'enfant choisit sa classe dans « Apprendre ». Sa vraie classe se règle dans l'espace parents : une classe en dessous, il gagne ses points normalement ; deux classes ou plus en dessous, il peut jouer mais ne gagne rien.

Vérifier le contenu : `node outils/verifier.js` (ou `node outils/verifier.js CE2` pour une seule classe).
