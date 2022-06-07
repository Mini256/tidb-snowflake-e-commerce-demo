package com.pingcap.ecommerce.cli.command;

import com.beust.jcommander.Parameters;
import com.pingcap.ecommerce.cli.loader.BatchLoader;
import com.pingcap.ecommerce.cli.loader.PreparedBatchLoader;
import com.pingcap.ecommerce.dao.tidb.ExpressMapper;
import com.pingcap.ecommerce.dao.tidb.ItemMapper;
import com.pingcap.ecommerce.dao.tidb.OrderMapper;
import com.pingcap.ecommerce.dao.tidb.UserMapper;
import com.pingcap.ecommerce.model.ExpressStatus;
import com.pingcap.ecommerce.model.Item;
import com.pingcap.ecommerce.vo.PageMeta;
import lombok.extern.slf4j.Slf4j;
import me.tongfei.progressbar.ProgressBar;
import org.springframework.context.ConfigurableApplicationContext;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.Connection;
import java.util.*;
import java.util.concurrent.ConcurrentSkipListSet;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static net.andreinc.mockneat.types.enums.StringType.NUMBERS;
import static net.andreinc.mockneat.unit.address.Addresses.addresses;
import static net.andreinc.mockneat.unit.objects.From.from;
import static net.andreinc.mockneat.unit.text.Strings.strings;
import static net.andreinc.mockneat.unit.types.Ints.ints;
import static net.andreinc.mockneat.unit.types.Longs.longs;

@Slf4j
@Parameters(
    commandNames = { "incremental-data" },
    commandDescription = "Import incremental test data into database."
)
public class IncrementalDataCommand {

    private static final String[] orderColumns = new String[]{
        "id", "user_id", "amount", "item_id", "item_name", "item_count", "create_time"
    };

    private static final String[] expressColumns = new String[]{
            "id", "order_id", "user_id", "post_id", "address", "current_address", "status", "create_time"
    };

