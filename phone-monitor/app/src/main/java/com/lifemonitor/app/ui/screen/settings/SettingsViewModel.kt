package com.lifemonitor.app.ui.screen.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.lifemonitor.app.data.preferences.UserPreferences
import com.lifemonitor.app.worker.DailyReportWorker
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject
import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext

data class SettingsUiState(
    val claudeApiKey: String = "",
    val dailyReportHour: Int = 21,
    val monitoringEnabled: Boolean = true,
    val careerContext: String = "",
    val isSaved: Boolean = false
)

@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val prefs: UserPreferences,
    @ApplicationContext private val context: Context
) : ViewModel() {

    private val _uiState = MutableStateFlow(SettingsUiState())
    val uiState: StateFlow<SettingsUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            combine(
                prefs.claudeApiKey,
                prefs.dailyReportHour,
                prefs.monitoringEnabled,
                prefs.careerContext
            ) { key, hour, monitoring, career ->
                SettingsUiState(
                    claudeApiKey = key,
                    dailyReportHour = hour,
                    monitoringEnabled = monitoring,
                    careerContext = career
                )
            }.collect { state -> _uiState.value = state }
        }
    }

    fun updateApiKey(key: String) = _uiState.update { it.copy(claudeApiKey = key, isSaved = false) }
    fun updateReportHour(hour: Int) = _uiState.update { it.copy(dailyReportHour = hour, isSaved = false) }
    fun updateMonitoring(enabled: Boolean) = _uiState.update { it.copy(monitoringEnabled = enabled, isSaved = false) }
    fun updateCareerContext(text: String) = _uiState.update { it.copy(careerContext = text, isSaved = false) }

    fun saveSettings() {
        viewModelScope.launch {
            val state = _uiState.value
            prefs.setClaudeApiKey(state.claudeApiKey)
            prefs.setDailyReportHour(state.dailyReportHour)
            prefs.setMonitoringEnabled(state.monitoringEnabled)
            prefs.setCareerContext(state.careerContext)
            if (state.monitoringEnabled) {
                DailyReportWorker.schedule(context, state.dailyReportHour)
            } else {
                DailyReportWorker.cancelAll(context)
            }
            _uiState.update { it.copy(isSaved = true) }
        }
    }
}
