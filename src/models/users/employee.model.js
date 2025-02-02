import mongoose, { Schema, Types, model } from "mongoose";

const employeeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  homeAddress: {
    street: { type: String },
    city: { type: String },
    zipCode: { type: String },
    state: { type: String },
    country: { type: String },
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  exitDate: {
    type: Date,
  },

  active: { type: Boolean, default:true },
  aadharId: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{12}$/, // Regular expression to ensure aadhar has exactly 12 digits
  },
  aadharImage: {
    type: String, // URL or file path for the Aadhar image
  },
  panId: {
    type: String,
    required: true,
    unique: true,
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

export const Employee = model("Employee", employeeSchema);
