import { Router } from "express";
import {
  createOpening,
  getAllOpenings,
  getOpeningsByCompany,
} from "../controllers/openingController.js";

import { isAuthenticated, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getAllOpenings);

router.use(requireAuth, isAuthenticated);

router.post("/", createOpening);
router.get("/:companyId", getOpeningsByCompany);

export default router;
