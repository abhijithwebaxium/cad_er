import { motion, AnimatePresence } from 'framer-motion';
import { Box, Stack, Typography, Paper, Container } from '@mui/material';
import BasicButton from '../../components/BasicButton';
import { FaRoad } from 'react-icons/fa6';
import { FaWater } from 'react-icons/fa';
import { SiLevelsdotfyi } from 'react-icons/si';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stopLoading } from '../../redux/loadingSlice';
import { showAlert as showGlobalAlert } from '../../redux/alertSlice';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowForward } from 'react-icons/io';
import { IoCheckmarkCircle } from 'react-icons/io5';
import BigHeader from '../../components/BigHeader';
import { SlTarget } from 'react-icons/sl';
import SimpleAlert from '../../components/SimpleAlert';
import { GoAlert } from 'react-icons/go';
import CalibrationModal from './components/CalibrationModal';

const alertData = {
  icon: <GoAlert fontSize="inherit" />,
  severity: 'error',
  message: 'Work in progress!',
};

const cardData = [
  {
    id: 0,
    icon: <FaRoad fontSize={'32px'} color="inherit" />,
    title: 'Road survey',
    color: '#6366f1', // Indigo
  },
  {
    id: 1,
    icon: <FaWater fontSize={'32px'} color="inherit" />,
    title: 'Water way',
    color: '#0ea5e9', // Blue
  },
  {
    id: 2,
    icon: <SiLevelsdotfyi fontSize={'32px'} color="inherit" />,
    title: 'Fly level',
    color: '#10b981', // Emerald
  },
];

