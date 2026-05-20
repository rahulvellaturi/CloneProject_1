package com.facebookclone.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class DatabaseStartupLogger {

    private static final Logger log = LoggerFactory.getLogger(DatabaseStartupLogger.class);

    private final Environment environment;

    public DatabaseStartupLogger(Environment environment) {
        this.environment = environment;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void logDatabaseConfig() {
        String url = environment.getProperty("spring.datasource.url", "");
        String maskedUrl = url.replaceAll("://([^:]+):([^@]+)@", "://***:***@");
        log.info("Active profiles: {}", String.join(",", environment.getActiveProfiles()));
        log.info("Datasource URL (masked): {}", maskedUrl.isEmpty() ? "<not set>" : maskedUrl);
        log.info(
            "Datasource user set: {}",
            environment.getProperty("spring.datasource.username") != null
        );
    }
}
