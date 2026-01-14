import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  Link,
  Container,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
  Paper,
  Grid,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import {
  FaXTwitter,
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaPhone,
  FaEnvelope,
  FaBars,
} from "react-icons/fa6";
import {
  AiOutlineWarning,
  AiOutlineCloud,
  AiOutlineLineChart,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { FiTool, FiUsers } from "react-icons/fi";
import { MdDevices } from "react-icons/md";

// Note: Replace these with your actual local imports
import LOGO from "../../assets/logo/CADer logo-loader.png";

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

// --- Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      elevation={scrolled ? 2 : 0}
      sx={{
        bgcolor: scrolled ? "rgba(255, 255, 255, 0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        transition: "all 0.3s ease",
        borderBottom: scrolled ? "1px solid #e0e0e0" : "none",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <img src={LOGO} alt="CADer" style={{ height: 40 }} />
          <Stack
            direction="row"
            spacing={4}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {["Features", "Training", "About", "Contact"].map((item) => (
              <Link
                key={item}
                href="#"
                underline="none"
                sx={{
                  color: "#1e293b",
                  fontWeight: 500,
                  "&:hover": { color: "#ef4444" },
                }}
              >
                {item}
              </Link>
            ))}
          </Stack>
          <Button
            variant="contained"
            sx={{ bgcolor: "#ef4444", borderRadius: "8px", px: 3 }}
          >
            Login
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <Box sx={{ bgcolor: "#ffffff" }}>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 15, md: 20 },
          pb: 10,
          background:
            "radial-gradient(circle at 90% 10%, #fff1f2 0%, #ffffff 50%)",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <MotionBox
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <MotionTypography
                  variants={fadeInUp}
                  variant="overline"
                  sx={{ color: "#ef4444", fontWeight: 700, letterSpacing: 2 }}
                >
                  REVOLUTIONIZING SURVEYING
                </MotionTypography>
                <MotionTypography
                  variants={fadeInUp}
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.5rem", md: "4rem" },
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1.1,
                    mb: 3,
                  }}
                >
                  Construction Survey <br />
                  <span style={{ color: "#ef4444" }}>Made Easy</span>
                </MotionTypography>
                <MotionTypography
                  variants={fadeInUp}
                  sx={{
                    fontSize: "1.2rem",
                    color: "#64748b",
                    mb: 4,
                    maxWidth: "500px",
                  }}
                >
                  The ultimate tool for Roads & Waterways. Reduce on-site time
                  by 40% with zero-error field book generation.
                </MotionTypography>
                <MotionBox variants={fadeInUp}>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        bgcolor: "#ef4444",
                        py: 2,
                        px: 4,
                        fontSize: "1rem",
                      }}
                    >
                      Get Started Free
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        color: "#1e293b",
                        borderColor: "#e2e8f0",
                        py: 2,
                        px: 4,
                      }}
                    >
                      Watch Demo
                    </Button>
                  </Stack>
                </MotionBox>
              </MotionBox>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <MotionBox
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                sx={{ width: "100%", position: "relative" }}
              >
                <Paper
                  elevation={20}
                  sx={{ p: 2, borderRadius: 4, bgcolor: "#f8fafc" }}
                >
                  {/* Replace with CADER_EQUIPMENT image */}
                  <Box
                    component="img"
                    src="https://via.placeholder.com/400x500"
                    sx={{ width: "100%", borderRadius: 2 }}
                  />
                </Paper>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Grid */}
      <Box sx={{ py: 12, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Why Choose CADer?
            </Typography>
            <Typography color="text.secondary">
              Industry-leading features built for modern engineers.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {[
              {
                icon: <AiOutlineWarning />,
                title: "Zero Error",
                desc: "Instant field book generation without manual calculation mistakes.",
              },
              {
                icon: <FiTool />,
                title: "Instant Calibration",
                desc: "Check autolevel calibration on the fly, right from your device.",
              },
              {
                icon: <AiOutlineCloud />,
                title: "Cloud Sync",
                desc: "Your data is always safe and accessible across all your devices.",
              },
              {
                icon: <MdDevices />,
                title: "Multi-Platform",
                desc: "Works seamlessly on Mobile, Tablet, and Desktop browsers.",
              },
              {
                icon: <FiUsers />,
                title: "Collaboration",
                desc: "Share projects with your team and review surveys in real-time.",
              },
              {
                icon: <AiOutlineLineChart />,
                title: "1-Click Quantities",
                desc: "Automated graph plotting and volume calculations.",
              },
            ].map((f, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <MotionBox
                  whileHover={{ y: -10 }}
                  sx={{
                    p: 4,
                    bgcolor: "white",
                    borderRadius: 4,
                    height: "100%",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Box sx={{ color: "#ef4444", fontSize: "2.5rem", mb: 2 }}>
                    {f.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {f.desc}
                  </Typography>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Training Section */}
      <Container maxWidth="lg" sx={{ py: 15 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src="https://via.placeholder.com/600x400"
              sx={{
                width: "100%",
                borderRadius: 8,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
              CADer <span style={{ color: "#ef4444" }}>Training Program</span>
            </Typography>
            <Typography sx={{ mb: 4, color: "#475569", fontSize: "1.1rem" }}>
              Equip your students with the skills needed for the modern job
              market. Our 10-day intensive program is designed for institutions.
            </Typography>
            <Stack spacing={2} sx={{ mb: 4 }}>
              {[
                "6 Months Free Software Access",
                "Up to 20% Increase in Pay Scale",
                "Official Certification",
                "On-site & Remote Training Options",
              ].map((text) => (
                <Stack
                  key={text}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: "#ef4444",
                      borderRadius: "50%",
                    }}
                  />
                  <Typography sx={{ fontWeight: 500 }}>{text}</Typography>
                </Stack>
              ))}
            </Stack>
            <Button
              variant="contained"
              size="large"
              sx={{ bgcolor: "#0f172a", px: 6 }}
            >
              Enroll Institution
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: "#0f172a", color: "white", pt: 10, pb: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            <Grid size={{ xs: 12, md: 4 }}>
              <img
                src={LOGO}
                alt="CADer"
                style={{
                  height: 40,
                  filter: "brightness(0) invert(1)",
                  marginBottom: "24px",
                }}
              />
              <Typography sx={{ color: "#94a3b8", mb: 4 }}>
                CADer simplifies autolevel surveying, reducing on-site time by
                40% while ensuring accurate, error-free calculations.
              </Typography>
              <Stack direction="row" spacing={2}>
                {[FaXTwitter, FaInstagram, FaLinkedin, FaFacebook].map(
                  (Icon, i) => (
                    <IconButton
                      key={i}
                      sx={{
                        color: "white",
                        bgcolor: "rgba(255,255,255,0.05)",
                        "&:hover": { bgcolor: "#ef4444" },
                      }}
                    >
                      <Icon size={20} />
                    </IconButton>
                  )
                )}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={4}>
                {["Product", "Resources", "Company"].map((cat) => (
                  <Grid size={{ xs: 6, sm: 4 }} key={cat}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                      {cat}
                    </Typography>
                    <Stack spacing={2}>
                      {["Link One", "Link Two", "Link Three"].map((link) => (
                        <Link
                          key={link}
                          href="#"
                          sx={{
                            color: "#94a3b8",
                            textDecoration: "none",
                            "&:hover": { color: "white" },
                          }}
                        >
                          {link}
                        </Link>
                      ))}
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 6, borderColor: "rgba(255,255,255,0.1)" }} />

          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={4}
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
              <Typography
                variant="body2"
                sx={{
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <FaPhone size={14} /> +91 79944 19955
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <FaEnvelope size={14} /> admin@getcader.com
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              © 2026 CADer. Professional Surveying Solutions.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
