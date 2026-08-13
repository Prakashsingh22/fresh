package com.zepto.zepto_backend.exceptions;

public class RecordDoesNotExist extends RuntimeException {
    public RecordDoesNotExist(String message) {
        super(message);
    }
}
