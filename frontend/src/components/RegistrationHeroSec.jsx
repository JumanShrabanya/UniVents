import React, { useState } from "react";
import SignUpCard from "./SignUpCard";
import { useUserType } from "../contexts/UserTypeContext";

const RegistrationHeroSec = () => {
  // state to open participant or organizer signup pop up
  const { userType, selectUserType } = useUserType();

  console.log(userType);

  return (
    <section className="w-full bg-indigo pt-[3rem] pb-[4rem] px-[4vw] flex flex-col gap-10">
      {/* header and text */}
      <div className="flex flex-col justify-center items-center text-white gap-5">
        <h1 className="text-[1.7rem] font-mainFont">Join UniVents</h1>
        <p className="text-[16px] text-center w-[90%] md:w-[75%] lg:w-[45%]">
          Discover campus events—workshops, clubs, festivals, and more. Explore,
          organize, and register with ease.
        </p>
      </div>
      {/* sign up cards */}
      <div className="flex md:flex-row flex-col justify-center gap-[3rem]">
        <SignUpCard
          title={"organize Your Next Event"}
          paragraph={
            "Easily create and manage your own events on UniVents. From club meetings to large-scale festivals, we've got you covered"
          }
          btnText={"Register as Organizer"}
          onClick={() => selectUserType("organizer")}
        ></SignUpCard>
        <SignUpCard
          title={"Participate in various Events"}
          paragraph={
            "Easily participate in various events with UniVents. From meetings to large-scale festivals, we've got you covered"
          }
          btnText={"Register as Participant"}
          onClick={() => selectUserType("participant")}
        ></SignUpCard>
      </div>
    </section>
  );
};

export default RegistrationHeroSec;
