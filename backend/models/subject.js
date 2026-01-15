import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },

    classesPerWeek: {
      type: Number,
      required: true,
      min: 1,
    },

    minAttendancePercent: {
      type: Number,
      default: 75,
    },

    classesConducted: {
      type: Number,
      default: 0,
      min: 0,
    },

    classesAttended: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);
