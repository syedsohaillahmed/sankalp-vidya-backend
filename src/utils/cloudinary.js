import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const uploadOnCloudinary = async (localfilePath) => {
  try {
    if (!localfilePath) {
      console.log("cloudinary local path not found")
      return null;
    }

    const uploadedCloudinarydata = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto",
    });
    console.log("localfilePath",localfilePath)
    console.log("uploadedCloudinarydata", uploadedCloudinarydata)
    fs.unlinkSync(localfilePath);
    return uploadedCloudinarydata;
  } catch (error) {
    fs.unlinkSync(localfilePath);
    console.log("error while uploading file on cloudinary", error);
    return null;
  }
};


export {uploadOnCloudinary}