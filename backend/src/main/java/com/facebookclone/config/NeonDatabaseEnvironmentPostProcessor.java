package com.facebookclone.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

/**
 * Normalizes Neon/Render database URLs so a pasted postgresql:// string still works.
 */
public class NeonDatabaseEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String rawUrl = firstNonBlank(
            environment.getProperty("SPRING_DATASOURCE_URL"),
            environment.getProperty("DATABASE_URL")
        );

        if (rawUrl == null || rawUrl.isBlank()) {
            return;
        }

        String jdbcUrl = toJdbcUrl(rawUrl.trim());
        Map<String, Object> props = new HashMap<>();
        props.put("spring.datasource.url", jdbcUrl);
        environment.getPropertySources().addFirst(new MapPropertySource("neonDatabaseUrl", props));
    }

    private static String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

    static String toJdbcUrl(String url) {
        String jdbc = url;
        if (jdbc.startsWith("postgres://")) {
            jdbc = "postgresql://" + jdbc.substring("postgres://".length());
        }
        if (jdbc.startsWith("postgresql://")) {
            jdbc = "jdbc:" + jdbc;
        }
        if (!jdbc.contains("sslmode=")) {
            jdbc += jdbc.contains("?") ? "&sslmode=require" : "?sslmode=require";
        }
        return jdbc;
    }
}
