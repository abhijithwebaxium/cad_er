import { Box, Stack, Typography } from '@mui/material';
import FollowingValues from '../../../assets/following_values.jpg';
import BasicTextFields from '../../../components/BasicTextFields';
import BasicButtons from '../../../components/BasicButton';

const SetFollowingValues = () => {
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
          label={'Backsight'}
          variant={'filled'}
          sx={{ width: '100%' }}
        />

        <BasicTextFields
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
          onClick={() => setTab(2)}
        />
      </Box>
    </Stack>
  );
};

export default SetFollowingValues;
