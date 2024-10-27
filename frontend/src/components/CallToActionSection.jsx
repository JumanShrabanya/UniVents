import React, { useContext } from "react";
import { ctaImage } from "../assetImports";
import { AuthContext } from "../contexts/Authcontext";

const CallToActionSection = () => {
  const { logedIn, role } = useContext(AuthContext);
  return (
    <section className="px-[4vw] py-[1.2rem] w-full bg-yellow flex lg:flex-row flex-col justify-between h-auto items-center">
      {/* left part */}
      <div className="w-full md:w-[100%] lg:w-[45%] xl:w-[40%] flex flex-col gap-5 ">
        <h2 className="text-[1.5rem] text-center lg:text-left sm:text-[2.2rem] md:text-[2.7rem] lg:text-[1.6rem] font-semibold font-mainFont leading-[1.1] sm:leading-[1.3] text-indigo capitalize">
          organize Your Next Event with Us
        </h2>
        <p className="text-sm sm:text-[16px] text-zinc-800 text-center lg:text-left w-[100%] lg:w-[75%] leading-[1.3] lg:px-0 px-6">
          Easily explore, organize, and register for events with just a click.
          Stay engaged and make the most of your college experience!
        </p>
        {/* cta buttons */}
        <div className="flex flex-col lg:flex-row gap-5 items-center mt-2">
          {/* for the organizer button */}
          <div className="flex w-full lg:justify-normal justify-center lg:w-auto items-center gap-3 bg-indigo text-white px-7 py-3 rounded-lg border-none outline-none text-[14px] lg:text-[14px] xl:text-[14px] cursor-pointer hover:bg-indigoHover duration-200 ease-linear select-none">
            <button className="rounded-lg border-none outline-none text-[14px] lg:text-[13px] xl:text-[14px]">
              Get Started
            </button>
          </div>
        </div>
      </div>
      {/* right image part */}
      <div className="flex-1 flex justify-end">
        <img src={ctaImage} alt="get started" className="w-[23rem]" />
      </div>
    </section>
  );
};

export default CallToActionSection;
