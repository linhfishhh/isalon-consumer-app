package com.isalonbooking;

import android.app.Application;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.FacebookSdk;
import com.facebook.react.ReactApplication;
import com.calendarevents.CalendarEventsPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import com.rnfs.RNFSPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import cl.json.RNSharePackage;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.microsoft.codepush.react.CodePush;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.iou90.autoheightwebview.AutoHeightWebViewPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.BV.LinearGradient.LinearGradientPackage;
import com.horcrux.svg.SvgPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.CallbackManager;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;
import com.krazylabs.OpenAppSettingsPackage;
import com.kishanjvaghela.cardview.RNCardViewPackage;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected String getJSBundleFile(){
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new CalendarEventsPackage(),
            new RNFirebasePackage(),
            new RNFirebaseAuthPackage(),
            new RNFSPackage(),
            new RNFetchBlobPackage(),
            new RNGestureHandlerPackage(),
            new ReanimatedPackage(),
            new RNCWebViewPackage(),
            new FastImageViewPackage(),
            new RNSharePackage(),
            new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
            new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
            new AppCenterReactNativePackage(MainApplication.this),
            new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG),
            new AsyncStoragePackage(),
            new FBSDKPackage(mCallbackManager),
            new ReactNativeOneSignalPackage(),
            new RNGoogleSigninPackage(),
            new AutoHeightWebViewPackage(),
            new SplashScreenReactPackage(),
            new MapsPackage(),
            new RNDeviceInfo(),
            new LinearGradientPackage(),
            new SvgPackage(),
            new VectorIconsPackage(),
            new PickerPackage(),
            new OpenAppSettingsPackage(),
            new RNFusedLocationPackage(),
            new RNCardViewPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.sdkInitialize(getApplicationContext());
    AppEventsLogger.activateApp(this);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
