import mongoose, { Schema, Types, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { type } from "os";

const TeacherSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  assignedSubjects: [{ type: mongoose.Types.ObjectId, ref: "Subject" }],
  assignedClasses: [{ type: mongoose.Types.ObjectId, ref: "Class" }],
  homeAddress: {
    street: { type: String },
    city: { type: String },
    zipCode: { type: String },
    state: { type: String },
    country: { type: String },
  },
  joiningDate: {
    type: Date,
    // required: true,
  },
  exitDate: {
    type: Date,
  },
  academicYear: {
    type: mongoose.Types.ObjectId,
    ref: "AcademicYear",
  },

  active: { type: Boolean, default: true },
  aadharId: {
    type: String,
    unique: true,
    match: /^[0-9]{12}$/, // Regular expression to ensure aadhar has exactly 12 digits
    sparse: true,

  },
  aadharImage: {
    type: String, // URL or file path for the Aadhar image
  },
  panId: {
    type: String,
    unique: true,
    sparse: true,

  },
  panImage: {
    type: String, // URL or file path for the Aadhar image
  },
  academicDocuments: [
    {
      documentImage: {
        type: String,
      },
      documentName: {
        type: String,
      },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  employementDocuments: [
    {
      documentImage: {
        type: String,
      },
      documentName: {
        type: String,
      },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  previousAnnualSalary: {
    basicSalary: {
      type: Number,
    },
    totalSalary: {
      type: Number,
    },
    currency: {
      type: String,
    },
    currencySymbol: {
      type: String,
    },
  },
});

TeacherSchema.plugin(mongooseAggregatePaginate);

export const Teacher = model("Teacher", TeacherSchema);
