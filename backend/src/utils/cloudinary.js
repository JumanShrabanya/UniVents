import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import { response } from "express";
import fs from "fs";

(async function () {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
  });
})();

// function to upload a file to cloudinary
const uploadToCloudinary = async (localFile) => {
  try {
    if (!localFile) {
      return null;
    }
    const response = await cloudinary.uploader.upload(localFile, {
      resource_type: "auto",
    });
    console.log("uploaded to cloudinary", response.url);
    return response;
  } catch (error) {
    // remove the locally saved file if the upload fails
    console.error("Cloudinary upload failed:", error.message);
    if (fs.existsSync(localFile)) {
      fs.unlinkSync(localFile);
    }
    throw new Error("Failed to upload to Cloudinary");
  }
};

export { uploadToCloudinary };
