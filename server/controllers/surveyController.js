import Surveys from '../models/survey.js';
import createHttpError from 'http-errors';

const checkSurveyExists = async (req, res, next) => {
  try {
    const survey = await Surveys.findOne({ isSurveyFinish: false });

    res.status(200).json({
      success: true,
      message: `${survey ? 'Active survey found' : 'No active survey found'}`,
      survey,
    });
  } catch (err) {
    next(err);
  }
};

const getAllSurvey = async (req, res, next) => {
  try {
    const { status } = req.query;

    let filter = { deleted: false };

    if (status === 'active') {
      filter.isSurveyFinish = false;
    } else if (status === 'finished') {
      filter.isSurveyFinish = true;
    }

    const surveys = await Surveys.find(filter)
      .sort({ createdAt: -1 })
      // .populate('createdBy', 'name email')
      .lean();

    res.status(200).json({
      success: true,
      message:
        surveys.length > 0
          ? `${surveys.length} survey${surveys.length > 1 ? 's' : ''} found`
          : 'No surveys found',
      surveys,
    });
  } catch (err) {
    next(err);
  }
};

const createSurvey = async (req, res, next) => {
  try {
    const {
      body: {
        purpose,
        instrumentNo,
        reducedLevel,
        backSight,
        chainageMultiple,
        remark,
      },
    } = req;

    // Input validation
    if (
      !purpose ||
      !instrumentNo ||
      !reducedLevel ||
      !backSight ||
      !chainageMultiple
    ) {
      throw createHttpError(
        400,
        'All fields (purpose, instrumentNo, reducedLevel, backSight, chainageMultiple) are required'
      );
    }

    // Check if there’s already a running survey
    const isExist = await Surveys.findOne({ isSurveyFinish: false });
    if (isExist) {
      throw createHttpError(409, 'A survey is already in progress');
    }

    // Prepare rows
    const rows = [
      {
        type: 'Instrument setup',
        backSight: Number(backSight)?.toFixed(3),
      },
    ];

    const survey = await Surveys.create({
      purpose,
      instrumentNo,
      chainageMultiple,
      reducedLevel: Number(reducedLevel)?.toFixed(3),
      rows,
    });

    res.status(201).json({
      success: true,
      message: 'Survey created successfully',
      survey,
    });
  } catch (err) {
    next(err);
  }
};

const getSurvey = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;

    const survey = await Surveys.findOne({ _id: id, deleted: false });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'No active survey found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Active survey found',
      survey,
    });
  } catch (err) {
    next(err);
  }
};

const updateSurvey = () => {};
const deleteSurvey = () => {};

const addSurveyRow = async (req, res, next) => {
  try {
    const {
      body: {
        type,
        backSight,
        intermediateSight,
        foreSight,
        reducedLevel,
        chainage,
        roadWidth,
        offsets,
      },
    } = req;

    const types = {
      Chainage: ['chainage', 'roadWidth', 'intermediateSight', 'offsets'],
      CP: ['foreSight', 'backSight'],
      TBM: ['intermediateSight'],
    };

    // 🔸 Step 1: Validate row type
    if (!type) throw createHttpError(400, 'Row type is required');
    if (!Object.keys(types).includes(type))
      throw createHttpError(400, `Invalid row type: ${type}`);

    // 🔸 Step 2: Find active survey
    const survey = await Surveys.findOne({ isSurveyFinish: false });
    if (!survey) throw createHttpError(409, 'No active survey found');

    // 🔸 Step 3: Validate required fields based on type
    const requiredFields = types[type];
    const missingFields = requiredFields.filter((f) => {
      const value = req.body[f];
      return (
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      );
    });

    if (missingFields.length > 0) {
      throw createHttpError(
        400,
        `Missing required fields for type "${type}": ${missingFields.join(
          ', '
        )}`
      );
    }

    const remarks = [];

    if (type === 'Chainage') {
      const offsetsToMap = Array.isArray(offsets) ? offsets : [];

      offsetsToMap?.forEach((offset) => {
        const formattedOffset = Number(offset);
        let remark;

        if (formattedOffset < 0) {
          remark = 'LHS';
        } else if (formattedOffset === 0) {
          remark = 'PLS';
        } else {
          remark = 'RHS';
        }

        remarks.push(remark);
      });
    } else {
      remarks.push(type);
    }

    // 🔸 Step 4: Construct new row safely
    const newRow = {
      type,
      chainage: type === 'Chainage' ? chainage : undefined,
      roadWidth: roadWidth ? Number(roadWidth).toFixed(3) : undefined,
      backSight: backSight ? Number(backSight).toFixed(3) : undefined,
      foreSight: foreSight ? Number(foreSight).toFixed(3) : undefined,
      reducedLevel: reducedLevel ? Number(reducedLevel).toFixed(3) : undefined,
      remarks: remarks || '',
      intermediateSight:
        type === 'Chainage'
          ? Array.isArray(intermediateSight)
            ? intermediateSight.map((n) => Number(n).toFixed(3))
            : []
          : intermediateSight
          ? intermediateSight
          : [],
      offsets: Array.isArray(offsets)
        ? offsets.map((n) => Number(n).toFixed(3))
        : [],
    };

    // 🔸 Step 5: Push row
    survey.rows.push(newRow);

    await survey.save();

    res.status(200).json({
      success: true,
      message: 'Row added successfully',
      survey,
    });
  } catch (err) {
    next(err);
  }
};

const endSurvey = async (req, res, next) => {
  try {
    const { id } = req.params;

    const survey = await Surveys.findById(id);

    if (!survey || survey.deleted)
      throw createHttpError(404, 'Survey not found');
    if (survey.isSurveyFinish)
      throw createHttpError(400, 'Survey already finished');

    survey.isSurveyFinish = true;
    survey.surveyFinishDate = new Date();
    await survey.save();

    res
      .status(200)
      .json({ success: true, message: 'Survey ended successfully' });
  } catch (err) {
    next(err);
  }
};

const updateSurveyRow = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
const deleteSurveyRow = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

export {
  checkSurveyExists,
  getAllSurvey,
  createSurvey,
  endSurvey,
  getSurvey,
  updateSurvey,
  deleteSurvey,
  addSurveyRow,
  updateSurveyRow,
  deleteSurveyRow,
};
