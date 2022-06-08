import { Box, Button, CircularProgress } from "@mui/material";
import { green } from "@mui/material/colors";
import { useState } from "react";
import { createHttpClient } from "../../../src/lib/request";

const httpClient = createHttpClient();

export interface ActionButtonProps {
    text: string;
    url: string;
}

export default function ActionButton(props: ActionButtonProps) {
    const [loading, setLoading] = useState<boolean>(false);

    const action = async () => {
        setLoading(true);
        try {
            const res = await httpClient.post(props.url);
        } catch(err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    return (
        <Box sx={{ m: 1, position: 'relative' }}>
            <Button variant="contained" disabled={loading} onClick={action}>{props.text}</Button>
            {loading && (
                <CircularProgress
                    size={24}
                    sx={{
                        color: green[500],
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                    }}
                />
            )}
        </Box>
    );
}