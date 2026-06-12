package com.lifemonitor.app.di

import android.content.Context
import com.lifemonitor.app.util.UsageStatsHelper
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object UtilModule {
    @Provides
    @Singleton
    fun provideUsageStatsHelper(@ApplicationContext context: Context): UsageStatsHelper =
        UsageStatsHelper(context)
}
