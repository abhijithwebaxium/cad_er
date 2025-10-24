import { Box } from '@mui/material';
import { useState } from 'react';
import { MdArrowBackIosNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import SetChainage from './components/SetChainage';
import SetFollowingValues from './components/SetFollowingValues';
import IntermediateSight from './components/IntermediateSight';

const RoadSurveyForm = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState(1);

  const [formValues, setFormValues] = useState(null);

  const handleGoBack = () => {
    setTab(tab - 1);
    if (tab === 1) {
      navigate('/');
    }
  };

  const handleSubmit = (value, type) => {
    // if no form values yet, initialize safely depending on the type
    if (!formValues) {
      if (type === 'Chainage') {
        setFormValues({ 1: { chainage: value, values: [] } });
      } else {
        setFormValues({ 1: { chainage: '', values: [value] } });
      }
      return;
    }

    const length = Object.keys(formValues).length;

    if (type === 'Chainage') {
      const nextKey = length + 1;
      setFormValues((prev) => ({
        ...prev,
        [nextKey]: {
          chainage: value,
          values: [],
        },
      }));
    } else {
      // append value immutably to the latest entry's values array
      const lastKey = length; // keys start at 1 and are consecutive
      setFormValues((prev) => {
        const updated = { ...prev };
        const prevValues = Array.isArray(updated[lastKey].values)
          ? updated[lastKey].values
          : [];
        updated[lastKey] = {
          ...updated[lastKey],
          values: [...prevValues, value],
        };

        return updated;
      });
    }
  };

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
          mb: '24px'
        }}
        onClick={handleGoBack}
      >
        <MdArrowBackIosNew />
      </Box>
      {tab === 1 && (
        <SetChainage
          setTab={setTab}
          formValues={formValues}
          setFormValues={setFormValues}
          onSubmit={handleSubmit}
        />
      )}
      {tab === 2 && (
        <SetFollowingValues
          setTab={setTab}
          formValues={formValues}
          setFormValues={setFormValues}
          onSubmit={handleSubmit}
        />
      )}
      {tab === 3 && (
        <IntermediateSight
          setTab={setTab}
          formValues={formValues}
          setFormValues={setFormValues}
          onSubmit={handleSubmit}
        />
      )}
    </Box>
  );
};

export default RoadSurveyForm;
