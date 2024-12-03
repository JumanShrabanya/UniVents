import React, { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import FooterSection from "../components/FooterSection";
import { AuthContext } from "../contexts/Authcontext";
import { UpdateProfile } from "../services/UpdateProfile";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileComponent = () => {
  const navigate = useNavigate();

  // to get the user details from the auth-context
  const { logedIn, role, userDetails, setUserDetails, setRole, setLogedIn } =
    useContext(AuthContext);

  // to know if the user is editing the profile details
  const [isEditing, setEditing] = useState(false);
  //  to disable the profile detail inputs
  const [inputDisable, setInputDisable] = useState(true);

  // to toggle the editing state
  const handleToggleEditingState = () => {
    setEditing(!isEditing);
    setInputDisable(!inputDisable);
  };

  // states to handle the new change inputs
  const [name, setName] = useState(userDetails?.name);
  const [semester, setSemester] = useState(userDetails?.semester);
  const [rollNo, setRollNo] = useState(userDetails?.rollNo);
  const [clubName, setClubName] = useState(userDetails?.clubName);
  const [collegeName, setCollegeName] = useState(userDetails?.collegeName);

  // to handle the detail changes
  const handleProfileUpdate = async () => {
    try {
      // Construct payload based on role
      const payload =
        role === "student"
          ? { name, semester, rollNo, collegeName }
          : { clubName, collegeName };

      // Make the API call
      const response = await UpdateProfile(payload);

      // Check response status
      if (response?.status === 200) {
        console.log(response.data.data.user);
        setEditing(false);
        setInputDisable(true);
      } else {
        console.log("failed to update the profile", error);
      }
    } catch (error) {
      console.error("Error during profile update:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  // to handle the logout
  const handleLogout = async () => {
    // Remove tokens from local or session storage (if used)
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    const apiUrl = "http://localhost:8000/api/v1/user/logout";
    try {
      // Ensure cookies are sent with the request
      const response = await axios.post(apiUrl, {}, { withCredentials: true });

      if (response.status === 200) {
        // Clear user details and logout state in the context
        setUserDetails({});
        setRole("");
        setLogedIn(false);
        // Redirect to the homepage or another route after logout
        navigate("/");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="">
      {/* navbar */}
      <NavBar></NavBar>
      <div className="px-[4vw]">
        {/* heading */}
        {/* <div className="mt-[1rem]">
          <h2 className="text-indigo text-[1.5rem] font-semibold font-mainFont">
            Profile
          </h2>
        </div> */}
        {/* name and the update info */}
        <div className="flex  md:flex-row flex-col justify-between md:gap-0 gap-[2rem] items-start md:items-center py-[2rem]">
          {/* circle avatar */}
          <div className="flex items-center gap-[1rem]">
            <div className="select-none bg-indigo p-4 rounded-full w-[3rem] h-[3rem] flex items-center justify-center">
              <p className="text-white">J</p>
            </div>
            <div className="flex flex-col">
              <p className="text-[22px]">
                {userDetails?.name || userDetails?.clubName}
              </p>
              <p className="text-gray-400 text-[14px]">{userDetails?.email}</p>
            </div>
          </div>
          {/* update profile button */}
          {!isEditing ? (
            <button
              onClick={handleToggleEditingState}
              className={`px-8 py-2 border-[1px] border-indigo rounded-lg hover:bg-indigo hover:text-white transition-all duration-200 ease-linear `}
            >
              Update Profile
            </button>
          ) : (
            <div className="flex gap-4">
              {" "}
              <button
                onClick={handleToggleEditingState}
                className="px-5 py-1 border-[1px] border-indigo rounded-lg hover:bg-gray-200  hover:border-gray-200 transition-all duration-200 ease-linear"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileUpdate}
                className="px-8 py-2 bg-indigo text-white  rounded-lg hover:bg-indigoHover hover:text-white transition-all duration-200 ease-linear hover:border-white "
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
      {/* other details */}
      <div className="px-[4vw] pb-[2rem]">
        {/* main content area */}
        <div className="border-[1px]  border-gray-400 py-[2rem] rounded-lg px-[2rem] ">
          {/* name */}
          {role === "organizer" ? (
            <div className="flex lg:flex-row flex-col gap-[1rem] md:gap-[4rem] mb-[2rem] md:justify-start">
              <div className="flex flex-col md:w-[40%] xl:w-[30%]">
                <label htmlFor="nameInput" className="font-medium">
                  Club Name
                </label>
                <p className="text-gray-400 text-[10px] md:text-[12px]">
                  Name of the club of the organizer that will organize events
                </p>
              </div>
              <input
                disabled={inputDisable}
                type="text"
                id="nameInput"
                className={`rounded-lg capitalize lg:w-[40%] outline-none border-[1px] border-gray-200 h-10 md:h-[3rem] pl-4 ${
                  inputDisable && "bg-zinc-100"
                }`}
                onChange={(e) => {
                  setClubName(e.target.value);
                }}
                value={clubName}
              />
            </div>
          ) : (
            <div className="flex lg:flex-row flex-col gap-[1rem] md:gap-[4rem] mb-[2rem] md:justify-start">
              <div className="flex flex-col md:w-[40%] xl:w-[30%]">
                <label htmlFor="nameInput" className="font-medium">
                  Name
                </label>
                <p className="text-gray-400 text-[10px] md:text-[12px]">
                  This name will be used during registering in events
                </p>
              </div>
              <input
                disabled={inputDisable}
                type="text"
                id="nameInput"
                className={`rounded-lg capitalize  lg:w-[40%] outline-none border-[1px] border-gray-200 h-10 md:h-[3rem] pl-4 ${
                  inputDisable && "bg-zinc-100"
                }`}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
              />
            </div>
          )}

          {/* college */}
          <div className="flex lg:flex-row flex-col gap-[1rem] md:gap-[4rem] mb-[2rem] md:justify-start">
            <div className="flex flex-col md:w-[40%] xl:w-[30%]">
              <label htmlFor="nameInput" className="font-medium">
                College
              </label>
              <p className="text-gray-400 text-[10px] md:text-[12px]">
                College name to associate your profile with relevant events and
                updates.
              </p>
            </div>
            <input
              disabled={inputDisable}
              type="text"
              id="nameInput"
              className={`rounded-lg capitalize  lg:w-[40%] outline-none border-[1px] border-gray-200 h-10 md:h-[3rem] pl-4 ${
                inputDisable && "bg-zinc-100"
              }`}
              onChange={(e) => {
                setCollegeName(e.target.value);
              }}
              value={collegeName}
            />
          </div>
          {/* for the roll no */}
          {role === "student" ? (
            <div className="flex lg:flex-row flex-col gap-[1rem] md:gap-[4rem] mb-[2rem] md:justify-start">
              <div className="flex flex-col md:w-[40%] xl:w-[30%]">
                <label htmlFor="nameInput" className="font-medium">
                  RollNo
                </label>
                <p className="text-gray-400 text-[10px] md:text-[12px]">
                  Roll No of the participant assigned by the college or
                  university
                </p>
              </div>
              <input
                disabled={inputDisable}
                type="text"
                id="nameInput"
                className={`rounded-lg  lg:w-[40%] outline-none border-[1px] border-gray-200 h-10 md:h-[3rem] pl-4 ${
                  inputDisable && "bg-zinc-100"
                }`}
                onChange={(e) => {
                  setRollNo(e.target.value);
                }}
                value={rollNo}
              />
            </div>
          ) : null}
          {/* for the semester */}
          {role === "student" ? (
            <div className="flex lg:flex-row flex-col gap-[1rem] md:gap-[4rem] mb-[2rem] md:justify-start">
              <div className="flex flex-col md:w-[40%] xl:w-[30%]">
                <label htmlFor="nameInput" className="font-medium">
                  Semester
                </label>
                <p className="text-gray-400 text-[10px] md:text-[12px]">
                  Current semester of the participant
                </p>
              </div>
              <input
                disabled={inputDisable}
                type="text"
                id="nameInput"
                className={`rounded-lg  lg:w-[40%] outline-none border-[1px] border-gray-200 h-10 md:h-[3rem] pl-4 ${
                  inputDisable && "bg-zinc-100"
                }`}
                onChange={(e) => {
                  setSemester(e.target.value);
                }}
                value={semester}
              />
            </div>
          ) : null}

          {/* role */}
          <div className="flex lg:flex-row flex-col gap-[1rem] md:gap-[4rem] mb-[2rem] md:justify-start">
            <div className="flex flex-col md:w-[40%] xl:w-[30%]">
              <label htmlFor="nameInput" className="font-medium">
                Role
              </label>
              <p className="text-gray-400 text-[10px] md::text-[12px]">
                Role of the User (Participant or Organizer)
              </p>
            </div>
            <input
              disabled
              type="text"
              id="nameInput"
              className={`rounded-lg lg:w-[40%] outline-none border-[1px] border-gray-200 h-10 md:h-[3rem] pl-4 capitalize cursor-not-allowed select-none`}
              value={role}
            />
          </div>
        </div>
        {/* logout */}
        <button
          onClick={handleLogout}
          className="my-[2rem] hover:bg-indigoHover text-white bg-indigo px-8 py-2 rounded-md"
        >
          Logout
        </button>
      </div>
      {/* footer */}
      <FooterSection></FooterSection>
    </div>
  );
};

export default ProfileComponent;
