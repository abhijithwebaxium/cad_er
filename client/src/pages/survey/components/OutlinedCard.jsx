import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';

export default function OutlinedCard({ card, selected, onClick }) {
  return (
    <Box
      maxWidth={154}
      className="landing-card"
      onClick={() => onClick(card.id)}
    >
      <Card className={`card-wrapper ${selected ? 'active' : ''}`}>
        <CardContent className="card-content">
          <Stack alignItems={'center'} spacing={1}>
            <Box className="icon-bg-area">{card.icon}</Box>
            <Typography fontSize={'16px'} fontWeight={700} textAlign={'center'}>
              {card.title}
            </Typography>
            <Typography
              fontSize={'10px'}
              fontWeight={300}
              color="#A7A7A7"
              textAlign={'center'}
            >
              {card.description}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
