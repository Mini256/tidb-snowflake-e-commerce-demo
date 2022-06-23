package com.pingcap.ecommerce.vo;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class PageResultVO<R> {

    private List<R> content;

    private long rowTotal;

    private int pageNum;

    private int pageSize;

    private PageResultVO(List<R> content, long rowTotal, int pageNum, int pageSize) {
        this.content = content;
        this.rowTotal = rowTotal;
        this.pageNum = pageNum;
        this.pageSize = pageSize;
    }

    public static <R> PageResultVO<R> of(List<R> content, long rowTotal, int pageNum, int pageSize) {
        return new PageResultVO<>(content, rowTotal, pageNum + 1, pageSize);
    }

}
