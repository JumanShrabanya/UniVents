import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config();

// Connect to DB immediately when the function starts
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
  });

// Add a simple route
app.get("/", (req, res) => {
  res.send("Hello participants and organizers");
});

export default app;
