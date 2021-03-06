import Grid from "@mui/material/Grid";
import Paper from "src/DashboardLayout/Pager";
import { DashboardLayout } from "components/CommonLayout";

import { Box, Tooltip, Typography } from "@mui/material";
import Title from "src/DashboardLayout/Title";
import { useEffect, useState } from "react";
import { formatNumber, usdPrice } from "lib/formatter";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import { DateTime } from "luxon";
import PieChart from "./PieChart";
import LineChart from "components/Chart/LineChart";

import { useHttpClient } from "lib";

export interface TodayOrder {
  updateTime?: string;
  totalCount: number;
  totalAmount: number;
  customers: number;
}

export interface ItemTypeSale {
  id: string;
  ts: Date;
  type: string;
  name: string;
  value: number;
  amount: number;
  total: number;
}

const itemTypeColumns: GridColumns<ItemTypeSale> = [
  { field: "type", headerName: "Item Type", flex: 1 },
  { field: "total", headerName: "Total Order", flex: 1 },
  { field: "amount", headerName: "Amount", flex: 1, ...usdPrice },
];

export interface HotItem {
  rank: number;
  id: number;
  itemId: number;
  itemName: string;
  itemType: string;
  itemLabel: string;
  itemPrice: number;
}

const columns: GridColumns<HotItem> = [
  { field: "rank", headerName: "#", width: 40 },
  { field: "itemName", headerName: "Name", flex: 1 },
  { field: "itemType", headerName: "Type", flex: 1 },
  { field: "itemPrice", headerName: "Price", flex: 1, ...usdPrice },
];

