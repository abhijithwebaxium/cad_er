import { Activity, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Grid,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  Link,
  Container,
  IconButton,
  Divider,
} from "@mui/material";
import {
  AiOutlineWarning,
  AiOutlineCloud,
  AiOutlineLineChart,
} from "react-icons/ai";
import { FiTool, FiUsers } from "react-icons/fi";
import { MdDevices } from "react-icons/md";
import { motion } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import {
  FaXTwitter,
  FaInstagram,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa6";

import LOGO from "../../assets/logo/CADer logo-loader.png";
import CADER_EQUIPMENT from "../../assets/cader_equipment.png";
import CONTOUR_LINES from "../../assets/contour_lines.png";
import CONTOUR_LINES_2 from "../../assets/contour_lines_2.png";
import ENGINEERS from "../../assets/engineers.jpg";
import ROAD from "../../assets/road.png";
import SURVEYOR from "../../assets/surveyor.png";
import BasicInput from "../../components/BasicInput";
import AlertDialogSlide from "../../components/AlertDialogSlide";
import ValidateCertificate from "../../components/ValidateCertificate";

const MotionBox = motion.create(Box);
const MotionStack = motion.create(Stack);
const MotionImg = motion.img;
const MotionTypography = motion.create(Typography);

const slowFadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

const slowFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.5, ease: "easeOut" },
  },
};

const floatAnim = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const containerStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const features = [
  {
    icon: <AiOutlineWarning size={42} />,
    text: "Instant zero error field book generation",
  },
  {
    icon: <FiTool size={42} />,
    text: "Provision to check calibration of autolevel instantly",
  },
  {
    icon: <AiOutlineCloud size={42} />,
    text: "Cloud storage and multi-user",
  },
  {
    icon: <MdDevices size={42} />,
    text: "Use anywhere: Mobile, Tablet, Laptop",
  },
  {
    icon: <FiUsers size={42} />,
    text: "Collaboration options",
  },
  {
    icon: <AiOutlineLineChart size={42} />,
    text: "1-click graph and quantity calculation",
  },
];

const inputData = [
  {
    label: "Name",
    name: "name",
    type: "text",
  },
  {
    label: "Phone",
    name: "phone",
    type: "number",
  },
  {
    label: "Email",
    name: "email",
    type: "email",
  },
  {
    label: "Enter your message",
    name: "message",
    type: "text",
  },
];

