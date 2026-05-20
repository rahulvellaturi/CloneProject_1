package com.facebookclone.config;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

final class NeonConnectionParser {

    private NeonConnectionParser() {}

    record ConnectionDetails(String jdbcUrl, String username, String password) {}

    static Optional<ConnectionDetails> parse(String raw) {
        if (raw == null || raw.isBlank()) {
            return Optional.empty();
        }

        String trimmed = raw.trim();
        String jdbcUrl = toJdbcUrl(trimmed);

        if (!trimmed.contains("@") || trimmed.startsWith("jdbc:postgresql://")) {
            return Optional.of(new ConnectionDetails(jdbcUrl, null, null));
        }

        try {
            String forUri = trimmed
                .replaceFirst("^jdbc:", "")
                .replaceFirst("^postgresql://", "http://")
                .replaceFirst("^postgres://", "http://");

            URI uri = URI.create(forUri);
            String userInfo = uri.getUserInfo();
            if (userInfo == null || !userInfo.contains(":")) {
                return Optional.of(new ConnectionDetails(jdbcUrl, null, null));
            }

            int colon = userInfo.indexOf(':');
            String username = decode(userInfo.substring(0, colon));
            String password = decode(userInfo.substring(colon + 1));
            String host = uri.getHost();
            int port = uri.getPort() > 0 ? uri.getPort() : 5432;
            String path = uri.getPath() != null ? uri.getPath() : "/neondb";
            String query = uri.getRawQuery();

            StringBuilder rebuilt = new StringBuilder("jdbc:postgresql://")
                .append(host).append(":").append(port).append(path);
            if (query != null && !query.isBlank()) {
                rebuilt.append("?").append(query);
            } else {
                rebuilt.append("?sslmode=require");
            }
            if (!rebuilt.toString().contains("sslmode=")) {
                rebuilt.append(rebuilt.indexOf("?") >= 0 ? "&sslmode=require" : "?sslmode=require");
            }

            return Optional.of(new ConnectionDetails(rebuilt.toString(), username, password));
        } catch (Exception ignored) {
            return Optional.of(new ConnectionDetails(jdbcUrl, null, null));
        }
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

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }
}
