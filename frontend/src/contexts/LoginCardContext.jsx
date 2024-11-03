import { createContext, useContext, useState } from "react";

const LoginCardContext = createContext();

export const LoginCardProvider = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  return (
    <LoginCardContext.Provider value={{ isLoginOpen, openLogin, closeLogin }}>
      {children}
    </LoginCardContext.Provider>
  );
};

export const useLoginCard = () => useContext(LoginCardContext);
