import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LatestEventsSections = () => {
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();
  const handleExploreMoreEvent = () => {
    navigate("/events");
  };

  // Fetch the latest events (prefer 3 upcoming with registration open)
  const latestEvent = async () => {
    try {
      // Try the paginated endpoint first with filters
      const paged = await axios.get("http://localhost:8000/api/v1/event/", {
        params: { page: 1, limit: 3, registrationAvailable: true },
      });
      const pagedEvents = paged?.data?.data?.events || [];
      if (pagedEvents.length > 0) {
        setEvents(pagedEvents);
        return;
      }

      // Fallback to legacy list endpoint
      const response = await axios.get("http://localhost:8000/api/v1/event/events");
      const list = Array.isArray(response.data?.data) ? response.data.data : [];
      const now = new Date();
      const openUpcoming = list
        .filter((e) => e?.registrationAvailable && e?.eventDate && new Date(e.eventDate) >= now)
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
        .slice(0, 3);

      setEvents(openUpcoming.length > 0 ? openUpcoming : list.slice(0, 10));
    } catch (error) {
      setEvents([]); // Handle errors
    }
  };

  useEffect(() => {
    latestEvent();
  }, []);

  return (
    <section className="px-[4vw] py-[2.5rem]">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-indigo text-[1.6rem]">Latest Events</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((item, index) => (
          <EventCard key={index} item={item} />
        ))}
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
