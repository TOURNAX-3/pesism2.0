package com.tournax.application;

import java.security.SecureRandom;

public final class OtpCodeFormat {

    public static final int LENGTH = 4;
    public static final String PATTERN = "\\d{4}";
    private static final int BOUND = 10_000;

    private OtpCodeFormat() {}

    public static String generate(SecureRandom random) {
        return String.format("%0" + LENGTH + "d", random.nextInt(BOUND));
    }

    public static boolean isValid(String raw) {
        return raw != null && raw.matches(PATTERN);
    }
}
