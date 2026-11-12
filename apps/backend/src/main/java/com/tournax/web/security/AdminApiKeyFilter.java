package com.tournax.web.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class AdminApiKeyFilter extends OncePerRequestFilter {

    private final String adminApiKey;

    public AdminApiKeyFilter(@Value("${tournax.admin.api-key}") String adminApiKey) {
        this.adminApiKey = adminApiKey;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith("/api/v1/admin/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
        String provided = extractKey(request);
        if (provided == null || !constantTimeEquals(adminApiKey, provided)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"code\":\"unauthorized\",\"message\":\"Invalid admin credentials\"}");
            return;
        }

        var auth =
            new UsernamePasswordAuthenticationToken(
                "admin",
                null,
                java.util.List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        SecurityContextHolder.getContext().setAuthentication(auth);
        filterChain.doFilter(request, response);
    }

    private static String extractKey(HttpServletRequest request) {
        String header = request.getHeader("X-Admin-Key");
        if (header != null && !header.isBlank()) {
            return header.trim();
        }
        String auth = request.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            return auth.substring("Bearer ".length()).trim();
        }
        return null;
    }

    private static boolean constantTimeEquals(String expected, String provided) {
        byte[] a = expected.getBytes(StandardCharsets.UTF_8);
        byte[] b = provided.getBytes(StandardCharsets.UTF_8);
        if (a.length != b.length) {
            return false;
        }
        int result = 0;
        for (int i = 0; i < a.length; i++) {
            result |= a[i] ^ b[i];
        }
        return result == 0;
    }
}
