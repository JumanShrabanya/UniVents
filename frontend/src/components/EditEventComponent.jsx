import React from "react";
import { useEditEvent } from "../contexts/EditEventContext";
import { useState } from "react";
import { categoryEnum } from "../assetImports";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditEventComponent = ({ eventData }) => {
  // to close the editing pannel
  const { closeEditEvent } = useEditEvent();

  // new edited event details
  const [newTitle, setNewTitle] = useState(eventData.title);
  const [newDescription, setNewDescription] = useState(eventData.description);
  const [newVenue, setNewVenue] = useState(eventData.venue);
  const [newAvailableSeats, setNewAvailableSeats] = useState(
    eventData.availableSeats
  );
  const [newAvailableFor, setNewAvailableFor] = useState(
    eventData.availableFor
  );
  const [newEventDate, setNewEventDate] = useState(eventData.eventDate);
  const [newCategory, setNewCategory] = useState(
    eventData.category.categoryTitle
  );

  // to cancel the editing mode
  const handleCancelEditing = () => {
    closeEditEvent();
  };

  return (
    <div>
      {/* heading */}
      <div className="bg-lightBlue p-2 rounded-sm mb-[1.6rem]">
        <p className="text-[1.3rem]">Update Event Details</p>
      </div>
      {/* updation fields */}
      <div>
        {/* title */}
        <div className="flex flex-col mb-8">
          <label htmlFor="title" className="mb-2 text-[.9rem] md:text-[1.1rem]">
            Event Title
          </label>
          <input
            type="text"
            id="title"
            value={newTitle}
            className={`rounded-lg w-full outline-none border-[1px] border-gray-200 h-12 md:h-[3rem] pl-4 bg-zinc-100`}
            placeholder="Title of the event"
            onChange={(e) => {
              setNewTitle(e.target.value);
            }}
          />
        </div>
        {/* description */}
        <div className="flex flex-col mb-8">
          <label
            htmlFor="description"
            className="mb-2 text-[.9rem] md:text-[1.1rem]"
          >
            Event Description
          </label>
          <textarea
            type="text"
            id="description"
            value={newDescription}
            className={`pt-2 rounded-lg w-full outline-none border-[1px] border-gray-200  pl-4 bg-zinc-100`}
            placeholder="Event description"
            onChange={(e) => {
              setNewDescription(e.target.value);
            }}
          />
        </div>
        {/* available seats */}
        <div className="flex flex-col mb-8">
          <label
            htmlFor="availableSeats"
            className="mb-2 text-[.9rem] md:text-[1.1rem]"
          >
            Available Seats
          </label>
          <input
            type="number"
            id="availableSeats"
            value={newAvailableSeats}
            className={`rounded-lg w-full outline-none border-[1px] border-gray-200 h-12 md:h-[3rem] pl-4 bg-zinc-100`}
            placeholder="Enter the available seats"
            onChange={(e) => {
              setNewAvailableSeats(e.target.value);
            }}
          />
        </div>
        {/* venue */}
        <div className="flex flex-col mb-8">
          <label htmlFor="venue" className="mb-2 text-[.9rem] md:text-[1.1rem]">
            Venue
          </label>
          <input
            type="text"
            id="venue"
            value={newVenue}
            className={`rounded-lg w-full outline-none border-[1px] border-gray-200 h-12 md:h-[3rem] pl-4 bg-zinc-100`}
            placeholder="Event venue"
            onChange={(e) => {
              setNewVenue(e.target.value);
            }}
          />
        </div>
        {/* available for */}
        <div className="flex flex-col mb-8">
          <label
            htmlFor="availableFor"
            className="mb-2 text-[.9rem] md:text-[1.1rem]"
          >
            Available For
          </label>
          {/* email input */}
          <select
            id="availableFor"
            value={newAvailableFor}
            onChange={(e) => {
              setNewAvailableFor(e.target.value);
            }}
            className="rounded-lg w-[40%] outline-none border-[1px] border-gray-200 h-12 md:h-[3rem] pl-4 bg-zinc-100 "
          >
            <option value="For Everyone">For Everyone</option>
            <option value="College Only">College Only</option>
          </select>
        </div>
        {/* event date */}
        <div className="mb-8 flex flex-col">
          <label htmlFor="date" className="mb-2">
            Event Date *
          </label>

          <input
            id="date"
            type="date"
            value={newEventDate}
            onChange={(e) => {
              setNewEventDate(e.target.value);
            }}
            className="rounded-lg outline-none border-[1px] border-gray-200 h-12 md:h-[3rem] pl-4 bg-zinc-100 w-[40%] "
          ></input>
        </div>
        {/* category */}
        <div className="flex flex-col mb-8">
          <label
            htmlFor="category"
            className="mb-2 text-[.9rem] md:text-[1.1rem]"
          >
            Category
          </label>
          <select
            id="category"
            value={newCategory}
            onChange={(e) => {
              setNewCategory(e.target.value);
            }}
            className="rounded-lg w-[40%] outline-none border-[1px] border-gray-200 h-12 md:h-[3rem] pl-4 bg-zinc-100 "
          >
            {categoryEnum.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* cancel and save buttons */}
      <div className="flex gap-4 my-[1rem] justify-between md:justify-center md:mt-[3rem]">
        <button
          onClick={handleCancelEditing}
          className="px-5 py-1 border-[1px] border-indigo rounded-lg hover:bg-gray-200  hover:border-gray-200 transition-all duration-200 ease-linear"
        >
          Cancel
        </button>
        <button
          // onClick={handleProfileUpdate}
          className="px-8 py-2 bg-indigo text-white  rounded-lg hover:bg-indigoHover hover:text-white transition-all duration-200 ease-linear hover:border-white "
        >
          Save Changes
        </button>
      </div>
      <hr className="my-10 " />
    </div>
  );
};

export default EditEventComponent;
