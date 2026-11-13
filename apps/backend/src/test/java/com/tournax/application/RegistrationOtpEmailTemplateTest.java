package com.tournax.application;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class RegistrationOtpEmailTemplateTest {

    @Test
    void buildsHtmlForFourDigitCode() {
        String html = assertDoesNotThrow(() -> RegistrationOtpEmailTemplate.html("4821", 30));
        assertTrue(html.contains("4821"));
        assertTrue(html.contains("FFF566"));
        assertTrue(html.contains("<td"));
        assertFalse(html.contains("letter-spacing:0.42em"));
    }
}
