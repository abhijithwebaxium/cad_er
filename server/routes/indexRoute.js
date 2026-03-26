import express from "express";

const router = express.Router();

import { isAuthenticated, requireAuth } from "../middleware/auth.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

import {
  loginUser,
  googleLogin,
  registerUser,
  logoutUser,
  getDashboard,
  registerAccountType,
  contactForm,
  scheduleDemoForm,
} from "../controllers/indexController.js";

router.post("/login", loginLimiter, loginUser);

router.post("/google", loginLimiter, googleLogin);

router.post("/register", loginLimiter, registerUser);

router.post("/register-account-type", requireAuth, registerAccountType);

router.get("/logout", logoutUser);

router.post("/contact", contactForm);

router.post("/schedule-demo", scheduleDemoForm);

router.use(requireAuth, isAuthenticated);

router.get("/", getDashboard);

export default router;
