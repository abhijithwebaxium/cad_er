import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      //   required: true,
    },
    status: {
      type: String,
      //   required: true,
    },
    size: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Company", CompanySchema);
