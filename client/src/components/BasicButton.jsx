import Button from '@mui/material/Button';

export default function BasicButtons({ value, sx, fullWidth }) {
  return (
    <Button variant="contained" sx={sx} fullWidth={fullWidth}>
      {value}
    </Button>
  );
}
