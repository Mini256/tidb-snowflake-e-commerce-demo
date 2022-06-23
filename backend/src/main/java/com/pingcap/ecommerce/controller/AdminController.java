package com.pingcap.ecommerce.controller;

import com.pingcap.ecommerce.dto.SnowflakeDataSourceConfig;
import com.pingcap.ecommerce.dto.TiDBDataSourceConfig;
import com.pingcap.ecommerce.service.DataMockService;
import com.pingcap.ecommerce.service.DynamicDataSourceService;
import com.pingcap.ecommerce.vo.ConfigCheckVO;
import com.pingcap.ecommerce.vo.MessageVO;
import com.pingcap.ecommerce.vo.TableInfo;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.Base64;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final DynamicDataSourceService dataSourceService;

    private final DataMockService dataMockService;

    @GetMapping("/config/check")
    public MessageVO<?> checkConfig() {
        boolean tidbConfigured = dataSourceService.isTiDBConfigured();
        boolean snowflakeConfigured = dataSourceService.isSnowflakeConfigured();
        boolean ready = tidbConfigured && snowflakeConfigured;
        return MessageVO.success(new ConfigCheckVO(ready, tidbConfigured, snowflakeConfigured));
    }

    /**
     * TiDB Part.
     */

    @GetMapping("/data-source/tidb")
    public MessageVO<?> getTiDBDataSource() {
        TiDBDataSourceConfig cfg = dataSourceService.getTidbDataSourceConfig();
        return MessageVO.success(cfg);
    }

    @PostMapping("/data-source/tidb")
    public MessageVO<?> setTiDBDataSource(@RequestBody TiDBDataSourceConfig cfg) {
        String password = new String(Base64.getDecoder().decode(cfg.getPassword()));
        cfg.setPassword(password);
        dataSourceService.configTiDBDataSource(cfg);
        return MessageVO.success();
    }

    @PostMapping("/data-source/tidb/schema")
    public MessageVO<?> initTiDBSchema() throws SQLException {
        dataSourceService.initTiDBSchema();
        return MessageVO.success();
    }

    @GetMapping("/data-source/tidb/schema/tables")
    public MessageVO<?> getTiDBTablesSchema() {
        List<TableInfo> tidbSchemaTables = dataSourceService.getTiDBSchemaTables();
        return MessageVO.success(tidbSchemaTables);
    }

    @PostMapping("/data-source/tidb/import-data")
    public MessageVO<?> importInitDataToTiDB() {
        dataMockService.importData();
        return MessageVO.success();
    }

    @GetMapping("/data-source/tidb/import-data-process")
    public MessageVO<?> importInitDataToTiDBProcess() {
        return MessageVO.success();
    }

    /**
     * Snowflake Part.
     */

    @GetMapping("/data-source/snowflake")
    public MessageVO<?> getSnowflakeDataSource() {
        SnowflakeDataSourceConfig snowflakeDataSource = dataSourceService.getSnowflakeDataSourceConfig();
        return MessageVO.success(snowflakeDataSource);
    }

    @PostMapping("/data-source/snowflake")
    public MessageVO<?> setSnowflakeDataSource(@RequestBody SnowflakeDataSourceConfig cfg) {
        String password = new String(Base64.getDecoder().decode(cfg.getPassword()));
        cfg.setPassword(password);
        dataSourceService.configSnowflakeDataSource(cfg);
        return MessageVO.success();
    }

    @PostMapping("/data-source/snowflake/schema")
    public MessageVO<?> initSnowflakeSchema() throws SQLException {
        dataSourceService.initSnowflakeSchema();
        return MessageVO.success();
    }

    @GetMapping("/data-source/snowflake/schema/tables")
    public MessageVO<?> getSnowflakeTablesSchema() {
        List<TableInfo> snowflakeSchemaTables = dataSourceService.getSnowflakeSchemaTables();
        return MessageVO.success(snowflakeSchemaTables);
    }

}
