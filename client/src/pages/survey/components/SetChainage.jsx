import { Box, Stack, Typography } from '@mui/material';
import Chainage from '../../../assets/chainage.png';
import BasicTextFields from '../../../components/BasicTextFields';
import BasicButtons from '../../../components/BasicButton';
import { useState } from 'react';

const SetChainage = ({ setTab, formValues, onSubmit }) => {
  const initialFormData = {
    chainage: formValues ? '' : '0/000',
    roadWidth: '',
    roadWidthDivision: 2,
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = ({ target: { name, value } }) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = () => {
    setTab(3);

    onSubmit(formData, 'Chainage');
  };

  return (
    <Stack alignItems={'center'} spacing={5}>
      <Box className="set-chainage-img-wrapper">
        <img
          src={Chainage}
          srcSet={`${Chainage}?w=800 800w, ${Chainage}?w=1600 1600w, ${Chainage}?w=2400 2400w`}
          sizes="100vw"
          alt="landing"
          // loading="lazy"
          className="chainage-img"
        />
      </Box>

      <Stack alignItems={'center'}>
        <Typography fontSize={'26px'} fontWeight={700}>
          Please Set The {!formValues ? 'First' : ''} Chainage:
        </Typography>
        <Typography fontSize={'16px'} fontWeight={400} color="#434343">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        </Typography>
      </Stack>

      <Stack width={'100%'} spacing={3} className="input-wrapper">
        <BasicTextFields
          id={'input-basic'}
          label={'Number'}
          variant={'filled'}
          value={formData?.chainage}
          sx={{ width: '100%', borderRadius: '15px !important' }}
          onChange={(e) => handleInputChange(e)}
          name={'chainage'}
        />

        <Stack direction={'row'} spacing={2} alignItems={'center'}>
          <BasicTextFields
            id={'inp-road-width'}
            label={'Road width (For measuring offset)'}
            variant={'filled'}
            sx={{ width: '100%' }}
            onChange={(e) => handleInputChange(e)}
            name={'roadWidth'}
            value={formData?.roadWidth}
            type={'number'}
          />
          <Typography fontSize={'16px'} fontWeight={700} color="#434343">
            /
          </Typography>
          <BasicTextFields
            id={'inp-road-width-division'}
            label={'Division'}
            variant={'filled'}
            sx={{ width: '100%' }}
            value={formData?.roadWidthDivision}
            onChange={(e) => handleInputChange(e)}
            name={'roadWidthDivision'}
            type={'number'}
          />
        </Stack>
      </Stack>

      <Box px={'24px'} className="landing-btn" width={'100%'}>
        <BasicButtons
          value={'Continue'}
          sx={{ backgroundColor: '#0059E7', height: '45px' }}
          fullWidth={true}
          onClick={handleSubmit}
        />
      </Box>
    </Stack>
  );
};

export default SetChainage;
