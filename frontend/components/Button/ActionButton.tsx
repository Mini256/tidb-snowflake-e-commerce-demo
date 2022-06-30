import { Box, Button, CircularProgress } from "@mui/material";
import { green } from "@mui/material/colors";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import FormHelperText from "@mui/material/FormHelperText";

import { useHttpClient } from "lib";

export interface ActionButtonProps {
  text: string;
  url: string;
}

export default function ActionButton(props: ActionButtonProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState("");

  const [httpClient] = useHttpClient();

  const action = async () => {
    setLoading(true);
    try {
      const res = await httpClient.post(props.url);
      const { message, cost } = res.data;
      setMsg(cost ? `${message} in ${cost.toFixed(2)}s` : message);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box sx={{ m: 1, position: "relative" }}>
      <LoadingButton variant="contained" loading={loading} onClick={action}>
        {props.text}
      </LoadingButton>
      {msg && <FormHelperText>{msg}</FormHelperText>}
    </Box>
  );
}
