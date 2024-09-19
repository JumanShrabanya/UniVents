import express from "express";

const app = express();

app.use(express.json());

// routes
import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
// localhost:8000/api/v1/users/registerClub
export { app };
