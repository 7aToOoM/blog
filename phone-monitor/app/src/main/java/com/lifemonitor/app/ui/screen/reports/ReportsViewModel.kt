package com.lifemonitor.app.ui.screen.reports

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.lifemonitor.app.data.local.entity.DailyReportEntity
import com.lifemonitor.app.data.repository.ReportRepository
import com.lifemonitor.app.data.repository.UsageRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ReportsUiState(
    val reports: List<DailyReportEntity> = emptyList(),
    val selectedReport: DailyReportEntity? = null,
    val isGenerating: Boolean = false,
    val errorMessage: String? = null
)

@HiltViewModel
class ReportsViewModel @Inject constructor(
    private val reportRepository: ReportRepository,
    private val usageRepository: UsageRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ReportsUiState())
    val uiState: StateFlow<ReportsUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            reportRepository.getAllReports().collect { reports ->
                _uiState.update { it.copy(reports = reports, selectedReport = it.selectedReport ?: reports.firstOrNull()) }
            }
        }
    }

    fun selectReport(report: DailyReportEntity) {
        _uiState.update { it.copy(selectedReport = report) }
    }

    fun generateTodayReport() {
        viewModelScope.launch {
            _uiState.update { it.copy(isGenerating = true, errorMessage = null) }
            try {
                usageRepository.syncTodayUsage()
            } catch (_: Exception) {}
            val result = reportRepository.generateDailyReport()
            _uiState.update {
                it.copy(
                    isGenerating = false,
                    errorMessage = if (result.isFailure) result.exceptionOrNull()?.message else null
                )
            }
        }
    }

    fun dismissError() = _uiState.update { it.copy(errorMessage = null) }
}
