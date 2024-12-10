import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useState } from "react";
import { useOrgEventForm } from "../contexts/OrganizeEventContext";
import { AuthContext } from "../contexts/Authcontext";
import { useCreateVotingPool } from "../contexts/CreateVotingPoolContext";
import { counter } from "@fortawesome/fontawesome-svg-core";
import { CreatePool } from "../services/CreatePool";
import LoaderAnimation from "./LoaderAnimation";

const CreateVotingPool = () => {
  // to toggle close the create event form
  const {
    isOrgEventOpen,
    setIsOrgEventOpen,
    closeOrgEventForm,
    openOrgEventForm,
  } = useOrgEventForm();

  // to get the user details
  const { userDetails } = useContext(AuthContext);

  //   states to hold values
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [availableFor, setAvailableFor] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [organizer, setorganizer] = useState(userDetails.clubName);
  const [collegeName, setcollegeName] = useState(userDetails.collegeName);
  const [options, setOptions] = useState([""]);

  // to update the option
  const updateOption = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  //   to add another option
  const addOption = () => setOptions([...options, ""]);

  //   to toggle open and close the create voting form
  const { isCreatePoolOpen, closeCreatePool, openCreatePool } =
    useCreateVotingPool();

  // to open the pool form
  const openCreateVotingPoolForm = () => {
    openCreatePool();
    closeOrgEventForm();
  };

  // to handle the voting pool closing
  const handleCloseVotingPool = () => {
    setTitle(""),
      setDescription(""),
      setAvailableFor(""),
      setEndDate(""),
      setEndTime(""),
      setOptions([""]),
      closeCreatePool();
  };

  // to load a animation
  const [creatingPoll, setCreatingPoll] = useState(false);

  //   to handle the pool creation
  const handleCreateVotingPool = async (e) => {
    e.preventDefault();
    setCreatingPoll(true);
    try {
      const response = await CreatePool({
        title,
        description,
        availableFor,
        endDate,
        endTime,
        options,
        collegeName,
        organizer,
      });
      if (response.status === 201) {
        setCreatingPoll(false);
        closeCreatePool();
      }
    } catch (error) {
      console.log("error creating the pool", error);
    }
  };
  return (
    <section className="w-full  md:px-[2rem] px-[1.3rem] py-[1rem] flex justify-center items-center">
      {isCreatePoolOpen ? (
        <form
          onSubmit={handleCreateVotingPool}
          className="relative w-[100%] md:px-[2rem] px-[1.3rem] py-[3rem]  bg-white rounded-lg  border-[1px] border-gray-200"
        >
          {/*  */}
          {/* close icon section */}
          <FontAwesomeIcon
            onClick={handleCloseVotingPool}
            icon={faClose}
            className="absolute top-5 md:top-7 right-2 md:right-5  -translate-x-1/2 -translate-y-1/2 text-[1rem] md:text-[1.3rem] cursor-pointer"
          ></FontAwesomeIcon>
          {/* header text section */}
          <div className="flex flex-col items-center">
            <div className="flex flex-col justify-start">
              <div className="flex items-center gap-2 text-[1.4rem]">
                <h2 className="text-[1.4rem]">Create a Voting Pool</h2>
              </div>
              <p className="text-zinc-500 text-[14px]">
                Please enter all the required credentials
              </p>
            </div>
          </div>
          {/* input area */}
          <div className="mt-[1.5rem] w-full ">
            {/* event title */}
            <div className="mb-10">
              <label htmlFor="title" className="mb-10">
                Event Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-none outline-none bg-gray-200 px-4 py-3 rounded-lg mt-1"
                placeholder="Title for the voting pool"
              />
            </div>
            {/* voting pool description */}
            <div className="mb-10">
              <label htmlFor="description" className="mb-10">
                Description *
              </label>
              <textarea
                id="description"
                type="text"
                value={description}
                required
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border-none outline-none bg-gray-200 px-4 py-3 rounded-lg mt-1"
                placeholder="Describe your voting pool details"
              />
            </div>
            {/* options */}
            {options.map((option, index) => (
              <div key={index} className="mb-10 flex flex-col">
                <label htmlFor={`option-${index}`} className="mb-2">
                  Option {index + 1} *
                </label>
                <input
                  id={`option-${index}`}
                  type="text"
                  value={option}
                  required
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="w-full border-none outline-none bg-gray-200 px-4 py-3 rounded-lg mt-1"
                  placeholder={`Enter option ${index + 1}`}
                />
              </div>
            ))}
            <div
              onClick={addOption}
              className="bg-gray-200 h-10 w-10 rounded-full flex justify-center items-center mb-10 cursor-pointer hover:bg-gray-300 transition-all duration-200"
            >
              +
            </div>

            {/* event available for */}
            <div className="mb-10 flex flex-col ">
              <label htmlFor="availableFor" className="mb-2">
                Available For *
              </label>
              {/* email input */}
              <select
                id="availableFor"
                value={availableFor}
                onChange={(e) => {
                  setAvailableFor(e.target.value);
                }}
                className="p-2 h-12 w-[20%] bg-gray-200 outline-none rounded-md "
              >
                <option value="For Everyone">For Everyone</option>
                <option value="College Only">College Only</option>
              </select>
            </div>
            {/* pool date */}
            <div className="mb-10 flex flex-col w-[20%]">
              <label htmlFor="date" className="mb-2">
                End Date *
              </label>
              {/* date input */}
              <input
                id="date"
                type="date"
                value={endDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
                className="bg-gray-200 p-2 rounded-md w-[100%] h-12"
              ></input>
            </div>
            {/* pool time */}
            <div className="mb-10 flex flex-col w-[20%]">
              <label htmlFor="time" className="mb-2">
                End Time{" "}
                <span className="text-[.8rem] text-zinc-600">(Optional)</span>
              </label>
              {/* time input */}
              <input
                id="time"
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                }}
                className="bg-gray-200 p-2 rounded-md w-[100%] h-12"
              ></input>
            </div>
          </div>
          <div className="flex justify-center items-center ">
            {!creatingPoll ? (
              <button
                type="submit"
                className="py-3 px-12 text-white bg-indigo rounded-lg hover:bg-indigoHover duration-200 ease-linear"
              >
                Create Pool
              </button>
            ) : (
              <LoaderAnimation></LoaderAnimation>
            )}
          </div>
        </form>
      ) : (
        <div
          onClick={openCreateVotingPoolForm}
          className=" py-4 px-10 flex items-center gap-4 cursor-pointer bg-gray-200 rounded-lg hover:bg-indigoHover hover:text-white duration-150 ease-linear"
        >
          <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
          <p>Create Voting Pool</p>
        </div>
      )}
    </section>
  );
};

export default CreateVotingPool;
