package com.lifemonitor.app.di

import android.content.Context
import androidx.room.Room
import com.lifemonitor.app.data.local.AppDatabase
import com.lifemonitor.app.data.local.dao.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): AppDatabase =
        Room.databaseBuilder(context, AppDatabase::class.java, "lifemonitor.db").build()

    @Provides fun provideAppUsageDao(db: AppDatabase): AppUsageDao = db.appUsageDao()
    @Provides fun provideHabitEntryDao(db: AppDatabase): HabitEntryDao = db.habitEntryDao()
    @Provides fun provideFocusSessionDao(db: AppDatabase): FocusSessionDao = db.focusSessionDao()
    @Provides fun provideDailyReportDao(db: AppDatabase): DailyReportDao = db.dailyReportDao()
}
