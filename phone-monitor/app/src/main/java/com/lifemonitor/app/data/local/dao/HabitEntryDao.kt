package com.lifemonitor.app.data.local.dao

import androidx.room.*
import com.lifemonitor.app.data.local.entity.HabitEntryEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface HabitEntryDao {
    @Query("SELECT * FROM habit_entries WHERE date = :date ORDER BY category, habitName")
    fun getHabitsForDate(date: String): Flow<List<HabitEntryEntity>>

    @Query("SELECT * FROM habit_entries WHERE date >= :startDate ORDER BY date DESC")
    fun getHabitsFromDate(startDate: String): Flow<List<HabitEntryEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(entry: HabitEntryEntity): Long

    @Update
    suspend fun update(entry: HabitEntryEntity)

    @Delete
    suspend fun delete(entry: HabitEntryEntity)

    @Query("SELECT COUNT(*) FROM habit_entries WHERE date = :date AND isCompleted = 1")
    suspend fun getCompletedCount(date: String): Int

    @Query("SELECT COUNT(*) FROM habit_entries WHERE date = :date")
    suspend fun getTotalCount(date: String): Int
}
