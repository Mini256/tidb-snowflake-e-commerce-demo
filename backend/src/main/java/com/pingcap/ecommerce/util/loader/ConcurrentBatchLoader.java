package com.pingcap.ecommerce.util.loader;

import com.pingcap.ecommerce.model.JobInstance;

public interface ConcurrentBatchLoader {

    void batchInsert(String name, String tableName, String[] headers, int n, JobInstance instance, ValuesGenerator generator);

}
