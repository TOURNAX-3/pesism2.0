package com.tournax.application.dto;

public record UpdateMatchRequest(int homeGoals, int awayGoals, MatchStatsInput stats) {}
