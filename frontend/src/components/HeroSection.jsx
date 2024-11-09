import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { heroImage } from "../assetImports.js";
import { AuthContext } from "../contexts/Authcontext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
const HeroSection = () => {
  // to get the values from the authContext if the user is logged in or not and the role of the user
  const { logedIn, role } = useContext(AuthContext);

  const navigate = useNavigate();
  return (
    <section className="px-[4vw] py-[1.2rem] md:py-[2rem] w-full bg-[#EBF5F7] flex lg:flex-row flex-col justify-between h-auto items-center">
      {!logedIn ? (
        <>
          {/* for the hero text and call to action buttons */}
          <div className="w-full md:w-[100%] lg:w-[45%] xl:w-[40%] flex flex-col gap-5 ">
            <h1 className="text-[1.5rem] text-center lg:text-left sm:text-[2.2rem] md:text-[2.7rem] lg:text-[2rem] font-semibold font-mainFont leading-[1.1] sm:leading-[1.3] text-indigo">
              Explore, Organize & Register for College Events
            </h1>
            <p className="text-sm sm:text-[16px] text-zinc-800 text-center lg:text-left w-[100%] lg:w-[90%] leading-[1.3] lg:px-0 px-6">
              Discover a variety of campus events tailored for you—workshops,
              club meetings, festivals, and more. Easily explore, organize, and
              register for events with just a click. Stay engaged and make the
              most of your college experience!
            </p>
            {/* cta buttons */}
            <div className="flex flex-col lg:flex-row gap-5 items-center mt-2">
              {/* for the organizer button */}
              <div className="flex w-full lg:justify-normal justify-center lg:w-auto items-center gap-3 bg-lightBlue px-7 py-4 rounded-lg border-none outline-none text-[14px] lg:text-[13px] xl:text-[14px] cursor-pointer hover:bg-lightBlueHover duration-200 ease-linear select-none">
                <button className="rounded-lg border-none outline-none text-[14px] lg:text-[13px] xl:text-[14px]">
                  For Organizers
                </button>
                <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
              </div>
              {/* for the participant button */}
              <div className="flex w-full lg:justify-normal justify-center items-center lg:w-auto gap-3 bg-indigo px-7 py-4 rounded-lg border-none outline-none text-[14px] text-white cursor-pointer hover:bg-indigoHover duration-200 ease-linear select-none lg:text-[13px] xl:text-[14px]">
                <button className="bg-transparent rounded-lg border-none outline-none text-[14px] lg:text-[13px] xl:text-[14px]">
                  For Participants
                </button>
                <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
              </div>
            </div>
          </div>
          {/* for the hero image on the right side */}
          <div className="flex-1 flex justify-end">
            <img src={heroImage} alt="heroImage" className="w-[28rem]" />
          </div>
        </>
      ) : (
        <>
          {/* for the hero text and call to action buttons */}
          <div className="w-full md:w-[100%] lg:w-[45%] xl:w-[40%] flex flex-col gap-5 ">
            <h1 className="text-[1.5rem] text-center lg:text-left sm:text-[2.2rem] md:text-[2.7rem] lg:text-[2rem] font-semibold font-mainFont leading-[1.1] sm:leading-[1.3] text-indigo">
              Explore, Organize & Register for College Events
            </h1>
            <p className="text-sm sm:text-[16px] text-zinc-800 text-center lg:text-left w-[100%] lg:w-[90%] leading-[1.3] lg:px-0 px-6">
              Discover a variety of campus events tailored for you—workshops,
              club meetings, festivals, and more. Easily explore, organize, and
              register for events with just a click. Stay engaged and make the
              most of your college experience!
            </p>
            {/* cta buttons */}
            <div className="flex flex-col lg:flex-row gap-5 items-center mt-2">
              {/* for the explore events button */}
              <div
                onClick={() => {
                  navigate("/events");
                }}
                className="flex w-full lg:justify-normal justify-center lg:w-auto items-center gap-3 bg-lightBlue px-7 py-4 rounded-lg border-none outline-none text-[14px] lg:text-[13px] xl:text-[14px] cursor-pointer hover:bg-indigo hover:text-white duration-200 ease-linear select-none"
              >
                <button className="rounded-lg border-none outline-none text-[14px] lg:text-[13px] xl:text-[14px]">
                  Explore Events
                </button>
                <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
              </div>
            </div>
          </div>
          {/* for the hero image on the right side */}
          <div className="flex-1 flex justify-end">
            <img src={heroImage} alt="heroImage" className="w-[28rem]" />
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSection;
