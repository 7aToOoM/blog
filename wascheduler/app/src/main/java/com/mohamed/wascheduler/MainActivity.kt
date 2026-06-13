package com.mohamed.wascheduler

import android.app.AlarmManager
import android.app.DatePickerDialog
import android.app.PendingIntent
import android.app.TimePickerDialog
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.view.LayoutInflater
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SwitchCompat
import java.text.SimpleDateFormat
import java.util.*

class MainActivity : AppCompatActivity() {

    private lateinit var scheduledList: LinearLayout
    private lateinit var autoReplySwitch: SwitchCompat
    private lateinit var rulesContainer: LinearLayout
    private lateinit var alarmManager: AlarmManager
    private val fmt = SimpleDateFormat("MMM dd yyyy, HH:mm", Locale.getDefault())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        alarmManager = getSystemService(ALARM_SERVICE) as AlarmManager

        scheduledList = findViewById(R.id.scheduled_list)
        autoReplySwitch = findViewById(R.id.autoreply_switch)
        rulesContainer = findViewById(R.id.rules_container)

        // ── Permission deep-link buttons ──────────────────────────────────────
        findViewById<Button>(R.id.btn_notification_access).setOnClickListener {
            startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS))
        }
        findViewById<Button>(R.id.btn_accessibility).setOnClickListener {
            startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS))
        }
        findViewById<Button>(R.id.btn_overlay).setOnClickListener {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                startActivity(
                    Intent(
                        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:$packageName")
                    )
                )
            }
        }

        // ── Auto-reply master switch ──────────────────────────────────────────
        autoReplySwitch.isChecked = Storage.isAutoReplyEnabled(this)
        autoReplySwitch.setOnCheckedChangeListener { _, checked ->
            Storage.setAutoReplyEnabled(this, checked)
        }

        // ── Add buttons ───────────────────────────────────────────────────────
        findViewById<Button>(R.id.btn_add_schedule).setOnClickListener {
            showAddScheduleDialog()
        }
        findViewById<Button>(R.id.btn_add_rule).setOnClickListener {
            showAddRuleDialog()
        }

        refreshScheduledList()
        refreshRulesList()
    }

    override fun onResume() {
        super.onResume()
        refreshScheduledList()
        refreshRulesList()
    }

    // ── Scheduled messages list ───────────────────────────────────────────────

    private fun refreshScheduledList() {
        scheduledList.removeAllViews()
        val msgs = Storage.getScheduled(this).sortedBy { it.triggerAtMillis }

        if (msgs.isEmpty()) {
            scheduledList.addView(emptyLabel("No scheduled messages"))
            return
        }

        msgs.forEach { msg ->
            val row = LayoutInflater.from(this)
                .inflate(android.R.layout.simple_list_item_2, scheduledList, false)
            row.findViewById<TextView>(android.R.id.text1).text = "+${msg.phone}"
            row.findViewById<TextView>(android.R.id.text2).text =
                "${fmt.format(Date(msg.triggerAtMillis))}${if (msg.sent) " ✓ sent" else ""} — ${msg.message.take(50)}"
            row.setOnClickListener { confirmDelete(msg) }
            scheduledList.addView(row)
        }
    }

    private fun confirmDelete(msg: ScheduledMessage) {
        AlertDialog.Builder(this)
            .setTitle("Delete scheduled message?")
            .setMessage("To: +${msg.phone}\n${fmt.format(Date(msg.triggerAtMillis))}\n\n${msg.message}")
            .setPositiveButton("Delete") { _, _ ->
                cancelAlarm(msg.id)
                Storage.removeScheduled(this, msg.id)
                refreshScheduledList()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    // ── Auto-reply rules list ─────────────────────────────────────────────────

    private fun refreshRulesList() {
        rulesContainer.removeAllViews()
        val rules = Storage.getRules(this)

        if (rules.isEmpty()) {
            rulesContainer.addView(emptyLabel("No rules. Tap + to add one."))
            return
        }

        rules.forEach { rule ->
            val row = LayoutInflater.from(this)
                .inflate(android.R.layout.simple_list_item_2, rulesContainer, false)
            row.findViewById<TextView>(android.R.id.text1).text =
                if (rule.keyword == "*") "★ ANY message" else "Keyword: \"${rule.keyword}\""
            row.findViewById<TextView>(android.R.id.text2).text =
                "Reply: ${rule.reply.take(60)}"
            row.setOnClickListener {
                AlertDialog.Builder(this)
                    .setTitle("Delete rule?")
                    .setMessage("Keyword: ${rule.keyword}\nReply: ${rule.reply}")
                    .setPositiveButton("Delete") { _, _ ->
                        Storage.removeRule(this, rule.id)
                        refreshRulesList()
                    }
                    .setNegativeButton("Cancel", null)
                    .show()
            }
            rulesContainer.addView(row)
        }
    }

    // ── Dialogs ───────────────────────────────────────────────────────────────

    private fun showAddScheduleDialog() {
        val view = LayoutInflater.from(this).inflate(R.layout.dialog_add_schedule, null)
        val etPhone = view.findViewById<EditText>(R.id.et_phone)
        val etMessage = view.findViewById<EditText>(R.id.et_message)
        val tvDateTime = view.findViewById<TextView>(R.id.tv_datetime)
        val btnPickDate = view.findViewById<Button>(R.id.btn_pick_datetime)

        var selectedCal: Calendar? = null

        btnPickDate.setOnClickListener {
            val now = Calendar.getInstance()
            DatePickerDialog(
                this,
                { _, y, m, d ->
                    TimePickerDialog(
                        this,
                        { _, h, min ->
                            val cal = Calendar.getInstance().apply {
                                set(y, m, d, h, min, 0)
                                set(Calendar.MILLISECOND, 0)
                            }
                            selectedCal = cal
                            tvDateTime.text = fmt.format(cal.time)
                        },
                        now.get(Calendar.HOUR_OF_DAY),
                        now.get(Calendar.MINUTE),
                        true
                    ).show()
                },
                now.get(Calendar.YEAR),
                now.get(Calendar.MONTH),
                now.get(Calendar.DAY_OF_MONTH)
            ).show()
        }

        val dialog = AlertDialog.Builder(this)
            .setTitle("Schedule a Message")
            .setView(view)
            .setPositiveButton("Schedule", null)
            .setNegativeButton("Cancel", null)
            .create()

        dialog.setOnShowListener {
            dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener {
                val phone = etPhone.text.toString().trim().filter { it.isDigit() || it == '+' }
                    .trimStart('+')
                val message = etMessage.text.toString().trim()
                val cal = selectedCal

                when {
                    phone.isBlank() ->
                        toast("Enter a phone number (digits + country code)")
                    message.isBlank() ->
                        toast("Enter a message")
                    cal == null ->
                        toast("Pick a date and time")
                    cal.timeInMillis <= System.currentTimeMillis() ->
                        toast("Pick a time in the future")
                    else -> {
                        scheduleMessage(phone, message, cal.timeInMillis)
                        dialog.dismiss()
                    }
                }
            }
        }
        dialog.show()
    }

    private fun showAddRuleDialog() {
        val view = LayoutInflater.from(this).inflate(R.layout.dialog_add_rule, null)
        val etKeyword = view.findViewById<EditText>(R.id.et_keyword)
        val etReply = view.findViewById<EditText>(R.id.et_reply)

        val dialog = AlertDialog.Builder(this)
            .setTitle("Add Auto-Reply Rule")
            .setMessage("Use * to match every message")
            .setView(view)
            .setPositiveButton("Add", null)
            .setNegativeButton("Cancel", null)
            .create()

        dialog.setOnShowListener {
            dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener {
                val keyword = etKeyword.text.toString().trim()
                val reply = etReply.text.toString().trim()

                when {
                    keyword.isBlank() -> toast("Enter a keyword (or *)")
                    reply.isBlank() -> toast("Enter a reply message")
                    else -> {
                        Storage.addRule(
                            this,
                            AutoReplyRule(UUID.randomUUID().toString(), keyword, reply)
                        )
                        refreshRulesList()
                        dialog.dismiss()
                    }
                }
            }
        }
        dialog.show()
    }

    // ── Alarm helpers ─────────────────────────────────────────────────────────

    private fun scheduleMessage(phone: String, message: String, triggerAtMillis: Long) {
        val id = UUID.randomUUID().toString()
        Storage.addScheduled(this, ScheduledMessage(id, phone, message, triggerAtMillis))

        val intent = Intent(this, ScheduleReceiver::class.java).apply {
            action = ScheduleReceiver.ACTION
            putExtra(ScheduleReceiver.EXTRA_ID, id)
            putExtra(ScheduleReceiver.EXTRA_PHONE, phone)
            putExtra(ScheduleReceiver.EXTRA_MESSAGE, message)
        }
        val pi = PendingIntent.getBroadcast(
            this, id.hashCode(), intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        alarmManager.setAlarmClock(AlarmManager.AlarmClockInfo(triggerAtMillis, null), pi)
        toast("Scheduled for ${fmt.format(Date(triggerAtMillis))}")
        refreshScheduledList()
    }

    private fun cancelAlarm(id: String) {
        val intent = Intent(this, ScheduleReceiver::class.java).apply {
            action = ScheduleReceiver.ACTION
        }
        val pi = PendingIntent.getBroadcast(
            this, id.hashCode(), intent,
            PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
        )
        pi?.let { alarmManager.cancel(it) }
    }

    // ── Utilities ─────────────────────────────────────────────────────────────

    private fun toast(msg: String) =
        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()

    private fun emptyLabel(text: String) = TextView(this).apply {
        this.text = text
        setPadding(16, 12, 16, 12)
        setTextColor(resources.getColor(android.R.color.darker_gray, theme))
    }
}
