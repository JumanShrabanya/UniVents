import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [logedIn, setLogedIn] = useState(false);
  const [role, setRole] = useState("");
  const [userDetails, setUserDetails] = useState();

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/user/check-auth-status",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setLogedIn(true);
        setRole(response.data.data.role);
        setUserDetails(response.data.data.user);

        console.log("User logged in");
        console.log(role);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // console.log("User is not logged in");
      } else {
        // console.error("Error checking auth status", error);
      }
    }
  };

  // Call the function when the component mounts

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (userDetails) {
      // console.log("Updated user details:", userDetails);
    }
  }, [userDetails, logedIn]);

  return (
    <AuthContext.Provider
      value={{
        logedIn,
        role,
        setLogedIn,
        setRole,
        userDetails,
        setUserDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
