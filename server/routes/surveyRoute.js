import express from 'express';

const router = express.Router();

import {
  addChainage,
  checkSurveyExists,
  createSurvey,
  getSurvey,
} from '../controllers/surveyController.js';

// Check survey exists
router.get('/exists', checkSurveyExists);

// Create a survey
router.post('/', createSurvey);

// Get a survey
router.get('/:id', getSurvey);

// Add chainage
router.post('/chainage', addChainage);

export default router;
