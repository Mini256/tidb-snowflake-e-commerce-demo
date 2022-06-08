package com.pingcap.ecommerce.cli.command;

import com.beust.jcommander.Parameter;
import com.beust.jcommander.Parameters;
import com.pingcap.ecommerce.cli.loader.*;
import com.pingcap.ecommerce.dao.tidb.ExpressMapper;
import com.pingcap.ecommerce.dao.tidb.ItemMapper;
import com.pingcap.ecommerce.dao.tidb.OrderMapper;
import com.pingcap.ecommerce.dao.tidb.UserMapper;
import com.pingcap.ecommerce.model.ExpressStatus;
import com.pingcap.ecommerce.model.Item;
import com.pingcap.ecommerce.model.Order;
import com.pingcap.ecommerce.vo.PageMeta;
import lombok.extern.slf4j.Slf4j;
import me.tongfei.progressbar.ProgressBar;
import org.springframework.context.ConfigurableApplicationContext;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.Connection;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentSkipListSet;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

import static net.andreinc.mockneat.types.enums.StringType.*;
import static net.andreinc.mockneat.unit.address.Addresses.addresses;
import static net.andreinc.mockneat.unit.objects.From.from;
import static net.andreinc.mockneat.unit.text.Markovs.markovs;
import static net.andreinc.mockneat.unit.text.Strings.strings;
import static net.andreinc.mockneat.unit.text.Words.words;
import static net.andreinc.mockneat.unit.time.LocalDates.localDates;
import static net.andreinc.mockneat.unit.types.Doubles.doubles;
import static net.andreinc.mockneat.unit.types.Ints.ints;
import static net.andreinc.mockneat.unit.types.Longs.longs;
import static net.andreinc.mockneat.unit.user.Passwords.passwords;
import static net.andreinc.mockneat.unit.user.Users.users;

@Slf4j
@Parameters(
    commandNames = { "import-data" },
    commandDescription = "Import test data into database."
)
public class ImportDataCommand {

    private static final int N_USERS_DEFAULT_VALUE = 100_000;
    private static final int N_ITEM_DEFAULT_VALUE = 100_000;
    private static final int N_ORDERS_DEFAULT_VALUE = 100_000;

    private static final String CSV_MODE = "CSV";
    private static final String PREPARED_MODE = "PREPARED";

    @Parameter(
        names = "--users",
        description = "Specify the number of users need to import."
    )
    private int nUsers = N_USERS_DEFAULT_VALUE;

    @Parameter(
        names = "--items",
        description = "Specify the number of items need to import."
    )
    private int nItems = N_ITEM_DEFAULT_VALUE;

    @Parameter(
        names = "--orders",
        description = "Specify the number of orders need to import."
    )
    private int nOrders = N_ORDERS_DEFAULT_VALUE;

    @Parameter(
        names = "--mode",
        description = "Specify bulk load mode."
    )
    private String mode = PREPARED_MODE;

    private ConcurrentBatchLoader concurrentBatchLoader;

    private static final String[] userColumns = new String[]{
        "id", "username", "password"
    };

    private static final String[] itemColumns = new String[]{
        "id", "item_name", "item_type", "item_price", "item_desc"
    };

    private static final String[] orderColumns = new String[]{
        "id", "user_id", "amount", "item_id", "item_name", "item_count", "create_time"
    };

    private static final String[] expressColumns = new String[]{
        "id", "order_id", "user_id", "post_id", "address", "current_address", "status", "create_time"
    };

    private static final List<String> itemTypes = Arrays.asList(
        "Toys & Games",
        "Automotive",
        "Books",
        "Computers",
        "Luggage",
        "Pet Supplies",
        "Sports & Outdoors",
        "Home & Kitchen"
    );

