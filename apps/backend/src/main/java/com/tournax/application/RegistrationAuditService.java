package com.tournax.application;

import com.tournax.domain.model.RegistrationAuditEvent;
import com.tournax.domain.repository.RegistrationAuditEventRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegistrationAuditService {

    private final RegistrationAuditEventRepository repository;

    public RegistrationAuditService(RegistrationAuditEventRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void log(
        UUID tournamentId,
        UUID playerId,
        String eventType,
        String email,
        ClientRequestContext client,
        String formCity,
        String detail
    ) {
        repository.save(
            RegistrationAuditEvent.of(tournamentId, playerId, eventType, email, client, formCity, detail)
        );
    }

    @Transactional(readOnly = true)
    public List<RegistrationAuditEvent> recentForTournament(UUID tournamentId) {
        return repository.findTop100ByTournamentIdOrderByCreatedAtDesc(tournamentId);
    }

    @Transactional(readOnly = true)
    public List<RegistrationAuditEvent> forPlayer(UUID playerId) {
        return repository.findTop50ByPlayerIdOrderByCreatedAtDesc(playerId);
    }
}
