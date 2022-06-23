package com.pingcap.ecommerce.vo;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConfigCheckVO {

    private boolean ready;

    private boolean tidbConfigured;

    private boolean snowflakeConfigured;

}
