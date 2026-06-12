package com.lifemonitor.app.ui.screen.dashboard

import android.content.Intent
import android.provider.Settings
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.*
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.lifemonitor.app.data.local.entity.AppUsageEntity
import com.lifemonitor.app.ui.theme.*
import com.lifemonitor.app.util.AppCategory
import com.lifemonitor.app.util.ProductivityScorer
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun DashboardScreen(
    paddingValues: PaddingValues,
    viewModel: DashboardViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current

    if (!uiState.hasUsagePermission && !uiState.isLoading) {
        PermissionRequiredCard(
            paddingValues = paddingValues,
            onGrantPermission = {
                context.startActivity(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
            },
            onCheckAgain = { viewModel.refreshPermission() }
        )
        return
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(paddingValues),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            DashboardHeader(
                date = uiState.todayDate,
                score = uiState.productivityScore,
                isSyncing = uiState.isSyncing
            )
        }

        item {
            ScreenTimeCard(
                totalMs = uiState.totalScreenTimeMs,
                productiveMs = uiState.productiveTimeMs,
                socialMs = uiState.socialTimeMs,
                entertainmentMs = uiState.entertainmentTimeMs,
                learningMs = uiState.learningTimeMs
            )
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                StatCard(
                    modifier = Modifier.weight(1f),
                    icon = Icons.Default.CheckCircle,
                    iconColor = GreenSuccess,
                    title = "Habits",
                    value = "${uiState.habitsCompleted}/${uiState.habitsTotalCount}",
                    subtitle = "completed"
                )
                StatCard(
                    modifier = Modifier.weight(1f),
                    icon = Icons.Default.Timer,
                    iconColor = Teal,
                    title = "Focus",
                    value = ProductivityScorer.formatDuration(uiState.totalFocusTimeMs),
                    subtitle = "${uiState.focusSessionCount} sessions"
                )
            }
        }

        if (uiState.topApps.isNotEmpty()) {
            item {
                Text(
                    "Top Apps Today",
                    style = MaterialTheme.typography.titleLarge,
                    color = Color.White,
                    modifier = Modifier.padding(vertical = 4.dp)
                )
            }
            items(uiState.topApps) { app -> AppUsageRow(app = app, total = uiState.totalScreenTimeMs) }
        }

        uiState.latestReport?.let { report ->
            item {
                AiInsightCard(reportSnippet = report.aiReport, date = report.date)
            }
        }
    }
}

@Composable
private fun DashboardHeader(date: String, score: Int, isSyncing: Boolean) {
    val displayDate = try {
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        val out = SimpleDateFormat("EEEE, MMMM d", Locale.getDefault())
        out.format(sdf.parse(date) ?: Date())
    } catch (_: Exception) { date }

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text("Good ${greeting()}!", style = MaterialTheme.typography.bodyMedium, color = TealLight)
            Text(displayDate, style = MaterialTheme.typography.headlineMedium, color = Color.White, fontWeight = FontWeight.Bold)
        }
        Box(contentAlignment = Alignment.Center) {
            CircularProgressIndicator(
                progress = score / 100f,
                modifier = Modifier.size(64.dp),
                color = when {
                    score >= 70 -> GreenSuccess
                    score >= 40 -> OrangeWarning
                    else -> RedAlert
                },
                strokeWidth = 6.dp
            )
            Text("$score", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color.White)
        }
    }
    if (isSyncing) {
        Text("Syncing usage data...", style = MaterialTheme.typography.bodySmall, color = TealLight)
    }
}

@Composable
private fun ScreenTimeCard(
    totalMs: Long, productiveMs: Long, socialMs: Long,
    entertainmentMs: Long, learningMs: Long
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = DeepPurple),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(Modifier.padding(16.dp)) {
            Text("Screen Time", style = MaterialTheme.typography.titleMedium, color = TealLight)
            Spacer(Modifier.height(8.dp))
            Text(
                ProductivityScorer.formatDuration(totalMs),
                style = MaterialTheme.typography.displayMedium,
                color = Color.White,
                fontWeight = FontWeight.Bold
            )
            Spacer(Modifier.height(12.dp))
            // Time breakdown bar
            if (totalMs > 0) {
                TimeBreakdownBar(totalMs, productiveMs, socialMs, entertainmentMs, learningMs)
                Spacer(Modifier.height(8.dp))
                TimeBreakdownLegend(productiveMs, socialMs, entertainmentMs, learningMs)
            }
        }
    }
}

@Composable
private fun TimeBreakdownBar(total: Long, productive: Long, social: Long, entertainment: Long, learning: Long) {
    val other = total - productive - social - entertainment - learning
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(12.dp)
            .clip(RoundedCornerShape(6.dp))
            .background(Color(0xFF333355))
    ) {
        Row(Modifier.fillMaxSize()) {
            listOf(
                productive to ProductiveColor,
                learning to LearningColor,
                social to SocialColor,
                entertainment to EntertainmentColor,
                other.coerceAtLeast(0L) to OtherColor
            ).forEach { (ms, color) ->
                if (ms > 0 && total > 0) {
                    Box(
                        modifier = Modifier
                            .fillMaxHeight()
                            .weight(ms.toFloat() / total)
                            .background(color)
                    )
                }
            }
        }
    }
}

