import { Box, Typography } from "@mui/material";

import { CommonCard } from "./IndexCard";

export const IntroductionCard = () => {
  return (
    <CommonCard>
      <Box>
        <Typography component="p" variant="body1" gutterBottom={true}>
          In this demo, we will use TiDB and Snowflake to build an online
          e-commerce system, which will use TiDB's powerful realtime HTAP
          capability and Snowflake's offline analysis capability for a large
          amount of data in the system.
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography
          sx={{ width: "100%" }}
          component="img"
          src="https://user-images.githubusercontent.com/5086433/172916424-736fdf79-34b7-4c09-a580-093b71b94144.png"
        ></Typography>
        {/* <img src="https://user-images.githubusercontent.com/5086433/172916424-736fdf79-34b7-4c09-a580-093b71b94144.png" /> */}
      </Box>
    </CommonCard>
  );
};
