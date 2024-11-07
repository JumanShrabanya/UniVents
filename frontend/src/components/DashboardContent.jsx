import React, { useContext } from "react";
import { useActiveTab } from "../contexts/ActiveTabContext";
import EventCard from "../components/EventCard";
import { AuthContext } from "../contexts/Authcontext";

const DashboardContent = () => {
  // to know which tab is active
  const { activeTab, setActiveTab } = useActiveTab();

  // to get the user role data
  const { role } = useContext(AuthContext);
  // dummy data
  const eventData = [
    {
      headerImage:
        "https://miro.medium.com/v2/resize:fit:1400/1*ydhn1QPAKsrbt6UWfn3YnA.jpeg",
      title: "MakeAThon",
      eventDate: "13/11/2024",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, debitis. Ipsa nesciunt neque rerum sit nihil quia voluptate consectetur debitis ipsum! Atque sit in magnam ipsa dolor optio. Maxime, facere.",
      venue: "Assam Don Bosco University",
      organizer: "Coding club",
      college: "Assam Don bosco university",
    },
    {
      headerImage:
        "https://miro.medium.com/v2/resize:fit:1400/1*ydhn1QPAKsrbt6UWfn3YnA.jpeg",
      title: "MakeAThon",
      eventDate: "13/11/2024",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, debitis. Ipsa nesciunt neque rerum sit nihil quia voluptate consectetur debitis ipsum! Atque sit in magnam ipsa dolor optio. Maxime, facere.",
      venue: "Assam Don Bosco University",
      organizer: "Coding club",
      college: "Assam Don bosco university",
    },
    {
      headerImage:
        "https://miro.medium.com/v2/resize:fit:1400/1*ydhn1QPAKsrbt6UWfn3YnA.jpeg",
      title: "MakeAThon",
      eventDate: "13/11/2024",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, debitis. Ipsa nesciunt neque rerum sit nihil quia voluptate consectetur debitis ipsum! Atque sit in magnam ipsa dolor optio. Maxime, facere debitis ipsum! Atque sit in magnam ipsa dolor optio. Maxime, facere.",
      venue: "Assam Don Bosco University",
      organizer: "Coding club",
      college: "Assam Don bosco university",
    },
  ];

  return role === "participant" ? (
    <section className="p-[2rem]">
      {/* for the registered events */}
      {activeTab === "registered-events" && (
        <div className="flex gap-[2rem] flex-wrap">
          {eventData.map((item, index) => (
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
    </section>
  ) : (
    <section className="p-[2rem]">
      {/* for the registered events */}
      {activeTab === "registered-events" && (
        <div className="flex gap-[2rem] flex-wrap">
          {eventData.map((item, index) => (
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
        <div>
          <p>Org new event</p>
        </div>
      )}
    </section>
  );
};

export default DashboardContent;
