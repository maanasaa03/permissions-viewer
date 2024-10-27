package com.yourname.permissionviewer;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

public class AppPermissionsModule extends ReactContextBaseJavaModule {

    public AppPermissionsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AppPermissions";
    }

    @ReactMethod
    public void getInstalledAppsWithPermissions(Promise promise) {
        PackageManager pm = getReactApplicationContext().getPackageManager();
        WritableArray appsArray = Arguments.createArray();

        for (PackageInfo packageInfo : pm.getInstalledPackages(PackageManager.GET_PERMISSIONS)) {
            WritableMap appData = Arguments.createMap();
            appData.putString("appName", packageInfo.applicationInfo.loadLabel(pm).toString());
            appData.putString("packageName", packageInfo.packageName);

            WritableArray permissionsArray = Arguments.createArray();

            if (packageInfo.requestedPermissions != null) {
                for (String permission : packageInfo.requestedPermissions) {
                    permissionsArray.pushString(permission);
                }
            }

            appData.putArray("permissions", permissionsArray);
            appsArray.pushMap(appData);
        }

        promise.resolve(appsArray);
    }
}

