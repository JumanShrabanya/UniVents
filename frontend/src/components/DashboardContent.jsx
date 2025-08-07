import React, { useContext, useEffect, useState } from "react";
import { useActiveTab } from "../contexts/ActiveTabContext";
import EventCard from "../components/EventCard";
import OrganizerEventCard from "../components/OrganizerEventCard";
import { AuthContext } from "../contexts/Authcontext";
import OrganizeEventForm from "./OrganizeEventForm";
import { CreatedEvents } from "../services/CreatedEvents";
import { RegisteredEvents } from "../services/RegisteredEvents";
import EditEventComponent from "./EditEventComponent";
import { useEditEvent } from "../contexts/EditEventContext";
import { useLocation } from "react-router-dom";

const DashboardContent = () => {
  // to recieve the data from the edit event button
  const location = useLocation();
  const eventData = location.state?.eventData;
  // console.log("from the dashboard", eventData);
  // to know which tab is active
  const { activeTab, setActiveTab } = useActiveTab();
  // to hold the created events by the org
  const [createdEvents, setcreatedEvents] = useState([]);
  const [registeredEvents, setregisteredEvents] = useState([]);

  // to know should open the editing option or not
  const { editEventOpen, closeEditEvent, openEditEvent } = useEditEvent();

  // to get the user role data
  const { role, userDetails } = useContext(AuthContext);

  const [isVerified, setIsVerified] = useState(false);

  const showRegisteredEvents = async () => {
    try {
      const response = await RegisteredEvents();
      console.log("registerd events", response);

      if (response.status === 201) {
        // console.log(response.data.data);
        setregisteredEvents(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("events:", registeredEvents);

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
    if (role === "organizer") {
      handleShowCreatedEvents();
    }
    if (role === "student") {
      showRegisteredEvents();
    }
    if (userDetails.isVerified === true) {
      setIsVerified(true);
    }
  }, [activeTab]);

  useEffect(() => {
    handleShowCreatedEvents();
  }, [activeTab, userDetails]);

  return role === "student" ? (
    <section className="p-[2rem] lg:w-[80%] xl:w-[85%] ">
      {/* for the registered events */}
      {activeTab === "registered-events" && (
        <div className="flex gap-[2rem] flex-wrap">
          {registeredEvents.map((item, index) => (
            <EventCard key={index} item={item.eventId}></EventCard>
          ))}
        </div>
      )}
    </section>
  ) : (
    <section className="p-[2rem] lg:w-[80%] xl:w-[85%]">
      {/* for the registered events */}
      {activeTab === "registered-events" && (
        <div>
          {editEventOpen ? (
            <div>
              <div className="mb-[2rem]">
                <EditEventComponent eventData={eventData}></EditEventComponent>
              </div>
            </div>
          ) : null}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {createdEvents.map((item, index) => (
              <OrganizerEventCard key={index} item={item}></OrganizerEventCard>
            ))}
          </div>
        </div>
      )}

      {/* for the create new event */}
      {isVerified
        ? activeTab === "organize-event" && (
            <div className="w-full ">
              <OrganizeEventForm></OrganizeEventForm>
            </div>
          )
        : null}
    </section>
  );
};

export default DashboardContent;
