package com.tournax.application;

import jakarta.servlet.http.HttpServletRequest;

public record ClientRequestContext(
    String ipAddress,
    String userAgent,
    String referer,
    String acceptLanguage,
    String country,
    String region,
    String city
) {
    public static ClientRequestContext from(HttpServletRequest request) {
        if (request == null) {
            return empty();
        }
        String forwarded = request.getHeader("X-Forwarded-For");
        String ip =
            forwarded != null && !forwarded.isBlank()
                ? forwarded.split(",")[0].trim()
                : nullSafe(request.getRemoteAddr());
        String country = firstNonBlank(request.getHeader("X-Client-Country"), request.getHeader("CF-IPCountry"));
        String region = firstNonBlank(request.getHeader("X-Client-Region"), request.getHeader("X-Vercel-IP-Country-Region"));
        String city = firstNonBlank(request.getHeader("X-Client-City"), request.getHeader("X-Vercel-IP-City"));
        return new ClientRequestContext(
            ip,
            nullSafe(request.getHeader("User-Agent")),
            nullSafe(request.getHeader("Referer")),
            nullSafe(request.getHeader("Accept-Language")),
            country,
            region,
            city
        );
    }

    public static ClientRequestContext empty() {
        return new ClientRequestContext(null, null, null, null, null, null, null);
    }

    private static String firstNonBlank(String a, String b) {
        if (a != null && !a.isBlank()) {
            return a.trim();
        }
        if (b != null && !b.isBlank()) {
            return b.trim();
        }
        return null;
    }

    private static String nullSafe(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
