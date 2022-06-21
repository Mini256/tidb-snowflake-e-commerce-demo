import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "next/router";

import { TiDBConfig, SnowflakeConfig } from "../SidePanel/Walkthrough";

const TiDBStepContent = (props: any) => {
  const { handleNext } = props;

  const hostRef = React.useRef<HTMLInputElement>(null);
  const portRef = React.useRef<HTMLInputElement>(null);
  const dbRef = React.useRef<HTMLInputElement>(null);
  const usrRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <Box
        // component="form"
        // sx={{
        //   "& > :not(style)": { m: 1, width: "25ch" },
        // }}
        // noValidate
        // autoComplete="off"
        sx={{
          paddingTop: "1rem",
        }}
      >
        <TextField
          size="small"
          id="tidb-host"
          label="TIDB_HOST"
          variant="outlined"
          margin="dense"
          defaultValue="127.0.0.1"
          inputRef={hostRef}
        />
        <TextField
          size="small"
          id="tidb-port"
          label="TIDB_PORT"
          variant="outlined"
          margin="dense"
          defaultValue="4000"
          inputRef={portRef}
        />
        <TextField
          size="small"
          id="tidb-db"
          label="TIDB_DATABASE"
          variant="outlined"
          margin="dense"
          defaultValue="ecommerce"
          inputRef={dbRef}
        />
        <TextField
          size="small"
          id="tidb-usr"
          label="TIDB_USERNAME"
          variant="outlined"
          margin="dense"
          defaultValue="root"
          inputRef={usrRef}
        />
        <TextField
          size="small"
          id="tidb-passwd"
          label="TIDB_PASSWORD"
          variant="outlined"
          margin="dense"
          type="password"
          defaultValue=""
          inputRef={passwordRef}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <div>
          <Button
            variant="contained"
            onClick={() => {
              const hostVal = hostRef?.current?.value || "";
              const portVal = portRef?.current?.value || "";
              const dbVal = dbRef?.current?.value || "";
              const usrVal = usrRef?.current?.value || "";
              const pwdVal = passwordRef?.current?.value || "";
              console.log({
                host: hostVal,
                port: portVal,
                database: dbVal,
                user: usrVal,
                password: pwdVal,
              });
              handleNext();
            }}
            sx={{ mt: 1, mr: 1 }}
          >
            Continue
          </Button>
          {/* <Button
                disabled={index === 0}
                onClick={handleBack}
                sx={{ mt: 1, mr: 1 }}
              >
                Back
              </Button> */}
        </div>
      </Box>
    </>
  );
};

