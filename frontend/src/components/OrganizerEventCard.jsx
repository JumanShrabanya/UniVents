import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faLocationDot,
  faUserGroup,
  faUsers,
  faEye,
  faEdit,
  faTrash,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { GetRegisteredParticipants } from "../services/GetRegisteredParticipants";

const OrganizerEventCard = ({ item }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [registeredParticipants, setRegisteredParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
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

  // Fetch registered participants for the event
  const handleGetRegisteredParticipants = async () => {
    setLoading(true);
    try {
      const response = await GetRegisteredParticipants(item._id);
      if (response.status === 200) {
        setRegisteredParticipants(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching participants", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleParticipants = () => {
    if (!showParticipants) {
      handleGetRegisteredParticipants();
    }
    setShowParticipants(!showParticipants);
  };

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
    navigate(`/event/${item._id}`);
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

        {/* Registration Stats */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-800">Registration Stats</h4>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="text-indigo w-4" />
              <span className="text-sm font-medium text-indigo">
                {registeredParticipants.length} / {item.availableSeats}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  (registeredParticipants.length / item.availableSeats) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {registeredParticipants.length} participants registered
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleViewDetails}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo text-white py-2 px-4 rounded-lg hover:bg-indigoHover transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faEye} className="w-4" />
            View Details
          </button>
          <button
            onClick={toggleParticipants}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faUsers} className="w-4" />
          </button>
          <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors duration-200">
            <FontAwesomeIcon icon={faEdit} className="w-4" />
          </button>
          <button className="flex items-center justify-center gap-2 bg-red-100 text-red-600 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors duration-200">
            <FontAwesomeIcon icon={faTrash} className="w-4" />
          </button>
        </div>

        {/* Participants List */}
        {showParticipants && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h5 className="font-semibold text-gray-800 mb-3">
              Registered Participants
            </h5>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">
                  Loading participants...
                </p>
              </div>
            ) : registeredParticipants.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {registeredParticipants.map((participant, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {participant.studentId.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {participant.studentId.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {participant.studentId.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">
                        Roll: {participant.studentId.rollNo}
                      </p>
                      <p className="text-xs text-gray-500">
                        Sem: {participant.studentId.semester}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-gray-300 text-3xl mb-2"
                />
                <p className="text-gray-500 text-sm">
                  No participants registered yet
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerEventCard;
