package com.tournax.application.exception;

public class IdentityConflictException extends RuntimeException {
    public IdentityConflictException(String message) {
        super(message);
    }
}
