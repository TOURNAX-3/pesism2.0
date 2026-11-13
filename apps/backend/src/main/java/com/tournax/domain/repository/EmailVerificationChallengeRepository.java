package com.tournax.domain.repository;

import com.tournax.domain.model.EmailVerificationChallenge;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailVerificationChallengeRepository extends JpaRepository<EmailVerificationChallenge, UUID> {

    Optional<EmailVerificationChallenge> findFirstByPlayerIdAndTournamentIdOrderByCreatedAtDesc(
        UUID playerId,
        UUID tournamentId
    );
}