    public void importData(ConfigurableApplicationContext ctx) {
        UserMapper userMapper = ctx.getBean(UserMapper.class);
        ItemMapper itemMapper = ctx.getBean(ItemMapper.class);
        OrderMapper orderMapper = ctx.getBean(OrderMapper.class);
        ExpressMapper expressMapper = ctx.getBean(ExpressMapper.class);
        DataSource dataSource = ctx.getBean("PrimaryDataSource", DataSource.class);

        if (mode.equals(CSV_MODE)) {
            concurrentBatchLoader = ctx.getBean(ConcurrentCSVBatchLoader.class);
        } else {
            concurrentBatchLoader = ctx.getBean(ConcurrentPreparedBatchLoader.class);
        }

        List<String> userIdList;
        List<Item> itemList;
        Set<Long> orderIdSet;
        Set<Long> expressIdSet;

        if (userMapper.existsAnyUsers() == null) {
            log.info("Importing initial data...");
            Set<String> userIdSet = importSampleUserData(nUsers);
            userIdList = new ArrayList<>(userIdSet);
            itemList = importSampleItemData(nItems);
            List<Order> orderList = importSampleOrderData(nOrders, userIdList, itemList);
            expressIdSet = importSampleExpressData(nOrders, orderList);
            orderIdSet = orderList.stream().map(Order::getId).collect(Collectors.toSet());
            userIdSet.clear();
            orderList.clear();    
        } else {
            log.info("Skipping initial data import because data already exists in the database.");

            log.info("Loading existed user IDs from database...");
            userIdList = loadUserIdList(userMapper);
            log.info("Loading existed item data from database...");
            itemList = loadItemList(itemMapper);
            log.info("Loading existed order IDs from database...");
            orderIdSet = loadOrderIdSet(orderMapper);
            log.info("Loading existed express IDs from database...");
            expressIdSet = loadExpressIdSet(expressMapper);
        }

        importIncrementalData(dataSource, userIdList, itemList, orderIdSet, expressIdSet);
    }

    public Set<String> importSampleUserData(int n) {
        Set<String> usernameSet = new ConcurrentSkipListSet<>();
        Set<String> userIdSet = new ConcurrentSkipListSet<>();

        concurrentBatchLoader.batchInsert("User", "users", userColumns, n, (w, nWorkers, i) -> {
            String userId = strings().size(32).types(ALPHA_NUMERIC, HEX).get();
            String username = users().get();
            String password = passwords().weak().get();

            if (userIdSet.contains(userId)) {
                return null;
            } else {
                userIdSet.add(userId);
            }

            if (usernameSet.contains(username)) {
                return null;
            } else {
                usernameSet.add(username);
            }

            List<Object> fields = new ArrayList<>();
            fields.add(userId);
            fields.add(username);
            fields.add(password);

            return fields;
        });

        return userIdSet;
    }

    public List<Item> importSampleItemData(int n) {
        Set<Long> itemIdSet = new ConcurrentSkipListSet<>();
        List<Item> itemList = Collections.synchronizedList(new ArrayList<>());

        concurrentBatchLoader.batchInsert("Item", "items", itemColumns, n, (w, nWorkers, i) -> {
            Long itemId = longs().lowerBound(1000).get();
            BigDecimal itemPrice = BigDecimal.valueOf(doubles().range(10.0, 1000.0).get());
            String itemName = words().nouns().get();
            String itemType = from(itemTypes).get();
            String itemDesc = markovs().size(20).get();

            if (itemIdSet.contains(itemId)) {
                return null;
            } else {
                itemIdSet.add(itemId);
                itemList.add(new Item(itemId, itemName, itemPrice));
            }

            List<Object> fields = new ArrayList<>();
            fields.add(itemId);
            fields.add(itemName);
            fields.add(itemType);
            fields.add(itemPrice);
            fields.add(itemDesc);

            return fields;
        });

        return new ArrayList<>(itemList);
    }

