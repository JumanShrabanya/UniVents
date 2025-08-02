import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faPeopleGroup,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  faEye as faEyeRegular,
  faEyeSlash as faEyeSlashRegular,
} from "@fortawesome/free-regular-svg-icons";
import { AuthContext } from "../contexts/Authcontext";
import { registerUser } from "../services/RegisterUser";
import LoadingSpinner from "../components/LoadingSpinner";

const OrganizerRegistrationPage = () => {
  const [passwordType, setPasswordType] = useState(true);
  const { setLogedIn, setRole } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    collegeName: "",
    clubName: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setPasswordType((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (formData.password.length > 15) {
      newErrors.password = "Password must be less than 16 characters long";
    } else if (!/[!@#$%^&*()_+\-={}\[\]<>,.?/]/.test(formData.password)) {
      newErrors.password = "Password must contain special characters";
    }

    // College name validation
    if (!formData.collegeName.trim()) {
      newErrors.collegeName = "College name is required";
    }

    // Club name validation
    if (!formData.clubName.trim()) {
      newErrors.clubName = "Club name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerUser(formData, "organizer");

      if (response.status === 201) {
        setRole("organizer");
        setLogedIn(true);
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setErrors({
        message: err.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-superLightBlue to-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo p-4 rounded-full">
              <FontAwesomeIcon
                icon={faPeopleGroup}
                className="text-white text-2xl"
              />
            </div>
          </div>
          <h1 className="text-3xl font-mainFont font-bold text-indigo mb-2">
            Register as Organizer
          </h1>
          <p className="text-gray-600">
            Create and manage amazing events for your college community
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo transition-all ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 focus:border-indigo"
                }`}
                placeholder="your.email@college.edu"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* College Name Field */}
            <div>
              <label
                htmlFor="collegeName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                College Name *
              </label>
              <input
                id="collegeName"
                name="collegeName"
                type="text"
                value={formData.collegeName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo transition-all ${
                  errors.collegeName
                    ? "border-red-500"
                    : "border-gray-300 focus:border-indigo"
                }`}
                placeholder="Your College Name"
              />
              {errors.collegeName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.collegeName}
                </p>
              )}
            </div>

            {/* Club Name Field */}
            <div>
              <label
                htmlFor="clubName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Club Name *
              </label>
              <input
                id="clubName"
                name="clubName"
                type="text"
                value={formData.clubName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo transition-all ${
                  errors.clubName
                    ? "border-red-500"
                    : "border-gray-300 focus:border-indigo"
                }`}
                placeholder="e.g., Arts & Crafts Club"
              />
              {errors.clubName && (
                <p className="text-red-500 text-sm mt-1">{errors.clubName}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={passwordType ? "password" : "text"}
                  value={formData.password}
                  onChange={handleInputChange}
                  maxLength={15}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo transition-all ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300 focus:border-indigo"
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={handleTogglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon
                    icon={passwordType ? faEyeRegular : faEyeSlashRegular}
                  />
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Password must be 8-15 characters with special characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo text-white py-3 px-6 rounded-lg font-medium hover:bg-indigoHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner />
                  Creating Account...
                </div>
              ) : (
                "Create Organizer Account"
              )}
            </button>

            {/* Error Message */}
            {errors.message && (
              <div className="text-center">
                <p className="text-red-500 text-sm">{errors.message}</p>
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-indigo hover:text-indigoHover font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerRegistrationPage;
