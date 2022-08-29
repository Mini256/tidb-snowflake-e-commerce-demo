import qs from "qs";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Chip, Skeleton, TextField } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TablePagination from "@mui/material/TablePagination";

import { DashboardLayout } from "components/CommonLayout";
import { PageHeader } from "src/DashboardLayout/PageHeader";
import { usdPrice } from "lib/formatter";

import { useHttpClient } from "lib";

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

const TableBodySkeleton = () => {
  return (
    <>
      <TableRow
        key="tbs-1"
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          <Skeleton />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton />
        </TableCell>
      </TableRow>

      <TableRow
        key="tbs-2"
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          <Skeleton />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton />
        </TableCell>
      </TableRow>
    </>
  );
};

export default function CustomerPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [rowCount, setRowCount] = useState<number>(0);
  const [rows, setRows] = useState<UserVO[]>([]);
  const [query, setQuery] = useState<Record<string, any>>({});
  const [username, setUsername] = useState<string>();

  const [httpClient, endpoint] = useHttpClient();

  const renderLabel = (value: string | undefined) => {
    return value ? (
      <Chip
        icon={value === "high" ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        size="small"
        label={value}
        color={value === "high" ? "error" : "info"}
      />
    ) : (
      "N/A"
    );
  };

  useEffect(() => {
    endpoint &&
      (async () => {
        setLoading(true);

        try {
          const q = Object.assign({}, query, {
            page: page,
            size: pageSize,
          });
          const url = `/api/users?${qs.stringify(q)}`;
          const res = await httpClient.get(url);
          const orderPage: ResultVO<UserVO> = res.data;
          const { content = [], pageNum, rowTotal } = orderPage;

          content.map((userVO) => {
            userVO.id = userVO.userId;
            userVO.createTime = new Date(userVO.createTime);
            userVO.updateTime = new Date(userVO.updateTime);
            return userVO;
          });

          setRows(content || []);
          // setPage(pageNum || 1);
          setRowCount(rowTotal || 0);
        } finally {
          setLoading(false);
        }
      })();
  }, [query, page, endpoint]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Customers"
        links={[
          { label: "Dashboard", href: "/" },
          { label: "Manage" },
          { label: "Customers" },
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
            <TextField
              size="small"
              label="Username"
              onChange={(event: any) => {
                setUsername(event.target.value);
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                const query: Record<string, any> = {};

                if (username !== undefined) {
                  query.username = username;
                }

                setQuery(query);
              }}
            >
              Query
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell align="right">User Label</TableCell>
                  <TableCell align="right">Average Amount</TableCell>
                  <TableCell align="right">Create Time</TableCell>
                  <TableCell align="right">Update Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableBodySkeleton />
                ) : (
                  rows.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.username}
                      </TableCell>
                      <TableCell align="right">
                        {renderLabel(row.userLabel)}
                      </TableCell>
                      <TableCell align="right">
                        {row.avgAmount ? `$ ${row.avgAmount}` : "N/A"}
                      </TableCell>
                      <TableCell align="right">
                        {row.createTime.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {row.updateTime.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={rowCount}
            page={page}
            onPageChange={(_, page) => {
              setPage(page);
            }}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(event) => {
              setPageSize(parseInt(event.target.value, 10));
            }}
          />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
function useCallback(arg0: () => string, arg1: Record<string, any>[]) {
  throw new Error("Function not implemented.");
}
