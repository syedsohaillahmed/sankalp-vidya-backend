import { model, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoLiveSessionLinkSchema = new Schema(
  {
    videoName: {
      type: String,
      required: [true, "Video name is required."],
    },
    videoThumbnail: {
      type: String,
    },
    videoDescription: {
      type: String,
    },
    videoLink: {
      type: String,
      required: [true, "Video Link is required."],
    },
    embededLink: {
      type: String,
    },
    otherLink: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1."],
      max: [5, "Rating must be at most 5."],
    },
    videoComments: [
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
    likes: {
      type: Number,
      default: 0,
    },
    dislike: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
    },
    videoLinkCreatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    viewedBy: [
      {
        watchedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        userRole: {
          type: String,
        },
        watchedAt: { type: Date, default: Date.now },
      },
    ],
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
    },
    academicYear: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
    },
  },
  { timestamps: true }
);

videoLiveSessionLinkSchema.plugin(mongooseAggregatePaginate);

export const VideoLiveSessionLink = model(
  "VideoLiveSessionLink",
  videoLiveSessionLinkSchema
);
