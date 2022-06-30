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

        <WalkthroughContent
          title={
            <>
              6. Choose <InlineCode>Admin</InlineCode> {` > `}
              <InlineCode>Partner Connect</InlineCode> on left navigation, then
              choose <InlineCode>ETLeap</InlineCode>
            </>
          }
        >
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/173540263-70c34974-31f9-466c-bd4d-3c9845b1fc41.png"
            sx={{
              width: "100%",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          />
        </WalkthroughContent>

        <WalkthroughContent
          title={
            <>
              7. Click <InlineCode>Connect</InlineCode>
            </>
          }
        >
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/173540930-b355247d-edd0-49ff-810b-2275b34cfbed.png"
            sx={{
              width: "100%",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          />
          <Typography variant="body1">
            Then we can get(for example):
            <br />- <InlineCode>SNOWSQL_DATABASE</InlineCode>:{" "}
            <InlineCode>PC_ETLEAP_DB</InlineCode>
            <br />- <InlineCode>SNOWSQL_WAREHOUSE</InlineCode>:{" "}
            <InlineCode>PC_ETLEAP_WH</InlineCode>
            <br />- <InlineCode>SNOWSQL_SCHEMA</InlineCode>:{" "}
            <InlineCode>PUBLIC</InlineCode>
          </Typography>
        </WalkthroughContent>

        <WalkthroughContent
          title={
            <>
              8. Active <InlineCode>ETLeap</InlineCode>
            </>
          }
        >
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/173541215-15b34852-2a48-446a-8054-c4078d8cadd2.png"
            sx={{
              width: "100%",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          />
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/173542047-c0f7970e-462f-4115-8c4f-13d01cb719f7.png"
            sx={{
              width: "100%",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="9. After all settled, we can get all these data">
          <CodeHighlight
            lang="sh"
            content={`SNOWSQL_HOST=GQ01328.ap-northeast-1.aws.snowflakecomputing.com\nSNOWSQL_ACCOUNT=GQ01328\nSNOWSQL_WAREHOUSE=PC_ETLEAP_WH\nSNOWSQL_DATABASE=PC_ETLEAP_DB\nSNOWSQL_SCHEMA=PUBLIC\nSNOWSQL_USER=<admin username>\nSNOWSQL_ROLE=ACCOUNTADMIN\nSNOWSQL_PWD=<admin password>`}
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
        <WalkthroughContent title="1. Choose ETLeap Card:">
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/56986964/176418692-6b93e8bc-f138-4b77-bcd8-6c4eb9a4b767.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="2. Launch ETLeap:">
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/56986964/176419016-0ca3a5e4-2ba9-4bd6-b352-9e1ddee128c2.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="3. Create Etleap Integration:">
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/56986964/176426006-10fcf420-c9c2-46ee-8ff6-ae8402a1a456.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="4. Choose MySQL as Integration type:">
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/56986964/176426346-aa1a7565-8758-476e-b8e3-e3c31053de9b.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="5. Configure Integration:">
          <Typography variant="body1">
            On Step 3, input correct TiDB Cloud address and port. Do rememeber
            to cancel "Validate SSL Certificate"
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/56986964/176426719-89590bce-27f6-414c-a96a-7ef3dc1d9a15.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
          <Typography variant="body1">
            Step 4. Input the TiDB user and password as same as the one used in
            initial page.
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/56986964/176427150-ea8cc6ea-ed86-45a5-88f0-9c90702251a6.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
          <Typography variant="body1">
            Step 5. Input the same TiDB database name as the one used in initial
            page.
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/56986964/176427430-2dd0f6d3-2a0c-46e6-b55f-392924181dc4.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="6. Choose tables to be imported:">
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/56986964/176427975-3874dbeb-dc83-4ebe-b183-3fbbe52271be.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="7. Choose destination:">
          <Typography variant="body1">
            By default, you should choose the schema "PUBLIC".
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/56986964/176428753-72f1d2a1-ffe2-44a4-8f52-15430f0fc75b.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />

          <Typography variant="body1">
            If you did't use the default schema on initial page, you should
            grant privilege manually on snowflake. Otherwise you can not choose
            the one you want.
          </Typography>
          <Typography variant="body1">Create a worksheet.</Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/56986964/176429693-8b933379-7ff8-407b-9b2b-65788be386a3.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
          <Typography variant="body1">
            Choose the schema you want to use in ETLeap, then input and run:
          </Typography>
          <InlineCode>
            GRANT ALL PRIVILEGES ON SCHEMA "ECOMMERCE" TO ROLE PC_ETLEAP_ROLE;
          </InlineCode>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/56986964/176430074-dc24cebb-2ca6-463f-b740-8f0874b7ad0e.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
          <Typography variant="body1">
            Go back to ETLeap page and click "Refresh Schema List".
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/56986964/176430547-fc2c40b6-0ee1-49d6-9f61-27058a20d821.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="8. Edit settings:">
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/56986964/176430806-6414e3c1-2cab-4f7e-9027-9f033a8c1562.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/56986964/176430972-edcbe1a1-3688-450e-bc50-a3ea98a2ef5c.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
          <Typography variant="body1">
            Add column <InlineCode>create_time</InlineCode>
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/56986964/176431081-a008d000-0cad-457c-8518-495e9e793d77.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="9. Start ETLing:">
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/56986964/176431397-17e59468-1404-4bdf-9c3a-fb4c93dab74f.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
        </WalkthroughContent>

        <WalkthroughContent title="10. Check status:">
          <Typography variant="body1">
            You can check status on home page. And wait for all jobs finished.
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/56986964/176431690-969b76d8-aab4-4caf-a5ab-6e1a29f8c6d9.png"
            sx={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}
          />
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
