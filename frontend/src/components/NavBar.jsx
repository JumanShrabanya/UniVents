import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faMagnifyingGlass,
  faBell,
  faUser,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexts/Authcontext";

const NavBar = () => {
  // calling context to get the user loged in or not and the role
  const { logedIn, role } = useContext(AuthContext);
  // to know if the menu is open or not
  const [isMenuOpen, setMenuOpen] = useState(false);

  // to toggle the menu open and close
  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
    console.log(isMenuOpen);
  };

  return (
    <nav className="px-[4vw] py-[1rem] bg-zinc-50 flex items-center justify-between">
      {/* logo */}
      <a href="#">
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
          <li className="max-sm:hidden cursor-pointer">
            <button className="outline-none border-none hover:text-indigo duration-100 transition-all ease-linear">
              Login
            </button>
          </li>
          <li className="max-sm:hidden cursor-pointer">
            <button className="bg-lightBlue py-[.75vw] px-[1.75vw] rounded-lg outline-none border-none hover:bg-indigo hover:text-zinc-50 duration-200 transition-all ease-linear">
              Register
            </button>
          </li>
        </ul>
      ) : (
        <ul className="flex items-center w-[45%] justify-end gap-[5vw] text-[clamp(0.8rem,1vw,1.2rem)] ">
          <FontAwesomeIcon
            onClick={handleMenuToggle}
            icon={faBars}
            className="cursor-pointer sm:hidden block text-[1.1rem]"
            color="gray"
          />
          {/* seach bar and icon */}
          <form className="flex-1 justify-between items-center py-2 bg-transparent gap-2 sm:flex hidden ">
            <input
              type="text"
              placeholder="Search for events"
              className="w-full bg-transparent outline-none border-b-2 h-full "
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="cursor-pointer"
            />
          </form>
          {/* notification icon */}
          <FontAwesomeIcon
            icon={faBell}
            className="cursor-pointer text-[1.2vw] max-sm:hidden"
            color="gray"
          />
          <div className="w-[2.3rem] h-[2.3rem] bg-indigo rounded-full flex items-center justify-center max-sm:hidden">
            <FontAwesomeIcon
              icon={faUser}
              className="cursor-pointer"
              color="white"
            />
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
              {/* notification icon */}
              <div className="flex w-full border-2 py-2 rounded-sm bg-gray-200 pl-2">
                <p>Notification</p>
              </div>
              <div className="flex bg- w-full border-2 py-2 rounded-sm bg-gray-200 pl-2">
                <p>DashBoard</p>
              </div>
              <div className="flex bg- w-full  border-2 py-2 rounded-sm bg-gray-200 pl-2">
                <p>Profile</p>
              </div>
            </ul>
          ) : (
            <ul className="flex flex-col items-start justify-between mt-10 max-sm:text-[.8rem] gap-2">
              {/* notification icon */}
              <button className="outline-none border-2 w-full py-2 hover:text-indigo duration-100 transition-all ease-linear ">
                Login
              </button>
              <button className="bg-lightBlue py-2 rounded-sm w-full outline-none border-none hover:bg-indigo hover:text-zinc-50 duration-200 transition-all ease-linear">
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
