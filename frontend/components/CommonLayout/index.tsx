import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";

import { DashboardNavbar } from "./Navbar";
import { DashboardSidebar } from "./SideBar";
import { getLocalStorageEndpoint } from "../../lib";

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: 64,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 280,
  },
}));

export const DashboardLayout = (props: {
  children: any;
  showSideBar?: boolean;
}) => {
  const { children, showSideBar = true } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [endpointVal, setEndpointVal] = useState("");

  const router = useRouter();

  useEffect(() => {
    const endpoint = getLocalStorageEndpoint();
    if (!endpoint) {
      router.push(`/init`);
    } else {
      setEndpointVal(endpoint);
    }
  });

  return (
    <>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            width: "100%",
            padding: "4rem 1.5rem",
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar
        onSidebarOpen={() => setSidebarOpen(true)}
        endpoint={endpointVal}
      />
      {showSideBar && (
        <DashboardSidebar
          onClose={() => setSidebarOpen(false)}
          open={isSidebarOpen}
        />
      )}
    </>
  );
};
