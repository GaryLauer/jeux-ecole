package fr.lauer.jeuxecole;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Locale;

/**
 * Coquille Android de « Mes Petits Jeux d'École » : affiche l'appli en ligne
 * (qui se met à jour toute seule et marche hors ligne grâce à son service worker)
 * et lui prête la voix et le micro d'Android.
 */
public class MainActivity extends Activity {
    static final String ADRESSE = "https://garylauer.github.io/jeux-ecole/";
    static final String ORIGINE = "https://garylauer.github.io/";
    static final int DEMANDE_MICRO = 1;

    WebView web;
    TextToSpeech tts;
    boolean ttsPret = false;
    final ArrayList<String[]> enAttente = new ArrayList<>();
    SpeechRecognizer reco;
    String recoLangue = null;
    boolean pageErreur = false;

    @Override
    protected void onCreate(Bundle etat) {
        super.onCreate(etat);
        Window w = getWindow();
        w.addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        w.setStatusBarColor(Color.parseColor("#ff8a3d"));

        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#fff8ec"));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setTextZoom(100);
        web.addJavascriptInterface(new Pont(), "AndroidVoix");
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                String u = r.getUrl().toString();
                if (u.startsWith(ORIGINE)) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, r.getUrl())); } catch (Exception e) {}
                return true;
            }
            @Override
            public void onReceivedError(WebView v, WebResourceRequest r, WebResourceError e) {
                if (r.isForMainFrame()) horsLigne();
            }
            @Override
            public void onReceivedHttpError(WebView v, WebResourceRequest r, WebResourceResponse e) {
                if (r.isForMainFrame() && e.getStatusCode() >= 400) horsLigne();
            }
        });
        setContentView(web);

        tts = new TextToSpeech(this, new TextToSpeech.OnInitListener() {
            @Override public void onInit(int statut) {
                runOnUiThread(new Runnable() { public void run() {
                    ttsPret = statut == TextToSpeech.SUCCESS;
                    for (String[] p : enAttente) parlerMaintenant(p);
                    enAttente.clear();
                }});
            }
        });
        tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
            @Override public void onStart(String id) { evenement("voix", id, "start"); }
            @Override public void onDone(String id) { evenement("voix", id, "end"); }
            @Override public void onError(String id) { evenement("voix", id, "error"); }
            @Override public void onStop(String id, boolean interrompu) { evenement("voix", id, "error"); }
        });

        if (etat != null) web.restoreState(etat);
        else web.loadUrl(ADRESSE);
    }

    @Override protected void onSaveInstanceState(Bundle etat) { super.onSaveInstanceState(etat); web.saveState(etat); }

    void horsLigne() {
        if (pageErreur) return;
        pageErreur = true;
        String html = lireAsset("hors-ligne.html");
        web.loadDataWithBaseURL("https://appli.locale/", html, "text/html", "utf-8", null);
    }

    String lireAsset(String nom) {
        try (InputStream in = getAssets().open(nom)) {
            ByteArrayOutputStream o = new ByteArrayOutputStream();
            byte[] b = new byte[4096]; int n;
            while ((n = in.read(b)) > 0) o.write(b, 0, n);
            return o.toString("UTF-8");
        } catch (Exception e) { return "Pas de connexion internet."; }
    }

    void evenement(final String quoi, final String id, final String type) {
        runOnUiThread(new Runnable() { public void run() {
            web.evaluateJavascript("window.__androidVoix&&window.__androidVoix(" + js(quoi) + "," + js(id) + "," + js(type) + ")", null);
        }});
    }

    void resultat(final String json) {
        runOnUiThread(new Runnable() { public void run() {
            web.evaluateJavascript("window.__androidVoix&&window.__androidVoix('reco','','result'," + json + ")", null);
        }});
    }

    static String js(String s) {
        StringBuilder b = new StringBuilder("\"");
        for (char c : s.toCharArray()) {
            if (c == '"' || c == '\\') b.append('\\').append(c);
            else if (c < 32 || c == 0x2028 || c == 0x2029) b.append(String.format("\\u%04x", (int) c));
            else b.append(c);
        }
        return b.append('"').toString();
    }

    void parlerMaintenant(String[] p) {
        if (!ttsPret) { evenement("voix", p[0], "error"); return; }
        tts.setLanguage(Locale.forLanguageTag(p[2]));
        tts.setSpeechRate(Float.parseFloat(p[3]));
        tts.setPitch(Float.parseFloat(p[4]));
        Bundle b = new Bundle();
        tts.speak(p[1], TextToSpeech.QUEUE_ADD, b, p[0]);
    }

    void ecouter(String langue) {
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            recoLangue = langue;
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, DEMANDE_MICRO);
            return;
        }
        if (!SpeechRecognizer.isRecognitionAvailable(this)) { evenement("reco", "", "audio-capture"); return; }
        if (reco != null) reco.destroy();
        reco = SpeechRecognizer.createSpeechRecognizer(this);
        reco.setRecognitionListener(new RecognitionListener() {
            public void onReadyForSpeech(Bundle p) {}
            public void onBeginningOfSpeech() {}
            public void onRmsChanged(float r) {}
            public void onBufferReceived(byte[] b) {}
            public void onEndOfSpeech() {}
            public void onPartialResults(Bundle p) {}
            public void onEvent(int t, Bundle p) {}
            public void onError(int e) {
                String err;
                switch (e) {
                    case SpeechRecognizer.ERROR_NETWORK: case SpeechRecognizer.ERROR_NETWORK_TIMEOUT: case SpeechRecognizer.ERROR_SERVER: err = "network"; break;
                    case SpeechRecognizer.ERROR_NO_MATCH: case SpeechRecognizer.ERROR_SPEECH_TIMEOUT: err = "no-speech"; break;
                    case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS: err = "not-allowed"; break;
                    case SpeechRecognizer.ERROR_CLIENT: err = "aborted"; break;
                    default: err = "audio-capture";
                }
                evenement("reco", "", err);
            }
            public void onResults(Bundle r) {
                ArrayList<String> textes = r.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                float[] conf = r.getFloatArray(SpeechRecognizer.CONFIDENCE_SCORES);
                StringBuilder b = new StringBuilder("[");
                if (textes != null) for (int i = 0; i < textes.size(); i++) {
                    if (i > 0) b.append(',');
                    float c = conf != null && i < conf.length && conf[i] >= 0 ? conf[i] : 0;
                    b.append("{\"t\":").append(js(textes.get(i))).append(",\"c\":").append(c).append('}');
                }
                resultat(b.append(']').toString());
            }
        });
        Intent i = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE, langue);
        i.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5);
        i.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, getPackageName());
        reco.startListening(i);
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] perms, int[] res) {
        if (code != DEMANDE_MICRO) return;
        String langue = recoLangue; recoLangue = null;
        if (res.length > 0 && res[0] == PackageManager.PERMISSION_GRANTED && langue != null) ecouter(langue);
        else evenement("reco", "", "not-allowed");
    }

    /** Ce que la page peut appeler (window.AndroidVoix). */
    class Pont {
        @JavascriptInterface public void parler(final String id, final String texte, final String langue, final float vitesse, final float hauteur) {
            runOnUiThread(new Runnable() { public void run() {
                String[] p = {id, texte, langue, String.valueOf(vitesse), String.valueOf(hauteur)};
                if (tts == null || (!ttsPret && enAttente.size() < 50)) enAttente.add(p); else parlerMaintenant(p);
            }});
        }
        @JavascriptInterface public void taire() {
            runOnUiThread(new Runnable() { public void run() { enAttente.clear(); if (tts != null) tts.stop(); }});
        }
        @JavascriptInterface public void ecouter(final String langue) {
            runOnUiThread(new Runnable() { public void run() { MainActivity.this.ecouter(langue); }});
        }
        @JavascriptInterface public void arreterEcoute() {
            runOnUiThread(new Runnable() { public void run() { if (reco != null) reco.cancel(); }});
        }
        @JavascriptInterface public void recharger() {
            runOnUiThread(new Runnable() { public void run() { pageErreur = false; web.loadUrl(ADRESSE); }});
        }
        @JavascriptInterface public int version() { return 1; }
    }

    @Override
    public void onBackPressed() {
        web.evaluateJavascript("(function(){var b=document.getElementById('retour');if(b&&!b.hidden){b.click();return 1}return 0})()",
            new android.webkit.ValueCallback<String>() {
                public void onReceiveValue(String v) { if (!"1".equals(v)) moveTaskToBack(true); }
            });
    }

    @Override protected void onPause() { super.onPause(); if (tts != null) tts.stop(); web.onPause(); }
    @Override protected void onResume() { super.onResume(); web.onResume(); }
    @Override protected void onDestroy() {
        if (tts != null) tts.shutdown();
        if (reco != null) reco.destroy();
        web.destroy();
        super.onDestroy();
    }
}
