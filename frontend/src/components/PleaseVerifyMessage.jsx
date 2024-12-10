import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/Authcontext";

const PleaseVerifyMessage = () => {
  const { userDetails, logedIn } = useContext(AuthContext);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (userDetails?.isVerified) {
      // Optional chaining to avoid errors if userDetails is undefined
      setIsVerified(true);
    }
  }, [userDetails]); // Add userDetails as a dependency

  return logedIn ? (
    !isVerified ? (
      <div className="bg-indigo flex justify-center items-center text-white text-[.9rem] py-1 select-none">
        <h3 className="text-center px-2">
          Please verify your email in order to organize or participate in events
        </h3>
      </div>
    ) : null
  ) : null;
};

export default PleaseVerifyMessage;
