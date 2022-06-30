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
import { ImportDataStatus } from "components/Card/InitialImportDataStatus";
import { LabelType, StatusType } from "const/type";

const TiDBStepContent = (props: { handleNext: () => void }) => {
  const { handleNext } = props;

  const [httpClient, _] = useHttpClient();

  const [host, setHost] = React.useState("127.0.0.1");
  const [port, setPort] = React.useState("4000");
  const [database, setDatabase] = React.useState("ECOMMERCE");
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
  const [schema, setSchema] = React.useState("PUBLIC");
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
          helperText={`Database <${db}> will be created if not exist.`}
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
          {/* <Button
            disabled={isLoading}
            onClick={handleBack}
            sx={{ mt: 1, mr: 1 }}
          >
            Back
          </Button> */}
          {errMsg && <FormHelperText error>{errMsg}</FormHelperText>}
        </div>
      </Box>
    </>
  );
};

const CreateSchemaContent = (props: {
  handleNext: () => void;
  handleBack: () => void;
  type?: "tidb" | "snowflake";
}) => {
  const { handleNext, handleBack, type = "tidb" } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const [isCreated, setIsCreated] = React.useState(false);
  const [tables, setTables] = React.useState<TableRowType[]>([]);

  const [errMsg, setErrMsg] = React.useState("");

  const [httpClient, _] = useHttpClient();

  const handleCreateClick = async () => {
    try {
      setErrMsg("");
      setIsLoading(true);
      const res = await httpClient.post(
        `/api/admin/data-source/${type}/schema`
      );
      if (res?.status !== 200) {
        throw new Error(`${res.status} ${res.data}`);
      }
      const res2 = await httpClient.get(
        `/api/admin/data-source/${type}/schema/tables`
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
  const [showStatusBox, setShowStatusBox] = React.useState(false);
  const [isCreated, setIsCreated] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState("");
  const [is409, setIs409] = React.useState(false);

  const [userStatus, setUserStatus] = React.useState<StatusType | undefined>();
  const [itemStatus, setItemStatus] = React.useState<StatusType | undefined>();
  const [orderStatus, setOrderStatus] = React.useState<
    StatusType | undefined
  >();
  const [expressStatus, setExpressStatus] = React.useState<
    StatusType | undefined
  >();

  const [httpClient, url] = useHttpClient();

  const handleCreateClick = async () => {
    try {
      setIsLoading(true);
      const requestBody: { recreate?: boolean } = {};
      is409 && (requestBody.recreate = true);
      setErrMsg("");
      setIs409(false);
      const res = await httpClient.post(
        `/api/admin/data-source/tidb/import-data`,
        requestBody
      );
      const { status, message } = res.data;
      if (status === 409) {
        setIs409(true);
        setErrMsg(message);
      } else {
        setShowStatusBox(true);
      }
    } catch (error: any) {
      console.error(error);
      setErrMsg(
        error?.response?.data?.message ||
          `${error?.code} ${error?.message}` ||
          ""
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueClick = () => {
    handleNext();
  };

  const handleSuccess = (type: LabelType) => {
    switch (type) {
      case "user":
        setUserStatus("FINISHED");
        break;
      case "item":
        setItemStatus("FINISHED");
        break;
      case "order":
        setOrderStatus("FINISHED");
        break;
      case "express":
        setExpressStatus("FINISHED");
        break;
      default:
        break;
    }
  };
  const handleError = (type: LabelType, err: any) => {
    switch (type) {
      case "user":
        setUserStatus("FAIL");
        break;
      case "item":
        setItemStatus("FAIL");
        break;
      case "order":
        setOrderStatus("FAIL");
        break;
      case "express":
        setExpressStatus("FAIL");
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    const sum = [userStatus, itemStatus, orderStatus, expressStatus].filter(
      (i) => ["FINISHED", "FAIL"].includes(i || "")
    ).length;
    if (sum === 4) {
      setIsLoading(false);
      setIsCreated(true);
    }
    if ([userStatus, itemStatus, orderStatus, expressStatus].includes("FAIL")) {
      setErrMsg("FAIL");
    }
  }, [userStatus, itemStatus, orderStatus, expressStatus]);

  return (
    <>
      {/* <CreateSchemaSQL /> */}
      <Box sx={{ mb: 2 }}>
        <div>
          {showStatusBox && (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}
            >
              <ImportDataStatus
                label="user"
                url={url}
                handleSuccess={() => {
                  handleSuccess("user");
                }}
                handleError={(err: any) => {
                  handleError("user", err);
                }}
              />
              <ImportDataStatus
                label="item"
                url={url}
                handleSuccess={() => {
                  handleSuccess("item");
                }}
                handleError={(err: any) => {
                  handleError("item", err);
                }}
              />
              <ImportDataStatus
                label="order"
                url={url}
                handleSuccess={() => {
                  handleSuccess("order");
                }}
                handleError={(err: any) => {
                  handleError("order", err);
                }}
              />
              <ImportDataStatus
                label="express"
                url={url}
                handleSuccess={() => {
                  handleSuccess("express");
                }}
                handleError={(err: any) => {
                  handleError("express", err);
                }}
              />
            </Box>
          )}

          <LoadingButton
            variant="contained"
            loading={isLoading}
            disabled={!!errMsg}
            onClick={isCreated ? handleContinueClick : handleCreateClick}
            sx={{ mt: 1, mr: 1 }}
          >
            {isCreated ? `Continue` : `Import`}
          </LoadingButton>
          {!!errMsg && (
            <Button
              onClick={handleCreateClick}
              sx={{ mt: 1, mr: 1 }}
              disabled={isLoading}
            >
              Retry
            </Button>
          )}
          {/* <Button
            onClick={handleBack}
            sx={{ mt: 1, mr: 1 }}
            disabled={isLoading}
          >
            Back
          </Button> */}
        </div>
        {errMsg && <FormHelperText error>{errMsg}</FormHelperText>}
        {/* {statusMsg && !errMsg && <FormHelperText>{statusMsg}</FormHelperText>} */}
      </Box>
    </>
  );
};

export function VerticalLinearStepper(props: {
  tidbStatus?: boolean;
  snowflakeStatus?: boolean;
  tidbSchemaStatus?: boolean;
  snowflakeSchemaStatus?: boolean;
  endpoint?: string;
}) {
  const {
    tidbStatus,
    snowflakeStatus,
    tidbSchemaStatus,
    snowflakeSchemaStatus,
  } = props;

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
            {tidbSchemaStatus ? (
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
            <>
              <ImportDataContent
                handleNext={handleNext}
                handleBack={handleBack}
              />
            </>
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

        <Step key="create-schema-snowflake">
          <StepLabel>Create Snowflake Schema</StepLabel>
          <StepContent>
            {snowflakeSchemaStatus ? (
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
                  type="snowflake"
                />
              </>
            )}
          </StepContent>
        </Step>
      </Stepper>
      {activeStep === 5 && (
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
