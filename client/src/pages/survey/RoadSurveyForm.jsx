import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import { MdArrowBackIosNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import SetChainage from './components/SetChainage';
import SetFollowingValues from './components/SetFollowingValues';

const RoadSurveyForm = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState(1);

  const handleGoBack = () => {
    setTab(tab - 1);
    if (tab === 1) {
      navigate('/');
    }
  };

  const handleSubmit = () => {};

  return (
    <Box padding={'24px'}>
      <Box
        sx={{
          border: '1px solid #EFEFEF',
          borderRadius: '9px',
          width: '40px',
          height: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={handleGoBack}
      >
        <MdArrowBackIosNew />
      </Box>
      {tab === 1 && <SetChainage setTab={setTab} />}
      {tab === 2 && <SetFollowingValues />}
    </Box>
  );
};

export default RoadSurveyForm;
