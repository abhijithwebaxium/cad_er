import React, { useState } from 'react';
import { Dialog, Box, Typography, Stack, TextField, IconButton } from '@mui/material';
import { IoClose } from 'react-icons/io5';
import BasicButton from '../../../components/BasicButton';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../../redux/alertSlice';

const CalibrationModal = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const [readings, setReadings] = useState({
    a1: '',
    b1: '',
    a2: '',
    b2: ''
  });

  const handleChange = (e) => {
    setReadings({ ...readings, [e.target.name]: e.target.value });
  };

  const calculateError = () => {
    // If any is missing
    if (!readings.a1 || !readings.b1 || !readings.a2 || !readings.b2) {
      dispatch(
        showAlert({
          type: "error",
          message: "Please enter all readings required for the Two-Peg Test.",
        })
      );
      return;
    }

    const a1 = parseFloat(readings.a1);
    const b1 = parseFloat(readings.b1);
    const a2 = parseFloat(readings.a2);
    const b2 = parseFloat(readings.b2);

    // Delta true from midpoint
    const trueHeightDiff = a1 - b1;
    // Apparent delta from peg
    const apparentHeightDiff = a2 - b2;
    // Difference (Error)
    const error = apparentHeightDiff - trueHeightDiff;

    if (Math.abs(error) > 0.003) {
      dispatch(
        showAlert({
          type: "error",
          message: `Collimation Error: ${error.toFixed(4)}m. Instrument requires physical adjustment.`,
        })
      );
    } else {
      dispatch(
        showAlert({
          type: "success",
          message: `Collimation Error: ${error.toFixed(4)}m. Instrument is within acceptable limits!`,
        })
      );
    }

    onClose();
    setReadings({ a1: '', b1: '', a2: '', b2: '' }); // Reset
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '28px',
          width: '100%',
          maxWidth: '420px',
          bgcolor: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ bgcolor: '#006FFD', p: 3.5, color: 'white', position: 'relative' }}>
        <Typography variant="h5" fontWeight={900} letterSpacing="-0.02em">
          Auto Level Calibration
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5, fontWeight: 500 }}>
          Enter Two-Peg Test readings to verify instrument collimation error.
        </Typography>
        
        <IconButton 
          onClick={onClose}
          sx={{ position: 'absolute', top: 12, right: 12, color: 'white' }}
        >
          <IoClose size={26} />
        </IconButton>
      </Box>

      <Box sx={{ p: 3.5 }}>
        <Stack spacing={3.5}>
          <Box>
            <Typography variant="subtitle2" color="rgb(0, 111, 253)" fontWeight={800} mb={1.5} letterSpacing="0.05em">
              SETUP 1 (MIDPOINT)
            </Typography>
            <Stack direction="row" spacing={2.5}>
              <TextField 
                label="Peg A1 (m)" 
                variant="outlined" 
                fullWidth 
                name="a1"
                type="number"
                value={readings.a1}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
              />
              <TextField 
                label="Peg B1 (m)" 
                variant="outlined" 
                fullWidth 
                name="b1"
                type="number"
                value={readings.b1}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
              />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="rgb(0, 111, 253)" fontWeight={800} mb={1.5} letterSpacing="0.05em">
              SETUP 2 (NEAR PEG A)
            </Typography>
            <Stack direction="row" spacing={2.5}>
              <TextField 
                label="Peg A2 (m)" 
                variant="outlined" 
                fullWidth 
                name="a2"
                type="number"
                value={readings.a2}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
              />
              <TextField 
                label="Peg B2 (m)" 
                variant="outlined" 
                fullWidth 
                name="b2"
                type="number"
                value={readings.b2}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
              />
            </Stack>
          </Box>

          <Box pt={1}>
            <BasicButton
              value="CALCULATE ERROR"
              fullWidth={true}
              onClick={calculateError}
              sx={{
                background: "linear-gradient(135deg, #006FFD 0%, #005ed6 100%)",
                color: "white",
                height: "60px",
                borderRadius: "20px",
                border: "none",
                fontWeight: 800,
                fontSize: "1.05rem",
                letterSpacing: "0.05em",
                boxShadow: "0 8px 20px -5px rgba(0, 111, 253, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #005ed6 0%, #004bbb 100%)",
                  boxShadow: "0 12px 25px -5px rgba(0, 111, 253, 0.5)",
                  transform: "translateY(-2px)"
                },
                "&:active": {
                  transform: "translateY(0)"
                }
              }}
            />
          </Box>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default CalibrationModal;
