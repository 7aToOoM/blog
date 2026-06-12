package com.lifemonitor.app.ui.screen.habits

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.lifemonitor.app.data.local.entity.HabitEntryEntity
import com.lifemonitor.app.data.repository.HabitRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*
import javax.inject.Inject

data class HabitsUiState(
    val habits: List<HabitEntryEntity> = emptyList(),
    val isLoading: Boolean = true,
    val showAddDialog: Boolean = false
)

@HiltViewModel
class HabitsViewModel @Inject constructor(
    private val habitRepository: HabitRepository
) : ViewModel() {

    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
    private val today = dateFormat.format(Date())

    private val _uiState = MutableStateFlow(HabitsUiState())
    val uiState: StateFlow<HabitsUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            // Seed defaults if none exist
            if (habitRepository.getTotalCount(today) == 0) {
                habitRepository.seedDefaultHabits(today)
            }
        }
        viewModelScope.launch {
            habitRepository.getTodayHabits().collect { habits ->
                _uiState.update { it.copy(habits = habits, isLoading = false) }
            }
        }
    }

    fun toggleHabit(habit: HabitEntryEntity) {
        viewModelScope.launch {
            habitRepository.updateHabit(
                habit.copy(
                    isCompleted = !habit.isCompleted,
                    completedMinutes = if (!habit.isCompleted) habit.targetMinutes else 0
                )
            )
        }
    }

    fun addHabit(name: String, category: String, targetMinutes: Int) {
        viewModelScope.launch {
            habitRepository.addHabit(
                HabitEntryEntity(
                    date = today,
                    habitName = name,
                    category = category,
                    targetMinutes = targetMinutes,
                    completedMinutes = 0,
                    isCompleted = false
                )
            )
        }
    }

    fun deleteHabit(habit: HabitEntryEntity) {
        viewModelScope.launch { habitRepository.deleteHabit(habit) }
    }

    fun showAddDialog() = _uiState.update { it.copy(showAddDialog = true) }
    fun hideAddDialog() = _uiState.update { it.copy(showAddDialog = false) }
}
