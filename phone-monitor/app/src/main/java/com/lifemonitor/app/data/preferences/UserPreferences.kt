package com.lifemonitor.app.data.preferences

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "user_prefs")

@Singleton
class UserPreferences @Inject constructor(@ApplicationContext private val context: Context) {

    private object Keys {
        val CLAUDE_API_KEY = stringPreferencesKey("claude_api_key")
        val DAILY_REPORT_HOUR = intPreferencesKey("daily_report_hour")
        val MONITORING_ENABLED = booleanPreferencesKey("monitoring_enabled")
        val CAREER_CONTEXT = stringPreferencesKey("career_context")
        val ONBOARDING_DONE = booleanPreferencesKey("onboarding_done")
    }

    val claudeApiKey: Flow<String> = context.dataStore.data
        .catch { if (it is IOException) emit(emptyPreferences()) else throw it }
        .map { it[Keys.CLAUDE_API_KEY] ?: "" }

    val dailyReportHour: Flow<Int> = context.dataStore.data
        .catch { if (it is IOException) emit(emptyPreferences()) else throw it }
        .map { it[Keys.DAILY_REPORT_HOUR] ?: 21 } // Default 9 PM

    val monitoringEnabled: Flow<Boolean> = context.dataStore.data
        .catch { if (it is IOException) emit(emptyPreferences()) else throw it }
        .map { it[Keys.MONITORING_ENABLED] ?: true }

    val careerContext: Flow<String> = context.dataStore.data
        .catch { if (it is IOException) emit(emptyPreferences()) else throw it }
        .map { it[Keys.CAREER_CONTEXT] ?: "" }

    val onboardingDone: Flow<Boolean> = context.dataStore.data
        .catch { if (it is IOException) emit(emptyPreferences()) else throw it }
        .map { it[Keys.ONBOARDING_DONE] ?: false }

    suspend fun setClaudeApiKey(key: String) {
        context.dataStore.edit { it[Keys.CLAUDE_API_KEY] = key }
    }

    suspend fun setDailyReportHour(hour: Int) {
        context.dataStore.edit { it[Keys.DAILY_REPORT_HOUR] = hour }
    }

    suspend fun setMonitoringEnabled(enabled: Boolean) {
        context.dataStore.edit { it[Keys.MONITORING_ENABLED] = enabled }
    }

    suspend fun setCareerContext(context_: String) {
        context.dataStore.edit { it[Keys.CAREER_CONTEXT] = context_ }
    }

    suspend fun setOnboardingDone(done: Boolean) {
        context.dataStore.edit { it[Keys.ONBOARDING_DONE] = done }
    }
}
