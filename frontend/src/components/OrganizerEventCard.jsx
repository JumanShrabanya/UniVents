import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faLocationDot,
  faUserGroup,
  faEye,
  faEdit,
  faTrash,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexts/Authcontext";

const OrganizerEventCard = ({ item }) => {
  const navigate = useNavigate();
  const { userDetails } = useContext(AuthContext);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Removed participants fetching and toggling for a cleaner organizer card

  // Handle share functionality
  const handleShare = async (e) => {
    e.stopPropagation(); // Prevent card click
    const eventUrl = `${window.location.origin}/event/${item._id}`;
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = eventUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle navigation to event details page
  const handleViewDetails = (e) => {
    e.stopPropagation(); // Prevent card click
    if (userDetails?._id) {
      navigate(`/dashboard/${userDetails._id}/event/${item._id}`);
    } else {
      navigate(`/event/${item._id}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.coverImg}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleShare}
            className={`p-2 rounded-lg transition-all duration-200 ${
              copied
                ? "bg-green-600 text-white"
                : "bg-white/90 text-gray-700 hover:bg-white"
            }`}
          >
            <FontAwesomeIcon icon={faShare} className="text-sm" />
          </button>

          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              item.registrationAvailable
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {item.registrationAvailable
              ? "Registration Open"
              : "Registration Closed"}
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6">
        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
            {item.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Event Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-gray-400 w-4"
            />
            <span className="text-sm text-gray-600">{item.venue}</span>
          </div>
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faCalendarCheck}
              className="text-gray-400 w-4"
            />
            <span className="text-sm text-gray-600">
              {formatDate(item.eventDate)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faUserGroup} className="text-gray-400 w-4" />
            <span className="text-sm text-gray-600">
              {typeof item.category === "object"
                ? item.category.categoryTitle
                : item.category}
            </span>
          </div>
        </div>

        {/* Registration stats removed for a simpler view */}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleViewDetails}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo text-white py-2 px-4 rounded-lg hover:bg-indigoHover transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faEye} className="w-4" />
            View Details
          </button>
          <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors duration-200">
            <FontAwesomeIcon icon={faEdit} className="w-4" />
          </button>
          <button className="flex items-center justify-center gap-2 bg-red-100 text-red-600 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors duration-200">
            <FontAwesomeIcon icon={faTrash} className="w-4" />
          </button>
        </div>
        {/* Participants list removed */}
      </div>
    </div>
  );
};

export default OrganizerEventCard;
