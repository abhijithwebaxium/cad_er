import React from "react";
import {
  Box,
  Typography,
  Container,
  Avatar,
  IconButton,
  Stack,
  GlobalStyles,
  Paper,
  Grid, // Reverting to the standard stable Grid component
} from "@mui/material";
import { motion } from "framer-motion";
import ScrollToTop from "../../components/ScrollToTop";

/**
 * Custom SVG Icons for Social Media
 */
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

const teamMembers = [
  {
    name: "Anees Majeed",
    role: "Founder & Chief Executive Officer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    bio: "With over a decade of expertise in mapping, mining, and boring, Anees is the visionary force behind CADer. He combines technical mastery with strategic foresight, ensuring the platform delivers measurable impact for institutions and professionals. His leadership drives innovation and long‑term growth.",
  },
  {
    name: "Muhjir Ibrahim Shajahan",
    role: "Product Architect",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "Muhjir specializes in designing intuitive human–computer interfaces that simplify complex workflows. His passion for usability ensures CADer remains accessible and efficient for engineers, supervisors, and project managers. He is committed to bridging technology with human experience.",
  },
  {
    name: "Jaseem CM",
    role: "Research & Development, Civil Engineer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    bio: "Jaseem leads applied research and technical innovation, advancing CADer’s engineering capabilities. With a strong civil engineering background, he focuses on precision, reliability, and practical solutions that meet industry standards. His work ensures CADer evolves with cutting‑edge methodologies.",
  },
  {
    name: "Asif Majeed",
    role: "Head of Accounts",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    bio: "Asif oversees financial operations with a focus on accuracy, transparency, and sustainability. His expertise in fiscal management ensures CADer’s growth is supported by sound financial practices. He plays a key role in maintaining operational efficiency.",
  },
  {
    name: "Muhammed Noor",
    role: "Human Resources Lead",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    bio: "Noor is dedicated to building strong teams and fostering organizational culture. He manages talent acquisition, employee development, and workplace engagement, ensuring CADer attracts and retains top professionals. His leadership strengthens collaboration across the company.",
  },
  {
    name: "Kishore K. Ajayan",
    role: "Head of Marketing",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    bio: "Kishore drives brand strategy, institutional outreach, and market positioning. With a focus on educational impact and industry adoption, he ensures CADer’s message resonates with both technical institutions and professionals. His campaigns expand CADer’s reach and credibility.",
  },
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.8,
    },
  },
};

const OurTeam = () => {
  return (
    <>
      <ScrollToTop />
      <Box
        sx={{
          bgcolor: "#ffffff",
          minHeight: "100vh",
          pb: 10,
          overflowX: "hidden",
        }}
      >
        <GlobalStyles
          styles={{
            body: { margin: 0, padding: 0, backgroundColor: "#ffffff" },
          }}
        />

        {/* Hero Header */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          sx={{
            pt: 12,
            pb: 10,
            textAlign: "center",
            background:
              "radial-gradient(circle at 50% 0%, #f3f4ff 0%, #ffffff 80%)",
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="overline"
              sx={{
                color: "#6366f1",
                fontWeight: 800,
                letterSpacing: 4,
                display: "block",
                mb: 1,
              }}
            >
              OUR TALENT
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                color: "#111827",
                mb: 3,
                fontSize: { xs: "2.75rem", md: "4.5rem" },
                lineHeight: 1,
                letterSpacing: -1,
              }}
            >
              Governance
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#6b7280",
                fontWeight: 400,
                lineHeight: 1.7,
                maxWidth: 650,
                mx: "auto",
                fontSize: "1.25rem",
              }}
            >
              We're a diverse group of creators working to redefine the
              intersection of engineering and design.
            </Typography>
          </Container>
        </Box>

        {/* Team Grid using standard Grid */}
        <Container maxWidth="lg">
          <Grid
            container
            spacing={4}
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {teamMembers.map((member, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <motion.div variants={cardVariants} whileHover={{ y: -10 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: "100%",
                      borderRadius: 10,
                      textAlign: "center",
                      border: "1px solid #f1f5f9",
                      bgcolor: "#ffffff",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        borderColor: "#6366f1",
                        boxShadow: "0 30px 60px -12px rgba(99, 102, 241, 0.12)",
                        "& .social-stack": { opacity: 1, y: 0 },
                        "& .member-avatar": { transform: "scale(1.1)" },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        mb: 4,
                        width: 150,
                        height: 150,
                        mx: "auto",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          inset: -6,
                          borderRadius: "50%",
                          border: "2px solid #6366f1",
                          opacity: 0,
                          transition: "0.3s",
                          transform: "scale(0.8)",
                        },
                        "&:hover::after": {
                          opacity: 1,
                          transform: "scale(1)",
                        },
                      }}
                    >
                      <Avatar
                        className="member-avatar"
                        src={member.image}
                        sx={{
                          width: "100%",
                          height: "100%",
                          transition:
                            "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }}
                      />
                    </Box>

                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 800, color: "#111827", mb: 0.5 }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#6366f1",
                        fontWeight: 700,
                        mb: 2,
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                        fontSize: "0.75rem",
                      }}
                    >
                      {member.role}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#64748b",
                        mb: 4,
                        lineHeight: 1.7,
                        fontSize: "0.95rem",
                      }}
                    >
                      {member.bio}
                    </Typography>

                    {/* Social Box with Motion logic */}
                    <Stack
                      direction="row"
                      spacing={1.5}
                      justifyContent="center"
                      className="social-stack"
                      sx={{
                        opacity: 0,
                        y: 20,
                        transition:
                          "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
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
                          whileHover={{
                            scale: 1.2,
                            rotate: 8,
                            color: "#6366f1",
                          }}
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
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Bottom CTA Section */}
        <Container maxWidth="md" sx={{ mt: 15 }}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            sx={{
              p: 6,
              borderRadius: 12,
              textAlign: "center",
              bgcolor: "#111827",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
              Want to join the mission?
            </Typography>
            <Typography
              sx={{ color: "#94a3b8", mb: 4, maxWidth: 500, mx: "auto" }}
            >
              We're always looking for talented individuals to help us build the
              next generation of CAD tools.
            </Typography>
            <IconButton
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                bgcolor: "#6366f1",
                color: "white",
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 700,
                "&:hover": { bgcolor: "#4f46e5" },
              }}
            >
              View Open Positions
            </IconButton>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default OurTeam;
