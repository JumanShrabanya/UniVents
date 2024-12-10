import axios from "axios";

const apiUrl =
  "http://localhost:8000/dashboard-organizer/get-registered-participants";

export const GetRegisteredParticipants = async (eventId) => {
  console.log(eventId);

  try {
    const response = await axios.post(
      apiUrl,
      { eventId },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    console.log("error fetching the registered participants", error);
  }
};
