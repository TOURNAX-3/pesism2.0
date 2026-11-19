package com.tournax.application.dto;

import com.tournax.domain.model.MatchStage;
import java.util.List;
import java.util.UUID;

public record MatchHighlightDto(
    UUID matchId,
    int matchday,
    MatchStage stage,
    String homeName,
    String awayName,
    Integer homeGoals,
    Integer awayGoals,
    List<String> videoUrls
) {}