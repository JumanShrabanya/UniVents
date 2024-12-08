import React, { useContext, useEffect, useState } from "react";
import { useOrgEventForm } from "../contexts/OrganizeEventContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
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
  const [eventDate, setEventDate] = useState(""); // Ensure it's empty or a default value like today's date
  const [category, setCategory] = useState(categoryEnum[0]);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [availableFor, setAvailableFor] = useState("For Everyone");
  const [coverImg, setCoverImg] = useState(null);
  const [creatingEvent, setCreatingEvent] = useState(false);

  let collegeName = userDetails.collegeName;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      } else {
        setCoverImg(file);
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
      }
    } catch (error) {
      console.log("Error creating the event:", error);
    }
  };

  // Format the date
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setEventDate(formattedDate); // Update state to the formatted date
  };

  return (
    <div className="w-full md:px-[2rem] px-[1.3rem] py-[1rem] flex justify-center items-center">
      {isOrgEventOpen ? (
        <form
          onSubmit={handleCreateEvent}
          className="relative w-[100%] md:px-[2rem] px-[1.3rem] py-[3rem] bg-white rounded-lg border-[1px] border-gray-200"
        >
          <FontAwesomeIcon
            onClick={() => closeOrgEventForm()}
            icon={faClose}
            className="absolute top-5 md:top-7 right-2 md:right-5 -translate-x-1/2 -translate-y-1/2 text-[1rem] md:text-[1.3rem] cursor-pointer"
          />
          <div className="flex flex-col items-center">
            <h2 className="text-[1.4rem]">Organize a new Event</h2>
            <p className="text-zinc-500 text-[14px]">
              Please enter all the required credentials
            </p>
          </div>

          <div className="mt-[1.5rem] w-full">
            {/* Event Poster */}
            <div className="mb-10 flex flex-col">
              <label htmlFor="coverImage" className="mb-4">
                Event Poster *
              </label>
              <input
                id="coverImage"
                type="file"
                onChange={handleImageChange}
                required
                className="w-full border-none outline-none bg-gray-200 px-4 py-3 rounded-lg mt-1"
              />
            </div>

            {/* Event Title */}
            <div className="mb-10">
              <label htmlFor="title" className="mb-10">
                Event Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-none outline-none bg-gray-200 px-4 py-3 rounded-lg mt-1"
                placeholder="e.g., Tech Meetup"
              />
            </div>

            {/* Event Description */}
            <div className="mb-10">
              <label htmlFor="description" className="mb-10">
                Event Description *
              </label>
              <textarea
                id="description"
                value={description}
                required
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border-none outline-none bg-gray-200 px-4 py-3 rounded-lg mt-1"
                placeholder="Describe your event details"
              />
            </div>
            {/* available seats */}
            <div className="mb-10 flex flex-col ">
              <label htmlFor="availableseats" className="mb-2">
                Available Seats *
              </label>
              {/* email input */}
              <input
                type="number"
                id="availableseats"
                value={availableSeats}
                onChange={(e) => {
                  setAvailableSeats(e.target.value);
                }}
                className="p-2 h-12 w-[100%] bg-gray-200 outline-none rounded-md "
              ></input>
            </div>
            {/* event venue */}
            <div className="mb-10 flex flex-col ">
              <label htmlFor="venue" className="mb-2">
                Venue *
              </label>
              {/* email input */}
              <input
                type="text"
                id="venue"
                value={venue}
                onChange={(e) => {
                  setVenue(e.target.value);
                }}
                className="p-2 h-12 w-[100%] bg-gray-200 outline-none rounded-md "
                placeholder="eg: College conference hall"
              ></input>
            </div>
            {/* available for */}
            <div className="mb-10 flex flex-col ">
              <label htmlFor="availableFor" className="mb-2">
                Available For *
              </label>
              {/* email input */}
              <select
                id="availableFor"
                value={availableFor}
                onChange={(e) => {
                  setAvailableFor(e.target.value);
                }}
                className="p-2 h-12 w-[20%] bg-gray-200 outline-none rounded-md "
              >
                <option value="For Everyone">For Everyone</option>
                <option value="College Only">College Only</option>
              </select>
            </div>
            {/* Event Date */}
            <div className="mb-10 flex flex-col w-[20%]">
              <label htmlFor="date" className="mb-2">
                Event Date *
              </label>
              <input
                id="date"
                type="date"
                value={eventDate}
                onChange={(e) => formatDate(e.target.value)}
                className="bg-gray-200 p-2 rounded-md w-[100%] h-12"
              />
            </div>

            {/* Event Category */}
            <div className="mb-10 flex flex-col w-[20%]">
              <label htmlFor="category" className="mb-2">
                Event Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-2 bg-gray-200 outline-none rounded-md h-12"
              >
                {categoryEnum.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center items-center">
            {!creatingEvent ? (
              <button
                type="submit"
                className="py-3 px-12 text-white bg-indigo rounded-lg hover:bg-indigoHover duration-200 ease-linear"
              >
                Create Event
              </button>
            ) : (
              <LoaderAnimation />
            )}
          </div>
        </form>
      ) : (
        <div
          onClick={() => {
            openOrgEventForm();
            closeCreatePool();
          }}
          className="py-4 px-10 flex items-center gap-4 cursor-pointer bg-gray-200 rounded-lg hover:bg-indigoHover hover:text-white duration-150 ease-linear"
        >
          <FontAwesomeIcon icon={faPlus} />
          <p>Organize an Event</p>
        </div>
      )}
    </div>
  );
};

export default OrganizeEventForm;
