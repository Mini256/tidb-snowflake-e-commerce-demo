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
import FormHelperText from "@mui/material/FormHelperText";

import {
  TiDBConfig,
  SnowflakeConfig,
  CreateSchema,
} from "components/SidePanel/Walkthrough";
import { useHttpClient } from "lib";
import { TableRowType } from "const/type";

const TiDBStepContent = (props: { handleNext: () => void }) => {
  const { handleNext } = props;

  const [httpClient, _] = useHttpClient();

  const [host, setHost] = React.useState("127.0.0.1");
  const [port, setPort] = React.useState("4000");
  const [database, setDatabase] = React.useState("test");
  const [user, setUser] = React.useState("root");
  const [password, setPassword] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState("");

  const handleNextClick = async () => {
    const body = {
      host,
      port,
      database,
      user,
      password: btoa(password),
    };
    try {
      setErrMsg("");
      setIsLoading(true);
      const res = await httpClient.post(`/api/admin/data-source/tidb`, body);
      if (res?.status !== 200) {
        throw new Error(`${res.status} ${res.data}`);
      }
      setIsLoading(false);
      handleNext();
    } catch (error: any) {
      console.error(error);
      setErrMsg(
        error?.response?.data?.message ||
          `${error?.code} ${error?.message}` ||
          ""
      );
      setIsLoading(false);
    }
  };

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
          value={host}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setHost(event.target.value);
          }}
        />
        <TextField
          size="small"
          id="tidb-port"
          label="TIDB_PORT"
          variant="outlined"
          margin="dense"
          value={port}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPort(event.target.value);
          }}
        />
        <TextField
          size="small"
          id="tidb-db"
          label="TIDB_DATABASE"
          variant="outlined"
          margin="dense"
          value={database}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setDatabase(event.target.value);
          }}
          helperText="A new db will be created if not exist."
        />
        <TextField
          size="small"
          id="tidb-usr"
          label="TIDB_USERNAME"
          variant="outlined"
          margin="dense"
          value={user}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setUser(event.target.value);
          }}
        />
        <TextField
          size="small"
          id="tidb-passwd"
          label="TIDB_PASSWORD"
          variant="outlined"
          margin="dense"
          type="password"
          value={password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(event.target.value);
          }}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <div>
          <LoadingButton
            variant="contained"
            loading={isLoading}
            disabled={!(host && port && database && user && password)}
            onClick={handleNextClick}
            sx={{ mt: 1, mr: 1 }}
          >
            Continue
          </LoadingButton>
          {errMsg && <FormHelperText error>{errMsg}</FormHelperText>}
        </div>
      </Box>
    </>
  );
};

const SnowflakeStepContent = (props: {
  handleNext: () => void;
  handleBack: () => void;
}) => {
  const { handleNext, handleBack } = props;

  const [httpClient, _] = useHttpClient();

  const [host, setHost] = React.useState("");
  const [account, setAccount] = React.useState("");
  const [wh, setWh] = React.useState("PC_ETLEAP_WH");
  const [db, setDb] = React.useState("PC_ETLEAP_DB");
  const [schema, setSchema] = React.useState("ECOMMERCE");
  const [user, setUser] = React.useState("");
  const [role, setRole] = React.useState("ACCOUNTADMIN");
  const [password, setPassword] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState("");

  const handleNextClick = async () => {
    const body = {
      host,
      account,
      port: 443,
      wh,
      db,
      schema,
      user,
      role,
      password: btoa(password),
    };
    try {
      setErrMsg("");
      setIsLoading(true);
      const res = await httpClient.post(
        `/api/admin/data-source/snowflake`,
        body
      );
      if (res?.status !== 200) {
        throw new Error(`${res.status} ${res.data}`);
      }
      setIsLoading(false);
      handleNext();
    } catch (error: any) {
      console.error(error);
      setErrMsg(
        error?.response?.data?.message ||
          `${error?.code} ${error?.message}` ||
          ""
      );
      setIsLoading(false);
    }
  };

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
          value={host}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setHost(event.target.value);
          }}
        />
        <TextField
          size="small"
          id="snow-account"
          label="SNOWSQL_ACCOUNT"
          variant="outlined"
          margin="dense"
          value={account}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setAccount(event.target.value);
          }}
        />
        <TextField
          size="small"
          id="snow-warehouse"
          label="SNOWSQL_WAREHOUSE"
          variant="outlined"
          margin="dense"
          value={wh}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setWh(event.target.value);
          }}
        />
        <TextField
          size="small"
          id="snow-database"
          label="SNOWSQL_DATABASE"
          variant="outlined"
          margin="dense"
          value={db}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setDb(event.target.value);
          }}
        />
        <TextField
          size="small"
          id="snow-schema"
          label="SNOWSQL_SCHEMA"
          variant="outlined"
          margin="dense"
          value={schema}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSchema(event.target.value);
          }}
        />
        <TextField
          size="small"
          id="snow-user"
          label="SNOWSQL_USER"
          variant="outlined"
          margin="dense"
          value={user}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setUser(event.target.value);
          }}
        />
        <TextField
          size="small"
          id="snow-role"
          label="SNOWSQL_ROLE"
          variant="outlined"
          margin="dense"
          value={role}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setRole(event.target.value);
          }}
        />
        <TextField
          size="small"
          id="snow-pwd"
          label="SNOWSQL_PWD"
          variant="outlined"
          margin="dense"
          value={password}
          type="password"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(event.target.value);
          }}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <div>
          <LoadingButton
            variant="contained"
            disabled={
              !(
                account &&
                wh &&
                db &&
                schema &&
                user &&
                role &&
                password &&
                host
              )
            }
            loading={isLoading}
            onClick={handleNextClick}
            sx={{ mt: 1, mr: 1 }}
          >
            Continue
          </LoadingButton>
          <Button
            disabled={isLoading}
            onClick={handleBack}
            sx={{ mt: 1, mr: 1 }}
          >
            Back
          </Button>
          {errMsg && <FormHelperText error>{errMsg}</FormHelperText>}
        </div>
      </Box>
    </>
  );
};

