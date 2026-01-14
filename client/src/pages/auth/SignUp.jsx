import * as React from "react";
import * as Yup from "yup";
import {
  Box,
  Divider,
  Link,
  Typography,
  Stack,
  Card as MuiCard,
  IconButton,
  Container,
  useMediaQuery,
} from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { styled, useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUserGraduate, FaUserTie } from "react-icons/fa";
import { GoogleIcon } from "./components/CustomIcons";

import { showAlert } from "../../redux/alertSlice";
import { stopLoading } from "../../redux/loadingSlice";
import { handleFormError } from "../../utils/handleFormError";
import { googleLogin, registerUser } from "../../services/indexServices";
import BasicButtons from "../../components/BasicButton";
import BasicInput from "../../components/BasicInput";
import Logo from "../../assets/logo/CADer logo-main.png";
import Logo2 from "../../assets/logo/CADer logo-loader.png";
import BackgroundImage from "../../assets/background-img.png";
import BackgroundImage2 from "../../assets/back-ground-img.png";
import { setUser } from "../../redux/userSlice";

/* =========================
   Styled Components
========================= */
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  maxWidth: "450px",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
}));

/* =========================
   Validation Schema
========================= */
const schema = Yup.object().shape({
  name: Yup.string().required("Full name is required"),
  email: Yup.string()
    .trim()
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      "Please enter a valid email address"
    )
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string().min(6).required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

const initialFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignUp() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formValues, setFormValues] = React.useState(initialFormValues);
  const [formErrors, setFormErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  React.useEffect(() => {
    dispatch(stopLoading());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prev) => {
      const newValues = { ...prev, [name]: value };

      // Validate the current field with full form context
      Yup.reach(schema, name)
        .validate(value, { context: newValues, parent: newValues })
        .then(() => {
          setFormErrors((p) => ({ ...p, [name]: null }));
        })
        .catch((err) => {
          setFormErrors((p) => ({ ...p, [name]: err.message }));
        });

      // If confirmPassword is being changed, also re-validate password
      if (name === "password" && newValues.confirmPassword) {
        Yup.reach(schema, "confirmPassword")
          .validate(newValues.confirmPassword, {
            context: newValues,
            parent: newValues,
          })
          .then(() => {
            setFormErrors((p) => ({ ...p, confirmPassword: null }));
          })
          .catch((err) => {
            setFormErrors((p) => ({ ...p, confirmPassword: err.message }));
          });
      }

      return newValues;
    });
  };

  const handleSuccessLogin = (user) => {
    const message = "Signup successful!";

    dispatch(setUser(user));

    dispatch(
      showAlert({
        type: "success",
        message,
      })
    );

    navigate("/onboarding/account-type");
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await schema.validate(formValues, { abortEarly: false });
      const { data } = await registerUser(formValues);

      handleSuccessLogin(data.user);
    } catch (error) {
      handleFormError(error, setFormErrors, dispatch, navigate);
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { data } = await googleLogin({
        accessToken: tokenResponse.access_token,
        action: "register",
      });

      handleSuccessLogin(data.user);
    },
    onError: () => {
      showAlert({
        type: "error",
        message: "Google sign-in failed",
      });
    },
  });

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          display: "flex",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${BackgroundImage2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.25,
            zIndex: 0,
            pointerEvents: "none",
            display: { xs: "block", md: "none" },
          }}
        />
        {/* LEFT SIDE */}
        <Box
          sx={{
            width: {
              xs: "100%",
              md: "40%",
              xl: "50%",
            },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: { xs: 2, md: 3 },
          }}
        >
          <Card sx={{ zIndex: 1 }}>
            <img src={Logo2} alt="logo" width={100} />

            <Typography
              component="h1"
              variant="h4"
              sx={{ width: "100%", fontSize: "clamp(1.5rem, 10vw, 1.6rem)" }}
            >
              Sign up
            </Typography>

            <Stack spacing={2}>
              <BasicInput
                label="Full Name"
                name="name"
                value={formValues.name}
                error={formErrors.name}
                onChange={handleInputChange}
                variant="filled"
              />

              <BasicInput
                label="Email"
                name="email"
                value={formValues.email}
                error={formErrors.email}
                onChange={handleInputChange}
                variant="filled"
              />

              {/* Password */}
              <Box position="relative">
                <BasicInput
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formValues.password}
                  error={formErrors.password}
                  onChange={handleInputChange}
                  variant="filled"
                />
                <IconButton
                  onClick={() => setShowPassword((p) => !p)}
                  sx={{ position: "absolute", top: 25, right: 8 }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </IconButton>
              </Box>

              {/* Confirm Password */}
              <Box position="relative">
                <BasicInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formValues.confirmPassword}
                  error={formErrors.confirmPassword}
                  onChange={handleInputChange}
                  variant="filled"
                />
                <IconButton
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  sx={{ position: "absolute", top: 25, right: 8 }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </IconButton>
              </Box>

              <BasicButtons
                value="Create Account"
                fullWidth
                loading={loading}
                onClick={handleSubmit}
                sx={{
                  textTransform: "none",
                  height: "2.5rem",
                  color: "white",
                  backgroundColor: "hsl(220, 35%, 3%)",
                  backgroundImage:
                    "linear-gradient(to bottom, hsl(220, 20%, 25%), hsl(220, 30%, 6%))",
                  boxShadow:
                    "inset 0 1px 0 hsl(220, 20%, 35%), inset 0 -1px 0 1px hsl(220, 0%, 0%)",
                  border: "1px solid hsl(220, 20%, 25%)",
                  "&:hover": {
                    backgroundImage: "none",
                    backgroundColor: "rgb(51, 60, 77)",
                    boxShadow: "none",
                  },
                }}
              />

              <Divider>or</Divider>

              {/* ✅ Google Register Button */}
              <BasicButtons
                fullWidth={true}
                variant="outlined"
                onClick={() => googleAuth()}
                startIcon={<GoogleIcon />}
                value={"Sign in with Google"}
                sx={{
                  textTransform: "none",
                  height: "2.5rem",
                  color: "black",
                  backgroundColor: "#f5f6fa4d",
                  boxShadow: "none",
                  transition:
                    "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                  border: "1px solid hsl(220, 20%, 88%)",
                  "&:hover": {
                    backgroundImage: "none",
                    backgroundColor: "hsl(220, 30%, 94%)",
                    borderColor: "hsl(220, 20%, 80%)",
                  },
                }}
              />
            </Stack>

            <Typography textAlign="center">
              Already have an account?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/login")}
              >
                Sign in
              </Link>
            </Typography>
          </Card>
        </Box>
        {/* RIGHT SIDE */}
        {!isMobile && (
          <Box
            sx={{
              width: {
                xs: "0%",
                md: "60%",
                xl: "50%",
              },
              display: { xs: "none", md: "block" },
              position: "relative",
              overflow: "hidden",
              background:
                "linear-gradient(217.64deg, #0A3BAF -5.84%, #0025A0 106.73%)",
              borderTopLeftRadius: "60px",
              borderBottomLeftRadius: "60px",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${BackgroundImage})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "2500px",
                opacity: 0.3,
              }}
            />

            <Box
              sx={{
                backdropFilter: "blur(1.6px)",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "70%",
                  height: "70%",
                  borderRadius: "46px",
                  border: "1px solid #FFFFFF85",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgb(0 12 51 / 20%)",
                }}
              >
                <Stack justifyContent="center" alignItems="center" p={2}>
                  <img
                    src={Logo}
                    alt="logo"
                    style={{ width: "200px", marginBottom: "25px" }}
                  />

                  <Typography color="white" textAlign="center">
                    CADer makes your surveying work easier and more efficient.
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    </>
  );
}
