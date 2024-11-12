import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const CheckRegistrationContext = createContext();

export const CheckRegistrationProvider = ({ children }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const setRegistered = () => {
    setIsRegistered(true);
  };

  return (
    <CheckRegistrationContext.Provider
      value={{ isRegistered, setIsRegistered, setRegistered }}
    >
      {children}
    </CheckRegistrationContext.Provider>
  );
};

export const useCheckRegistration = () => useContext(CheckRegistrationContext);
