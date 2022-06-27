import * as React from "react";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";

import { useHttpClient } from "lib";
import { LabelType, StatusType } from "const/type";

interface ImportDataStatusProps {
  url?: string;
  path?: string;
  label: LabelType;
  handleSuccess: () => void;
  handleError: (error: any) => void;
}

interface StatusContentProps {
  status: StatusType | undefined;
  label: string;
  text?: string;
}

const labelDesc: { [x in LabelType]: string } = {
  user: "User",
  item: "Item",
  order: "Order",
  express: "Express",
};

export const ImportDataStatus = (props: ImportDataStatusProps) => {
  const { path, url, label, handleSuccess, handleError } = props;

  const [status, setStatus] = React.useState<StatusType>("RUNNING");
  const [statusMsg, setStatusMsg] = React.useState<string | undefined>();

  const [httpClient, _] = useHttpClient(url);

  const handleQueryStatus = async () => {
    try {
      const res = await httpClient.get(
        path ?? `/api/jobs/name/import-initial-${label}-data/instances/last`
      );
      return res.data;
    } catch (error: any) {
      console.error(error);
      // setIsLoading(false);
      setStatus("FAIL");
      setStatusMsg(
        error?.response?.data?.message ||
          `${error?.code} ${error?.message}` ||
          ""
      );
      handleError(error);
      return { data: { status: "ERROR", error } };
    }
  };

  const queryInterval = () => {
    let timer: any;
    timer = setInterval(async () => {
      const res: any = await handleQueryStatus();
      const { status, cost } = res.data;
      switch (status) {
        case "ERROR":
          clearInterval(timer);
          break;
        case "FINISHED":
          setStatus("FINISHED");
          handleSuccess();
          clearInterval(timer);
          break;
        case "FAIL":
          setStatus("FAIL");
          handleError({});
          clearInterval(timer);
          break;
        default:
          break;
      }
    }, 5000);
  };

  React.useEffect(() => {
    queryInterval();
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
        <StatusContent
          status={status}
          label={`${labelDesc[label]} Data`}
          text={statusMsg}
        />
      </Box>
    </>
  );
};

export const StatusContent = (props: StatusContentProps) => {
  const { status, label, text } = props;

  switch (status) {
    case "RUNNING":
      return (
        <>
          <CircularProgress size="1rem" />
          <FormHelperText
            sx={{ marginTop: 0 }}
          >{`Job ${label}: Running...`}</FormHelperText>
        </>
      );
    case "FINISHED":
      return (
        <>
          <CheckCircleIcon fontSize="small" color="success" />
          <FormHelperText sx={{ marginTop: 0 }}>{`Job ${label}: Finished. ${
            text || ""
          }`}</FormHelperText>
        </>
      );
    case "FAIL":
      return (
        <>
          <ErrorIcon fontSize="small" color="error" />
          <FormHelperText error sx={{ marginTop: 0 }}>{`Job ${label}: Error. ${
            text || ""
          }`}</FormHelperText>
        </>
      );
    default:
      return (
        <>
          <InfoIcon fontSize="small" color="info" />
          <FormHelperText sx={{ marginTop: 0 }}>
            {`Job ${label}: Not Running.`}
          </FormHelperText>
        </>
      );
  }
};
