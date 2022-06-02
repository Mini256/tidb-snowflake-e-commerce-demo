package com.pingcap.ecommerce.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResultVO<R> {

    private List<R> content;

    private long rowTotal;

    private int pageNum;

    private int pageSize;

    public static <R> ResultVO<R> of(List<R> content, long rowTotal, int pageNum, int pageSize) {
        return new ResultVO<>(content, rowTotal, pageNum, pageSize);
    }

}
