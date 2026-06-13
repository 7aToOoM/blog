package com.mohamed.wascheduler

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONArray
import org.json.JSONObject

data class ScheduledMessage(
    val id: String,
    val phone: String,
    val message: String,
    val triggerAtMillis: Long,
    val sent: Boolean = false
)

data class AutoReplyRule(
    val id: String,
    val keyword: String,
    val reply: String
)

object Storage {
    private const val PREFS = "wa_scheduler"
    private const val KEY_SCHEDULED = "scheduled_messages"
    private const val KEY_RULES = "autoreply_rules"
    private const val KEY_AUTOREPLY_ENABLED = "autoreply_enabled"
    private const val KEY_PENDING_SEND = "pending_send"
    private const val KEY_PENDING_SEND_EXPIRY = "pending_send_expiry"
    private const val PREFIX_COOLDOWN = "cooldown_"

    private fun prefs(ctx: Context): SharedPreferences =
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    // ── Scheduled messages ──────────────────────────────────────────────────

    fun getScheduled(ctx: Context): List<ScheduledMessage> {
        val json = prefs(ctx).getString(KEY_SCHEDULED, "[]") ?: "[]"
        return try {
            val arr = JSONArray(json)
            (0 until arr.length()).map { parseMessage(arr.getJSONObject(it)) }
        } catch (e: Exception) { emptyList() }
    }

    fun saveScheduled(ctx: Context, msgs: List<ScheduledMessage>) {
        val arr = JSONArray()
        msgs.forEach { arr.put(toJson(it)) }
        prefs(ctx).edit().putString(KEY_SCHEDULED, arr.toString()).apply()
    }

    fun addScheduled(ctx: Context, msg: ScheduledMessage) =
        saveScheduled(ctx, getScheduled(ctx) + msg)

    fun removeScheduled(ctx: Context, id: String) =
        saveScheduled(ctx, getScheduled(ctx).filter { it.id != id })

    fun markSent(ctx: Context, id: String) =
        saveScheduled(ctx, getScheduled(ctx).map { if (it.id == id) it.copy(sent = true) else it })

    private fun parseMessage(o: JSONObject) = ScheduledMessage(
        id = o.getString("id"),
        phone = o.getString("phone"),
        message = o.getString("message"),
        triggerAtMillis = o.getLong("triggerAtMillis"),
        sent = o.optBoolean("sent", false)
    )

    private fun toJson(m: ScheduledMessage) = JSONObject().apply {
        put("id", m.id)
        put("phone", m.phone)
        put("message", m.message)
        put("triggerAtMillis", m.triggerAtMillis)
        put("sent", m.sent)
    }

    // ── Auto-reply rules ────────────────────────────────────────────────────

    fun getRules(ctx: Context): List<AutoReplyRule> {
        val json = prefs(ctx).getString(KEY_RULES, "[]") ?: "[]"
        return try {
            val arr = JSONArray(json)
            (0 until arr.length()).map { parseRule(arr.getJSONObject(it)) }
        } catch (e: Exception) { emptyList() }
    }

    fun saveRules(ctx: Context, rules: List<AutoReplyRule>) {
        val arr = JSONArray()
        rules.forEach { arr.put(toJson(it)) }
        prefs(ctx).edit().putString(KEY_RULES, arr.toString()).apply()
    }

    fun addRule(ctx: Context, rule: AutoReplyRule) =
        saveRules(ctx, getRules(ctx) + rule)

    fun removeRule(ctx: Context, id: String) =
        saveRules(ctx, getRules(ctx).filter { it.id != id })

    private fun parseRule(o: JSONObject) = AutoReplyRule(
        id = o.getString("id"),
        keyword = o.getString("keyword"),
        reply = o.getString("reply")
    )

    private fun toJson(r: AutoReplyRule) = JSONObject().apply {
        put("id", r.id)
        put("keyword", r.keyword)
        put("reply", r.reply)
    }

    // ── Auto-reply master switch ─────────────────────────────────────────────

    fun isAutoReplyEnabled(ctx: Context) =
        prefs(ctx).getBoolean(KEY_AUTOREPLY_ENABLED, false)

    fun setAutoReplyEnabled(ctx: Context, enabled: Boolean) {
        prefs(ctx).edit().putBoolean(KEY_AUTOREPLY_ENABLED, enabled).apply()
    }

    // ── Pending-send flag (armed by alarm, consumed by accessibility service) ──

    fun armPendingSend(ctx: Context) {
        prefs(ctx).edit()
            .putBoolean(KEY_PENDING_SEND, true)
            .putLong(KEY_PENDING_SEND_EXPIRY, System.currentTimeMillis() + 90_000L)
            .apply()
    }

    fun isPendingSend(ctx: Context): Boolean {
        val p = prefs(ctx)
        if (!p.getBoolean(KEY_PENDING_SEND, false)) return false
        if (System.currentTimeMillis() > p.getLong(KEY_PENDING_SEND_EXPIRY, 0L)) {
            clearPendingSend(ctx)
            return false
        }
        return true
    }

    fun clearPendingSend(ctx: Context) {
        prefs(ctx).edit()
            .putBoolean(KEY_PENDING_SEND, false)
            .putLong(KEY_PENDING_SEND_EXPIRY, 0L)
            .apply()
    }

    // ── Per-sender cooldown (60-second auto-reply loop protection) ──────────

    fun isOnCooldown(ctx: Context, sender: String): Boolean {
        val last = prefs(ctx).getLong(PREFIX_COOLDOWN + sender, 0L)
        return (System.currentTimeMillis() - last) < 60_000L
    }

    fun stampCooldown(ctx: Context, sender: String) {
        prefs(ctx).edit()
            .putLong(PREFIX_COOLDOWN + sender, System.currentTimeMillis())
            .apply()
    }
}
