package com.tournax.application;

import com.tournax.application.exception.EmailVerificationException;
import com.tournax.domain.model.EmailVerificationChallenge;
import com.tournax.domain.model.Player;
import com.tournax.domain.repository.EmailVerificationChallengeRepository;
import com.tournax.domain.repository.PlayerRepository;
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
public class EmailVerificationService {

    private static final int MAX_ATTEMPTS = 8;
    private static final Duration RESEND_COOLDOWN = Duration.ofMinutes(1);

    private final EmailVerificationChallengeRepository challengeRepository;
    private final PlayerRepository playerRepository;
    private final RegistrationEmailSender emailSender;
    private final Clock clock;
    private final int expiryMinutes;
    private final SecureRandom random = new SecureRandom();

    public EmailVerificationService(
        EmailVerificationChallengeRepository challengeRepository,
        PlayerRepository playerRepository,
        RegistrationEmailSender emailSender,
        Clock clock,
        @Value("${tournax.registration.otp-expiry-minutes:30}") int expiryMinutes
    ) {
        this.challengeRepository = challengeRepository;
        this.playerRepository = playerRepository;
        this.emailSender = emailSender;
        this.clock = clock;
        this.expiryMinutes = expiryMinutes;
    }

    @Transactional
    public void issueChallenge(UUID playerId, UUID tournamentId, String email) {
        if (playerRepository.findById(playerId).map(Player::isEmailVerified).orElse(false)) {
            return;
        }
        Instant now = clock.instant();
        String code = OtpCodeFormat.generate(random);
        EmailVerificationChallenge challenge =
            EmailVerificationChallenge.create(
                playerId,
                tournamentId,
                hashCode(code),
                now.plus(Duration.ofMinutes(expiryMinutes)),
                now
            );
        challengeRepository.save(challenge);
        emailSender.sendVerificationCode(email, code, expiryMinutes);
    }

    @Transactional
    public void resend(UUID playerId, UUID tournamentId, String email) {
        Player player =
            playerRepository
                .findById(playerId)
                .orElseThrow(() -> new EmailVerificationException("Registration not found."));
        if (player.isEmailVerified()) {
            throw new EmailVerificationException("Email is already verified.");
        }
        EmailVerificationChallenge latest =
            challengeRepository
                .findFirstByPlayerIdAndTournamentIdOrderByCreatedAtDesc(playerId, tournamentId)
                .orElse(null);
        Instant now = clock.instant();
        if (latest != null && Duration.between(latest.getLastSentAt(), now).compareTo(RESEND_COOLDOWN) < 0) {
            throw new EmailVerificationException("Please wait a minute before requesting another code.");
        }
        issueChallenge(playerId, tournamentId, email);
    }

    @Transactional
    public void verify(UUID playerId, UUID tournamentId, String rawCode) {
        if (!OtpCodeFormat.isValid(rawCode)) {
            throw new EmailVerificationException("Enter the 4-digit code from your email.");
        }
        Player player =
            playerRepository
                .findById(playerId)
                .orElseThrow(() -> new EmailVerificationException("Registration not found."));
        if (player.isEmailVerified()) {
            return;
        }
        EmailVerificationChallenge challenge =
            challengeRepository
                .findFirstByPlayerIdAndTournamentIdOrderByCreatedAtDesc(playerId, tournamentId)
                .orElseThrow(() -> new EmailVerificationException("No verification code found. Request a new code."));
        Instant now = clock.instant();
        if (now.isAfter(challenge.getExpiresAt())) {
            throw new EmailVerificationException("That code has expired. Request a new code.");
        }
        if (challenge.getAttemptCount() >= MAX_ATTEMPTS) {
            throw new EmailVerificationException("Too many attempts. Request a new code.");
        }
        challenge.recordAttempt();
        if (!hashCode(rawCode.trim()).equals(challenge.getCodeHash())) {
            challengeRepository.save(challenge);
            throw new EmailVerificationException("Incorrect code. Try again.");
        }
        player.markEmailVerified(now);
        playerRepository.save(player);
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
