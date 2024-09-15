import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

const port = process.env.PORT || 8000;

dotenv.config({
  path: "./env",
});

// db connnet
connectDB().then(() => {
  try {
    // app listen
    app.listen(port, () => {
      console.log("Server is running on port: ", port);
    });
  } catch (error) {
    console.error("mongodb connection failed ⚠️⚠️", error);
  }
});
