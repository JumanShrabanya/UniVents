import { ApiError } from "../utils/ApiError.js";

const Authorization = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "Access denied"));
    }
    next();
  };
};

export default Authorization;
