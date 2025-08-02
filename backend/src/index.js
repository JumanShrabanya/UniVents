import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config();
const port = process.env.PORT || 8000;

// db connnet
connectDB().then(() => {
  try {
    // app listen
    app.get("/", (req, res) => {
      res.send("Hello students and organizers");
    });
    app.listen(port, () => {
      console.log("Server is running on port: ", port);
    });
  } catch (error) {
    console.error("mongodb connection failed ⚠️⚠️", error);
  }
});
