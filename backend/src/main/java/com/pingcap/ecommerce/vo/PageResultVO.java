package com.pingcap.ecommerce.vo;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.util.List;

@Data
@NoArgsConstructor
public class PageResultVO<R> {

    private List<R> content;

    private BigInteger rowTotal;

    private int pageNum;

    private int pageSize;

    private PageResultVO(List<R> content, BigInteger rowTotal, int pageNum, int pageSize) {
        this.content = content;
        this.rowTotal = rowTotal;
        this.pageNum = pageNum;
        this.pageSize = pageSize;
    }

    public static <R> PageResultVO<R> of(List<R> content, BigInteger rowTotal, int pageNum, int pageSize) {
        return new PageResultVO<>(content, rowTotal, pageNum, pageSize);
    }

}
