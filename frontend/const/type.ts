export type ConfigCheckResType = {
  status: number;
  message: string;
  data: {
    ready: boolean;
    snowflakeConfigured: boolean;
    tidbConfigured: boolean;
    tidbSchemaCreated: boolean;
    snowflakeSchemaCreated: boolean;
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

export type LabelType = "user" | "item" | "order" | "express";

export type StatusType = "RUNNING" | "FINISHED" | "FAIL";

export type ItemType = {
  id: string;
  itemName: string;
  itemPrice: string;
  itemType: string;
  itemDesc: string;
  createTime: string;
  updateTime: string;
};

export type HotItemType = ItemType & {
  userId: string;
  userName: string;
  userLabel: string;
  avgAmount: number;
  itemId: number;
  itemLabel: string;
};

export interface ResultVO<R> {
  content: R[];
  rowTotal: number;
  pageNum: number;
  pageSize: number;
}

export interface OrderVO {
  id: number;
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
