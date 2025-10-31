import TextField from '@mui/material/TextField';

export default function BasicTextFields({
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
  fullWidth
}) {
  return (
    <TextField
      label={error ? error : label}
      placeholder={placeholder}
      type={type ? type : 'text'}
      onChange={onChange}
      name={name}
      value={value}
      variant={variant}
      sx={sx}
      className={`${className} ${error && 'inp-err'}`}
      disabled={disabled}
      fullWidth={fullWidth || true}
    />
  );
}
