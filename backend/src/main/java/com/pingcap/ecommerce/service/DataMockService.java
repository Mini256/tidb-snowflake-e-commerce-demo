package com.pingcap.ecommerce.service;

import com.pingcap.ecommerce.config.DynamicDataSource;
import com.pingcap.ecommerce.dao.tidb.ItemMapper;
import com.pingcap.ecommerce.dao.tidb.UserMapper;
import com.pingcap.ecommerce.dto.ImportDataDTO;
import com.pingcap.ecommerce.model.ExpressStatus;
import com.pingcap.ecommerce.model.Item;
import com.pingcap.ecommerce.model.JobInstance;
import com.pingcap.ecommerce.model.Order;
import com.pingcap.ecommerce.util.job.JobManager;
import com.pingcap.ecommerce.util.loader.BatchLoader;
import com.pingcap.ecommerce.util.loader.ConcurrentPreparedBatchLoader;
import com.pingcap.ecommerce.util.loader.PreparedBatchLoader;
import com.pingcap.ecommerce.vo.PageMeta;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Connection;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentSkipListSet;
import java.util.concurrent.atomic.AtomicReference;

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
@Service
public class DataMockService {

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

    public static final String IMPORT_INITIAL_USER_DATA_JOB_NAME = "import-initial-user-data";
    public static final String IMPORT_INITIAL_ITEM_DATA_JOB_NAME = "import-initial-item-data";
    public static final String IMPORT_INITIAL_ORDER_DATA_JOB_NAME = "import-initial-order-data";
    public static final String IMPORT_INITIAL_EXPRESS_DATA_JOB_NAME = "import-initial-express-data";
    public static final String IMPORT_INCREMENTAL_DATA_JOB_NAME = "import-increment-data";
    public static final List<String> IMPORT_DATA_JOB_NAMES = List.of(
        IMPORT_INITIAL_USER_DATA_JOB_NAME, IMPORT_INITIAL_ITEM_DATA_JOB_NAME, IMPORT_INITIAL_ORDER_DATA_JOB_NAME,
        IMPORT_INITIAL_EXPRESS_DATA_JOB_NAME, IMPORT_INCREMENTAL_DATA_JOB_NAME
    );

    private final ConcurrentPreparedBatchLoader concurrentBatchLoader;

    private final DynamicDataSource TiDBDataSource;

    private final JobService jobService;

    private final JobManager jobManager;

    private final UserMapper userMapper;

    private final ItemMapper itemMapper;

    public DataMockService(
        ConcurrentPreparedBatchLoader concurrentBatchLoader,
        @Qualifier("TiDBDynamicDataSource") DynamicDataSource TiDBDataSource,
        JobService jobService,
        JobManager jobManager,
        UserMapper userMapper,
        ItemMapper itemMapper
    ) {
        this.concurrentBatchLoader = concurrentBatchLoader;
        this.TiDBDataSource = TiDBDataSource;
        this.jobService = jobService;
        this.jobManager = jobManager;
        this.userMapper = userMapper;
        this.itemMapper = itemMapper;
    }

    @Async
    public void importData(ImportDataDTO importDataDTO) {
        Boolean recreate = importDataDTO.getRecreate();
        int nUsers = importDataDTO.getInitUsers();
        int nItems = importDataDTO.getInitItems();
        int nOrders = importDataDTO.getInitOrders();

        List<String> userIdList;
        List<Item> itemList;

        if (userMapper.existsAnyUsers() == null) {
            log.info("Importing initial data...");

            // Import users data.
            AtomicReference<Set<String>> userIdSetRef = new AtomicReference<>();
            JobInstance importUserJobInstance = jobManager.findOrCreateJobInstance(IMPORT_INITIAL_USER_DATA_JOB_NAME, BigInteger.valueOf(nUsers), recreate);
            jobManager.startJob(importUserJobInstance, (instance) -> {
                userIdSetRef.set(importInitUserData(instance, nUsers));
            });
            userIdList = new ArrayList<>(userIdSetRef.get());

            // Import items data.
            AtomicReference<List<Item>> itemListRef = new AtomicReference<>();
            JobInstance importItemsJobInstance = jobManager.findOrCreateJobInstance(IMPORT_INITIAL_ITEM_DATA_JOB_NAME, BigInteger.valueOf(nItems), recreate);
            jobManager.startJob(importItemsJobInstance, (instance) -> {
                itemListRef.set(importInitItemData(instance, nItems));
            });
            itemList = itemListRef.get();

            // Import orders data.
            AtomicReference<List<Order>> orderListRef = new AtomicReference<>();
            JobInstance importOrdersJobInstance = jobManager.findOrCreateJobInstance(IMPORT_INITIAL_ORDER_DATA_JOB_NAME, BigInteger.valueOf(nOrders), recreate);
            jobManager.startJob(importOrdersJobInstance, (instance) -> {
                orderListRef.set(importInitOrderData(instance, nOrders, userIdList, itemList));
            });
            List<Order> orderList =orderListRef.get();

            // Import expresses data.
            JobInstance importExpressesJobInstance = jobManager.findOrCreateJobInstance(IMPORT_INITIAL_EXPRESS_DATA_JOB_NAME, BigInteger.valueOf(nOrders), recreate);
            jobManager.startJob(importExpressesJobInstance, (instance) -> {
                importInitExpressData(instance, nOrders, orderList);
            });

            // Clear useless data.
            userIdSetRef.get().clear();
            orderList.clear();
        } else {
            log.info("Skipping initial data import because data already exists in the database.");

            log.info("Loading existed user IDs from database...");
            userIdList = loadUserIdList(userMapper);
            log.info("Loading existed item data from database...");
            itemList = loadItemList(itemMapper);
        }

        JobInstance importIncrementalDataJobInstance = jobManager.findOrCreateJobInstance(
            IMPORT_INCREMENTAL_DATA_JOB_NAME, BigInteger.valueOf(-1L), recreate
        );
        jobManager.startJob(importIncrementalDataJobInstance, (instance) -> {
            importIncrementalData(instance, TiDBDataSource, userIdList, itemList);
        });
    }

