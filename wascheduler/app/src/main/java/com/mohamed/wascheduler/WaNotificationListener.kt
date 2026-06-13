package com.mohamed.wascheduler

import android.app.Notification
import android.app.PendingIntent
import android.app.RemoteInput
import android.content.Intent
import android.os.Bundle
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification

class WaNotificationListener : NotificationListenerService() {

    companion object {
        private val WA_PACKAGES = setOf("com.whatsapp", "com.whatsapp.w4b")
        private val SKIP_TITLES = setOf("WhatsApp", "WhatsApp Business")
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        if (sbn.packageName !in WA_PACKAGES) return
        if (!Storage.isAutoReplyEnabled(this)) return

        val notification = sbn.notification ?: return

        // Skip group-summary notifications
        if (notification.flags and Notification.FLAG_GROUP_SUMMARY != 0) return

        val extras = notification.extras ?: return
        val title = extras.getCharSequence(Notification.EXTRA_TITLE)?.toString() ?: return
        val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString() ?: return

        // Skip WhatsApp system-level notifications
        if (title in SKIP_TITLES) return

        // Skip call / media style notifications
        val template = extras.getString(Notification.EXTRA_TEMPLATE) ?: ""
        if ("CallStyle" in template || "MediaStyle" in template) return

        // Cooldown: at most one reply per sender per 60 s
        if (Storage.isOnCooldown(this, title)) return

        // First matching rule wins; * matches everything
        val rule = Storage.getRules(this).firstOrNull { r ->
            r.keyword == "*" || text.contains(r.keyword, ignoreCase = true)
        } ?: return

        // Find the inline-reply action
        val replyAction = notification.actions?.firstOrNull { a ->
            a.remoteInputs?.isNotEmpty() == true
        } ?: return

        val remoteInput = replyAction.remoteInputs?.firstOrNull() ?: return

        val replyIntent = Intent()
        val bundle = Bundle()
        bundle.putCharSequence(remoteInput.resultKey, rule.reply)
        RemoteInput.addResultsToIntent(replyAction.remoteInputs!!, replyIntent, bundle)

        try {
            replyAction.actionIntent.send(this, 0, replyIntent)
            Storage.stampCooldown(this, title)
        } catch (_: PendingIntent.CanceledException) {
            // notification expired – ignore
        } catch (_: Exception) {
            // any other error – ignore
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) {}
}
