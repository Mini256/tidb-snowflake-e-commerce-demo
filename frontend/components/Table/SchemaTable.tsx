import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { TableRowType } from "const/type";

export const SchemaTable = (props: { data: TableRowType[] }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Database Name</TableCell>
            <TableCell>Schema Name</TableCell>
            <TableCell>Table Name</TableCell>
            <TableCell>Kind</TableCell>
            <TableCell align="right">Table Rows</TableCell>
            <TableCell align="right">Data Size(byte)</TableCell>
            <TableCell align="right">Index Size(byte)</TableCell>
            <TableCell align="right">Total Size(byte)</TableCell>
            <TableCell align="right">Created Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row) => (
            <TableRow
              key={row.tableName}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.databaseName}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.schemaName}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.tableName}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.kind}
              </TableCell>
              <TableCell align="right">{row.tableRows}</TableCell>
              <TableCell align="right">{row.dataSize}</TableCell>
              <TableCell align="right">{row.indexSize}</TableCell>
              <TableCell align="right">{row.totalSize}</TableCell>
              <TableCell align="right">
                {new Date(row.createdTime).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
