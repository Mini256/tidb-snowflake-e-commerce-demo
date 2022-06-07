package com.pingcap.ecommerce.cli.command;

import com.beust.jcommander.Parameters;
import com.pingcap.ecommerce.cli.loader.BatchLoader;
import com.pingcap.ecommerce.cli.loader.ConcurrentBatchLoader;
import com.pingcap.ecommerce.cli.loader.PreparedBatchLoader;
import com.pingcap.ecommerce.dao.tidb.ExpressMapper;
import com.pingcap.ecommerce.dao.tidb.ItemMapper;
import com.pingcap.ecommerce.dao.tidb.OrderMapper;
import com.pingcap.ecommerce.dao.tidb.UserMapper;
import com.pingcap.ecommerce.model.ExpressStatus;
import com.pingcap.ecommerce.model.Item;
import com.pingcap.ecommerce.model.Order;
import com.pingcap.ecommerce.model.UserLabel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.data.domain.PageRequest;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.*;
import java.util.concurrent.ConcurrentSkipListSet;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static net.andreinc.mockneat.types.enums.StringType.NUMBERS;
import static net.andreinc.mockneat.unit.address.Addresses.addresses;
import static net.andreinc.mockneat.unit.objects.From.from;
import static net.andreinc.mockneat.unit.text.Strings.strings;
import static net.andreinc.mockneat.unit.time.LocalDates.localDates;
import static net.andreinc.mockneat.unit.types.Ints.ints;
import static net.andreinc.mockneat.unit.types.Longs.longs;

@Slf4j
@Parameters(
    commandNames = { "incremental-data" },
    commandDescription = "Import incremental test data into database."
)
public class IncrementalDataCommand {

    private static final int MAX_BATCH_COUNT = 2000;

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

                            if (i % 2000 == 0) {
                                log.info("2000 orders and expresses are inserted into database.");
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
        List<String> userIds;
        int pageNum = 0;
        int pageSize = 10000;

        do {
            userIds = userMapper.getUserIds(PageRequest.of(pageNum, pageSize));
            userIdList.addAll(userIds);
            log.info("Loaded user IDs, page {}.", pageNum);
            pageNum++;
        } while (userIds.size() > 0);

        log.info("Loaded all {} user IDs.", userIdList.size());

        return userIdList;
    }

    private List<Item> loadItemList(ItemMapper itemMapper) {
        List<Item> itemList = new ArrayList<>();
        List<Item> items;
        int pageNum = 0;
        int pageSize = 10000;

        do {
            items = itemMapper.getItemsBaseInfo(PageRequest.of(pageNum, pageSize));
            itemList.addAll(items);
            log.info("Loaded items, page {}.", pageNum);
            pageNum++;
        } while (items.size() > 0);

        log.info("Loaded all {} items.", itemList.size());

        return itemList;
    }

    private Set<Long> loadOrderIdSet(OrderMapper orderMapper) {
        Set<Long> orderIdSet = new ConcurrentSkipListSet<>();
        List<Long> orderIds;
        int pageNum = 0;
        int pageSize = 10000;

        do {
            orderIds = orderMapper.getOrderIds(PageRequest.of(pageNum, pageSize));
            orderIdSet.addAll(orderIds);
            log.info("Loaded order IDs, page {}.", pageNum);
            pageNum++;
        } while (orderIds.size() > 0);

        log.info("Loaded all {} order IDs.", orderIdSet.size());

        return orderIdSet;
    }

    private Set<Long> loadExpressIdSet(ExpressMapper expressMapper) {
        Set<Long> expressIdSet = new ConcurrentSkipListSet<>();
        List<Long> expressIds;
        int pageNum = 0;
        int pageSize = 10000;

        do {
            expressIds = expressMapper.getExpressIds(PageRequest.of(pageNum, pageSize));
            expressIdSet.addAll(expressIds);
            log.info("Loaded express IDs, page {}.", pageNum);
            pageNum++;
        } while (expressIds.size() > 0);

        log.info("Loaded all {} express IDs.", expressIdSet.size());

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
