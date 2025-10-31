import mongoose from 'mongoose';

const RowSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Instrument setup', 'Chainage', 'TBM', 'CP'],
      required: true,
    },
    backSight: String,
    intermediateSight: [String],
    foreSight: String,
    chainage: String,
    roadWidth: String,
    offsets: [String],
    remarks: [String],
    deleted: { type: Boolean, default: false },
  },
  { _id: false }
);

const HistorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Update'],
      default: 'Update',
    },
    staff: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { _id: false }
);

const SurveySchema = new mongoose.Schema(
  {
    type: { type: String, required: true, default: 'Road Survey', index: true },
    purpose: { type: String, required: true },
    instrumentNo: { type: String, required: true },
    chainageMultiple: { type: Number, required: true },
    reducedLevel: { type: String, required: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    rows: [RowSchema],
    isSurveyFinish: { type: Boolean, default: false, index: true },
    DateOfSurvey: { type: Date, default: Date.now, required: true },
    surveyFinishDate: Date,
    history: [HistorySchema],
    deleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Survey', SurveySchema);
