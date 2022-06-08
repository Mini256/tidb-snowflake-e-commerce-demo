package com.pingcap.ecommerce.service;

import com.pingcap.ecommerce.dao.tidb.ItemMapper;
import com.pingcap.ecommerce.model.Item;
import com.pingcap.ecommerce.cli.loader.ConcurrentCSVBatchLoader;
import com.pingcap.ecommerce.vo.ResultVO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentSkipListSet;

import static net.andreinc.mockneat.unit.text.Markovs.markovs;
import static net.andreinc.mockneat.unit.objects.From.from;
import static net.andreinc.mockneat.unit.text.Words.words;
import static net.andreinc.mockneat.unit.types.Doubles.doubles;
import static net.andreinc.mockneat.unit.types.Longs.longs;

@Slf4j
@Service
@AllArgsConstructor
public class ItemService {

    private final ItemMapper itemMapper;

    public ResultVO<Item> getItems(String type, Pageable pageable) {
        List<Item> items = itemMapper.getItems(type, pageable);
        long rowCount = 1000; // itemMapper.getItemCount(type);
        return ResultVO.of(items, rowCount, pageable.getPageNumber(), pageable.getPageSize());
    }

}
