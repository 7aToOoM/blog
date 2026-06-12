package com.lifemonitor.app.data.local.dao

import androidx.room.*
import com.lifemonitor.app.data.local.entity.FocusSessionEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface FocusSessionDao {
    @Query("SELECT * FROM focus_sessions WHERE date = :date ORDER BY startTime DESC")
    fun getSessionsForDate(date: String): Flow<List<FocusSessionEntity>>

    @Query("SELECT * FROM focus_sessions WHERE endTime = 0 LIMIT 1")
    suspend fun getActiveSession(): FocusSessionEntity?

    @Query("SELECT SUM(durationMs) FROM focus_sessions WHERE date = :date AND completed = 1")
    suspend fun getTotalFocusTimeMs(date: String): Long?

    @Query("SELECT COUNT(*) FROM focus_sessions WHERE date = :date AND completed = 1")
    suspend fun getCompletedSessionCount(date: String): Int

    @Insert
    suspend fun insert(session: FocusSessionEntity): Long

    @Update
    suspend fun update(session: FocusSessionEntity)
}
