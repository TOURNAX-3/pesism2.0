package com.tournax.domain.repository;

import com.tournax.domain.model.Player;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerRepository extends JpaRepository<Player, UUID> {
    Optional<Player> findByWaNumber(String waNumber);

    Optional<Player> findByEmailIgnoreCase(String email);

    Optional<Player> findByGamingUsernameIgnoreCase(String gamingUsername);
}
