import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function BasicCheckbox({ defaultChecked, checked, onChange }) {
  return (
    <div>
      <Checkbox
        {...label}
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
}
