package com.lifemonitor.app.ui.screen.dashboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.lifemonitor.app.data.local.entity.AppUsageEntity
import com.lifemonitor.app.data.local.entity.DailyReportEntity
import com.lifemonitor.app.data.repository.FocusRepository
import com.lifemonitor.app.data.repository.HabitRepository
import com.lifemonitor.app.data.repository.ReportRepository
import com.lifemonitor.app.data.repository.UsageRepository
import com.lifemonitor.app.util.AppCategory
import com.lifemonitor.app.util.ProductivityScorer
import com.lifemonitor.app.util.UsageStatsHelper
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*
import javax.inject.Inject

data class DashboardUiState(
    val isLoading: Boolean = true,
    val hasUsagePermission: Boolean = false,
    val todayDate: String = "",
    val topApps: List<AppUsageEntity> = emptyList(),
    val totalScreenTimeMs: Long = 0L,
    val productiveTimeMs: Long = 0L,
    val socialTimeMs: Long = 0L,
    val entertainmentTimeMs: Long = 0L,
    val learningTimeMs: Long = 0L,
    val productivityScore: Int = 0,
    val habitsCompleted: Int = 0,
    val habitsTotalCount: Int = 0,
    val focusSessionCount: Int = 0,
    val totalFocusTimeMs: Long = 0L,
    val latestReport: DailyReportEntity? = null,
    val isSyncing: Boolean = false
)

@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val usageRepository: UsageRepository,
    private val habitRepository: HabitRepository,
    private val focusRepository: FocusRepository,
    private val reportRepository: ReportRepository,
    private val usageStatsHelper: UsageStatsHelper
) : ViewModel() {

    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
    private val today = dateFormat.format(Date())

    private val _uiState = MutableStateFlow(DashboardUiState())
    val uiState: StateFlow<DashboardUiState> = _uiState.asStateFlow()

    init {
        val hasPermission = usageStatsHelper.hasUsagePermission()
        _uiState.update { it.copy(hasUsagePermission = hasPermission, todayDate = today) }
        if (hasPermission) {
            syncAndLoad()
        } else {
            _uiState.update { it.copy(isLoading = false) }
        }
    }

    fun syncAndLoad() {
        viewModelScope.launch {
            _uiState.update { it.copy(isSyncing = true) }
            try { usageRepository.syncTodayUsage() } catch (_: Exception) {}
            _uiState.update { it.copy(isSyncing = false) }
        }

        viewModelScope.launch {
            combine(
                usageRepository.getUsageForDate(today),
                habitRepository.getTodayHabits(),
                focusRepository.getTodaySessions(),
                reportRepository.getLatestReport()
            ) { usage, habits, focusSessions, latestReport ->
                val totalMs = usage.sumOf { it.totalTimeMs }
                val productiveMs = usage.filter { it.category == AppCategory.PRODUCTIVE.name }.sumOf { it.totalTimeMs }
                val socialMs = usage.filter { it.category == AppCategory.SOCIAL.name }.sumOf { it.totalTimeMs }
                val entMs = usage.filter { it.category == AppCategory.ENTERTAINMENT.name }.sumOf { it.totalTimeMs }
                val learnMs = usage.filter { it.category == AppCategory.LEARNING.name }.sumOf { it.totalTimeMs }
                val completedHabits = habits.count { it.isCompleted }
                val completedFocus = focusSessions.count { it.completed }
                val focusMs = focusSessions.filter { it.completed }.sumOf { it.durationMs }
                val score = ProductivityScorer.calculate(usage, completedHabits, habits.size, completedFocus, focusMs)

                DashboardUiState(
                    isLoading = false,
                    hasUsagePermission = true,
                    todayDate = today,
                    topApps = usage.take(7),
                    totalScreenTimeMs = totalMs,
                    productiveTimeMs = productiveMs,
                    socialTimeMs = socialMs,
                    entertainmentTimeMs = entMs,
                    learningTimeMs = learnMs,
                    productivityScore = score,
                    habitsCompleted = completedHabits,
                    habitsTotalCount = habits.size,
                    focusSessionCount = completedFocus,
                    totalFocusTimeMs = focusMs,
                    latestReport = latestReport
                )
            }.collect { state -> _uiState.value = state }
        }
    }

    fun refreshPermission(): Boolean {
        val has = usageStatsHelper.hasUsagePermission()
        _uiState.update { it.copy(hasUsagePermission = has) }
        if (has) syncAndLoad()
        return has
    }
}
