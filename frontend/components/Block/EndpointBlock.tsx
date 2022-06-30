import { useState, useEffect, forwardRef } from "react";

import { useRouter } from "next/router";
import { Box, TextField, Typography, Container, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps, AlertColor } from "@mui/material/Alert";
import FormHelperText from "@mui/material/FormHelperText";

import { setLocalStorageEndpoint, createHttpClient } from "lib";
import { ConfigCheckResType } from "const/type";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

export interface EndpointBlockProps {
  defaultVal?: string;
  handleSuccess: (data: {
    endpointStatus: boolean;
    tidbStatus: boolean;
    snowflakeStatus: boolean;
    tidbSchemaStatus: boolean;
    snowflakeSchemaStatus: boolean;
  }) => void;
  onInputChange: (arg0: string) => void;
  handleReset: () => void;
}

export const EndpointBlock = (props: EndpointBlockProps) => {
  const { defaultVal = "", handleSuccess, onInputChange, handleReset } = props;

  const [btnLoading, setBtnLoading] = useState(false);
  const [inputVal, setInputVal] = useState(defaultVal);
  const [showSnackBar, setShowSnackBar] = useState<{
    severity?: AlertColor;
    msg?: string;
    display: boolean;
  }>({ display: false });

  const handleCloseSnackBar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackBar({ display: false });
  };

  const handleCheckBtnClick = async () => {
    const axiosInstance = createHttpClient(inputVal);

    setBtnLoading(true);
    console.log(inputVal);

    try {
      const res = await axiosInstance.get(`/api/admin/config/check`);
      if (res?.status !== 200) {
        throw new Error(`${res.status} ${res.data}`);
      }
      const resData: ConfigCheckResType = res.data;
      const {
        data: {
          ready,
          snowflakeConfigured,
          tidbConfigured,
          tidbSchemaCreated,
          snowflakeSchemaCreated,
        },
        message,
      } = resData;
      setShowSnackBar({
        severity: "success",
        msg: `Success: Connected to ${inputVal}`,
        display: true,
      });
      setBtnLoading(false);
      onInputChange(inputVal);
      setLocalStorageEndpoint(inputVal);
      handleSuccess({
        endpointStatus: ready,
        tidbStatus: tidbConfigured,
        snowflakeStatus: snowflakeConfigured,
        tidbSchemaStatus: tidbSchemaCreated,
        snowflakeSchemaStatus: snowflakeSchemaCreated,
      });
    } catch (error) {
      console.error(error);
      setBtnLoading(false);
      setShowSnackBar({
        severity: "error",
        msg: `Error: Connected to ${inputVal}`,
        display: true,
      });
    }
  };

  const handleResetBtnClick = () => {
    setBtnLoading(false);
    onInputChange("");
    setLocalStorageEndpoint("");
    handleReset();
  };

  return (
    <>
      <TextField
        size="small"
        id="endpoint"
        label="Endpoint"
        variant="outlined"
        margin="dense"
        value={inputVal}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e?.target?.value || "";
          setInputVal(val);
        }}
      />
      <FormHelperText>
        Has no endpoint?{" "}
        <a
          target="_blank"
          href="https://gitpod.io/#/https://github.com/Mini256/tidb-snowflake-e-commerce-demo"
        >
          Click here
        </a>{" "}
        to create one .
      </FormHelperText>
      <Box sx={{ mb: 2 }}>
        <LoadingButton
          sx={{ mt: 1, mr: 1 }}
          color="secondary"
          onClick={handleCheckBtnClick}
          loading={btnLoading}
          variant="contained"
          size="small"
          disabled={!inputVal}
        >
          Check
        </LoadingButton>
        {inputVal && (
          <Button onClick={handleResetBtnClick} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        )}
      </Box>
      <Snackbar
        open={showSnackBar.display}
        autoHideDuration={3000}
        onClose={handleCloseSnackBar}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={showSnackBar?.severity}
          sx={{ width: "100%" }}
        >
          {showSnackBar.msg}
        </Alert>
      </Snackbar>
    </>
  );
};
