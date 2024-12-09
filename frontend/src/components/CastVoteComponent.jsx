import React, { useContext, useEffect, useState } from "react";
import { useCastVoteCard } from "../contexts/CastVoteCardContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexts/Authcontext";

const CastVoteComponent = () => {
  const {
    isCastVoteCardOpen,
    openCastVoteCard,
    closeCastVoteCard,
    votingData,
  } = useCastVoteCard();
  //   to get the role
  const { role } = useContext(AuthContext);

  // casted vote by the user
  const [selectedOption, setSelectedOption] = useState("");

  //   to maek the body stop scrolling
  useEffect(() => {
    if (isCastVoteCardOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCastVoteCardOpen]);

  return isCastVoteCardOpen ? (
    <div className="fixed inset-0 bg-black lg:p-0 p-[3rem] bg-opacity-50 z-50">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] lg:w-[57%] max-h-[80vh] min-h-[60vh] rounded-lg bg-white overflow-auto transition-transform duration-300 ease-out">
        {/* content area */}
        <div className="relative flex flex-col gap-[1.5rem] p-[1.2rem] lg:p-[2rem]  items-start">
          {/* for the close button */}
          <FontAwesomeIcon
            icon={faClose}
            onClick={() => {
              setSelectedOption("");
              closeCastVoteCard();
            }}
            className="sticky top-5 left-0 cursor-pointer text-[1.5rem] text-zinc-700 w-7 h-7 bg-white rounded-full z-10"
          ></FontAwesomeIcon>
          {/* {/* pool title */}
          <h2 className="font-mainFont font-semibold text-[1.8rem]">
            {votingData.title}
          </h2>
          {/* pool description */}
          <p className="text-zinc-600 lg:text-base text-sm text-justify">
            {votingData.description}
          </p>
          {/* voting options */}
          {votingData.options.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  className="w-5 h-5"
                  name="voteOption"
                  value={item} // Use the actual item value for the radio input
                  onChange={() => setSelectedOption(item)} // Set the selected option when clicked
                />
                <p className="text-[1.1rem]">{item}</p>
              </label>
            </div>
          ))}

          {/* button to caste vote */}
          {selectedOption === "" ? null : (
            <div className="w-full bg-indigo rounded-md flex hover:bg-indigoHover transition-all duration-200">
              <button className="flex-1 bg-none py-2 text-white">
                Cast Vote
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default CastVoteComponent;