const Index = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [active, setActive] = useState(0);
  const [isCalibrationOpen, setCalibrationOpen] = useState(false);

  const handleChangeActive = (value) => setActive(value);

  const handleSubmit = () => {
    if (active > 0) {
      dispatch(
        showGlobalAlert({
          type: "error",
          message: "Work in progress!",
        })
      );
      return;
    }
    navigate('/survey/road-survey');
  };

  useEffect(() => {
    dispatch(stopLoading());
  }, [dispatch]);

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: { xs: 20, md: 24 } }}>
      <BigHeader />

      <CalibrationModal open={isCalibrationOpen} onClose={() => setCalibrationOpen(false)} />

      <Container maxWidth="sm" sx={{ pt: { xs: 4, md: 6 } }}>

        {/* Top Calibration Card */}
        <motion.div 
          onClick={() => setCalibrationOpen(true)}
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
        >
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 2, md: 3 },
              mb: 6,
              borderRadius: '24px',
              cursor: 'pointer',
              bgcolor: '#006FFD',
              color: 'white',
              boxShadow: '0 12px 24px -10px rgba(0, 111, 253, 0.5)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 16px 32px -10px rgba(0, 111, 253, 0.7)',
                bgcolor: '#005ed6'
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography fontSize={{ xs: '1.1rem', md: '1.25rem' }} fontWeight={800} letterSpacing="0.05em">
                CALIBRATION
              </Typography>
              <SlTarget strokeWidth="50px" fontSize="26px" fontWeight={900} />
            </Stack>
          </Paper>
        </motion.div>

        <Box textAlign="center" mb={6}>
          <Typography
            variant="h4"
            fontWeight={900}
            color="#1e293b"
            mb={1}
            sx={{ letterSpacing: '-0.02em', fontSize: { xs: '1.8rem', md: '2.25rem' } }}
          >
            Select Survey Type
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight={600} sx={{ maxWidth: '80%', mx: 'auto' }}>
            What type of survey do you want to perform using Auto Level?
          </Typography>
        </Box>

        <Stack spacing={3}>
          {cardData.map((data, idx) => {
            const isActive = idx === active;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1, type: "spring", stiffness: 300, damping: 24 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Paper
                  elevation={isActive ? 8 : 0}
                  onClick={() => handleChangeActive(idx)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: { xs: 2, md: 3 },
                    borderRadius: '24px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    bgcolor: '#ffffff',
                    border: isActive 
                      ? `2px solid ${data.color}` 
                      : '2px solid transparent',
                    boxShadow: isActive 
                      ? `0 12px 30px -10px ${data.color}80` 
                      : '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -2px rgba(0,0,0,0.04)',
                    '&:hover': {
                      borderColor: isActive ? data.color : '#cbd5e1',
                      boxShadow: isActive 
                        ? `0 20px 40px -12px ${data.color}90` 
                        : '0 10px 15px -3px rgba(0,0,0,0.05)',
                    }
                  }}
                >
                  {/* Active Background Tint */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      bgcolor: isActive ? `${data.color}0A` : '#f8fafc',
                      transition: 'background-color 0.4s ease',
                      zIndex: 0
                    }}
                  />

                  {/* Icon Box */}
                  <Box 
                    sx={{ 
                      width: { xs: 70, md: 80 }, 
                      height: { xs: 70, md: 80 }, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: isActive ? `${data.color}15` : '#ffffff',
                      color: isActive ? data.color : '#94a3b8',
                      borderRadius: '20px',
                      p: 1.5,
                      mr: { xs: 2.5, md: 3 },
                      position: 'relative',
                      zIndex: 1,
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      boxShadow: isActive ? `0 8px 20px -5px ${data.color}40` : '0 2px 10px rgba(0,0,0,0.03)'
                    }}
                  >
                    {data.icon}
                  </Box>

                  {/* Text content */}
                  <Box sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
                    <Typography 
                      fontWeight={900} 
                      fontSize={{ xs: "1.1rem", md: "1.25rem" }}
                      color={isActive ? '#1e293b' : '#64748b'}
                      sx={{ transition: 'color 0.3s ease', letterSpacing: '-0.02em', mb: 0.5 }}
                    >
                      {data.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color={isActive ? data.color : "text.secondary"}
                      fontWeight={700}
                      sx={{ opacity: isActive ? 1 : 0.6, fontSize: { xs: '0.75rem', md: '0.85rem' } }}
                    >
                      {isActive ? "Selected Survey" : "Tap to select"}
                    </Typography>
                  </Box>

                  {/* Radio / Checkmark */}
                  <Box sx={{ position: 'relative', zIndex: 1, ml: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isActive ? (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <IoCheckmarkCircle size={36} color={data.color} />
                      </motion.div>
                    ) : (
                      <Box 
                        sx={{ 
                          width: 28, 
                          height: 28, 
                          borderRadius: '50%', 
                          border: '2px solid #cbd5e1', 
                          mr: 0.5,
                          transition: 'all 0.3s ease'
                        }} 
                      />
                    )}
                  </Box>
                </Paper>
              </motion.div>
            );
          })}
        </Stack>

      </Container>

      {/* Floating Action Button purely hovering at the bottom */}
      <Box 
        sx={{ 
          position: 'fixed', 
          bottom: { xs: 24, md: 32 }, 
          left: 0, 
          right: 0, 
          display: 'flex', 
          justifyContent: 'center',
          pointerEvents: 'none', 
          zIndex: 1000
        }}
      >
        <Container maxWidth="sm" sx={{ pointerEvents: 'none', px: { xs: 2, sm: 3 } }}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ width: "100%", pointerEvents: 'auto' }}
          >
            <BasicButton
              value={
                <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                  <Typography fontSize="1.1rem" fontWeight={900} letterSpacing="0.05em">
                    CONTINUE
                  </Typography>
                  <IoIosArrowForward fontSize="22px" />
                </Stack>
              }
              sx={{
                background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                color: "white",
                height: { xs: "64px", md: "72px" },
                borderRadius: "100px",
                border: "none",
                boxShadow: "0 15px 35px -5px rgba(99, 102, 241, 0.5)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)",
                  boxShadow: "0 20px 40px -5px rgba(99, 102, 241, 0.6)",
                },
              }}
              fullWidth={true}
              onClick={handleSubmit}
            />
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Index;
