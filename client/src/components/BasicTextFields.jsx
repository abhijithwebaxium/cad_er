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
  fullWidth,
  slotProps,
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
      sx={{
        ...sx,
        '& input[type=number]': {
          MozAppearance: 'textfield',
        },
        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
          {
            WebkitAppearance: 'none',
            margin: 0,
          },
      }}
      className={`${className} ${error && 'inp-err'}`}
      disabled={disabled}
      fullWidth={fullWidth || true}
      slotProps={slotProps}
    />
  );
}
