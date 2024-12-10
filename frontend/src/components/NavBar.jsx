import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faMagnifyingGlass,
  faBell,
  faUser,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexts/Authcontext";
import { useLoginCard } from "../contexts/LoginCardContext";
import { useActiveTab } from "../contexts/ActiveTabContext";
import { useNavigate } from "react-router-dom";
import ViewProfileCard from "./ViewProfileCard";

const NavBar = () => {
  // calling context to get the user loged in or not and the role
  const { logedIn, role } = useContext(AuthContext);
  // to know if the menu is open or not
  const [isMenuOpen, setMenuOpen] = useState(false);

  // use Navigate hook
  const navigate = useNavigate();

  // to hide and show the login card component
  const { openLogin } = useLoginCard();

  // to toggle the menu open and close
  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  // to show the profile and dashboard option card
  const [showProfile, setShowProfile] = useState(false);

  // handle the show and hide of the show profile card
  const handleShowProfile = () => {
    setShowProfile((prev) => !prev);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-toggle") && showProfile) {
        setShowProfile(false);
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [showProfile]);

  return (
    <nav className="relative px-[4vw] py-[1rem] bg-zinc-50 flex items-center justify-between">
      {/* show profile card */}
      {showProfile ? <ViewProfileCard></ViewProfileCard> : null}
      {/* logo */}
      <a href="/">
        <h2 className="text-[1.3rem] max-lg:text-[1.2rem] max-md:text-[1rem] max-sm:text-[1rem] tracking-[.3em] text-indigo font-normal font-sans select-none">
          UNIVENTS
        </h2>
      </a>
      {!logedIn ? (
        <ul className="max-sm:flex-1 flex items-center w-[30%] justify-end gap-[5vw] text-[clamp(0.8rem,1vw,1.2rem)] ">
          {/* hamburger menu */}
          <FontAwesomeIcon
            onClick={handleMenuToggle}
            icon={faBars}
            className="cursor-pointer sm:hidden block text-[1.1rem]"
            color="gray"
          />
          {/* search icon */}
          <FontAwesomeIcon
            onClick={() => {
              navigate("/events");
            }}
            icon={faMagnifyingGlass}
            className="cursor-pointer"
          />
          <li className="max-sm:hidden cursor-pointer">
            <button
              onClick={openLogin}
              className="outline-none border-none hover:text-indigo duration-100 transition-all ease-linear"
            >
              Login
            </button>
          </li>
          <li className="max-sm:hidden cursor-pointer">
            <button
              onClick={() => navigate("/registration")}
              className="bg-lightBlue py-[.75vw] px-[1.75vw] rounded-lg outline-none border-none hover:bg-indigo hover:text-zinc-50 duration-200 transition-all ease-linear"
            >
              Register
            </button>
          </li>
        </ul>
      ) : (
        <ul className="flex items-center w-[45%] justify-end gap-[5vw] text-[clamp(0.8rem,1vw,1.2rem)] ">
          {/* seach bar and icon */}
          <FontAwesomeIcon
            onClick={() => {
              navigate("/events");
            }}
            icon={faMagnifyingGlass}
            className="cursor-pointer"
          />
          <FontAwesomeIcon
            onClick={handleMenuToggle}
            icon={faBars}
            className="cursor-pointer sm:hidden block text-[1.1rem]"
            color="gray"
          />

          {/* user profile */}
          <div
            onClick={handleShowProfile}
            className="w-[2.3rem] h-[2.3rem] bg-indigo rounded-full flex items-center justify-center max-sm:hidden cursor-pointer profile-toggle"
          >
            <FontAwesomeIcon icon={faUser} className="" color="white" />
          </div>
        </ul>
      )}
      {isMenuOpen ? (
        <div className="w-[40%] fixed top-0 right-0 bg-zinc-50 h-full pt-4 px-[4vw]">
          {/* close icon */}
          <FontAwesomeIcon
            onClick={handleMenuToggle}
            icon={faClose}
            className="font-extralight text-xl fixed top-4 right-4"
            color="gray"
          ></FontAwesomeIcon>
          {logedIn ? (
            <ul className="flex flex-col items-start justify-between mt-10 max-sm:text-[.8rem] gap-2">
              <div
                onClick={() => {
                  navigate("/dashboard");
                }}
                className="flex bg- w-full border-2 py-2 rounded-md bg-gray-200 pl-2"
              >
                <p>DashBoard</p>
              </div>
              <div
                onClick={() => {
                  navigate("/profile");
                }}
                className="flex bg- w-full  border-2 py-2 rounded-md bg-gray-200 pl-2"
              >
                <p>Profile</p>
              </div>
            </ul>
          ) : (
            <ul className="flex flex-col items-start justify-between mt-10 max-sm:text-[.8rem] gap-2">
              <button
                onClick={openLogin}
                className="outline-none border-2 w-full py-2 hover:text-indigo duration-100 transition-all ease-linear  rounded-md"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/registration");
                }}
                className="bg-lightBlue py-2 w-full outline-none border-none hover:bg-indigo hover:text-zinc-50 duration-200 transition-all ease-linear rounded-md"
              >
                Register
              </button>
            </ul>
          )}
        </div>
      ) : null}
    </nav>
  );
};

export default NavBar;
