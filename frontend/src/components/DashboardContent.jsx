import React, { useContext, useEffect, useState } from "react";
import { useActiveTab } from "../contexts/ActiveTabContext";
import EventCard from "../components/EventCard";
import { AuthContext } from "../contexts/Authcontext";
import OrganizeEventForm from "./OrganizeEventForm";
import { CreatedEvents } from "../services/CreatedEvents";

const DashboardContent = () => {
  // to know which tab is active
  const { activeTab, setActiveTab } = useActiveTab();
  // to hold the created events by the org
  const [createdEvents, setcreatedEvents] = useState([]);

  // to get the user role data
  const { role } = useContext(AuthContext);

  // to get the event
  const handleShowCreatedEvents = async () => {
    try {
      const response = await CreatedEvents();
      setcreatedEvents(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleShowCreatedEvents();
  }, []);

  return role === "participant" ? (
    <section className="p-[2rem] lg:w-[80%] xl:w-[85%]">
      {/* for the registered events */}
      {activeTab === "registered-events" && (
        <div className="flex gap-[2rem] flex-wrap">
          {/* {eventData.map((item, index) => (
            <EventCard key={index} item={item}></EventCard>
          ))} */}
        </div>
      )}
      {/* for the notifications */}
      {activeTab === "notifications" && (
        <div>
          <p>Notifications</p>
        </div>
      )}
    </section>
  ) : (
    <section className="p-[2rem] lg:w-[80%] xl:w-[85%]">
      {/* for the registered events */}
      {activeTab === "registered-events" && (
        <div className="flex gap-[2rem] flex-wrap">
          {createdEvents.map((item, index) => (
            <EventCard key={index} item={item}></EventCard>
          ))}
        </div>
      )}
      {/* for the notifications */}
      {activeTab === "notifications" && (
        <div>
          <p>Notifications</p>
        </div>
      )}
      {/* for the create new event */}
      {activeTab === "organize-event" && (
        <div className="w-full">
          <OrganizeEventForm></OrganizeEventForm>
        </div>
      )}
    </section>
  );
};

export default DashboardContent;
