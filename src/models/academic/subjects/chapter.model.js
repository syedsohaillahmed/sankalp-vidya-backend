import { model, Schema } from "mongoose";

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
      id: {
        type: Schema.Types.ObjectId,
        ref: "Subject",
      },
      displayName: {
        type: String,
      },
      board: {
        type: String,
      },
    },
    class: {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Class",
      },
      name: {
        type: String,
      },
      classGrade: {
        type: String,
      },
    },
    academicYear: {
      id: {
        type: Schema.Types.ObjectId,
        ref: "AcademicYear",
      },
      displayName: {
        type: String,
      },
      batchName: {
        type: String,
      },
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
    videos: {
      videoEmbededLink: {
        type: String,
      },
      title:{
        type:String
      },
      videoUrl: {
        type: String,
      },
      description:{
        type:String
      },
      videoSource: {
        type: String,
      },
      author: {
        type: String,
      },
      uploadDate: {
        type: Date,
      },
      videoUploadedToSourceDate: {
        type: Date,
      },
    },
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

export const Chapter = model("Chapter", chapterSchema);
