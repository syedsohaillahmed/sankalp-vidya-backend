import { model, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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

academicYearSchema.plugin(mongooseAggregatePaginate);

export const AcademicYear = model("AcademicYear", academicYearSchema);
