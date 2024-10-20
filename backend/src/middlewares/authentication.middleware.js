import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const Authentication = (req, res, next) => {
  const token =
    jwt.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ApiError(401, "Unauthorized"));
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid token."));
  }
};

export default Authentication;
