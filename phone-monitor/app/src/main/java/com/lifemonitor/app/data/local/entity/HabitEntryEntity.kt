package com.lifemonitor.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "habit_entries")
data class HabitEntryEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String,           // yyyy-MM-dd
    val habitName: String,
    val category: String,       // HEALTH, LEARNING, CAREER, PERSONAL
    val targetMinutes: Int,
    val completedMinutes: Int,
    val isCompleted: Boolean,
    val notes: String = ""
)