    public void incrementalData(ConfigurableApplicationContext ctx) {
        DataSource dataSource = ctx.getBean("PrimaryDataSource", DataSource.class);
        ItemMapper itemMapper = ctx.getBean(ItemMapper.class);
        UserMapper userMapper = ctx.getBean(UserMapper.class);
        OrderMapper orderMapper = ctx.getBean(OrderMapper.class);
        ExpressMapper expressMapper = ctx.getBean(ExpressMapper.class);

        log.info("Loading data from database...");
        List<String> userIdList = loadUserIdList(userMapper);
        List<Item> itemList = loadItemList(itemMapper);
        Set<Long> orderIdSet = loadOrderIdSet(orderMapper);
        Set<Long> expressIdSet = loadExpressIdSet(expressMapper);

        List<String> addresses = new ArrayList<>();
        for (int i = 0; i < 2000; i++) {
            addresses.add(addresses().get());
        }

        log.info("Start to generate and insert data into database...");

        int nCores = Runtime.getRuntime().availableProcessors();
        int nWorkers = Math.min(Math.max(4, nCores), 16);

        ExecutorService threadPool = Executors.newFixedThreadPool(nWorkers);
        for (int workerId = 1; workerId <= nWorkers; workerId++) {
            threadPool.execute(
                () -> {
                    try (Connection conn = dataSource.getConnection()) {
                        BatchLoader orderLoader = new PreparedBatchLoader(conn, getInsertSQL("orders", orderColumns));
                        BatchLoader expressLoader = new PreparedBatchLoader(conn, getInsertSQL("expresses", expressColumns));

                        // If the primary key use the auto random feature, we need to enable
                        // this flag to allow insert explicit value to TiDB.
                        conn.createStatement().execute("set @@allow_auto_random_explicit_insert = true;");

                        int bulkSize = ints().range(10, 2000).get();
                        orderLoader.setBulkSize(bulkSize);

                        int i = 0;
                        while (true) {
                            List<Object> orderValues = getOrderValues(userIdList, itemList, orderIdSet);

                            if (orderValues == null) {
                                continue;
                            }

                            orderLoader.insertValues(orderValues);

                            Long orderId = (Long) orderValues.get(0);
                            String userId = (String) orderValues.get(1);
                            List<Object> expressValues = getExpressValues(addresses, expressIdSet, orderId, userId);

                            if (expressValues == null) {
                                continue;
                            }

                            expressLoader.insertValues(expressValues);

                            if (i % bulkSize == 0) {
                                bulkSize = ints().range(10, 2000).get();
                                orderLoader.setBulkSize(bulkSize);
                                log.info("{} orders and expresses are inserted into database.", bulkSize);
                            }
                            i++;
                        }
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
        }
    }

    private List<String> loadUserIdList(UserMapper userMapper) {
        List<String> userIdList = new ArrayList<>();
        int pageSize = 10000;

        List<PageMeta<String>> userPages = userMapper.getUserPages(pageSize);
        int n = userPages.size();
        try (ProgressBar pb = new ProgressBar("Importing User Data by Page", n)) {
            for (PageMeta<String> userPage : userPages) {
                List<String> userIds = userMapper.getUserIdsByPageMeta(userPage);
                userIdList.addAll(userIds);
                pb.step();
                log.debug(
                    "Loaded user IDs, page_number={}, page_size={}, start_key = {}, end_key = {}.",
                    userPage.getPageNum(), userPage.getPageSize(), userPage.getStartKey(), userPage.getEndKey()
                );
            }
            pb.stepTo(n);
            log.info("\nLoaded {} user IDs.", userIdList.size());
        }

        return userIdList;
    }

    private List<Item> loadItemList(ItemMapper itemMapper) {
        List<Item> itemList = new ArrayList<>();
        int pageSize = 10000;
        List<PageMeta<Long>> itemPages = itemMapper.getItemsBaseInfoPage(pageSize);

        int n = itemPages.size();
        try (ProgressBar pb = new ProgressBar("Importing Item Data by Page", n)) {
            for (PageMeta<Long> itemPage : itemPages) {
                List<Item> items = itemMapper.getItemsBaseInfosByPageMeta(itemPage);
                itemList.addAll(items);
                pb.step();
                log.debug(
                    "Loaded item base infos, page_number={}, page_size={}, start_key = {}, end_key = {}.",
                    itemPage.getPageNum(), itemPage.getPageSize(), itemPage.getStartKey(), itemPage.getEndKey()
                );
            }
            pb.stepTo(n);
            log.info("\nLoaded {} item base infos.", itemList.size());
        }

        return itemList;
    }

    private Set<Long> loadOrderIdSet(OrderMapper orderMapper) {
        Set<Long> orderIdSet = new ConcurrentSkipListSet<>();
        int pageSize = 10000;

        List<PageMeta<Long>> orderIdPages = orderMapper.getOrderIdPages(pageSize);
        int n = orderIdPages.size();
        try (ProgressBar pb = new ProgressBar("Importing Order Data by Page", n)) {
            for (PageMeta<Long> orderIdPage : orderIdPages) {
                List<Long> orderIds = orderMapper.getOrderIdsByPageMeta(orderIdPage);
                orderIdSet.addAll(orderIds);
                pb.step();
                log.debug(
                    "Loaded order ids, page_number={}, page_size={}, start_key = {}, end_key = {}.",
                    orderIdPage.getPageNum(), orderIdPage.getPageSize(), orderIdPage.getStartKey(), orderIdPage.getEndKey()
                );
            }
            pb.stepTo(n);
            log.info("\nLoaded {} order IDs.", orderIdSet.size());
        }

        return orderIdSet;
    }

    private Set<Long> loadExpressIdSet(ExpressMapper expressMapper) {
        Set<Long> expressIdSet = new ConcurrentSkipListSet<>();
        int pageSize = 10000;

        List<PageMeta<Long>> expressIdPages = expressMapper.getExpressIdPages(pageSize);
        int n = expressIdPages.size();
        try (ProgressBar pb = new ProgressBar("Importing Order Data by Page", n)) {
            for (PageMeta<Long> expressIdPage : expressIdPages) {
                List<Long> expressIds = expressMapper.getExpressIdsByPageMeta(expressIdPage);
                expressIdSet.addAll(expressIds);
                pb.step();
                log.debug(
                    "Loaded express ids, page_number={}, page_size={}, start_key = {}, end_key = {}.",
                    expressIdPage.getPageNum(), expressIdPage.getPageSize(), expressIdPage.getStartKey(), expressIdPage.getEndKey()
                );
            }
            pb.stepTo(n);
            log.info("\nLoaded {} express IDs.", expressIdSet.size());
        }

        return expressIdSet;
    }

    private List<Object> getOrderValues(List<String> userIdList, List<Item> itemList, Set<Long> orderIdSet) {
        Long orderId = longs().lowerBound(1000).get();
        String userId = from(userIdList).get();
        Item item = from(itemList).get();
        Long itemId = item.getId();
        String itemName = item.getItemName();
        Integer itemCount = ints().range(1, 10).get();
        BigDecimal amount = item.getItemPrice().multiply(BigDecimal.valueOf(itemCount));
        Date createTime = new Date();

        if (orderIdSet.contains(orderId)) {
            return null;
        } else {
            orderIdSet.add(orderId);
        }

        List<Object> fields = new ArrayList<>();
        fields.add(orderId);
        fields.add(userId);
        fields.add(amount);
        fields.add(itemId);
        fields.add(itemName);
        fields.add(itemCount);
        fields.add(createTime);

        return fields;
    }

    private List<Object> getExpressValues(List<String> addresses, Set<Long> expressIdSet, Long orderId, String userId)  {
        Long expressId = longs().lowerBound(1000).get();
        String postId = strings().size(24).types(NUMBERS).get();
        String address = from(addresses).get();
        String currentAddress = from(addresses).get();
        String status = from(ExpressStatus.values()).get().name();
        Date createTime = new Date();

        if (expressIdSet.contains(expressId)) {
            return null;
        } else {
            expressIdSet.add(expressId);
        }

        List<Object> fields = new ArrayList<>();
        fields.add(expressId);
        fields.add(orderId);
        fields.add(userId);
        fields.add(postId);
        fields.add(address);
        fields.add(currentAddress);
        fields.add(status);
        fields.add(createTime);

        return fields;
    }

    private String getInsertSQL(String tableName, String[] headers) {
        String columns = String.join(", ", headers);
        String values = String.join(", ", Arrays.stream(headers).map(header -> "?").toArray(String[]::new));
        return String.format("INSERT INTO %s (%s) VALUES (%s);", tableName, columns, values);
    }

}
