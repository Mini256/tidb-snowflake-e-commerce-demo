package com.pingcap.ecommerce.util.loader;

import java.util.List;

public interface BatchLoader extends AutoCloseable {
    void insertValues(List<Object> values) throws Exception;
    void setBulkSize(int bulkSize);
    void flush() throws Exception;
    void close() throws Exception;
}
