import React, {
  Children,
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";

const UserTypeContext = createContext();

export const UserTypeProvider = ({ children }) => {
  const [userType, setUserType] = useState("");

  const selectUserType = (type) => setUserType(type);

  return (
    <UserTypeContext.Provider value={{ userType, selectUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
};

export const useUserType = () => useContext(UserTypeContext);
