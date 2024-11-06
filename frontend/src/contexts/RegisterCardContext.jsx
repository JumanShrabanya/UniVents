import { useState, createContext, useContext } from "react";

const RegisterCardContext = createContext();

export const RegisterCardProvider = ({ children }) => {
  const [isRegisterCardOpen, setRegisterCardOpen] = useState(false);
  const [eventData, setEventData] = useState({});

  const openRegisterCard = (data) => {
    setRegisterCardOpen(true);
    setEventData(data);
  };
  const closeRegisterCard = () => {
    setRegisterCardOpen(false);
  };
  return (
    <RegisterCardContext.Provider
      value={{
        isRegisterCardOpen,
        openRegisterCard,
        closeRegisterCard,
        eventData,
      }}
    >
      {children}
    </RegisterCardContext.Provider>
  );
};

export const useRegisterCard = () => useContext(RegisterCardContext);
