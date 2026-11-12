package com.tournax.application.dto;

import java.time.Instant;

public record GrievanceCommentDto(long id, String body, Instant createdAt) {}
