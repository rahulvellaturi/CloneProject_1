package com.facebookclone.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.mock.env.MockEnvironment;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class NeonDatabaseEnvironmentPostProcessorTest {

    @Test
    void registersViaSpringFactoriesAndImportsFile() throws Exception {
        assertContainsProcessor(loadResource("META-INF/spring.factories"));
        assertContainsProcessor(loadResource("META-INF/spring/org.springframework.boot.env.EnvironmentPostProcessor"));
    }

    @Test
    void convertsNeonConnectionStringToJdbcUrl() {
        MockEnvironment environment = new MockEnvironment();
        environment.setProperty("SPRING_DATASOURCE_URL",
            "postgresql://neondb_owner:secret@ep-test.neon.tech/neondb?sslmode=require");

        new NeonDatabaseEnvironmentPostProcessor().postProcessEnvironment(
            environment,
            new SpringApplication(Object.class)
        );

        assertEquals(
            "jdbc:postgresql://ep-test.neon.tech/neondb?sslmode=require",
            environment.getProperty("spring.datasource.url")
        );
        assertEquals("neondb_owner", environment.getProperty("spring.datasource.username"));
        assertEquals("secret", environment.getProperty("spring.datasource.password"));
    }

    private static void assertContainsProcessor(String content) {
        assertNotNull(content);
        assertTrue(content.contains("NeonDatabaseEnvironmentPostProcessor"));
    }

    private static String loadResource(String path) throws Exception {
        try (InputStream in = NeonDatabaseEnvironmentPostProcessorTest.class
            .getClassLoader()
            .getResourceAsStream(path)) {
            assertNotNull(in, "Missing " + path);
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        }
    }
}
