package com.lifemonitor.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.lifemonitor.app.ui.screen.dashboard.DashboardScreen
import com.lifemonitor.app.ui.screen.focus.FocusScreen
import com.lifemonitor.app.ui.screen.habits.HabitsScreen
import com.lifemonitor.app.ui.screen.reports.ReportsScreen
import com.lifemonitor.app.ui.screen.settings.SettingsScreen

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Dashboard : Screen("dashboard", "Today", Icons.Default.Home)
    object Habits : Screen("habits", "Habits", Icons.Default.CheckCircle)
    object Focus : Screen("focus", "Focus", Icons.Default.Timer)
    object Reports : Screen("reports", "Reports", Icons.Default.Analytics)
    object Settings : Screen("settings", "Settings", Icons.Default.Settings)
}

val bottomNavItems = listOf(
    Screen.Dashboard, Screen.Habits, Screen.Focus, Screen.Reports, Screen.Settings
)

@Composable
fun AppNavGraph(startRoute: String = Screen.Dashboard.route) {
    val navController = rememberNavController()

    Scaffold(
        bottomBar = {
            NavigationBar {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentDestination = navBackStackEntry?.destination
                bottomNavItems.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = screen.title) },
                        label = { Text(screen.title) },
                        selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = startRoute,
            contentAlignment = androidx.compose.ui.Alignment.TopStart
        ) {
            composable(Screen.Dashboard.route) { DashboardScreen(innerPadding) }
            composable(Screen.Habits.route) { HabitsScreen(innerPadding) }
            composable(Screen.Focus.route) { FocusScreen(innerPadding) }
            composable(Screen.Reports.route) { ReportsScreen(innerPadding) }
            composable(Screen.Settings.route) { SettingsScreen(innerPadding) }
        }
    }
}
