import Grid from "@mui/material/Grid";
// import DashboardLayout from '../../../src/DashboardLayout/DashboardLayout';
import { DashboardLayout } from "../../../components/CommonLayout";

import qs from "qs";
import { useEffect, useState } from "react";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import { PageHeader } from "../../../src/DashboardLayout/PageHeader";
import { usdPrice } from "../../../lib/formatter";

import { useHttpClient } from "../../../lib";
export interface ResultVO<R> {
  content: R[];
  rowTotal: number;
  pageNum: number;
  pageSize: number;
}

export interface Item {
  id: number;
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
  const [rows, setRows] = useState<Item[]>([]);
  const [query, setQuery] = useState<Record<string, any>>({});

  const [httpClient, endpoint] = useHttpClient();

  const columns: GridColumns<Item> = [
    { field: "itemName", headerName: "Name", minWidth: 140 },
    {
      field: "itemPrice",
      headerName: "Price",
      flex: 1,
      ...usdPrice,
      align: "left",
      headerAlign: "left",
    },
    { field: "itemType", headerName: "Type", flex: 1 },
    { field: "itemDesc", headerName: "Description", flex: 1 },
    {
      field: "createTime",
      headerName: "Create Time",
      flex: 1,
      type: "dateTime",
    },
    {
      field: "updateTime",
      headerName: "Update Time",
      flex: 1,
      type: "dateTime",
    },
  ];

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const q = Object.assign({}, query, {
          page: page - 1,
          size: pageSize,
        });
        const url = `/api/items?${qs.stringify(q)}`;
        const res = await httpClient.get(url);
        const orderPage: ResultVO<Item> = res.data;
        const { content = [], pageNum, rowTotal } = orderPage;

        content.map((item) => {
          item.createTime = new Date(item.createTime);
          item.updateTime = new Date(item.updateTime);
          return item;
        });

        setRows(content || []);
        setRowCount(rowTotal || 0);
      } finally {
        setLoading(false);
      }
    })();
  }, [query, page, endpoint]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Items"
        links={[
          { label: "Dashboard", href: "/" },
          { label: "Manage" },
          { label: "Items" },
        ]}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
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