const CreateSchemaContent = (props: {
  handleNext: () => void;
  handleBack: () => void;
}) => {
  const { handleNext, handleBack } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const [isCreated, setIsCreated] = React.useState(false);
  const [tables, setTables] = React.useState<TableRowType[]>([]);

  const [errMsg, setErrMsg] = React.useState("");

  const [httpClient, _] = useHttpClient();

  const handleCreateClick = async () => {
    try {
      setErrMsg("");
      setIsLoading(true);
      const res = await httpClient.post(`/api/admin/data-source/tidb/schema`);
      if (res?.status !== 200) {
        throw new Error(`${res.status} ${res.data}`);
      }
      const res2 = await httpClient.get(
        `/api/admin/data-source/tidb/schema/tables`
      );
      if (res2?.status !== 200) {
        throw new Error(`${res2.status} ${res2.data}`);
      }
      setTables(res2.data?.data);
      setIsCreated(true);
      setIsLoading(false);
    } catch (error: any) {
      console.error(error);
      setErrMsg(
        error?.response?.data?.message ||
          `${error?.code} ${error?.message}` ||
          ""
      );
      setIsLoading(false);
    }
  };

  const handleContinueClick = () => {
    handleNext();
  };

  return (
    <>
      <Box sx={{ mb: 2, display: "flex", gap: "1rem" }}>
        {isCreated && !!tables.length && <CreateSchema data={tables} />}
        <LoadingButton
          variant="contained"
          loading={isLoading}
          onClick={isCreated ? handleContinueClick : handleCreateClick}
          // sx={{ mt: 1, mr: 1 }}
        >
          {isCreated ? `Continue` : `Create`}
        </LoadingButton>
        {errMsg && <FormHelperText error>{errMsg}</FormHelperText>}
      </Box>
    </>
  );
};

