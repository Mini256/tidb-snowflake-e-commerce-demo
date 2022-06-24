package com.pingcap.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImportDataDTO {

    private static final int N_USERS_DEFAULT_VALUE = 100_000;
    private static final int N_ITEM_DEFAULT_VALUE = 100_000;
    private static final int N_ORDERS_DEFAULT_VALUE = 100_000;

    private Integer initUsers = N_USERS_DEFAULT_VALUE;

    private Integer initItems = N_ITEM_DEFAULT_VALUE;

    private Integer initOrders = N_ORDERS_DEFAULT_VALUE;

    private Boolean recreate = false;

}