    private Set<String> importInitUserData(JobInstance jobInstance, int n) {
        Set<String> usernameSet = new ConcurrentSkipListSet<>();
        Set<String> userIdSet = new ConcurrentSkipListSet<>();

        concurrentBatchLoader.batchInsert("User", "users", userColumns, n, jobInstance, (w, nWorkers, i) -> {
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

    public List<Item> importInitItemData(JobInstance jobInstance, int n) {
        Set<Long> itemIdSet = new ConcurrentSkipListSet<>();
        List<Item> itemList = Collections.synchronizedList(new ArrayList<>());

        concurrentBatchLoader.batchInsert("Item", "items", itemColumns, n, jobInstance, (w, nWorkers, i) -> {
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

    private List<Order> importInitOrderData(JobInstance jobInstance, int n, List<String> userIdList, List<Item> itemList) {
        Set<Long> orderIdSet = new ConcurrentSkipListSet<>();
        List<Order> orderList = Collections.synchronizedList(new ArrayList<>());
        LocalDate tenYearsAge = LocalDate.now().minusDays(8);
        LocalDate now = LocalDate.now();

        concurrentBatchLoader.batchInsert("Order", "orders", orderColumns, n, jobInstance, (w, nWorkers, i) -> {
            Long orderId = longs().lowerBound(1000).get();
            String userId = from(userIdList).get();
            Item item = from(itemList).get();
            Long itemId = item.getId();
            String itemName = item.getItemName();
            Integer itemCount = ints().range(1, 5).get();
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

    private void importInitExpressData(JobInstance jobInstance, int n, List<Order> orderList) {
        Set<Long> expressIdSet = new ConcurrentSkipListSet<>();
        int nOrders = orderList.size();

        List<String> addresses = new ArrayList<>();
        for (int i = 0; i < 2000; i++) {
            addresses.add(addresses().get());
        }

        concurrentBatchLoader.batchInsert("Express", "expresses", expressColumns, n, jobInstance, (w, nWorkers, i) -> {
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
    }

    public boolean isImportInitDataJobAllFinished() {
        for (String jobName : IMPORT_DATA_JOB_NAMES) {
            JobInstance jobInstance = jobService.getLastJobInstance(jobName);
            if (jobInstance == null || !jobInstance.isCompleted()) {
                return false;
            }
        }
        return true;
    }

    public boolean isAnyImportInitDataJobStillRunning() {
        for (String jobName : IMPORT_DATA_JOB_NAMES) {
            JobInstance jobInstance = jobService.getLastJobInstance(jobName);
            if (jobInstance != null && jobInstance.isRunning()) {
                return true;
            }
        }
        return false;
    }

    public List<JobInstance> getImportDataJobInstances() {
        List<JobInstance> jobInstances = new ArrayList<>();
        for (String importDataJobName : IMPORT_DATA_JOB_NAMES) {
            JobInstance jobInstance = jobService.getLastJobInstance(importDataJobName);
            jobInstances.add(jobInstance);
        }
        return jobInstances;
    }

    private void importIncrementalData(
        JobInstance jobInstance, DataSource dataSource, List<String> userIdList, List<Item> itemList
    ) {
        // Prepare some random address for express address.
        List<String> randomAddresses = new ArrayList<>();
        for (int i = 0; i < 2000; i++) {
            randomAddresses.add(addresses().get());
        }

        log.info("Start to generate and insert random orders and expresses into database...");
        try (
            Connection conn = dataSource.getConnection();
            BatchLoader orderLoader = new PreparedBatchLoader(conn, getInsertSQL("orders", orderColumns));
            BatchLoader expressLoader = new PreparedBatchLoader(conn, getInsertSQL("expresses", expressColumns));
        ) {
            // If the primary key use the auto random feature, we need to enable
            // this flag to allow insert explicit value to TiDB.
            conn.createStatement().execute("set @@allow_auto_random_explicit_insert = true;");

            Random random = new Random();
            int bulkSize = random.nextInt(10, 2000);
            orderLoader.setBulkSize(bulkSize);

            int i = 0;
            while (true) {
                List<Object> orderValues = getRandomOrderValues(userIdList, itemList);

                if (orderValues.isEmpty()) {
                    continue;
                }

                orderLoader.insertValues(orderValues);

                Long orderId = (Long) orderValues.get(0);
                String userId = (String) orderValues.get(1);
                List<Object> expressValues = getRandomExpressValues(randomAddresses, orderId, userId);

                if (expressValues.isEmpty()) {
                    continue;
                }

                expressLoader.insertValues(expressValues);

                if (i % bulkSize == 0) {
                    log.info("{} orders and expresses are inserted into database.", bulkSize);
                    JobInstance instance = jobManager.updateJobInstanceProcess(jobInstance.getId(), bulkSize);

                    if (instance.isCompleted()) {
                        throw new InterruptedException(
                            String.format("Job instance %s has been finished or interrupted.", instance.getJobName())
                        );
                    }

                    bulkSize = random.nextInt(10, 2000);
                    orderLoader.setBulkSize(bulkSize);
                    Thread.sleep(random.nextInt(1000, 3000));
                }
                i++;
            }
        } catch (Exception e) {
            jobManager.terminateJobInstance(jobInstance);
            throw new RuntimeException(e);
        }
    }

    private List<String> loadUserIdList(UserMapper userMapper) {
        List<String> userIdList = new ArrayList<>();
        int pageSize = 10000;

        List<PageMeta<String>> userPages = userMapper.getUserPages(pageSize);
        for (PageMeta<String> userPage : userPages) {
            List<String> userIds = userMapper.getUserIdsByPageMeta(userPage);
            userIdList.addAll(userIds);
            log.debug(
                "Loaded user IDs, page_number={}, page_size={}, start_key = {}, end_key = {}.",
                userPage.getPageNum(), userPage.getPageSize(), userPage.getStartKey(), userPage.getEndKey()
            );
        }
        log.info("Loaded {} user IDs.", userIdList.size());

        return userIdList;
    }

    private List<Item> loadItemList(ItemMapper itemMapper) {
        List<Item> itemList = new ArrayList<>();
        int pageSize = 10000;
        List<PageMeta<Long>> itemPages = itemMapper.getItemsBaseInfoPage(pageSize);

        for (PageMeta<Long> itemPage : itemPages) {
            List<Item> items = itemMapper.getItemsBaseInfosByPageMeta(itemPage);
            itemList.addAll(items);
            log.debug(
                "Loaded item base infos, page_number={}, page_size={}, start_key = {}, end_key = {}.",
                itemPage.getPageNum(), itemPage.getPageSize(), itemPage.getStartKey(), itemPage.getEndKey()
            );
        }
        log.info("Loaded {} item base infos.", itemList.size());

        return itemList;
    }

    private List<Object> getRandomOrderValues(List<String> userIdList, List<Item> itemList) {
        Long orderId = longs().lowerBound(1000).get();
        String userId = from(userIdList).get();
        Item item = from(itemList).get();
        Long itemId = item.getId();
        String itemName = item.getItemName();
        Integer itemCount = ints().range(1, 2).get();
        BigDecimal amount = item.getItemPrice().multiply(BigDecimal.valueOf(itemCount));
        Date createTime = new Date();

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

    private List<Object> getRandomExpressValues(List<String> addresses, Long orderId, String userId)  {
        Long expressId = longs().lowerBound(1000).get();
        String postId = strings().size(12).types(NUMBERS).get();
        String address = from(addresses).get();
        String currentAddress = from(addresses).get();
        String status = from(ExpressStatus.values()).get().name();
        Date createTime = new Date();

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
        return String.format("INSERT IGNORE INTO %s (%s) VALUES (%s);", tableName, columns, values);
    }

}
