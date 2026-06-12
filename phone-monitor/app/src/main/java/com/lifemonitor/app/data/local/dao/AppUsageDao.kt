package com.lifemonitor.app.data.local.dao

import androidx.room.*
import com.lifemonitor.app.data.local.entity.AppUsageEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface AppUsageDao {
    @Query("SELECT * FROM app_usage WHERE date = :date ORDER BY totalTimeMs DESC")
    fun getUsageForDate(date: String): Flow<List<AppUsageEntity>>

    @Query("SELECT * FROM app_usage WHERE date >= :startDate AND date <= :endDate ORDER BY date DESC, totalTimeMs DESC")
    fun getUsageForRange(startDate: String, endDate: String): Flow<List<AppUsageEntity>>

    @Query("SELECT SUM(totalTimeMs) FROM app_usage WHERE date = :date AND category = :category")
    suspend fun getTotalTimeByCategory(date: String, category: String): Long?

    @Upsert
    suspend fun upsertAll(entries: List<AppUsageEntity>)

    @Query("DELETE FROM app_usage WHERE date < :beforeDate")
    suspend fun deleteOlderThan(beforeDate: String)
}
