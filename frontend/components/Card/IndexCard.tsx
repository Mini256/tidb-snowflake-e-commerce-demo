import {
  Box,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Container,
} from "@mui/material";

export const CommonCard = (props: {
  children: any;
  title?: string;
  icon?: any;
}) => {
  return (
    <>
      {props.title && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            paddingBottom: "1rem",
          }}
        >
          {props?.icon}
          <Typography variant="h5" component="h2">
            {props.title}
          </Typography>
        </Box>
      )}
      <Card sx={{ marginBottom: "1rem" }}>
        <CardContent>{props.children}</CardContent>
      </Card>
    </>
  );
};
