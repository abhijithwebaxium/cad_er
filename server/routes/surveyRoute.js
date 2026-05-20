import express from "express";

const router = express.Router();

import {
  checkSurveyExists,
  getAllSurvey,
  createSurvey,
  queueSurvey,
  completeSurvey,
  getSurvey,
  updateSurvey,
  deleteSurvey,
  createSurveyRow,
  updateSurveyRow,
  deleteSurveyRow,
  endSurvey,
  getSurveyPurpose,
  endSurveyPurpose,
  getAllSurveyPurpose,
  createSurveyPurpose,
  pauseSurveyPurpose,
  generateSurveyPurpose,
  editSurveyPurpose,
  updateReducedLevels,
  createBranch,
  enterBranch,
  getFieldBook,
  createBreak,
  deleteSurveyPurpose,
} from "../controllers/surveyController.js";
import { isAuthenticated, requireAuth } from "../middleware/auth.js";

router.use(requireAuth, isAuthenticated);

// 🔹 Static routes
router.get("/exists", checkSurveyExists);
router.get("/purposes", getAllSurveyPurpose);

// 🔹 Survey routes
router.get("/", getAllSurvey);
router.post("/", createSurvey);
router.post("/queue", queueSurvey);
router.patch("/:id/end", endSurvey);
router.patch("/:id/complete", completeSurvey);
router.get("/:id", getSurvey);
router.patch("/:id", updateSurvey);
router.delete("/:id", deleteSurvey);
router.patch("/:id/reduced-levels/edit", updateReducedLevels);

// 🔹 Purpose routes (nested under a survey)
router.get("/:id/purposes", getSurveyPurpose);
router.get("/:id/purposes/field-book", getFieldBook);
router.post("/:surveyId/purposes", createSurveyPurpose);
router.delete("/:purposeId/purposes", deleteSurveyPurpose);
router.patch("/:id/purposes/end", endSurveyPurpose);
router.patch("/:id/purposes/pause", pauseSurveyPurpose);
router.post("/:id/purposes/generate", generateSurveyPurpose);
router.put("/:id/purposes/:purposeId/edit", editSurveyPurpose);

// 🔹 Row routes (nested under a survey)
router.post("/:id/rows", createSurveyRow);
router.patch("/:id/rows/:rowId", updateSurveyRow);
router.delete("/:id/rows/:rowId", deleteSurveyRow);
router.post("/:id/rows/break", createBreak);

// 🔹 Branch routes (nested under a survey)
router.post("/:surveyId/branches", createBranch);
router.post("/:surveyId/branches/enter-branch", enterBranch);

export default router;
