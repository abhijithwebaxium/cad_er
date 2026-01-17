import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Box, LinearProgress, Typography } from "@mui/material";

const Preloader = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          setTimeout(() => onLoadingComplete(), 500); // Small delay for smooth exit
          return 100;
        }
        const diff = Math.random() * 15;
        return Math.min(oldProgress + diff, 100);
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 1 }}
      exit={{
        y: "-100%",
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
      }}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        bgcolor: "#000",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ position: "relative", mb: 4 }}>
        {/* Animated Logo */}
        <Typography
          variant="h6"
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            fontWeight: 900,
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            letterSpacing: "-0.02em",
            color: "white",
            position: "relative",
          }}
        >
          CAD
          <Box
            component="span"
            sx={{
              color: "#6366f1",
              position: "relative",
              display: "inline-block",
            }}
          >
            er
            {/* Shimmer Effect */}
            <Box
              component={motion.div}
              animate={{
                left: ["-100%", "200%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              sx={{
                position: "absolute",
                top: 0,
                width: "50%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.4), transparent)",
                zIndex: 1,
              }}
            />
          </Box>
        </Typography>

        {/* Floating Glow Behind Logo */}
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "150px",
            height: "150px",
            bgcolor: "#6366f1",
            filter: "blur(60px)",
            borderRadius: "50%",
            zIndex: -1,
          }}
        />
      </Box>

      {/* Loading Bar Container */}
      <Box sx={{ width: "200px", position: "relative" }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 2,
            bgcolor: "rgba(255,255,255,0.1)",
            "& .MuiLinearProgress-bar": {
              bgcolor: "#6366f1",
            },
          }}
        />
        <Typography
          sx={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.7rem",
            textAlign: "center",
            mt: 1,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            fontWeight: 600,
          }}
        >
          {Math.round(progress)}%
        </Typography>
      </Box>
    </Box>
  );
};

export default Preloader;
