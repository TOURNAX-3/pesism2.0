package com.tournax.application;

import java.net.URI;
import java.net.URISyntaxException;

final class HighlightUrlNormalizer {

    private static final int MAX_LEN = 2048;

    private HighlightUrlNormalizer() {}

    static String normalize(String raw) {
        if (raw == null) {
            return null;
        }
        String trimmed = raw.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        if (trimmed.length() > MAX_LEN) {
            throw new IllegalArgumentException("Highlight URL is too long");
        }
        try {
            URI uri = new URI(trimmed);
            String scheme = uri.getScheme();
            if (scheme == null || (!scheme.equalsIgnoreCase("https") && !scheme.equalsIgnoreCase("http"))) {
                throw new IllegalArgumentException("Highlight URL must start with http:// or https://");
            }
            if (uri.getHost() == null || uri.getHost().isBlank()) {
                throw new IllegalArgumentException("Highlight URL must include a host");
            }
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException("Highlight URL is not valid");
        }
        return trimmed;
    }
}