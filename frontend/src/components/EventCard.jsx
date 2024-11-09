import React from "react";
import { faCalendarCheck } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRegisterCard } from "../contexts/RegisterCardContext";

const EventCard = ({ item }) => {
  const { isRegisterCardOpen, openRegisterCard, closeRegisterCard, eventData } =
    useRegisterCard();

  // to handle the opening od the event data
  const handleOpenRegisterCard = (item) => {
    openRegisterCard(item);
  };
  return (
    <div
      onClick={() => handleOpenRegisterCard(item)}
      className="rounded-lg border-[1px] border-zinc-700 w-[100%] lg:w-[45%] h-[12rem] lg:h-[15rem] p-2 flex gap-4  hover:scale-[1.009] transition-all duration-150 ease-linear cursor-pointer"
    >
      {/* left side image div */}
      <div className="w-[40%] h-full">
        <img
          src={item.coverImg}
          alt={item.title}
          className="object-cover w-full h-full rounded-lg object-center"
        />
      </div>
      {/* right side info div */}
      <div className="w-[60%] flex flex-col gap-1 overflow-hidden">
        <h3 className="text-[1.1rem] text-indigo md:mb-2 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-[11px] text-gray-700 line-clamp-3 md:line-clamp-2 flex-shrink-0">
          {item.description}
        </p>
        <div className="flex gap-2 items-center mt-2">
          <FontAwesomeIcon
            icon={faLocationDot}
            color="gray"
            className="md:text-[12px] text-[10px]"
          ></FontAwesomeIcon>
          <p className="text-[11px] md:text-[14px] text-indigo line-clamp-1">{`Venue: ${item.venue}`}</p>
        </div>
        <div className="flex gap-2 items-center">
          <FontAwesomeIcon
            icon={faCalendarCheck}
            color="gray"
            className="text-[12px]"
          ></FontAwesomeIcon>
          <p className="text-[11px] md:text-[14px] text-indigo line-clamp-1">{`Date: ${item.eventDate}`}</p>
        </div>
        <div className="flex gap-2 items-center">
          <FontAwesomeIcon
            icon={faUserGroup}
            color="gray"
            className="text-[12px]"
          ></FontAwesomeIcon>
          <p className="text-[11px] md:text-[14px] text-indigo line-clamp-1">{`Organizer: ${item.organizer}`}</p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
