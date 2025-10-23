import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function BasicTextFields({ label, variant, sx }) {
  return (
    <Box
      noValidate
      autoComplete="off"
      sx={{
        '& .MuiOutlinedInput-root, & .MuiFilledInput-root': {
          borderRadius: '15px',
        },
      }}
    >
      <TextField id="filled-basic" label={label} variant={variant} sx={sx} />
    </Box>
  );
}
