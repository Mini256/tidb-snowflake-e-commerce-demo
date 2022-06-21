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
import { Container, IconButton, Typography } from "@mui/material";

import { InlineCode, CodeHighlight } from "../Block/CodeBlock";

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
      <Drawer anchor={anchor} open={state} onClose={toggleDrawer(false)}>
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
              padding: "0.25rem 0.5rem",
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
          <Box sx={{ padding: "0.5rem" }}>{children}</Box>
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
      <Box sx={{ paddingLeft: "1rem" }}>{children}</Box>
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

        {/* <WalkthroughContent title="10. Create data pipeline from Snowflake to TiDB">
          <Typography variant="body1">
            After ETLeap account activated, ETLeap will create a database{" "}
            <InlineCode>PC_ETLEAP_DB</InlineCode> on Snowflake, and config
            connection automatically。
          </Typography>
          <Typography
            component="img"
            src="https://user-images.githubusercontent.com/5086433/173547399-541060c6-ca6b-431a-8cca-0fdc4996d303.png"
            sx={{
              width: "100%",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          />
          <Typography variant="body1">You can follow this guide:</Typography>
          <Typography
            component="video"
            src="https://user-images.githubusercontent.com/55385323/172923035-6327f6ff-f141-4c48-ba87-56a1ddbce6d7.mp4"
            // autoPlay
            // loop
            muted
            controls
            sx={{
              width: "100%",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          />
        </WalkthroughContent> */}
      </WalkthroughTemplate>
    </>
  );
};
