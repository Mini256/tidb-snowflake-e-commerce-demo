package com.pingcap.ecommerce.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ResultVO<R> {

    private List<R> content;

    private long rowTotal;

    private int pageNum;

    private int pageSize;

    private ResultVO(List<R> content, long rowTotal, int pageNum, int pageSize) {
        this.content = content;
        this.rowTotal = rowTotal;
        this.pageNum = pageNum;
        this.pageSize = pageSize;
    }

    public static <R> ResultVO<R> of(List<R> content, long rowTotal, int pageNum, int pageSize) {
        return new ResultVO<>(content, rowTotal, pageNum + 1, pageSize);
    }

}
