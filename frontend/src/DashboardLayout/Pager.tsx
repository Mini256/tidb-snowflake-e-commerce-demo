import { Paper as MuiPaper } from "@mui/material";

export default function Paper(props:any) {
    return <MuiPaper
        sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px',
            borderRadius: '15px',
            ...props.sx
        }}
        elevation={0}
    >
        {props.children}
    </MuiPaper>
}