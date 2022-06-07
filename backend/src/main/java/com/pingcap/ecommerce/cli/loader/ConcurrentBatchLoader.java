package com.pingcap.ecommerce.cli.loader;

public interface ConcurrentBatchLoader {

    void batchInsert(String name, String tableName, String[] headers, int n, ValuesGenerator generator);

}
