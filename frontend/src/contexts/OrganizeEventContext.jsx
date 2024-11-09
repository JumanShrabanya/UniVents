import { useState, useContext, createContext } from "react";

const OrganizeEventContext = createContext();

export const OrganizeEventProvider = ({ children }) => {
  const [isOrgEventOpen, setIsOrgEventOpen] = useState(false);

  const closeOrgEventForm = () => setIsOrgEventOpen(false);
  const openOrgEventForm = () => setIsOrgEventOpen(true);

  return (
    <OrganizeEventContext.Provider
      value={{
        isOrgEventOpen,
        setIsOrgEventOpen,
        closeOrgEventForm,
        openOrgEventForm,
      }}
    >
      {children}
    </OrganizeEventContext.Provider>
  );
};

export const useOrgEventForm = () => useContext(OrganizeEventContext);
