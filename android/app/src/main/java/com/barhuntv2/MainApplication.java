package com.barhuntv2;

import android.app.Application;


import com.airbnb.android.react.maps.MapsPackage;

import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import io.invertase.firebase.storage.RNFirebaseStoragePackage; // <-- Add this line
import com.facebook.FacebookSdk;
import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;
import com.evollu.react.fcm.FIRMessagingPackage;

import java.util.Arrays;
import java.util.List;
import android.content.Intent;


public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SvgPackage(),
            new RNFirebasePackage(),
            new VectorIconsPackage(),
            new ImagePickerPackage(),
            new RNGoogleSigninPackage(),
            new RNFirebaseStoragePackage(), // <-- Add this line
            new FBSDKPackage(mCallbackManager),
            new FIRMessagingPackage(),
            new MapsPackage()

      );
    }


    // public void onActivityResult(int requestCode, int resultCode, Intent data) {
    //   super.onActivityResult(requestCode, resultCode, data);
    //   mCallbackManager.onActivityResult(requestCode, resultCode, data);
    // }

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
    SoLoader.init(this, /* native exopackage */ false);
  }
}
