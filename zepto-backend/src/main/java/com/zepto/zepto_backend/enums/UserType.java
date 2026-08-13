package com.zepto.zepto_backend.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum UserType {
    CONSUMER,
    ZEPTO_APP_ADMIN,
    DELIVERY_PARTNER,
    SYSTEM,
    MEINT,
    WAREHOUSE_ADMIN;

    @JsonCreator
    public static UserType fromString(String value) {
        return UserType.valueOf(value.toUpperCase());
    }
}
