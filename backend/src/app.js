import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend origin
    credentials: true, // Allow credentials like cookies
  })
);

app.use(express.json());
app.use(cookieParser());

// routes
import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";
import studentDashboardRoutes from "./routes/studentDashboard.routes.js";
import orgDashboardRoutes from "./routes/orgDashboard.routes.js";

// routes declaration
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/event", eventRoutes);
app.use("/app", studentDashboardRoutes);
app.use("/dashboard-organizer", orgDashboardRoutes);
// localhost:8000/api/v1/users/registerClub

export { app };
