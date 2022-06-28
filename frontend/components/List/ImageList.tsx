import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import Button from "@mui/material/Button";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import {
  Autocomplete,
  Box,
  Chip,
  TextField,
  Container,
  Grid,
  Pagination,
} from "@mui/material";

import { ItemType, HotItemType } from "const/type";

export function ItemImageLIst(props: {
  products: ItemType[];
  loading?: boolean;
}) {
  const { products, loading = false } = props;

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  if (loading) {
    return (
      <>
        <Grid
          container
          sx={{
            justifyContent: "space-between",
            flexWrap: "wrap",
            flexDirection: matches ? "row" : "column",
          }}
        >
          {Array.from(new Array(3)).map((item, index) => (
            <Box
              key={index}
              sx={{
                width: matches ? "calc(30%)" : "100%",
                marginRight: 0.5,
                my: 5,
              }}
            >
              <Skeleton animation="wave" variant="rectangular" height={200} />
              <Box sx={{ pt: 0.5 }}>
                <Skeleton animation="wave" />
                <Skeleton animation="wave" width="60%" />
              </Box>
            </Box>
          ))}
        </Grid>
      </>
    );
  }

  return (
    <ImageList cols={matches ? 3 : 1} gap={32}>
      {/* <ImageListItem key="Subheader" cols={4}>
        <ListSubheader component="div">December</ListSubheader>
      </ImageListItem> */}
      {products.map((item) => (
        <ImageListItem key={item.id}>
          <img
            // src={`${item.img}?w=248&fit=crop&auto=format`}
            // srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
            // src={`https://random.imagecdn.app/500/300?id=${Math.random()}`}
            src={`https://picsum.photos/500/300?random=${Math.random()}`}
            alt={item.itemName}
            loading="lazy"
          />
          <ImageListItemBar
            title={item.itemName}
            subtitle={item.itemDesc}
            actionIcon={
              // <IconButton
              //   sx={{ color: "rgba(255, 255, 255, 0.54)" }}
              //   aria-label={`info about ${item.itemName}`}
              // >
              //   <InfoIcon />
              // </IconButton>
              <Button
                startIcon={
                  <AttachMoneyIcon fontSize="small" sx={{ fill: "#fff" }} />
                }
                sx={{ color: "#fff" }}
              >
                {item.itemPrice}
              </Button>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

export function HotItemImageList(props: {
  products: HotItemType[];
  loading?: boolean;
}) {
  const { products, loading = false } = props;

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  if (loading) {
    return (
      <>
        <Grid
          container
          sx={{
            justifyContent: "space-between",
            flexWrap: "wrap",
            flexDirection: matches ? "row" : "column",
          }}
        >
          {Array.from(new Array(3)).map((item, index) => (
            <Box
              key={index}
              sx={{
                width: matches ? "calc(30%)" : "100%",
                marginRight: 0.5,
                my: 5,
              }}
            >
              <Skeleton animation="wave" variant="rectangular" height={200} />
              <Box sx={{ pt: 0.5 }}>
                <Skeleton animation="wave" />
                <Skeleton animation="wave" width="60%" />
              </Box>
            </Box>
          ))}
        </Grid>
      </>
    );
  }

  return (
    <ImageList cols={matches ? 3 : 1} gap={32}>
      {products.map((item) => (
        <ImageListItem key={item.id}>
          <img
            src={`https://picsum.photos/500/300?random=${Math.random()}`}
            alt={item.itemName}
            loading="lazy"
          />
          <ImageListItemBar
            title={item.itemName}
            subtitle={item.itemDesc}
            actionIcon={
              <Button
                startIcon={
                  <AttachMoneyIcon fontSize="small" sx={{ fill: "#fff" }} />
                }
                sx={{ color: "#fff" }}
              >
                {item.itemPrice}
              </Button>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
