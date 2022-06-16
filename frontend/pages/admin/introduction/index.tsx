import { Box, Button, Grid, Typography } from "@mui/material";
// import DashboardLayout from "../../../src/DashboardLayout/DashboardLayout";
import { DashboardLayout } from "../../../components/CommonLayout";

import ActionButton from "./ActionButton";
import CustomCodeBlock from "./CodeBlock";
import LineChart from "./LineChart";
import Section from "./Section";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import StorageIcon from "@mui/icons-material/Storage";
import {
  CALC_USER_LABELS_CODE,
  CALC_HIGH_LABEL_ITEMS_CODE,
  CALC_LOW_LABEL_ITEMS_CODE,
} from "./SQL";

export default function IntroductionPage() {
  return (
    <DashboardLayout title="Introduction">
      <Typography component="h1" variant="h3" gutterBottom={true}>
        Introduction
      </Typography>
      <Typography component="p" variant="body1" gutterBottom={true}>
        In this demo, we will use TiDB and Snowflake to build an online
        e-commerce system, which will use TiDB's powerful realtime HTAP
        capability and Snowflake's offline analysis capability for a large
        amount of data in the system.
      </Typography>
      <Box sx={{ textAlign: "center", m: "15px" }}>
        <img
          width={700}
          src="https://user-images.githubusercontent.com/5086433/172916424-736fdf79-34b7-4c09-a580-093b71b94144.png"
        />
      </Box>
      <Section icon={<StorageIcon />} title="Connect to TiDB">
        <Typography component="p" variant="body1">
          Configure the connection information of the TiDB database. You can
          create your TiDB cluster in{" "}
          <Typography
            component="a"
            variant="inherit"
            href="https://tidb.auth0.com/login"
          >
            tidbcloud.com
          </Typography>
          .
        </Typography>
        {/* <Paper sx={{ m: '10px' }}>TiDB Connect Information</Paper> */}
      </Section>
      <Section icon={<AcUnitIcon />} title="Connect to Snowflake">
        <Typography component="p" variant="body1">
          Configure the connection information of the Snowflake. You can create
          your Snowflake cluster in{" "}
          <a href="https://signup.snowflake.com/">snowflake.com</a>.
        </Typography>
        {/* <Paper sx={{ m: '10px' }}>Snowflake Connect Information</Paper> */}
      </Section>
      <Section title="Create Schema">
        <Button variant="contained" disabled>
          Create Schema
        </Button>
      </Section>
      <Section title="Import Data">
        <Button variant="contained" disabled>
          Import Data
        </Button>
      </Section>

      <Section title="Single view">
        <Button href="/admin/order" variant="contained">
          Go to Orders Page
        </Button>
      </Section>

      <Section title="Real-time Online Analysis on TiDB">
        <Box sx={{ m: "10px" }}>
          <Typography component="p" variant="body1" gutterBottom>
            In this step, we will use TiDB's real-time analysis engine to
            calculate today's orders:
          </Typography>
          <Typography component="p" variant="body2" gutterBottom>
            1. Calculate today's total orders and amount of orders
          </Typography>
          <Typography component="p" variant="body2" gutterBottom>
            2. Calculate today's total number and amount of orders and group
            them by item type
          </Typography>
          <Box sx={{ height: "500px" }}>
            <LineChart />
          </Box>
          <Button href="/admin/dashboard" variant="contained">
            Go to Dashboard Page
          </Button>
        </Box>
      </Section>

      <Section title="ETL from TiDB to Snowflake">
        <Grid container spacing={3}>
          <Grid item xs={6} md={6} lg={6}>
            We will use tools like <a href="https://etleap.com/">ETLeap</a> to
            import data from TiDB to Snowflake.
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <video width="100%" height="100%" autoPlay loop muted controls>
              <source
                src="https://user-images.githubusercontent.com/55385323/172923035-6327f6ff-f141-4c48-ba87-56a1ddbce6d7.mp4"
                type="video/mp4"
              />
            </video>
          </Grid>
        </Grid>
      </Section>

      <Section title="Perform Offline Analysis on Snowflake">
        <Typography component="p" variant="body1" gutterBottom>
          We will execute the following SQL statement on Snowflake to perform
          some offline analysis:
        </Typography>
        <Grid container spacing={3} sx={{ mt: "15px" }}>
          <Grid item xs={6} md={6} lg={6}>
            <CustomCodeBlock code={CALC_USER_LABELS_CODE} language="sql" />
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <Typography component="p" variant="body1" gutterBottom={true}>
              The user's payment ability is judged according to the user's order
              history.
            </Typography>
            <Typography component="p" variant="body1" gutterBottom={true}>
              <span>
                If the user's average order amount is greater than the average
                order amount of all users, it is considered that he is a user
                with strong payment ability and will be labeled{" "}
              </span>
              <b>high</b>
              <span>, else will be labeled </span>
              <b>low</b>
            </Typography>
            <ActionButton
              text="Calc User Labels on Snowflake"
              url="/api/data/user-labels/calc"
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mt: "15px" }}>
          <Grid item xs={6} md={6} lg={6}>
            <CustomCodeBlock code={CALC_HIGH_LABEL_ITEMS_CODE} language="sql" />
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <ActionButton
              text="Calc High Label Items on Snowflake"
              url="/api/data/hot-items/high-label/calc"
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mt: "15px" }}>
          <Grid item xs={6} md={6} lg={6}>
            <CustomCodeBlock code={CALC_LOW_LABEL_ITEMS_CODE} language="sql" />
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <ActionButton
              text="Calc Low Label Items on Snowflake"
              url="/api/data/hot-items/low-label/calc"
            />
          </Grid>
        </Grid>
      </Section>

      <Section title="Write Back from Snowflake to TiDB">
        <Box sx={{ m: "10px" }}>
          <Typography component="p" variant="body1" gutterBottom>
            Write back the analysis result data from Snowflake to TiDB.
          </Typography>
          <ActionButton
            text="Write Back User Labels To TiDB"
            url="/api/data/user-labels/pull-back"
          />
          <ActionButton
            text="Write Back Hot Items To TiDB"
            url="/api/data/hot-items/pull-back"
          />
        </Box>
      </Section>

      <Section title="Implement a Simple Item Recommendation Feature">
        <Button href="/admin/recommend" variant="contained">
          Go to Recommended Items Page
        </Button>
      </Section>
    </DashboardLayout>
  );
}
