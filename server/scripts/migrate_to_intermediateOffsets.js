import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import SurveyRow from "../models/surveyRows.js";

async function runMigration() {
  const mongoUri =
    process.env.MONGO_URI || "mongodb://localhost:27017/dev-test";
  console.log("Connecting to MongoDB:", mongoUri);

  await mongoose.connect(mongoUri);
  console.log("Connected successfully.");

  const rows = await SurveyRow.find({});
  console.log(`Found ${rows.length} total survey rows to process.`);

  let migratedCount = 0;

  for (const row of rows) {
    let modified = false;

    // 1. Convert Chainage/Water Level rows
    if (row.type === "Chainage" || row.type === "Water Level") {
      // Access direct database document keys since Mongoose schema might filter/hide them
      const rawDoc = row.toObject({ depopulate: true });
      const oldOffsets = rawDoc.offsets || [];
      const oldISs = rawDoc.intermediateSight || [];
      const oldRemarks = rawDoc.remarks || [];

      // Check if we need to migrate
      if (
        oldOffsets.length > 0 &&
        (!row.intermediateOffsets || row.intermediateOffsets.length === 0)
      ) {
        const intermediateOffsets = oldOffsets.map((offset, i) => ({
          is: String(oldISs[i] ?? ""),
          offset: String(offset ?? ""),
          remark: String(oldRemarks[i] ?? ""),
          mode: "R",
        }));

        row.intermediateOffsets = intermediateOffsets;

        // Clear old parallel arrays from the document so they don't persist
        row.set("offsets", undefined);
        row.set("remarks", undefined);
        row.set("intermediateSight", undefined);

        modified = true;
      }
    } else {
      // 2. Convert non-chainage rows (Instrument setup, TBM, CP)
      const rawDoc = row.toObject({ depopulate: true });
      const oldRemarks = rawDoc.remarks || [];

      if (oldRemarks.length > 0 && !row.remark) {
        row.remark = oldRemarks[0] || "";
        row.set("remarks", undefined);
        modified = true;
      }
    }

    if (modified) {
      await row.save();
      migratedCount++;
    }
  }

  console.log(
    `Migration complete! Successfully updated ${migratedCount} rows.`,
  );
  await mongoose.disconnect();
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
