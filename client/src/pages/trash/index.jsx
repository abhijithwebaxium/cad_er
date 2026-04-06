import React from "react";
import { Box, Typography, Container, Paper, Stack } from "@mui/material";
import { FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import BigHeader from "../../components/BigHeader";

const BG_COLOR = "#f8fafc";

export default function Trash() {
  return (
    <Box sx={{ bgcolor: BG_COLOR, minHeight: "100vh", pb: 8 }}>
      <BigHeader />

      <Container maxWidth="md" sx={{ mt: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 8 },
              borderRadius: "32px",
              textAlign: "center",
              border: "2px dashed #cbd5e1",
              bgcolor: "rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 10px 40px -20px rgba(0,0,0,0.05)",
            }}
          >
            <Stack alignItems="center" spacing={3}>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    bgcolor: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8",
                  }}
                >
                  <FiTrash2 size={56} />
                </Box>
              </motion.div>
              <Box>
                <Typography variant="h4" fontWeight={900} color="#1e293b" mb={1}>
                  Trash is Empty
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontWeight={500}
                  sx={{ maxWidth: 400, mx: "auto" }}
                >
                  Any field notes, components, or files you delete will temporarily
                  reside here before permanent removal.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
