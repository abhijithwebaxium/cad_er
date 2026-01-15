import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Grid,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";

import { FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import CADER_EQUIPMENT from "../../assets/cader_equipment.png";
import { Link } from "react-router-dom";

const MotionButton = motion.create(Button);

const PulseDot = () => (
  <Box
    component={motion.span}
    sx={{
      width: 8,
      height: 8,
      borderRadius: "50%",
      bgcolor: "primary.main",
      display: "inline-block",
      mr: 1,
    }}
    animate={{
      scale: [1, 1.5, 1],
      opacity: [1, 0.5, 1],
    }}
    transition={{
      duration: 1.2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// --- Custom SVG Icons to avoid external resolution issues ---

const SocialIcons = {
  LinkedIn: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Twitter: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  ),
  Github: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
};

const MenuIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Social Icons
const XTwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// --- Theme Configuration ---
const theme = createTheme({
  palette: {
    primary: { main: "#6366f1" }, // Indigo
    secondary: { main: "#000000" }, // Black
    background: { default: "#ffffff" },
    text: {
      primary: "#000000",
      secondary: "#4b5563",
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", sans-serif',
    h1: { fontWeight: 900, letterSpacing: "-0.02em" },
    h2: { fontWeight: 800, letterSpacing: "-0.01em" },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 24px",
        },
        containedPrimary: {
          boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
          "&:hover": {
            boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.4)",
          },
        },
      },
    },
  },
});

const NAV_ITEMS = ["Product", "Calculators", "Roads", "Pricing"];
const GRID_PATTERN =
  "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

const fUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const float = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
  },
};

