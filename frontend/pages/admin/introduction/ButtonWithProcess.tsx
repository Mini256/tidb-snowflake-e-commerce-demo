import { Box, Button, CircularProgress } from "@mui/material";
import { green } from "@mui/material/colors";

export default function ButtonWithProcess(props: any) {

    return (
        <Box sx={{ m: 1, position: 'relative' }}>
            <Button variant="contained" disabled={props.loading} onClick={props.action}>{props.text}</Button>
            {props.loading && (
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