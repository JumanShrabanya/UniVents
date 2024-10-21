import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexts/Authcontext";
const NavBar = () => {
  // calling context to get the user loged in or not and the role
  const { logedIn, role } = useContext(AuthContext);

  return (
    <nav className="px-[4vw] py-[1vw] bg-zinc-50 flex items-center justify-between">
      {/* logo */}
      <a href="#">
        <h2 className="text-[1.3vw] tracking-[.3em] text-indigo font-normal font-sans select-none">
          UNIVENTS
        </h2>
      </a>
      {!logedIn ? (
        <ul className="flex items-center w-[30%] justify-end gap-[5vw] text-[clamp(0.8rem,1vw,1.2rem)] ">
          {/* search icon */}
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="cursor-pointer"
          />
          <li className="cursor-pointer">
            <button className="outline-none border-none hover:text-indigo duration-100 transition-all ease-linear">
              Login
            </button>
          </li>
          <li className="cursor-pointer">
            <button className="bg-lightBlue py-[.75vw] px-[1.75vw] rounded-lg outline-none border-none hover:bg-indigo hover:text-zinc-50 duration-200 transition-all ease-linear">
              Register
            </button>
          </li>
        </ul>
      ) : (
        <ul className="flex items-center w-[45%] justify-end gap-[5vw] text-[clamp(0.8rem,1vw,1.2rem)] ">
          {/* seach bar and icon */}
          <form className="flex-1 flex justify-between items-center py-2 bg-transparent gap-2 ">
            <input
              type="text"
              placeholder="Search for events"
              className="w-full bg-transparent outline-none border-b-2 h-full"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="cursor-pointer"
            />
          </form>
          {/* notification icon */}
          <FontAwesomeIcon
            icon={faBell}
            className="cursor-pointer text-[1.2vw]"
            color="gray"
          />
          <div className="w-[2.3rem] h-[2.3rem] bg-indigo rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faUser}
              className="cursor-pointer"
              color="white"
            />
          </div>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
