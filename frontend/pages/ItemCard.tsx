import { Card, Box, Stack, Typography } from "@mui/material";
import { Item } from "./item";

export interface ItemCardProps {
  item: Item;
}

export default function ItemCard(props: ItemCardProps) {
  const { item } = props;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        boxShadow:
          "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
        borderRadius: "15px",
      }}
    >
      <Box
        component="div"
        sx={{
          backgroundColor: "#eee",
        }}
      >
        <img src="https://random.imagecdn.app/400/400" height="200px" />
      </Box>
      <Stack direction="column" m={2}>
        <Typography
          component="a"
          variant="subtitle1"
          color="text.primary"
          gutterBottom
        >
          {item?.itemName}
        </Typography>
        <Typography
          component="p"
          variant="inherit"
          color="text.primary"
          gutterBottom
        >
          $ {item?.itemPrice}
        </Typography>
      </Stack>
    </Card>
  );
}
