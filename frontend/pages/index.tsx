import { useRouter } from "next/router";
import { Box, TextField, Typography, Container } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import { useState, useEffect, forwardRef } from "react";
import { VerticalLinearStepper } from "components/Stepper/InitStepper";
import { EndpointBlock } from "components/Block/EndpointBlock";
import { IntroductionCard } from "components/Card/IntroductionCard";

interface InitPageProps {}

export default function InitPage(props: InitPageProps) {
  const [endpoint, setEndpoint] = useState("");
  const [loading, setLoading] = useState(true);
  const [showStepper, setShowStepper] = useState(false);
  const [isEndpointReady, setIsEndpointReady] = useState(false);
  const [isTidbReady, setIsTidbReady] = useState(false);
  const [isTidbSchemaReady, setIsTidbSchemaReady] = useState(false);
  const [isSnowflakeReady, setIsSnowflakeReady] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const query = router.query;
    const qEndpoint = (query?.endpoint as string) || "";
    setEndpoint(qEndpoint);
    setLoading(false);
  }, [router]);

  const handleEdnpointSuccess = (data: {
    endpointStatus: boolean;
    tidbStatus: boolean;
    snowflakeStatus: boolean;
    tidbSchemaStatus: boolean;
  }) => {
    const { endpointStatus, tidbStatus, snowflakeStatus, tidbSchemaStatus } =
      data;
    setIsEndpointReady(endpointStatus);
    setIsTidbReady(tidbStatus);
    setIsSnowflakeReady(snowflakeStatus);
    setIsTidbSchemaReady(tidbSchemaStatus);
    setShowStepper(true);
  };

  const handleResetEndpoint = () => {
    setIsEndpointReady(false);
    setIsTidbReady(false);
    setIsSnowflakeReady(false);
    setShowStepper(false);
  };

  useEffect(() => {
    if (isEndpointReady) {
      router.push(`/dashboard`);
    }
  }, [isEndpointReady]);

  return (
    <Container maxWidth="sm" sx={{ margin: "auto" }}>
      <Typography component="h1" variant="h1">
        TiDB & Snowflake Demo
      </Typography>
      <IntroductionCard />
      {loading ? (
        <>
          <Skeleton animation="wave" height={40} />
          <Skeleton animation="wave" height={40} />
        </>
      ) : (
        <EndpointBlock
          key={endpoint}
          defaultVal={endpoint}
          onInputChange={(val: string) => {
            setEndpoint(val);
          }}
          handleSuccess={handleEdnpointSuccess}
          handleReset={handleResetEndpoint}
        />
      )}
      {endpoint && showStepper && !isEndpointReady && (
        <VerticalLinearStepper
          tidbStatus={isTidbReady}
          snowflakeStatus={isSnowflakeReady}
          tidbSchemaStatus={isTidbSchemaReady}
          endpoint={endpoint}
        />
      )}
    </Container>
  );
}
