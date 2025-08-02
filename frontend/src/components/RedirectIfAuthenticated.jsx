import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/Authcontext";

const RedirectIfAuthenticated = ({ children }) => {
  const { logedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Small delay to ensure auth context is loaded
    const timer = setTimeout(() => {
      setIsChecking(false);
      if (logedIn) {
        // If user is already logged in, redirect to home page
        navigate("/", { replace: true });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [logedIn, navigate]);

  // Show loading while checking auth status
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-superLightBlue to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, don't render the children (pages will redirect)
  if (logedIn) {
    return null;
  }

  // If user is not logged in, render the children (registration/verification pages)
  return children;
};

export default RedirectIfAuthenticated;
