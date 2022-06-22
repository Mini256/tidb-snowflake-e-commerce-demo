import {
  Autocomplete,
  Box,
  Link,
  Container,
  Grid,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import qs from "qs";
import { useState, useEffect } from "react";
import { UserVO } from "./customer";
import { Item } from "./item";
import { ResultVO } from "./order";
import ItemCard from "components/Card/ItemCard";
import { DashboardLayout } from "components/CommonLayout";

import { useHttpClient } from "../lib";

interface HomePageProps {}

export default function HomePage(props: HomePageProps) {
  const [currentTab, setCurrentTab] = useState<string>("latest");

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(16);
  const [latestItems, setLatestItems] = useState<Item[]>([]);

  const [userRecommendedItems, setUserRecommendedItems] = useState<Item[]>([]);
  const [userKeyword, setUserKeyword] = useState<string>();
  const [userAutocompleteOptions, setUserAutocompleteOptions] = useState<any[]>(
    []
  );
  const [userSelected, setUserSelected] = useState<UserVO>();

  const [httpClient, endpoint] = useHttpClient();

  // Fetch latest items list.
  useEffect(() => {
    (async () => {
      const q = Object.assign(
        {},
        {
          page: page,
          size: pageSize,
        }
      );
      const url = `/api/items?${qs.stringify(q)}`;
      const res = await httpClient.get(url);
      const orderPage: ResultVO<Item> = res.data;
      const { content = [], pageNum, rowTotal } = orderPage;

      content.map((item) => {
        item.createTime = new Date(item.createTime);
        item.updateTime = new Date(item.updateTime);
        return item;
      });

      setLatestItems(content || []);
    })();
  }, [endpoint]);

  // Fetch recommended items list.
  useEffect(() => {
    (async () => {
      if (userSelected === undefined) return;
      console.log(userSelected);

      const q = Object.assign(
        {},
        {
          userId: userSelected?.userId,
        }
      );
      const url = `/api/data/hot-items/recommended?${qs.stringify(q)}`;
      const res = await httpClient.get(url);
      const items: Item[] = res.data;

      items.map((item) => {
        item.createTime = new Date(item.createTime);
        item.updateTime = new Date(item.updateTime);
        return item;
      });

      setUserRecommendedItems(items);
    })();
  }, [userSelected, endpoint]);

  // User autocomplete.
  useEffect(() => {
    (async () => {
      let url = `/api/users/autocomplete`;
      if (userKeyword !== undefined) {
        url = `/api/users/autocomplete?keyword=${userKeyword}`;
      }
      const res = await httpClient.get(url);
      const userList: UserVO[] = res.data;

      userList.map((item) => {
        item.createTime = new Date(item.createTime);
        item.updateTime = new Date(item.updateTime);
        return item;
      });

      setUserAutocompleteOptions(userList || []);
    })();
  }, [userKeyword, endpoint]);

  return (
    <DashboardLayout>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box mb="20px" key="go-to-dashboard">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Box>
        <Box mb="20px" key="tabs">
          <Tabs
            value={currentTab}
            onChange={(event, val) => {
              setCurrentTab(val);
            }}
          >
            <Tab label="Latest" key="latest" value="latest" />
            <Tab label="Recommended" key="recommended" value="recommended" />
          </Tabs>
        </Box>
        {currentTab === "latest" && (
          <Box component="div" key="latest-item-list">
            <Grid container spacing={3}>
              {latestItems.map((row) => {
                return (
                  <Grid key={row.id} item xs={12} md={6} lg={3}>
                    <ItemCard item={row} />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
        {currentTab === "recommended" && (
          <Box component="div" key="recommended-item-list">
            <Autocomplete
              disablePortal
              options={userAutocompleteOptions}
              sx={{ width: 300, mb: "20px" }}
              size="small"
              contentEditable={false}
              onInputChange={(event, value) => {
                setUserKeyword(value);
              }}
              onChange={(event, value) => {
                setUserSelected(value);
              }}
              getOptionLabel={(option) => {
                return option.username;
              }}
              isOptionEqualToValue={(option, value) => {
                return (option.username = value.username);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Recommend for user:" />
              )}
            />
            <Grid container spacing={3}>
              {userRecommendedItems.map((row) => {
                return (
                  <Grid key={row.id} item xs={12} md={6} lg={3}>
                    <ItemCard item={row} />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </Container>
    </DashboardLayout>
  );
}
