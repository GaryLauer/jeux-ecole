# Appli Android (APK)

Petite coquille Android qui ouvre https://garylauer.github.io/jeux-ecole/ en plein écran.
Le contenu vient du site : pour faire évoluer l'appli, on modifie le site et on change `CACHE` dans `sw.js`.
Sur la tablette, un bouton vert 🔄 apparaît alors en haut ; un toucher installe la nouvelle version.

La coquille prête aussi à la page la voix d'Android (maîtresses, anglais) et le micro (cours d'anglais), voir `android.js`.

Fabriquer l'APK (sans le SDK Android) : `bash fabriquer.sh <versionCode> <versionName>`.
Il faut `outils/dx.jar` (com.jakewharton.android.repackaged:dalvik-dx), `outils/apksig.jar` (com.android.tools.build:apksig 2.3.0),
`ANDROID_JAR` = org.robolectric:android-all (Maven Central), et la clé `cle.p12` + `cle-motdepasse.txt`, gardées hors du dépôt.
La même clé doit servir à chaque nouvelle version de l'APK, sinon Android refuse la mise à jour.
