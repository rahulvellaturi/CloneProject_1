package com.facebookclone.config;

import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class NeonConnectionParserTest {

    @Test
    void parsesFullNeonConnectionString() {
        Optional<NeonConnectionParser.ConnectionDetails> details = NeonConnectionParser.parse(
            "postgresql://neondb_owner:secret@ep-test.neon.tech/neondb"
        );

        assertTrue(details.isPresent());
        assertEquals("neondb_owner", details.get().username());
        assertEquals("secret", details.get().password());
        assertTrue(details.get().jdbcUrl().startsWith("jdbc:postgresql://ep-test.neon.tech"));
        assertTrue(details.get().jdbcUrl().contains("sslmode=require"));
    }

    @Test
    void convertsJdbcUrlWithoutCredentials() {
        String jdbc = NeonConnectionParser.toJdbcUrl(
            "jdbc:postgresql://ep-test.neon.tech/neondb"
        );
        assertTrue(jdbc.contains("sslmode=require"));
    }
}
