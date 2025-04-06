import mongoose from "mongoose";
import { Chapter } from "../models/academic/subjects/chapter.model.js";
// import { Chapter } from "../models/chapter.js"; // Adjust the path as needed

// const MONGO_URI = process.env.MONGODB_URI; // Replace with your actual MongoDB URI

const migrateVideosToArray = async () => {
    // console.log("MONGO_URI", process.env.MONGODB_URI)
  try {
    await mongoose.connect("mongodb+srv://sankalpvidya:sankalpvidya@svcluster.pbi64.mongodb.net", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Find all chapters where videos is an object
    const chapters = await Chapter.find();

    if (chapters.length === 0) {
      console.log("No chapters need migration.");
      return;
    }


    // for (const chapter of chapters) {
    //   chapter.videos = chapter.videos ? [chapter.videos] : [];
    //   await chapter.save();
    //   console.log(`Updated chapter: ${chapter._id}`);
    // }

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    mongoose.disconnect();
  }
};

migrateVideosToArray();
