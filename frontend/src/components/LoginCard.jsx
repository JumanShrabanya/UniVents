import React, { useEffect, useState } from "react";
import { useLoginCard } from "../contexts/LoginCardContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const LoginCard = () => {
  // to know the login clicked state
  const { isLoginOpen, closeLogin } = useLoginCard();

  //   to set the password field state for password visibility
  const [passwordType, setPasswordType] = useState(true);

  //   to handle the login form close event

  useEffect(() => {
    if (isLoginOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLoginOpen]);

  //   to toggel the password visibility
  const handleTogglePasswordVisibility = () => {
    setPasswordType((val) => setPasswordType(!val));
  };

  // func to handle the login button submission
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Loged in");
  };

  return isLoginOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center h-full w-full">
      <form className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[50%] px-[2rem] py-[2rem] rounded-lg">
        {/* close icon */}
        <FontAwesomeIcon
          onClick={closeLogin}
          icon={faClose}
          className="absolute top-5 md:top-7 right-2 md:right-5  -translate-x-1/2 -translate-y-1/2 text-[1rem] md:text-[1.3rem] cursor-pointer"
        ></FontAwesomeIcon>
        {/* header section */}
        <div className="flex flex-col items-center">
          <div className="flex flex-col justify-start">
            <div className="flex items-center gap-2 text-[1.4rem]">
              <h2 className="text-[1.4rem]">Login In</h2>
            </div>
            <p className="text-zinc-500 text-[14px]">
              Please enter all the required credentials
            </p>
          </div>
        </div>
        {/* inputs section */}
        <div className=" mt-[1.5rem]">
          <div className="mb-2">
            <label htmlFor="email" className="mb-4">
              Email *
            </label>
            {/* email input */}
            <input
              id="email"
              type="email"
              //   value={email}
              required
              //   onChange={(e) => setEmail(e.target.value)}
              className="w-full border-none outline-none bg-zinc-200 px-4 py-3 rounded-lg mt-1"
              placeholder="example@gmail.com"
            />
          </div>
          {/* password */}
          <div className="mb-3">
            <label htmlFor="password" className="mb-4">
              Password *
            </label>
            <div className="w-full flex items-center justify-between  bg-zinc-200 rounded-lg mt-1 pr-4">
              {/* password input */}
              <input
                id="password"
                type={passwordType ? "password" : "text"}
                // value={password}
                // onChange={(e) => setPassword(e.target.value)}
                required
                className="px-4 py-3 w-[95%] bg-transparent border-none outline-none"
              />
              <FontAwesomeIcon
                icon={passwordType ? faEye : faEyeSlash}
                className="cursor-pointer"
                onClick={handleTogglePasswordVisibility}
              ></FontAwesomeIcon>
            </div>
          </div>
        </div>
        <button type="submit" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  ) : null;
};

export default LoginCard;
