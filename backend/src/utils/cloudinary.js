import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { Readable } from "stream";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a file to Cloudinary
const uploadToCloudinary = async (fileBuffer, fileName) => {
  try {
    if (!fileBuffer) {
      throw new Error("No file provided for upload.");
    }

    // Convert buffer to a stream
    const stream = Readable.from(fileBuffer);

    // Create a promise to handle the upload stream
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto", // Automatically detect the file type
          public_id: fileName, // Use the original file name (this will be URL encoded)
        },
        (error, result) => {
          if (error) {
            reject(new Error("Cloudinary upload failed: " + error.message));
          } else {
            resolve(result);
          }
        }
      );

      // Pipe the buffer stream to the upload stream
      stream.pipe(uploadStream);
    });

    const result = await uploadPromise;
    console.log("Uploaded to Cloudinary:", result.secure_url);
    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    throw new Error("Failed to upload to Cloudinary");
  }
};

export { uploadToCloudinary };
