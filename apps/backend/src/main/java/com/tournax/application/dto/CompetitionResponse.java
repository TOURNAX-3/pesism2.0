package com.tournax.application.dto;

import java.util.List;

public record CompetitionResponse(
    int season,
    int knockoutQualifiers,
    int pointsWin,
    int pointsDraw,
    int pointsLoss,
    List<CompetitionPlayerDto> players,
    List<CompetitionMatchDto> matches
) {}
