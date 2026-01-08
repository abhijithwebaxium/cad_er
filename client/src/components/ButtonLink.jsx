import Link from "@mui/material/Link";

export default function ButtonLink({ label, onClick }) {
  return (
    <Link
      component="button"
      variant="body2"
      onClick={onClick}
      underline="none"
      sx={{
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          width: "0%",
          height: "1px",
          bottom: 2,
          left: 0,
          backgroundColor: "currentColor",
          transition: "width 0.3s ease-in-out",
        },
        "&:hover::after": {
          width: "100%",
        },
      }}
    >
      {label}
    </Link>
  );
}
