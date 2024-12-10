import React, { useContext, useEffect, useState } from "react";
import { useCastVoteCard } from "../contexts/CastVoteCardContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexts/Authcontext";
import { CastVote } from "../services/CastVote";
import axios from "axios";

const CastVoteComponent = () => {
  const { isCastVoteCardOpen, closeCastVoteCard, votingData } =
    useCastVoteCard();
  const { userDetails, logedIn, role } = useContext(AuthContext);

  const [selectedOption, setSelectedOption] = useState("");
  const [alreadyCasted, setAlreadyCasted] = useState(false);
  const [isPollActive, setIsPollActive] = useState(votingData.isActive);
  const [isFromSameCollge, setIsFromSameCollge] = useState(false);
  const [winner, setWinner] = useState(null); // State to store the winner

  const handleCastVote = async () => {
    try {
      await CastVote(selectedOption, votingData.title);
    } catch (error) {
      console.error("Error casting vote:", error);
    }
  };

  const isAlreadyCasted = () => {
    if (
      Array.isArray(votingData.participants) &&
      votingData.participants.some(
        (participant) => participant.studentId === userDetails?._id
      )
    ) {
      setAlreadyCasted(true);
    } else {
      setAlreadyCasted(false);
    }
  };

  const getWinner = async () => {
    if (!isPollActive) {
      const apiUrl = "http://localhost:8000/voting/get-poll-results";
      const id = votingData._id;

      try {
        const response = await axios.post(
          apiUrl,
          { id },
          { withCredentials: true }
        );

        if (response.data?.success && response.data?.winner) {
          setWinner(response.data.winner); // Set the winner if found
        } else if (response.data?.success) {
          setWinner("No votes cast for this poll."); // Handle no votes case
        } else {
          console.error("Error in response:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching the winner:", error);
      }
    }
  };

  useEffect(() => {
    if (isCastVoteCardOpen) {
      document.body.style.overflow = "hidden";
      isAlreadyCasted();
      setWinner(null); // Reset the winner when opening the poll
      getWinner(); // Fetch winner if the poll is closed
    } else {
      setAlreadyCasted(false);
    }
    if (votingData.availableFor === "College Only") {
      setIsFromSameCollge(userDetails?.collegeName === votingData?.collegeName);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [
    isCastVoteCardOpen,
    votingData.participants,
    userDetails?._id,
    votingData,
  ]);

  useEffect(() => {
    setIsPollActive(votingData.isActive);
  }, [votingData.isActive]);

  return isCastVoteCardOpen ? (
    <div className="fixed inset-0 bg-black lg:p-0 p-[3rem] bg-opacity-50 z-50">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] lg:w-[57%] max-h-[80vh] min-h-[60vh] rounded-lg bg-white overflow-auto transition-transform duration-300 ease-out">
        <div className="relative flex flex-col gap-[1.5rem] p-[1.2rem] lg:p-[2rem] items-start">
          <FontAwesomeIcon
            icon={faClose}
            onClick={() => {
              setSelectedOption("");
              closeCastVoteCard();
            }}
            className="sticky top-5 left-0 cursor-pointer text-[1.5rem] text-zinc-700 w-7 h-7 bg-white rounded-full z-10"
          />
          <h2 className="font-mainFont font-semibold text-[1.8rem]">
            {votingData.title}
          </h2>
          <p className="text-zinc-600 lg:text-base text-sm text-justify">
            {votingData.description}
          </p>
          {isPollActive ? (
            votingData.options.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    className="w-5 h-5"
                    name="voteOption"
                    value={item}
                    onChange={() => setSelectedOption(item)}
                  />
                  <p className="text-[1.1rem]">{item}</p>
                </label>
              </div>
            ))
          ) : (
            <p className="text-[1.2rem] font-bold text-indigo">
              Winner: {winner ? winner : "No Vote Found..."}
            </p>
          )}
          {selectedOption === "" ? null : logedIn ? (
            role === "student" ? (
              <div
                className={`w-full rounded-md flex ${
                  alreadyCasted || !isPollActive || !isFromSameCollge
                    ? "bg-gray-300"
                    : "bg-indigo hover:bg-indigoHover transition-all duration-200"
                }`}
              >
                <button
                  disabled={
                    alreadyCasted ||
                    !isPollActive ||
                    (votingData.availableFor === "College Only" &&
                      !isFromSameCollge)
                  }
                  onClick={handleCastVote}
                  className="flex-1 bg-none py-2 text-white"
                >
                  {!isPollActive
                    ? "Poll Closed"
                    : alreadyCasted
                    ? "Already Voted"
                    : votingData.availableFor === "College Only" &&
                      !isFromSameCollge
                    ? "Not Eligible (College Only)"
                    : "Cast Vote"}
                </button>
              </div>
            ) : null
          ) : null}
        </div>
      </div>
    </div>
  ) : null;
};

export default CastVoteComponent;
