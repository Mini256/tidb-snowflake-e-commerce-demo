export type ConfigCheckResType = {
  status: number;
  message: string;
  data: {
    ready: boolean;
    snowflakeConfigured: boolean;
    tidbConfigured: boolean;
  };
};

export type TableRowType = {
  databaseName: string;
  schemaName: string;
  tableName: string;
  kind: string;
  tableRows: number;
  dataSize: number;
  indexSize: number;
  totalSize: number;
  createdTime: string;
};
