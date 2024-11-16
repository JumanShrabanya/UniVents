import {
  faColumns,
  faDashboard,
  faFaceGrinWide,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import React from "react";

const ViewProfileCard = () => {
  const navigate = useNavigate();
  return (
    <div className="absolute top-[100%] right-[2%] w-auto h-auto px-[1.2rem] py-[1.5rem] bg-white border-[1px] border-gray-200 rounded-lg z-10">
      {/* profile */}
      <div
        onClick={() => {
          navigate("/profile");
        }}
        className="flex gap-4 items-center w-full rounded-md cursor-pointer hover:bg-indigoHover hover:text-white px-3 py-2 transition-all duration-200 ease-linear mb-4"
      >
        <FontAwesomeIcon
          icon={faUser}
          className="text-[12px]"
        ></FontAwesomeIcon>
        <p>Profile</p>
      </div>
      {/* dashboard */}
      <div
        onClick={() => {
          navigate("/dashboard");
        }}
        className="flex gap-4 items-center w-full rounded-md cursor-pointer hover:bg-indigoHover hover:text-white px-3 py-2 transition-all duration-200 ease-linear"
      >
        <FontAwesomeIcon
          icon={faColumns}
          className="text-[12px]"
        ></FontAwesomeIcon>
        <p>DashBoard</p>
      </div>
    </div>
  );
};

export default ViewProfileCard;
