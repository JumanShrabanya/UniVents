import axios from "axios";

export const CreatedEvents = async () => {
  try {
    const response = await axios.get(
      "https://univents-backend.vercel.app/dashboard-organizer/created-events",
      { withCredentials: true }
    );

    if (response) {
      // console.log(response.data);
      return response.data;
    }
  } catch (err) {
    console.log("error fetching the created event", err);
  }
};
