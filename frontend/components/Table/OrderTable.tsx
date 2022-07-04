import qs from "qs";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

import { ORDER_COLUMNS } from "const/index";
import { ResultVO, OrderVO } from "const/type";
import { useHttpClient } from "lib";

export const OrderTable = (props: { userId?: string }) => {
  const { userId } = props;

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<OrderVO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [httpClient, endpoint] = useHttpClient();

  const fetchOrder = async (data: {
    page: number;
    userId?: string;
    size?: number;
  }) => {
    const url = `/api/orders?${qs.stringify(data)}`;
    const res = await httpClient.get(url);
    const orderPage: ResultVO<OrderVO> = res.data;
    const { content = [], pageNum, rowTotal } = orderPage;
    const parsedContent = content.map((orderVO) => {
      orderVO.id = orderVO.orderId;
      orderVO.orderDate = new Date(orderVO.orderDate);
      return orderVO;
    });
    return {
      content: parsedContent,
      page: pageNum,
      size: rowTotal,
    };
  };

  useEffect(() => {
    setRows([]);
    setIsLoading(true);
    const func = async () => {
      try {
        const reqData: {
          page: number;
          userId?: string;
          size?: number;
        } = { page, size: pageSize };
        userId && (reqData.userId = userId);
        const resData = await fetchOrder(reqData);
        const {
          content: parsedContent,
          page: pageNum,
          size: rowTotal,
        } = resData;
        setRows(parsedContent);
        setRowCount(rowTotal);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    endpoint && func();
  }, [userId, endpoint, page]);

  return (
    <>
      <DataGrid
        rows={rows}
        columns={ORDER_COLUMNS}
        loading={isLoading}
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
    </>
  );
};
