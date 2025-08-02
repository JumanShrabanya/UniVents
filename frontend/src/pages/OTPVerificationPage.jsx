import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faArrowLeft,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexts/Authcontext";
import LoadingSpinner from "../components/LoadingSpinner";

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [maxResendAttempts] = useState(3);

  const { setLogedIn, setRole, setUserDetails, checkAuthStatus } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Get user data from location state
  const userData = location.state?.userData;
  const userType = location.state?.userType;

  useEffect(() => {
    if (!userData || !userType) {
      navigate("/registration");
      return;
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [userData, userType, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto-focus previous input on backspace
    if (!value && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
    }
  };

  const verifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/v1/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: userData.email,
          userType: userType,
          otp: otpString,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update auth context with user details from response
        setRole(userType);
        setLogedIn(true);
        setUserDetails(data.data.user);

        // Use AuthContext's checkAuthStatus to verify session
        console.log("Checking auth status after OTP verification...");
        await checkAuthStatus();

        // Navigate to home page
        navigate("/", { replace: true });
      } else {
        setError(data.message || "OTP verification failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (resendAttempts >= maxResendAttempts) {
      setError("Maximum resend attempts reached. Please register again.");
      return;
    }

    setIsResending(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/v1/otp/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          userType: userType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTimeRemaining(600); // Reset timer to 10 minutes
        setCanResend(false);
        setResendAttempts((prev) => prev + 1);
        setOtp(["", "", "", "", "", ""]);
        setError("");
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyOTP();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-superLightBlue to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo p-4 rounded-full">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-white text-2xl"
              />
            </div>
          </div>
          <h1 className="text-3xl font-mainFont font-bold text-indigo mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            We've sent a 6-digit code to <br />
            <span className="font-medium text-indigo">{userData?.email}</span>
          </p>
        </div>

        {/* OTP Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Enter Verification Code
              </label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo focus:border-indigo transition-all"
                    maxLength={1}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              {timeRemaining > 0 ? (
                <p className="text-sm text-gray-600">
                  Code expires in{" "}
                  <span className="font-medium text-indigo">
                    {formatTime(timeRemaining)}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-red-600">Code has expired</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-center">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || otp.join("").length !== 6}
              className="w-full bg-indigo text-white py-3 px-6 rounded-lg font-medium hover:bg-indigoHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner />
                  Verifying...
                </div>
              ) : (
                "Verify Email"
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={resendOTP}
                disabled={
                  !canResend ||
                  isResending ||
                  resendAttempts >= maxResendAttempts
                }
                className="inline-flex items-center gap-2 text-indigo hover:text-indigoHover font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isResending ? (
                  <>
                    <LoadingSpinner size="w-3 h-3" color="border-indigo" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faRotateRight} />
                    Resend Code
                  </>
                )}
              </button>
              {resendAttempts > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {resendAttempts}/{maxResendAttempts} attempts used
                </p>
              )}
            </div>
          </form>

          {/* Back to Registration
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate("/registration")}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back to Registration</span>
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
