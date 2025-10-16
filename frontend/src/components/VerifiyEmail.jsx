import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `https://univents-backend.vercel.app/auth/verify-email/${token}`
        );
        setStatus(response.data.message);
        console.log("from the email response", response);

        // Optionally, store the new access token
        const { accessToken } = response.data.data;
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        // setStatus("Failed to verify email. Please try again.");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{status}</h2>
      <a
        href="http://localhost:5173/" // Replace with your website's URL
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      >
        Go Back to Website
      </a>
    </div>
  );
};

export default VerifyEmail;
