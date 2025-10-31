import Button from '@mui/material/Button';

export default function BasicButtons({
  value,
  sx,
  fullWidth,
  onClick,
  variant,
  loading,
  loadingIndicator,
}) {
  return (
    <Button
      variant={variant ? variant : 'contained'}
      sx={sx}
      fullWidth={fullWidth}
      onClick={onClick}
      loading={loading}
      loadingIndicator={loadingIndicator || 'Loading…'}
    >
      {value}
    </Button>
  );
}
