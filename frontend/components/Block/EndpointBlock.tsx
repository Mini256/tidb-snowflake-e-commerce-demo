import { useState, useEffect, forwardRef } from "react";

import { useRouter } from "next/router";
import { Box, TextField, Typography, Container, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import FormHelperText from "@mui/material/FormHelperText";

import { setLocalStorageEndpoint } from "lib";

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

export const EndpointBlock = (props: {
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
          onClick={async () => {
            setBtnLoading(true);
            console.log(inputVal);
            await mockValidateEndpoint(inputVal, (data: string) => {
              setBtnLoading(false);
              console.log(data);
              setShowSnackBar(true);
              handleSuccess();
              onInputChange(inputVal);
              setLocalStorageEndpoint(inputVal);
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
        <Button
          onClick={() => {
            setLocalStorageEndpoint("");
            setInputVal("");
          }}
          sx={{ mt: 1, mr: 1 }}
        >
          Reset
        </Button>
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
