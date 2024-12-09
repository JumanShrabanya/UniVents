import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showPools } from "../services/ShowPools";
import VotingPoolCard from "./VotingPoolCard";

const LatestEventsSections = () => {
  const [events, setEvents] = useState([]);
  const [pools, setPools] = useState([]);

  // to set the option value
  const [option, setOption] = useState("Events");

  const navigate = useNavigate();
  const handleExploreMoreEvent = () => {
    navigate("/events");
  };

  // Fetch the latest events
  const latestEvent = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/event/events"
      );

      // Slice the first 10 events
      setEvents(response.data.data.slice(0, 10));
    } catch (error) {
      setEvents([]); // Handle errors
    }
  };
  const latestPools = async () => {
    try {
      const response = await showPools();

      // Slice the first 10 events
      setPools(response.data.data.slice(0, 10));
    } catch (error) {
      setEvents([]);
      setPools([]); // Handle errors
    }
  };

  useEffect(() => {
    latestEvent();
    latestPools();
  }, []);

  return (
    <section className="px-[4vw] py-[2.5rem]">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-indigo text-[1.6rem] mb-5">Latest Events</h2>
        <select
          value={option}
          onChange={(e) => setOption(e.target.value)}
          id="eventORpool"
          className="p-2 h-12 w-[10%] border-[1px] border-indigo text-black outline-none rounded-md"
        >
          <option value="Events" className="bg-white text-black">
            Events
          </option>
          <option value="Pools" className="bg-white text-black">
            Pools
          </option>
        </select>
      </div>
      <div className="flex lg:justify-between xl:justify-center items-center flex-wrap gap-10">
        {option === "Pools"
          ? pools.map((item, index) => (
              <VotingPoolCard key={item._id} item={item}></VotingPoolCard>
            ))
          : events.map((item, index) => (
              <EventCard key={index} item={item}></EventCard>
            ))}
        {}
      </div>
      {/* Explore more button */}
      <div className="w-full flex justify-center items-center pt-10">
        <button
          onClick={handleExploreMoreEvent}
          className="bg-lightBlue py-[1.8vw] px-[3vw] lg:py-[.75vw] lg:px-[1.75vw] text-[.9rem] lg:text-[1rem] rounded-lg outline-none border-none hover:bg-indigo hover:text-zinc-50 duration-200 transition-all ease-linear"
        >
          Explore More
        </button>
      </div>
    </section>
  );
};

export default LatestEventsSections;
