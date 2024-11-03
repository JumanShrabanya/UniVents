import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [logedIn, setLogedIn] = useState(false);
  const [role, setRole] = useState("");

  // useEffect(() => {
  //   const checkAuthStatus = async () => {
  //     try {
  //       const response = await axios.get("/api/v1/user/check-auth-status", {
  //         withCredentials: true,
  //       });
  //       if (response.status === 200) {
  //         setLogedIn(true);
  //         setRole(response.data.data.role);
  //         console.log("User logged in");
  //         console.log("role: ", response.data.data.role);
  //       }
  //     } catch (error) {
  //       if (error.response && error.response.status === 401) {
  //         console.log("User is not logged in");
  //       } else {
  //         console.error("Error checking auth status", error);
  //       }
  //     }
  //   };

  //   checkAuthStatus(); // Call the function when the component mounts
  // }, []);

  return (
    <AuthContext.Provider value={{ logedIn, role, setLogedIn, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};
