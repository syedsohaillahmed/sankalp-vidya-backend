import mongoose, { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoName: {
      type: String,
      required: [true, "Video name is required."],
    },
    videoThumbnail: {
      type: String,
    },
    videoFile: {
      type: String,
      required: [true, "Video File is Required"],
    },
    videoDescription: {
      type: String,
    },
    chapterName: {
      type: String,
      required: [true, "Chapter name is required."],
    },
    subject: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1."],
      max: [5, "Rating must be at most 5."],
      default:null
    },
    videoRemarks: [
      {
        videoComment: {
          type: String,
        },
        commentedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        commentedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    videoQuality: [
      {
        QAVideoComment: {
          type: String,
        },
        QACommentedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        QACommentedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
    dislike: {
      type: Number,
      default: 0,
    },
    videoDuration: {
      type: Number,
    },
    videoType: {
      type: String,
    },

    views: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    author: {
      authorName: {
        type: String,
      },
      authorID: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    viewedBy: [
      {
        watchedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        watchedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = model("Video", videoSchema);
