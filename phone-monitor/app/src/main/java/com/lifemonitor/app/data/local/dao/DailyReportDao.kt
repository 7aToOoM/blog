package com.lifemonitor.app.data.local.dao

import androidx.room.*
import com.lifemonitor.app.data.local.entity.DailyReportEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface DailyReportDao {
    @Query("SELECT * FROM daily_reports ORDER BY date DESC")
    fun getAllReports(): Flow<List<DailyReportEntity>>

    @Query("SELECT * FROM daily_reports WHERE date = :date")
    suspend fun getReportForDate(date: String): DailyReportEntity?

    @Query("SELECT * FROM daily_reports ORDER BY date DESC LIMIT 1")
    fun getLatestReport(): Flow<DailyReportEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrReplace(report: DailyReportEntity)

    @Query("DELETE FROM daily_reports WHERE date < :beforeDate")
    suspend fun deleteOlderThan(beforeDate: String)
}
