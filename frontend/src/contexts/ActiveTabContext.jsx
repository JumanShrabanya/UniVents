import { useContext, createContext, useState, Children } from "react";

const ActiveTab = createContext();

export const ActiveTabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("registered-events");

  return (
    <ActiveTab.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ActiveTab.Provider>
  );
};

export const useActiveTab = () => useContext(ActiveTab);
