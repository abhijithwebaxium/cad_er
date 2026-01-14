import { Box, Stack, Typography } from "@mui/material";
import Sidebar from "../../../components/Sidebar";
import ImageAvatars from "../../../components/ImageAvatar";
import BackgroundImage from "../../../assets/background-img.png";
import logo from "../../../assets/logo/CADer logo-main.png";

const CompanyDashboard = ({ user }) => {
  return (
    <Stack spacing={2} sx={{ userSelect: "none" }} overflow={"hidden"}>
      <Stack
        p={2}
        height={"155px"}
        sx={{
          position: "relative",
          background:
            "linear-gradient(217.64deg, #0A3BAF -5.84%, #0025A0 106.73%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: "200%",
            backgroundPosition: "center",
            opacity: 0.25,
            zIndex: 0,
            height: "60dvh",
            minHeight: "165px",
            width: "100%",
          }}
        ></div>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          color="white"
          zIndex={2}
        >
          <img src={logo} alt="CADer" style={{ width: "65px" }} />

          <Sidebar />
        </Box>

        <Stack direction={"row"} alignItems={"center"} spacing={1} mt={2}>
          <ImageAvatars
            sx={{
              width: "48px",
              height: "48px",
              backgroundColor: "#fff",
              color: "rgba(40, 151, 255, 1)",
              "& .css-1mo2pzk-MuiSvgIcon-root-MuiAvatar-fallback": {
                width: "60%",
                height: "60%",
              },
            }}
          />

          <Box color="white">
            <Typography fontWeight={700} fontSize="14px">
              Hello,
            </Typography>
            <Typography fontWeight={700} fontSize="14px">
              {user.name}
            </Typography>
          </Box>
        </Stack>
      </Stack>
      <Box className="overlapping-header"></Box>
    </Stack>
  );
};

export default CompanyDashboard;