export default function DashboardPage() {
  const [todayOrders, setTodayOrders] = useState<TodayOrder>({
    totalCount: 0,
    totalAmount: 0,
    customers: 0,
  });
  const [itemTypeSales, setItemTypeSales] = useState<ItemTypeSale[]>([]);
  const [highPriceItems, setHighPriceItems] = useState<HotItem[]>([]);
  const [lowPriceItems, setLowPriceItems] = useState<HotItem[]>([]);

  const [httpClient, endpoint] = useHttpClient();

  // Load today order total and amount.
  useEffect(() => {
    endpoint &&
      (async () => {
        const _ = await httpClient.post(`/api/orders/stats/today`);
        const { data } = await httpClient.get(`/api/orders/stats/today`);
        setTodayOrders({
          totalCount: data.total || 0,
          totalAmount: data.amount || 0,
          customers: data.customers || 0,
          updateTime: DateTime.fromISO(data.ts)
            .setLocale("en-GB")
            .toLocaleString(DateTime.DATETIME_MED),
        });
      })();
  }, [endpoint]);

  // Load sales by item type.
  useEffect(() => {
    endpoint &&
      (async () => {
        const { data = [] } = await httpClient.get(
          "/api/orders/stats/today/group-by-type"
        );
        data.map((sale: ItemTypeSale) => {
          sale.id = sale.type;
          sale.name = sale.type;
          sale.value = sale.amount;
          return sale;
        });
        setItemTypeSales(data);
      })();
  }, [endpoint]);

  // Load hot items list.
  useEffect(() => {
    (async () => {
      const { data = [] } = await httpClient.get(
        "/api/data/hot-items/high-label"
      );
      data.map((item: HotItem, index: number) => {
        item.id = item.itemId;
        item.rank = index + 1;
        return item;
      });
      setHighPriceItems(data);
    })();
    (async () => {
      const { data = [] } = await httpClient.get(
        "/api/data/hot-items/low-label"
      );
      data.map((item: HotItem, index: number) => {
        item.id = item.itemId;
        item.rank = index + 1;
        return item;
      });
      setLowPriceItems(data);
    })();
  }, [endpoint]);

  return (
    <DashboardLayout>
      <Grid container spacing={3}>
        {/* Total Amount Today */}
        <Grid item xs={12} md={4} lg={4}>
          <Paper>
            <Title>Today Amount</Title>
            <Tooltip title={todayOrders.totalAmount}>
              <Typography
                component="p"
                variant="h4"
                sx={{
                  margin: "15px 0",
                  fontWeight: 700,
                  fontFamily:
                    '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
                  color: "#121828",
                }}
              >
                ${formatNumber(todayOrders.totalAmount, 2)}
              </Typography>
            </Tooltip>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              <>Updated at {todayOrders.updateTime}</>
            </Typography>
          </Paper>
        </Grid>
        {/* Total Order Today */}
        <Grid item xs={12} md={4} lg={4}>
          <Paper>
            <Title>Today Orders</Title>
            <Tooltip title={todayOrders.totalCount}>
              <Typography
                component="p"
                variant="h4"
                sx={{
                  margin: "15px 0",
                  fontWeight: 700,
                  fontFamily:
                    '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
                  color: "#121828",
                }}
              >
                {formatNumber(todayOrders.totalCount, 2)}
              </Typography>
            </Tooltip>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              <>Updated at {todayOrders.updateTime}</>
            </Typography>
          </Paper>
        </Grid>
        {/* Today Customers */}
        <Grid item xs={12} md={4} lg={4}>
          <Paper>
            <Title>Today Customers</Title>
            <Tooltip title={todayOrders.customers}>
              <Typography
                component="p"
                variant="h4"
                sx={{
                  margin: "15px 0",
                  fontWeight: 700,
                  fontFamily:
                    '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
                  color: "#121828",
                }}
              >
                {formatNumber(todayOrders.customers, 2)}
              </Typography>
            </Tooltip>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              <>Updated at {todayOrders.updateTime}</>
            </Typography>
          </Paper>
        </Grid>
        {/* Today Sales */}
        <Grid item xs={12}>
          <Paper>
            <Title>Sales by Item Type</Title>
            <Grid container spacing={3}>
              <Grid item xs={7}>
                <PieChart data={itemTypeSales} />
              </Grid>
              <Grid item xs={5}>
                <DataGrid
                  rows={itemTypeSales}
                  columns={itemTypeColumns}
                  pageSize={10}
                  headerHeight={40}
                  rowHeight={40}
                  disableColumnFilter
                  disableColumnMenu
                  autoHeight={false}
                  hideFooter
                  sx={{
                    border: "none",
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {/* High Label Hot Items TOP 10 */}
        <Grid item xs={6}>
          <Paper>
            <Title>High Price Items TOP 10</Title>
            <DataGrid
              rows={highPriceItems}
              columns={columns}
              pageSize={10}
              autoHeight
              headerHeight={40}
              rowHeight={40}
              disableColumnFilter
              disableColumnMenu
              hideFooter
              sx={{
                border: "none",
              }}
            />
          </Paper>
        </Grid>
        {/* Low Label Hot Items TOP 10 */}
        <Grid item xs={6}>
          <Paper>
            <Title>Low Price Items TOP 10</Title>
            <DataGrid
              rows={lowPriceItems}
              columns={columns}
              pageSize={10}
              autoHeight
              headerHeight={40}
              rowHeight={40}
              disableColumnFilter
              disableColumnMenu
              hideFooter
              sx={{
                border: "none",
              }}
            />
          </Paper>
        </Grid>
        {/* Real-time Online Analysis */}
        <Grid item xs={12}>
          <Paper>
            <Title>Real-time Online Analysis on TiDB</Title>

            <Box sx={{ m: "10px" }}>
              <Typography component="p" variant="body1" gutterBottom>
                In this step, we will use TiDB's real-time analysis engine to
                calculate today's orders:
              </Typography>
              <Typography component="p" variant="body2" gutterBottom>
                1. Calculate today's total orders and amount of orders
              </Typography>
              <Typography component="p" variant="body2" gutterBottom>
                2. Calculate today's total number and amount of orders and group
                them by item type
              </Typography>
              <Box sx={{ height: "500px" }}>
                <LineChart />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
