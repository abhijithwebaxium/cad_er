import { Box, Stack, Typography } from '@mui/material';
import Chainage from '../../../assets/chainage.png';
import BasicTextFields from '../../../components/BasicTextFields';
import BasicButtons from '../../../components/BasicButton';

const SetChainage = ({ setTab, formValues, setFormValues, onSubmit }) => {
  const handleSubmit = () => {
    if (!formValues) {
      setTab(2);
    } else {
      setTab(3);
    }

    const inputBasic = document.querySelector('#input-basic');

    onSubmit(inputBasic.value, 'Chainage');
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
          Please Set The Chainage:
        </Typography>
        <Typography fontSize={'16px'} fontWeight={400} color="#434343">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        </Typography>
      </Stack>

      <Box width={'100%'} className="input-wrapper">
        <BasicTextFields
          id={'input-basic'}
          label={'Number'}
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
    </Stack>
  );
};

export default SetChainage;
