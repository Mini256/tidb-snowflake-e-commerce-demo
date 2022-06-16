import { useRouter } from "next/router";
import {
  Autocomplete,
  Box,
  Link,
  Container,
  Grid,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";

import qs from "qs";
import { useState, useEffect, forwardRef } from "react";
import { createHttpClient } from "../src/lib/request";
import { UserVO } from "./admin/customer";
import { Item } from "./admin/item";
import { ResultVO } from "./admin/order";
import ItemCard from "./ItemCard";
import { VerticalLinearStepper } from "../components/ConfigStepper/ConfigStepper";
import { DashboardLayout } from "../components/CommonLayout";

const httpClient = createHttpClient();

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

const mockValidateEndpoint = async (
  url: string,
  handleSuccess: (arg0: string) => void,
  handleFailure?: (arg0: string) => void
) => {
  const data = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(new Date().getTime());
    }, 5000);
  });
  handleSuccess(data as string);
};

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EndpointBlock = (props: {
  defaultVal?: string;
  handleSuccess: () => void;
  onInputChange: (arg0: string) => void;
}) => {
  const { defaultVal = "", handleSuccess, onInputChange } = props;

  const [btnLoading, setBtnLoading] = useState(false);
  const [inputVal, setInputVal] = useState(defaultVal);
  const [showSnackBar, setShowSnackBar] = useState(false);

  const handleCloseSnackBar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackBar(false);
  };

  return (
    <>
      <TextField
        size="small"
        id="endpoint"
        label="Endpoint URL"
        variant="outlined"
        margin="dense"
        value={inputVal}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e?.target?.value || "";
          setInputVal(val);
        }}
      />
      <Box sx={{ mb: 2 }}>
        <LoadingButton
          sx={{ mt: 1, mr: 1 }}
          color="secondary"
          onClick={async () => {
            setBtnLoading(true);
            console.log(inputVal);
            await mockValidateEndpoint(inputVal, (data: string) => {
              setBtnLoading(false);
              console.log(data);
              setShowSnackBar(true);
              handleSuccess();
              onInputChange(inputVal);
            });
            // setTimeout(() => {
            //   setBtnLoading(false);
            // }, 3000);
          }}
          loading={btnLoading}
          // endIcon={<SearchIcon />}
          // loadingPosition="end"
          variant="contained"
          size="small"
          disabled={!inputVal}
        >
          Check
        </LoadingButton>
      </Box>
      <Snackbar
        open={showSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {`Success: Connected to ${inputVal}`}
        </Alert>
      </Snackbar>
    </>
  );
};
