#!/bin/bash
# Fabrique jeux-ecole.apk sans le SDK Android.
# Besoins : Java 17+, python3, outils/ (dx.jar, apksig.jar), android-all.jar (org.robolectric:android-all, Maven Central) pour compiler.
# La clé cle.p12 doit rester la même d'une version à l'autre (sinon la tablette refuse la mise à jour).
set -e
cd "$(dirname "$0")"
VCODE=${1:-1}; VNAME=${2:-1.0}
ANDROID_JAR=${ANDROID_JAR:-outils/android-all.jar}
MDP=$(cat cle-motdepasse.txt)
rm -rf build && mkdir -p build/classes build/apk/res/mipmap build/apk/assets
javac -nowarn --release 8 -cp "$ANDROID_JAR" -d build/classes $(find src -name '*.java') 2>&1 | grep -v 'JAVA_TOOL_OPTIONS\|warning' || true
java -cp outils/dx.jar com.android.dx.command.Main --dex --min-sdk-version=24 --output=build/apk/classes.dex build/classes 2>&1 | grep -v JAVA_TOOL_OPTIONS || true
python3 fabriquer_ressources.py build/apk "$VCODE" "$VNAME"
cp icone.png build/apk/res/mipmap/ic_launcher.png
cp assets/* build/apk/assets/
( cd build/apk && rm -f ../brut.apk && zip -q -X -0 ../brut.apk resources.arsc res/mipmap/ic_launcher.png && zip -q -X -9 ../brut.apk AndroidManifest.xml classes.dex assets/* )
javac -nowarn -cp outils/apksig.jar -d build Signer.java 2>&1 | grep -v JAVA_TOOL_OPTIONS || true
java --add-exports java.base/sun.security.x509=ALL-UNNAMED -cp outils/apksig.jar:build Signer build/brut.apk jeux-ecole.apk "$MDP" cle.p12 2>&1 | grep -v JAVA_TOOL_OPTIONS || true
ls -la jeux-ecole.apk