    public List<Order> importSampleOrderData(int n, List<String> userIdList, List<Item> itemList) {
        Set<Long> orderIdSet = new ConcurrentSkipListSet<>();
        List<Order> orderList = Collections.synchronizedList(new ArrayList<>());
        LocalDate tenYearsAge = LocalDate.now().minusYears(10);
        LocalDate now = LocalDate.now();

        concurrentBatchLoader.batchInsert("Order", "orders", orderColumns, n, (w, nWorkers, i) -> {
            Long orderId = longs().lowerBound(1000).get();
            String userId = from(userIdList).get();
            Item item = from(itemList).get();
            Long itemId = item.getId();
            String itemName = item.getItemName();
            Integer itemCount = ints().range(1, 10).get();
            BigDecimal amount = item.getItemPrice().multiply(BigDecimal.valueOf(itemCount));
            Date createTime = localDates().between(tenYearsAge, now).mapToDate().get();

            if (orderIdSet.contains(orderId)) {
                return null;
            } else {
                orderIdSet.add(orderId);
                orderList.add(new Order(orderId, userId, createTime));
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
        });

        return new ArrayList<>(orderList);
    }

    public Set<Long> importSampleExpressData(int n, List<Order> orderList) {
        Set<Long> expressIdSet = new ConcurrentSkipListSet<>();
        int nOrders = orderList.size();

        List<String> addresses = new ArrayList<>();
        for (int i = 0; i < 2000; i++) {
            addresses.add(addresses().get());
        }

        concurrentBatchLoader.batchInsert("Express", "expresses", expressColumns, n, (w, nWorkers, i) -> {
            int index = ((w - 1) * (n / nWorkers) + i) % nOrders;
            Long expressId = longs().lowerBound(1000).get();
            Order order = orderList.get(index);
            String postId = strings().size(24).types(NUMBERS).get();
            String address = from(addresses).get();
            String currentAddress = from(addresses).get();
            String status = from(ExpressStatus.values()).get().name();
            Date createTime = order.getCreateTime();

            if (expressIdSet.contains(expressId)) {
                return null;
            } else {
                expressIdSet.add(expressId);
            }

            List<Object> fields = new ArrayList<>();
            fields.add(expressId);
            fields.add(order.getId());
            fields.add(order.getUserId());
            fields.add(postId);
            fields.add(address);
            fields.add(currentAddress);
            fields.add(status);
            fields.add(createTime);

            return fields;
        });

        return expressIdSet;
    }

    public void importIncrementalData(
        DataSource dataSource, List<String> userIdList, List<Item> itemList,
        Set<Long> orderIdSet, Set<Long> expressIdSet
    ) {
        List<String> addresses = new ArrayList<>();
        for (int i = 0; i < 2000; i++) {
            addresses.add(addresses().get());
        }

        log.info("Start to generate and insert data into database...");

        int nCores = Runtime.getRuntime().availableProcessors();
        int nWorkers = Math.min(Math.max(4, nCores), 12);

        ExecutorService threadPool = Executors.newFixedThreadPool(nWorkers);
        for (int workerId = 1; workerId <= nWorkers; workerId++) {
            threadPool.execute(() -> {
                try (
                    Connection conn = dataSource.getConnection();
                    BatchLoader orderLoader = new PreparedBatchLoader(conn, getInsertSQL("orders", orderColumns));
                    BatchLoader expressLoader = new PreparedBatchLoader(conn, getInsertSQL("expresses", expressColumns));
                ) {
                    // If the primary key use the auto random feature, we need to enable
                    // this flag to allow insert explicit value to TiDB.
                    conn.createStatement().execute("set @@allow_auto_random_explicit_insert = true;");

                    int bulkSize = ints().range(10, 2000).get();
                    orderLoader.setBulkSize(bulkSize);
                    Random random = new Random();

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
                            Thread.sleep(random.nextInt(1000, 3000));
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
        try (ProgressBar pb = new ProgressBar("Loading existed user data by page", n)) {
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
        try (ProgressBar pb = new ProgressBar("Loading item data by page", n)) {
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
        try (ProgressBar pb = new ProgressBar("Loading order data by page", n)) {
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
        try (ProgressBar pb = new ProgressBar("Loading order data by page", n)) {
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
        String postId = strings().size(12).types(NUMBERS).get();
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
