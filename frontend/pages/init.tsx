import { useRouter } from "next/router";
import { Box, TextField, Typography, Container } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import { useState, useEffect, forwardRef } from "react";
import { VerticalLinearStepper } from "../components/Stepper/ConfigStepper";
import { EndpointBlock } from "../components/Block/EndpointBlock";

interface InitPageProps {}

export default function InitPage(props: InitPageProps) {
  const [endpoint, setEndpoint] = useState("");
  const [loading, setLoading] = useState(true);
  const [showStepper, setShowStepper] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const query = router.query;
    const qEndpoint = (query?.endpoint as string) || "";
    setEndpoint(qEndpoint);
    setLoading(false);
  }, [router]);

  return (
    <Container maxWidth="sm" sx={{ margin: "auto" }}>
      <Typography component="h1" variant="h1">
        Init
      </Typography>
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
          handleSuccess={() => {
            setShowStepper(true);
          }}
        />
      )}
      {endpoint && showStepper && <VerticalLinearStepper />}
    </Container>
  );
}
