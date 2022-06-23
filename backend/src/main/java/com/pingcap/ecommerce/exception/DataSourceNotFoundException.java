package com.pingcap.ecommerce.exception;

public class DataSourceNotFoundException extends RuntimeException {

    public DataSourceNotFoundException() {
        super("datasource not found");
    }

    public DataSourceNotFoundException(String message) {
        super(message);
    }

}
