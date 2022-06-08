import Grid from '@mui/material/Grid';
import Paper from '../../../src/DashboardLayout/Pager';
import DashboardLayout from '../../../src/DashboardLayout/DashboardLayout';
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

export interface Item {
  id: number,
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

  const columns:GridColumns<Item> = [
    { field: 'itemName', headerName: 'Name', minWidth: 140 },
    { field: 'itemPrice', headerName: 'Price', flex: 1, ...usdPrice, align: 'left', headerAlign: 'left' },
    { field: 'itemType', headerName: 'Type', flex: 1 },
    { field: 'itemDesc', headerName: 'Description', flex: 1 },
    { field: 'createTime', headerName: 'Create Time', flex: 1, type: 'dateTime' },
    { field: 'updateTime', headerName: 'Update Time', flex: 1, type: 'dateTime' },
  ]

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const q = Object.assign({}, query, {
          page: page,
          size: pageSize
        })
        const url = `/api/items?${qs.stringify(q)}`;
        const res = await httpClient.get(url);
        const orderPage:ResultVO<Item> = res.data;
        const { content = [], pageNum, rowTotal } = orderPage;

        content.map((item) => {
          item.createTime = new Date(item.createTime);
          item.updateTime = new Date(item.updateTime);
          return item;
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
      <PageHeader title='Items' links={[
        { label: 'Dashboard', href: '/' },
        { label: 'Manage' },
        { label: 'Items' },
      ]}/>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Paper>
            {/* <Box component="form" sx={{
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

                setQuery(query);
              }}>Query</Button>
            </Box> */}
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
