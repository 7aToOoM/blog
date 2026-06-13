package com.mohamed.wascheduler

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class SendAccessibilityService : AccessibilityService() {

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        if (!Storage.isPendingSend(this)) return

        // Only act on WhatsApp events
        val pkg = event.packageName?.toString() ?: return
        if (pkg != "com.whatsapp" && pkg != "com.whatsapp.w4b") return

        val root = rootInActiveWindow ?: return

        val sendButton = root.findAccessibilityNodeInfosByViewId("$pkg:id/send")
            .firstOrNull { it.isEnabled && it.isClickable }

        if (sendButton != null) {
            sendButton.performAction(AccessibilityNodeInfo.ACTION_CLICK)
            Storage.clearPendingSend(this)
            performGlobalAction(GLOBAL_ACTION_HOME)
        }

        root.recycle()
    }

    override fun onInterrupt() {}
}
