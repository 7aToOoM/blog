package com.lifemonitor.app.ui.screen.habits

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.lifemonitor.app.data.local.entity.HabitEntryEntity
import com.lifemonitor.app.ui.theme.*

@Composable
fun HabitsScreen(
    paddingValues: PaddingValues,
    viewModel: HabitsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    if (uiState.showAddDialog) {
        AddHabitDialog(
            onConfirm = { name, cat, mins -> viewModel.addHabit(name, cat, mins); viewModel.hideAddDialog() },
            onDismiss = { viewModel.hideAddDialog() }
        )
    }

    Scaffold(
        modifier = Modifier.padding(paddingValues),
        floatingActionButton = {
            FloatingActionButton(onClick = { viewModel.showAddDialog() }, containerColor = Teal) {
                Icon(Icons.Default.Add, contentDescription = "Add habit", tint = Color.Black)
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier.fillMaxSize().padding(innerPadding).padding(16.dp)
        ) {
            val completed = uiState.habits.count { it.isCompleted }
            val total = uiState.habits.size

            Text("Today's Habits", style = MaterialTheme.typography.headlineMedium, color = Color.White)
            Text(
                "$completed of $total completed",
                style = MaterialTheme.typography.bodyMedium,
                color = TealLight
            )
            Spacer(Modifier.height(8.dp))

            if (total > 0) {
                LinearProgressIndicator(
                    progress = if (total > 0) completed.toFloat() / total else 0f,
                    modifier = Modifier.fillMaxWidth().height(8.dp),
                    color = GreenSuccess,
                    trackColor = Color(0xFF333355)
                )
            }

            Spacer(Modifier.height(16.dp))

            if (uiState.isLoading) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Teal)
                }
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    val grouped = uiState.habits.groupBy { it.category }
                    grouped.forEach { (category, habits) ->
                        item {
                            Text(
                                category,
                                style = MaterialTheme.typography.labelMedium,
                                color = TealLight,
                                modifier = Modifier.padding(vertical = 4.dp)
                            )
                        }
                        items(habits) { habit ->
                            HabitCard(
                                habit = habit,
                                onToggle = { viewModel.toggleHabit(habit) },
                                onDelete = { viewModel.deleteHabit(habit) }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun HabitCard(
    habit: HabitEntryEntity,
    onToggle: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = if (habit.isCompleted) Color(0xFF1A3D2A) else DeepPurple
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Checkbox(
                checked = habit.isCompleted,
                onCheckedChange = { onToggle() },
                colors = CheckboxDefaults.colors(
                    checkedColor = GreenSuccess,
                    uncheckedColor = Color.White.copy(alpha = 0.5f)
                )
            )
            Column(Modifier.weight(1f)) {
                Text(
                    habit.habitName,
                    style = MaterialTheme.typography.titleMedium,
                    color = if (habit.isCompleted) GreenSuccess else Color.White,
                    fontWeight = FontWeight.Medium
                )
                if (habit.targetMinutes > 0) {
                    Text(
                        "${habit.targetMinutes} min goal",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color.White.copy(alpha = 0.5f)
                    )
                }
            }
            IconButton(onClick = onDelete) {
                Icon(Icons.Default.Delete, contentDescription = "Delete", tint = Color.White.copy(alpha = 0.3f))
            }
        }
    }
}

@Composable
private fun AddHabitDialog(
    onConfirm: (String, String, Int) -> Unit,
    onDismiss: () -> Unit
) {
    var name by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("HEALTH") }
    var targetMinutes by remember { mutableStateOf("30") }

    val categories = listOf("HEALTH", "LEARNING", "CAREER", "PERSONAL")

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = DeepPurple,
        title = { Text("Add Habit", color = Color.White) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Habit name") },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Teal,
                        focusedLabelColor = Teal,
                        unfocusedTextColor = Color.White,
                        focusedTextColor = Color.White
                    )
                )
                Text("Category", style = MaterialTheme.typography.bodySmall, color = Color.White.copy(alpha = 0.7f))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    categories.forEach { cat ->
                        FilterChip(
                            selected = category == cat,
                            onClick = { category = cat },
                            label = { Text(cat, style = MaterialTheme.typography.bodySmall) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = Teal,
                                selectedLabelColor = Color.Black
                            )
                        )
                    }
                }
                OutlinedTextField(
                    value = targetMinutes,
                    onValueChange = { targetMinutes = it.filter { c -> c.isDigit() } },
                    label = { Text("Target minutes (0 = checkbox only)") },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Teal,
                        focusedLabelColor = Teal,
                        unfocusedTextColor = Color.White,
                        focusedTextColor = Color.White
                    )
                )
            }
        },
        confirmButton = {
            Button(
                onClick = { onConfirm(name, category, targetMinutes.toIntOrNull() ?: 0) },
                enabled = name.isNotBlank()
            ) { Text("Add") }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel", color = Color.White.copy(alpha = 0.7f)) }
        }
    )
}
