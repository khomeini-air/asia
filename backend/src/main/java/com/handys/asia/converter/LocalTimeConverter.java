package com.handys.asia.converter;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class LocalTimeConverter {
    public static LocalDateTime toLocalTime(Long millisecond) {
        return Instant.ofEpochMilli(millisecond)
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }
}
