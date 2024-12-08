import { useState, useContext, createContext } from "react";

const CreteVotingPoolContext = createContext();

export const CreteVotingPoolProvider = ({ children }) => {
  const [isCreatePoolOpen, setIsCreatePoolOpen] = useState(false);

  const closeCreatePool = () => setIsCreatePoolOpen(false);
  const openCreatePool = () => setIsCreatePoolOpen(true);

  return (
    <CreteVotingPoolContext.Provider
      value={{
        isCreatePoolOpen,
        closeCreatePool,
        openCreatePool,
      }}
    >
      {children}
    </CreteVotingPoolContext.Provider>
  );
};

export const useCreateVotingPool = () => useContext(CreteVotingPoolContext);
