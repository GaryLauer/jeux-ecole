import com.android.apksig.ApkSigner;
import java.io.*;
import java.security.*;
import java.security.cert.X509Certificate;
import java.util.*;

/** Signe l'APK (schéma v2, suffisant dès Android 7) avec la clé de cle.p12. */
public class Signer {
    public static void main(String[] a) throws Exception {
        char[] mdp = a[2].toCharArray();
        KeyStore ks = KeyStore.getInstance("PKCS12");
        try (InputStream in = new FileInputStream(a[3])) { ks.load(in, mdp); }
        PrivateKey cle = (PrivateKey) ks.getKey("jeux", mdp);
        X509Certificate cert = (X509Certificate) ks.getCertificate("jeux");
        ApkSigner.SignerConfig sc = new ApkSigner.SignerConfig.Builder("jeux", cle, Collections.singletonList(cert)).build();
        new ApkSigner.Builder(Collections.singletonList(sc))
            .setInputApk(new File(a[0])).setOutputApk(new File(a[1]))
            .setMinSdkVersion(24).setV1SigningEnabled(false).setV2SigningEnabled(true)
            .build().sign();
    }
}
