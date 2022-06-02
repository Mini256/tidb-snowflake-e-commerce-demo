package com.pingcap.shop.util;

import java.util.List;

public interface BatchLoader extends AutoCloseable {
    void insertValues(List<Object> values) throws Exception;
    void flush() throws Exception;
    void close() throws Exception;
}