const App = () => {
  const muiTheme = useTheme();
  const isMdDown = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Navigation */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #f3f4f6",
          zIndex: 1100,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="h6"
                color="secondary"
                sx={{ fontWeight: 900, fontSize: "1.4rem", cursor: "pointer" }}
              >
                CAD<span style={{ color: "#6366f1" }}>er.</span>
              </Typography>
            </Stack>

            {/* Desktop Menu */}
            {!isMdDown && (
              <Stack direction="row" spacing={1}>
                {NAV_ITEMS.map((item) => (
                  <Button
                    key={item}
                    color="inherit"
                    sx={{
                      color: "text.secondary",
                      "&:hover": {
                        color: "primary.main",
                        bgcolor: "rgba(99, 102, 241, 0.05)",
                      },
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Stack>
            )}

            <Stack direction="row" spacing={1} alignItems="center">
              {!isMdDown && <Button color="secondary">Sign In</Button>}

              {/* Mobile Menu Toggle */}
              {isMdDown && (
                <IconButton
                  color="secondary"
                  onClick={handleDrawerToggle}
                  edge="end"
                  sx={{ ml: 1 }}
                >
                  <MenuIcon size={24} />
                </IconButton>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        slotProps={{
          sx: { width: "280px", p: 2 },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon size={24} />
          </IconButton>
        </Box>
        <List>
          {NAV_ITEMS.map((item) => (
            <ListItem key={item} disablePadding>
              <ListItemButton
                onClick={handleDrawerToggle}
                sx={{ borderRadius: 2 }}
              >
                <ListItemText
                  primary={item}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          <Divider sx={{ my: 2 }} />
          <ListItem disablePadding>
            <ListItemButton
              sx={{ borderRadius: 2, bgcolor: "rgba(0,0,0,0.05)" }}
            >
              <ListItemText primary="Sign In" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          pt: { xs: 6, md: 12 },
          pb: { xs: 8, md: 12 },
          overflow: "hidden",
          backgroundImage: `url("${GRID_PATTERN}")`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.15 } },
                }}
              >
                <motion.div variants={fUp}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      px: 2,
                      py: 0.5,
                      mb: 3,
                      borderRadius: 10,
                      bgcolor: "rgba(99, 102, 241, 0.1)",
                      border: "1px solid rgba(99, 102, 241, 0.2)",
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <PulseDot />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "primary.main",
                          fontWeight: 700,
                          letterSpacing: 1,
                        }}
                      >
                        v2.4 is live
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>

                <motion.div variants={fUp}>
                  <Typography
                    variant="h1"
                    gutterBottom
                    sx={{
                      fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                    }}
                  >
                    Construction Survey <br />
                    <Box component="span" sx={{ color: "primary.main" }}>
                      Made Easy .
                    </Box>
                  </Typography>
                </motion.div>

                <motion.div variants={fUp}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      fontSize: "1.1rem",
                      mb: 4,
                      maxWidth: 540,
                    }}
                  >
                    Automate road cross-sections, waterway contours, and volume
                    calculations with CAD-integrated tools that eliminate human
                    error.
                  </Typography>
                </motion.div>

                <motion.div variants={fUp}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <MotionButton
                      variant="contained"
                      size="large"
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                      variants={{
                        rest: { paddingRight: 32 },
                        hover: { paddingRight: 56 },
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                      sx={{
                        py: 1.5,
                        px: 4,
                        overflow: "hidden",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <span>Get Started</span>

                      <motion.span
                        variants={{
                          rest: { x: -10, opacity: 0 },
                          hover: { x: 0, opacity: 1 },
                        }}
                        transition={{ duration: 0.25 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: "white",
                          position: "relative",
                        }}
                      >
                        <FaArrowRight
                          size={16}
                          style={{ position: "absolute" }}
                        />
                      </motion.span>
                    </MotionButton>

                    <Button
                      variant="outlined"
                      color="secondary"
                      size="large"
                      sx={{ py: 1.5, px: 4 }}
                    >
                      Watch Demo
                    </Button>
                  </Stack>
                </motion.div>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    background:
                      "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
                    zIndex: -1,
                    filter: "blur(40px)",
                  }}
                />

                <motion.div {...float}>
                  <img
                    src={CADER_EQUIPMENT}
                    alt="equipment"
                    style={{
                      width: "300px",
                      zIndex: 1,
                    }}
                  />
                </motion.div>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Feature Highlights */}
      <Box sx={{ py: 8, bgcolor: "#000" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {[
              {
                title: "Road Networks",
                desc: "Automated L-section and X-section generation.",
              },
              {
                title: "Waterways",
                desc: "Complex contour mapping for hydraulic studies.",
              },
              {
                title: "Cloud Sync",
                desc: "Sync field data to the office in real-time.",
              },
            ].map((f, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Box
                  sx={{
                    color: "white",
                    p: 4,
                    height: "100%",
                    borderLeft: "2px solid #6366f1",
                    transition: "all 0.3s",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.03)",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 800 }}
                  >
                    {f.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}
                  >
                    {f.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      {/* Footer Section */}
      <Box sx={{ bgcolor: "#f9fafb", py: 8, borderTop: "1px solid #f3f4f6" }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }}>
            {/* Logo + Description */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h6"
                color="secondary"
                sx={{ fontWeight: 900, mb: 1 }}
              >
                CAD
                <Box component="span" sx={{ color: "primary.main" }}>
                  er.
                </Box>
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 400, lineHeight: 1.7 }}
              >
                CADer simplifies autolevel surveying, reducing on-site time by
                40% while ensuring accurate, error-free calculations for
                professionals.
              </Typography>
              <Stack
                direction="row"
                spacing={1.5}
                mt={2}
                justifyContent="start"
                className="social-stack"
                sx={{
                  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                {[
                  <SocialIcons.Twitter />,
                  <SocialIcons.LinkedIn />,
                  <SocialIcons.Github />,
                ].map((icon, i) => (
                  <IconButton
                    key={i}
                    size="medium"
                    component={motion.button}
                    whileHover={{ scale: 1.2, rotate: 8, color: "#6366f1" }}
                    whileTap={{ scale: 0.9 }}
                    sx={{
                      color: "#94a3b8",
                      bgcolor: "#f8fafc",
                      transition: "color 0.2s",
                      "&:hover": { bgcolor: "#eef2ff" },
                    }}
                  >
                    {icon}
                  </IconButton>
                ))}
              </Stack>
            </Grid>

            {/* Links Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={4}>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="text.primary"
                    gutterBottom
                  >
                    Product
                  </Typography>
                  <Stack spacing={1.5}>
                    <Link href="#" fontSize={14} color="text.secondary">
                      Features
                    </Link>
                    <Link href="#" fontSize={14} color="text.secondary">
                      Pricing
                    </Link>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="text.primary"
                    gutterBottom
                  >
                    Resources
                  </Typography>
                  <Stack spacing={1.5}>
                    <Link href="#" fontSize={14} color="text.secondary">
                      Documentation
                    </Link>
                    <Link href="#" fontSize={14} color="text.secondary">
                      Tutorials
                    </Link>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="text.primary"
                    gutterBottom
                  >
                    Company
                  </Typography>
                  <Stack spacing={1.5}>
                    <Link href="#" fontSize={14} color="text.secondary">
                      About
                    </Link>
                    <Link href="#" fontSize={14} color="text.secondary">
                      Careers
                    </Link>
                    <Link href="#" fontSize={14} color="text.secondary">
                      Placements
                    </Link>
                    <Link href="#" fontSize={14} color="text.secondary">
                      Our Team
                    </Link>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 6, borderColor: "#e5e7eb" }} />

          {/* Contact Row */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            {[
              { label: "+91 79944 19955", type: "tel" },
              { label: "+91 79944 39955", type: "tel" },
              { label: "+91 79944 69955", type: "tel" },
              { label: "admin@getcader.com", type: "mailto" },
            ].map((contact, idx) => (
              <Stack direction="row" spacing={1} alignItems="center" key={idx}>
                <Typography variant="body2" color="text.secondary">
                  {contact.type === "tel" ? "📞" : "✉"}
                </Typography>
                <Link
                  href={`${contact.type}:${contact.label.replace(/\s/g, "")}`}
                  fontSize={14}
                  fontWeight={500}
                  color="text.primary"
                >
                  {contact.label}
                </Link>
              </Stack>
            ))}
          </Stack>

          <Divider sx={{ my: 6, borderColor: "#e5e7eb" }} />

          {/* Bottom Section */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "center", sm: "center" }}
            spacing={2}
          >
            <Typography variant="caption" color="text.disabled">
              © 2025 CADer Engineering Solutions. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Link href="#" variant="caption" color="text.disabled">
                Privacy Policy
              </Link>
              <Link href="#" variant="caption" color="text.disabled">
                Terms of Service
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
