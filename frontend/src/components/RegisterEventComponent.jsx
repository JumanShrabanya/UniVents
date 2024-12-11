import React, { useContext, useEffect, useState } from "react";
import { useRegisterCard } from "../contexts/RegisterCardContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faCalendarCheck,
  faClose,
  faLocationDot,
  faPencil,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexts/Authcontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GetRegisteredParticipants } from "../services/GetRegisteredParticipants";

const RegisterEventComponent = () => {
  const navigate = useNavigate();
  const { role, userDetails, logedIn } = useContext(AuthContext);
  const {
    isRegisterCardOpen,
    openRegisterCard,
    closeRegisterCard,
    eventData,
    setRegisterCardOpen,
  } = useRegisterCard();

  // State to check if the user is registered
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  // State to check eligibility
  const [isEligible, setIsEligible] = useState(true);

  const [registeredParticipants, setRegisteredParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);

  // Function to check if the user is from the same college as the organizer
  const checkEligibility = () => {
    if (eventData.availableFor === "College Only") {
      if (eventData?.organizer?.collegeName !== userDetails?.collegeName) {
        setIsEligible(false);
      } else {
        setIsEligible(true);
      }
    }
  };

  console.log(eventData);

  // Function to check if the user is already registered
  const handleAlreadyRegistered = async () => {
    if (!userDetails?._id || !eventData?._id) return;

    const eventId = eventData._id;
    const studentId = userDetails._id;
    const apiUrl = `http://localhost:8000/app/alreadyRegistered`;
    try {
      const response = await axios.post(
        apiUrl,
        { eventId, studentId },
        { withCredentials: true }
      );

      setAlreadyRegistered(response.data.message.isRegistered);
    } catch (error) {
      console.error("Error checking registration", error.message);
    }
  };

  // Fetch registered participants for the event
  const handleGetRegisteredParticipants = async () => {
    setShowParticipants(!showParticipants);
    const eventId = eventData._id;
    try {
      const response = await GetRegisteredParticipants(eventId);
      if (response.status === 200) {
        setRegisteredParticipants(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching participants", error);
    }
  };

  // Handle event registration
  const handleRegistration = async () => {
    if (!isEligible) {
      alert(
        "You are not eligible to register. You must belong to the same college as the organizer."
      );
      return;
    }
    const apiUrl = "http://localhost:8000/api/v1/event/events-register";
    try {
      const response = await axios.post(
        apiUrl,
        { eventId: eventData._id, studentId: userDetails._id },
        { withCredentials: true }
      );
      if (response.status === 201) {
        setAlreadyRegistered(true);
        alert("Registration successful!");
        handleGetRegisteredParticipants(); // Refresh the participants list
      }
    } catch (error) {
      console.error("Error registering in the event", error);
      alert("Failed to register. Please try again.");
    }
    closeRegisterCard();
  };

  console.log("is eligible", isEligible);

  useEffect(() => {
    if (isRegisterCardOpen) {
      document.body.style.overflow = "hidden";
      checkEligibility();
      handleAlreadyRegistered();
      handleGetRegisteredParticipants();
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isRegisterCardOpen, eventData, logedIn]);

  console.log(eventData.availableFor);

  return isRegisterCardOpen ? (
    <div className="fixed inset-0 bg-black lg:p-0 p-[3rem] bg-opacity-50 z-50">
      <div className="fixed top-0 right-0 -translate-x-0 -translate-y-0 w-[90%] lg:w-[57%] h-[100vh] bg-white overflow-auto transition-transform duration-300 ease-out">
        {/* content area */}
        <div className="relative flex flex-col gap-[1.5rem] p-[1.2rem] lg:p-[2rem] items-start">
          <FontAwesomeIcon
            icon={faClose}
            onClick={() => {
              setRegisterCardOpen(false);
            }}
            className="sticky top-5 left-0 cursor-pointer text-[1.5rem] text-zinc-700 w-7 h-7 bg-white rounded-full z-10"
          />
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
          {/* event description */}
          <p className="text-zinc-600 lg:text-base text-sm text-justify">
            {eventData.description}
          </p>
          {/* event location */}
          <div className="flex flex-row gap-4 items-start justify-between lg:items-center w-full">
            <div className="flex items-center gap-2 lg:gap-4 w-[30%] md:w-[17%] lg:w-[20%] xl:w-[17%]">
              <FontAwesomeIcon icon={faLocationDot} className="text-zinc-600" />
              <p className="text-zinc-600">Venue:</p>
            </div>
            <p className="text-black font-semibold w-[70%] lg:w-auto flex-wrap flex-1">
              {eventData.venue}
            </p>
          </div>
          {/* event date */}
          <div className="flex flex-row gap-4 items-start lg:items-center w-full">
            <div className="flex items-center gap-2 lg:gap-4 w-[30%] md:w-[17%] lg:w-[20%] xl:w-[17%]">
              <FontAwesomeIcon
                icon={faCalendarCheck}
                className="text-zinc-600"
              />
              <p className="text-zinc-600">Date:</p>
            </div>
            <p className="text-black font-semibold flex-wrap">
              {eventData.eventDate}
            </p>
          </div>
          {/* organizer name */}
          <div className="flex flex-row gap-4 items-start lg:items-center w-full">
            <div className="flex items-center gap-2 lg:gap-4 w-[30%] md:w-[17%] lg:w-[20%] xl:w-[17%]">
              <FontAwesomeIcon icon={faUserGroup} className="text-zinc-600" />
              <p className="text-zinc-600">Organizer:</p>
            </div>
            <p className="text-black font-semibold w-[70%] lg:w-auto flex-wrap">
              {eventData.organizer.clubName}
            </p>
          </div>
          {/* register button */}
          {role !== "organizer" &&
            logedIn &&
            userDetails.isVerified === true && (
              <div
                onClick={!alreadyRegistered ? handleRegistration : undefined}
                className={`flex w-full text-white rounded-md overflow-hidden py-3 ${
                  eventData.registrationAvailable &&
                  !alreadyRegistered &&
                  isEligible
                    ? "bg-indigo hover:bg-indigoHover cursor-pointer"
                    : alreadyRegistered
                    ? "bg-green-500"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <button
                  disabled={
                    alreadyRegistered || !eventData.registrationAvailable
                  }
                  className="flex-1 text-[1.2rem] select-none"
                >
                  {alreadyRegistered
                    ? "Already Registered"
                    : !isEligible
                    ? "Not Eligible (College only event)"
                    : eventData.registrationAvailable
                    ? "Register"
                    : "Registration Closed"}
                </button>
              </div>
            )}
          {/* registered participants */}
          {logedIn && role === "organizer" && (
            <div className="w-full">
              <div
                onClick={handleGetRegisteredParticipants}
                className="flex items-center gap-3 cursor-pointer bg-indigo px-4 text-white py-1 rounded-md mb-4"
              >
                <p className="text-[1.1rem]">Registered Participants</p>
                <FontAwesomeIcon
                  icon={showParticipants ? faArrowUp : faArrowDown}
                />
              </div>
              {showParticipants && registeredParticipants.length > 0 && (
                <div className="w-full">
                  {registeredParticipants.map((item, index) => (
                    <div
                      key={index}
                      className="py-2 rounded-md bg-gray-200 w-full px-2 flex justify-between items-center mb-2"
                    >
                      <p>{item.studentId.name}</p>
                      <p>{item.studentId.semester}</p>
                      <p>{item.studentId.rollNo}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default RegisterEventComponent;
