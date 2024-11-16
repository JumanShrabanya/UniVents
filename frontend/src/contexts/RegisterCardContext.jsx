import { useState, createContext, useContext } from "react";

const RegisterCardContext = createContext();

export const RegisterCardProvider = ({ children }) => {
  const [isRegisterCardOpen, setRegisterCardOpen] = useState(false);
  const [eventData, setEventData] = useState([]);

  const openRegisterCard = (item) => {
    setRegisterCardOpen(true);
    setEventData(item);
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
        setRegisterCardOpen,
      }}
    >
      {children}
    </RegisterCardContext.Provider>
  );
};

export const useRegisterCard = () => useContext(RegisterCardContext);
