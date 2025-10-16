import { ApiError } from "../utils/ApiError.js";

// Determine role based on objects set by verifyJwt
// req.student => "student", req.club => "organizer"
const getUserRole = (req) => {
  if (req.student) return "student";
  if (req.club) return "organizer";
  return req.user?.role; // fallback if set elsewhere
};

const Authorization = (requiredRole) => {
  return (req, res, next) => {
    const role = getUserRole(req);
    if (!requiredRole) return next();
    if (!role || role !== requiredRole) {
      return next(new ApiError(403, "Access denied"));
    }
    next();
  };
};

export default Authorization;
