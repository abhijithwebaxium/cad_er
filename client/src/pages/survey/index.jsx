import { Box, Stack, Typography } from '@mui/material';
import LandingImg from '../../assets/landing.png';
import OutlinedCard from '../../components/OutlinedCard';
import BasicButtons from '../../components/BasicButton';
import { FaRoad } from 'react-icons/fa6';
import { FaWater } from 'react-icons/fa';
import { useState } from 'react';

const cardData = [
  {
    id: 0,
    icon: <FaRoad fontSize={'26px'} color="#B8B8B8" />,
    title: 'Road survey',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem',
  },
  {
    id: 1,
    icon: <FaWater fontSize={'26px'} color="#B8B8B8" />,
    title: 'Waterbodies',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem',
  },
];

const Index = () => {
  const [active, setActive] = useState(0);

  const handleChangeActive = (value) => setActive(value);

  return (
    <Box>
      <Stack spacing={5}>
        <Box className="landing-img-wrapper">
          <img
            srcSet={`${LandingImg}?w=248&fit=crop&auto=format&dpr=2 2x`}
            src={`${LandingImg}?w=248&fit=crop&auto=format`}
            alt="landing"
            loading="lazy"
            className="landing-img"
          />
        </Box>

        <Stack alignItems={'center'}>
          <Typography fontSize={'26px'} fontWeight={700}>
            Welcome
          </Typography>
          <Typography fontSize={'16px'} fontWeight={400} color="#434343">
            What type of survey do you want to perform?
          </Typography>
        </Stack>

        <Stack direction={'row'} justifyContent={'center'} px={'24px'} gap={3}>
          {cardData.map((data, idx) => (
            <OutlinedCard
              key={idx}
              card={data}
              selected={idx === active}
              onClick={handleChangeActive}
            />
          ))}
        </Stack>

        <Box px={'24px'}>
          <BasicButtons
            value={'Continue'}
            sx={{ backgroundColor: '#0059E7', height: '45px' }}
            fullWidth={true}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default Index;
