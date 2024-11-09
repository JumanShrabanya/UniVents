import React, { useContext } from "react";
import { AuthContext } from "../contexts/Authcontext";

const ProtectedRoute = ({ element }) => {
  const { logedIn } = useContext(AuthContext);
  return logedIn ? element : null;
};

export default ProtectedRoute;
