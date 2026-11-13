package com.tournax.web;

import com.tournax.application.ClientRequestContext;
import com.tournax.application.RegistrationService;
import com.tournax.application.dto.RegistrationRequest;
import com.tournax.application.dto.RegistrationResponse;
import com.tournax.application.dto.RegistrationWindowResponse;
import com.tournax.application.dto.VerifyEmailRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/seasons")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @GetMapping("/{season}/registration")
    public RegistrationWindowResponse registrationWindow(@PathVariable int season) {
        return registrationService.windowForSeason(season);
    }

    @PostMapping("/{season}/registration")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistrationResponse register(
        @PathVariable int season,
        @Valid @RequestBody RegistrationRequest request,
        HttpServletRequest servletRequest
    ) {
        return registrationService.registerForSeason(season, request, ClientRequestContext.from(servletRequest));
    }

    @PostMapping("/{season}/registration/{playerId}/verify")
    public RegistrationResponse verify(
        @PathVariable int season,
        @PathVariable UUID playerId,
        @Valid @RequestBody VerifyEmailRequest body,
        HttpServletRequest servletRequest
    ) {
        return registrationService.verifyEmail(season, playerId, body, ClientRequestContext.from(servletRequest));
    }

    @PostMapping("/{season}/registration/{playerId}/verify/resend")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resend(
        @PathVariable int season,
        @PathVariable UUID playerId,
        HttpServletRequest servletRequest
    ) {
        registrationService.resendVerification(season, playerId, ClientRequestContext.from(servletRequest));
    }
}
