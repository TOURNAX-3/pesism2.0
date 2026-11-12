package com.tournax.application;

/**
 * WhatsApp identity: digits only (country code included), no + or spaces.
 * Matches the bot and existing TOURNAX convention.
 */
public final class PhoneNormalizer {

    private PhoneNormalizer() {}

    public static String normalize(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new IllegalArgumentException("WhatsApp number is required");
        }
        String digits = raw.replaceAll("\\D", "");
        if (digits.length() < 10 || digits.length() > 15) {
            throw new IllegalArgumentException("WhatsApp number must be 10–15 digits including country code");
        }
        return digits;
    }
}
