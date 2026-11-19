package com.tournax.domain.model;

import java.util.Locale;
import java.util.Set;

public enum PlayerSkillTag {
    BEGINNER,
    PROFESSIONAL,
    SUPERSTAR,
    LEGEND;

    private static final Set<String> ALLOWED =
        Set.of("beginner", "professional", "superstar", "legend");

    public static PlayerSkillTag fromDb(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return PlayerSkillTag.valueOf(value.trim().toUpperCase(Locale.ROOT));
    }

    public String toDb() {
        return name().toLowerCase(Locale.ROOT);
    }

    public static boolean isAllowed(String value) {
        return value == null || value.isBlank() || ALLOWED.contains(value.trim().toLowerCase(Locale.ROOT));
    }

    public static String normalizeOrNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String v = value.trim().toLowerCase(Locale.ROOT);
        if (!ALLOWED.contains(v)) {
            throw new IllegalArgumentException("Invalid skill tag");
        }
        return v;
    }
}