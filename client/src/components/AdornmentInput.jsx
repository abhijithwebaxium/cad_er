import { OutlinedInput } from '@mui/material';

export default function AdornmentInput({
  label,
  placeholder,
  type,
  onChange,
  name,
  value,
  variant,
  sx,
  error,
  className,
  disabled,
}) {
  return (
    <OutlinedInput
      label={label}
      placeholder={placeholder}
      type={type ? type : 'text'}
      onChange={onChange}
      name={name}
      value={value}
      variant={variant}
      sx={sx}
      className={className}
      disabled={disabled}
      endAdornment={<InputAdornment position="end">kg</InputAdornment>}
      aria-describedby="outlined-weight-helper-text"
      inputProps={{
        'aria-label': 'weight',
      }}
    />
  );
}
