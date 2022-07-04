package com.pingcap.ecommerce.controller;

import com.pingcap.ecommerce.dto.ImportDataDTO;
import com.pingcap.ecommerce.dto.SnowflakeDataSourceConfig;
import com.pingcap.ecommerce.dto.TiDBDataSourceConfig;
import com.pingcap.ecommerce.model.JobInstance;
import com.pingcap.ecommerce.model.TableStats;
import com.pingcap.ecommerce.service.DataMockService;
import com.pingcap.ecommerce.service.DynamicDataSourceService;
import com.pingcap.ecommerce.service.TableStatsService;
import com.pingcap.ecommerce.util.job.JobManager;
import com.pingcap.ecommerce.vo.ConfigCheckVO;
import com.pingcap.ecommerce.vo.MessageVO;
import com.pingcap.ecommerce.vo.TableInfo;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.time.ZonedDateTime;
import java.util.Base64;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final DynamicDataSourceService dataSourceService;

    private final DataMockService dataMockService;

    private final TableStatsService tableStatsService;

    private final JobManager jobManager;

    @GetMapping("/config/check")
    public MessageVO<?> checkConfig() {
        boolean tidbConfigured = dataSourceService.isTiDBConfigured();
        boolean tidbSchemaCreated = false;
        boolean importInitDataJobAllFinished = false;
        boolean snowflakeConfigured = dataSourceService.isSnowflakeConfigured();
        boolean snowflakeSchemaCreated = false;

        if (tidbConfigured) {
            tidbSchemaCreated = dataSourceService.isTiDBSchemaCreated();
        }
        if (tidbSchemaCreated) {
            importInitDataJobAllFinished = dataMockService.isImportInitDataJobAllFinished();
        }
        if (snowflakeConfigured) {
            snowflakeSchemaCreated = dataSourceService.isSnowflakeSchemaCreated();
        }

        boolean ready = tidbConfigured && tidbSchemaCreated && snowflakeConfigured && snowflakeSchemaCreated && importInitDataJobAllFinished;
        return MessageVO.success(new ConfigCheckVO(
            ready, tidbConfigured, tidbSchemaCreated, snowflakeConfigured, snowflakeSchemaCreated,
            importInitDataJobAllFinished
        ));
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
    public MessageVO<?> setTiDBDataSource(@RequestBody TiDBDataSourceConfig cfg) throws SQLException {
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

    @GetMapping("/data-source/tidb/table-stats-history")
    public MessageVO<?> getTableStatsHistory(
        @RequestParam(required = false) String tableName,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime lastDateTime
    ) {
        List<TableStats> tableStats = tableStatsService.getTableStatsHistory(tableName, lastDateTime);
        return MessageVO.success(tableStats);
    }

    @PostMapping("/data-source/tidb/import-data")
    public MessageVO<?> importInitDataToTiDB(@RequestBody(required = false) ImportDataDTO importDataDTO) {
        if (importDataDTO == null) importDataDTO = new ImportDataDTO();

        if (!importDataDTO.getRecreate() && dataMockService.isAnyImportInitDataJobStillRunning()) {
            return MessageVO.of(HttpStatus.CONFLICT.value(), "There are some data import jobs still running.");
        }

        // Terminate the existing job instance of import-data.
        if (importDataDTO.getRecreate()) {
            List<JobInstance> importDataJobInstances = dataMockService.getImportDataJobInstances();
            for (JobInstance jobInstance : importDataJobInstances) {
                if (jobInstance != null && jobInstance.isRunning()) {
                    jobManager.terminateJobInstance(jobInstance);
                }
            }
        }

        dataMockService.importData(importDataDTO);
        return MessageVO.success();
    }

    @GetMapping("/data-source/tidb/import-data/status")
    public MessageVO<?> getImportDataStatus() {
        List<JobInstance> jobInstances = dataMockService.getImportDataJobInstances();
        return MessageVO.success(jobInstances);
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
    public MessageVO<?> setSnowflakeDataSource(@RequestBody SnowflakeDataSourceConfig cfg) throws SQLException {
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
