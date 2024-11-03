import { faCalendar, faBell } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useActiveTab } from "../contexts/ActiveTabContext";

const SideNavigation = () => {
  // state to manage tabs
  const { activeTab, setActiveTab } = useActiveTab();
  // console.log(activeTab);

  return (
    <div className="lg:w-[20%] xl:w-[15%] w-full flex lg:flex-col flex-row items-center py-[2rem] bg-transparent h-auto lg:h-screen gap-[1rem] select-none flex-shrink-0">
      <div
        onClick={() => {
          setActiveTab("registered-events");
        }}
        className={`flex items-center gap-4 cursor-pointer lg:w-full w-[50%]  justify-start pl-2 lg:pl-5 border-2 border-indigo border-l-0 text-indigo rounded-tr-full rounded-br-full  py-3 hover:bg-indigo hover:text-white duration-200 ease-linear ${
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
        className={`flex items-center gap-4 cursor-pointer lg:w-full w-[50%]  justify-start pl-5  lg:rounded-tr-full lg:rounded-br-full rounded-tl-full lg:rounded-tl-none rounded-bl-full lg:rounded-bl-none  py-3 border-2 border-indigo text-indigo lg:border-l-0 border-r-0 lg:border-r-2 hover:bg-indigo hover:text-white duration-200 ease-linear ${
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
