import * as Yup from "yup";
import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Grid,
  Paper,
  TextField,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";

import Lenis from "@studio-freight/lenis";
import { FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TrainingCard from "./components/TrainingCard";
import Preloader from "./components/Preloader";
import ValidateCertificate from "../../components/ValidateCertificate";
import AlertDialogSlide from "../../components/AlertDialogSlide";
import { useDispatch } from "react-redux";
import { contactForm } from "../../services/indexServices";
import { handleFormError } from "../../utils/handleFormError";
import { showAlert } from "../../redux/alertSlice";
import LandingAppBar from "../../components/LandingAppBar";
import LandingFooter from "../../components/LandingFooter";

const MotionButton = motion.create(Button);
const MotionStack = motion.create(Stack);

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

const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const slowFadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const ClockIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const AwardIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 15l-2 5L12 18l2 2-2-5z" />
    <circle cx="12" cy="9" r="7" />
  </svg>
);
const WalletIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M7 15h0M2 9.5h20" />
  </svg>
);
const TrendingIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const CheckCircle = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#6366f1"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const features = [
  {
    icon: (
      <svg
        width="42"
        height="42"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    text: "Instant zero error field book generation",
  },
  {
    icon: (
      <svg
        width="42"
        height="42"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    text: "Provision to check calibration of autolevel instantly",
  },
  {
    icon: (
      <svg
        width="42"
        height="42"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
    text: "Cloud storage and multi-user",
  },
  {
    icon: (
      <svg
        width="42"
        height="42"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="4" width="16" height="12" rx="2" />
        <line x1="12" y1="20" x2="12" y2="20" />
        <line x1="8" y1="20" x2="16" y2="20" />
      </svg>
    ),
    text: "Use anywhere: Mobile, Tablet, Laptop",
  },
  {
    icon: (
      <svg
        width="42"
        height="42"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    text: "Collaboration options",
  },
  {
    icon: (
      <svg
        width="42"
        height="42"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
      </svg>
    ),
    text: "1-click graph and quantity calculation",
  },
];

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

const CustomInput = ({
  label,
  placeholder,
  type = "text",
  onChange,
  ...rest
}) => (
  <Box sx={{ width: "100%" }}>
    <Typography
      sx={{
        color: "white",
        mb: 1,
        fontSize: "0.85rem",
        fontWeight: 600,
        opacity: 0.9,
      }}
    >
      {label}
    </Typography>
    <TextField
      fullWidth
      placeholder={placeholder}
      variant="outlined"
      onChange={onChange}
      type={type}
      {...rest}
      sx={{
        bgcolor: "rgba(255,255,255,0.08)",
        borderRadius: 2,
        "& .MuiOutlinedInput-root": {
          color: "white",
          height: "56px",
          "& fieldset": {
            borderColor: "rgba(255,255,255,0.2)",
            borderRadius: "12px",
          },
          "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
          "&.Mui-focused fieldset": { borderColor: "white" },
        },
      }}
    />
  </Box>
);

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  message: Yup.string().required("Message is required"),
});

const initialFormValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const Landing = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [openValidateCert, setOpenValidateCert] = useState(false);
  const [loading, setLoading] = useState(() => {
    const hasSeenPreloader = sessionStorage.getItem("hasSeenPreloader");
    return !hasSeenPreloader;
  });

  // Constants for the marquee
  const cardWidth = 320;
  const gap = 32;
  const totalWidthOfOneSet = (cardWidth + gap) * features.length;

  // We use 3 sets to ensure the screen is always filled during transition
  const tripleFeatures = [...features, ...features, ...features];

  const checkCertAlertData = {
    title: "Validate Certificate",
    description: "Please enter the certificate ID to validate",
    content: (
      <ValidateCertificate onCancel={() => setOpenValidateCert(false)} />
    ),
  };

  const [formValues, setFormValues] = useState(initialFormValues);

  const [formErrors, setFormErrors] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = async (event) => {
    const { name, value } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    try {
      await Yup.reach(schema, name).validate(value);

      setFormErrors({ ...formErrors, [name]: null });
    } catch (error) {
      setFormErrors({ ...formErrors, [name]: error.message });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await schema.validate(formValues, { abortEarly: false });

      await contactForm(formValues);
      setFormValues(initialFormValues);

      dispatch(
        showAlert({
          type: "success",
          message: "Message sent successfully",
        }),
      );
    } catch (error) {
      handleFormError(error, setFormErrors, dispatch, navigate);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("hasSeenPreloader");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
      lenis.destroy(); // cleanup
    };
  }, []);

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <AnimatePresence>
        {loading && (
          <Preloader
            onLoadingComplete={() => {
              sessionStorage.setItem("hasSeenPreloader", "true");
              setLoading(false);
            }}
          />
        )}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <ThemeProvider theme={theme}>
            <CssBaseline />

            <AlertDialogSlide
              {...checkCertAlertData}
              open={openValidateCert}
              onCancel={() => setOpenValidateCert(false)}
            />

            <LandingAppBar />

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
                            fontSize: {
                              xs: "2.5rem",
                              sm: "3.5rem",
                              md: "4rem",
                            },
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
                          Automate road cross-sections, waterway contours, and
                          volume calculations with CAD-integrated tools that
                          eliminate human error.
                        </Typography>
                      </motion.div>

                      <motion.div variants={fUp}>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2}
                        >
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
                            onClick={() => navigate("/login")}
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
                            size="large"
                            sx={{
                              borderColor: "rgba(0,0,0,0.1)",
                              color: "#111",
                              borderRadius: 2,
                              py: 2,
                              px: 4,
                              fontWeight: 700,
                              textTransform: "none",
                              bgcolor: "#fff",
                              "&:hover": {
                                borderColor: "#6366f1",
                                color: "#6366f1",
                                bgcolor: "rgba(99, 102, 241, 0.04)",
                              },
                            }}
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

                      <Box
                        sx={{
                          position: "relative",
                          p: 1,
                          borderRadius: 4,
                          background: "rgba(255, 255, 255, 0.05)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
                          width: "100%",
                          maxWidth: {
                            xs: "100%",
                            sm: "250px",
                            md: "300px",
                          },
                          margin: "0 auto",
                        }}
                      >
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="none"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "12px",
                            display: "block",
                          }}
                        >
                          <source
                            src="https://res.cloudinary.com/dukl0w92v/video/upload/f_auto,q_auto,vc_auto,c_limit,w_1280/cader_intro_nhzzon.mp4"
                            type="video/mp4"
                          />
                        </video>
                      </Box>
                    </motion.div>
                  </Grid>
                </Grid>
              </Container>
            </Box>

            <Grid
              container
              spacing={6}
              alignItems="center"
              p={{ xs: 8, md: 12 }}
            >
              <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
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

                  <Box
                    sx={{
                      position: "relative",
                      p: 1,
                      borderRadius: 4,
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
                      width: "100%",
                      maxWidth: {
                        xs: "100%",
                        lg: "600px",
                      },
                      margin: "0 auto",
                    }}
                  >
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="none"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "12px",
                        display: "block",
                      }}
                    >
                      <source
                        src="https://res.cloudinary.com/dukl0w92v/video/upload/v1768635428/A_modern_road_202601171306_lhs6i_jerdkr.mp4"
                        type="video/mp4"
                      />
                    </video>
                  </Box>
                </motion.div>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Stack spacing={4}>
                    <Box>
                      <Typography
                        sx={{
                          color: "#6366f1",
                          fontWeight: 700,
                          letterSpacing: 2,
                          fontSize: "0.85rem",
                          mb: 1,
                          textTransform: "uppercase",
                        }}
                      >
                        Efficiency Reimagined
                      </Typography>
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: 800,
                          fontSize: { xs: "2.2rem", md: "3rem" },
                          lineHeight: 1.2,
                          mb: 3,
                        }}
                      >
                        Complete projects faster, <br />
                        <Box component="span" sx={{ color: "#ef4444" }}>
                          without errors.
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "1.1rem",
                          color: "text.secondary",
                          lineHeight: 1.7,
                        }}
                      >
                        This innovative tool is set to transform how site
                        supervisors, project managers, and engineers conduct
                        autolevel surveys for roads and waterways.
                      </Typography>
                    </Box>

                    <Stack spacing={2.5}>
                      {[
                        "Real-time volume calculations",
                        "Automated cross-section plotting",
                        "Zero manual entry errors",
                        "Export directly to CAD formats",
                      ].map((feature, idx) => (
                        <Box
                          key={idx}
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <CheckCircle />
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "1.05rem" }}
                          >
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                </motion.div>
              </Grid>
            </Grid>

            {/* Feature Highlights */}
            <Box
              sx={{
                py: { xs: 8, md: 12 },
                bgcolor: "#000",
                overflow: "hidden",
              }}
              component={motion.div}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerStagger}
            >
              <Container maxWidth="lg">
                <Stack spacing={2} textAlign="center" mb={{ xs: 8, md: 10 }}>
                  <Typography
                    component={motion.h2}
                    variants={slowFadeUp}
                    sx={{
                      fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    There’s{" "}
                    <Box component="span" sx={{ color: "error.main" }}>
                      nothing like this
                    </Box>{" "}
                    on
                    <br />
                    the market!
                  </Typography>

                  <Typography
                    component={motion.p}
                    variants={slowFadeUp}
                    sx={{
                      fontSize: { xs: "0.95rem", md: "1.05rem" },
                      color: "rgba(255,255,255,0.6)",
                      lineHeight: 1.6,
                    }}
                  >
                    Choosing CADer for your projects has many advantages.
                    <br /> Let’s expand!
                  </Typography>
                </Stack>
              </Container>

              {/* Marquee Container */}
              <Box sx={{ position: "relative", width: "100%", mt: 2 }}>
                {/* Side Gradients for Seamless Entrance/Exit */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "20%",
                    height: "100%",
                    zIndex: 2,
                    background: "linear-gradient(to right, #000, transparent)",
                    pointerEvents: "none",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "20%",
                    height: "100%",
                    zIndex: 2,
                    background: "linear-gradient(to left, #000, transparent)",
                    pointerEvents: "none",
                  }}
                />

                <motion.div
                  animate={{
                    x: [0, -totalWidthOfOneSet],
                  }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 30, // Adjust speed here
                      ease: "linear",
                    },
                  }}
                  style={{
                    display: "flex",
                    gap: `${gap}px`,
                    width: "max-content",
                    paddingLeft: `${gap}px`,
                  }}
                >
                  {tripleFeatures.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: { xs: 260, md: cardWidth },
                        flexShrink: 0,
                        p: 4,
                        bgcolor: "rgba(255,255,255,0.03)",
                        borderLeft: "2px solid #6366f1",
                        borderRadius: "4px",
                        transition: "background-color 0.3s ease",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 2,
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.08)",
                        },
                      }}
                    >
                      <Box sx={{ color: "white", opacity: 0.9 }}>
                        {item.icon}
                      </Box>
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: "1rem",
                          fontWeight: 500,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  ))}
                </motion.div>
              </Box>
            </Box>

            <Box sx={{ bgcolor: "#f9fafb", py: { xs: 8, md: 12 } }}>
              <Container maxWidth="lg">
                <Grid container spacing={{ xs: 6, lg: 10 }} alignItems="center">
                  {/* LEFT CONTENT: Typography & Narrative */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                      <Stack spacing={4}>
                        <Box>
                          <Typography
                            sx={{
                              color: "#6366f1",
                              fontWeight: 700,
                              letterSpacing: 2,
                              fontSize: "0.85rem",
                              mb: 1.5,
                              textTransform: "uppercase",
                            }}
                          >
                            Education Partnership
                          </Typography>
                          <Typography
                            variant="h2"
                            sx={{
                              fontSize: { xs: "2.2rem", md: "3rem" },
                              fontWeight: 800,
                              lineHeight: 1.2,
                              mb: 3,
                              color: "#000",
                            }}
                          >
                            CADer{" "}
                            <Box component="span" sx={{ color: "#6366f1" }}>
                              Training Program
                            </Box>
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "1.1rem",
                              lineHeight: 1.7,
                              color: "text.secondary",
                              maxWidth: 500,
                            }}
                          >
                            Equip your students with cutting-edge surveying
                            skills. We offer a specialized intensive program
                            designed for the next generation of civil engineers
                            at your esteemed institution.
                          </Typography>
                        </Box>

                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2}
                        >
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
                            onClick={() => navigate("/register")}
                          >
                            <span>Enroll Now</span>

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
                            size="large"
                            sx={{
                              borderColor: "rgba(0,0,0,0.1)",
                              color: "#111",
                              borderRadius: 2,
                              py: 2,
                              px: 4,
                              fontWeight: 700,
                              textTransform: "none",
                              bgcolor: "#fff",
                              "&:hover": {
                                borderColor: "#6366f1",
                                color: "#6366f1",
                                bgcolor: "rgba(99, 102, 241, 0.04)",
                              },
                            }}
                            onClick={() => setOpenValidateCert(true)}
                          >
                            Validate Certificate
                          </Button>
                        </Stack>
                      </Stack>
                    </motion.div>
                  </Grid>

                  {/* RIGHT CONTENT: Feature Grid */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ position: "relative" }}>
                      {/* Decorative background element */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: "10%",
                          left: "10%",
                          width: "80%",
                          height: "80%",
                          bgcolor: "rgba(99, 102, 241, 0.05)",
                          filter: "blur(60px)",
                          zIndex: 0,
                        }}
                      />

                      <Grid
                        container
                        spacing={2.5}
                        sx={{ position: "relative", zIndex: 1 }}
                      >
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Stack spacing={2.5}>
                            <TrainingCard
                              icon={<ClockIcon />}
                              title="Duration"
                              description="10-day intensive package designed for deep skill acquisition."
                            />
                            <TrainingCard
                              icon={<AwardIcon />}
                              title="Software Access"
                              description="6 months free pro access (Retails for ₹45,000 + GST/year)."
                            />
                          </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: { sm: 4 } }}>
                          <Stack spacing={2.5}>
                            <TrainingCard
                              icon={<WalletIcon />}
                              title="Pricing"
                              description="Special institution-only affordable pricing per student."
                            />
                            <TrainingCard
                              icon={<TrendingIcon />}
                              title="Career Impact"
                              description="Proficiency increases professional pay scales by up to 20%."
                            />
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Container>
            </Box>

            {/*  CONNECT WITH US */}
            <Box sx={{ py: { xs: 8, md: 15 }, bgcolor: "#fff" }}>
              <Container maxWidth="lg">
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: "#6366f1",
                    borderRadius: { xs: 4, md: 8 },
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: "0 40px 80px rgba(99, 102, 241, 0.25)",
                  }}
                >
                  {/* Background Decorative Circles */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -100,
                      right: -100,
                      width: 400,
                      height: 400,
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,0.05)",
                      zIndex: 0,
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -50,
                      left: -50,
                      width: 200,
                      height: 200,
                      borderRadius: "50%",
                      bgcolor: "rgba(0,0,0,0.1)",
                      zIndex: 0,
                    }}
                  />

                  <Grid container sx={{ position: "relative", zIndex: 1 }}>
                    {/* Left Side: Content */}
                    <Grid
                      size={{ xs: 12, lg: 5 }}
                      sx={{ p: { xs: 4, md: 8, lg: 10 }, color: "white" }}
                    >
                      <Stack spacing={4}>
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 800,
                              fontSize: { xs: "2.2rem", md: "3.5rem" },
                              lineHeight: 1.1,
                              mb: 3,
                            }}
                          >
                            Connect <br /> with us
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "1.1rem",
                              lineHeight: 1.7,
                              opacity: 0.9,
                              maxWidth: 380,
                            }}
                          >
                            Let us know how we can help! Fill out the form and
                            our team will get back to you within 24 hours.
                          </Typography>
                        </Box>

                        <Stack spacing={3}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                bgcolor: "rgba(255,255,255,0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
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
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                              </svg>
                            </Box>
                            <Typography fontWeight={500}>
                              +91 79944 19955
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                bgcolor: "rgba(255,255,255,0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
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
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                              </svg>
                            </Box>
                            <Typography fontWeight={500}>
                              admin@getcader.com
                            </Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </Grid>

                    {/* Right Side: Form */}
                    <Grid
                      size={{ xs: 12, lg: 7 }}
                      sx={{
                        p: { xs: 4, md: 8, lg: 10 },
                        bgcolor: "rgba(0,0,0,0.1)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ width: "100%" }}>
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12, lg: 6 }}>
                            <CustomInput
                              label="Full Name"
                              placeholder="Jane Smith"
                              name="name"
                              onChange={handleInputChange}
                              error={!!formErrors?.name}
                              helperText={formErrors?.name}
                              value={formValues?.name}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, lg: 6 }}>
                            <CustomInput
                              label="Work Email"
                              placeholder="jane@university.edu"
                              name="email"
                              onChange={handleInputChange}
                              error={!!formErrors?.email}
                              helperText={formErrors?.email}
                              value={formValues?.email}
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <CustomInput
                              label="Phone Number"
                              placeholder="+91 9999999999"
                              name="phone"
                              onChange={handleInputChange}
                              error={!!formErrors?.phone}
                              helperText={formErrors?.phone}
                              value={formValues?.phone}
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <Box>
                              <Typography
                                sx={{
                                  color: "white",
                                  mb: 1,
                                  fontSize: "0.85rem",
                                  fontWeight: 600,
                                  opacity: 0.9,
                                }}
                              >
                                How can we help?
                              </Typography>
                              <TextField
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Tell us about your requirements..."
                                variant="outlined"
                                name="message"
                                onChange={handleInputChange}
                                error={!!formErrors?.message}
                                helperText={formErrors?.message}
                                value={formValues?.message}
                                sx={{
                                  bgcolor: "rgba(255,255,255,0.08)",
                                  borderRadius: 2,
                                  "& .MuiOutlinedInput-root": {
                                    color: "white",
                                    "& fieldset": {
                                      borderColor: "rgba(255,255,255,0.2)",
                                      borderRadius: "12px",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "rgba(255,255,255,0.4)",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "white",
                                    },
                                  },
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <Button
                              variant="contained"
                              fullWidth
                              sx={{
                                bgcolor: "#000",
                                color: "#fff",
                                height: "64px",
                                borderRadius: "12px",
                                fontSize: "1.1rem",
                                fontWeight: 700,
                                textTransform: "none",
                                boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                                "&:hover": {
                                  bgcolor: "#111",
                                  transform: "scale(1.01)",
                                },
                                transition: "all 0.2s ease",
                              }}
                              onClick={handleSubmit}
                              loading={isLoading}
                            >
                              Send Message
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Container>
            </Box>
          </ThemeProvider>
        </motion.div>
      )}

      <LandingFooter />
    </Box>
  );
};

export default Landing;
