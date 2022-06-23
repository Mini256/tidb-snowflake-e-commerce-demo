export type ConfigCheckResType = {
  status: number;
  message: string;
  data: {
    ready: boolean;
    snowflakeConfigured: boolean;
    tidbConfigured: boolean;
  };
};
