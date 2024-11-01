import { faCalendar, faBell } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useActiveTab } from "../contexts/ActiveTabContext";

const SideNavigation = () => {
  // state to manage tabs
  const { activeTab, setActiveTab } = useActiveTab();
  console.log(activeTab);

  return (
    <div className="w-[15%] flex flex-col items-center py-[2rem] bg-transparent h-screen gap-[1rem] ">
      <div
        onClick={() => {
          setActiveTab("registered-events");
        }}
        className={`flex items-center gap-4 cursor-pointer w-full justify-start pl-5 border-2 border-indigo border-l-0 text-indigo rounded-tr-full rounded-br-full  py-3 hover:bg-indigo hover:text-white duration-200 ease-linear ${
          activeTab === "registered-events" ? "bg-indigo text-white" : null
        }`}
      >
        <FontAwesomeIcon icon={faCalendar} />
        <p>Registered events</p>
      </div>
      <div
        onClick={() => {
          setActiveTab("notifications");
        }}
        className={`flex items-center gap-4 cursor-pointer w-full justify-start pl-5  rounded-tr-full rounded-br-full py-3 border-2 border-indigo text-indigo border-l-0 hover:bg-indigo hover:text-white duration-200 ease-linear ${
          activeTab === "notifications" ? "bg-indigo text-white" : null
        }`}
      >
        <FontAwesomeIcon icon={faBell} />
        <p>Notifications</p>
      </div>
    </div>
  );
};

export default SideNavigation;
