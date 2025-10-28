import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { MdArrowBackIosNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import SetChainage from './components/SetChainage';
import SetFollowingValues from './components/SetFollowingValues';
import IntermediateSight from './components/IntermediateSight';
import Output from './components/Output';
import {
  addChainage,
  checkSurveyExists,
  createSurvey,
} from '../../services/surveyServices';

const RoadSurveyForm = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState(1);

  const [formValues, setFormValues] = useState(null);

  const [otherValues, setOtherValues] = useState(null);

  const handleGoBack = () => {
    if (otherValues) return;

    setTab(tab - 1);
    if (tab === 1) {
      navigate('/');
    }
  };

  const handleCreateSurvey = async (values) => {
    try {
      const { data } = await createSurvey(values);

      if (data.success) {
        return setTab(2);
      }

      throw Error('Something went wrong.');
    } catch (err) {
      console.log(err);
    }
  };

  const handleSetOtherValues = (values) => {
    setOtherValues(values);

    handleCreateSurvey(values);
  };

  const handleSubmit = async (value, type, action) => {
    // if no form values yet, initialize safely depending on the type
    if (!formValues) {
      if (type === 'Chainage') {
        setFormValues({
          1: { chainage: value.chainage, roadWidth: value.roadWidth, is: [] },
        });
      }

      return;
    }

    const length = Object.keys(formValues).length;

    if (type === 'Chainage') {
      const nextKey = length + 1;
      setFormValues((prev) => ({
        ...prev,
        [nextKey]: {
          chainage: value.chainage,
          roadWidth: value.roadWidth,
          is: [],
        },
      }));
    } else {
      // append value immutably to the latest entry's values array
      const lastKey = length; // keys start at 1 and are consecutive
      let lastChainage = null;

      setFormValues((prev) => {
        const updated = { ...prev };

        updated[lastKey] = {
          ...updated[lastKey],
          is: [...value.iSValues],
          offset: [...value.offsetValues],
        };

        lastChainage = updated[lastKey];
        return updated;
      });

      try {
        const { data } = await addChainage({ ...lastChainage, action });

        if (!data.success) throw Error('Something went wrong.');

        if (action === 'finish') {
          navigate(`/survey/road-survey-tbm/${data?.survey?._id}`);
        } else {
          setTab(2);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await checkSurveyExists();

      if (data) {
        setOtherValues({
          backSight: data?.backSight || 0,
          reducedLevel: data?.reducedLevel || 0,
          roadWidth: data?.roadWidth || 0,
        });

        if (data?.tbm?.length) {
          const updatedData = data?.tbm?.map((entry, index) => {
            return {
              [index + 1]: {
                entry,
              },
            };
          });

          setFormValues(...updatedData);
        }

        setTab(2);
      }
    };

    fetchData();
  }, []);

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
          mb: '24px',
        }}
        onClick={handleGoBack}
      >
        <MdArrowBackIosNew />
      </Box>
      {tab === 1 && (
        <SetFollowingValues setTab={setTab} onSubmit={handleSetOtherValues} />
      )}
      {tab === 2 && (
        <SetChainage
          setTab={setTab}
          formValues={formValues}
          onSubmit={handleSubmit}
        />
      )}
      {tab === 3 && (
        <IntermediateSight
          setTab={setTab}
          formValues={formValues}
          onSubmit={handleSubmit}
        />
      )}
    </Box>
  );
};

export default RoadSurveyForm;
