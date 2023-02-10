package com.isalonbooking;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Bundle; // here
import org.devio.rn.splashscreen.SplashScreen; // here
import android.content.Intent;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.ReactActivity;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MainActivity extends ReactActivity {

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
        // showHashKey(this);
    }
    protected String getMainComponentName() {
        return "iSalonBooking";
    }

    public  void showHashKey(Context context) {
        try {
            PackageInfo info = context.getPackageManager().getPackageInfo("com.isalonbooking",
                    PackageManager.GET_SIGNATURES);
            for (android.content.pm.Signature signature : info.signatures) {
                MessageDigest md = MessageDigest.getInstance("SHA");
                md.update(signature.toByteArray());

                String sign= Base64.encodeToString(md.digest(), Base64.DEFAULT);
                Log.e("KeyHash:", sign);
                //  Toast.makeText(getApplicationContext(),sign,     Toast.LENGTH_LONG).show();
            }
            Log.d("KeyHash:", "****------------***");
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
    }

}
