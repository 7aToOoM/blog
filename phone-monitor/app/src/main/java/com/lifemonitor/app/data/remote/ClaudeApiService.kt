package com.lifemonitor.app.data.remote

import com.lifemonitor.app.data.remote.dto.MessageRequest
import com.lifemonitor.app.data.remote.dto.MessageResponse
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

interface ClaudeApiService {
    @POST("v1/messages")
    suspend fun createMessage(
        @Header("x-api-key") apiKey: String,
        @Header("anthropic-version") version: String = "2023-06-01",
        @Body request: MessageRequest
    ): MessageResponse
}
