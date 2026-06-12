package com.lifemonitor.app.ui.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = Teal,
    onPrimary = Color.Black,
    primaryContainer = AccentBlue,
    onPrimaryContainer = TealLight,
    secondary = NeonBlue,
    onSecondary = Color.White,
    background = DarkNavy,
    onBackground = Color.White,
    surface = DeepPurple,
    onSurface = Color.White,
    surfaceVariant = AccentBlue,
    onSurfaceVariant = Color(0xFFCCCCCC),
    error = RedAlert,
    outline = Color(0xFF444466)
)

@Composable
fun LifeMonitorTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}
