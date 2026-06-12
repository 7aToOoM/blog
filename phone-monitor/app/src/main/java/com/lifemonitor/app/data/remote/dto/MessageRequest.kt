package com.lifemonitor.app.data.remote.dto

import com.google.gson.annotations.SerializedName

data class MessageRequest(
    val model: String = "claude-haiku-4-5-20251001",
    @SerializedName("max_tokens") val maxTokens: Int = 2048,
    val messages: List<Message>
)

data class Message(
    val role: String = "user",
    val content: String
)
