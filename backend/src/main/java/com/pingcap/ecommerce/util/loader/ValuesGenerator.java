package com.pingcap.ecommerce.util.loader;

import java.util.List;

@FunctionalInterface
public interface ValuesGenerator {

    List<Object> generate(int chunkId, int nChunks, int i);

}
