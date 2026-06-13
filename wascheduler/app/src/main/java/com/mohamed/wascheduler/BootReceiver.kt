package com.mohamed.wascheduler

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED) return

        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val now = System.currentTimeMillis()

        Storage.getScheduled(context)
            .filter { !it.sent && it.triggerAtMillis > now }
            .forEach { msg ->
                val alarmIntent = Intent(context, ScheduleReceiver::class.java).apply {
                    action = ScheduleReceiver.ACTION
                    putExtra(ScheduleReceiver.EXTRA_ID, msg.id)
                    putExtra(ScheduleReceiver.EXTRA_PHONE, msg.phone)
                    putExtra(ScheduleReceiver.EXTRA_MESSAGE, msg.message)
                }
                val pi = PendingIntent.getBroadcast(
                    context, msg.id.hashCode(), alarmIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
                alarmManager.setAlarmClock(
                    AlarmManager.AlarmClockInfo(msg.triggerAtMillis, null),
                    pi
                )
            }
    }
}
