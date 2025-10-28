import Surveys from '../models/survey.js';

const checkSurveyExists = async (req, res, next) => {
  try {
    const survey = await Surveys.findOne({ isSurveyFinish: false });

    res.status(200).json(survey);
  } catch (err) {
    next(err);
  }
};

const createSurvey = async (req, res, next) => {
  try {
    const {
      body: { backSight, reducedLevel, name },
    } = req;

    const isExist = await Surveys.findOne({ isSurveyFinish: false });
    if (isExist) throw Error('Already a survey in progress');

    await Surveys.create({
      name,
      backSight,
      reducedLevel,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

const getSurvey = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;

    const survey = await Surveys.findOne({ _id: id, isSurveyFinish: true });

    res.status(200).json(survey);
  } catch (err) {
    next(err);
  }
};

const addChainage = async (req, res, next) => {
  try {
    const {
      body: { chainage, roadWidth, is, offset, action },
    } = req;

    const survey = await Surveys.findOne({ isSurveyFinish: false });
    if (!survey) throw Error('No survey available');

    survey.tbm.push({
      chainage,
      roadWidth,
      is,
      offset,
    });

    if (action === 'finish') {
      survey.isSurveyFinish = true;
    }

    await survey.save();

    res.status(200).json({ success: true, survey });
  } catch (err) {
    next(err);
  }
};

export { checkSurveyExists, createSurvey, getSurvey, addChainage };
