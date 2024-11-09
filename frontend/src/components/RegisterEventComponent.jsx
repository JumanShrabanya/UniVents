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

const RegisterEventComponent = () => {
  // to get the role
  const { role } = useContext(AuthContext);
  const { isRegisterCardOpen, openRegisterCard, closeRegisterCard, eventData } =
    useRegisterCard();

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
  return isRegisterCardOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed top-0 right-0 -translate-x-0 -translate-y-0 w-[57%] h-[100vh] bg-white overflow-auto transition-transform duration-300 ease-out">
        {/* content area */}
        <div className="relative flex flex-col gap-[1.5rem] p-[1rem] pl-6 items-start">
          <FontAwesomeIcon
            icon={faClose}
            onClick={closeRegisterCard}
            className="sticky top-5 left-0 cursor-pointer text-[1.5rem] text-zinc-700 w-7 h-7 bg-white rounded-full z-10"
          ></FontAwesomeIcon>
          {/* header image */}
          <img
            src={eventData.coverImg}
            alt="headerImage"
            className="rounded-xl w-full h-[30rem] object-cover"
          />
          {/* event title */}
          <h2 className="font-mainFont font-semibold text-[1.8rem]">
            {eventData.title}
          </h2>
          <p className="text-zinc-600">{eventData.description}</p>
          {/* event location */}
          <div className="flex gap-4 items-center">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-zinc-600"
            ></FontAwesomeIcon>
            <p className="text-zinc-600">
              Venue:<span className="text-black">{` ${eventData.venue}`}</span>
            </p>
          </div>
          {/* event date */}
          <div className="flex gap-4 items-center">
            <FontAwesomeIcon
              icon={faCalendarCheck}
              className="text-zinc-600"
            ></FontAwesomeIcon>
            <p className="text-zinc-600">
              Date:
              <span className="text-black">{` ${eventData.eventDate}`}</span>
            </p>
          </div>
          {/* organizer name */}
          <div className="flex gap-4 items-center">
            <FontAwesomeIcon
              icon={faUserGroup}
              className="text-zinc-600"
            ></FontAwesomeIcon>
            <p className="text-zinc-600">
              Organizer:
              <span className="text-black">{` ${eventData.organizer}`}</span>
            </p>
          </div>
          {/* for the register event button */}
          {role === "organizer" ? null : (
            <div className="flex w-full bg-indigo text-white rounded-md overflow-hidden py-3 hover:bg-indigoHover">
              <button className="flex-1 text-[1.2rem]">Register</button>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default RegisterEventComponent;
