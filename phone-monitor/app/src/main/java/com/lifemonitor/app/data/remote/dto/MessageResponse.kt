package com.lifemonitor.app.data.remote.dto

import com.google.gson.annotations.SerializedName

data class MessageResponse(
    val id: String,
    val type: String,
    val role: String,
    val content: List<ContentBlock>,
    val model: String,
    @SerializedName("stop_reason") val stopReason: String?,
    val usage: Usage
)

data class ContentBlock(
    val type: String,
    val text: String?
)

data class Usage(
    @SerializedName("input_tokens") val inputTokens: Int,
    @SerializedName("output_tokens") val outputTokens: Int
)
