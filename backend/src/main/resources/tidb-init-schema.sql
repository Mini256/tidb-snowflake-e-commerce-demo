CREATE DATABASE IF NOT EXISTS `ecommerce`;

USE `ecommerce`;

CREATE TABLE IF NOT EXISTS users (
    `id` VARCHAR(32) PRIMARY KEY,
    `username` VARCHAR(32) COMMENT '用户名',
    `password` VARCHAR(128) COMMENT '密码',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '用户创建时间',
    INDEX idx_users_create_time (create_time)
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT(20) PRIMARY KEY AUTO_RANDOM,
    user_id VARCHAR(32) COMMENT '用户ID',
    amount DECIMAL(20,2) COMMENT '订单金额',
    item_id BIGINT(20) COMMENT '商品ID',
    item_name VARCHAR(32) COMMENT '商品名称',
    item_count INT COMMENT '购买商品数量',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '订单创建时间',
    INDEX idx_users_create_time_user_id (create_time, user_id)
);

CREATE TABLE IF NOT EXISTS items (
    id BIGINT(20) PRIMARY KEY AUTO_RANDOM,
    item_price DECIMAL(20,2) COMMENT '商品价格',
    item_name VARCHAR(128) COMMENT '商品名称',
    item_type VARCHAR(32) COMMENT '商品类型',
    item_desc VARCHAR(1024) COMMENT '商品简介',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '订单创建时间',
    INDEX idx_items_create_time (create_time)
);

CREATE TABLE IF NOT EXISTS expresses (
    id BIGINT(20) PRIMARY KEY AUTO_RANDOM,
    order_id BIGINT(20) COMMENT '订单编号',
    user_id VARCHAR(32) COMMENT '用户ID',
    post_id VARCHAR(64) COMMENT '快递单号',
    address VARCHAR(256) COMMENT '收货地址',
    current_address VARCHAR(256) COMMENT '当前配送地址',
    status VARCHAR(10) COMMENT '快件派送状态',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '快递创建时间',
    INDEX idx_expresses_order_id (order_id)
);

CREATE TABLE IF NOT EXISTS hot_items (
    item_id   BIGINT(20) COMMENT '商品ID',
    item_label VARCHAR(32) COMMENT '商品标签',
    item_name VARCHAR(128) COMMENT '商品名称',
    item_price DECIMAL(20,2) COMMENT '商品单价',
    item_type VARCHAR(32) COMMENT '商品类型',
    item_desc VARCHAR(1024) COMMENT '商品简介',
    PRIMARY KEY (item_id, item_label)
);

CREATE TABLE IF NOT EXISTS user_labels (
    user_id VARCHAR(32) COMMENT '用户ID',
    user_label VARCHAR(32) COMMENT '用户标签',
    avg_amount DECIMAL(20, 2) COMMENT '用户平均花费金额',
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS s_orders (
    `ts` TIMESTAMP COMMENT '时间戳',
    `type` VARCHAR(255) COMMENT '商品类型',
    `amount` DECIMAL(40, 2),
    `total` BIGINT,
    PRIMARY KEY (ts, type)
);

SHOW TABLES;