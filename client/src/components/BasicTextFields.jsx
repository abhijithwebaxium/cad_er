import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function BasicTextFields({
  id,
  label,
  variant,
  sx,
  value,
  onChange,
  name,
  type,
}) {
  return (
    <Box
      noValidate
      autoComplete="off"
      sx={{
        '& .MuiOutlinedInput-root, & .MuiFilledInput-root': {
          borderRadius: '15px',
        },
        width: '100%',
      }}
    >
      <TextField
        id={id}
        label={label}
        variant={variant}
        sx={sx}
        value={value}
        onChange={onChange}
        name={name}
        type={type ? type : 'text'}
      />
    </Box>
  );
}
