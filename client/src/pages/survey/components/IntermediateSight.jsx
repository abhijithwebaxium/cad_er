import { Box, Stack, Typography } from '@mui/material';
import BasicTextFields from '../../../components/BasicTextFields';
import BasicButtons from '../../../components/BasicButton';
import { useState } from 'react';

const IntermediateSight = ({ setTab, formValues, setFormValues, onSubmit }) => {
  const [show, setShow] = useState(false);

  const addChainage = () => {
    setTab(1);

    const inputBasic = document.querySelector('#input-basic');

    onSubmit(inputBasic.value, 'Intermediate Sight');
  };

  const handleSubmit = () => {
    const inputBasic = document.querySelector('#input-basic');

    onSubmit(inputBasic.value, 'Intermediate Sight');
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
        <BasicTextFields
          id={'input-basic'}
          label={'0'}
          variant={'filled'}
          sx={{ width: '100%', borderRadius: '15px !important' }}
        />
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
              {value.chainage}: {value.values}
            </div>
          );
        })}
    </Stack>
  );
};

export default IntermediateSight;
