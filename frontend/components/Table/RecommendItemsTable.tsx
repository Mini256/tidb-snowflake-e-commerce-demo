import qs from "qs";
import { useEffect, useState } from "react";
import { TablePagination } from "@mui/material";

import { ResultVO, OrderVO, HotItemType } from "const/type";
import { useHttpClient } from "lib";
import { HotItemImageList } from "components/List/ImageList";

export const RecommendItems = (props: { userId?: string }) => {
  const { userId } = props;

  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(12);
  const [rowCount, setRowCount] = useState(0);
  const [rows, setRows] = useState<HotItemType[]>([]);

  const [httpClient, endpoint] = useHttpClient();

  const fetchData = async (data: {
    page: number;
    userId?: string;
    size?: number;
  }) => {
    const url = `/api/data/hot-items/recommended?${qs.stringify(data)}`;
    const res = await httpClient.get(url);
    const orderPage: ResultVO<HotItemType> = res.data;
    const { content = [], pageNum, rowTotal } = orderPage;

    const parsedContent = content.map((item) => {
      item.id = `${item.userId}-${item.itemId}`;
      return item;
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
        const resData = await fetchData(reqData);
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
  }, [endpoint, userId, page]);

  return (
    <>
      <HotItemImageList products={rows} loading={isLoading} />
      <TablePagination
        component="div"
        count={Math.ceil(rowCount / pageSize)}
        size="small"
        color="primary"
        page={page}
        onPageChange={(e, pageIdx) => {
          setPage(pageIdx);
        }}
        sx={{ margin: "1rem auto" }}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => {
          setPageSize(parseInt(e.target.value));
        }}
        rowsPerPageOptions={[12, 24, 48]}
      />
    </>
  );
};
