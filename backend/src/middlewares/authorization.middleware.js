import { ApiError } from "../utils/ApiError.js";

const Authorization = ({ role }) => {
  return (req, res, next) => {
    if (!role === "organizer") {
      return next(new ApiError(403, "Access denied"));
    }
    next();
  };
};

export default Authorization;
