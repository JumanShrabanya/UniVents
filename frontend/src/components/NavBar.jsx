import React, { useEffect, useState } from "react";
import axios from "axios";
const NavBar = () => {
  const [logedIn, setlogedIn] = useState(false);
  const [role, setRole] = useState("");
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/user/check-auth-status",
          {
            withCredentials: true,
          }
        );

        console.log(response);

        if (response.status === 200) {
          setlogedIn(true);
          setRole(response.data.data.role);

          console.log("User logged in");
          console.log("role: ", role);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("User is not logged in");
        } else {
          console.error("Error checking auth status", error);
        }
      }
    };
    checkAuthStatus(); // Call the function when the component mounts
  }, []);
  return <nav>NavBar</nav>;
};

export default NavBar;
