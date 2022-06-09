import { Box } from "@mui/material";
import H2 from "./H2";

export default function Section(props: any) {
    return (
        <Box component="section" sx={{ minHeight: '200px', marginTop: '15px' }}>
            <H2>{props.icon} {props.title}</H2>
            <Box>
                {props.children}
            </Box>
        </Box>
    );
}