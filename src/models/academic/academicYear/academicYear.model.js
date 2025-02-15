import { model, Schema } from "mongoose";

const academicYearSchema = new Schema(
  {
    academicYear: {
      type: String,
      required: true,
    },
    batchCode: {
      type: String,
    },
    batchName: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    active: {
      type: Boolean,
    },
    inActiveDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const AcademicYear = model("AcademicYear", academicYearSchema);
