import * as React from "react";
import Head from "next/head";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { DashboardLayout } from "components/CommonLayout";
import {
  Etl2SnowflakeVideoCard,
  OfflineAnalysisCard,
  WritebackCard,
  RecommendCard,
} from "components/Card/PipelineCard";

const ConfigurePage = () => {
  return (
    <DashboardLayout>
      <Head>
        <title>Pipeline</title>
      </Head>

      <Etl2SnowflakeVideoCard />
      <OfflineAnalysisCard />
      <WritebackCard />
      <RecommendCard />
    </DashboardLayout>
  );
};

export default ConfigurePage;
