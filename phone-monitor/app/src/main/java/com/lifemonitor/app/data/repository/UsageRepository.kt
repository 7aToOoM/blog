package com.lifemonitor.app.data.repository

import com.lifemonitor.app.data.local.dao.AppUsageDao
import com.lifemonitor.app.data.local.entity.AppUsageEntity
import com.lifemonitor.app.util.UsageStatsHelper
import kotlinx.coroutines.flow.Flow
import java.text.SimpleDateFormat
import java.util.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class UsageRepository @Inject constructor(
    private val dao: AppUsageDao,
    private val helper: UsageStatsHelper
) {
    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

    fun getUsageForDate(date: String): Flow<List<AppUsageEntity>> =
        dao.getUsageForDate(date)

    fun getUsageForRange(startDate: String, endDate: String): Flow<List<AppUsageEntity>> =
        dao.getUsageForRange(startDate, endDate)

    suspend fun syncTodayUsage() {
        val today = dateFormat.format(Date())
        val stats = helper.getDailyUsageStats(today)
        val entities = helper.toEntities(stats, today)
        dao.upsertAll(entities)
    }

    suspend fun getTotalCategoryTimeMs(date: String, category: String): Long =
        dao.getTotalTimeByCategory(date, category) ?: 0L
}
