import React, { useState } from "react";
import NavBar from "../components/NavBar";
import EventCard from "../components/EventCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const EventsPage = () => {
  const [title, setTitle] = useState("");
  const [college, setCollege] = useState("");
  const [events, setEvents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async (searchType) => {
    try {
      const query = searchType === "title" ? title : college;
      if (!query) {
        setErrorMessage("Please enter a search query.");
        return;
      }

      const response = await axios.get("http://localhost:8000/api/v1/event/", {
        params: { search: query },
      });

      setEvents(response.data.data); // Assuming the response contains events in 'data'
      setErrorMessage(""); // Clear any previous error message
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "No Events found");
      setEvents([]);
    }
  };

  return (
    <div>
      <NavBar />
      {/* Main section */}
      <section className="py-[2rem] px-[4vw]">
        {/* Search bar section */}
        <div className="flex justify-between items-center gap-[2rem] ">
          <div className="flex border-[1px] border-gray-500 rounded-lg pl-3 flex-1 justify-between items-center h-[3rem] overflow-hidden">
            <FontAwesomeIcon icon={faSearch} className="text-gray-800 mr-4" />
            <input
              type="text"
              placeholder="Search for events by title"
              className="outline-none border-none h-full flex-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button
              className="text-white px-4 h-full bg-indigo border-none outline-none hover:bg-indigoHover duration-150 ease-linear"
              onClick={() => handleSearch("title")}
            >
              Search
            </button>
          </div>
          <p className="text-[16px]">or</p>
          <div className="flex border-[1px] border-gray-500 rounded-lg pl-3 flex-1 justify-between items-center h-[3rem] overflow-hidden">
            <FontAwesomeIcon icon={faSearch} className="text-gray-800 mr-4" />
            <input
              type="text"
              placeholder="Search events by college name"
              className="outline-none border-none h-full flex-1"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />
            <button
              className="text-white px-4 h-full bg-indigo border-none outline-none hover:bg-indigoHover duration-150 ease-linear"
              onClick={() => handleSearch("college")}
            >
              Search
            </button>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && <div className="mt-4">{errorMessage}</div>}

        {/* Display events section */}
        <div className="py-[2rem]">
          <h2 className="text-[1.4rem] font-semibold font-mainFont capitalize">
            {events.length > 0 ? "Matching Results" : "No events found"}
          </h2>
          <div className="py-[2rem] flex items-center flex-wrap gap-[2rem] justify-center">
            {events.length > 0
              ? events.map((item, index) => (
                  <EventCard key={index} item={item} />
                ))
              : null}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
