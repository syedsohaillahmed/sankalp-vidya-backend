import { Schema, model } from "mongoose";

const ytVideoAttendanceSchema = new Schema({
  student: [{
    id: {
      type: Schema.Types.ObjectId,
      ref: "Student", // Reference to Student
      // required: true,
      // index: true, // Indexing for fast lookups
    },
    name: {
      type: String, // Store student name
      // required: true,
    },
    classGrade: {
      type: String, // Store class grade of student
    },
  }
  ],
  class: {
    id: { type: Schema.Types.ObjectId, ref: "Class" },
    name: { type: String },
    classGrade: { type: String },
  },
  chapter: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "Chapter", // Reference to Chapter
      required: true,
      // index: true, // Indexing for chapter-based queries
    },
    name: { type: String },
  },
  video: {
    id: {
      type: Schema.Types.ObjectId, // Store video _id from the videos array
      required: true,
      // index: true, // Indexing for video-specific queries
    },
    title: { type: String },
    videoUrl: { type: String },
    uploadDate: { type: Date },
    videoUploadedToSourceDate: { type: Date },
  },
  watchedAt: {
    type: Date,
    default: Date.now, // Timestamp when the student watched the video
  },
  durationWatched: {
    type: Number, // Time in seconds
  },
  completed: {
    type: Boolean,
    default: false, // True if video was watched completely
  },
  watched: {
    type: Boolean,
    default: false, // True if video was watched completely
  },
});

// 📌 Indexing for Faster Queries
ytVideoAttendanceSchema.index({ student: 1, "video.id": 1 }, { unique: true }); // Ensures a student can have only one attendance per video
ytVideoAttendanceSchema.index({ "video.id": 1 }); // Optimize queries that fetch students who watched a video
ytVideoAttendanceSchema.index({ student: 1 }); // Optimize queries for fetching all watched videos of a student
ytVideoAttendanceSchema.index({ "chapter.id": 1 }); // Optimize chapter-wise queries

export const YtVideoAttendance = model("YtVideoAttendance", ytVideoAttendanceSchema);
