import { Box, Stack, Typography } from '@mui/material';
import FollowingValues from '../../../assets/following_values.jpg';
import BasicTextFields from '../../../components/BasicTextFields';
import BasicButtons from '../../../components/BasicButton';

const SetFollowingValues = ({ setTab, onSubmit }) => {
  const handleSubmit = () => {
    const inpBackSight = document.getElementById('inp-back-sight');
    const inpReducedLevel = document.getElementById('inp-reduced-level');
    const inpName = document.getElementById('inp-project-name');

    const values = {
      backSight: inpBackSight.value,
      reducedLevel: inpReducedLevel.value,
      name: inpName.value,
    };

    onSubmit(values);
  };

  return (
    <Stack alignItems={'center'} spacing={5}>
      <Box className="set-chainage-img-wrapper">
        <img
          src={FollowingValues}
          srcSet={`${FollowingValues}?w=800 800w, ${FollowingValues}?w=1600 1600w, ${FollowingValues}?w=2400 2400w`}
          sizes="100vw"
          alt="landing"
          // loading="lazy"
          className="chainage-img"
        />
      </Box>

      <Stack alignItems={'center'}>
        <Typography fontSize={'26px'} fontWeight={700}>
          Please Send The Following Values
        </Typography>
        <Typography fontSize={'16px'} fontWeight={400} color="#434343">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        </Typography>
      </Stack>

      <Stack width={'100%'} spacing={3} className="input-wrapper">
        <BasicTextFields
          id={'inp-project-name'}
          label={'Project name'}
          variant={'filled'}
          sx={{ width: '100%' }}
        />

        <BasicTextFields
          id={'inp-back-sight'}
          label={'Backsight'}
          variant={'filled'}
          sx={{ width: '100%' }}
        />

        <BasicTextFields
          id={'inp-reduced-level'}
          label={'Reduced level'}
          variant={'filled'}
          sx={{ width: '100%' }}
        />
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

export default SetFollowingValues;
