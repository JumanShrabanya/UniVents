import { useState, createContext, useContext } from "react";

const CasteVoteCardContext = createContext();

export const CasteVoteCardProvider = ({ children }) => {
  const [isCastVoteCardOpen, setisCastVoteCardOpen] = useState(false);
  const [votingData, setvotingData] = useState([]);

  const openCastVoteCard = (item) => {
    setisCastVoteCardOpen(true);
    setvotingData(item);
  };
  const closeCastVoteCard = () => {
    setisCastVoteCardOpen(false);
  };

  return (
    <CasteVoteCardContext.Provider
      value={{
        isCastVoteCardOpen,
        openCastVoteCard,
        closeCastVoteCard,
        votingData,
      }}
    >
      {children}
    </CasteVoteCardContext.Provider>
  );
};

export const useCastVoteCard = () => useContext(CasteVoteCardContext);
