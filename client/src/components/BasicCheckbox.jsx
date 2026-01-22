import Checkbox from "@mui/material/Checkbox";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function BasicCheckbox({
  id = "",
  defaultChecked,
  checked,
  onChange,
  name = "",
}) {
  return (
    <div>
      <Checkbox
        {...label}
        id={id}
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange}
        name={name}
      />
    </div>
  );
}
