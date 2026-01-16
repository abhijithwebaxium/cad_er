import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: String,
    website: String,
    location: String,
    logo: String,
    status: String,
    size: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default model("Company", CompanySchema);
