import Grid from '@mui/material/Grid';
import Paper from '../../../src/DashboardLayout/Pager';
import DashboardLayout from '../../../src/DashboardLayout/DashboardLayout';
import { Box, Button, Link, TextField, Typography } from '@mui/material';
import qs from 'qs';
import { createHttpClient } from '../../../src/lib/request'
import { useEffect, useState } from 'react';
import { DataGrid, GridColumns } from '@mui/x-data-grid';
import { PageHeader } from '../../../src/DashboardLayout/PageHeader';
import { usdPrice } from '../../../src/lib/formatter';

const httpClient = createHttpClient();

export interface ResultVO<R> {
  content: R[];
  rowTotal: number;
  pageNum: number;
  pageSize: number;
}

export interface OrderVO {
  id: number,
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
  const [username, setUsername] = useState<string>();

  const columns:GridColumns<OrderVO> = [
    { field: 'orderDate', headerName: 'Order Date', type: 'date', width: 100, filterable: false },
    { field: 'username', headerName: 'User', minWidth: 140 },
    { field: 'itemName', headerName: 'Item Name', width: 100, flex: 1 },
    { field: 'amount', headerName: 'Amount', width: 100, flex: 1, ...usdPrice },
    { field: 'status', headerName: 'Status', width: 100, flex: 1 },
    { field: 'currentAddress', headerName: 'Current Address', minWidth: 280, flex: 1, align: 'right' },
  ]

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const q = Object.assign({}, query, {
          page: page,
          size: pageSize
        })
        const url = `/orders?${qs.stringify(q)}`;
        const res = await httpClient.get(url);
        const orderPage:ResultVO<OrderVO> = res.data;
        const { content = [], pageNum, rowTotal } = orderPage;
  
        content.map((orderVO) => {
          orderVO.id = orderVO.orderId
          orderVO.orderDate = new Date(orderVO.orderDate);
          return orderVO;
        });
  
        setRows(content || []);
        setPage(pageNum || 1);
        setRowCount(rowTotal || 0);
      } finally {
        setLoading(false);
      }
    })()
  }, [query, page]);

  return (
    <DashboardLayout>
      <PageHeader title='Orders' links={[
        { label: 'Dashboard', href: '/' },
        { label: 'Manage' },
        { label: 'Orders' },
      ]}/>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Paper>
            <Box component="form" sx={{
              marginBottom: '10px',
              '& > :not(style)': { m: 1 }
            }}>
              <TextField size="small" label="Username" onChange={(event: any) => {
                setUsername(event.target.value);
              }}/>
              <Button variant="contained" onClick={() => {
                const query: Record<string, any> = {};
                
                if (username !== undefined) {
                  query.username = username;
                }

                setPage(1);
                setQuery(query);
              }}>Query</Button>
            </Box>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              rowCount={rowCount}
              page={page}
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
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
