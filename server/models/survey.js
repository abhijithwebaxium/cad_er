import mongoose from 'mongoose';

const SurveySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: mongoose.Types.ObjectId },
    backSight: { type: String, required: true },
    reducedLevel: { type: String, required: true },
    tbm: [
      {
        chainage: {
          type: String,
          required: true,
        },
        roadWidth: { type: String, required: true },
        is: {
          type: Array,
          required: true,
        },
        offset: {
          type: Array,
          required: true,
        },
      },
    ],
    isSurveyFinish: {
      type: Boolean,
      default: false,
      index: true,
    },
    surveyFinishDate: Date,
    history: [
      {
        type: {
          type: String,
          required: true,
          default: 'Edit',
          enum: ['Edit'],
        },
        staff: { type: mongoose.Types.ObjectId, required: true },
        date: { type: Date, required: true, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Survey', SurveySchema);
