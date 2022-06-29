CREATE TABLE IF NOT EXISTS users (
    `id` VARCHAR(32) PRIMARY KEY,
    `username` VARCHAR(32) COMMENT 'username',
    `password` VARCHAR(128) COMMENT 'password',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'user creation time',
    INDEX idx_users_create_time (create_time)
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT(20) PRIMARY KEY AUTO_RANDOM,
    user_id VARCHAR(32) COMMENT 'user id',
    amount DECIMAL(20,2) COMMENT 'order amount',
    item_id BIGINT(20) COMMENT 'item id',
    item_name VARCHAR(32) COMMENT 'item name',
    item_count INT COMMENT 'number of items purchased',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'order creation time',
    INDEX idx_users_create_time_user_id (create_time, user_id)
);

CREATE TABLE IF NOT EXISTS items (
    id BIGINT(20) PRIMARY KEY AUTO_RANDOM,
    item_price DECIMAL(20,2) COMMENT 'item price',
    item_name VARCHAR(128) COMMENT 'item name',
    item_type VARCHAR(32) COMMENT 'item type',
    item_desc VARCHAR(1024) COMMENT 'item description',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'item create time',
    INDEX idx_items_create_time (create_time)
);

CREATE TABLE IF NOT EXISTS expresses (
    id BIGINT(20) PRIMARY KEY AUTO_RANDOM,
    order_id BIGINT(20) COMMENT 'order number',
    user_id VARCHAR(32) COMMENT 'user id',
    post_id VARCHAR(64) COMMENT 'tracking post number',
    address VARCHAR(256) COMMENT 'shipping address',
    current_address VARCHAR(256) COMMENT 'current shipping address',
    status VARCHAR(10) COMMENT 'shipment delivery status',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'express creation time',
    INDEX idx_expresses_order_id (order_id)
);

CREATE TABLE IF NOT EXISTS hot_items (
    item_id   BIGINT(20) COMMENT 'item id',
    item_label VARCHAR(32) COMMENT 'item label',
    item_name VARCHAR(128) COMMENT 'item name',
    item_price DECIMAL(20,2) COMMENT 'item price',
    item_type VARCHAR(32) COMMENT 'item type',
    item_desc VARCHAR(1024) COMMENT 'item description',
    PRIMARY KEY (item_id, item_label)
);

CREATE TABLE IF NOT EXISTS user_labels (
    user_id VARCHAR(32) COMMENT 'user id',
    user_label VARCHAR(32) COMMENT 'user label',
    avg_amount DECIMAL(20, 2) COMMENT 'average amount spent by users',
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS order_stats_history (
    `ts` DATETIME COMMENT 'order stats record time',
    `type` VARCHAR(255) COMMENT 'item type',
    `amount` DECIMAL(40, 2),
    `total` BIGINT,
    `customers` BIGINT,
    PRIMARY KEY (ts, type)
);

CREATE TABLE IF NOT EXISTS job_instances (
    `id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
    `job_name` VARCHAR(255) NOT NULL COMMENT 'job name',
    `status` ENUM('CREATED', 'RUNNING', 'FINISHED', 'FAIL') NOT NULL COMMENT 'job status',
    `current_process` BIGINT(20) DEFAULT 0,
    `max_process` BIGINT(20) DEFAULT 0,
    `cost` DOUBLE DEFAULT 0.0,
    `start_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'job start time',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time',
    `complete_time` DATETIME COMMENT 'the complete time of the job, fail ot finish'
);

CREATE TABLE IF NOT EXISTS table_stats_history (
     `id` BIGINT(20) PRIMARY KEY AUTO_RANDOM,
     `db_name` VARCHAR(255) NOT NULL,
     `table_name` VARCHAR(255) NOT NULL,
     `row_total` BIGINT(20) DEFAULT 0 NOT NULL COMMENT 'the total number of rows',
     `ts` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'table stats record time'
);