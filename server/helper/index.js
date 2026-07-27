import mongoose from "mongoose";

export const isValidObjectId = (id) => {
  if (!id) return false;
  if (typeof id === "object" && id instanceof mongoose.Types.ObjectId)
    return true;
  return mongoose.Types.ObjectId.isValid(id);
};

const asPlainObject = (value) =>
  value?.toObject ? value.toObject({ virtuals: true }) : value;

const fixed = (value) =>
  Number.isFinite(Number(value)) ? Number(value).toFixed(3) : null;

/**
 * Calculates the derived levelling state for a purpose in row order.
 * Actual-purpose RL/HI values are always derived from observations. Proposal
 * RL values are design inputs and are therefore returned unchanged.
 */
export const calculateSurveyRows = (
  rows = [],
  startingReducedLevel = 0,
  phase = "Actual",
) => {
  if (phase === "Proposal") {
    return rows.map((row) => asPlainObject(row));
  }

  let hi = 0;
  let rl = Number(startingReducedLevel || 0);
  let lastWaterLevelRL = null;

  return rows.map((sourceRow) => {
    const row = asPlainObject(sourceRow);
    let reducedLevels = [];
    let intermediateOffsets = row.intermediateOffsets || [];

    switch (row.type) {
      case "Instrument setup":
        rl = Number(startingReducedLevel || 0);
        hi = rl + Number(row.backSight || 0);
        reducedLevels = [fixed(rl)];
        break;

      case "Chainage":
        reducedLevels = (row.intermediateOffsets || []).map((entry) =>
          fixed(
            entry.mode === "S" && lastWaterLevelRL !== null
              ? lastWaterLevelRL - Number(entry.is || 0)
              : hi - Number(entry.is || 0),
          ),
        );
        if (reducedLevels.length) {
          rl = Number(reducedLevels.at(-1));
        }
        intermediateOffsets = intermediateOffsets.map((entry, index) => ({
          ...entry,
          rl: reducedLevels[index],
        }));
        break;

      case "TBM":
      case "Water Level":
        reducedLevels = (row.intermediateSight || []).map((is) =>
          fixed(hi - Number(is || 0)),
        );
        if (reducedLevels.length) {
          rl = Number(reducedLevels.at(-1));
          if (row.type === "Water Level") lastWaterLevelRL = rl;
        }
        break;

      case "CP":
        rl = hi - Number(row.foreSight || 0);
        hi = rl + Number(row.backSight || 0);
        reducedLevels = [fixed(rl)];
        break;

      default:
        break;
    }

    return {
      ...row,
      intermediateOffsets,
      reducedLevels: reducedLevels.filter((value) => value !== null),
      heightOfInstrument: fixed(hi),
    };
  });
};

export const calculatePurposeRows = (purpose, startingReducedLevel) => {
  if (!purpose) return purpose;

  const plainPurpose = asPlainObject(purpose);
  return {
    ...plainPurpose,
    rows: calculateSurveyRows(
      plainPurpose.rows || [],
      plainPurpose.startingReducedLevel ?? startingReducedLevel,
      plainPurpose.phase,
    ),
  };
};

/**
 * Decorates populated survey data without persisting derived actual RL/HI.
 * Branch surveys use their own starting reduced level.
 */
export const calculateSurveyData = (survey) => {
  if (!survey) return survey;

  const plainSurvey = asPlainObject(survey);
  const decorate = (surveyData) => {
    if (!surveyData) return surveyData;

    const plain = asPlainObject(surveyData);
    const startingReducedLevel =
      plain.reducedLevel ?? plain.surveyId?.reducedLevel ?? 0;
    return {
      ...plain,
      purposes: (plain.purposes || []).map((purpose) =>
        calculatePurposeRows(purpose, startingReducedLevel),
      ),
      ...(Array.isArray(plain.branches)
        ? { branches: plain.branches.map((branch) => decorate(branch)) }
        : {}),
    };
  };

  return decorate(plainSurvey);
};

/**
 * Backward-compatible helper for the create-row preview path.
 */
export const calculateReducedLevel = (survey, newReading, purposeId) => {
  const purpose = survey?.purposes?.find(
    (entry) => String(entry._id) === String(purposeId),
  );

  if (!purpose) return { hi: null, rl: [] };

  const existingRows =
    purpose.status === "Paused"
      ? (purpose.rows || []).slice(0, -1)
      : purpose.rows || [];
  const calculatedRows = calculateSurveyRows(
    [...existingRows, newReading],
    purpose.startingReducedLevel ?? survey.reducedLevel,
    purpose.phase,
  );
  const calculatedReading = calculatedRows.at(-1);

  return {
    hi: calculatedReading?.heightOfInstrument || null,
    rl: calculatedReading?.reducedLevels || [],
  };
};
