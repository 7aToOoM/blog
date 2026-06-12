package com.lifemonitor.app.util

import com.lifemonitor.app.data.local.entity.AppUsageEntity

object ProductivityScorer {

    fun calculate(
        usageList: List<AppUsageEntity>,
        habitsCompleted: Int,
        habitsTotalCount: Int,
        focusSessionCount: Int,
        totalFocusTimeMs: Long
    ): Int {
        val totalScreenTimeMs = usageList.sumOf { it.totalTimeMs }
        if (totalScreenTimeMs == 0L) return 50

        val productiveMs = usageList.filter { it.category == AppCategory.PRODUCTIVE.name }.sumOf { it.totalTimeMs }
        val learningMs = usageList.filter { it.category == AppCategory.LEARNING.name }.sumOf { it.totalTimeMs }
        val socialMs = usageList.filter { it.category == AppCategory.SOCIAL.name }.sumOf { it.totalTimeMs }
        val entertainmentMs = usageList.filter { it.category == AppCategory.ENTERTAINMENT.name }.sumOf { it.totalTimeMs }

        // Base score from app usage distribution (50% weight)
        val usageScore = run {
            val positiveRatio = (productiveMs + learningMs).toFloat() / totalScreenTimeMs
            val negativeRatio = (socialMs + entertainmentMs).toFloat() / totalScreenTimeMs
            ((positiveRatio * 100 - negativeRatio * 50) * 0.5f).coerceIn(0f, 50f)
        }

        // Habit completion score (30% weight)
        val habitScore = if (habitsTotalCount > 0) {
            (habitsCompleted.toFloat() / habitsTotalCount * 30f)
        } else 15f

        // Focus session score (20% weight)
        val focusScore = run {
            val focusHours = totalFocusTimeMs / 3_600_000f
            (focusHours.coerceAtMost(4f) / 4f * 20f)
        }

        return (usageScore + habitScore + focusScore).toInt().coerceIn(0, 100)
    }

    fun formatDuration(ms: Long): String {
        val totalMinutes = ms / 60_000
        val hours = totalMinutes / 60
        val minutes = totalMinutes % 60
        return when {
            hours > 0 -> "${hours}h ${minutes}m"
            else -> "${minutes}m"
        }
    }
}
