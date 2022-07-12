import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ArticleIcon from "@mui/icons-material/Article";
import SchoolIcon from "@mui/icons-material/School";
import CloseIcon from "@mui/icons-material/Close";
import LinkIcon from "@mui/icons-material/Link";
import SchemaIcon from "@mui/icons-material/Schema";
import TableViewIcon from "@mui/icons-material/TableView";
import { Container, IconButton, Typography } from "@mui/material";

import { InlineCode, CodeHighlight } from "components/Block/CodeBlock";
import { CommonCard } from "components/Card/IndexCard";
import { SchemaTable } from "components/Table/SchemaTable";
import { TableRowType } from "const/type";

type Anchor = "top" | "left" | "bottom" | "right";

interface WalkthroughTemplateProps {
  btnLabel?: string;
  btnIcon?: React.ReactNode;
  anchor?: Anchor;
  header?: string;
  children: any;
}

const WalkthroughTemplate = (props: WalkthroughTemplateProps) => {
  const {
    btnLabel = "Walkthrough",
    btnIcon,
    anchor = "right",
    header = "Walkthrough",
    children,
  } = props;

  const [state, setState] = React.useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState(open);
    };

  return (
    <>
      <Button
        onClick={toggleDrawer(true)}
        startIcon={btnIcon || <ArticleIcon />}
      >
        {btnLabel}
      </Button>
      <Drawer
        anchor={anchor}
        open={state}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { backgroundColor: "#F9FAFC" },
        }}
      >
        <Box
          role="presentation"
          // onClick={toggleDrawer(false)}
          // onKeyDown={toggleDrawer(false)}
          sx={{ width: "75vw" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.25rem 1.5rem",
              backgroundColor: "#fff",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: ".5rem",
              }}
            >
              <SchoolIcon sx={{ fill: "#6B7280" }} /> {header}
            </Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <Box
            sx={{
              padding: "0.5rem 2rem",
              backgroundColor: "#F9FAFC",
            }}
          >
            {children}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

const WalkthroughContent = (props: {
  title: string | React.ReactNode;
  children?: any;
}) => {
  const { title, children } = props;
  return (
    <Box
      sx={{
        paddingTop: "1rem",
        paddingBottom: "1rem",
      }}
    >
      <Typography variant="h6" sx={{ paddingBottom: "0.5rem" }}>
        {title}
      </Typography>
      {/* <Box sx={{ paddingLeft: "1rem" }}>{children}</Box> */}
      <CommonCard>{children}</CommonCard>
    </Box>
  );
};

export const TiDBConfig = () => {
  return (
    <>
      <WalkthroughTemplate header="Connect to TiDB Cloud">
        <WalkthroughContent title="1. Create TiDB Cloud Cluster by following:">
          <Button
            size="small"
            href="https://docs.pingcap.com/tidb/dev/dev-guide-build-cluster-in-cloud"
            target="_blank"
            startIcon={<LinkIcon />}
          >
            Developer Guide
          </Button>
        </WalkthroughContent>

        <WalkthroughContent
          title={
            <>
              2. Click <InlineCode>Connect</InlineCode> button and get
              connection details from dialog:
            </>
          }
        >
          <Typography variant="body1">Such as:</Typography>
          <CodeHighlight
            lang="sh"
            content={`mysql --connect-timeout 15 -u root -h tidb.xxx.3a3ce0a0.ap-southeast-1.prod.aws.tidbcloud.com -P 4000 -p`}
          />
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/173550432-c23855e3-5176-4672-9c01-27e11aa73c5d.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
          <Typography variant="body1">
            Then we can get(for example):
            <br />- <InlineCode>TIDB_HOST</InlineCode>:
            tidb.xxx.3a3ce0a0.ap-southeast-1.prod.aws.tidbcloud.com
            <br />- <InlineCode>TIDB_PORT</InlineCode>: 4000
            <br />- <InlineCode>TIDB_USERNAME</InlineCode>: root
            <br />- <InlineCode>TIDB_PASSWORD</InlineCode>: {`<your password>`}
          </Typography>
        </WalkthroughContent>
      </WalkthroughTemplate>
    </>
  );
};

