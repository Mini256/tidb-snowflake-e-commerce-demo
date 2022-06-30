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

export interface ResultVO<R> {
  content: R[];
  rowTotal: number;
  pageNum: number;
  pageSize: number;
}

// export interface HotItemType {
//   id: string;
//   userId: string;
//   userName: string;
//   userLabel: string;
//   avgAmount: number;
//   itemId: number;
//   itemLabel: string;
//   itemName: string;
//   itemPrice: string;
//   itemType: string;
//   itemDesc: string;
//   createTime: Date;
//   updateTime: Date;
// }

export default function ItemPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(12);
  const [rowCount, setRowCount] = useState<number>(0);
  const [rows, setRows] = useState<HotItemType[]>([]);
  const [query, setQuery] = useState<Record<string, any>>({});

  const [userKeyword, setUserKeyword] = useState<string>();
  const [userAutocompleteOptions, setUserAutocompleteOptions] = useState<any[]>(
    []
  );

  const [currentUser, setCurrentUser] = useState<UserVO | undefined>();

  const [httpClient, endpoint] = useHttpClient();

  // const columns: GridColumns<HotItemType> = [
  //   { field: "userName", headerName: "User", flex: 1 },
  //   {
  //     field: "userLabel",
  //     headerName: "User Label",
  //     flex: 1,
  //     renderCell: ({ value }) => {
  //       const color = value === "high" ? "primary" : "info";
  //       return value ? (
  //         <Chip size="small" label={value} color={color} />
  //       ) : (
  //         "N/A"
  //       );
  //     },
  //   },
  //   {
  //     field: "avgAmount",
  //     headerName: "Average Amount",
  //     flex: 1,
  //     ...usdPrice,
  //     align: "left",
  //     headerAlign: "left",
  //   },
  //   { field: "itemName", headerName: "Item Name", flex: 1 },
  //   {
  //     field: "itemPrice",
  //     headerName: "Item Price",
  //     flex: 1,
  //     ...usdPrice,
  //     align: "left",
  //     headerAlign: "left",
  //   },
  //   {
  //     field: "itemLabel",
  //     headerName: "Item Label",
  //     flex: 1,
  //     renderCell: ({ value }) => {
  //       const color = value === "high" ? "primary" : "info";
  //       return value ? (
  //         <Chip size="small" label={value} color={color} />
  //       ) : (
  //         "N/A"
  //       );
  //     },
  //   },
  //   { field: "itemType", headerName: "Type", flex: 1 },
  //   { field: "itemDesc", headerName: "Description", flex: 1 },
  // ];

  useEffect(() => {
    endpoint &&
      (async () => {
        setLoading(true);

        try {
          const q = Object.assign({}, query, {
            page: page,
            size: pageSize,
          });
          const url = `/api/data/hot-items/recommended?${qs.stringify(q)}`;
          const res = await httpClient.get(url);
          const orderPage: ResultVO<HotItemType> = res.data;
          const { content = [], pageNum, rowTotal } = orderPage;

          content.map((item) => {
            item.id = `${item.userId}-${item.itemId}`;
            return item;
          });

          setRows(content || []);
          setPage(pageNum || 0);
          setRowCount(rowTotal || 0);
        } finally {
          setLoading(false);
        }
      })();
  }, [query, page, endpoint, pageSize]);

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
          setPage(0);
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
      {/* <PageHeader
        title="Recommend Items"
        links={[
          { label: "Dashboard", href: "/" },
          { label: "Manage" },
          { label: "Recommend Items" },
        ]}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
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
                setPage(1);
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
          </Box>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            rowCount={rowCount}
            paginationMode="server"
            sortingMode="server"
            pageSize={pageSize}
            rowsPerPageOptions={[10]}
            checkboxSelection
            autoHeight
            disableColumnFilter={true}
            onPageChange={(page) => {
              setPage(page);
            }}
            onPageSizeChange={(pageSize) => {
              setPageSize(pageSize);
            }}
          />
        </Grid>
      </Grid> */}
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
            setPage(1);
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
      <HotItemImageList products={rows} loading={loading} />
      <TablePagination
        component="div"
        count={Math.ceil(rowCount / pageSize)}
        size="small"
        color="primary"
        page={page}
        onPageChange={(e, pageIdx) => {
          setPage(pageIdx);
        }}
        sx={{ margin: "1rem auto" }}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => {
          setPageSize(parseInt(e.target.value));
        }}
        rowsPerPageOptions={[12, 24, 48]}
      />
      {/* <Box
        component="main"
        sx={{
          flexGrow: 1,
          // py: 8,
        }}
      >
        <Container maxWidth={false}>
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
                setPage(1);
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
          </Box>
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {rows.map((product) => (
                <>
                  <Grid item key={product.id} lg={3} md={4} xs={6}>
                    <ProductCard key={product.id} product={product} />
                  </Grid>
                </>
              ))}
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 3,
            }}
          >
            <Pagination color="primary" count={3} size="small" />
          </Box>
        </Container>
      </Box> */}
    </DashboardLayout>
  );
}
