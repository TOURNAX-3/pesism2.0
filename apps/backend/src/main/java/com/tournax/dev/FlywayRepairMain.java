package com.tournax.dev;

import org.flywaydb.core.Flyway;

/** Dev-only: run via `./gradlew.bat flywayRepair` when Flyway reports a checksum mismatch after editing an already-applied migration. */
public final class FlywayRepairMain {

    private FlywayRepairMain() {}

    public static void main(String[] args) {
        String url = requireEnv("DATABASE_URL");
        String user = requireEnv("DATABASE_USER");
        String password = requireEnv("DATABASE_PASSWORD");
        var flyway =
            Flyway.configure().dataSource(url, user, password).locations("classpath:db/migration").load();
        var result = flyway.repair();
        System.out.println("Flyway repair done: " + result.repairActions);
        if (!result.migrationsAligned.isEmpty()) {
            System.out.printf("Checksums aligned: %d%n", result.migrationsAligned.size());
        }
    }

    private static String requireEnv(String key) {
        String v = System.getenv(key);
        if (v == null || v.isBlank()) {
            throw new IllegalStateException("Missing env var: " + key + " (use apps/backend/.env via flywayRepair task)");
        }
        return v.trim();
    }
}