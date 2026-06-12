package com.lifemonitor.app.ui.screen.focus

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.lifemonitor.app.data.local.entity.FocusSessionEntity
import com.lifemonitor.app.data.repository.FocusRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import java.text.SimpleDateFormat
import java.util.*
import javax.inject.Inject

data class FocusUiState(
    val sessions: List<FocusSessionEntity> = emptyList(),
    val activeSession: FocusSessionEntity? = null,
    val elapsedMs: Long = 0L,
    val totalFocusMs: Long = 0L,
    val completedCount: Int = 0,
    val showStartDialog: Boolean = false
)

@HiltViewModel
class FocusViewModel @Inject constructor(
    private val focusRepository: FocusRepository
) : ViewModel() {

    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
    private val today get() = dateFormat.format(Date())

    private val _uiState = MutableStateFlow(FocusUiState())
    val uiState: StateFlow<FocusUiState> = _uiState.asStateFlow()

    private var timerJob: Job? = null

    init {
        viewModelScope.launch {
            focusRepository.getTodaySessions().collect { sessions ->
                val completed = sessions.filter { it.completed }
                _uiState.update {
                    it.copy(
                        sessions = sessions,
                        totalFocusMs = completed.sumOf { s -> s.durationMs },
                        completedCount = completed.size
                    )
                }
            }
        }
        viewModelScope.launch {
            val active = focusRepository.getActiveSession()
            if (active != null) {
                _uiState.update { it.copy(activeSession = active) }
                startTimer(active.startTime)
            }
        }
    }

    fun showStartDialog() = _uiState.update { it.copy(showStartDialog = true) }
    fun hideStartDialog() = _uiState.update { it.copy(showStartDialog = false) }

    fun startSession(goal: String) {
        viewModelScope.launch {
            val id = focusRepository.startSession(goal)
            val session = FocusSessionEntity(
                id = id,
                date = today,
                startTime = System.currentTimeMillis(),
                endTime = 0,
                durationMs = 0,
                goal = goal
            )
            _uiState.update { it.copy(activeSession = session, showStartDialog = false) }
            startTimer(session.startTime)
        }
    }

    fun endSession(interrupted: Boolean = false) {
        val active = _uiState.value.activeSession ?: return
        timerJob?.cancel()
        viewModelScope.launch {
            focusRepository.endSession(active, interrupted)
            _uiState.update { it.copy(activeSession = null, elapsedMs = 0L) }
        }
    }

    private fun startTimer(startTime: Long) {
        timerJob?.cancel()
        timerJob = viewModelScope.launch {
            while (isActive) {
                _uiState.update { it.copy(elapsedMs = System.currentTimeMillis() - startTime) }
                delay(1000)
            }
        }
    }

    override fun onCleared() {
        timerJob?.cancel()
        super.onCleared()
    }
}
