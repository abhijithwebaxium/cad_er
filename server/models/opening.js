import mongoose from "mongoose";

const { Schema, model } = mongoose;

const OpeningSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    stipend: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    deadline: {
      type: Date,
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default model("Opening", OpeningSchema);
