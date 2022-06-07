package com.pingcap.ecommerce.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageMeta<K> {
    private int pageNum;
    private int PageSize;
    private K startKey;
    private K endKey;
}
