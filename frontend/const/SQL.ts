export const CALC_USER_LABELS_CODE = `INSERT OVERWRITE INTO "user_labels" (user_id, user_label, avg_amount)
SELECT
    user_id,
    CASE
        WHEN t1.user_avg_amount > t2.avg_amount THEN 'high'
        ELSE 'low'
    END AS user_label,
    t1.user_avg_amount AS avg_amount
FROM (
    SELECT avg(amount) AS user_avg_amount, user_id
    FROM "orders"
    GROUP BY user_id
) t1
LEFT JOIN (SELECT avg(amount) AS avg_amount FROM "orders") t2 ON 1 = 1;
`;

export const CALC_HIGH_LABEL_ITEMS_CODE = `INSERT INTO "hot_items" (item_id, item_name, item_type, item_desc, item_price, item_label)
SELECT
  t2.id AS item_id,
  t2.item_name,
  t2.item_type,
  t2.item_desc,
  t2.item_price,
  'high' AS item_label
FROM (
  SELECT sum(item_count) AS total_count, item_id
  FROM "orders"
  WHERE create_time > DATEADD(DAY, -7, CURRENT_DATE)
  GROUP BY item_id
) t1
LEFT JOIN "items" t2 ON t1.item_id = t2.id
LEFT JOIN (
  SELECT avg(item_price) AS avg_price FROM "items"
) t3 ON 1 = 1
WHERE t2.item_price > t3.avg_price
ORDER BY t1.total_count DESC
LIMIT 10;
`;

export const CALC_LOW_LABEL_ITEMS_CODE = `INSERT INTO "hot_items" (item_id, item_name, item_type, item_desc, item_price, item_label)
SELECT
  t2.id AS item_id,
  t2.item_name,
  t2.item_type,
  t2.item_desc,
  t2.item_price,
  'low' AS item_label
FROM (
  SELECT sum(item_count) as total_count, item_id
  FROM "orders"
  WHERE create_time > DATEADD(DAY, -7, CURRENT_DATE)
  GROUP BY item_id
) t1
LEFT JOIN "items" t2 ON t1.item_id = t2.id
LEFT JOIN (
  SELECT avg(item_price) AS avg_price FROM "items"
) t3 ON 1 = 1
WHERE t2.item_price < t3.avg_price
ORDER BY t1.total_count DESC
LIMIT 10;
`;