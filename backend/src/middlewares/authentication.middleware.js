import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const Authentication = (req, res, next) => {
  console.log("Cookies received:", req.cookies);
  const token = req.cookies.accessToken;

  if (!token) {
    console.log("No accessToken found in cookies");
    throw new ApiError(401, "No token found, authorization denied.");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Token decoded:", decoded); // Be cautious with logging sensitive info
    req.user = decoded; // Attach the decoded user information to the request object
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message); // Log only relevant info
    throw new ApiError(401, "Token is not valid");
  }
};

export default Authentication;
