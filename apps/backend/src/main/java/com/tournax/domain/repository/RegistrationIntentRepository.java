package com.tournax.domain.repository;

import com.tournax.domain.model.RegistrationIntent;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RegistrationIntentRepository extends JpaRepository<RegistrationIntent, UUID> {

    @Query(
        """
        select i from RegistrationIntent i
        where i.tournamentId = :tournamentId and lower(i.email) = lower(:email)
        """
    )
    Optional<RegistrationIntent> findByTournamentIdAndEmailIgnoreCase(
        @Param("tournamentId") UUID tournamentId,
        @Param("email") String email
    );

    Optional<RegistrationIntent> findByIdAndTournamentId(UUID id, UUID tournamentId);
}
