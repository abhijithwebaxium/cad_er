import { Box, Stack, Typography } from '@mui/material';
import BasicTextFields from '../../../components/BasicTextFields';
import BasicButtons from '../../../components/BasicButton';
import { useState } from 'react';
import { IoAdd } from 'react-icons/io5';

const initialIs = { id: 1, value: 0 };

const IntermediateSight = ({ setTab, formValues, setFormValues, onSubmit }) => {
  const [show, setShow] = useState(false);
  const [iS, setIs] = useState([initialIs]);

  const handleInputChange = ({ target: { value, id } }) => {
    const updateIs = iS.map((entry) => {
      if (entry.id == id) {
        return {
          ...entry,
          value,
        };
      }

      return entry;
    });

    setIs(updateIs);
  };

  const addChainage = () => {
    setTab(1);

    const values = iS.map((entry) => entry.value);

    onSubmit(values, 'Intermediate Sight');
  };

  const handleClickAddNew = () => {
    const newRow = { ...initialIs, id: iS.length + 1 };

    setIs((prev) => [...prev, newRow]);
  };

  const handleSubmit = () => {
    const values = iS.map((entry) => entry.value);

    onSubmit(values, 'Intermediate Sight');
    setShow(true);
  };

  return (
    <Stack alignItems={'center'} spacing={5}>
      <Box px={'24px'} className="landing-btn" width={'100%'}>
        <Stack direction={'row'} gap={2}>
          <BasicButtons
            value={'Add Chainage'}
            sx={{ backgroundColor: '#0059E7', height: '45px' }}
            fullWidth={true}
            onClick={addChainage}
          />
          <BasicButtons
            value={'Add CP'}
            sx={{
              border: '1px solid #0059E7',
              height: '45px',
              color: '#0059E7',
              fontWeight: '700',
            }}
            fullWidth={true}
            variant={'outlined'}
          />
        </Stack>
      </Box>

      <Stack alignItems={'center'}>
        <Typography fontSize={'26px'} fontWeight={700}>
          Enter Intermediate Sight (IS)
        </Typography>
        <Typography fontSize={'16px'} fontWeight={400} color="#434343">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        </Typography>
      </Stack>

      <Box width={'100%'} className="input-wrapper">
        <Stack spacing={2}>
          {iS?.map((entry, idx) => (
            <Stack
              key={idx}
              direction={'row'}
              alignItems={'center'}
              spacing={1}
            >
              <BasicTextFields
                id={entry.id}
                variant={'filled'}
                sx={{ width: '100%', borderRadius: '15px !important' }}
                value={entry.value}
                onChange={(e) => handleInputChange(e)}
              />

              {iS.length - 1 === idx && (
                <Box className="add-new-sight" onClick={handleClickAddNew}>
                  <IoAdd fontSize={'24px'} color="#0059E7" />
                </Box>
              )}
            </Stack>
          ))}
        </Stack>
      </Box>

      <Box px={'24px'} className="landing-btn" width={'100%'}>
        <BasicButtons
          value={'Continue'}
          sx={{ backgroundColor: '#0059E7', height: '45px' }}
          fullWidth={true}
          onClick={handleSubmit}
        />
      </Box>

      {show &&
        Object.entries(formValues).map(([key, value], index) => {
          return (
            <div key={index}>
              {value.chainage}: {value.values?.join(', ')}
            </div>
          );
        })}
    </Stack>
  );
};

export default IntermediateSight;
