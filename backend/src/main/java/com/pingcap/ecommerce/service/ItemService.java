package com.pingcap.ecommerce.service;

import com.pingcap.ecommerce.dao.tidb.ItemMapper;
import com.pingcap.ecommerce.model.Item;
import com.pingcap.ecommerce.util.ConcurrentCSVBatchLoader;
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

    private final ConcurrentCSVBatchLoader batchLoader;

    private final List<String> itemTypes = Arrays.asList(
        "Toys & Games",
        "Automotive",
        "Books",
        "Computers",
        "Luggage",
        "Pet Supplies",
        "Sports & Outdoors",
        "Home & Kitchen"
    );

    public List<Item> importSampleItemData(int n) {
        Set<Long> itemIdSet = new ConcurrentSkipListSet<>();
        List<Item> itemSet = Collections.synchronizedList(new ArrayList<>());

        String sql = "INSERT INTO items (id, item_name, item_type, item_price, item_desc) VALUES (?, ?, ?, ?, ?);";
        String[] headers = new String[]{
            "id", "item_name", "item_type", "item_price", "item_desc"
        };
        batchLoader.batchInsert("Item", "items", headers, n, (w, nWorkers, i) -> {
            Long itemId = longs().lowerBound(1000).get();
            BigDecimal itemPrice = BigDecimal.valueOf(doubles().range(10.0, 100000.0).get());
            String itemName = words().nouns().get();
            String itemType = from(itemTypes).get();
            String itemDesc = markovs().size(20).get();

            if (itemIdSet.contains(itemId)) {
                return null;
            } else {
                itemIdSet.add(itemId);
                itemSet.add(new Item(itemId, itemName, itemPrice));
            }

            List<Object> fields = new ArrayList<>();
            fields.add(itemId);
            fields.add(itemName);
            fields.add(itemType);
            fields.add(itemPrice);
            fields.add(itemDesc);

            return fields;
        });
        return itemSet;
    }

    public ResultVO<Item> getItems(String type, Pageable pageable) {
        List<Item> items = itemMapper.getItems(type, pageable);
        long rowCount = 1000; // itemMapper.getItemCount(type);
        return new ResultVO<>(items, rowCount, pageable.getPageNumber(), pageable.getPageSize());
    }

}
