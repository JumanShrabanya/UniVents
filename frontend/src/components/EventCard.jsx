import React, { useContext, useEffect } from "react";
import { faCalendarCheck } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRegisterCard } from "../contexts/RegisterCardContext";
import { AuthContext } from "../contexts/Authcontext";
import { checkRegistration } from "../services/CheckRegistration";

const EventCard = ({ item }) => {
  const { isRegisterCardOpen, openRegisterCard, closeRegisterCard, eventData } =
    useRegisterCard();
  const { role, userDetails } = useContext(AuthContext);

  // to handle the opening od the event data
  const handleOpenRegisterCard = (item) => {
    const checkRegistrationStatus = async () => {
      const response = await checkRegistration(eventData._id, userDetails._id);
      // console.log(userDetails._id, item._id);
    };
    openRegisterCard(item);
    console.log(item.registrationAvailable);
  };
  if (item.eventDate) {
    // to format the date
    // Convert to Date object
    const date = new Date(item.eventDate);
    // Format as YYYY-MM-DD
    item.eventDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  return (
    <div
      onClick={() => handleOpenRegisterCard(item)}
      className="rounded-lg border-[1px] border-zinc-700 w-[100%] lg:w-[45%] xl:flex-none xl:w-[45%] h-[12rem] md:h-[14rem] xl:h-[18rem] p-2 flex md:gap-4 gap-2  hover:scale-[1.009] transition-all duration-150 ease-linear cursor-pointer"
    >
      {/* div to show the edit event details  */}
      {/* left side image div */}
      <div className="w-[45%] h-full relative overflow-hidden">
        {/* to show the registration open or closed  */}
        <div
          className={`absolute top-2 right-0 z-10 py-1 px-4 rounded-l-full ${
            item.registrationAvailable ? "bg-green-300" : "bg-gray-300"
          }`}
        >
          <p className="text-[12px]">
            {item.registrationAvailable ? "Open" : "Closed"}
          </p>
        </div>
        <img
          src={item.coverImg}
          alt={item.title}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-lg object-cover"
        />
      </div>
      {/* right side info div */}
      <div className="w-[55%] flex flex-col justify-between gap-1 overflow-hidden">
        {/* title and description */}
        <div>
          <h3 className="text-[1.1rem] text-indigo mb-2 line-clamp-1">
            {item.title}
          </h3>
          <p className="text-[11px] text-gray-700 line-clamp-3 md:line-clamp-4 flex-shrink-0 text-justify pr-8">
            {item.description}
          </p>
        </div>
        {/* venue, date and orgnizer */}
        <div className="md:mb-[30px] mb-[15px] flex flex-col gap-1 pr-5">
          {/* venue */}
          <div className="flex gap-2 items-center mt-2">
            <div className="flex items-center gap-1 lg:gap-2 min-w-[33%] md:min-w-[24%] lg:min-w-[40%] xl:min-w-[26%]">
              <FontAwesomeIcon
                icon={faLocationDot}
                color="gray"
                className="text-[9px] md:text-[12px]"
              ></FontAwesomeIcon>
              <p className="text-[11px] md:text-[14px] text-black">{`Venue: `}</p>
            </div>
            <p className="text-[11px] md:text-[14px] text-indigo line-clamp-1">{`${item.venue}`}</p>
          </div>
          {/* date */}
          <div className="flex gap-2 items-center ">
            <div className="flex items-center gap-1 lg:gap-2 min-w-[33%] md:min-w-[24%] lg:min-w-[40%] xl:min-w-[26%]">
              <FontAwesomeIcon
                icon={faCalendarCheck}
                color="gray"
                className="text-[9px] md:text-[12px]"
              ></FontAwesomeIcon>
              <p className="text-[11px] md:text-[14px] text-black">{`Date: `}</p>
            </div>
            <p className="text-left  text-[11px] md:text-[14px] text-indigo line-clamp-1">{`${item.eventDate}`}</p>
          </div>
          {/* organizer */}
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1 lg:gap-2 min-w-[33%] md:min-w-[24%] lg:min-w-[40%] xl:min-w-[26%]">
              <FontAwesomeIcon
                icon={faUserGroup}
                color="gray"
                className="text-[8px] md:text-[12px]"
              ></FontAwesomeIcon>
              <p className="text-[11px] md:text-[14px] text-black">{`Organizer: `}</p>
            </div>
            <p className="text-[11px] md:text-[14px] text-indigo line-clamp-1">{`${item.organizer.clubName}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
