package com.lifemonitor.app.ui.screen.focus

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.lifemonitor.app.data.local.entity.FocusSessionEntity
import com.lifemonitor.app.ui.theme.*
import com.lifemonitor.app.util.ProductivityScorer

@Composable
fun FocusScreen(
    paddingValues: PaddingValues,
    viewModel: FocusViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    if (uiState.showStartDialog) {
        StartFocusDialog(
            onStart = { goal -> viewModel.startSession(goal) },
            onDismiss = { viewModel.hideStartDialog() }
        )
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(paddingValues),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text("Focus Mode", style = MaterialTheme.typography.headlineMedium, color = Color.White)
            Text("Build deep work habits", style = MaterialTheme.typography.bodyMedium, color = TealLight)
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = DeepPurple),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Text("Today's Focus", style = MaterialTheme.typography.bodySmall, color = TealLight)
                        Text(
                            ProductivityScorer.formatDuration(uiState.totalFocusMs),
                            style = MaterialTheme.typography.titleLarge,
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = DeepPurple),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Text("Sessions Done", style = MaterialTheme.typography.bodySmall, color = TealLight)
                        Text(
                            "${uiState.completedCount}",
                            style = MaterialTheme.typography.titleLarge,
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        item {
            if (uiState.activeSession != null) {
                ActiveSessionCard(
                    session = uiState.activeSession!!,
                    elapsedMs = uiState.elapsedMs,
                    onEnd = { viewModel.endSession(false) },
                    onInterrupt = { viewModel.endSession(true) }
                )
            } else {
                StartFocusCard(onStart = { viewModel.showStartDialog() })
            }
        }

        if (uiState.sessions.isNotEmpty()) {
            item {
                Text(
                    "Today's Sessions",
                    style = MaterialTheme.typography.titleMedium,
                    color = Color.White
                )
            }
            items(uiState.sessions.filter { it.completed }) { session ->
                SessionHistoryRow(session)
            }
        }
    }
}

@Composable
private fun ActiveSessionCard(
    session: FocusSessionEntity,
    elapsedMs: Long,
    onEnd: () -> Unit,
    onInterrupt: () -> Unit
) {
    val pulseAnim = rememberInfiniteTransition(label = "pulse")
    val pulseScale by pulseAnim.animateFloat(
        initialValue = 0.95f, targetValue = 1.05f,
        animationSpec = infiniteRepeatable(tween(1000), RepeatMode.Reverse),
        label = "scale"
    )

    val hours = elapsedMs / 3_600_000
    val minutes = (elapsedMs % 3_600_000) / 60_000
    val seconds = (elapsedMs % 60_000) / 1_000
    val timeString = if (hours > 0)
        String.format("%d:%02d:%02d", hours, minutes, seconds)
    else
        String.format("%02d:%02d", minutes, seconds)

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF0D2B1A)),
        shape = RoundedCornerShape(20.dp)
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(140.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF1A3D2A)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    timeString,
                    fontWeight = FontWeight.Bold,
                    fontSize = 28.sp,
                    color = GreenSuccess
                )
            }
            Text(
                session.goal.ifBlank { "Deep Work Session" },
                style = MaterialTheme.typography.titleMedium,
                color = Color.White
            )
            Text("Stay focused. You're doing great!", style = MaterialTheme.typography.bodySmall, color = GreenSuccess)
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedButton(
                    onClick = onInterrupt,
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = OrangeWarning),
                    border = androidx.compose.foundation.BorderStroke(1.dp, OrangeWarning)
                ) { Text("Interrupted") }
                Button(
                    onClick = onEnd,
                    colors = ButtonDefaults.buttonColors(containerColor = GreenSuccess)
                ) { Text("Complete ✓", color = Color.Black) }
            }
        }
    }
}

@Composable
private fun StartFocusCard(onStart: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = DeepPurple),
        shape = RoundedCornerShape(20.dp)
    ) {
        Column(
            modifier = Modifier.padding(24.dp).fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Icon(Icons.Default.Timer, contentDescription = null, tint = Teal, modifier = Modifier.size(64.dp))
            Text("Ready to focus?", style = MaterialTheme.typography.titleLarge, color = Color.White)
            Text(
                "Start a focus session to track your deep work time. This will be included in your AI daily report.",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.White.copy(alpha = 0.7f)
            )
            Button(
                onClick = onStart,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = Teal)
            ) {
                Icon(Icons.Default.PlayArrow, contentDescription = null, tint = Color.Black)
                Spacer(Modifier.width(8.dp))
                Text("Start Focus Session", color = Color.Black)
            }
        }
    }
}

@Composable
private fun SessionHistoryRow(session: FocusSessionEntity) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = GreenSuccess, modifier = Modifier.size(20.dp))
        Column(Modifier.weight(1f)) {
            Text(session.goal.ifBlank { "Focus Session" }, style = MaterialTheme.typography.bodyMedium, color = Color.White, maxLines = 1)
        }
        Text(ProductivityScorer.formatDuration(session.durationMs), style = MaterialTheme.typography.bodySmall, color = TealLight)
    }
}

@Composable
private fun StartFocusDialog(onStart: (String) -> Unit, onDismiss: () -> Unit) {
    var goal by remember { mutableStateOf("") }
    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = DeepPurple,
        title = { Text("What will you focus on?", color = Color.White) },
        text = {
            OutlinedTextField(
                value = goal,
                onValueChange = { goal = it },
                label = { Text("e.g., Work on project proposal") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Teal,
                    focusedLabelColor = Teal,
                    unfocusedTextColor = Color.White,
                    focusedTextColor = Color.White
                )
            )
        },
        confirmButton = {
            Button(onClick = { onStart(goal) }) { Text("Start") }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel", color = Color.White.copy(alpha = 0.7f)) }
        }
    )
}
