package com.facebookclone.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Configures Neon/Render database settings from env vars or a single pasted connection string.
 */
public class NeonDatabaseEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        boolean onRender = isOnRender(environment);

        String rawUrl = firstNonBlank(
            environment.getProperty("SPRING_DATASOURCE_URL"),
            environment.getProperty("DATABASE_URL")
        );
        String username = blankToNull(environment.getProperty("SPRING_DATASOURCE_USERNAME"));
        String password = blankToNull(environment.getProperty("SPRING_DATASOURCE_PASSWORD"));

        if (rawUrl == null) {
            if (onRender) {
                throw new IllegalStateException(renderSetupMessage());
            }
            return;
        }

        if (onRender && rawUrl.contains("localhost")) {
            throw new IllegalStateException(renderSetupMessage());
        }

        Optional<NeonConnectionParser.ConnectionDetails> parsed = NeonConnectionParser.parse(rawUrl);
        if (parsed.isEmpty()) {
            return;
        }

        NeonConnectionParser.ConnectionDetails details = parsed.get();
        Map<String, Object> props = new HashMap<>();
        props.put("spring.datasource.url", details.jdbcUrl());

        if (username == null && details.username() != null) {
            props.put("spring.datasource.username", details.username());
        }
        if (password == null && details.password() != null) {
            props.put("spring.datasource.password", details.password());
        }

        environment.getPropertySources().addFirst(new MapPropertySource("neonDatabaseConfig", props));
    }

    private static boolean isOnRender(ConfigurableEnvironment environment) {
        return firstNonBlank(
            environment.getProperty("RENDER"),
            System.getenv("RENDER")
        ) != null;
    }

    private static String renderSetupMessage() {
        return """
            Database is not configured for Render.
            In Render Dashboard -> facebook-clone-api -> Environment, set:
              SPRING_DATASOURCE_URL = jdbc:postgresql://<neon-host>/neondb?sslmode=require
              SPRING_DATASOURCE_USERNAME = neondb_owner
              SPRING_DATASOURCE_PASSWORD = <your Neon password>
            Or paste the full Neon connection string into SPRING_DATASOURCE_URL only.
            Then Manual Deploy the latest commit.
            """;
    }

    private static String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
