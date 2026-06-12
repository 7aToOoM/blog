package com.lifemonitor.app.util

import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.pm.PackageManager
import com.lifemonitor.app.data.local.entity.AppUsageEntity
import java.text.SimpleDateFormat
import java.util.*

data class AppUsageStat(
    val packageName: String,
    val appName: String,
    val totalTimeMs: Long,
    val category: AppCategory,
    val lastUsed: Long
)

enum class AppCategory(val label: String) {
    PRODUCTIVE("Productive"),
    SOCIAL("Social"),
    ENTERTAINMENT("Entertainment"),
    LEARNING("Learning"),
    SYSTEM("System"),
    OTHER("Other")
}

class UsageStatsHelper(private val context: Context) {

    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

    fun hasUsagePermission(): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOps.checkOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            android.os.Process.myUid(),
            context.packageName
        )
        return mode == AppOpsManager.MODE_ALLOWED
    }

    fun getDailyUsageStats(date: String = dateFormat.format(Date())): List<AppUsageStat> {
        val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val cal = Calendar.getInstance()

        // Parse the date and set to start of day
        val targetDate = dateFormat.parse(date) ?: Date()
        cal.time = targetDate
        cal.set(Calendar.HOUR_OF_DAY, 0)
        cal.set(Calendar.MINUTE, 0)
        cal.set(Calendar.SECOND, 0)
        cal.set(Calendar.MILLISECOND, 0)
        val startTime = cal.timeInMillis
        cal.add(Calendar.DAY_OF_MONTH, 1)
        val endTime = cal.timeInMillis

        val stats = usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY, startTime, endTime
        )

        return stats
            .filter { it.totalTimeInForeground > 60_000L } // Filter < 1 min
            .mapNotNull { stat ->
                val appName = getAppName(stat.packageName) ?: return@mapNotNull null
                val category = categorizeApp(stat.packageName)
                if (category == AppCategory.SYSTEM) return@mapNotNull null
                AppUsageStat(
                    packageName = stat.packageName,
                    appName = appName,
                    totalTimeMs = stat.totalTimeInForeground,
                    category = category,
                    lastUsed = stat.lastTimeUsed
                )
            }
            .sortedByDescending { it.totalTimeMs }
    }

    fun toEntities(stats: List<AppUsageStat>, date: String): List<AppUsageEntity> {
        return stats.map { stat ->
            AppUsageEntity(
                date = date,
                packageName = stat.packageName,
                appName = stat.appName,
                totalTimeMs = stat.totalTimeMs,
                category = stat.category.name,
                lastUsed = stat.lastUsed
            )
        }
    }

    private fun getAppName(packageName: String): String? {
        return try {
            val pm = context.packageManager
            val info = pm.getApplicationInfo(packageName, 0)
            // Skip system apps that aren't interesting
            if (info.flags and android.content.pm.ApplicationInfo.FLAG_SYSTEM != 0 &&
                !isInterestingSystemApp(packageName)
            ) return null
            pm.getApplicationLabel(info).toString()
        } catch (e: PackageManager.NameNotFoundException) {
            null
        }
    }

    private fun isInterestingSystemApp(pkg: String) = INTERESTING_SYSTEM_APPS.any { pkg.contains(it) }

    private fun categorizeApp(packageName: String): AppCategory {
        val pkg = packageName.lowercase()
        return when {
            SOCIAL_PACKAGES.any { pkg.contains(it) } -> AppCategory.SOCIAL
            PRODUCTIVE_PACKAGES.any { pkg.contains(it) } -> AppCategory.PRODUCTIVE
            ENTERTAINMENT_PACKAGES.any { pkg.contains(it) } -> AppCategory.ENTERTAINMENT
            LEARNING_PACKAGES.any { pkg.contains(it) } -> AppCategory.LEARNING
            SYSTEM_PACKAGES.any { pkg.contains(it) } -> AppCategory.SYSTEM
            else -> AppCategory.OTHER
        }
    }

    companion object {
        private val SOCIAL_PACKAGES = listOf(
            "com.facebook", "com.instagram", "com.twitter", "com.snapchat",
            "com.tiktok", "com.whatsapp", "org.telegram", "com.reddit",
            "com.discord", "com.linkedin", "com.pinterest", "com.tumblr",
            "com.twitter.android", "com.zhiliaoapp.musically"
        )
        private val PRODUCTIVE_PACKAGES = listOf(
            "com.google.android.gm", "com.slack", "com.microsoft.office",
            "com.microsoft.teams", "com.google.android.apps.docs",
            "com.google.android.calendar", "com.notion.id", "com.trello",
            "com.asana", "com.monday", "com.atlassian", "com.dropbox",
            "com.google.android.keep", "com.todoist", "com.any.do"
        )
        private val ENTERTAINMENT_PACKAGES = listOf(
            "com.netflix", "com.spotify", "com.youtube", "com.amazon.avod",
            "com.hbo", "com.disney", "com.twitch", "com.crunchyroll",
            "com.apple.android", "com.vimeo", "tv.plex"
        )
        private val LEARNING_PACKAGES = listOf(
            "com.duolingo", "com.coursera", "com.udemy", "org.khanacademy",
            "com.readwise", "com.amazon.kindle", "com.google.android.apps.books",
            "com.ted", "com.audible", "com.blinkist", "com.skillshare",
            "com.edx", "com.datacamp"
        )
        private val SYSTEM_PACKAGES = listOf(
            "com.android", "com.google.android.launcher",
            "com.google.android.inputmethod", "android.process",
            "com.sec.android", "com.samsung", "com.xiaomi.systemui",
            "com.huawei.systemmanager"
        )
        private val INTERESTING_SYSTEM_APPS = listOf(
            "com.google.android.dialer", "com.google.android.contacts",
            "com.google.android.messaging"
        )
    }
}
