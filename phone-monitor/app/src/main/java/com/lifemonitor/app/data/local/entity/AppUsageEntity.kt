package com.lifemonitor.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "app_usage")
data class AppUsageEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String,              // yyyy-MM-dd
    val packageName: String,
    val appName: String,
    val totalTimeMs: Long,
    val category: String,          // SOCIAL, PRODUCTIVE, ENTERTAINMENT, LEARNING, OTHER
    val lastUsed: Long
)
