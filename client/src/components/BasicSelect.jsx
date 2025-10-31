import { MenuItem, TextField } from '@mui/material';

export default function BasicSelect({
  label,
  defaultValue,
  helperText,
  variant,
  options,
  fullWidth,
  onChange,
  name,
  value,
  sx,
  error,
  className,
  disabled,
}) {
  return (
    <TextField
      select
      defaultValue={defaultValue}
      helperText={helperText}
      variant={variant || 'filled'}
      fullWidth={fullWidth || true}
      label={error ? error : label}
      onChange={onChange}
      name={name}
      value={value}
      sx={sx}
      className={`${className} ${error && 'inp-err'}`}
      disabled={disabled}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
