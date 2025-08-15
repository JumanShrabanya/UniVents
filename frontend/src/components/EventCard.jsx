import React, { useContext, useEffect } from "react";
import { faCalendarCheck } from "@fortawesome/free-regular-svg-icons";
import {
  faLocationDot,
  faUserGroup,
  faUsers,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      onClick={() => handleOpenRegisterCard(item)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {/* Registration Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              item.registrationAvailable
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {item.registrationAvailable
              ? "Registration Open"
              : "Registration Closed"}
          </span>
        </div>

        {/* Event Image */}
        <img
          src={item.coverImg}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Event Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
          {item.title}
        </h3>

        {/* Event Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Event Details */}
        <div className="space-y-3">
          {/* Date and Time */}
          <div className="flex items-center text-sm text-gray-600">
            <FontAwesomeIcon
              icon={faCalendarCheck}
              className="w-4 h-4 mr-3 text-indigo-500"
            />
            <div>
              <span className="font-medium">{formatDate(item.eventDate)}</span>
              {formatTime(item.eventDate) && (
                <span className="text-gray-500 ml-2">
                  at {formatTime(item.eventDate)}
                </span>
              )}
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-center text-sm text-gray-600">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="w-4 h-4 mr-3 text-indigo-500"
            />
            <span className="line-clamp-1">{item.venue}</span>
          </div>

          {/* Organizer */}
          <div className="flex items-center text-sm text-gray-600">
            <FontAwesomeIcon
              icon={faUserGroup}
              className="w-4 h-4 mr-3 text-indigo-500"
            />
            <span className="line-clamp-1">
              {item.organizer?.clubName || "Unknown Organizer"}
            </span>
          </div>

          {/* Capacity Info */}
          {item.availableSeats !== undefined && (
            <div className="flex items-center text-sm text-gray-600">
              <FontAwesomeIcon
                icon={faUsers}
                className="w-4 h-4 mr-3 text-indigo-500"
              />
              <span>
                {item.registeredParticipants?.length || 0} /{" "}
                {item.availableSeats} registered
              </span>
            </div>
          )}

          {/* Category */}
          {item.category && (
            <div className="flex items-center text-sm text-gray-600">
              <FontAwesomeIcon
                icon={faClock}
                className="w-4 h-4 mr-3 text-indigo-500"
              />
              <span>
                {typeof item.category === "object"
                  ? item.category.categoryTitle
                  : item.category}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium text-sm">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
