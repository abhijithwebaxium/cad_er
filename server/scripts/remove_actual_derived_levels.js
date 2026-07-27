import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import SurveyPurpose from "../models/surveyPurpose.js";
import SurveyRow from "../models/surveyRows.js";
import Survey from "../models/survey.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const apply = process.argv.includes("--apply");

async function runMigration() {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/test";
  await mongoose.connect(mongoUri);

  const actualPurposes = await SurveyPurpose.find({
    phase: { $in: ["Actual", null] },
  }).lean();
  const actualPurposeIds = actualPurposes.map((purpose) => purpose._id);

  const surveyIds = [...new Set(actualPurposes.map((purpose) => String(purpose.surveyId)))];
  const surveys = await Survey.find({ _id: { $in: surveyIds } })
    .select("_id reducedLevel")
    .lean();
  const surveyStartMap = new Map(
    surveys.map((survey) => [String(survey._id), survey.reducedLevel]),
  );
  const purposeBackfills = [];

  for (const purpose of actualPurposes) {
    if (purpose.startingReducedLevel !== undefined) continue;

    const instrumentRow = await SurveyRow.findOne({
      purposeId: purpose._id,
      type: "Instrument setup",
    })
      .select("reducedLevels")
      .lean();
    const startingReducedLevel =
      instrumentRow?.reducedLevels?.[0] ??
      surveyStartMap.get(String(purpose.surveyId));

    if (startingReducedLevel !== undefined) {
      purposeBackfills.push({
        updateOne: {
          filter: { _id: purpose._id },
          update: {
            $set: {
              startingReducedLevel: Number(startingReducedLevel).toFixed(3),
            },
          },
        },
      });
    }
  }
  const filter = {
    purposeId: { $in: actualPurposeIds },
    $or: [
      { reducedLevels: { $exists: true } },
      { heightOfInstrument: { $exists: true } },
    ],
  };
  const affectedRows = await SurveyRow.countDocuments(filter);

  console.log(
    `${affectedRows} Actual survey rows contain derived RL/HI fields.`,
  );
  console.log(
    `${purposeBackfills.length} Actual purposes need a starting RL backfill.`,
  );

  if (!apply) {
    console.log("Dry run only. Re-run with --apply to remove those fields.");
    return;
  }

  if (purposeBackfills.length) {
    await SurveyPurpose.bulkWrite(purposeBackfills);
  }
  const result = await SurveyRow.updateMany(filter, {
    $unset: { reducedLevels: "", heightOfInstrument: "" },
  });
  console.log(`Updated ${result.modifiedCount} Actual survey rows.`);
}

runMigration()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
