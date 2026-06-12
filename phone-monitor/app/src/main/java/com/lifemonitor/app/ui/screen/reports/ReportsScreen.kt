package com.lifemonitor.app.ui.screen.reports

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
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
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.lifemonitor.app.data.local.entity.DailyReportEntity
import com.lifemonitor.app.ui.theme.*
import com.lifemonitor.app.util.ProductivityScorer
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun ReportsScreen(
    paddingValues: PaddingValues,
    viewModel: ReportsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    uiState.errorMessage?.let { msg ->
        AlertDialog(
            onDismissRequest = { viewModel.dismissError() },
            containerColor = DeepPurple,
            title = { Text("Error", color = Color.White) },
            text = { Text(msg, color = Color.White.copy(alpha = 0.8f)) },
            confirmButton = { Button(onClick = { viewModel.dismissError() }) { Text("OK") } }
        )
    }

    Column(
        modifier = Modifier.fillMaxSize().padding(paddingValues).padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("Daily Reports", style = MaterialTheme.typography.headlineMedium, color = Color.White)
                Text("AI-powered life insights", style = MaterialTheme.typography.bodyMedium, color = TealLight)
            }
            Button(
                onClick = { viewModel.generateTodayReport() },
                enabled = !uiState.isGenerating,
                colors = ButtonDefaults.buttonColors(containerColor = Teal)
            ) {
                if (uiState.isGenerating) {
                    CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color.Black, strokeWidth = 2.dp)
                } else {
                    Icon(Icons.Default.AutoAwesome, contentDescription = null, modifier = Modifier.size(18.dp), tint = Color.Black)
                }
                Spacer(Modifier.width(6.dp))
                Text(if (uiState.isGenerating) "Generating..." else "Generate", color = Color.Black)
            }
        }

        Spacer(Modifier.height(16.dp))

        if (uiState.reports.isEmpty()) {
            EmptyReportsState(onGenerate = { viewModel.generateTodayReport() }, isGenerating = uiState.isGenerating)
        } else {
            // Date selector chips
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(uiState.reports) { report ->
                    val isSelected = report.date == uiState.selectedReport?.date
                    FilterChip(
                        selected = isSelected,
                        onClick = { viewModel.selectReport(report) },
                        label = { Text(formatDateChip(report.date)) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = Teal,
                            selectedLabelColor = Color.Black,
                            labelColor = Color.White.copy(alpha = 0.7f)
                        )
                    )
                }
            }

            Spacer(Modifier.height(12.dp))

            uiState.selectedReport?.let { report ->
                ReportContent(report = report)
            }
        }
    }
}

@Composable
private fun ReportContent(report: DailyReportEntity) {
    Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
        // Stats cards row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            MiniStatCard(
                modifier = Modifier.weight(1f),
                label = "Score",
                value = "${report.productivityScore}",
                unit = "/100",
                color = when {
                    report.productivityScore >= 70 -> GreenSuccess
                    report.productivityScore >= 40 -> OrangeWarning
                    else -> RedAlert
                }
            )
            MiniStatCard(
                modifier = Modifier.weight(1f),
                label = "Screen Time",
                value = ProductivityScorer.formatDuration(report.totalScreenTimeMs),
                unit = "",
                color = Teal
            )
            MiniStatCard(
                modifier = Modifier.weight(1f),
                label = "Focus",
                value = ProductivityScorer.formatDuration(report.totalFocusTimeMs),
                unit = "",
                color = LearningColor
            )
            MiniStatCard(
                modifier = Modifier.weight(1f),
                label = "Habits",
                value = "${report.habitsCompleted}/${report.habitsTotalCount}",
                unit = "",
                color = GreenSuccess
            )
        }

        Spacer(Modifier.height(16.dp))

        // AI Report
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0D2137)),
            border = BorderStroke(1.dp, Teal.copy(alpha = 0.3f)),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = Teal, modifier = Modifier.size(20.dp))
                    Text("AI Analysis", style = MaterialTheme.typography.titleMedium, color = Teal)
                }
                Spacer(Modifier.height(12.dp))
                Text(
                    report.aiReport,
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.White.copy(alpha = 0.9f),
                    lineHeight = androidx.compose.ui.unit.TextUnit(
                        18f, androidx.compose.ui.unit.TextUnitType.Sp
                    )
                )
            }
        }

        Spacer(Modifier.height(80.dp))
    }
}

@Composable
private fun MiniStatCard(
    modifier: Modifier = Modifier,
    label: String,
    value: String,
    unit: String,
    color: Color
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = DeepPurple),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(Modifier.padding(10.dp)) {
            Text(label, style = MaterialTheme.typography.labelMedium, color = Color.White.copy(alpha = 0.6f))
            Row(verticalAlignment = Alignment.Bottom) {
                Text(value, style = MaterialTheme.typography.titleMedium, color = color, fontWeight = FontWeight.Bold)
                if (unit.isNotBlank()) Text(unit, style = MaterialTheme.typography.bodySmall, color = color.copy(alpha = 0.7f))
            }
        }
    }
}

@Composable
private fun EmptyReportsState(onGenerate: () -> Unit, isGenerating: Boolean) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Icon(Icons.Default.Analytics, contentDescription = null, tint = Teal, modifier = Modifier.size(72.dp))
            Text("No reports yet", style = MaterialTheme.typography.titleLarge, color = Color.White)
            Text(
                "Generate your first AI-powered daily report to get personalized insights about your productivity and life habits.",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.White.copy(alpha = 0.6f)
            )
            Button(onClick = onGenerate, enabled = !isGenerating) {
                if (isGenerating) CircularProgressIndicator(modifier = Modifier.size(16.dp), strokeWidth = 2.dp)
                else Text("Generate First Report")
            }
        }
    }
}

private fun formatDateChip(date: String): String {
    return try {
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        val out = SimpleDateFormat("MMM d", Locale.getDefault())
        out.format(sdf.parse(date) ?: return date)
    } catch (_: Exception) { date }
}
