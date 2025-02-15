import { model, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoLinkSchema = new Schema({
    videoLink:{
        type:String,
        required: [true, "Video Link is required."],
    },
    embededLink:{
        type:String
    },
    otherLink:{
        type:String
    },
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
      chapterName: {
        type: String,
        required: [true, "Chapter name is required."],
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
      videoQualityRemarks: [
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
      videoUnPublishedDate: {
        type: Date,
      },
      class:{
        type: Schema.Types.ObjectId,
          ref: "Class",
      },
      subject:{
        type: Schema.Types.ObjectId,
          ref: "Subject",
      },
      academicYear:{
        type: Schema.Types.ObjectId,
          ref: "AcademicYear",
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
          userRole: {
            type: String,
          },
          watchedAt: { type: Date, default: Date.now },
        },
      ],
    

},
{
    timestamps:true
})

videoLinkSchema.plugin(mongooseAggregatePaginate)

export const VideoLink = model("VideoLink", videoLinkSchema)