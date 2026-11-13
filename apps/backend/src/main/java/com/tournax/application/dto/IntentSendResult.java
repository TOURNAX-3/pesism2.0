package com.tournax.application.dto;

import java.util.UUID;

public record IntentSendResult(UUID intentId, boolean emailDispatched) {}
