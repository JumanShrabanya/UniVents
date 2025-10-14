import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faLocationDot,
  faUserGroup,
  faUsers,
  faChevronLeft,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexts/Authcontext";

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { role, userDetails, logedIn } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [isEligible, setIsEligible] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/event/${eventId}`);
        setEvent(res.data?.data || null);
      } catch (e) {
        setError(
          e?.response?.data?.message || "Failed to load event. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchEvent();
  }, [eventId]);

  // Determine eligibility when we have event and user
  useEffect(() => {
    if (!event) return;
    if (event.availableFor === "College Only") {
      if (event?.organizer?.collegeName && userDetails?.collegeName) {
        setIsEligible(event.organizer.collegeName === userDetails.collegeName);
      } else {
        setIsEligible(false);
      }
    } else {
      setIsEligible(true);
    }
  }, [event, userDetails]);

  // Check if user already registered
  useEffect(() => {
    const checkAlreadyRegistered = async () => {
      if (!logedIn || role !== "student" || !userDetails?._id || !event?._id) {
        setAlreadyRegistered(false);
        return;
      }
      try {
        const apiUrl = `http://localhost:8000/app/alreadyRegistered`;
        const response = await axios.post(
          apiUrl,
          { eventId: event._id, studentId: userDetails._id },
          { withCredentials: true }
        );
        setAlreadyRegistered(!!response.data?.message?.isRegistered);
      } catch (e) {
        setAlreadyRegistered(false);
      }
    };
    checkAlreadyRegistered();
  }, [event, logedIn, role, userDetails]);

  const eventUrl = useMemo(() => {
    return `${window.location.origin}/event/${eventId}`;
  }, [eventId]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
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

  const handleRegister = async () => {
    if (!logedIn) {
      alert("Please log in to register for events.");
      navigate("/registration");
      return;
    }
    if (role === "organizer") {
      alert("Organizers cannot register for events.");
      return;
    }
    if (userDetails?.isVerified === false) {
      alert("Please verify your email before registering.");
      return;
    }
    if (!event?.registrationAvailable) {
      alert("Registration is currently closed for this event.");
      return;
    }
    if (!isEligible) {
      alert("You are not eligible to register for this college-only event.");
      return;
    }

    try {
      const apiUrl = "http://localhost:8000/api/v1/event/events-register";
      const response = await axios.post(
        apiUrl,
        { eventId: event._id, studentId: userDetails._id },
        { withCredentials: true }
      );
      if (response.status === 201) {
        setAlreadyRegistered(true);
        alert("Registration successful!");
      }
    } catch (err) {
      alert("Failed to register. Please try again.");
    }
  };

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

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Hero/Cover */}
      <div className="relative">
        <div className="h-64 md:h-96 w-full overflow-hidden bg-gray-200">
          {event?.coverImg ? (
            <img
              src={event.coverImg}
              alt={event?.title || "Event cover"}
              className="w-full h-full object-cover"
            />)
            : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Cover Image
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full px-4">
          <div className="max-w-6xl mx-auto flex items-end justify-between">
            <h1 className="text-white text-2xl md:text-4xl font-bold drop-shadow">{event?.title || "Event"}</h1>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(-1)}
                className="px-3 py-2 bg-white/90 backdrop-blur text-gray-800 rounded-lg border border-gray-200 hover:bg-white transition"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="mr-2" /> Back
              </button>
              <button
                onClick={handleShare}
                className={`px-3 py-2 rounded-lg border transition ${
                  copied
                    ? "bg-green-600 border-green-600 text-white"
                    : "bg-white/90 backdrop-blur text-gray-800 border-gray-200 hover:bg-white"
                }`}
              >
                <FontAwesomeIcon icon={faShare} className="mr-2" />
                {copied ? "Copied" : "Share"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo"></div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800">
            {error}
          </div>
        )}

        {/* Event Details */}
        {!loading && !error && event && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center text-gray-700">
                    <FontAwesomeIcon icon={faCalendarCheck} className="text-indigo-600 w-4 h-4 mr-3" />
                    <div>
                      <span className="font-medium">{formatDate(event.eventDate)}</span>
                      {formatTime(event.eventDate) && (
                        <span className="text-gray-500 ml-2">at {formatTime(event.eventDate)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FontAwesomeIcon icon={faLocationDot} className="text-indigo-600 w-4 h-4 mr-3" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FontAwesomeIcon icon={faUserGroup} className="text-indigo-600 w-4 h-4 mr-3" />
                    <span>
                      {event?.organizer?.clubName || "Organizer"}
                      {event?.organizer?.collegeName ? ` · ${event.organizer.collegeName}` : ""}
                    </span>
                  </div>
                  {event?.availableSeats !== undefined && (
                    <div className="flex items-center text-gray-700">
                      <FontAwesomeIcon icon={faUsers} className="text-indigo-600 w-4 h-4 mr-3" />
                      <span>
                        {(event?.registeredParticipants?.length || 0)} / {event.availableSeats} registered
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About this event</h2>
                <p className="text-gray-700 leading-7 whitespace-pre-line">{event.description}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      event.registrationAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {event.registrationAvailable ? "Registration Open" : "Registration Closed"}
                  </span>
                  {event?.category && (
                    <span className="text-sm text-gray-600">
                      {typeof event.category === "object"
                        ? event.category.categoryTitle
                        : event.category}
                    </span>
                  )}
                </div>
                {role !== "organizer" && (() => {
                  const blocked = alreadyRegistered || !event.registrationAvailable || !isEligible;
                  const bg = blocked
                    ? "#e5e7eb" // gray-200
                    : alreadyRegistered
                    ? "#22c55e" // green-500
                    : "#4f46e5"; // indigo-600
                  const hoverBg = !blocked && !alreadyRegistered ? "#1d4ed8" : bg; // indigo-700
                  const color = blocked ? "#6b7280" : "#ffffff"; // gray-500 or white
                  return (
                  <button
                    type="button"
                    onClick={!blocked ? handleRegister : undefined}
                    aria-disabled={blocked}
                    className={`inline-flex items-center justify-center w-full h-12 rounded-lg font-medium transition-colors border ${
                      blocked ? "cursor-not-allowed pointer-events-none" : ""
                    }`}
                    style={{
                      backgroundColor: bg,
                      color,
                      borderColor: blocked ? "#e5e7eb" : "#2563eb",
                    }}
                    onMouseOver={(e) => {
                      if (!blocked && !alreadyRegistered) {
                        e.currentTarget.style.backgroundColor = hoverBg;
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = bg;
                    }}
                  >
                    {alreadyRegistered
                      ? "Already Registered"
                      : !logedIn
                      ? "Log in to Register"
                      : !isEligible
                      ? "Not Eligible (College only)"
                      : event.registrationAvailable
                      ? "Register"
                      : "Registration Closed"}
                  </button>);})()}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Event Info</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    <span className="text-gray-500">College:</span>
                    <span className="ml-2 capitalize">{event?.collegeName || "—"}</span>
                  </li>
                  {event?.availableFor && (
                    <li>
                      <span className="text-gray-500">Available For:</span>
                      <span className="ml-2">{event.availableFor}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailsPage;

