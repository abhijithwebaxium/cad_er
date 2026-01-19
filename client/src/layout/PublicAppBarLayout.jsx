import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import LandingAppBar from "../components/LandingAppBar";
import LandingFooter from "../components/LandingFooter";
import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";

const PublicAppBarLayout = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <LandingAppBar />

      <Outlet />

      <LandingFooter />
    </Box>
  );
};

export default PublicAppBarLayout;
