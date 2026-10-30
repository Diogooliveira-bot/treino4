package br.com.simulador.pccsamc;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.print.PrintAttributes;
import android.print.PrintManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
public class MainActivity extends Activity {
  private WebView webView;
  @SuppressLint("SetJavaScriptEnabled")
  @Override public void onCreate(Bundle state) {
    super.onCreate(state);
    webView = new WebView(this);
    webView.setWebChromeClient(new WebChromeClient());
    webView.setWebViewClient(new WebViewClient());
    WebSettings s = webView.getSettings();
    s.setJavaScriptEnabled(true);
    s.setDomStorageEnabled(true);
    s.setAllowFileAccess(true);
    s.setAllowContentAccess(false);
    s.setAllowFileAccessFromFileURLs(false);
    s.setAllowUniversalAccessFromFileURLs(false);
    webView.addJavascriptInterface(new PrintBridge(), "PCCSPrinter");
    setContentView(webView);
    if(state != null) webView.restoreState(state);
    else webView.loadUrl("file:///android_asset/index.html");
  }
  private void printSimulation() {
    PrintManager pm = (PrintManager)getSystemService(Context.PRINT_SERVICE);
    if(pm!=null && webView!=null) {
      PrintAttributes at = new PrintAttributes.Builder()
        .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
        .setColorMode(PrintAttributes.COLOR_MODE_COLOR).build();
      pm.print("Simulador PCCS AMC",webView.createPrintDocumentAdapter("Simulador PCCS AMC"),at);
    }
  }
  private final class PrintBridge {
    @JavascriptInterface public void printPage() {
      runOnUiThread(() -> printSimulation());
    }
  }
  @Override public void onSaveInstanceState(Bundle state) {
    if(webView!=null) webView.saveState(state);
    super.onSaveInstanceState(state);
  }
  @Override public void onBackPressed() {
    if(webView!=null && webView.canGoBack()) webView.goBack();
    else super.onBackPressed();
  }
  @Override public void onDestroy() {
    if(webView!=null) webView.destroy();
    super.onDestroy();
  }
}
