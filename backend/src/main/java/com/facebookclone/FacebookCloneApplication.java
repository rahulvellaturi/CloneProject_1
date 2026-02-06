package com.facebookclone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class FacebookCloneApplication {
    public static void main(String[] args) {
        SpringApplication.run(FacebookCloneApplication.class, args);
    }
}
