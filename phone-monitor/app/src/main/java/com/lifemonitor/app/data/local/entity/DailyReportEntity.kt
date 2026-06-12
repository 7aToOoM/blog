package com.lifemonitor.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "daily_reports")
data class DailyReportEntity(
    @PrimaryKey val date: String,   // yyyy-MM-dd
    val totalScreenTimeMs: Long,
    val productiveTimeMs: Long,
    val socialTimeMs: Long,
    val entertainmentTimeMs: Long,
    val learningTimeMs: Long,
    val productivityScore: Int,
    val focusSessionCount: Int,
    val totalFocusTimeMs: Long,
    val habitsCompleted: Int,
    val habitsTotalCount: Int,
    val aiReport: String,           // Full Claude response
    val generatedAt: Long           // epoch ms
)
