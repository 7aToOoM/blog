package com.lifemonitor.app.data.repository

import com.lifemonitor.app.data.local.dao.FocusSessionDao
import com.lifemonitor.app.data.local.entity.FocusSessionEntity
import kotlinx.coroutines.flow.Flow
import java.text.SimpleDateFormat
import java.util.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class FocusRepository @Inject constructor(private val dao: FocusSessionDao) {

    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

    fun getTodaySessions(): Flow<List<FocusSessionEntity>> =
        dao.getSessionsForDate(dateFormat.format(Date()))

    suspend fun getActiveSession(): FocusSessionEntity? = dao.getActiveSession()

    suspend fun startSession(goal: String): Long {
        val now = System.currentTimeMillis()
        val session = FocusSessionEntity(
            date = dateFormat.format(Date()),
            startTime = now,
            endTime = 0,
            durationMs = 0,
            goal = goal
        )
        return dao.insert(session)
    }

    suspend fun endSession(session: FocusSessionEntity, interrupted: Boolean = false) {
        val now = System.currentTimeMillis()
        dao.update(
            session.copy(
                endTime = now,
                durationMs = now - session.startTime,
                completed = !interrupted
            )
        )
    }

    suspend fun getTotalFocusTimeMs(date: String): Long =
        dao.getTotalFocusTimeMs(date) ?: 0L

    suspend fun getCompletedSessionCount(date: String): Int =
        dao.getCompletedSessionCount(date)
}
