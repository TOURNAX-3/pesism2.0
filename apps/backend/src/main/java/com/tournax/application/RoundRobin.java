package com.tournax.application;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/** Circle-method round robin (same rules as {@code @tournax/core} fixtures). */
public final class RoundRobin {

    private RoundRobin() {}

    public record Pairing(UUID homeId, UUID awayId) {}

    public static List<List<Pairing>> schedule(List<UUID> players) {
        if (players.size() != new HashSet<>(players).size()) {
            throw new IllegalArgumentException("Duplicate player ids");
        }
        if (players.size() < 2) {
            return List.of();
        }

        List<UUID> list = new ArrayList<>(players);
        if (list.size() % 2 == 1) {
            list.add(null);
        }
        int n = list.size();
        List<List<Pairing>> rounds = new ArrayList<>();

        for (int r = 0; r < n - 1; r++) {
            List<Pairing> day = new ArrayList<>();
            for (int i = 0; i < n / 2; i++) {
                UUID a = list.get(i);
                UUID b = list.get(n - 1 - i);
                if (a == null || b == null) {
                    continue;
                }
                day.add(r % 2 == 0 ? new Pairing(a, b) : new Pairing(b, a));
            }
            rounds.add(day);
            UUID last = list.remove(n - 1);
            list.add(1, last);
        }

        return rounds;
    }
}
