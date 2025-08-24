package com.handys.asia.exception;

public class TaskExpiryException extends RuntimeException {
    public TaskExpiryException(String message) {
        super(message);
    }
}
