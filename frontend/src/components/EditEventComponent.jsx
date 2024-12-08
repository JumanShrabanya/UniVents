import React from "react";
import { useEditEvent } from "../contexts/EditEventContext";
import { useState } from "react";
import { categoryEnum } from "../assetImports";
import { UpdateEventDetails } from "../services/UpdateEventDetails";

const EditEventComponent = ({ eventData }) => {
  // to close the editing pannel
  const { closeEditEvent } = useEditEvent();

  // new edited event details
  const [title, setNewTitle] = useState(eventData.title);
  const [description, setNewDescription] = useState(eventData.description);
  const [venue, setNewVenue] = useState(eventData.venue);
  const [availableSeats, setNewAvailableSeats] = useState(
    eventData.availableSeats
  );
  const [availableFor, setNewAvailableFor] = useState(eventData.availableFor);
  const [category, setNewCategory] = useState(eventData.category.categoryTitle);

  // to format the date
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Preprocess eventDate
  const formattedDate = formatDate(eventData.eventDate);
  const [eventDate, setNewEventDate] = useState(formattedDate);

  // to cancel the editing mode
  const handleCancelEditing = () => {
    closeEditEvent();
  };

  const eventId = eventData._id;

  // to handle the event details updation
  const handleEventDetailsUpdate = async () => {
    try {
      // get the data
      // make the api call to the backend with the data
      // it everything goes well, then show the new updated content

      try {
        const response = await UpdateEventDetails(eventId, {
          title,
          description,
          venue,
          availableSeats,
          availableFor,
          category,
          eventDate,
        });
        if (response.status === 200) {
          console.log("from the update component", response);
          closeEditEvent();
        }
      } catch (error) {
        console.log("error updating event details");
      }
    } catch (error) {
      console.log("Error updating event details", error);
    }
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
            value={title}
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
            value={description}
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
            value={availableSeats}
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
            value={venue}
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
            value={availableFor}
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
            value={eventDate}
            onChange={(e) => {
              setNewEventDate(e.target.value);
            }}
            className="rounded-lg outline-none border-[1px] border-gray-200 h-12 md:h-[3rem] pl-4 bg-zinc-100 w-[40%]"
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
            value={category}
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
          onClick={handleEventDetailsUpdate}
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