@Composable
private fun TimeBreakdownLegend(productive: Long, social: Long, entertainment: Long, learning: Long) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        LegendItem("Work", ProductiveColor, ProductivityScorer.formatDuration(productive))
        LegendItem("Learn", LearningColor, ProductivityScorer.formatDuration(learning))
        LegendItem("Social", SocialColor, ProductivityScorer.formatDuration(social))
        LegendItem("Fun", EntertainmentColor, ProductivityScorer.formatDuration(entertainment))
    }
}

@Composable
private fun LegendItem(label: String, color: Color, time: String) {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
        Box(Modifier.size(8.dp).clip(CircleShape).background(color))
        Column {
            Text(label, style = MaterialTheme.typography.labelMedium, color = Color.White.copy(alpha = 0.7f))
            Text(time, style = MaterialTheme.typography.bodySmall, color = Color.White, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
private fun StatCard(
    modifier: Modifier = Modifier,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    iconColor: Color,
    title: String,
    value: String,
    subtitle: String
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = DeepPurple),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Icon(icon, contentDescription = null, tint = iconColor, modifier = Modifier.size(24.dp))
            Text(title, style = MaterialTheme.typography.bodySmall, color = Color.White.copy(alpha = 0.7f))
            Text(value, style = MaterialTheme.typography.titleLarge, color = Color.White, fontWeight = FontWeight.Bold)
            Text(subtitle, style = MaterialTheme.typography.bodySmall, color = TealLight)
        }
    }
}

@Composable
private fun AppUsageRow(app: AppUsageEntity, total: Long) {
    val categoryColor = when (app.category) {
        AppCategory.PRODUCTIVE.name -> ProductiveColor
        AppCategory.SOCIAL.name -> SocialColor
        AppCategory.ENTERTAINMENT.name -> EntertainmentColor
        AppCategory.LEARNING.name -> LearningColor
        else -> OtherColor
    }
    val ratio = if (total > 0) app.totalTimeMs.toFloat() / total else 0f
    val animatedProgress by animateFloatAsState(targetValue = ratio, label = "progress")

    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Box(
            Modifier.size(8.dp).clip(CircleShape).background(categoryColor)
        )
        Text(
            app.appName,
            modifier = Modifier.weight(1f),
            style = MaterialTheme.typography.bodyMedium,
            color = Color.White,
            maxLines = 1
        )
        Box(
            modifier = Modifier
                .width(80.dp)
                .height(6.dp)
                .clip(RoundedCornerShape(3.dp))
                .background(Color(0xFF333355))
        ) {
            Box(
                modifier = Modifier
                    .fillMaxHeight()
                    .fillMaxWidth(animatedProgress)
                    .background(categoryColor)
            )
        }
        Text(
            ProductivityScorer.formatDuration(app.totalTimeMs),
            style = MaterialTheme.typography.bodySmall,
            color = TealLight,
            modifier = Modifier.width(48.dp)
        )
    }
}

@Composable
private fun AiInsightCard(reportSnippet: String, date: String) {
    val snippet = reportSnippet.lines().take(6).joinToString("\n")
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFF0D2137)
        ),
        border = BorderStroke(1.dp, Teal.copy(alpha = 0.4f)),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = Teal, modifier = Modifier.size(20.dp))
                Text("AI Insights", style = MaterialTheme.typography.titleMedium, color = Teal)
                Spacer(Modifier.weight(1f))
                Text(date, style = MaterialTheme.typography.bodySmall, color = Color.White.copy(alpha = 0.5f))
            }
            Spacer(Modifier.height(8.dp))
            Text(
                snippet,
                style = MaterialTheme.typography.bodySmall,
                color = Color.White.copy(alpha = 0.85f),
                lineHeight = 18.sp
            )
            if (reportSnippet.lines().size > 6) {
                Text("View full report →", style = MaterialTheme.typography.bodySmall, color = Teal, modifier = Modifier.padding(top = 4.dp))
            }
        }
    }
}

@Composable
private fun PermissionRequiredCard(
    paddingValues: PaddingValues,
    onGrantPermission: () -> Unit,
    onCheckAgain: () -> Unit
) {
    Column(
        modifier = Modifier.fillMaxSize().padding(paddingValues).padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(Icons.Default.Security, contentDescription = null, tint = Teal, modifier = Modifier.size(64.dp))
        Spacer(Modifier.height(24.dp))
        Text("Usage Access Required", style = MaterialTheme.typography.headlineMedium, color = Color.White)
        Spacer(Modifier.height(12.dp))
        Text(
            "LifeMonitor needs usage access permission to track your app usage and generate AI-powered insights. Your data stays on your device.",
            style = MaterialTheme.typography.bodyMedium,
            color = Color.White.copy(alpha = 0.7f)
        )
        Spacer(Modifier.height(32.dp))
        Button(onClick = onGrantPermission, modifier = Modifier.fillMaxWidth()) {
            Text("Open Usage Access Settings")
        }
        Spacer(Modifier.height(12.dp))
        OutlinedButton(onClick = onCheckAgain, modifier = Modifier.fillMaxWidth()) {
            Text("I've Granted Permission — Check Again")
        }
    }
}

private fun greeting(): String {
    val hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
    return when {
        hour < 12 -> "morning"
        hour < 17 -> "afternoon"
        else -> "evening"
    }
}
