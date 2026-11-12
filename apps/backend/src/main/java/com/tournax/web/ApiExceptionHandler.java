package com.tournax.web;

import com.tournax.application.exception.AlreadyRegisteredException;
import com.tournax.application.exception.IdentityConflictException;
import com.tournax.application.exception.RegistrationClosedException;
import com.tournax.application.exception.TournamentFullException;
import com.tournax.web.dto.ErrorResponse;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> validation(MethodArgumentNotValidException ex) {
        String detail =
            ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining("; "));
        return ResponseEntity.badRequest().body(new ErrorResponse("validation_error", detail));
    }

    @ExceptionHandler(RegistrationClosedException.class)
    public ResponseEntity<ErrorResponse> closed(RegistrationClosedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(new ErrorResponse("registration_closed", ex.getMessage()));
    }

    @ExceptionHandler(AlreadyRegisteredException.class)
    public ResponseEntity<ErrorResponse> already(AlreadyRegisteredException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ErrorResponse("already_registered", ex.getMessage()));
    }

    @ExceptionHandler(IdentityConflictException.class)
    public ResponseEntity<ErrorResponse> identity(IdentityConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ErrorResponse("identity_conflict", ex.getMessage()));
    }

    @ExceptionHandler(TournamentFullException.class)
    public ResponseEntity<ErrorResponse> full(TournamentFullException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ErrorResponse("tournament_full", ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> badRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(new ErrorResponse("bad_request", ex.getMessage()));
    }
}
