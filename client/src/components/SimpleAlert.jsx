import Alert from '@mui/material/Alert';

export default function SimpleAlert({ icon, severity, message }) {
  return (
    <Alert icon={icon} severity={severity}>
      {message}
    </Alert>
  );
}
