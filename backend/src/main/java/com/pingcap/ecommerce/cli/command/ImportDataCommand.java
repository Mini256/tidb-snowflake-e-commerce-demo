package com.pingcap.ecommerce.cli.command;

import com.beust.jcommander.Parameter;
import com.beust.jcommander.Parameters;
import com.pingcap.ecommerce.cli.loader.ConcurrentBatchLoader;
import com.pingcap.ecommerce.cli.loader.ConcurrentPreparedBatchLoader;
import com.pingcap.ecommerce.dao.tidb.ExpressMapper;
import com.pingcap.ecommerce.dao.tidb.ItemMapper;
import com.pingcap.ecommerce.dao.tidb.OrderMapper;
import com.pingcap.ecommerce.dao.tidb.UserMapper;
import com.pingcap.ecommerce.model.ExpressStatus;
import com.pingcap.ecommerce.model.Item;
import com.pingcap.ecommerce.model.Order;
import com.pingcap.ecommerce.cli.loader.ConcurrentCSVBatchLoader;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ConfigurableApplicationContext;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentSkipListSet;

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

    private static final int N_USERS_DEFAULT_VALUE = 500_000;
    private static final int N_ITEM_DEFAULT_VALUE = 100_000;
    private static final int N_ORDERS_DEFAULT_VALUE = 1_000_000;

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

    public void importData(ConfigurableApplicationContext ctx) {
        UserMapper userMapper = ctx.getBean(UserMapper.class);

        if (mode.equals(CSV_MODE)) {
            concurrentBatchLoader = ctx.getBean(ConcurrentCSVBatchLoader.class);
        } else {
            concurrentBatchLoader = ctx.getBean(ConcurrentPreparedBatchLoader.class);
        }

        if (userMapper.existsAnyUsers() == null) {
            log.info("Importing initial data...");
            importInitData();
        } else {
            log.info("Skipping initial data import because data already exists in the database.");
        }
    }

    public void importInitData() {
        Set<String> userIdSet =  importSampleUserData(nUsers);
        List<Item> itemSet = importSampleItemData(nItems);
        List<Order> orderSet = importSampleOrderData(nOrders, userIdSet, itemSet);
        userIdSet.clear();
        itemSet.clear();
        importSampleExpressData(nOrders, orderSet);
        orderSet.clear();
    }

    public Set<String> importSampleUserData(int n) {
        Set<String> usernameSet = new ConcurrentSkipListSet<>();
        Set<String> userIdSet = new ConcurrentSkipListSet<>();

        String[] columns = new String[]{
            "id", "username", "password"
        };
        concurrentBatchLoader.batchInsert("User", "users", columns, n, (w, nWorkers, i) -> {
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
        List<Item> itemSet = Collections.synchronizedList(new ArrayList<>());
        List<String> itemTypes = Arrays.asList(
            "Toys & Games",
            "Automotive",
            "Books",
            "Computers",
            "Luggage",
            "Pet Supplies",
            "Sports & Outdoors",
            "Home & Kitchen"
        );
        
        String[] columns = new String[]{
            "id", "item_name", "item_type", "item_price", "item_desc"
        };
        concurrentBatchLoader.batchInsert("Item", "items", columns, n, (w, nWorkers, i) -> {
            Long itemId = longs().lowerBound(1000).get();
            BigDecimal itemPrice = BigDecimal.valueOf(doubles().range(10.0, 10000.0).get());
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

    public List<Order> importSampleOrderData(int n, Set<String> userIdSet, List<Item> itemList) {
        Set<Long> orderIdSet = new ConcurrentSkipListSet<>();
        List<Order> orderList = Collections.synchronizedList(new ArrayList<>());
        ArrayList<String> userIdList = new ArrayList<>(userIdSet);
        LocalDate tenYearsAge = LocalDate.now().minusYears(10);
        LocalDate now = LocalDate.now();
        
        String[] columns = new String[]{
            "id", "user_id", "amount", "item_id", "item_name", "item_count", "create_time"
        };
        concurrentBatchLoader.batchInsert("Order", "orders", columns, n, (w, nWorkers, i) -> {
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

        return orderList;
    }

    public void importSampleExpressData(int n, List<Order> orderList) {
        Set<Long> expressIdSet = new ConcurrentSkipListSet<>();
        List<Order> unwrappedList = new ArrayList<>(orderList);
        int nOrders = orderList.size();

        List<String> addresses = new ArrayList<>();
        for (int i = 0; i < 2000; i++) {
            addresses.add(addresses().get());
        }

        String[] columns = new String[]{
            "id", "order_id", "user_id", "post_id", "address", "current_address", "status", "create_time"
        };
        concurrentBatchLoader.batchInsert("Express", "expresses", columns, n, (w, nWorkers, i) -> {
            int index = ((w - 1) * (n / nWorkers) + i) % nOrders;
            Long expressId = longs().lowerBound(1000).get();
            Order order = unwrappedList.get(index);
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

}
