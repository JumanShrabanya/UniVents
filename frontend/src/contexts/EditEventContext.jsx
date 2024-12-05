import { createContext, useState, useContext } from "react";

const EditEvent = createContext();

export const EditEventProvider = ({ children }) => {
  const [editEventOpen, setEditEventOpen] = useState(false);
  const closeEditEvent = () => {
    setEditEventOpen(false);
  };
  const openEditEvent = () => {
    setEditEventOpen(true);
  };
  return (
    <EditEvent.Provider
      value={{ editEventOpen, setEditEventOpen, closeEditEvent, openEditEvent }}
    >
      {children}
    </EditEvent.Provider>
  );
};

export const useEditEvent = () => useContext(EditEvent);
