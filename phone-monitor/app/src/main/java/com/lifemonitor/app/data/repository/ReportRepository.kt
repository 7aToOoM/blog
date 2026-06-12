package com.lifemonitor.app.data.repository

import com.lifemonitor.app.data.local.dao.AppUsageDao
import com.lifemonitor.app.data.local.dao.DailyReportDao
import com.lifemonitor.app.data.local.entity.DailyReportEntity
import com.lifemonitor.app.data.preferences.UserPreferences
import com.lifemonitor.app.data.remote.ClaudeApiService
import com.lifemonitor.app.data.remote.dto.Message
import com.lifemonitor.app.data.remote.dto.MessageRequest
import com.lifemonitor.app.util.AppCategory
import com.lifemonitor.app.util.ProductivityScorer
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import java.text.SimpleDateFormat
import java.util.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ReportRepository @Inject constructor(
    private val reportDao: DailyReportDao,
    private val usageDao: AppUsageDao,
    private val habitRepository: HabitRepository,
    private val focusRepository: FocusRepository,
    private val claudeApi: ClaudeApiService,
    private val prefs: UserPreferences
) {
    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

    fun getAllReports(): Flow<List<DailyReportEntity>> = reportDao.getAllReports()

    fun getLatestReport(): Flow<DailyReportEntity?> = reportDao.getLatestReport()

    suspend fun generateDailyReport(date: String = dateFormat.format(Date())): Result<DailyReportEntity> {
        return try {
            val apiKey = prefs.claudeApiKey.first()
            if (apiKey.isBlank()) return Result.failure(Exception("Claude API key not set"))

            val usage = usageDao.getUsageForDate(date).first()
            val totalMs = usage.sumOf { it.totalTimeMs }
            val productiveMs = usage.filter { it.category == AppCategory.PRODUCTIVE.name }.sumOf { it.totalTimeMs }
            val socialMs = usage.filter { it.category == AppCategory.SOCIAL.name }.sumOf { it.totalTimeMs }
            val entMs = usage.filter { it.category == AppCategory.ENTERTAINMENT.name }.sumOf { it.totalTimeMs }
            val learnMs = usage.filter { it.category == AppCategory.LEARNING.name }.sumOf { it.totalTimeMs }

            val habitsCompleted = habitRepository.getCompletedCount(date)
            val habitsTotalCount = habitRepository.getTotalCount(date)
            val focusCount = focusRepository.getCompletedSessionCount(date)
            val focusMs = focusRepository.getTotalFocusTimeMs(date)

            val score = ProductivityScorer.calculate(usage, habitsCompleted, habitsTotalCount, focusCount, focusMs)

            val careerContext = prefs.careerContext.first()
            val prompt = buildPrompt(
                date, usage.take(10), totalMs, productiveMs, socialMs, entMs, learnMs,
                habitsCompleted, habitsTotalCount, focusCount, focusMs, score, careerContext
            )

            val response = claudeApi.createMessage(
                apiKey = apiKey,
                request = MessageRequest(messages = listOf(Message(content = prompt)))
            )

            val aiReport = response.content.firstOrNull { it.type == "text" }?.text
                ?: "No report generated."

            val report = DailyReportEntity(
                date = date,
                totalScreenTimeMs = totalMs,
                productiveTimeMs = productiveMs,
                socialTimeMs = socialMs,
                entertainmentTimeMs = entMs,
                learningTimeMs = learnMs,
                productivityScore = score,
                focusSessionCount = focusCount,
                totalFocusTimeMs = focusMs,
                habitsCompleted = habitsCompleted,
                habitsTotalCount = habitsTotalCount,
                aiReport = aiReport,
                generatedAt = System.currentTimeMillis()
            )

            reportDao.insertOrReplace(report)
            Result.success(report)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    private fun buildPrompt(
        date: String,
        topApps: List<com.lifemonitor.app.data.local.entity.AppUsageEntity>,
        totalMs: Long,
        productiveMs: Long,
        socialMs: Long,
        entMs: Long,
        learnMs: Long,
        habitsCompleted: Int,
        habitsTotalCount: Int,
        focusCount: Int,
        focusMs: Long,
        score: Int,
        careerContext: String
    ): String {
        val fmt = { ms: Long -> ProductivityScorer.formatDuration(ms) }

        val appList = topApps.joinToString("\n") { "  • ${it.appName} (${it.category}) — ${fmt(it.totalTimeMs)}" }
        val careerSection = if (careerContext.isNotBlank()) "\n**USER CAREER CONTEXT:** $careerContext\n" else ""

        return """
You are a personal life coach and career advisor with expertise in productivity, wellness, and professional growth. Analyze the following daily phone usage data and provide deeply personalized, actionable recommendations.
$careerSection
**DATE:** $date
**PRODUCTIVITY SCORE:** $score/100

**SCREEN TIME BREAKDOWN:**
- Total screen time: ${fmt(totalMs)}
- Productive apps: ${fmt(productiveMs)}
- Social media: ${fmt(socialMs)}
- Entertainment: ${fmt(entMs)}
- Learning apps: ${fmt(learnMs)}

**TOP APPS USED:**
$appList

**HABITS ($habitsCompleted/$habitsTotalCount completed)**

**FOCUS SESSIONS:**
- Completed sessions: $focusCount
- Total focus time: ${fmt(focusMs)}

Please provide a comprehensive daily report with these sections:

## 📊 Daily Summary
(2-3 sentences capturing today's overall pattern)

## 🎯 Productivity Analysis
(Specific insights about today's productive vs. unproductive time. Be direct and honest.)

## 💪 Health & Wellbeing
(Impact of today's screen habits on health, energy, and sleep quality)

## 🚀 Career Growth Actions
(3 specific, actionable steps to advance career based on today's patterns. Make them concrete and doable tomorrow.)

## ⚖️ Life Balance Insights
(Work-life balance observations and suggestions)

## 📅 Tomorrow's Top 3 Priorities
(The 3 most impactful things to focus on tomorrow, ranked by importance)

## ⚠️ Pattern Alert
(Any concerning patterns noticed that need attention, or celebrate wins if today was great)

Be encouraging yet honest. Use specific data points from above. Keep each section concise but impactful.
        """.trimIndent()
    }
}
