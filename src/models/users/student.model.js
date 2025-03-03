import mongoose, { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { type } from "os";

// Define the Students schema
const studentsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    motherName: {
      type: String,
      // required: true,
    },
    fatherName: {
      type: String,
      // required: true,
    },
    caste: {
      casteName: {
        type: String,
        // required: true,
      },
      category: {
        type: String,
        // required: true,
      },
      casteCertificateImage: {
        type: String,
      },
    },
    income: {
      annualIncome: {
        type: Number,
      },
      currency: {
        type: String,
      },
      currencySymbol: {
        type: String,
      },
      incomeCertificateImage: {
        type: String,
      },
    },

    schoolName: {
      type: String,
      // required: true,
    },
    schoolAddress: {
      street: { type: String },
      city: { type: String },
      zipCode: { type: String },
      state: { type: String },
      country: { type: String },
    },
    // Home Address as a nested object with individual fields
    homeAddress: {
      street: { type: String },
      city: { type: String },
      zipCode: { type: String },
      state: { type: String },
      country: { type: String },
    },
    aadharId: {
      type: String,
      // required: true,
      unique: true,
      sparse: true,

      match: /^[0-9]{12}$/, // Regular expression to ensure aadhar has exactly 12 digits
    },
    aadharImage: {
      type: String, // URL or file path for the Aadhar image
    },
    panId: {
      type: String,
      // required: true,
      unique: true,
      sparse: true,
    },
    panImage: {
      type: String, // URL or file path for the Aadhar image
    },
    fathersOccupation: {
      type: String,
      // required: true,
    },
    mothersOccupation: {
      type: String,
      // required: true,
    },
    role: {
      id: {
        type: mongoose.Types.ObjectId,
        ref: "Role",
      },
      displayName: {
        type: String,
      },
    },
    class: {
      id: {
        type: mongoose.Types.ObjectId,
        ref: "Class",
      },
      classGrade: {
        type: String,
      },
      displayName: {
        type: String,
      },
    },
    academicYear: {
      id: {
        type: mongoose.Types.ObjectId,
        ref: "AcademicYear",
      },
      displayName: {
        type: String,
      },
      batchName: {
        type: String,
      },
    },
    subjectsEnrolled: [
      {
        subjectId: {
          type: mongoose.Types.ObjectId,
          ref: "Subject",
        },
        name: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    studentId: {
      type: String,
      // required: true,
      unique: true,
      sparse: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

studentsSchema.plugin(mongooseAggregatePaginate);

// Create the Students model
export const Student = model("Student", studentsSchema);