export const SnowflakeConfig = () => {
  return (
    <>
      <WalkthroughTemplate header="Connect to Snowflake(with ETLeap)">
        <WalkthroughContent
          title={
            <>
              1. Create Snowflake account(
              <a href="https://signup.snowflake.com/">snowflake.com</a>):
            </>
          }
        >
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/173524767-3383bacf-7c6e-46cc-9959-660d35ff17d9.png"
            sx={{
              maxWidth: 492,
              width: "100%",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          />
        </WalkthroughContent>

        <WalkthroughContent
          title={`2. Config version, cloud provider and region:`}
        >
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/173525174-fc608d8d-290e-4cb1-a243-a6da06603980.png"
            sx={{
              maxWidth: 492,
              width: "100%",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          />
        </WalkthroughContent>

        <WalkthroughContent
          title={`3. Get details from link in email which will automatically be sent to you after submitting:`}
        >
          <Typography variant="body1">
            Then we can get(for example):
            <br />- <InlineCode>SNOWSQL_USERNAME</InlineCode>
            <br />- <InlineCode>SNOWSQL_PASSWORD</InlineCode>
            <br />- <InlineCode>SNOWSQL_ROLE</InlineCode>:{" "}
            <InlineCode>ACCOUNTADMIN</InlineCode>
          </Typography>
        </WalkthroughContent>

        <WalkthroughContent
          title={`4. Get Snowflake URL from link in email which will automatically be sent to you after activating account:`}
        >
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/173567557-7b96277c-fdf3-4ae8-bdb7-e89c2be1bd71.png"
            sx={{
              maxWidth: 492,
              width: "100%",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          />
          <Typography variant="body1">
            Then we can get(for example):
            <br />- <InlineCode>SNOWSQL_HOST</InlineCode>:{" "}
            <InlineCode>
              GQ01328.ap-northeast-1.aws.snowflakecomputing.com
            </InlineCode>
            <br />- <InlineCode>SNOWSQL_ACCOUNT</InlineCode>:{" "}
            <InlineCode>GQ01328</InlineCode>
          </Typography>
        </WalkthroughContent>

        <WalkthroughContent title={`5. Visit snowflake manage page:`}>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/173538443-a4a4f5c5-3180-4b47-970f-3c57dffcea4f.png"
            sx={{
              width: "100%",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="6. After all settled, we can get all these data">
          <CodeHighlight
            lang="sh"
            content={`SNOWSQL_HOST=GQ01328.ap-northeast-1.aws.snowflakecomputing.com\nSNOWSQL_ACCOUNT=GQ01328\nSNOWSQL_USER=<admin username>\nSNOWSQL_ROLE=ACCOUNTADMIN\nSNOWSQL_PWD=<admin password>`}
          />
        </WalkthroughContent>
      </WalkthroughTemplate>
    </>
  );
};

export const PipelineConfig = () => {
  return (
    <>
      <WalkthroughTemplate header="ETL from TiDB to Snowflake">
        <WalkthroughContent title="1. Activate ETLeap Account:">
          <Typography variant="body1">
            {`ETLeap is Snowflake's official partner data integration service provider and can be found on the "Admin > Partner Connect" page.`}
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177075372-c460d28d-379c-4f4d-8bb7-fe705d86d225.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
          <Typography variant="body1">
            When you first time click the "Connect" button, ETLeap will create a
            new account automatically.
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/173540930-b355247d-edd0-49ff-810b-2275b34cfbed.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
          <Typography variant="body1">
            Click the "Activate" button and go to the ETLeap set up page to
            active new account.
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/173541215-15b34852-2a48-446a-8054-c4078d8cadd2.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />{" "}
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177128923-b6560943-4f62-40f8-8223-f17ac1eb10fd.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="2. Set up the destination data source">
          <Typography variant="body1">
            ETLeap will automatically create a target data source for Snowflake
            after successful activation, which is associated with the{" "}
            <InlineCode>PC_ETLEAP_DB</InlineCode> database and{" "}
            <InlineCode>PC_ETLEAP_USER</InlineCode> user by default.
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177245029-92f1d26e-8b5e-4803-9951-89171f0e82ea.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
          <Typography variant="body1">
            If the database you need to sync to is not the default database{" "}
            <InlineCode>PC_ETLEAP_DB</InlineCode>, please go to the
            **Connections** page, find the Snowflake connection and click the
            **EDIT** button to change the configuration.
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177245460-c8345513-9a3d-41ee-ad89-dba5dc7aeb22.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />

          <Typography variant="body1">
            For example, suppose we want to synchronize data to the{" "}
            <InlineCode>ECOMMERCE</InlineCode> database, the{" "}
            <InlineCode>PUBLIC</InlineCode> schema and the{" "}
            <InlineCode>COMPUTE_WH</InlineCode> virtual data warehouse.
          </Typography>

          <Typography variant="body1">
            We can execute the following SQL on Snowflake to grant users with
            the <InlineCode>PC_ETLEAP_ROLE</InlineCode> role access to this
            database.
          </Typography>

          <CodeHighlight
            lang="sql"
            content={`GRANT ALL PRIVILEGES ON DATABASE "ECOMMERCE" TO ROLE PC_ETLEAP_ROLE;\nUSE ECOMMERCE;\nGRANT ALL PRIVILEGES ON SCHEMA "PUBLIC" TO ROLE PC_ETLEAP_ROLE;\nGRANT ALL PRIVILEGES ON WAREHOUSE COMPUTE_WH TO ROLE PC_ETLEAP_ROLE;`}
          />

          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177258830-abf495d7-2c36-4335-b469-3204cdec6947.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177259629-a9c07085-4715-4cbb-945a-85793134d88d.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
          <Typography variant="body1">
            After this, we can set this database and schema to the Snowflake
            data source configuration in ETLeap. Click "Validate and Save
            Changes" button to verify the connection.
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177246990-53deaad8-e76f-4c5a-8fe2-ba98a8d33036.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="3.1 Create source - Select MySQL as connector">
          <Typography variant="body1">
            Since TiDB is compatible with the MySQL protocol, we can use the
            MySQL connector to connect it.
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177104261-2ff4ca7f-a82f-4a62-8925-7e7e16f5d9ea.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="3.2 Select the connection method">
          <Typography variant="body1">
            In this demo, we can select the <InlineCode>DIRECT</InlineCode>{" "}
            connection mode and add the IP address of the ETLeap server as the
            trusted IP address of TiDB Cloud.
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177135191-01d999c3-40a4-4b4a-9035-716189fd23cb.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177240458-c1133912-ed6d-4195-8b38-f064721662bd.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
          <Typography variant="body1">
            For convenience, we can also add <InlineCode>0.0.0.0/0</InlineCode>{" "}
            as a trusted IP address to allow access to all IPs. (**Only for
            test**)
          </Typography>
        </WalkthroughContent>

        <WalkthroughContent title="3.3 Config connection information">
          <Typography variant="body1">
            - Input the TiDB host and port
          </Typography>
          <Typography variant="body1">
            - Cancel the "Validate SSL Certificate" checkbox
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177241029-d88a2f89-2480-44f5-b4a0-373b0bc9ffad.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="3.4 Select the database name">
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177243696-3666d4b8-cc92-439a-8b98-57734cdeba0a.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="3.5 Additional properties">
          <Typography variant="body1">
            Do not select the "Enable Change Data Capture (CDC)" option, because
            TiDB does not use the MySQL binlogs format.
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177244068-09398579-9e98-4495-90ac-dc545e0ad6f8.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="4.1 Create Pipeline - Select the database tables that need to be synchronized">
          <Typography variant="body1">
            Here we need to select the <InlineCode>orders</InlineCode> and{" "}
            <InlineCode>items</InlineCode> database tables to sync to Snowflake.
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177244613-d505ac04-b8f7-4f4f-a764-87a53c5a05f1.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="4.2 Select which schema you need to sync your data to on Snowflake.">
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177260995-5c91978d-7cec-41d3-ae79-654803e674ef.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="4.3 Click the **EDIT SETTING** button to go to the advanced settings page.">
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177261092-55622961-d215-4f35-afa9-0dda1d54ee18.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="4.4 Setting Primary Key and Update timestamp ">
          <Typography variant="body1">
            You can set the **Primary key** and **Update timestamp** for each
            table here. ETLeap will use the **Primary key** as a unique
            identifier for the data rows to determine whether to append or
            update when loading a piece of data. It also determines whether a
            row should be updated based on whether the **Update timestamp** has
            changed.
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177261503-975b1525-b0bb-4779-9e36-692752e91442.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="4.5 We can set the create_time column to Clustering Keys">
          <Typography variant="body1">
            Refer to:{" "}
            <a
              href="https://docs.snowflake.com/en/user-guide/tables-clustering-keys.html"
              target="_blank"
            >
              Clustering Keys
            </a>
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177261699-4ed88c6a-c76b-4a2c-9dce-e3e5420a4a4f.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="4.6 START ETL'ING">
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177261883-6ceec980-844a-4b23-be2f-c467295023c0.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="5. Just waiting for ETleap to finish its work">
          <Typography variant="body1">
            After the pipeline is created, we can go back to the Dashboard page
            to observe the progress of the pipeline execution.
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177262417-dcec3405-1985-4460-b455-8fc05b47a6a8.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
          <Typography variant="body1">
            ETLeap synchronizes data from TiDB to Snowflake in batches,
            following steps of extraction, transformation, and loading.
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177262601-fb6d03ae-8ad7-4fe7-a6bb-215b78f4802a.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
          <Typography variant="body1">
            In addition to full sync, we can also set how often pipeline
            performs incremental syncs on the **SCHEDULES** page.
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/177264221-1af3e611-16e3-4511-be2c-4f128781efe0.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="6. Verify synchronization results">
          <Typography variant="body1">
            Back in our Snowflake dashboard, we can see the data table
            information on the **Data** page and confirm that the data has been
            synchronized by looking at the number of rows of data in the **Data
            Preview**.
          </Typography>
        </WalkthroughContent>
      </WalkthroughTemplate>
    </>
  );
};

export const CreateSchema = (porps: { data: TableRowType[] }) => {
  return (
    <WalkthroughTemplate
      header="Tables"
      btnLabel="Show Table"
      btnIcon={<TableViewIcon />}
    >
      <SchemaTable data={porps.data} />
    </WalkthroughTemplate>
  );
};
