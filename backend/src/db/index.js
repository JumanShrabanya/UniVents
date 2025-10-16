import mongoose from "mongoose";
import { db_name } from "../constants.js";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    const baseUri = process.env.MONGODB_URI;
    if (!baseUri) {
      throw new Error("MONGODB_URI is not set");
    }

    const connectionInstance = await mongoose.connect(`${baseUri}/${db_name}`);
    console.log(
      `mongoDB conneted. DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
};

export default connectDB;
