import * as React from "react";
import Head from "next/head";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ShoppingBag from "@mui/icons-material/ShoppingBag";

import { CommonCard } from "components/Card/IndexCard";
import ActionButton from "components/Button/ActionButton";
import CustomCodeBlock, { CodeHighlight } from "components/Block/CodeBlock";
import {
  CALC_USER_LABELS_CODE,
  CALC_HIGH_LABEL_ITEMS_CODE,
  CALC_LOW_LABEL_ITEMS_CODE,
} from "const/SQL";

export const Etl2SnowflakeVideoCard = () => {
  return (
    <CommonCard title="ETL from TiDB to Snowflake">
      <Typography component="p" variant="body1">
        We will use tools like <a href="https://etleap.com/">ETLeap</a> to
        import data from TiDB to Snowflake.
      </Typography>
      <video
        width="100%"
        height="100%"
        autoPlay
        loop
        muted
        controls
        style={{ maxWidth: "50rem" }}
      >
        <source
          src="https://user-images.githubusercontent.com/55385323/172923035-6327f6ff-f141-4c48-ba87-56a1ddbce6d7.mp4"
          type="video/mp4"
        />
      </video>
    </CommonCard>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export const OfflineAnalysisCard = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <CommonCard title="Perform Offline Analysis on Snowflake">
      <Typography component="p" variant="body1" gutterBottom>
        We will execute the following SQL statement on Snowflake to perform some
        offline analysis:
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Calc User Labels on Snowflake" />
          <Tab label="Calc High Label Items on Snowflake" />
          <Tab label="Calc Low Label Items on Snowflake" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Typography component="p" variant="body1" gutterBottom={true}>
          The user's payment ability is judged according to the user's order
          history.
        </Typography>
        <Typography component="p" variant="body1" gutterBottom={true}>
          <span>
            If the user's average order amount is greater than the average order
            amount of all users, it is considered that he is a user with strong
            payment ability and will be labeled{" "}
          </span>
          <b>high</b>
          <span>, else will be labeled </span>
          <b>low</b>
        </Typography>
        <CodeHighlight content={CALC_USER_LABELS_CODE} lang="sql" />
        <ActionButton
          text="Calc User Labels on Snowflake"
          url="/api/data/user-labels/calc"
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CodeHighlight content={CALC_HIGH_LABEL_ITEMS_CODE} lang="sql" />
        <ActionButton
          text="Calc High Label Items on Snowflake"
          url="/api/data/hot-items/high-label/calc"
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CodeHighlight content={CALC_LOW_LABEL_ITEMS_CODE} lang="sql" />
        <ActionButton
          text="Calc Low Label Items on Snowflake"
          url="/api/data/hot-items/low-label/calc"
        />
      </TabPanel>
    </CommonCard>
  );
};

export const WritebackCard = () => {
  return (
    <CommonCard title="Write Back from Snowflake to TiDB">
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
    </CommonCard>
  );
};

export const RecommendCard = () => {
  return (
    <CommonCard title="Implement a Simple Item Recommendation Feature">
      Go to{" "}
      <Button href="/recommend" startIcon={<ShoppingBag />}>
        Recommended Items Page
      </Button>
    </CommonCard>
  );
};