const SnowflakeStepContent = (props: any) => {
  const { handleNext, handleBack } = props;

  const hostRef = React.useRef<HTMLInputElement>(null);
  const accountRef = React.useRef<HTMLInputElement>(null);
  const whRef = React.useRef<HTMLInputElement>(null);
  const dbRef = React.useRef<HTMLInputElement>(null);
  const schemaRef = React.useRef<HTMLInputElement>(null);
  const userRef = React.useRef<HTMLInputElement>(null);
  const roleRef = React.useRef<HTMLInputElement>(null);
  const pwdRef = React.useRef<HTMLInputElement>(null);
  const urlRef = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <Box
        sx={{
          paddingTop: "1rem",
        }}
      >
        <TextField
          size="small"
          id="snow-host"
          label="SNOWSQL_HOST"
          variant="outlined"
          margin="dense"
          defaultValue=""
          inputRef={hostRef}
        />
        <TextField
          size="small"
          id="snow-account"
          label="SNOWSQL_ACCOUNT"
          variant="outlined"
          margin="dense"
          defaultValue=""
          inputRef={accountRef}
        />
        <TextField
          size="small"
          id="snow-warehouse"
          label="SNOWSQL_WAREHOUSE"
          variant="outlined"
          margin="dense"
          defaultValue="PC_ETLEAP_WH"
          inputRef={whRef}
        />
        <TextField
          size="small"
          id="snow-database"
          label="SNOWSQL_DATABASE"
          variant="outlined"
          margin="dense"
          defaultValue="PC_ETLEAP_DB"
          inputRef={dbRef}
        />
        <TextField
          size="small"
          id="snow-schema"
          label="SNOWSQL_SCHEMA"
          variant="outlined"
          margin="dense"
          defaultValue="ECOMMERCE"
          inputRef={schemaRef}
        />
        <TextField
          size="small"
          id="snow-user"
          label="SNOWSQL_USER"
          variant="outlined"
          margin="dense"
          defaultValue="MINIANT"
          inputRef={userRef}
        />
        <TextField
          size="small"
          id="snow-role"
          label="SNOWSQL_ROLE"
          variant="outlined"
          margin="dense"
          defaultValue="ACCOUNTADMIN"
          inputRef={roleRef}
        />
        <TextField
          size="small"
          id="snow-pwd"
          label="SNOWSQL_PWD"
          variant="outlined"
          margin="dense"
          defaultValue=""
          type="password"
          inputRef={pwdRef}
        />
        <TextField
          size="small"
          id="snow-url"
          label="SNOWSQL_URL"
          variant="outlined"
          margin="dense"
          defaultValue=""
          inputRef={urlRef}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <div>
          <Button
            variant="contained"
            onClick={() => {
              const hostVal = hostRef?.current?.value || "";
              const accountVal = accountRef?.current?.value || "";
              const whVal = whRef?.current?.value || "";
              const dbVal = dbRef?.current?.value || "";
              const schemaVal = schemaRef?.current?.value || "";
              const userVal = userRef?.current?.value || "";
              const roleVal = roleRef?.current?.value || "";
              const pwdVal = pwdRef?.current?.value || "";
              const urlVal = urlRef?.current?.value || "";
              console.log({
                host: hostVal,
                account: accountVal,
                wh: whVal,
                db: dbVal,
                schema: schemaVal,
                user: userVal,
                role: roleVal,
                pwd: pwdVal,
                url: urlVal,
              });
              handleNext();
            }}
            sx={{ mt: 1, mr: 1 }}
          >
            Continue
          </Button>
          <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
            Back
          </Button>
        </div>
      </Box>
    </>
  );
};

export function VerticalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [uploading, setUploading] = React.useState(false);

  const router = useRouter();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {/* <TiDBStepper handleNext={handleNext} handleBack={handleBack} /> */}
        <Step key="tidb">
          <StepLabel optional={<Typography variant="caption">TiDB</Typography>}>
            Connect to TiDB
          </StepLabel>
          <StepContent>
            <Typography>
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
            <TiDBConfig />
            <TiDBStepContent handleNext={handleNext} />
          </StepContent>
        </Step>
        <Step key="snowflake">
          <StepLabel
            optional={<Typography variant="caption">Snowflake</Typography>}
          >
            Connect to Snowflake
          </StepLabel>
          <StepContent>
            <Typography>
              Configure the connection information of the Snowflake. You can
              create your Snowflake cluster in{" "}
              <a href="https://signup.snowflake.com/">snowflake.com</a>.
            </Typography>
            <SnowflakeConfig />
            <SnowflakeStepContent
              handleNext={handleNext}
              handleBack={handleBack}
            />
          </StepContent>
        </Step>
      </Stepper>
      {activeStep === 2 && (
        <Paper
          square
          elevation={0}
          sx={{ p: 3, backgroundColor: "transparent" }}
        >
          <Typography>{`Almost Done`}</Typography>
          <LoadingButton
            sx={{ mt: 1, mr: 1 }}
            color="secondary"
            onClick={async () => {
              await new Promise((resolve) => {
                setUploading(true);
                setTimeout(() => {
                  resolve(new Date().getTime());
                }, 3000);
              });
              router.push(`/dashboard`);
            }}
            loading={uploading}
            // endIcon={<SaveIcon />}
            // loadingPosition="end"
            variant="contained"
            size="small"
            // disabled={!inputVal}
          >
            Upload Config
          </LoadingButton>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}
