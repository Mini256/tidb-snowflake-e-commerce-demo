package com.pingcap.shop;

import com.pingcap.shop.model.Item;
import com.pingcap.shop.model.Order;
import com.pingcap.shop.service.ExpressService;
import com.pingcap.shop.service.ItemService;
import com.pingcap.shop.service.OrderService;
import com.pingcap.shop.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Component
@AllArgsConstructor
public class ImportDataCLI implements ApplicationRunner {

    private static final int nUsersDefaultValue = 500_000;
    private static final int nItemDefaultValue = 100_000;
    private static final int nOrdersDefaultValue = 1_000_000;

    private final UserService userService;
    private final ItemService itemService;
    private final OrderService orderService;
    private final ExpressService expressService;

    public static void main(String[] args) {
        new SpringApplicationBuilder(ImportDataCLI.class)
                .web(WebApplicationType.NONE)
                .run(args);
    }

    @Override
    public void run(ApplicationArguments args) {
        int nUsers = getOptionValue(args, "users", nUsersDefaultValue);
        int nItems = getOptionValue(args, "items", nItemDefaultValue);
        int nOrders = getOptionValue(args, "orders", nOrdersDefaultValue);

        if (!userService.existsAnyUser()) {
            Set<String> userIdSet =  userService.importSampleUserData(nUsers);
            List<Item> itemSet = itemService.importSampleItemData(nItems);
            List<Order> orderSet = orderService.importSampleOrderData(nOrders, userIdSet, itemSet);
            userIdSet.clear();
            itemSet.clear();
            expressService.importSampleExpressData(nOrders, orderSet);
            orderSet.clear();
        }
    }

    private static int getOptionValue(ApplicationArguments args, String optionKey, int defaultValue) {
        if (args.containsOption(optionKey)) {
            for (String optionValue : args.getOptionValues(optionKey)) {
                return Optional.ofNullable(optionValue).map(Integer::parseInt).orElse(defaultValue);
            }
        }
        return defaultValue;
    }


}
