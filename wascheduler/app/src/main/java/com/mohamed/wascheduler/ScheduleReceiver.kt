package com.mohamed.wascheduler

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.net.Uri

class ScheduleReceiver : BroadcastReceiver() {

    companion object {
        const val ACTION = "com.mohamed.wascheduler.SEND_SCHEDULED"
        const val EXTRA_ID = "msg_id"
        const val EXTRA_PHONE = "phone"
        const val EXTRA_MESSAGE = "message"
    }

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != ACTION) return

        val id = intent.getStringExtra(EXTRA_ID) ?: return
        val phone = intent.getStringExtra(EXTRA_PHONE) ?: return
        val message = intent.getStringExtra(EXTRA_MESSAGE) ?: return

        // Arm the pending-send flag so the AccessibilityService can tap Send
        Storage.armPendingSend(context)
        Storage.markSent(context, id)

        val url = "https://api.whatsapp.com/send?phone=${Uri.encode(phone)}&text=${Uri.encode(message)}"

        fun launchIntent(pkg: String): Boolean {
            return try {
                context.startActivity(
                    Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                        setPackage(pkg)
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                )
                true
            } catch (_: Exception) { false }
        }

        val launched = launchIntent("com.whatsapp") || launchIntent("com.whatsapp.w4b")
        if (!launched) Storage.clearPendingSend(context)
    }
}
