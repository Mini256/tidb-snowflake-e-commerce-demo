CREATE TABLE IF NOT EXISTS "hot_items" (
    "item_id" BIGINT COMMENT 'item id',
    "item_name" VARCHAR(128) COMMENT 'item name',
    "item_price" DECIMAL(20,2) COMMENT 'item price',
    "item_type" VARCHAR(32) COMMENT 'item type',
    "item_desc" VARCHAR(1024) COMMENT 'item description',
    "item_label" VARCHAR(32) COMMENT 'item label',
    PRIMARY KEY ("item_id")
);

CREATE TABLE IF NOT EXISTS "user_labels" (
    "user_id" VARCHAR(32) COMMENT 'user id',
    "user_label" VARCHAR(32) COMMENT 'user label',
    "avg_amount" DECIMAL(20,2) COMMENT 'average amount spent by users',
    PRIMARY KEY ("user_id")
);
