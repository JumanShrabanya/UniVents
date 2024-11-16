import React, { useContext, useEffect } from "react";
import { useRegisterCard } from "../contexts/RegisterCardContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faClose,
  faLocationDot,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexts/Authcontext";
import axios from "axios";

import { checkRegistration } from "../services/CheckRegistration";
import { useCheckRegistration } from "../contexts/CheckRegistrationContext";

const RegisterEventComponent = () => {
  // to get the role
  const { role, userDetails } = useContext(AuthContext);
  const { isRegisterCardOpen, openRegisterCard, closeRegisterCard, eventData } =
    useRegisterCard();
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

  return isRegisterCardOpen ? (
    <div className="fixed inset-0 bg-black lg:p-0 p-[3rem] bg-opacity-50 z-50">
      <div className="fixed top-0 right-0 -translate-x-0 -translate-y-0 w-[90%] lg:w-[57%] h-[100vh] bg-white overflow-auto transition-transform duration-300 ease-out">
        {/* content area */}
        <div className="relative flex flex-col gap-[1.5rem] p-[1.2rem] lg:p-[2rem]  items-start">
          <FontAwesomeIcon
            icon={faClose}
            onClick={closeRegisterCard}
            className="sticky top-5 left-0 cursor-pointer text-[1.5rem] text-zinc-700 w-7 h-7 bg-white rounded-full z-10"
          ></FontAwesomeIcon>
          {/* header image */}
          <img
            src={eventData.coverImg}
            alt="headerImage"
            className="rounded-xl w-full h-[27rem] lg:h-[30rem] object-cover"
          />
          {/* event title */}
          <h2 className="font-mainFont font-semibold text-[1.8rem]">
            {eventData.title}
          </h2>
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
        </div>
      </div>
    </div>
  ) : null;
};

export default RegisterEventComponent;
