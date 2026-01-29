import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const BranchSchema = new Schema({
  surveyId: { type: Types.ObjectId, ref: "Survey", required: true },
  createdBy: { type: Types.ObjectId, ref: "User", required: true },
  name: { type: String, trim: true },
  hasBranching: { type: Boolean, default: false },
  branchStartedFrom: { type: String, trim: true },
  rootBranch: { type: Types.ObjectId, ref: "Survey" },
  parentBranch: { type: Types.ObjectId, ref: "Survey" },
  finishedLevels: { type: Array, default: [] },
  isBranchStart: { type: Boolean, default: false },
  startDate: { type: Date, default: Date.now },
  isBranchEnd: { type: Boolean, default: false },
  endDate: { type: Date },
  deleted: { type: Boolean, default: false, index: true },
});

BranchSchema.virtual("purposes", {
  ref: "SurveyPurpose",
  localField: "surveyId",
  foreignField: "surveyId",
});

BranchSchema.set("toObject", { virtuals: true });
BranchSchema.set("toJSON", { virtuals: true });

export default model("Branch", BranchSchema);
