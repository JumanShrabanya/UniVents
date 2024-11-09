import React, { useEffect, useState } from "react";
import { useOrgEventForm } from "../contexts/OrganizeEventContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { categoryEnum } from "../assetImports.js";
import { CreateEvent } from "../services/CreateEvent.js";
const OrganizeEventForm = () => {
  const {
    isOrgEventOpen,
    setIsOrgEventOpen,
    closeOrgEventForm,
    openOrgEventForm,
  } = useOrgEventForm();

  //   states to hold the values
  const [title, setTitle] = useState("");
  const [description, setdescription] = useState("");
  const [eventDate, seteventDate] = useState(new Date());
  const [venue, setvenue] = useState("");
  const [category, setcategory] = useState("");
  const [coverImg, setcoverImg] = useState(null);

  //   to handle cover image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // Check if file exists
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      } else {
        setcoverImg(file);
      }
    }
  };

  //   to create the event
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    // console.log("created");

    try {
      const response = await CreateEvent({
        title,
        description,
        eventDate,
        venue,
        category,
        coverImg,
      });
      if (response && response.data && response.statusCode === 201) {
        console.log(response);

        console.log("event Created successfully");
        closeOrgEventForm();
      }
    } catch (error) {
      console.log("Error creating the event:", error);
    }
  };

  return (
    <div className="w-full  md:px-[2rem] px-[1.3rem] py-[3rem] flex justify-center items-center">
      {isOrgEventOpen ? (
        <form
          onSubmit={handleCreateEvent}
          className="relative w-[100%] md:px-[2rem] px-[1.3rem] py-[3rem]  bg-white rounded-lg  border-[1px] border-gray-200"
        >
          {/* close icon section */}
          <FontAwesomeIcon
            onClick={() => {
              closeOrgEventForm();
            }}
            icon={faClose}
            className="absolute top-5 md:top-7 right-2 md:right-5  -translate-x-1/2 -translate-y-1/2 text-[1rem] md:text-[1.3rem] cursor-pointer"
          ></FontAwesomeIcon>
          {/* header text section */}
          <div className="flex flex-col items-center">
            <div className="flex flex-col justify-start">
              <div className="flex items-center gap-2 text-[1.4rem]">
                <h2 className="text-[1.4rem]">Orgnaize a new Event</h2>
              </div>
              <p className="text-zinc-500 text-[14px]">
                Please enter all the required credentials
              </p>
            </div>
          </div>
          {/* input area */}
          <div className="mt-[1.5rem] w-full ">
            <div className="mb-10 flex flex-col">
              <label htmlFor="coverImage" className="mb-4">
                Event Header Image *
              </label>
              {/* header image input */}
              <input
                id="coverImage"
                type="file"
                onChange={handleImageChange}
                required
                className="w-full border-none outline-none bg-gray-200 px-4 py-3 rounded-lg mt-1"
              />
            </div>
            {/* event title */}
            <div className="mb-10">
              <label htmlFor="title" className="mb-10">
                Event Title *
              </label>
              {/* email input */}
              <input
                id="title"
                type="text"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-none outline-none bg-gray-200 px-4 py-3 rounded-lg mt-1"
                placeholder="eg: Tech meetup"
              />
            </div>
            {/* event description */}
            <div className="mb-10">
              <label htmlFor="description" className="mb-10">
                Event Description *
              </label>
              {/* email input */}
              <textarea
                id="description"
                type="text"
                value={description}
                required
                onChange={(e) => setdescription(e.target.value)}
                className="w-full border-none outline-none bg-gray-200 px-4 py-3 rounded-lg mt-1"
                placeholder="Describe your event details"
              />
            </div>
            {/* event date */}
            <div className="mb-10 flex flex-col w-[20%]">
              <label htmlFor="date" className="mb-4">
                Event Date *
              </label>
              {/* date input */}
              <DatePicker
                id="date"
                selected={eventDate}
                onChange={(date) => seteventDate(date)}
                dateFormat="yyyy/MM/dd" // Format as you like
                isClearable // Optional: allows clearing the date
                showYearDropdown // Optional: show year dropdown for easier selection
                scrollableYearDropdown // Optional: make the dropdown scrollable
                className="bg-gray-200 p-2 rounded-md w-[100%]"
              />
            </div>
            {/* event venue */}
            <div className="mb-10">
              <label htmlFor="venue" className="mb-10">
                Event Venue *
              </label>

              <input
                id="venue"
                type="text"
                value={venue}
                required
                onChange={(e) => setvenue(e.target.value)}
                className="w-full border-none outline-none bg-gray-200 px-4 py-3 rounded-lg mt-1"
                placeholder="eg: College Conference hall"
              />
            </div>
            {/* event category */}
            <div className="mb-10 flex flex-col w-[30%]">
              <label htmlFor="category" className="mb-4">
                Event Category *
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) => {
                  setcategory(e.target.value);
                }}
                className="p-2 bg-gray-200 outline-none rounded-md"
              >
                {categoryEnum.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="py-3 px-12 text-white bg-indigo rounded-lg hover:bg-indigoHover duration-200 ease-linear"
            >
              Create Event
            </button>
          </div>
        </form>
      ) : (
        <div
          onClick={() => {
            openOrgEventForm();
          }}
          className=" py-4 px-10 flex items-center gap-4 cursor-pointer bg-gray-200 rounded-lg hover:bg-indigoHover hover:text-white duration-150 ease-linear"
        >
          <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
          <p>Organize an Event</p>
        </div>
      )}
    </div>
  );
};

export default OrganizeEventForm;
