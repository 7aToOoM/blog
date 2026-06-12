package com.lifemonitor.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "focus_sessions")
data class FocusSessionEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String,           // yyyy-MM-dd
    val startTime: Long,        // epoch ms
    val endTime: Long,          // epoch ms (0 if in progress)
    val durationMs: Long,
    val goal: String,
    val interruptions: Int = 0,
    val completed: Boolean = false
)
