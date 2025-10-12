import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowRight,
  faArrowLeft,
  faCheck,
  faCalendar,
  faMapMarkerAlt,
  faUsers,
  faImage,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useOrgEventForm } from "../contexts/OrganizeEventContext.jsx";
import { CreateEvent } from "../services/CreateEvent.js";
import LoaderAnimation from "./LoaderAnimation.jsx";
import { AuthContext } from "../contexts/Authcontext.jsx";

const categoryEnum = [
  "Technology",
  "Cultural",
  "Sports",
  "Academic",
  "Workshop",
  "Seminar",
  "Conference",
  "Other",
];

const OrganizeEventForm = () => {
  const { userDetails } = useContext(AuthContext);
  const {
    isOrgEventOpen,
    setIsOrgEventOpen,
    closeOrgEventForm,
    openOrgEventForm,
  } = useOrgEventForm();

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
        return title.trim() && description.trim() && venue.trim();
      case 2:
        return eventDate && category && availableSeats > 0;
      case 3:
        return coverImg;
      default:
        return false;
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              currentStep >= step
                ? "bg-indigo text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 transition-all ${
                currentStep > step ? "bg-indigo" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-transparent"
                placeholder="Enter event title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-transparent"
                placeholder="Describe your event"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue *
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-transparent"
                placeholder="Enter venue"
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date *
              </label>
              <input
                type="date"
                onChange={(e) => formatDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-transparent"
                required
              >
                {categoryEnum.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Seats *
              </label>
              <input
                type="number"
                value={availableSeats}
                onChange={(e) => setAvailableSeats(parseInt(e.target.value))}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-transparent"
                placeholder="Enter number of seats"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available For
              </label>
              <select
                value={availableFor}
                onChange={(e) => setAvailableFor(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-transparent"
              >
                <option value="For Everyone">For Everyone</option>
                <option value="College Only">College Only</option>
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Cover Image *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="coverImage"
                  required
                />
                <label htmlFor="coverImage" className="cursor-pointer block">
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-full h-64 object-cover rounded-lg mx-auto"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setCoverImg(null);
                          setPreviewImage(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FontAwesomeIcon
                        icon={faImage}
                        className="text-4xl text-gray-400 mb-4"
                      />
                      <p className="text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {isOrgEventOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Create New Event
                </h2>
                <button
                  onClick={closeOrgEventForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-xl" />
                </button>
              </div>

              {renderStepIndicator()}

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
