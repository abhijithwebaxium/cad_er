import React, { useState, useRef, useEffect } from "react";
import {
  Paper,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Tooltip,
  Avatar,
  Stack,
} from "@mui/material";

import {
  MdCameraAlt,
  MdFlipCameraIos,
  MdCheckCircle,
  MdClose,
  MdDeleteOutline,
} from "react-icons/md";

const ObservationNotes = ({ value = "", onChange }) => {
  const [photo, setPhoto] = useState(null);

  // Camera Dialog State
  const [open, setOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, open]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleOpenScanner = () => {
    setOpen(true);
    setCapturedImage(null);
    startCamera();
  };

  const handleClose = () => {
    stopCamera();
    setOpen(false);
    setCapturedImage(null);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const savePhoto = () => {
    setPhoto(capturedImage);
    handleClose();
  };

  return (
    <Stack width={"100%"}>
      <Stack width={"100%"}>
        <Typography
          variant="body2"
          sx={{
            mb: 0.5,
            fontWeight: 600,
            color: "black",
          }}
        >
          Observation
        </Typography>

        <Box sx={{ position: "relative" }}>
          <TextField
            fullWidth
            multiline
            minRows={4}
            placeholder="Add your observation here (optional)..."
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#f9f9f9",
                "& fieldset": { borderColor: "#e0e0e0" },
                "&:hover fieldset": { borderColor: "#bdbdbd" },
                "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                paddingBottom: "50px", // Space for the floating button
              },
            }}
          />

          {/* Action Bar inside/attached to Textarea */}
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
              right: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid #eee",
              pt: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip title="Capture Photo">
                <IconButton
                  onClick={handleOpenScanner}
                  sx={{
                    color: photo ? "#4caf50" : "#757575",
                    bgcolor: photo ? "#e8f5e9" : "transparent",
                    "&:hover": { bgcolor: photo ? "#c8e6c9" : "#f5f5f5" },
                  }}
                >
                  <MdCameraAlt />
                </IconButton>
              </Tooltip>
              {photo && (
                <Typography variant="caption" sx={{ color: "#666" }}>
                  Photo attached
                </Typography>
              )}
            </Box>

            {photo && (
              <IconButton
                size="small"
                onClick={() => setPhoto(null)}
                color="error"
              >
                <MdDeleteOutline fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      </Stack>

      {/* Preview of captured photo */}
      {photo && (
        <Box sx={{ mt: 2, position: "relative", width: "fit-content" }}>
          <Avatar
            src={photo}
            variant="rounded"
            sx={{
              width: 120,
              height: 120,
              border: "2px solid #fff",
              boxShadow: 2,
            }}
          />
        </Box>
      )}

      {/* Camera Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {capturedImage ? "Preview Capture" : "Take Photo"}
          <IconButton onClick={handleClose} size="small">
            <MdClose />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              width: "100%",
              aspectRatio: "3/4",
              bgcolor: "#000",
              borderRadius: 2,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
            }}
          >
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </Box>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {capturedImage ? (
            <>
              <Button onClick={() => setCapturedImage(null)} color="inherit">
                Retake
              </Button>
              <Button
                onClick={savePhoto}
                variant="contained"
                color="success"
                startIcon={<MdCheckCircle />}
              >
                Attach
              </Button>
            </>
          ) : (
            <Button
              onClick={capturePhoto}
              variant="contained"
              fullWidth
              size="large"
              startIcon={<MdCameraAlt />}
            >
              Capture
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ObservationNotes;
