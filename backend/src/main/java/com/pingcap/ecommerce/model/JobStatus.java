package com.pingcap.ecommerce.model;

public enum JobStatus {

    CREATED,
    RUNNING,
    FINISHED,
    FAIL;

    @Override
    public String toString() {
        return this.name();
    }
}
