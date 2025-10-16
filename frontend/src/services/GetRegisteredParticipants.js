import axios from "axios";

const apiUrl =
  "https://univents-backend.vercel.app/dashboard-organizer/get-registered-participants";

export const GetRegisteredParticipants = async (eventId) => {
  console.log(eventId);

  try {
    const response = await axios.post(
      apiUrl,
      { eventId },
      { withCredentials: true }
    );
    console.log(response);

    return response;
  } catch (error) {
    console.log("error fetching the registered participants", error);
  }
};
