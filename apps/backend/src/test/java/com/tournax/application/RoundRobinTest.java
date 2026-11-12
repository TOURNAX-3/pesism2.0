package com.tournax.application;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class RoundRobinTest {

    @Test
    void fourPlayersProduceThreeMatchdays() {
        List<UUID> players =
            List.of(UUID.fromString("00000000-0000-0000-0000-000000000001"), UUID.fromString("00000000-0000-0000-0000-000000000002"), UUID.fromString("00000000-0000-0000-0000-000000000003"), UUID.fromString("00000000-0000-0000-0000-000000000004"));
        List<List<RoundRobin.Pairing>> days = RoundRobin.schedule(players);
        assertEquals(3, days.size());
        int pairings = days.stream().mapToInt(List::size).sum();
        assertEquals(6, pairings);
    }
}
