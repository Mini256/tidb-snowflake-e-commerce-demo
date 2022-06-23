package com.pingcap.ecommerce.dto;

import lombok.Data;

import javax.validation.constraints.NotEmpty;

@Data
public class SnowflakeDataSourceConfig {

    private String url;

    @NotEmpty
    private String host;

    @NotEmpty
    private String account;

    private Integer port = 443;

    @NotEmpty
    private String wh;

    @NotEmpty
    private String db;

    @NotEmpty
    private String schema = "PUBLIC";

    @NotEmpty
    private String user;

    @NotEmpty
    private String role = "ACCOUNTADMIN";

    @NotEmpty
    private String password;

}
