package com.pingcap.shop.service;

import com.pingcap.shop.model.ExpressStatus;
import com.pingcap.shop.model.Order;
import com.pingcap.shop.util.ConcurrentCSVBatchLoader;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentSkipListSet;

import static net.andreinc.mockneat.types.enums.StringType.*;
import static net.andreinc.mockneat.unit.address.Addresses.addresses;
import static net.andreinc.mockneat.unit.objects.From.from;
import static net.andreinc.mockneat.unit.text.Strings.strings;
import static net.andreinc.mockneat.unit.types.Longs.longs;

@Slf4j
@Service
@AllArgsConstructor
public class ExpressService {

    private final ConcurrentCSVBatchLoader batchLoader;

    public void importSampleExpressData(int n, List<Order> orderList) {
        Set<Long> expressIdSet = new ConcurrentSkipListSet<>();
        List<Order> unwrappedList = new ArrayList<>(orderList);
        int nOrders = orderList.size();

        List<String> addresses = new ArrayList<>();
        for (int i = 0; i < 2000; i++) {
            addresses.add(addresses().get());
        }

        String sql = "INSERT INTO expresses (id, order_id, user_id, post_id, address, current_address, status, create_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
        String[] headers = new String[]{
            "id", "order_id", "user_id", "post_id", "address", "current_address", "status", "create_time"
        };
        batchLoader.batchInsert("Express", "expresses", headers, n, (w, nWorkers, i) -> {
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
