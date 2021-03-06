import PropTypes from "prop-types";
import { useRouter } from "next/router";
// import styled from "@emotion/styled";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import GitHubIcon from "@mui/icons-material/GitHub";

import { Bell as BellIcon } from "icons/Bell";
import { GITHUB_REPO_URL } from "const";

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

export const DashboardNavbar = (props: {
  [x: string]: any;
  onSidebarOpen: any;
  endpoint?: string;
}) => {
  const { onSidebarOpen, endpoint, ...other } = props;

  const router = useRouter();

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280,
          },
          width: {
            lg: "calc(100% - 280px)",
          },
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: "inline-flex",
                lg: "none",
              },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>

          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
            sx={{ mb: 0 }}
          >
            {`Endpoint: ${endpoint}`}
          </Typography>
          <IconButton
            onClick={() => {
              router.push(`/?endpoint=${endpoint}`);
            }}
            sx={{ ml: 1 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          {/* <Tooltip title="Search">
            <IconButton sx={{ ml: 1 }}>
              <SearchIcon fontSize="small" />
            </IconButton>
          </Tooltip> */}
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Github Link">
            <IconButton sx={{ ml: 1 }} href={GITHUB_REPO_URL} target="_blank">
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func,
};
