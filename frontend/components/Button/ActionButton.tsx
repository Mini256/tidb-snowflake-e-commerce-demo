import { Box, Button, CircularProgress } from "@mui/material";
import { green } from "@mui/material/colors";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";

import { useHttpClient } from "lib";

export interface ActionButtonProps {
  text: string;
  url: string;
}

export default function ActionButton(props: ActionButtonProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const [httpClient] = useHttpClient();

  const action = async () => {
    setLoading(true);
    try {
      const res = await httpClient.post(props.url);
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
    </Box>
  );
}
