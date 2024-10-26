import { faCalendarCheck } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const LatestEventsSections = () => {
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
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, debitis. Ipsa nesciunt neque rerum sit nihil quia voluptate consectetur debitis ipsum! Atque sit in magnam ipsa dolor optio. Maxime, facere.",
      venue: "Assam Don Bosco University",
      organizer: "Coding club",
      college: "Assam Don bosco university",
    },
  ];
  return (
    <section className="px-[4vw] py-[2.5rem]">
      <h2 className="text-indigo text-[1.6rem] mb-5">Latest Events</h2>
      <div className="flex justify-center items-center flex-wrap gap-10">
        {eventData.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border-[1px] border-zinc-700 w-[100%] lg:w-[45%] h-[12rem] md:h-[15rem] p-2 flex gap-4  hover:scale-[1.009] transition-all duration-150 ease-linear cursor-pointer"
          >
            {/* left side image div */}
            <div className="w-[40%] h-full">
              <img
                src={item.headerImage}
                alt={item.title}
                className="object-cover w-full h-full rounded-lg object-center"
              />
            </div>
            {/* right side info div */}
            <div className="w-[60%] flex flex-col gap-1 overflow-hidden">
              <h3 className="text-[1.1rem] text-indigo md:mb-2">
                {item.title}
              </h3>
              <p className="text-[11px] text-gray-700 line-clamp-3 md:line-clamp-5 flex-shrink-0">
                {item.description}
              </p>
              <div className="flex gap-2 items-center mt-2">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  color="gray"
                  className="md:text-[12px] text-[10px]"
                ></FontAwesomeIcon>
                <p className="text-[11px] md:text-[14px] text-indigo">{`Venue: ${item.venue}`}</p>
              </div>
              <div className="flex gap-2 items-center">
                <FontAwesomeIcon
                  icon={faCalendarCheck}
                  color="gray"
                  className="text-[12px]"
                ></FontAwesomeIcon>
                <p className="text-[11px] md:text-[14px] text-indigo">{`Date: ${item.eventDate}`}</p>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <FontAwesomeIcon
                  icon={faUserGroup}
                  color="gray"
                  className="text-[12px]"
                ></FontAwesomeIcon>
                <p className="text-[11px] md:text-[14px] text-indigo">{`Organizer: ${item.organizer}`}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* explore more button */}
      <div className="w-full flex justify-center items-center pt-10">
        <button className="bg-lightBlue py-[1.8vw] px-[3vw] lg:py-[.75vw] lg:px-[1.75vw] text-[.9rem] lg:text-[1rem] rounded-lg outline-none border-none hover:bg-indigo hover:text-zinc-50 duration-200 transition-all ease-linear">
          Explore More
        </button>
      </div>
    </section>
  );
};

export default LatestEventsSections;
