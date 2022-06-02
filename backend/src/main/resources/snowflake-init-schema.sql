-- CREATE DATABASE IF NOT EXISTS PC_ETLEAP_DB;

-- USE PC_ETLEAP_DB;
-- USE SCHEMA PC_ETLEAP_DB.PUBLIC;

-- CREATE TABLE IF NOT EXISTS "orders" (
--     id BIGINT PRIMARY KEY,
--     user_id VARCHAR(32) COMMENT 'user id',
--     amount DECIMAL(20,2) COMMENT 'order amount',
--     item_id BIGINT COMMENT 'item id',
--     item_name VARCHAR(32) COMMENT 'item name',
--     item_count int COMMENT 'number of items purchased',
--     update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time',
--     create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'order creation time'
-- );

-- CREATE TABLE IF NOT EXISTS "items" (
--     id BIGINT PRIMARY KEY,
--     item_price DECIMAL(20,2) COMMENT '商品价格',
--     item_name VARCHAR(128) COMMENT '商品名称',
--     item_type VARCHAR(32) COMMENT '商品类型',
--     item_desc VARCHAR(1024) COMMENT '商品简介',
--     update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
--     create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '订单创建时间'
-- );

-- CREATE TABLE IF NOT EXISTS "expresses" (
--     id BIGINT PRIMARY KEY,
--     order_id BIGINT COMMENT '订单编号',
--     user_id VARCHAR(32) COMMENT '用户ID',
--     post_id VARCHAR(64) COMMENT '快递单号',
--     address VARCHAR(256) COMMENT '收货地址',
--     current_address VARCHAR(256) COMMENT '当前配送地址',
--     status VARCHAR(10) COMMENT '快件派送状态',
--     update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
--     create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '快递创建时间'
-- );

CREATE TABLE IF NOT EXISTS "hot_items" (
    item_id   BIGINT COMMENT 'item id',
    item_name VARCHAR(128) COMMENT 'item name',
    item_price DECIMAL(20,2) COMMENT 'item price',
    item_type VARCHAR(32) COMMENT 'item type',
    item_desc VARCHAR(1024) COMMENT 'item description',
    item_label VARCHAR(32) COMMENT 'item label',
    PRIMARY KEY (item_id)
);

CREATE TABLE IF NOT EXISTS "user_labels" (
    user_id VARCHAR(32) COMMENT 'user id',
    user_label VARCHAR(32) COMMENT 'user label',
    avg_amount DECIMAL(20,2) COMMENT 'average amount spent by users',
    PRIMARY KEY (user_id)
);

SHOW TABLES;