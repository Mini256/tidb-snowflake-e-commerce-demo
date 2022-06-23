package com.pingcap.ecommerce.exception;

public class FailedToConnectException extends RuntimeException {

    public FailedToConnectException(String message, Throwable cause) {
        super(message, cause);
    }

}
