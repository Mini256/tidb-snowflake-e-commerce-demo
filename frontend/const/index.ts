import { GridColumns } from "@mui/x-data-grid";
import { OrderVO } from "const/type";
import { usdPrice } from "lib/formatter";

export const GITHUB_REPO_URL = `https://github.com/Mini256/tidb-snowflake-e-commerce-demo`;

export const ORDER_COLUMNS: GridColumns<OrderVO> = [
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
