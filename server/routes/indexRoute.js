import express from "express";

const router = express.Router();

import { isAuthenticated, requireAuth } from "../middleware/auth.js";

import {
  loginUser,
  googleLogin,
  registerUser,
  logoutUser,
  getDashboard,
  registerAccountType,
  contactForm,
} from "../controllers/indexController.js";

router.post("/login", loginUser);

router.post("/google", googleLogin);

router.post("/register", registerUser);

router.post("/register-account-type", requireAuth, registerAccountType);

router.get("/logout", logoutUser);

router.post("/contact", contactForm);

router.use(requireAuth, isAuthenticated);

router.get("/", getDashboard);

export default router;
