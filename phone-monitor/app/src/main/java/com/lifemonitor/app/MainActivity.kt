package com.lifemonitor.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.lifemonitor.app.service.UsageMonitorService
import com.lifemonitor.app.ui.navigation.AppNavGraph
import com.lifemonitor.app.ui.navigation.Screen
import com.lifemonitor.app.ui.theme.LifeMonitorTheme
import com.lifemonitor.app.worker.DailyReportWorker
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Start background monitoring service
        UsageMonitorService.start(this)

        // Schedule daily report worker
        DailyReportWorker.schedule(this)

        val startRoute = intent?.getStringExtra("navigate_to")
            ?.let { route -> Screen::class.sealedSubclasses.firstOrNull { it.objectInstance?.route == route }?.objectInstance?.route }
            ?: Screen.Dashboard.route

        setContent {
            LifeMonitorTheme {
                AppNavGraph(startRoute = startRoute)
            }
        }
    }
}
