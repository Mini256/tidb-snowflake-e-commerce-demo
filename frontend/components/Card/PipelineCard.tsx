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
import LoadingButton from "@mui/lab/LoadingButton";

import { CommonCard } from "components/Card/IndexCard";
import ActionButton from "components/Button/ActionButton";
import CustomCodeBlock, { CodeHighlight } from "components/Block/CodeBlock";
import {
  CALC_USER_LABELS_CODE,
  CALC_HIGH_LABEL_ITEMS_CODE,
  CALC_LOW_LABEL_ITEMS_CODE,
} from "const/SQL";
import { StatusContent } from "components/Card/InitialImportDataStatus";
import { StatusType } from "const/type";
import { useHttpClient } from "lib";
import { PipelineConfig } from "components/SidePanel/Walkthrough";

export const Etl2SnowflakeVideoCard = () => {
  return (
    <CommonCard title="ETL from TiDB to Snowflake">
      <Typography variant="body1">
        We will use tools like <a href="https://etleap.com/">ETLeap</a> to
        import data from TiDB to Snowflake.
      </Typography>
      <PipelineConfig />
      {/* <video
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
      </video> */}
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
      <Typography variant="body1" gutterBottom>
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
        <Typography variant="body1" gutterBottom={true}>
          The user's payment ability is judged according to the user's order
          history.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
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
  const [wbLabelStatus, setWbLabelStatus] = React.useState<
    StatusType | undefined
  >();
  const [wbLabelDesc, setWbLabelDesc] = React.useState("");

  const [wbHotItemsStatus, setWbHotItemsStatus] = React.useState<
    StatusType | undefined
  >();
  const [wbHotItemsDesc, setWbHotItemsDesc] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);

  const [httpClient, _] = useHttpClient();

  const triggerHotItemsWb = async () => {
    setWbHotItemsStatus("RUNNING");
    try {
      const res = await httpClient.post(`/api/data/hot-items/pull-back`);
      const { status, cost, message } = res.data;
      setWbHotItemsDesc(`Cost ${cost.toFixed(2)}s.`);
      setWbHotItemsStatus("FINISHED");
      return res.data;
    } catch (error: any) {
      console.error(error);
      // setIsLoading(false);
      setWbHotItemsStatus("FAIL");
      setWbHotItemsDesc(
        error?.response?.data?.message ||
          `${error?.code} ${error?.message}` ||
          ""
      );
      return { data: { status: "ERROR", error } };
    }
  };

  const triggerLabelWb = async () => {
    setWbLabelStatus("RUNNING");
    try {
      const res = await httpClient.post(
        `/api/data/user-labels/pull-back?recreate=true`
      );
      return res.data;
    } catch (error: any) {
      console.error(error);
      // setIsLoading(false);
      setWbLabelStatus("FAIL");
      setWbLabelDesc(
        error?.response?.data?.message ||
          `${error?.code} ${error?.message}` ||
          ""
      );
      return { data: { status: "ERROR", error } };
    }
  };

  const handleQueryStatus = async () => {
    try {
      const res = await httpClient.get(
        `/api/jobs/name/write-back-user-labels/instances/last`
      );
      return res.data;
    } catch (error: any) {
      console.error(error);
      // setIsLoading(false);
      setWbLabelStatus("FAIL");
      setWbLabelDesc(
        error?.response?.data?.message ||
          `${error?.code} ${error?.message}` ||
          ""
      );
      return { data: { status: "ERROR", error } };
    }
  };

  const queryInterval = () => {
    let timer: any;
    timer = setInterval(async () => {
      const res: any = await handleQueryStatus();
      const { status, cost, message } = res.data;
      switch (status) {
        case "ERROR":
          clearInterval(timer);
          break;
        case "FINISHED":
          setWbLabelStatus("FINISHED");
          setWbLabelDesc(`Cost ${cost.toFixed(2)}s.`);
          clearInterval(timer);
          break;
        case "FAIL":
          setWbLabelStatus("FAIL");
          setWbLabelDesc(message);
          clearInterval(timer);
          break;
        default:
          break;
      }
    }, 5000);
  };

  const handleCreateBtnClick = async () => {
    setIsLoading(true);
    await triggerHotItemsWb();
    await triggerLabelWb();
    queryInterval();
  };

  React.useEffect(() => {
    const result = [wbLabelStatus, wbHotItemsStatus].filter((i) =>
      ["FINISHED", "FAIL"].includes(i || "")
    );
    if (result.length === 2) {
      setIsLoading(false);
    }
  }, [wbLabelStatus, wbHotItemsStatus]);

  return (
    <CommonCard title="Write Back from Snowflake to TiDB">
      <Typography variant="body1" gutterBottom>
        Write back the analysis result data from Snowflake to TiDB.
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
        <StatusContent
          status={wbHotItemsStatus}
          label={`[Write Back Hot Items To TiDB]`}
          text={wbHotItemsDesc}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
        <StatusContent
          status={wbLabelStatus}
          label={`[Write Back User Labels To TiDB]`}
          text={wbLabelDesc}
        />
      </Box>
      <LoadingButton
        variant="contained"
        loading={isLoading}
        onClick={handleCreateBtnClick}
        sx={{ mt: 1, mr: 1 }}
      >
        Write Back
      </LoadingButton>
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
