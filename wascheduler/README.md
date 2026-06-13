# WA Scheduler

**⚠ Warning: Uses unofficial WhatsApp automation (Accessibility Service + Notification APIs). This violates WhatsApp's Terms of Service and may result in your number being banned. Use at your own risk.**

An Android app for scheduling WhatsApp messages and auto-replying to incoming messages based on keyword rules.

---

## Features

1. **Scheduled Messages** — Pick a phone number, message text, and a future date/time. The alarm fires exactly via `AlarmManager.setAlarmClock`, opens WhatsApp with the message pre-filled, and the Accessibility Service taps Send automatically.

2. **Auto-Reply** — Add keyword→reply rules. When an incoming WhatsApp notification matches a keyword, the app replies silently via the notification's inline-reply `RemoteInput` (WhatsApp never opens). A `*` wildcard matches all messages. One reply per sender per 60 seconds (loop protection).

---

## Build from source

### Prerequisites
- JDK 17 (Temurin/OpenJDK)
- Android SDK with: `platforms;android-34`, `build-tools;34.0.0`
- `ANDROID_HOME` environment variable set

### Build steps

```bash
cd wascheduler
chmod +x gradlew
./gradlew assembleDebug
```

APK output: `app/build/outputs/apk/debug/app-debug.apk`

### Install to device

```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

---

## First-run setup (required permissions)

After installing, open the app and tap all three buttons in the **Permissions** section:

### 1. Notification Access
*Settings → Special App Access → Notification Access → WA Scheduler → Enable*

Required for auto-reply. The app reads incoming WhatsApp notifications and replies via `RemoteInput`.

### 2. Accessibility Service
*Settings → Accessibility → Downloaded Apps → WA Scheduler – Send button tapper → Enable*

Required for scheduled send. After the alarm fires and WhatsApp opens with the pre-filled message, the accessibility service taps the Send button once, then goes home.

### 3. Display Over Other Apps
*Settings → Special App Access → Display Over Other Apps → WA Scheduler → Allow*

Required on Android 10+ so the alarm receiver can launch WhatsApp from the background.

---

## Battery optimization

**Disable battery optimization for WA Scheduler** to ensure alarms fire on time:

*Settings → Battery → Battery Optimization → All Apps → WA Scheduler → Don't Optimize*

Without this, Doze mode may delay alarms.

---

## Limitations

- **Locked screen**: When the alarm fires on a device with a secure lock screen (PIN/pattern/fingerprint), WhatsApp opens but the auto-tap by the Accessibility Service may fail because the screen needs to be unlocked first. The message text will be pre-filled in WhatsApp — you just need to tap Send manually. On devices without a secure lock screen, fully automatic sending works.
- **WhatsApp updates**: If WhatsApp changes its internal view IDs, the auto-tap may stop working. The fallback is always the pre-filled message ready to send manually.
- **Business accounts**: The app tries `com.whatsapp` first, then `com.whatsapp.w4b` (WhatsApp Business) as fallback.
- **Group messages**: Auto-reply works on individual chats. Group message replies may reach the group — use with care.

---

## Architecture

| File | Role |
|------|------|
| `MainActivity.kt` | UI, dialogs, alarm scheduling |
| `Storage.kt` | JSON persistence, pending-send flag, cooldown tracking |
| `ScheduleReceiver.kt` | Alarm → opens WhatsApp chat, arms pending-send flag |
| `SendAccessibilityService.kt` | Taps Send button while pending-send flag is active |
| `WaNotificationListener.kt` | Auto-reply via `RemoteInput` |
| `BootReceiver.kt` | Re-registers alarms after device reboot |
