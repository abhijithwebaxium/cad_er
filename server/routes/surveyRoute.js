import express from 'express';

const router = express.Router();

import {
  checkSurveyExists,
  getAllSurvey,
  createSurvey,
  getSurvey,
  updateSurvey,
  deleteSurvey,
  addSurveyRow,
  updateSurveyRow,
  deleteSurveyRow,
  endSurvey,
} from '../controllers/surveyController.js';

// Survey routes
router.get('/exists', checkSurveyExists);
router.get('/', getAllSurvey);
router.post('/', createSurvey);
router.patch('/:id/end', endSurvey);
router.get('/:id', getSurvey);
router.patch('/:id', updateSurvey);
router.delete('/:id', deleteSurvey);

// Row routes (nested under a survey)
router.post('/:id/rows', addSurveyRow);
router.patch('/:id/rows/:rowId', updateSurveyRow);
router.delete('/:id/rows/:rowId', deleteSurveyRow);

export default router;
