import express from "express";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser());

// routes
import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";

// routes declaration
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/event", eventRoutes);
// localhost:8000/api/v1/users/registerClub
export { app };
