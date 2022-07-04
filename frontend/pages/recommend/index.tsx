import { useEffect, useState } from "react";
import Head from "next/head";
import qs from "qs";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import {
  Autocomplete,
  Box,
  Chip,
  TextField,
  Container,
  Grid,
  Pagination,
  Stack,
  TablePagination,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LabelIcon from "@mui/icons-material/Label";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { DashboardLayout } from "components/CommonLayout";
import { UserVO } from "../customer";
import { useHttpClient } from "lib";
import { PageHeader } from "src/DashboardLayout/PageHeader";
import { usdPrice } from "lib/formatter";
import Paper from "src/DashboardLayout/Pager";
import { ProductCard } from "components/Card/ProductCard";
import { HotItemType } from "const/type";
import { HotItemImageList } from "components/List/ImageList";
import { RecommendItems } from "components/Table/RecommendItemsTable";

export interface ResultVO<R> {
  content: R[];
  rowTotal: number;
  pageNum: number;
  pageSize: number;
}

export default function ItemPage() {
  const [query, setQuery] = useState<Record<string, any>>({});

  const [userKeyword, setUserKeyword] = useState<string>();
  const [userAutocompleteOptions, setUserAutocompleteOptions] = useState<any[]>(
    []
  );

  const [currentUser, setCurrentUser] = useState<UserVO | undefined>();

  const [httpClient, endpoint] = useHttpClient();

  // User autocomplete.
  useEffect(() => {
    endpoint &&
      (async () => {
        const url = `/api/users/autocomplete`;
        if (userKeyword) {
          const urlWithQuery = `/api/users/autocomplete?keyword=${userKeyword}`;
          const res = await httpClient.get(urlWithQuery);
          const userList: UserVO[] = res.data;
          const userDetails = userList && !!userList?.length && userList[0];
          setCurrentUser(userDetails || undefined);
          setUserAutocompleteOptions(userList);
        } else {
          const res = await httpClient.get(url);
          const userList: UserVO[] = res.data;
          setCurrentUser(undefined);
          setUserAutocompleteOptions(userList || []);
        }
      })();
  }, [userKeyword, endpoint]);

  return (
    <DashboardLayout>
      <Head>
        <title>Recommend Items</title>
      </Head>
      <PageHeader title="Recommend Items" />
      <Box
        component="form"
        sx={{
          marginBottom: "10px",
          "& > :not(style)": { m: 1 },
        }}
      >
        <Autocomplete
          disablePortal
          options={userAutocompleteOptions}
          sx={{ width: 300, mb: "20px" }}
          size="small"
          contentEditable={false}
          onInputChange={(event, value) => {
            setUserKeyword(value);
          }}
          onChange={(event, user) => {
            if (user != null) {
              setQuery({ userId: user.userId });
            } else {
              setQuery({});
            }
          }}
          getOptionLabel={(option) => {
            return option.username;
          }}
          isOptionEqualToValue={(option, value) => {
            return (option.username = value.username);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Filter by user:" />
          )}
        />
        {currentUser && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              icon={
                currentUser.userLabel === "high" ? (
                  <ArrowDropUpIcon />
                ) : (
                  <ArrowDropDownIcon />
                )
              }
              label={`User Label: ${currentUser.userLabel}`}
              size="small"
              color={currentUser.userLabel === "high" ? "error" : "info"}
            />
          </Stack>
        )}
      </Box>
      <RecommendItems key={`hot-table-${userKeyword}`} userId={query?.userId} />
    </DashboardLayout>
  );
}
