package com.facebookclone.config;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

class NeonDatabaseEnvironmentPostProcessorTest {

    @Test
    void convertsPostgresqlUrlToJdbcWithSsl() {
        String jdbc = NeonDatabaseEnvironmentPostProcessor.toJdbcUrl(
            "postgresql://user:pass@ep-test.neon.tech/neondb"
        );
        assertTrue(jdbc.startsWith("jdbc:postgresql://"));
        assertTrue(jdbc.contains("sslmode=require"));
    }
}
