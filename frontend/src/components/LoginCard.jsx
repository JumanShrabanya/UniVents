import React, { useContext, useEffect, useState } from "react";
import { useLoginCard } from "../contexts/LoginCardContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { LoginUser } from "../services/LoginUser";
import { AuthContext } from "../contexts/Authcontext";
import { useNavigate } from "react-router-dom";

const LoginCard = () => {
  const { isLoginOpen, closeLogin } = useLoginCard();
  const { setLogedIn, setUserDetails, setRole } = useContext(AuthContext);
  const [passwordType, setPasswordType] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoginOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLoginOpen]);

  const handleTogglePasswordVisibility = () => {
    setPasswordType(!passwordType);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const error = {};
    if (!email) {
      error.email = "Please enter the email";
    }
    if (!password) {
      error.password = "Please enter the password";
    }

    if (Object.keys(error).length > 0) {
      setErrors(error);
      return;
    }

    try {
      const response = await LoginUser({ email, password });
      if (response.data) {
        console.log("User logged in successfully:", response.data.user);
        setLogedIn(true);
        setUserDetails(response.data.user);
        setRole(response.data.user.role);
        closeLogin();
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      setErrors({ incorrect: "Email or password is incorrect" });
    }
  };

  return isLoginOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center h-full w-full">
      <form
        onSubmit={handleLogin}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[90%] md:w-[50%] px-[1rem] md:px-[2rem] py-[2rem] rounded-lg"
      >
        <FontAwesomeIcon
          onClick={() => {
            closeLogin();
            setEmail("");
            setPassword("");
          }}
          icon={faClose}
          className="absolute top-5 md:top-7 right-2 md:right-5 -translate-x-1/2 -translate-y-1/2 text-[1rem] md:text-[1.3rem] cursor-pointer"
        />
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
        <div className="mt-[1.5rem]">
          <div className="mb-2">
            <label htmlFor="email" className="mb-4">
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
              }}
              className="w-full border-none outline-none bg-zinc-200 px-4 py-3 rounded-lg mt-1"
              placeholder="example@gmail.com"
            />
            {errors.email && (
              <p className="text-[11px] text-red-600 mt-2">{errors.email}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="mb-4">
              Password *
            </label>
            <div className="w-full flex items-center justify-between bg-zinc-200 rounded-lg mt-1 pr-4">
              <input
                id="password"
                type={passwordType ? "password" : "text"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
                }}
                className="px-4 py-3 w-[95%] bg-transparent border-none outline-none"
              />
              <FontAwesomeIcon
                icon={passwordType ? faEye : faEyeSlash}
                className="cursor-pointer"
                onClick={handleTogglePasswordVisibility}
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-600 mt-2">{errors.password}</p>
            )}
          </div>
        </div>
        <div className="mt-[1rem] flex justify-center items-center">
          {errors.incorrect && (
            <p className="text-[13px] text-red-600">{errors.incorrect}</p>
          )}
        </div>
        <div className="flex justify-center items-center mb-[1rem]">
          <button
            type="submit"
            className="mt-2 bg-indigo text-white md:text-[.9rem] md:py-[.9rem] md:px-[1.9rem] lg:text-[1rem] lg:py-[.75vw] lg:px-[1.75vw] py-[2vw] px-[9vw] rounded-lg outline-none border-none hover:bg-indigoHover duration-200 transition-all ease-linear capitalize"
          >
            Login
          </button>
        </div>

        {/* to show the register page if dont have an account */}
        <div className="flex justify-center items-center">
          <p>
            New to Univents?{" "}
            <span
              onClick={() => {
                navigate("/registration");
                closeLogin();
              }}
              className="text-indigo cursor-pointer underline"
            >
              Register
            </span>
          </p>
        </div>
      </form>
    </div>
  ) : null;
};

export default LoginCard;
