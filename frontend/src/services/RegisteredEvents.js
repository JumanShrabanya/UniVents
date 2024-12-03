import axios from "axios";

export const RegisteredEvents = async () => {
  const apiUrl = "http://localhost:8000/app/registered-events";
  try {
    const response = await axios.get(apiUrl, {
      withCredentials: true,
    });
    // console.log("registered events", response);
    return response;
  } catch (error) {
    console.log("Error fetching the registered events", error);
  }
};
