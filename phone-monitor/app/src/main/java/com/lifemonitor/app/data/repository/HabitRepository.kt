package com.lifemonitor.app.data.repository

import com.lifemonitor.app.data.local.dao.HabitEntryDao
import com.lifemonitor.app.data.local.entity.HabitEntryEntity
import kotlinx.coroutines.flow.Flow
import java.text.SimpleDateFormat
import java.util.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class HabitRepository @Inject constructor(private val dao: HabitEntryDao) {

    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

    fun getTodayHabits(): Flow<List<HabitEntryEntity>> =
        dao.getHabitsForDate(dateFormat.format(Date()))

    fun getHabitsForDate(date: String): Flow<List<HabitEntryEntity>> =
        dao.getHabitsForDate(date)

    fun getRecentHabits(daysBack: Int = 7): Flow<List<HabitEntryEntity>> {
        val cal = Calendar.getInstance()
        cal.add(Calendar.DAY_OF_MONTH, -daysBack)
        return dao.getHabitsFromDate(dateFormat.format(cal.time))
    }

    suspend fun addHabit(entry: HabitEntryEntity): Long = dao.insert(entry)

    suspend fun updateHabit(entry: HabitEntryEntity) = dao.update(entry)

    suspend fun deleteHabit(entry: HabitEntryEntity) = dao.delete(entry)

    suspend fun getCompletedCount(date: String): Int = dao.getCompletedCount(date)

    suspend fun getTotalCount(date: String): Int = dao.getTotalCount(date)

    suspend fun seedDefaultHabits(date: String) {
        val defaults = listOf(
            HabitEntryEntity(date = date, habitName = "Exercise", category = "HEALTH", targetMinutes = 30, completedMinutes = 0, isCompleted = false),
            HabitEntryEntity(date = date, habitName = "Reading", category = "LEARNING", targetMinutes = 30, completedMinutes = 0, isCompleted = false),
            HabitEntryEntity(date = date, habitName = "Meditation", category = "HEALTH", targetMinutes = 10, completedMinutes = 0, isCompleted = false),
            HabitEntryEntity(date = date, habitName = "Learning / Course", category = "CAREER", targetMinutes = 45, completedMinutes = 0, isCompleted = false),
            HabitEntryEntity(date = date, habitName = "No social media before 10am", category = "PERSONAL", targetMinutes = 0, completedMinutes = 0, isCompleted = false),
        )
        defaults.forEach { dao.insert(it) }
    }
}
