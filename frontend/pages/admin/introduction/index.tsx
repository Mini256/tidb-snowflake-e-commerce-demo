import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { useEffect, useState } from "react";
import DashboardLayout from "../../../src/DashboardLayout/DashboardLayout";
import Paper from "../../../src/DashboardLayout/Pager";
import { createHttpClient } from "../../../src/lib/request";
import ActionButton from "./ActionButton";
import CodeBlock from "./CodeBlock";
import LineChart from "./LineChart";

const httpClient = createHttpClient();

const CALC_USER_LABELS_CODE = `
INSERT OVERWRITE INTO "user_labels" (user_id, user_label, avg_amount)
SELECT
    user_id,
    CASE
        WHEN t1.user_avg_amount {'>'} t2.avg_amount THEN 'high'
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
const CALC_HIGH_LABEL_ITEMS_CODE = `
INSERT INTO "hot_items" (item_id, item_name, item_type, item_desc, item_price, item_label)
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
const CALC_LOW_LABEL_ITEMS_CODE = `
INSERT INTO "hot_items" (item_id, item_name, item_type, item_desc, item_price, item_label)
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

export default function IntroductionPage() {
    const [lastDate, setLastDate] = useState<Date>();
    const [todayHistory, setTodayHistory] = useState<any[]>([]);

    const loadTodayOrderHistory = async function() {
        let url = '/api/statistic/orders/total-and-amount/history';
        if (lastDate !== undefined) {
            url = `/api/statistic/orders/total-and-amount/history?startDate=${Number(lastDate)}`
        }
        const res = await httpClient.get(url);
        const n = res.data.length;
        const history = res.data.map((item: any, index: number) => {
            const ts = new Date(item.ts);
            if (index === n - 1) {
                setLastDate(ts);
            }
            return {
                name: ts.toString(),
                value: [
                  ts,
                  item.total
                ]
            }
        });
        setTodayHistory(todayHistory.concat(history));
    }

    useEffect(() => {
        loadTodayOrderHistory();
        setInterval(() => {
            loadTodayOrderHistory();
        }, 30 * 1000);
    }, []);

    return (
        <DashboardLayout>
            <Typography component="h1" variant="h4" gutterBottom={true}>Introduction</Typography>

            <Typography component="h2" variant="h5" gutterBottom={true}>1. Connect to TiDB</Typography>
            <Typography component="p" variant="body1">Configure the connection information of the TiDB database. You can create your TiDB cluster in <Typography component="a" variant="inherit" href="https://tidb.auth0.com/login">tidbcloud.com</Typography>.</Typography>
            {/* <Paper sx={{ m: '10px' }}>TiDB Connect Information</Paper> */}

            <Typography component="h2" variant="h5" gutterBottom={true}>2. Connect to Snowflake</Typography>
            <Typography component="p" variant="body1">Configure the connection information of the Snowflake. You can create your Snowflake cluster in <a href="https://signup.snowflake.com/">snowflake.com</a>.</Typography>
            {/* <Paper sx={{ m: '10px' }}>Snowflake Connect Information</Paper> */}

            <Typography component="h2" variant="h5" gutterBottom={true}>3. Create Schema</Typography>

            <Box>
                <Button disabled>Create Schema</Button>
            </Box>

            <Typography component="h2" variant="h5" gutterBottom={true}>4. Import Data</Typography>

            <Box>
                <Button disabled>Import Data</Button>
            </Box>

            <Typography component="h2" variant="h5" gutterBottom={true}>5. Unified view</Typography>

            <Button href="/admin/order" variant="contained">Go to Orders Page</Button>

            <Typography component="h2" variant="h5" gutterBottom={true}>6. Real-time Online Analysis on TiDB</Typography>

            <Box sx={{ m: '10px' }}>
                <Typography component="p" variant="body1" gutterBottom>
                    In this step, we will use tidb's real-time analysis engine to calculate today's orders:
                </Typography>
                <Typography component="p" variant="body1" gutterBottom>
                    1. Calculate today's total orders and amount of orders
                </Typography>
                <Typography component="p" variant="body1" gutterBottom>
                    2. Calculate today's total number and amount of orders and group them by item type
                </Typography>
                <LineChart data={todayHistory}/>
                <Button href="/admin/dashboard" variant="contained">Go to Dashboard Page</Button>
            </Box>

            <Typography component="h2" variant="h5" gutterBottom={true}>7. ETL from TiDB to Snowflake</Typography>

            <Typography component="p" variant="body1" gutterBottom>
                We will use tools like <a href="https://etleap.com/">ETLeap</a> to import data from tidb to snowflake.
            </Typography>

            <Typography component="h2" variant="h5" gutterBottom={true}>8. Perform Offline Analysis on Snowflake</Typography>

            <Box sx={{ m: '10px' }}>
                <Typography component="p" variant="body1" gutterBottom>
                    Perform Offline Analysis on Snowflake
                </Typography>
                
                <CodeBlock code={CALC_USER_LABELS_CODE} language="sql"/>
                <ActionButton text="Calc User Labels on Snowflake" url="/api/data/user-labels/calc"/>
                <CodeBlock code={CALC_HIGH_LABEL_ITEMS_CODE} language="sql"/>
                <ActionButton text="Calc High Label Items on Snowflake" url="/api/data/hot-items/high-label/calc"/>
                <CodeBlock code={CALC_LOW_LABEL_ITEMS_CODE} language="sql"/>
                <ActionButton text="Calc Low Label Items on Snowflake" url="/api/data/hot-items/low-label/calc"/>
            </Box>

            <Typography component="h2" variant="h5" gutterBottom={true}>9. Pull Back from Snowflake to TiDB</Typography>

            <Box sx={{ m: '10px' }}>
                <Typography component="p" variant="body1" gutterBottom>
                    Pull back the analysis result data from Snowflake to TiDB.
                </Typography>
                <ActionButton text="Pull Back User Labels To TiDB" url="/api/data/user-labels/pull-back"/>
                <ActionButton text="Pull Back Hot Items To TiDB" url="/api/data/hot-items/pull-back"/>
            </Box>

            <Typography component="h2" variant="h5" gutterBottom={true}>10. Implement a Simple Item Recommendation Feature</Typography>

            <Button href="/admin/recommend" variant="contained">Go to Recommended Items Page</Button>
        </DashboardLayout>
    )
}