import React from "react";
import { useCastVoteCard } from "../contexts/CastVoteCardContext";

const VotingPoolCard = (item) => {
  const poolData = item.item;

  // context for cast vote card
  const {
    isCastVoteCardOpen,
    openCastVoteCard,
    closeCastVoteCard,
    votingData,
  } = useCastVoteCard();

  // to open the cast vote card
  const handleOpenCastVote = () => {
    openCastVoteCard(poolData);
  };
  return (
    <div
      onClick={() => handleOpenCastVote()}
      className="rounded-lg border-[1px] border-zinc-700 w-[100%] lg:w-[45%] xl:flex-none xl:w-[45%] h-[12rem] md:h-[14rem] xl:h-[18rem] p-5 flex md:gap-4 gap-2  hover:scale-[1.009] transition-all duration-150 ease-linear cursor-pointer relative overflow-hidden"
    >
      {/* voting pool indicator */}
      <div className="absolute px-3 py-1 text-[.6rem] md:text-[.9rem] md:px-6 md:py-2 bg-gray-200 rounded-l-full right-0">
        <p>Voting pool</p>
      </div>
      {/* title and desc */}

      {/* options display */}
      <div className="flex flex-col">
        <h3 className="text-[1.1rem] md:text-[1.4rem] text-indigo mb-2 capitalize line-clamp-1 flex-shrink-0">
          {poolData.title}
        </h3>
        <p className="text-[11px] md:text-[13px] text-gray-700 line-clamp-3 md:line-clamp-4 flex-shrink-0 text-justify pr-8">
          {poolData.description}
        </p>

        <div className="flex flex-col gap-3 mt-5 mb-5">
          {poolData.options.slice(0, 2).map((item, index) => (
            <div key={index} className="flex gap-2 items-center ">
              <div className="md:h-6 md:w-6 h-4 w-4 bg-gray-200 rounded-full border-[1px] border-zinc-500"></div>
              <p className="text-[.8rem] md:text-[1rem] line-clamp-1">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VotingPoolCard;
