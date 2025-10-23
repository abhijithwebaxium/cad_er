import Button from '@mui/material/Button';

export default function BasicButtons({
  value,
  sx,
  fullWidth,
  onClick,
  variant,
}) {
  return (
    <Button
      variant={variant ? variant : 'contained'}
      sx={sx}
      fullWidth={fullWidth}
      onClick={onClick}
    >
      {value}
    </Button>
  );
}
