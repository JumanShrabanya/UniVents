import React, { useContext, useEffect, useState } from "react";
import { useOrgEventForm } from "../contexts/OrganizeEventContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faPlus,
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faImage,
  faEdit,
  faCheck,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { categoryEnum } from "../assetImports.js";
import { CreateEvent } from "../services/CreateEvent.js";
import LoaderAnimation from "./LoaderAnimation.jsx";
import { AuthContext } from "../contexts/Authcontext.jsx";
import { useCreateVotingPool } from "../contexts/CreateVotingPoolContext.jsx";

const OrganizeEventForm = () => {
  const { userDetails } = useContext(AuthContext);
  const {
    isOrgEventOpen,
    setIsOrgEventOpen,
    closeOrgEventForm,
    openOrgEventForm,
  } = useOrgEventForm();
  const { isCreatePoolOpen, closeCreatePool, openCreatePool } =
    useCreateVotingPool();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [category, setCategory] = useState(categoryEnum[0]);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [availableFor, setAvailableFor] = useState("For Everyone");
  const [coverImg, setCoverImg] = useState(null);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);

  let collegeName = userDetails.collegeName;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      } else {
        setCoverImg(file);
        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  };

  // Event creation handler
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setCreatingEvent(true);

    try {
      const response = await CreateEvent({
        title,
        description,
        eventDate,
        venue,
        category,
        coverImg,
        availableFor,
        availableSeats,
        collegeName,
      });
      if (response.status === 201) {
        console.log("Event created successfully");
        closeOrgEventForm();
        // Reset form
        setTitle("");
        setDescription("");
        setVenue("");
        setEventDate("");
        setCategory(categoryEnum[0]);
        setAvailableSeats(0);
        setAvailableFor("For Everyone");
        setCoverImg(null);
        setPreviewImage(null);
        setCurrentStep(1);
      }
    } catch (error) {
      console.log("Error creating the event:", error);
    } finally {
      setCreatingEvent(false);
    }
  };

  // Format the date
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setEventDate(formattedDate);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return title && description && coverImg;
      case 2:
        return venue && eventDate && category;
      case 3:
        return availableSeats > 0;
      default:
        return false;
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= step
                ? "bg-indigo text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {currentStep > step ? <FontAwesomeIcon icon={faCheck} /> : step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${
                currentStep > step ? "bg-indigo" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Event Details
              </h3>
              <p className="text-gray-600">
                Let's start with the basic information about your event
              </p>
            </div>

            {/* Event Poster */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                <FontAwesomeIcon icon={faImage} className="mr-2 text-indigo" />
                Event Poster *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo transition-colors relative">
                {previewImage ? (
                  <div className="space-y-4">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-48 h-32 object-cover rounded-lg mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImg(null);
                        setPreviewImage(null);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <FontAwesomeIcon
                      icon={faImage}
                      className="text-4xl text-gray-400 mb-4"
                    />
                    <p className="text-gray-600 mb-2">
                      Click to upload event poster
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleImageChange}
                  required
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Event Title */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2 text-indigo" />
                Event Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-transparent transition-all"
                placeholder="e.g., Tech Meetup 2024"
              />
            </div>

            {/* Event Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2 text-indigo" />
                Event Description *
              </label>
              <textarea
                id="description"
                value={description}
                required
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-transparent transition-all resize-none"
                placeholder="Describe your event details, what attendees can expect, and any special highlights..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Event Logistics
              </h3>
              <p className="text-gray-600">
                Set the time, location, and category for your event
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Date */}
              <div className="space-y-2">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="mr-2 text-indigo"
                  />
                  Event Date *
                </label>
                <input
                  id="date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => formatDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-transparent transition-all"
                />
              </div>

              {/* Event Category */}
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2 text-indigo" />
                  Event Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-transparent transition-all"
                >
                  {categoryEnum.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Venue */}
              <div className="space-y-2">
                <label
                  htmlFor="venue"
                  className="block text-sm font-medium text-gray-700"
                >
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="mr-2 text-indigo"
                  />
                  Venue *
                </label>
                <input
                  id="venue"
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-transparent transition-all"
                  placeholder="e.g., College Conference Hall"
                />
              </div>

              {/* Available For */}
              <div className="space-y-2">
                <label
                  htmlFor="availableFor"
                  className="block text-sm font-medium text-gray-700"
                >
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="mr-2 text-indigo"
                  />
                  Available For *
                </label>
                <select
                  id="availableFor"
                  value={availableFor}
                  onChange={(e) => setAvailableFor(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-transparent transition-all"
                >
                  <option value="For Everyone">For Everyone</option>
                  <option value="College Only">College Only</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Event Capacity
              </h3>
              <p className="text-gray-600">
                Set the number of participants your event can accommodate
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="space-y-2">
                <label
                  htmlFor="availableseats"
                  className="block text-sm font-medium text-gray-700"
                >
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="mr-2 text-indigo"
                  />
                  Available Seats *
                </label>
                <input
                  type="number"
                  id="availableseats"
                  value={availableSeats}
                  onChange={(e) => setAvailableSeats(e.target.value)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-transparent transition-all text-center text-2xl font-semibold"
                  placeholder="0"
                />
                <p className="text-sm text-gray-500 text-center">
                  Maximum number of participants allowed
                </p>
              </div>
            </div>

            {/* Event Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mt-8">
              <h4 className="font-semibold text-gray-800 mb-4">
                Event Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Title:</span>
                  <p className="font-medium">{title || "Not set"}</p>
                </div>
                <div>
                  <span className="text-gray-600">Category:</span>
                  <p className="font-medium">{category}</p>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <p className="font-medium">{eventDate || "Not set"}</p>
                </div>
                <div>
                  <span className="text-gray-600">Venue:</span>
                  <p className="font-medium">{venue || "Not set"}</p>
                </div>
                <div>
                  <span className="text-gray-600">Capacity:</span>
                  <p className="font-medium">{availableSeats || "0"} seats</p>
                </div>
                <div>
                  <span className="text-gray-600">Available For:</span>
                  <p className="font-medium">{availableFor}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full px-4 py-6">
      {isOrgEventOpen ? (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo to-indigoHover px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Create New Event
                </h2>
                <p className="text-gray-200 text-sm">Step {currentStep} of 3</p>
              </div>
              <button
                onClick={closeOrgEventForm}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FontAwesomeIcon icon={faClose} className="text-xl" />
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="px-6 py-4 bg-gray-50">{renderStepIndicator()}</div>

            {/* Form Content */}
            <div className="px-6 py-8">
              <form onSubmit={handleCreateEvent}>
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                      currentStep === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Previous
                  </button>

                  <div className="flex gap-3">
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!canProceedToNext()}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                          canProceedToNext()
                            ? "bg-indigo text-white hover:bg-indigoHover"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Next
                        <FontAwesomeIcon icon={faArrowRight} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!canProceedToNext() || creatingEvent}
                        className={`flex items-center gap-2 px-8 py-3 rounded-lg transition-all ${
                          canProceedToNext() && !creatingEvent
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {creatingEvent ? (
                          <>
                            <LoaderAnimation />
                            Creating Event...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faCheck} />
                            Create Event
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo to-indigoHover rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-3xl text-white"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Ready to Create an Event?
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Organize amazing events for your community. Our step-by-step
                process makes it easy to create engaging events.
              </p>
              <button
                onClick={() => {
                  openOrgEventForm();
                  closeCreatePool();
                }}
                className="bg-gradient-to-r from-indigo to-indigoHover text-white px-8 py-4 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Start Creating Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizeEventForm;
