package com.tournax.application;

import com.tournax.application.dto.IntentSendResult;
import com.tournax.application.dto.RegistrationIntentPayload;
import com.tournax.application.dto.RegistrationRequest;
import com.tournax.application.exception.EmailVerificationException;
import com.tournax.domain.model.RegistrationIntent;
import com.tournax.domain.repository.RegistrationIntentRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegistrationIntentService {

    private static final int MAX_ATTEMPTS = 8;
    private static final Duration RESEND_COOLDOWN = Duration.ofMinutes(1);
    /** Ignore duplicate send OTP within this window (double-click / double listener). */
    /** Block only rapid double-submit (same email); not a long retry window. */
    private static final Duration SUBMIT_SEND_DEBOUNCE = Duration.ofSeconds(8);

    private final RegistrationIntentRepository intentRepository;
    private final RegistrationEmailSender emailSender;
    private final Clock clock;
    private final int expiryMinutes;
    private final SecureRandom random = new SecureRandom();

    public RegistrationIntentService(
        RegistrationIntentRepository intentRepository,
        RegistrationEmailSender emailSender,
        Clock clock,
        @Value("${tournax.registration.otp-expiry-minutes:30}") int expiryMinutes
    ) {
        this.intentRepository = intentRepository;
        this.emailSender = emailSender;
        this.clock = clock;
        this.expiryMinutes = expiryMinutes;
    }

  /** Store form in DB, email OTP. No player row until {@link #verifyAndRemove}. */
    @Transactional
    public IntentSendResult upsertAndSend(
        UUID tournamentId,
        RegistrationRequest request,
        String waNumber,
        String email
    ) {
        Instant now = clock.instant();
        RegistrationIntentPayload payload = RegistrationIntentPayload.from(request);

        var existingOpt = intentRepository.findByTournamentIdAndEmailIgnoreCase(tournamentId, email);
        if (existingOpt.isPresent()) {
            RegistrationIntent existing = existingOpt.get();
            if (Duration.between(existing.getLastSentAt(), now).compareTo(SUBMIT_SEND_DEBOUNCE) < 0) {
                existing.updateFormDetails(waNumber, payload);
                intentRepository.save(existing);
                return new IntentSendResult(existing.getId(), false);
            }
        }

        String code = OtpCodeFormat.generate(random);
        String hash = hashCode(code);
        Instant expires = now.plus(Duration.ofMinutes(expiryMinutes));

        RegistrationIntent intent =
            existingOpt
                .map(
                    existing -> {
                        existing.replaceDetails(waNumber, payload, hash, expires, now);
                        return existing;
                    }
                )
                .orElseGet(
                    () ->
                        RegistrationIntent.create(
                            UUID.randomUUID(),
                            tournamentId,
                            email,
                            waNumber,
                            payload,
                            hash,
                            expires,
                            now
                        )
                );

        intentRepository.save(intent);
        emailSender.sendVerificationCode(email, code, expiryMinutes);
        return new IntentSendResult(intent.getId(), true);
    }

    @Transactional
    public void resend(UUID intentId, UUID tournamentId) {
        RegistrationIntent intent =
            intentRepository
                .findByIdAndTournamentId(intentId, tournamentId)
                .orElseThrow(() -> new EmailVerificationException("Registration not found."));
        Instant now = clock.instant();
        if (Duration.between(intent.getLastSentAt(), now).compareTo(RESEND_COOLDOWN) < 0) {
            throw new EmailVerificationException("Please wait a minute before requesting another code.");
        }
        String code = OtpCodeFormat.generate(random);
        intent.refreshCode(hashCode(code), now.plus(Duration.ofMinutes(expiryMinutes)), now);
        intentRepository.save(intent);
        emailSender.sendVerificationCode(intent.getEmail(), code, expiryMinutes);
    }

    @Transactional
    public RegistrationIntent verifyAndRemove(UUID intentId, UUID tournamentId, String rawCode) {
        if (!OtpCodeFormat.isValid(rawCode)) {
            throw new EmailVerificationException("Enter the 4-digit code from your email.");
        }
        RegistrationIntent intent =
            intentRepository
                .findByIdAndTournamentId(intentId, tournamentId)
                .orElseThrow(() -> new EmailVerificationException("Registration not found."));
        Instant now = clock.instant();
        if (now.isAfter(intent.getExpiresAt())) {
            throw new EmailVerificationException("That code has expired. Request a new code.");
        }
        if (intent.getAttemptCount() >= MAX_ATTEMPTS) {
            throw new EmailVerificationException("Too many attempts. Request a new code.");
        }
        intent.recordAttempt();
        if (!hashCode(rawCode.trim()).equals(intent.getCodeHash())) {
            intentRepository.save(intent);
            throw new EmailVerificationException("Incorrect code. Try again.");
        }
        intentRepository.delete(intent);
        return intent;
    }

    private static String hashCode(String code) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(code.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }
}
