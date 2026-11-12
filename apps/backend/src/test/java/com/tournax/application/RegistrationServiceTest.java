package com.tournax.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.tournax.application.dto.RegistrationRequest;
import com.tournax.application.exception.AlreadyRegisteredException;
import com.tournax.application.exception.IdentityConflictException;
import com.tournax.domain.model.Player;
import com.tournax.domain.model.Tournament;
import com.tournax.domain.model.TournamentStatus;
import com.tournax.domain.repository.PlayerRepository;
import com.tournax.domain.repository.TournamentPlayerRepository;
import com.tournax.domain.repository.TournamentRepository;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

    @Mock
    TournamentRepository tournamentRepository;

    @Mock
    PlayerRepository playerRepository;

    @Mock
    TournamentPlayerRepository tournamentPlayerRepository;

    private final Clock clock = Clock.fixed(Instant.parse("2026-11-01T12:00:00Z"), ZoneOffset.UTC);

    private RegistrationService registrationService;

    private Tournament tournament;
    private UUID tournamentId;

    @BeforeEach
    void setUp() {
        registrationService =
            new RegistrationService(tournamentRepository, playerRepository, tournamentPlayerRepository, clock);
        tournamentId = UUID.fromString("a0000000-0000-4000-8000-000000000003");
        tournament = new Tournament();
        setField(tournament, "id", tournamentId);
        setField(tournament, "season", 3);
        setField(tournament, "status", TournamentStatus.registration);
        setField(tournament, "registrationOpensAt", Instant.parse("2026-10-01T00:00:00Z"));
        setField(tournament, "registrationClosesAt", Instant.parse("2026-12-01T00:00:00Z"));
        setField(tournament, "maxPlayers", 10);
    }

    @Test
    void registersNewPlayer() {
        when(tournamentRepository.findFirstBySeasonOrderByCreatedAtDesc(3)).thenReturn(Optional.of(tournament));
        when(tournamentPlayerRepository.countByTournamentId(tournamentId)).thenReturn(2L);
        when(playerRepository.findByWaNumber("919876543210")).thenReturn(Optional.empty());
        when(playerRepository.findByEmailIgnoreCase("a@b.com")).thenReturn(Optional.empty());
        when(playerRepository.save(any(Player.class))).thenAnswer(inv -> {
            Player p = inv.getArgument(0);
            setField(p, "id", UUID.randomUUID());
            return p;
        });

        RegistrationRequest req =
            new RegistrationRequest(
                "Arjun",
                "ArjunFC",
                "a@b.com",
                "+91 9876543210",
                "Kochi",
                "ArjunInGame",
                null,
                null
            );

        var response = registrationService.registerForSeason(3, req);
        assertEquals(tournamentId, response.tournamentId());
        verify(tournamentPlayerRepository).save(any());
    }

    @Test
    void blocksMismatchedEmailForExistingPhone() {
        when(tournamentRepository.findFirstBySeasonOrderByCreatedAtDesc(3)).thenReturn(Optional.of(tournament));
        when(tournamentPlayerRepository.countByTournamentId(tournamentId)).thenReturn(0L);

        Player existing =
            Player.register("Old", "919876543210", "old@b.com", "OldFC", null, null, null);
        setField(existing, "id", UUID.randomUUID());
        when(playerRepository.findByWaNumber("919876543210")).thenReturn(Optional.of(existing));
        when(playerRepository.findByEmailIgnoreCase("new@b.com")).thenReturn(Optional.empty());

        RegistrationRequest req =
            new RegistrationRequest(
                "Arjun",
                "ArjunFC",
                "new@b.com",
                "+91 9876543210",
                "Kochi",
                "ArjunInGame",
                null,
                null
            );

        assertThrows(IdentityConflictException.class, () -> registrationService.registerForSeason(3, req));
        verify(tournamentPlayerRepository, never()).save(any());
    }

    @Test
    void blocksDuplicateTournamentEntry() {
        when(tournamentRepository.findFirstBySeasonOrderByCreatedAtDesc(3)).thenReturn(Optional.of(tournament));
        when(tournamentPlayerRepository.countByTournamentId(tournamentId)).thenReturn(1L);

        Player existing = Player.register("Arjun", "919876543210", "a@b.com", "ArjunFC", null, null, null);
        UUID playerId = UUID.randomUUID();
        setField(existing, "id", playerId);
        when(playerRepository.findByWaNumber("919876543210")).thenReturn(Optional.of(existing));
        when(playerRepository.findByEmailIgnoreCase("a@b.com")).thenReturn(Optional.of(existing));
        when(tournamentPlayerRepository.existsByIdTournamentIdAndIdPlayerId(tournamentId, playerId)).thenReturn(true);

        RegistrationRequest req =
            new RegistrationRequest(
                "Arjun",
                "ArjunFC",
                "a@b.com",
                "+91 9876543210",
                "Kochi",
                "ArjunInGame",
                null,
                null
            );

        assertThrows(AlreadyRegisteredException.class, () -> registrationService.registerForSeason(3, req));
    }

    private static void setField(Object target, String field, Object value) {
        try {
            var f = target.getClass().getDeclaredField(field);
            f.setAccessible(true);
            f.set(target, value);
        } catch (ReflectiveOperationException e) {
            throw new RuntimeException(e);
        }
    }
}
