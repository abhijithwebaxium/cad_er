import Button from '@mui/material/Button';

export default function BasicButtons({ value, sx, fullWidth, onClick }) {
  return (
    <Button variant="contained" sx={sx} fullWidth={fullWidth} onClick={onClick}>
      {value}
    </Button>
  );
}
