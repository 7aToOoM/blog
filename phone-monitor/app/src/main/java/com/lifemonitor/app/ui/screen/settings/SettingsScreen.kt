package com.lifemonitor.app.ui.screen.settings

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.lifemonitor.app.ui.theme.*

@Composable
fun SettingsScreen(
    paddingValues: PaddingValues,
    viewModel: SettingsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    var showApiKey by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(paddingValues)
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("Settings", style = MaterialTheme.typography.headlineMedium, color = Color.White)

        // API Key section
        SectionCard(title = "Claude AI Integration", icon = Icons.Default.AutoAwesome) {
            Text(
                "Your Claude API key is stored locally on your device and never shared.",
                style = MaterialTheme.typography.bodySmall,
                color = Color.White.copy(alpha = 0.6f)
            )
            Spacer(Modifier.height(8.dp))
            OutlinedTextField(
                value = uiState.claudeApiKey,
                onValueChange = { viewModel.updateApiKey(it) },
                label = { Text("Anthropic API Key") },
                modifier = Modifier.fillMaxWidth(),
                visualTransformation = if (showApiKey) VisualTransformation.None else PasswordVisualTransformation(),
                trailingIcon = {
                    IconButton(onClick = { showApiKey = !showApiKey }) {
                        Icon(
                            if (showApiKey) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                            contentDescription = null,
                            tint = TealLight
                        )
                    }
                },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Teal, focusedLabelColor = Teal,
                    unfocusedTextColor = Color.White, focusedTextColor = Color.White,
                    unfocusedLabelColor = Color.White.copy(alpha = 0.5f)
                ),
                placeholder = { Text("sk-ant-...", color = Color.White.copy(alpha = 0.3f)) }
            )
            Spacer(Modifier.height(4.dp))
            Text(
                "Get your free API key at console.anthropic.com",
                style = MaterialTheme.typography.bodySmall,
                color = Teal
            )
        }

        // Career Context
        SectionCard(title = "Your Career Context", icon = Icons.Default.Work) {
            Text(
                "Help the AI give more relevant career advice by sharing your current role and goals.",
                style = MaterialTheme.typography.bodySmall,
                color = Color.White.copy(alpha = 0.6f)
            )
            Spacer(Modifier.height(8.dp))
            OutlinedTextField(
                value = uiState.careerContext,
                onValueChange = { viewModel.updateCareerContext(it) },
                label = { Text("Career context") },
                modifier = Modifier.fillMaxWidth().height(120.dp),
                maxLines = 5,
                placeholder = { Text("e.g., Software engineer, 3 years exp, learning machine learning to transition into AI roles...", color = Color.White.copy(alpha = 0.3f)) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Teal, focusedLabelColor = Teal,
                    unfocusedTextColor = Color.White, focusedTextColor = Color.White,
                    unfocusedLabelColor = Color.White.copy(alpha = 0.5f)
                )
            )
        }

        // Monitoring settings
        SectionCard(title = "Monitoring", icon = Icons.Default.MonitorHeart) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("Enable Monitoring", style = MaterialTheme.typography.bodyMedium, color = Color.White)
                    Text("Track app usage in background", style = MaterialTheme.typography.bodySmall, color = Color.White.copy(alpha = 0.5f))
                }
                Switch(
                    checked = uiState.monitoringEnabled,
                    onCheckedChange = { viewModel.updateMonitoring(it) },
                    colors = SwitchDefaults.colors(checkedThumbColor = Teal, checkedTrackColor = Teal.copy(alpha = 0.4f))
                )
            }
            Spacer(Modifier.height(12.dp))
            Text(
                "Daily Report Time: ${formatHour(uiState.dailyReportHour)}",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.White
            )
            Slider(
                value = uiState.dailyReportHour.toFloat(),
                onValueChange = { viewModel.updateReportHour(it.toInt()) },
                valueRange = 18f..23f,
                steps = 4,
                colors = SliderDefaults.colors(thumbColor = Teal, activeTrackColor = Teal)
            )
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("6 PM", style = MaterialTheme.typography.bodySmall, color = Color.White.copy(alpha = 0.5f))
                Text("11 PM", style = MaterialTheme.typography.bodySmall, color = Color.White.copy(alpha = 0.5f))
            }
        }

        // Save button
        Button(
            onClick = { viewModel.saveSettings() },
            modifier = Modifier.fillMaxWidth().height(52.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Teal),
            shape = RoundedCornerShape(12.dp)
        ) {
            Icon(Icons.Default.Save, contentDescription = null, tint = Color.Black)
            Spacer(Modifier.width(8.dp))
            Text("Save Settings", color = Color.Black, style = MaterialTheme.typography.titleMedium)
        }

        if (uiState.isSaved) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1A3D2A)),
                shape = RoundedCornerShape(12.dp)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = GreenSuccess)
                    Text("Settings saved successfully!", color = GreenSuccess, style = MaterialTheme.typography.bodyMedium)
                }
            }
        }

        Spacer(Modifier.height(80.dp))
    }
}

@Composable
private fun SectionCard(
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = DeepPurple),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(Modifier.padding(16.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.padding(bottom = 12.dp)
            ) {
                Icon(icon, contentDescription = null, tint = Teal, modifier = Modifier.size(20.dp))
                Text(title, style = MaterialTheme.typography.titleMedium, color = Color.White)
            }
            content()
        }
    }
}

private fun formatHour(hour: Int): String {
    val h = if (hour > 12) hour - 12 else hour
    val ampm = if (hour >= 12) "PM" else "AM"
    return "$h:00 $ampm"
}
