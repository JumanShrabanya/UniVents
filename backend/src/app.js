import express from "express";

const app = express();

// routes
import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
// localhost:8000/api/v1/users/register
export { app };
