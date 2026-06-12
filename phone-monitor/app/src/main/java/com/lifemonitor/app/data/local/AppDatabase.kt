package com.lifemonitor.app.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.lifemonitor.app.data.local.dao.*
import com.lifemonitor.app.data.local.entity.*

@Database(
    entities = [
        AppUsageEntity::class,
        HabitEntryEntity::class,
        FocusSessionEntity::class,
        DailyReportEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun appUsageDao(): AppUsageDao
    abstract fun habitEntryDao(): HabitEntryDao
    abstract fun focusSessionDao(): FocusSessionDao
    abstract fun dailyReportDao(): DailyReportDao
}
