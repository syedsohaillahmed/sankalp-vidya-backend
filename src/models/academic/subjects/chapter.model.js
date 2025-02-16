import { model, Schema } from "mongoose";
import { type } from "os";

const chapterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
    },
    academicYear: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
    },
    notes: [
      {
        file: {
          type: String,
        },
        fileName: {
          type: String,
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
        uploadedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        author: {
          type: String,
        },
        unPublishedDate: {
          type: Date,
        },
        active: {
          type: Boolean,
          default: true,
        },
      },
    ],
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    unPublishedDate: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
);

export const Chapter = model("Subject", chapterSchema);
