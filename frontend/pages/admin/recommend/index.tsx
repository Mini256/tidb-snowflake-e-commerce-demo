import Grid from "@mui/material/Grid";
import Paper from "../../../src/DashboardLayout/Pager";
// import DashboardLayout from '../../../src/DashboardLayout/DashboardLayout';
import { DashboardLayout } from "../../../components/CommonLayout";

import qs from "qs";
import { useEffect, useState } from "react";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import { PageHeader } from "../../../src/DashboardLayout/PageHeader";
import { usdPrice } from "../../../src/lib/formatter";
import { Autocomplete, Box, Chip, TextField } from "@mui/material";
import { UserVO } from "../customer";

import { useHttpClient } from "../../../lib";

export interface ResultVO<R> {
  content: R[];
  rowTotal: number;
  pageNum: number;
  pageSize: number;
}

export interface HotItem {
  id: string;
  userId: string;
  userName: string;
  userLabel: string;
  avgAmount: number;
  itemId: number;
  itemLabel: string;
  itemName: string;
  itemPrice: string;
  itemType: string;
  itemDesc: string;
  createTime: Date;
  updateTime: Date;
}

export default function ItemPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [rowCount, setRowCount] = useState<number>(0);
  const [rows, setRows] = useState<HotItem[]>([]);
  const [query, setQuery] = useState<Record<string, any>>({});

  const [userKeyword, setUserKeyword] = useState<string>();
  const [userAutocompleteOptions, setUserAutocompleteOptions] = useState<any[]>(
    []
  );

  const [httpClient, endpoint] = useHttpClient();

  const columns: GridColumns<HotItem> = [
    { field: "userName", headerName: "User", flex: 1 },
    {
      field: "userLabel",
      headerName: "User Label",
      flex: 1,
      renderCell: ({ value }) => {
        const color = value === "high" ? "primary" : "info";
        return value ? (
          <Chip size="small" label={value} color={color} />
        ) : (
          "N/A"
        );
      },
    },
    {
      field: "avgAmount",
      headerName: "Average Amount",
      flex: 1,
      ...usdPrice,
      align: "left",
      headerAlign: "left",
    },
    { field: "itemName", headerName: "Item Name", flex: 1 },
    {
      field: "itemPrice",
      headerName: "Item Price",
      flex: 1,
      ...usdPrice,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "itemLabel",
      headerName: "Item Label",
      flex: 1,
      renderCell: ({ value }) => {
        const color = value === "high" ? "primary" : "info";
        return value ? (
          <Chip size="small" label={value} color={color} />
        ) : (
          "N/A"
        );
      },
    },
    { field: "itemType", headerName: "Type", flex: 1 },
    { field: "itemDesc", headerName: "Description", flex: 1 },
  ];

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const q = Object.assign({}, query, {
          page: page - 1,
          size: pageSize,
        });
        const url = `/api/data/hot-items/recommended?${qs.stringify(q)}`;
        const res = await httpClient.get(url);
        const orderPage: ResultVO<HotItem> = res.data;
        const { content = [], pageNum, rowTotal } = orderPage;

        content.map((item) => {
          item.id = `${item.userId}-${item.itemId}`;
          return item;
        });

        setRows(content || []);
        setPage(pageNum || 1);
        setRowCount(rowTotal || 0);
      } finally {
        setLoading(false);
      }
    })();
  }, [query, page, endpoint]);

  // User autocomplete.
  useEffect(() => {
    (async () => {
      let url = `/api/users/autocomplete`;
      if (userKeyword !== undefined) {
        url = `/api/users/autocomplete?keyword=${userKeyword}`;
      }
      const res = await httpClient.get(url);
      const userList: UserVO[] = res.data;
      setUserAutocompleteOptions(userList || []);
    })();
  }, [userKeyword]);

  return (
    <DashboardLayout>
      <PageHeader
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
      </Grid>
    </DashboardLayout>
  );
}
