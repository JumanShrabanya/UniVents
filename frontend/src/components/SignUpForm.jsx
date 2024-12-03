import React, { useContext, useState } from "react";
import { useUserType } from "../contexts/UserTypeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faPeopleGroup,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/Authcontext";
import { registerUser } from "../services/RegisterUser";
import { useRegisterCard } from "../contexts/RegisterCardContext";

const SignUpForm = () => {
  // to know to which form to open organi zer or participant based on the user click
  const { userType, selectUserType } = useUserType();
  const [passwordType, setPasswordType] = useState(true);

  // to set that the user is logged in
  const { logedIn, role, setLogedIn, setRole } = useContext(AuthContext);
  // useNavigate hook
  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => {
    setPasswordType((prev) => !prev);
  };

  // for the form validation
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [semester, setSemester] = useState(0);
  const [rollNo, setRollno] = useState("");
  const [collegeName, setCollege] = useState("");
  const [clubName, setClubName] = useState("");
  // to hold the errors
  const [errors, setErrors] = useState({});

  // register card context
  const { isRegisterCardOpen, openRegisterCard, closeRegisterCard, eventData } =
    useRegisterCard();

  // for the submition of the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = {};
    if (password.length < 8) {
      error.length = "Password must be at least 8 characters long";
    }
    const specialCharacters = /[!@#$%^&*()_+\-={}\[\]<>,.?/]/;
    if (!specialCharacters.test(password)) {
      error.specialChar = "Password must contain special characters";
    }
    if (Object.keys(error).length > 0) {
      setErrors(error);
      return;
    }
    console.log("Form submitted successfully");

    // send the data to the backend
    try {
      let response;
      if (userType === "organizer") {
        response = await registerUser(
          {
            email,
            password,
            collegeName,
            clubName,
          },
          userType
        );
      }
      if (userType === "participant") {
        response = await registerUser(
          {
            email,
            password,
            collegeName,
            semester,
            name,
            rollNo,
          },
          userType
        );
      }
      // after successfull submission navigate to dashboard
      if (response.statusCode === 201) {
        setRole(userType);
        setLogedIn(true);
        closeRegisterCard();
      }
    } catch (err) {
      // console.error("Registration failed", err);
      setErrors({
        message: err.message,
      });
    }
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="relative md:px-[2rem] px-[1.3rem] py-[3rem] bg-white rounded-lg w-[95%] md:w-[75%] lg:w-[50%]"
      >
        {/* close icon section */}
        <FontAwesomeIcon
          onClick={() => selectUserType("")}
          icon={faClose}
          className="absolute top-5 md:top-7 right-2 md:right-5  -translate-x-1/2 -translate-y-1/2 text-[1rem] md:text-[1.3rem] cursor-pointer"
        ></FontAwesomeIcon>
        {/* header text section */}
        <div className="flex flex-col items-center">
          <div className="flex flex-col justify-start">
            <div className="flex items-center gap-2 text-[1.4rem]">
              <FontAwesomeIcon
                icon={userType === "organizer" ? faPeopleGroup : faUser}
              ></FontAwesomeIcon>
              <h2 className="text-[1.4rem]">
                Get started as{" "}
                <span className="capitalize font-semibold text-indigo">
                  {userType}
                </span>
              </h2>
            </div>
            <p className="text-zinc-500 text-[14px]">
              Please enter all the required credentials
            </p>
          </div>
        </div>
        {
          <div className="mt-[1.5rem] w-full">
            <div className="mb-2">
              <label htmlFor="email" className="mb-4">
                Email *
              </label>
              {/* email input */}
              <input
                id="email"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-none outline-none bg-zinc-200 px-4 py-3 rounded-lg mt-1"
                placeholder="example@gmail.com"
              />
            </div>
            {userType === "participant" && (
              <div className="mb-2">
                <label htmlFor="name" className="mb-4">
                  Name *
                </label>
                {/* name input */}
                <input
                  id="name"
                  type="text"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-none outline-none bg-zinc-200 px-4 py-3 rounded-lg mt-1"
                  placeholder="example@gmail.com"
                />
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="college" className="mb-4">
                College Name *
              </label>
              {/* college name input */}
              <input
                id="college"
                type="text"
                value={collegeName}
                onChange={(e) => setCollege(e.target.value)}
                required
                className="w-full border-none outline-none bg-zinc-200 px-4 py-3 rounded-lg mt-1"
                placeholder="example college"
              />
            </div>
            {userType === "organizer" && (
              <div className="mb-3">
                <label htmlFor="club" className="mb-4">
                  Club Name *
                </label>
                {/* club name input */}
                <input
                  id="club"
                  type="text"
                  value={clubName}
                  required
                  onChange={(e) => setClubName(e.target.value)}
                  className="w-full border-none outline-none bg-zinc-200 px-4 py-3 rounded-lg mt-1"
                  placeholder="Arts & Craft"
                />
              </div>
            )}
            {userType === "participant" && (
              <div className="mb-2">
                <label htmlFor="semester" className="mb-4">
                  Semester *
                </label>
                {/* semester input */}
                <input
                  id="semester"
                  type="number"
                  min={1}
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                  className="w-full border-none outline-none bg-zinc-200 px-4 py-3 rounded-lg mt-1"
                  placeholder="eg: 4"
                />
              </div>
            )}
            {userType === "participant" && (
              <div className="mb-2">
                <label htmlFor="rollno" className="mb-4">
                  RollNo *
                </label>
                {/* roll no input */}
                <input
                  id="rollno"
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollno(e.target.value)}
                  required
                  className="w-full border-none outline-none bg-zinc-200 px-4 py-3 rounded-lg mt-1"
                />
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="password" className="mb-4">
                Password *
              </label>
              <div className="w-full flex items-center justify-between  bg-zinc-200 rounded-lg mt-1 pr-4">
                {/* password input */}
                <input
                  id="password"
                  type={passwordType ? "password" : "text"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="px-4 py-3 w-[95%] bg-transparent border-none outline-none"
                />
                <FontAwesomeIcon
                  icon={passwordType ? faEye : faEyeSlash}
                  className="cursor-pointer"
                  onClick={handleTogglePasswordVisibility}
                ></FontAwesomeIcon>
              </div>
              <div className="flex flex-col gap-1 mt-2 text-red-600">
                <p className="text-[11px]">{errors.length}</p>
                <p className="text-[11px]">{errors.specialChar}</p>
              </div>
            </div>
          </div>
        }
        <div className="flex justify-center items-center">
          <button
            type="submit"
            className="mt-2 bg-indigo text-white md:text-[.9rem] md:py-[.9rem] md:px-[1.9rem] lg:text-[1rem] lg:py-[.75vw] lg:px-[1.75vw] py-[2.7vw] px-[4vw] rounded-lg outline-none border-none hover:bg-indigoHover duration-200 transition-all ease-linear capitalize"
          >
            {`Register as ${userType}`}
          </button>
        </div>
        {/* to show the message */}
        {errors.message ? (
          <div className="flex items-center justify-center mt-2 gap-2">
            <p className="text-red-600">{errors.message}.</p>
            <p className="text-black underline text-[16px] cursor-pointer">
              Login
            </p>
          </div>
        ) : null}
      </form>
    </section>
  );
};

export default SignUpForm;
