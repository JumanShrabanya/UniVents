import React, { useContext, useEffect, useState } from "react";
import { useRegisterCard } from "../contexts/RegisterCardContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faClose,
  faLocationDot,
  faPencil,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexts/Authcontext";
import axios from "axios";
import { checkRegistration } from "../services/CheckRegistration";
import { useCheckRegistration } from "../contexts/CheckRegistrationContext";
import { useEditEvent } from "../contexts/EditEventContext";
import { useNavigate } from "react-router-dom";

const RegisterEventComponent = () => {
  const navigate = useNavigate();
  // to open the edit event component in that page
  const { editEventOpen, closeEditEvent, openEditEvent } = useEditEvent();
  // to get the role
  const { role, userDetails } = useContext(AuthContext);
  const {
    isRegisterCardOpen,
    openRegisterCard,
    closeRegisterCard,
    eventData,
    setRegisterCardOpen,
  } = useRegisterCard();

  // to check the registration
  const { isRegistered, setRegistered } = useCheckRegistration();

  const toggleEvent = () => {
    closeRegisterCard();
  };
  useEffect(() => {
    if (isRegisterCardOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isRegisterCardOpen]);

  // state to hold the show and hide value
  const [showEditBtn, setShowEditBtn] = useState(false);

  // to handle the show of edit button
  useEffect(() => {
    // Check if the current user is the event organizer
    if (eventData?.organizer?._id === userDetails?._id) {
      setShowEditBtn(true);
    } else {
      setShowEditBtn(false);
    }
  }, [eventData, userDetails]);

  const handleEditEvent = () => {
    // Add your logic for editing the event
    // Example: Navigate to an edit form or modal
    navigate("/dashboard", { state: { eventData } });
    closeRegisterCard();
    openEditEvent();
  };

  // to handle the registration
  const handleRegistration = async (eventId) => {
    const apiUrl = "http://localhost:8000/api/v1/event/events-register";
    try {
      const response = await axios.post(
        apiUrl,
        { eventId, studentId: userDetails._id },
        { withCredentials: true }
      );
      console.log(userDetails._id);
      closeRegisterCard();

      if (response.status === 201) {
        console.log(response.data);
      }
    } catch (error) {
      console.log("error registering in the event", error);
    }
    // console.log(eventId, userDetails._id);
  };

  // to handle the add winners functionality
  const [showAddWinnersInput, setshowAddWinnersInput] = useState(false);
  const [showingWinnerInput, setshowingWinnerInput] = useState(false);
  // hold the winners
  const [firstWinner, setFirstWinner] = useState("");
  const [secondWinner, setSecondWinner] = useState("");
  const [thirdWinner, setThirdWinner] = useState("");

  // handle save winners
  let currentEventId = eventData._id;

  const handleSaveWinners = async () => {
    if (firstWinner && secondWinner && thirdWinner) {
      try {
        const apiUrl = "http://localhost:8000/dashboard-organizer/add-winners";
        const response = await axios.post(
          apiUrl,
          { currentEventId, firstWinner, secondWinner, thirdWinner },
          { withCredentials: true }
        );
        if (response.status === 200) {
          console.log("with winners:", response);
          // Clear input fields
          setFirstWinner("");
          setSecondWinner("");
          setThirdWinner("");
          setshowAddWinnersInput(false);
          // setshowingWinnerInput(!showingWinnerInput);
        }
      } catch (error) {
        console.log("error adding the winners", error);
      }
    }
  };

  // to handle the winner submit
  const handleAddWinners = () => {
    setshowAddWinnersInput(true);
    setshowingWinnerInput(true);
  };
  // to handle the cancel of adding of the winners
  const handleCancelWinners = () => {
    setshowAddWinnersInput(false);
    setshowingWinnerInput(false);
    setFirstWinner("");
    setSecondWinner("");
    setThirdWinner("");
  };

  return isRegisterCardOpen ? (
    <div className="fixed inset-0 bg-black lg:p-0 p-[3rem] bg-opacity-50 z-50">
      <div className="fixed top-0 right-0 -translate-x-0 -translate-y-0 w-[90%] lg:w-[57%] h-[100vh] bg-white overflow-auto transition-transform duration-300 ease-out">
        {/* content area */}
        <div className="relative flex flex-col gap-[1.5rem] p-[1.2rem] lg:p-[2rem]  items-start">
          <FontAwesomeIcon
            icon={faClose}
            onClick={() => {
              setRegisterCardOpen(false);
              setshowingWinnerInput(false);
              setshowAddWinnersInput(false);
              setFirstWinner("");
              setSecondWinner("");
              setThirdWinner("");
            }}
            className="sticky top-5 left-0 cursor-pointer text-[1.5rem] text-zinc-700 w-7 h-7 bg-white rounded-full z-10"
          ></FontAwesomeIcon>
          {/* header image */}
          <img
            src={eventData.coverImg}
            alt="headerImage"
            className="rounded-xl w-full h-full object-cover"
          />
          {/* event title */}
          <h2 className="font-mainFont font-semibold text-[1.8rem]">
            {eventData.title}
          </h2>
          {/* to display the winners */}
          {eventData.winners.length > 1 && (
            <div>
              <h2 className="font-mainFont font-semibold text-[20px] mb-4">
                Winners List
              </h2>
              {/* first */}
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-[#FFD700] border-[1px] border-[#ff9500] h-8 w-8 rounded-full  flex justify-center items-center ">
                  <p className="text-[12px]">1st</p>
                </div>
                <p className="capitalize">{eventData.winners[0]}</p>
              </div>
              {/* second */}
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-[#C0C0C0] border-[1px] border-[#8d8d8d] h-8 w-8 rounded-full  flex justify-center items-center ">
                  <p className="text-[12px]">2nd</p>
                </div>
                <p className="capitalize">{eventData.winners[1]}</p>
              </div>
              {/* third*/}
              <div className="flex items-center gap-2 mb-2">
                <div className="border-[1px] border-[#5f3e1e] bg-[#CD7F32] h-8 w-8 rounded-full  flex justify-center items-center ">
                  <p className="text-[12px]">3rd</p>
                </div>
                <p className="capitalize">{eventData.winners[2]}</p>
              </div>
            </div>
          )}
          <p className="text-zinc-600 lg:text-base text-sm text-justify">
            {eventData.description}
          </p>
          {/* event location */}
          <div className="flex flex-row gap-4 items-start justify-between  lg:items-center w-full">
            <div className="flex items-center gap-2 lg:gap-4 w-[30%] md:w-[17%] lg:w-[20%] xl:w-[17%]">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-zinc-600"
              ></FontAwesomeIcon>
              <p className="text-zinc-600">Venue:</p>
            </div>
            <p className="text-black font-semibold w-[70%] lg:w-auto flex-wrap flex-1">{` ${eventData.venue}`}</p>
          </div>
          {/* event date */}
          <div className="flex flex-row  gap-4 items-start lg:items-center w-full ">
            <div className="flex items-center gap-2 lg:gap-4 w-[30%] md:w-[17%] lg:w-[20%] xl:w-[17%]  ">
              <FontAwesomeIcon
                icon={faCalendarCheck}
                className="text-zinc-600"
              ></FontAwesomeIcon>
              <p className="text-zinc-600">Date:</p>
            </div>
            <p className="text-black font-semibold flex-wrap">{` ${eventData.eventDate}`}</p>
          </div>
          {/* organizer name */}
          <div className="flex flex-row  gap-4 items-start lg:items-center w-full">
            <div className="flex items-center gap-2 lg:gap-4 w-[30%] md:w-[17%] lg:w-[20%] xl:w-[17%]">
              <FontAwesomeIcon
                icon={faUserGroup}
                className="text-zinc-600"
              ></FontAwesomeIcon>
              <p className="text-zinc-600">Organizer:</p>
            </div>
            <p className="text-black font-semibold w-[70%] lg:w-auto flex-wrap">{` ${eventData.organizer.clubName}`}</p>
          </div>
          {/* for the register event button */}
          {role === "organizer" ? null : (
            <div
              onClick={() => {
                handleRegistration(eventData._id);
              }}
              className={`flex w-full text-white rounded-md overflow-hidden py-3 ${
                eventData.registrationAvailable
                  ? "bg-indigo hover:bg-indigoHover"
                  : "bg-gray-400 hover:bg-gray-400 transition-all duration-0 cursor-not-allowed"
              }`}
            >
              <button
                disabled={eventData.registrationAvailable ? false : true}
                className={`flex-1 text-[1.2rem] select-none ${
                  eventData.registrationAvailable
                    ? "cursor-pointer"
                    : "bg-gray-400 hover:bg-gray-400 transition-all duration-0 cursor-not-allowed"
                }`}
              >
                {eventData.registrationAvailable
                  ? "Register"
                  : "Registration Closed"}
              </button>
            </div>
          )}
          {/* Event winners list */}
          {showAddWinnersInput && (
            <div className="w-[100%]">
              {/* first */}
              <div className="h-10 flex rounded-md mb-2">
                <div className="border-[1px] border-[#ff9500] rounded-l-md px-3 py-2 bg-[#FFD700]  min-w-[15%]">
                  <label htmlFor="first">1st Position</label>
                </div>
                <input
                  value={firstWinner}
                  onChange={(e) => {
                    setFirstWinner(e.target.value);
                  }}
                  type="text"
                  className="px-3 h-full border-[1px] border-gray-400 outline-none rounded-r-md  flex-1"
                />
              </div>
              {/* second */}
              <div className="h-10 flex rounded-md mb-2">
                <div className="border-[1px] border-[#8d8d8d] rounded-l-md px-3 py-2 bg-[#C0C0C0] min-w-[15%]">
                  <label htmlFor="first">2nd Position</label>
                </div>
                <input
                  value={secondWinner}
                  onChange={(e) => {
                    setSecondWinner(e.target.value);
                  }}
                  type="text"
                  className="px-3 h-full border-[1px] border-gray-400 outline-none rounded-r-md  flex-1"
                />
              </div>
              {/* third */}
              <div className="h-10 flex rounded-md mb-2">
                <div className="border-[1px] border-[#5f3e1e] rounded-l-md px-3 py-2 bg-[#CD7F32] min-w-[15%]">
                  <label htmlFor="first">3rd Position</label>
                </div>
                <input
                  value={thirdWinner}
                  onChange={(e) => {
                    setThirdWinner(e.target.value);
                  }}
                  type="text"
                  className="px-3 h-full border-[1px] border-gray-400 outline-none rounded-r-md  flex-1"
                />
              </div>
              {/* cancel button */}
              <div
                onClick={handleCancelWinners}
                className="bg-zinc-200 text-black rounded-md py-3 hover:bg-zinc-300 duration-200 mb-2"
              >
                <button className="w-full flex justify-center items-center flex-1 ">
                  Cancel
                </button>
              </div>
              {/* save button */}
              <div
                onClick={handleSaveWinners}
                className="bg-zinc-800 text-white rounded-md py-3 hover:bg-zinc-900 duration-200 "
              >
                <button className="w-full flex justify-center items-center flex-1">
                  Save
                </button>
              </div>
            </div>
          )}
          {/* to show the add winners list option */}
          {showEditBtn && !showAddWinnersInput && (
            <div
              onClick={handleAddWinners}
              className={`flex items-center justify-center w-full text-white bg-zinc-800 cursor-pointer rounded-md overflow-hidden py-3 gap-3 hover:bg-zinc-900 duration-200`}
            >
              <button className="text-[1rem] lg:text-[1.2rem] select-none ">{`${
                eventData.winners.length > 1 ? "Update Winners" : "Add Winners"
              }`}</button>
            </div>
          )}
          {/* for the edit event button */}
          {showEditBtn && (
            <div
              onClick={() => handleEditEvent()}
              className={`flex items-center justify-center w-full text-black bg-gray-300 cursor-pointer rounded-md overflow-hidden py-3 gap-3 hover:bg-gray-400 duration-200`}
            >
              <FontAwesomeIcon
                icon={faPencil}
                className="text-[.7rem] lg:text-[.9rem]"
              />
              <button className="text-[1rem] lg:text-[1.2rem] select-none">
                Update event details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default RegisterEventComponent;
