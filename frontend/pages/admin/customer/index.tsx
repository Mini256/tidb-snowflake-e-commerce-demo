import Grid from '@mui/material/Grid';
import Paper from '../../../src/DashboardLayout/Pager';
import DashboardLayout from '../../../src/DashboardLayout/DashboardLayout';
import { Box, Button, Chip, Link, TextField, Typography } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
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

export interface UserVO {
  id: string;
  userId: string;
  username: string;
  userLabel: string;
  avgAmount: number;
  createTime: Date;
  updateTime: Date;
}

export default function CustomerPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [rowCount, setRowCount] = useState<number>(0);
  const [rows, setRows] = useState<UserVO[]>([]);
  const [query, setQuery] = useState<Record<string, any>>({});
  const [username, setUsername] = useState<string>();

  const columns:GridColumns<UserVO> = [
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'userLabel', headerName: 'User Label', flex: 1, renderCell: ({ value }) => {
      const color = value === 'high' ? 'primary' : 'info';
      return value ? <Chip size="small" label={value} color={color} /> : 'N/A';
    } },
    { field: 'avgAmount', headerName: 'Average Amount', flex: 1, ...usdPrice, align: "left", headerAlign: "left" },
    { field: 'createTime', headerName: 'Create Time', type: "dateTime", flex: 1 },
    { field: 'updateTime', headerName: 'Update Time', type: "dateTime", flex: 1 },
  ]

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const q = Object.assign({}, query, {
          page: page,
          size: pageSize
        })
        const url = `/users?${qs.stringify(q)}`;
        const res = await httpClient.get(url);
        const orderPage:ResultVO<UserVO> = res.data;
        const { content = [], pageNum, rowTotal } = orderPage;
  
        content.map((userVO) => {
          userVO.id = userVO.userId
          userVO.createTime = new Date(userVO.createTime);
          userVO.updateTime = new Date(userVO.updateTime);
          return userVO;
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
      <PageHeader title='Customers' links={[
        { label: 'Dashboard', href: '/' },
        { label: 'Manage' },
        { label: 'Customers' },
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
function useCallback(arg0: () => string, arg1: Record<string, any>[]) {
  throw new Error('Function not implemented.');
}