const TICK_WIDTH = 2; // px
const GAP = 8; // px
const UNIT = TICK_WIDTH + GAP;

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const containerRef = useRef(null);
  const [tickCount, setTickCount] = useState(0);
  const [openValidateCert, setOpenValidateCert] = useState(false);

  const checkCertAlertData = {
    title: "Validate Certificate",
    description: "Please enter the certificate ID to validate",
    content: (
      <ValidateCertificate onCancel={() => setOpenValidateCert(false)} />
    ),
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;

      // ✅ FIX: add GAP once
      setTickCount(Math.floor((width + GAP) / UNIT));
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
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

  const isLgDown = useMediaQuery(theme.breakpoints.down("lg"));

  const handleNavigate = (link) => navigate(link);
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        maxWidth: "1400px",
        overflow: "hidden",
      }}
    >
      <AlertDialogSlide
        {...checkCertAlertData}
        open={openValidateCert}
        onCancel={() => setOpenValidateCert(false)}
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <MotionStack
            variants={containerStagger}
            initial="hidden"
            animate="visible"
            spacing={{ xs: 4, md: 6, lg: 10 }}
            py={{ xs: 2, sm: 4, md: 8, lg: 10 }}
            pl={{ xs: 2, sm: 4, md: 8, lg: 10 }}
            pr={{ xs: 2, sm: 4, md: 8, lg: 2 }}
          >
            <MotionImg
              variants={slowFade}
              src={LOGO}
              alt="CADer"
              style={{ width: 150 }}
            />

            <MotionStack variants={slowFadeUp} spacing={1}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: {
                    xs: "1.8rem",
                    md: "2.5rem",
                    lg: "3.5rem",
                  },
                  fontWeight: 600,
                }}
              >
                Construction Survey Made Easy
              </Typography>

              <Typography
                sx={{
                  fontSize: {
                    xs: "1rem",
                    md: "1.25rem",
                  },
                }}
              >
                (Road & Waterways) with CADer
              </Typography>
            </MotionStack>

            <MotionBox variants={slowFadeUp} position={"relative"}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "red",
                  borderRadius: 0,
                  py: 2,
                  px: 5,
                  width: "fit-content",
                  textTransform: "none",
                  zIndex: 1,
                }}
                onClick={() => handleNavigate("/login")}
              >
                Get Started
              </Button>

              <Activity mode={isLgDown ? "hidden" : "visible"}>
                <MotionImg
                  {...floatAnim}
                  src={CONTOUR_LINES}
                  alt="contour_lines"
                  style={{
                    width: "610px",
                    position: "absolute",
                    top: 10,
                    left: -350,
                  }}
                />
              </Activity>
            </MotionBox>
          </MotionStack>
        </Grid>

        <Grid
          size={{ xs: 12, lg: 6 }}
          position={"relative"}
          overflow={"hidden"}
        >
          <MotionImg
            {...floatAnim}
            src={CONTOUR_LINES}
            alt="contour_lines"
            style={{
              width: "610px",
              position: "absolute",
              top: -135,
              right: -70,
            }}
          />

          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slowFadeUp}
            display={"flex"}
            justifyContent={isLgDown ? "center" : "end"}
            alignItems={"center"}
            p={10}
          >
            <MotionImg
              src={CADER_EQUIPMENT}
              alt="equipment"
              style={{
                width: "300px",
                zIndex: 1,
                paddingRight: isLgDown ? 0 : 95,
              }}
            />
          </MotionBox>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{
          backgroundColor: "white",
          position: "relative",
          zIndex: 10,
        }}
      >
        <Grid size={{ xs: 12, lg: 6 }} overflow={"hidden"}>
          <MotionImg
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slowFade}
            src={ROAD}
            alt="road"
            style={{
              width: "100%",
              transform: "translateY(-12.9%) scale(1.1)",
            }}
          />

          <Activity mode={isLgDown ? "hidden" : "visible"}>
            <MotionImg
              {...floatAnim}
              src={CONTOUR_LINES_2}
              alt="contour_lines"
              style={{
                height: "50%",
                position: "absolute",
                left: 0,
                bottom: 0,
                zIndex: -1,
              }}
            />
          </Activity>
        </Grid>

        <Grid
          size={{ xs: 12, lg: 6 }}
          p={{ xs: 2, sm: 4, md: 8, lg: 0 }}
          pr={{ lg: 10 }}
        >
          <Box
            display="flex"
            alignItems="center"
            height="100%"
            px={{ xs: 2, md: 4, lg: 0 }}
          >
            <MotionStack
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerStagger}
              spacing={{ xs: 4, md: 6, lg: 10 }}
            >
              <MotionStack variants={slowFadeUp} spacing={{ xs: 0.5, md: 1 }}>
                <Typography
                  sx={{
                    fontSize: {
                      xs: "1.6rem",
                      sm: "1.9rem",
                      md: "2.2rem",
                      lg: "2.5rem",
                    },
                    fontWeight: 600,
                    lineHeight: 1.1,
                  }}
                >
                  Complete projects faster,
                </Typography>

                <Typography
                  sx={{
                    fontSize: {
                      xs: "1.2rem",
                      sm: "1.5rem",
                      md: "1.8rem",
                      lg: "2.5rem",
                    },
                    fontWeight: 600,
                    lineHeight: 1.1,
                  }}
                  color="red"
                >
                  without errors!
                </Typography>
              </MotionStack>

              <MotionStack
                variants={slowFadeUp}
                spacing={{ xs: 2, md: 3, lg: 4 }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: "0.90rem",
                      md: "0.95rem",
                      lg: "1rem",
                    },
                    lineHeight: 1.6,
                  }}
                >
                  This innovative tool is set to transform how site supervisors,
                  project managers, and engineers conduct autolevel surveys for
                  roads and waterways.
                </Typography>

                <Typography
                  sx={{
                    fontSize: {
                      xs: "0.90rem",
                      md: "0.95rem",
                      lg: "1rem",
                    },
                    lineHeight: 1.6,
                  }}
                >
                  CADer significantly streamlines the surveying process, helping
                  professionals achieve a 40% reduction in time spent on-site
                  while ensuring zero errors in their calculations
                </Typography>
              </MotionStack>
            </MotionStack>
          </Box>
        </Grid>
      </Grid>

      <Box ref={containerRef} width="100%" overflow={"hidden"}>
        <Stack direction="row" spacing={`${GAP}px`}>
          {Array.from({ length: tickCount }).map((_, i) => (
            <Box
              key={i}
              sx={{
                width: `${TICK_WIDTH}px`,
                height: i % 5 === 0 ? 20 : 10,
                bgcolor: "grey.700",
              }}
            />
          ))}
        </Stack>
      </Box>

      <Box
        py={{ xs: 8, md: 10 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        component={motion.div}
        variants={containerStagger}
      >
        {/* Heading */}
        <MotionStack
          spacing={2}
          textAlign="center"
          mb={{ xs: 6, md: 8 }}
          variants={containerStagger}
        >
          <MotionTypography
            variants={slowFadeUp}
            sx={{
              fontSize: {
                xs: "1.6rem",
                sm: "1.9rem",
                md: "2.2rem",
                lg: "2.5rem",
              },
              fontWeight: 600,
            }}
          >
            There’s{" "}
            <Box component="span" sx={{ color: "error.main" }}>
              nothing like this
            </Box>{" "}
            on
            <br />
            the market!
          </MotionTypography>

          <MotionTypography
            variants={slowFadeUp}
            sx={{
              fontSize: { xs: "0.90rem", md: "0.95rem", lg: "1rem" },
              lineHeight: 1.6,
            }}
          >
            Choosing CADer for your projects has many advantages.
            <br /> Let’s expand!
          </MotionTypography>
        </MotionStack>

        {/* Features grid */}
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {features.map((item, index) => (
            <Grid
              key={index}
              size={{ xs: 12, sm: 6, md: 4 }}
              display="flex"
              justifyContent="center"
            >
              <MotionStack
                spacing={2}
                alignItems="center"
                maxWidth={240}
                variants={slowFadeUp}
                whileHover={{ y: -4, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                sx={{ cursor: "pointer" }}
              >
                <Box sx={{ color: "text.primary", fontSize: 42 }}>
                  {item.icon}
                </Box>

                <Typography
                  textAlign="center"
                  sx={{ fontSize: "0.95rem", fontWeight: 500 }}
                >
                  {item.text}
                </Typography>
              </MotionStack>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid
        container
        spacing={{ xs: 4, md: 6 }}
        p={{ xs: 2, sm: 4, md: 8, lg: 10 }}
      >
        {/* LEFT CONTENT */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Stack spacing={{ xs: 3, md: 4 }} maxWidth={500}>
            {/* Heading */}
            <Typography
              sx={{
                fontSize: {
                  xs: "1.6rem",
                  sm: "1.9rem",
                  md: "2.2rem",
                  lg: "2.5rem",
                },
                fontWeight: 600,
              }}
            >
              CADer{" "}
              <Box component="span" sx={{ color: "error.main" }}>
                Training Program
              </Box>
            </Typography>

            {/* Intro paragraph */}
            <Typography
              sx={{
                fontSize: {
                  xs: "0.90rem",
                  md: "0.95rem",
                  lg: "1rem",
                },
                lineHeight: 1.6,
              }}
            >
              To equip your students with the cutting-edge skills needed in
              today's competitive job market, we are pleased to offer a
              specialized CADer training program for students at your esteemed
              institution.
            </Typography>

            {/* Details */}
            <Stack spacing={1.5}>
              <Typography
                sx={{
                  fontSize: {
                    xs: "0.90rem",
                    md: "0.95rem",
                    lg: "1rem",
                  },
                }}
                fontWeight={600}
              >
                Exclusive Student Training Program Details:
              </Typography>

              <Typography>
                <Box component="span" fontWeight={600}>
                  Duration:
                </Box>{" "}
                10-day intensive training package.
              </Typography>

              <Typography
                sx={{
                  fontSize: {
                    xs: "0.90rem",
                    md: "0.95rem",
                    lg: "1rem",
                  },
                }}
              >
                <Box component="span" fontWeight={600}>
                  Pricing:
                </Box>{" "}
                A very affordable pricing per student.
              </Typography>

              <Typography
                sx={{
                  fontSize: {
                    xs: "0.90rem",
                    md: "0.95rem",
                    lg: "1rem",
                  },
                }}
              >
                <Box component="span" fontWeight={600}>
                  Benefits:
                </Box>{" "}
                Upon completion, students will receive 6 months of free access
                to our software (which typically retails for ₹45,000 +
                GST/year).
              </Typography>

              <Typography
                sx={{
                  fontSize: {
                    xs: "0.90rem",
                    md: "0.95rem",
                    lg: "1rem",
                  },
                }}
              >
                <Box component="span" fontWeight={600}>
                  Career Impact:
                </Box>{" "}
                According to industry feedback, proficiency with CADer can
                increase a professional's pay scale by up to 20% based on their
                skill level.
              </Typography>
            </Stack>

            <Stack direction={"row"} spacing={2}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "red",
                  borderRadius: 0,
                  py: 2,
                  px: 5,
                  width: "fit-content",
                  textTransform: "none",
                  zIndex: 1,
                }}
                onClick={() => handleNavigate("/register")}
              >
                Enroll Now!
              </Button>
              <Button
                variant="outlined"
                sx={{
                  backgroundColor: "white",
                  borderRadius: 0,
                  py: 2,
                  px: 5,
                  width: "fit-content",
                  textTransform: "none",
                  zIndex: 1,
                }}
                onClick={() => setOpenValidateCert(true)}
              >
                Validate Certificate
              </Button>
            </Stack>
          </Stack>
        </Grid>

        <Activity mode={isLgDown ? "hidden" : "visible"}>
          <Grid size={{ xs: 12, lg: 6 }} position={"relative"}>
            <Box display={"flex"} justifyContent={"center"}>
              <img
                src={SURVEYOR}
                alt="surveyor"
                style={{
                  width: "450px",
                  height: "710px",
                  position: "absolute",
                  bottom: -80,
                  right: "80px",
                }}
              />

              <img
                src={CONTOUR_LINES_2}
                alt="contour_lines"
                style={{
                  height: "400px",
                  position: "absolute",
                  right: 0,
                  top: 150,
                  zIndex: -1,
                }}
              />
            </Box>
          </Grid>
        </Activity>
      </Grid>

      <Grid
        container
        sx={{
          display: "flex",
          height: "100%", // let it take parent's height
          alignItems: "stretch", // make all children stretch
        }}
      >
        <Grid size={{ xs: 12, lg: 6 }} sx={{ display: "flex" }}>
          <Activity mode={isLgDown ? "hidden" : "visible"}>
            <img
              src={ENGINEERS}
              alt="engineers"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Activity>
        </Grid>

        <Grid
          position={"relative"}
          size={{ xs: 12, lg: 6 }}
          sx={{ display: "flex", backgroundColor: "#00007a" }}
        >
          <img
            src={CONTOUR_LINES_2}
            alt="contour_lines"
            style={{
              width: "100%",
              height: isLgDown ? "700px" : "100%",
              objectFit: "cover",
            }}
          />

          <Stack
            position="absolute"
            zIndex={1}
            p={4}
            spacing={3}
            bgcolor="#ff8100"
            color="white"
            top="50%"
            width={"70%"}
            sx={{
              transform: {
                xs: "translate(-50%, -50%)",
                lg: "translateY(-50%)",
              },
              left: {
                xs: "50%",
                lg: -65,
              },
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "1.6rem",
                  sm: "1.9rem",
                  md: "2.2rem",
                  lg: "2.5rem",
                },
                fontWeight: 600,
                lineHeight: 1.1,
              }}
            >
              Connect with us
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "0.90rem",
                  md: "0.95rem",
                  lg: "1rem",
                },
                lineHeight: 1.6,
              }}
            >
              Let us know how we can help! Fill out the form below to connect us
              via mali.
            </Typography>

            <Stack spacing={1}>
              {inputData.map((input, idx) => (
                <BasicInput
                  {...input}
                  labelColor="white"
                  sx={{ width: "100%" }}
                  key={idx}
                />
              ))}
            </Stack>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "blue",
                borderRadius: 0,
                py: 2,
                px: 5,
                width: "fit-content",
                textTransform: "none",
                zIndex: 1,
              }}
            >
              Submit
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box sx={{ bgcolor: "#f9fafb", py: 6, px: 2 }}>
        <Container maxWidth="lg">
          {/* Top Section */}
          <Grid container spacing={{ xs: 4, md: 8 }}>
            {/* Logo + Description */}
            <Grid size={{ xs: 12, md: 6 }}>
              <img src={LOGO} alt="CADer" style={{ width: 150 }} />
              <Typography variant="body2" color="text.secondary" mt={1}>
                CADer simplifies autolevel surveying, reducing on-site time by
                40% while ensuring accurate, error-free calculations for
                professionals.
              </Typography>
              <Stack direction="row" spacing={1} mt={2}>
                <IconButton>
                  <FaXTwitter size={18} />
                </IconButton>
                <IconButton>
                  <FaInstagram size={18} />
                </IconButton>
                <IconButton>
                  <FaLinkedin size={18} />
                </IconButton>
                <IconButton>
                  <FaFacebook size={18} />
                </IconButton>
              </Stack>
            </Grid>

            {/* Links Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Product
                  </Typography>
                  <Stack spacing={1}>
                    <Link href="#" fontSize={14}>
                      Features
                    </Link>
                    <Link href="#" fontSize={14}>
                      Pricing
                    </Link>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Resources
                  </Typography>
                  <Stack spacing={1}>
                    <Link href="#" fontSize={14}>
                      Documentation
                    </Link>
                    <Link href="#" fontSize={14}>
                      Tutorials
                    </Link>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Company
                  </Typography>
                  <Stack spacing={1}>
                    <Link href="/about" fontSize={14}>
                      About
                    </Link>
                    <Link href="/careers" fontSize={14}>
                      Careers
                    </Link>
                    <Link href="/placements" fontSize={14}>
                      Placements
                    </Link>
                    <Link href="/our-team" fontSize={14}>
                      Our Team
                    </Link>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Divider */}
          <Divider sx={{ my: 4 }} />

          {/* Contact Row */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Typography variant="body2" color="text.secondary">
              📞 <Link href="tel:+917994419955">+91 79944 19955</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              📞 <Link href="tel:+917994439955">+91 79944 39955</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              📞 <Link href="tel:+917994469955">+91 79944 69955</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ✉ <Link href="mailto:admin@getcader.com">admin@getcader.com</Link>
            </Typography>
          </Stack>

          {/* Divider */}
          <Divider sx={{ my: 4 }} />

          {/* Bottom Section */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Typography variant="caption" color="text.secondary">
              © 2025 CADer. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Link href="#" variant="caption">
                Privacy Policy
              </Link>
              <Link href="#" variant="caption">
                Terms of Service
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Container>
  );
};

export default Landing;
