import Link from '@mui/material/Link';

export default function ButtonLink({ label, onClick }) {
  return (
    <Link component="button" variant="body2" onClick={onClick}>
      {label}
    </Link>
  );
}
