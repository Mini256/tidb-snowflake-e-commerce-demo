import { Typography } from "@mui/material";


export default function H2(props: any) {
    return (
        <Typography component="h4" variant="h4" sx={{
            fontWeight: 500,
            color: '#232323',
            fontSize: '28px'
        }} gutterBottom={true}>{props.children}</Typography>
    );
}