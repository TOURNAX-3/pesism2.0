package com.tournax.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class PhoneNormalizerTest {

    @Test
    void stripsFormatting() {
        assertEquals("919876543210", PhoneNormalizer.normalize("+91 98765 43210"));
    }

    @Test
    void rejectsTooShort() {
        assertThrows(IllegalArgumentException.class, () -> PhoneNormalizer.normalize("12345"));
    }
}
