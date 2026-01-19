import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import LandingAppBar from "../components/LandingAppBar";
import LandingFooter from "../components/LandingFooter";

const PublicAppBarLayout = () => {
  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <LandingAppBar />

      <Outlet />

      <LandingFooter />
    </Box>
  );
};

export default PublicAppBarLayout;
