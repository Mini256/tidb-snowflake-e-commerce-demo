import Grid from "@mui/material/Grid";
import { DashboardLayout } from "components/CommonLayout";

import { Autocomplete, Box, TextField } from "@mui/material";
import qs from "qs";
import { useEffect, useState } from "react";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import { PageHeader } from "src/DashboardLayout/PageHeader";
import { usdPrice } from "lib/formatter";
import { UserVO } from "../customer";
import { OrderTable } from "components/Table/OrderTable";

import { useHttpClient } from "lib";

export interface ResultVO<R> {
  content: R[];
  rowTotal: number;
  pageNum: number;
  pageSize: number;
}

export interface OrderVO {
  id: number;
  orderId: number;
  orderDate: Date;
  userId: string;
  username: string;
  itemId: string;
  itemName: string;
  amount: string;
  status: string;
  currentAddress: string;
}

export default function OrderPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [rowCount, setRowCount] = useState<number>(0);
  const [rows, setRows] = useState<OrderVO[]>([]);
  const [query, setQuery] = useState<Record<string, any>>({});

  const [userKeyword, setUserKeyword] = useState<string>();
  const [userAutocompleteOptions, setUserAutocompleteOptions] = useState<any[]>(
    []
  );

  const [httpClient, endpoint] = useHttpClient();

  const columns: GridColumns<OrderVO> = [
    {
      field: "orderDate",
      headerName: "Order Date",
      type: "date",
      width: 100,
      filterable: false,
    },
    { field: "username", headerName: "User", minWidth: 140 },
    { field: "itemName", headerName: "Item Name", width: 100, flex: 1 },
    {
      field: "amount",
      headerName: "Amount",
      width: 100,
      flex: 1,
      ...usdPrice,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      flex: 1,
      renderCell: ({ value }) => {
        return value || "N/A";
      },
    },
    {
      field: "currentAddress",
      headerName: "Current Address",
      minWidth: 280,
      flex: 1,
      align: "right",
    },
  ];

  // User autocomplete.
  useEffect(() => {
    endpoint &&
      (async () => {
        let url = `/api/users/autocomplete`;
        if (userKeyword !== undefined) {
          url = `/api/users/autocomplete?keyword=${userKeyword}`;
        }
        const res = await httpClient.get(url);
        const userList: UserVO[] = res.data;
        setUserAutocompleteOptions(userList || []);
      })();
  }, [userKeyword, endpoint]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Orders"
        links={[
          { label: "Dashboard", href: "/" },
          { label: "Manage" },
          { label: "Orders" },
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
          <OrderTable
            key={`order-tabel-${userKeyword}`}
            userId={query?.userId}
          />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
