import Grid from "@mui/material/Grid";
import Paper from "../../../src/DashboardLayout/Pager";
// import DashboardLayout from '../../../src/DashboardLayout/DashboardLayout';
import { DashboardLayout } from "../../../components/CommonLayout";

import { Box, Tooltip, Typography } from "@mui/material";
import Title from "../../../src/DashboardLayout/Title";
import { useEffect, useState } from "react";
import { formatNumber, usdPrice } from "../../../lib/formatter";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import { DateTime } from "luxon";
import PieChart from "./PieChart";

import { useHttpClient } from "../../../lib";

export interface TodayOrder {
  updateTime?: string;
  totalCount: number;
  totalAmount: number;
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
  });
  const [itemTypeSales, setItemTypeSales] = useState<ItemTypeSale[]>([]);
  const [highPriceItems, setHighPriceItems] = useState<HotItem[]>([]);
  const [lowPriceItems, setLowPriceItems] = useState<HotItem[]>([]);

  const [httpClient, endpoint] = useHttpClient();

  // Load today order total and amount.
  useEffect(() => {
    (async () => {
      const { data } = await httpClient.get(
        "/api/statistic/orders/total-and-amount"
      );
      setTodayOrders({
        totalCount: data.totalCount || 0,
        totalAmount: data.totalAmount || 0,
        updateTime: DateTime.fromISO(data.updateTime)
          .setLocale("en-GB")
          .toLocaleString(DateTime.DATETIME_MED),
      });
    })();
  }, [endpoint]);

  // Load sales by item type.
  useEffect(() => {
    (async () => {
      const { data = [] } = await httpClient.get(
        "/api/statistic/orders/total-and-amount/group-by-type"
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
            <Tooltip title={0}>
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
                {formatNumber(0, 2)}
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
      </Grid>
    </DashboardLayout>
  );
}
