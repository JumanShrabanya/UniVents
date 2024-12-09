import axios from "axios";

const apiUrl = "http://localhost:8000/voting/create-voting-pool";
export const CreatePool = async (poolValues) => {
  console.log(poolValues.organizer);

  try {
    const response = await axios.post(
      apiUrl,
      { poolValues },
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    console.log("error creating voting pool", error);
  }
};
