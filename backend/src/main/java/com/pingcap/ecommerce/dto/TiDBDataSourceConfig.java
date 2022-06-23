package com.pingcap.ecommerce.dto;

import lombok.Data;

import javax.validation.constraints.NotEmpty;

@Data
public class TiDBDataSourceConfig {

    private String url;

    @NotEmpty
    private String host;

    private Integer port = 4000;

    @NotEmpty
    private String database = "test";

    @NotEmpty
    private String user = "root";

    @NotEmpty
    private String password;

}
