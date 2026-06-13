# Add project specific ProGuard rules here.
-keepattributes *Annotation*
-keepclassmembers class * extends android.accessibilityservice.AccessibilityService { *; }
-keepclassmembers class * extends android.service.notification.NotificationListenerService { *; }
