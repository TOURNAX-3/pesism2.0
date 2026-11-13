package com.tournax.domain.repository;

import com.tournax.domain.model.RegistrationAuditEvent;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationAuditEventRepository extends JpaRepository<RegistrationAuditEvent, Long> {

    List<RegistrationAuditEvent> findTop100ByTournamentIdOrderByCreatedAtDesc(UUID tournamentId);

    List<RegistrationAuditEvent> findTop50ByPlayerIdOrderByCreatedAtDesc(UUID playerId);
}
