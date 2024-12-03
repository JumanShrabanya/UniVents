import React, { useContext } from "react";
import { AuthContext } from "../contexts/Authcontext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";

const FooterSection = () => {
  const { logedIn, role } = useContext(AuthContext);
  return (
    <section className="bg-footer px-[4vw] py-[1.2rem] md:pt-[2rem] ">
      {/* for the content area */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-[2rem]">
        {/* left part */}
        <div className="md:w-[40%] w-full md:text-left text-center">
          <a href="#">
            <h2 className="text-[1.3rem] md:text-[1.2rem]  tracking-[.3em] text-indigo font-normal font-sans select-none">
              UNIVENTS
            </h2>
          </a>
          <h1 className="text-indigo mt-2 text-[1.1rem] md:text-[1rem]">
            Explore, Organize & Register for College Events
          </h1>
        </div>
        {/* right part */}
        <div className="flex flex-1 md:flex-row flex-col md:w-[50%] w-full justify-center items-center md:justify-end md:gap-[6rem] gap-[2rem]">
          <div className="flex flex-col md:items-start items-center gap-2 md:text-left text-center">
            <p className="text-[1.2rem] text-indigo">UniVents</p>
            <ul className="text-[.9rem] flex flex-col justify-items-start gap-2">
              <li>
                <a href="#" className="links">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="links">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="links">
                  Help
                </a>
              </li>
            </ul>
          </div>
          {/* ///// */}
          <div className="flex flex-col md:items-start items-center gap-2 md:text-left text-center">
            <p className="text-[1.2rem] text-indigo">Events</p>
            <ul className="text-[.9rem] flex flex-col justify-items-start gap-2">
              <li>
                <a href="#" className="links">
                  Organizer
                </a>
              </li>
              <li>
                <a href="#" className="links">
                  Participant
                </a>
              </li>
              <li>
                <a href="#" className="links">
                  Events
                </a>
              </li>
            </ul>
          </div>
          {/* ///// */}
          <div className="flex flex-col md:items-start items-center gap-2 md:text-left text-center">
            <p className="text-[1.2rem] text-indigo">Connect</p>
            <ul className="text-[.9rem] flex flex-col justify-items-start gap-2">
              <li className="flex items-center md:justify-normal justify-center gap-2 hover:text-indigo transition-all duration-100 ease-linear cursor-pointer">
                <FontAwesomeIcon
                  icon={faXTwitter}
                  className="text-[14px] "
                ></FontAwesomeIcon>
                <a href="#" className="links">
                  Twitter
                </a>
              </li>
              <li className="flex items-center gap-2 hover:text-indigo transition-all duration-100 ease-linear cursor-pointer">
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="text-[14px] "
                ></FontAwesomeIcon>
                <a href="#" className="links">
                  Instagram
                </a>
              </li>
              <li className="flex items-center gap-2 hover:text-indigo transition-all duration-100 ease-linear cursor-pointer">
                <FontAwesomeIcon
                  icon={faFacebook}
                  className="text-[14px] "
                ></FontAwesomeIcon>
                <a href="#" className="links">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* for the bottom line section */}
      <hr className="border-[1px] border-gray-300 my-[1.2rem] md:mt-[2rem]" />
      {/* for the copyright info section */}
      <div className="flex items-center justify-between md:flex-row flex-col gap-[.8rem] md:gap-0">
        {/* left side */}
        <div className="flex items-center gap-2 text-indigo">
          <FontAwesomeIcon icon={faCopyright}></FontAwesomeIcon>
          <h2 className="text-[1rem] md:text-[1rem] tracking-[.3em] text-indigo font-normal font-sans select-none">
            UNIVENTS
          </h2>
        </div>
        {/* right side */}
        <div className="flex justify-end text-[.9rem] gap-[3rem] text-indigo underline">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </section>
  );
};

export default FooterSection;
