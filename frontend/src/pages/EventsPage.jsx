import React from "react";
import NavBar from "../components/NavBar";
import EventCard from "../components/EventCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const EventsPage = () => {
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
      college: "Assam Don Bosco University",
    },
    {
      headerImage:
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Tech Summit 2024",
      eventDate: "21/11/2024",
      description:
        "A gathering of tech enthusiasts exploring the latest in AI, ML, and web development. Join us for insightful sessions and hands-on workshops.",
      venue: "IIT Delhi",
      organizer: "Tech Society",
      college: "Indian Institute of Technology, Delhi",
    },
    {
      headerImage:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Harmony Fest",
      eventDate: "05/12/2024",
      description:
        "An annual music festival featuring bands and solo artists from across the country. Celebrate and groove to live performances!",
      venue: "Mumbai University Grounds",
      organizer: "Music Club",
      college: "University of Mumbai",
    },
    {
      headerImage:
        "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Startup Meetup",
      eventDate: "19/12/2024",
      description:
        "An opportunity to network with aspiring entrepreneurs, investors, and industry experts. Learn from the success stories and take your idea to the next level.",
      venue: "BITS Pilani Auditorium",
      organizer: "E-Cell",
      college: "Birla Institute of Technology and Science, Pilani",
    },
    {
      headerImage:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGV2ZW50fGVufDB8fDB8fHww",
      title: "CodeQuest",
      eventDate: "29/12/2024",
      description:
        "Participate in a coding competition to test your skills and solve challenging problems. Compete with peers to win exciting prizes.",
      venue: "NIT Trichy",
      organizer: "Code Club",
      college: "National Institute of Technology, Trichy",
    },
    {
      headerImage:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Art Expo 2024",
      eventDate: "15/01/2025",
      description:
        "An exhibition showcasing artwork from talented students. Explore a collection of paintings, sculptures, and digital art pieces.",
      venue: "Delhi University Gallery",
      organizer: "Art and Design Club",
      college: "University of Delhi",
    },
  ];
  return (
    <div>
      <NavBar></NavBar>
      {/* main section */}
      <section className="py-[2rem] px-[4vw]">
        {/* saerch bar inputs section */}
        <div className="flex justify-between items-center gap-[2rem] ">
          <div className="flex border-[1px] border-gray-500 rounded-lg pl-3 flex-1 justify-between items-center h-[3rem] overflow-hidden">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-gray-800 mr-4"
            ></FontAwesomeIcon>
            <input
              type="text"
              placeholder="search for events"
              className="outline-none border-none h-full flex-1"
            />
            <button className="text-white px-4 h-full bg-indigo border-none outline-none hover:bg-indigoHover duration-150 ease-linear ">
              Search
            </button>
          </div>
          <p className="text-[16px]">or</p>
          <div className="flex border-[1px] border-gray-500 rounded-lg pl-3 flex-1 justify-between items-center h-[3rem] overflow-hidden">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-gray-800 mr-4"
            ></FontAwesomeIcon>
            <input
              type="text"
              placeholder="search events by college name"
              className="outline-none border-none h-full flex-1"
            />
            <button className="text-white px-4 h-full bg-indigo  border-none outline-none hover:bg-indigoHover duration-150 ease-linear">
              Search
            </button>
          </div>
        </div>
        {/* display events section */}
        <div className="py-[2rem]">
          {/* heading */}
          <h2 className="text-[1.4rem] font-semibold font-mainFont capitalize">
            Matching Results for{" "}
            <span className="text-zinc-500 font-normal text-[1rem] italic">
              {"Make a thon"}
            </span>
          </h2>
          {/*  */}
          <div className="py-[2rem] flex items-center flex-wrap gap-[2rem] justify-center">
            {eventData.map((item, index) => (
              <EventCard key={index} item={item}></EventCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