const ImportDataContent = (props: {
  handleNext: () => void;
  handleBack: () => void;
}) => {
  const { handleNext, handleBack } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const [isCreated, setIsCreated] = React.useState(false);

  const [errMsg, setErrMsg] = React.useState("");
  const [statusMsg, setStatusMsg] = React.useState("");

  const [httpClient, _] = useHttpClient();

  const handleQueryStatus = async () => {
    try {
      const res = await httpClient.get(
        `/api/jobs/name/import-initial-user-data/instances/last`
      );
      return res.data;
    } catch (error: any) {
      console.error(error);
      setErrMsg(
        error?.response?.data?.message ||
          `${error?.code} ${error?.message}` ||
          ""
      );
      setIsLoading(false);
    }
  };

  const queryInterval = () => {
    let timer: any;
    timer = setInterval(async () => {
      const res: any = await handleQueryStatus();
      const { status, cost } = res.data;
      if (["FINISHED", "FAIL"].includes(status)) {
        setStatusMsg(`${status} in ${cost}`);
        setIsCreated(true);
        setIsLoading(false);
        clearInterval(timer);
      }
      setStatusMsg(`${status} ...`);
    }, 1000);
  };

  const handleCreateClick = async () => {
    try {
      setErrMsg("");
      setIsLoading(true);
      const res = await httpClient.post(
        `/api/admin/data-source/tidb/import-data`
      );
      if (res?.status !== 200) {
        throw new Error(`${res.status} ${res.data}`);
      }
      queryInterval();
      // setIsCreated(true);
      // setIsLoading(false);
    } catch (error: any) {
      console.error(error);
      setErrMsg(
        error?.response?.data?.message ||
          `${error?.code} ${error?.message}` ||
          ""
      );
      setIsLoading(false);
    }
  };

  const handleContinueClick = () => {
    handleNext();
  };

  return (
    <>
      {/* <CreateSchemaSQL /> */}
      <Box sx={{ mb: 2 }}>
        <div>
          <LoadingButton
            variant="contained"
            loading={isLoading}
            onClick={isCreated ? handleContinueClick : handleCreateClick}
            sx={{ mt: 1, mr: 1 }}
          >
            {isCreated ? `Continue` : `Import`}
          </LoadingButton>
          <Button
            onClick={handleBack}
            sx={{ mt: 1, mr: 1 }}
            disabled={isLoading}
          >
            Back
          </Button>
        </div>
        {errMsg && <FormHelperText error>{errMsg}</FormHelperText>}
        {statusMsg && !errMsg && <FormHelperText>{statusMsg}</FormHelperText>}
      </Box>
    </>
  );
};

export function VerticalLinearStepper(props: {
  tidbStatus?: boolean;
  snowflakeStatus?: boolean;
  endpoint?: string;
}) {
  const { tidbStatus, snowflakeStatus } = props;

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
        <Step key="tidb">
          <StepLabel optional={<Typography variant="caption">TiDB</Typography>}>
            Connect to TiDB
          </StepLabel>
          <StepContent>
            {tidbStatus ? (
              <>
                <Typography>
                  You have successfully configured TiDB connection.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 1, mr: 1 }}
                  onClick={handleNext}
                >
                  Continue
                </Button>
              </>
            ) : (
              <>
                <Typography>
                  Configure the connection information of the TiDB database. You
                  can create your TiDB cluster in{" "}
                  <Typography
                    component="a"
                    variant="inherit"
                    href="https://tidbcloud.com/"
                  >
                    tidbcloud.com
                  </Typography>
                  .
                </Typography>
                <TiDBConfig />
                <TiDBStepContent handleNext={handleNext} />
              </>
            )}
          </StepContent>
        </Step>

        <Step key="create-schema">
          <StepLabel>Create Schema</StepLabel>
          <StepContent>
            {tidbStatus ? (
              <>
                <Typography>
                  You have successfully configured Schema.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 1, mr: 1 }}
                  onClick={handleNext}
                >
                  Continue
                </Button>
              </>
            ) : (
              <>
                <CreateSchemaContent
                  handleNext={handleNext}
                  handleBack={handleBack}
                />
              </>
            )}
          </StepContent>
        </Step>

        <Step key="import-data">
          <StepLabel>Import Data</StepLabel>
          <StepContent>
            {tidbStatus ? (
              <>
                <Typography>
                  You have successfully completed this step.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 1, mr: 1 }}
                  onClick={handleNext}
                >
                  Continue
                </Button>
              </>
            ) : (
              <>
                <ImportDataContent
                  handleNext={handleNext}
                  handleBack={handleBack}
                />
              </>
            )}
          </StepContent>
        </Step>

        <Step key="snowflake">
          <StepLabel
            optional={<Typography variant="caption">Snowflake</Typography>}
          >
            Connect to Snowflake
          </StepLabel>
          <StepContent>
            {snowflakeStatus ? (
              <>
                <Typography>
                  You have successfully connected to Snowflake.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 1, mr: 1 }}
                  onClick={handleNext}
                >
                  Continue
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </StepContent>
        </Step>
      </Stepper>
      {activeStep === 4 && (
        <Paper
          square
          elevation={0}
          sx={{ p: 3, backgroundColor: "transparent" }}
        >
          <Typography
            variant="body1"
            sx={{ fontWeight: "bold" }}
          >{`Congratulations!`}</Typography>
          <Typography variant="body1">{`You have successfully connected to TiDB & Snowflake.`}</Typography>
          <Typography variant="body1">{`Next step we will create pipeline from Snowflake to TiDB.`}</Typography>
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
              router.push(`/pipeline`);
            }}
            loading={uploading}
            // endIcon={<SaveIcon />}
            // loadingPosition="end"
            variant="contained"
            size="small"
            // disabled={!inputVal}
          >
            Continue
          </LoadingButton>
          {/* <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button> */}
        </Paper>
      )}
    </Box>
  );
}
