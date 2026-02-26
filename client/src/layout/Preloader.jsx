import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

const Preloader = () => {
  const { global } = useSelector((state) => state.loading);

  const [isVisible, setIsVisible] = useState(true);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    if (global === false) {
      setProgress(100);
      timer = setTimeout(() => setIsVisible(false), 800);
    } else {
      setIsVisible(true);
      setProgress(30);
    }
    return () => clearTimeout(timer);
  }, [global]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#020617", // Deep slate/black background
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Box sx={{ width: "320px", textAlign: "center" }}>
            {/* Animated Branding Text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: "#f8fafc",
                  letterSpacing: "0.5em",
                  mb: 3,
                  display: "block",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                SYSTEM INITIALIZING
              </Typography>
            </motion.div>

            {/* Progress Bar Container */}
            <Box
              sx={{
                height: "2px",
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "4px",
                overflow: "hidden",
                position: "relative",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              {/* Animated Progress Fill */}
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{
                  duration: global === false ? 0.5 : 3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #0ea5e9, #6366f1)", // Cyan to Indigo
                  boxShadow: "0 0 20px rgba(14, 165, 233, 0.8)",
                }}
              />
            </Box>

            {/* Status Indicator */}
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                px: 0.5,
              }}
            >
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: "10px",
                    fontFamily: "monospace",
                  }}
                >
                  {global ? "EXECUTING SCRIPTS..." : "COMPLETE"}
                </Typography>
              </motion.div>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: "10px",
                  fontFamily: "monospace",
                }}
              >
                {Math.round(progress)}%
              </Typography>
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
