import { Box, Button, Chip, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DashboardLayout from "../../../src/DashboardLayout/DashboardLayout";
import { createHttpClient } from "../../../src/lib/request";
import ActionButton from "./ActionButton";
import CustomCodeBlock from "./CodeBlock";
import LineChart from "./LineChart";
import Section from "./Section";
import AcUnitIcon from '@mui/icons-material/AcUnit';
import StorageIcon from '@mui/icons-material/Storage';
import { useInterval } from 'usehooks-ts'

const httpClient = createHttpClient();

const CALC_USER_LABELS_CODE = `INSERT OVERWRITE INTO "user_labels" (user_id, user_label, avg_amount)
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
const CALC_HIGH_LABEL_ITEMS_CODE = `INSERT INTO "hot_items" (item_id, item_name, item_type, item_desc, item_price, item_label)
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
const CALC_LOW_LABEL_ITEMS_CODE = `INSERT INTO "hot_items" (item_id, item_name, item_type, item_desc, item_price, item_label)
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
    const [lastTs, setLastTs] = useState<number>(0);
    const [todayHistory, setTodayHistory] = useState<any[]>([]);

    const loadTodayOrderHistory = async function() {
        const url = `/api/statistic/orders/total-and-amount/history?startTs=${lastTs}`
        const res = await httpClient.get(url);
        const n = res.data.length;
        const history = res.data.map((item: any, index: number) => {
            const ts = new Date(item.ts);
            if (index === n - 1) {
                setLastTs(Number(ts) / 1000);
            }
            return {
                name: ts.toString(),
                value: [
                  ts,
                  item.total
                ]
            }
        });
        setTodayHistory(history);
    }

    useEffect(() => {
        loadTodayOrderHistory();
    }, []);

    // useInterval(() => {
    //     loadTodayOrderHistory();
    // }, 10 * 1000);

    return (
        <DashboardLayout>
            <Typography component="h1" variant="h3" gutterBottom={true}>Introduction</Typography>
            <Typography component='p' variant="body1" gutterBottom={true}>In this demo, we will use TiDB and Snowflake to build an online e-commerce system, which will use TiDB's powerful realtime HTAP capability and Snowflake's offline analysis capability for a large amount of data in the system.</Typography>
            <Box sx={{ textAlign: 'center', m: '15px' }}>
                <img width={700} src="https://user-images.githubusercontent.com/5086433/172916424-736fdf79-34b7-4c09-a580-093b71b94144.png"/>
            </Box>
            <Section icon={<StorageIcon/>} title="Connect to TiDB">
                <Typography component="p" variant="body1">Configure the connection information of the TiDB database. You can create your TiDB cluster in <Typography component="a" variant="inherit" href="https://tidb.auth0.com/login">tidbcloud.com</Typography>.</Typography>
                {/* <Paper sx={{ m: '10px' }}>TiDB Connect Information</Paper> */}
            </Section>
            <Section icon={<AcUnitIcon/>} title="Connect to Snowflake">
                <Typography component="p" variant="body1">Configure the connection information of the Snowflake. You can create your Snowflake cluster in <a href="https://signup.snowflake.com/">snowflake.com</a>.</Typography>
                {/* <Paper sx={{ m: '10px' }}>Snowflake Connect Information</Paper> */}
            </Section>
            <Section title="Create Schema">
                <Button variant="contained" disabled>Create Schema</Button>
            </Section>
            <Section title="Import Data">
                <Button variant="contained" disabled>Import Data</Button>
            </Section>

            <Section title="Single view">
                <Button href="/admin/order" variant="contained">Go to Orders Page</Button>
            </Section>

            <Section title="Real-time Online Analysis on TiDB">
                <Box sx={{ m: '10px' }}>
                    <Typography component="p" variant="body1" gutterBottom>
                        In this step, we will use TiDB's real-time analysis engine to calculate today's orders:
                    </Typography>
                    <Typography component="p" variant="body2" gutterBottom>
                        1. Calculate today's total orders and amount of orders
                    </Typography>
                    <Typography component="p" variant="body2" gutterBottom>
                        2. Calculate today's total number and amount of orders and group them by item type
                    </Typography>
                    <Box sx={{ height: '500px' }}>
                        <LineChart data={todayHistory}/>
                    </Box>
                    <Button href="/admin/dashboard" variant="contained">Go to Dashboard Page</Button>
                </Box>
            </Section>

            <Section title="ETL from TiDB to Snowflake">
                <Grid container spacing={3}>
                    <Grid item xs={6} md={6} lg={6}>
                        We will use tools like <a href="https://etleap.com/">ETLeap</a> to import data from TiDB to Snowflake.
                    </Grid>
                    <Grid item xs={6} md={6} lg={6}>
                        <video width="100%" height="100%" autoPlay loop muted controls>
                            <source src="https://user-images.githubusercontent.com/55385323/172923035-6327f6ff-f141-4c48-ba87-56a1ddbce6d7.mp4" type="video/mp4"/>
                        </video>
                    </Grid>
                </Grid>
            </Section>

            <Section title="Perform Offline Analysis on Snowflake">
                <Typography component="p" variant="body1" gutterBottom>
                    We will execute the following SQL statement on Snowflake to perform some offline analysis:
                </Typography>
                <Grid container spacing={3} sx={{ mt: '15px' }}>
                    <Grid item xs={6} md={6} lg={6}>
                        <CustomCodeBlock code={CALC_USER_LABELS_CODE} language="sql"/>
                    </Grid>
                    <Grid item xs={6} md={6} lg={6}>
                        <Typography component='p' variant="body1" gutterBottom={true}>
                            The user's payment ability is judged according to the user's order history. 
                        </Typography>
                        <Typography component='p' variant="body1" gutterBottom={true}>
                            If the user's average order amount is greater than the average order amount of all users, it is considered that he is a user with strong payment ability and will be labeled <Chip size="small" color="primary" label="high"/>, else will be labeled <Chip size="small" color="info" label="low"/>
                        </Typography>
                        <ActionButton text="Calc User Labels on Snowflake" url="/api/data/user-labels/calc"/>
                    </Grid>

                </Grid>
                <Grid container spacing={3} sx={{ mt: '15px' }}>
                    <Grid item xs={6} md={6} lg={6}>
                        <CustomCodeBlock code={CALC_HIGH_LABEL_ITEMS_CODE} language="sql"/>
                    </Grid>
                    <Grid item xs={6} md={6} lg={6}>
                        <ActionButton text="Calc High Label Items on Snowflake" url="/api/data/hot-items/high-label/calc"/>
                    </Grid>
                </Grid>
                <Grid container spacing={3} sx={{ mt: '15px' }}>
                    <Grid item xs={6} md={6} lg={6}>
                        <CustomCodeBlock code={CALC_LOW_LABEL_ITEMS_CODE} language="sql"/>
                    </Grid>
                    <Grid item xs={6} md={6} lg={6}>
                        <ActionButton text="Calc Low Label Items on Snowflake" url="/api/data/hot-items/low-label/calc"/>
                    </Grid>
                </Grid>
            </Section>

            <Section title="Write Back from Snowflake to TiDB">
                <Box sx={{ m: '10px' }}>
                    <Typography component="p" variant="body1" gutterBottom>
                        Write back the analysis result data from Snowflake to TiDB.
                    </Typography>
                    <ActionButton text="Write Back User Labels To TiDB" url="/api/data/user-labels/pull-back"/>
                    <ActionButton text="Write Back Hot Items To TiDB" url="/api/data/hot-items/pull-back"/>
                </Box>
            </Section>

            <Section title="Implement a Simple Item Recommendation Feature">
                <Button href="/admin/recommend" variant="contained">Go to Recommended Items Page</Button>
            </Section>
        </DashboardLayout>
    )
}