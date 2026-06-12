# Building the LuxeFurnish APK

## Prerequisites

Install on your local machine:
- [Android Studio](https://developer.android.com/studio) (includes the Android SDK)
- Node.js 18+ and npm

## Steps

### 1. Clone and install

```bash
git clone <repo-url>
cd blog
npm install
```

### 2. Export the web app and sync to Android

```bash
npm run cap:sync
```

This runs `next build && next export && cap sync android`, which:
- Builds the static web app into the `out/` folder
- Copies it into `android/app/src/main/assets/public/`

### 3. Open in Android Studio

```bash
npx cap open android
```

Android Studio will open the `android/` project.

### 4. Build the APK

In Android Studio:
1. Wait for Gradle sync to finish
2. Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. The APK will be at:
   `android/app/build/outputs/apk/debug/app-debug.apk`

### 5. Install on a device

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

Or drag-drop the `.apk` file onto an Android emulator.

---

## App Details

| Field | Value |
|-------|-------|
| App ID | `com.luxefurnish.app` |
| App Name | LuxeFurnish |
| Min Android SDK | 22 (Android 5.1+) |
| Web assets directory | `out/` |

## Architecture

The APK is a native Android WebView wrapper powered by Capacitor. All app data (products, services, orders, cart) is stored in the device's **localStorage** — no internet connection or server required.

### Admin access
- Open the app → tap **Admin** in the header → login with password `admin123`
- You can change the password in `context/AdminContext.js` (`NEXT_PUBLIC_ADMIN_PASSWORD`)
