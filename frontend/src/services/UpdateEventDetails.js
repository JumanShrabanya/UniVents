import axios from "axios";

const apiUrl = "https://univents-backend.vercel.app/dashboard-organizer/update-event";

export const UpdateEventDetails = async (eventId, details) => {
  try {
    const response = await axios.patch(
      `${apiUrl}/${eventId}`,
      {
        updatedFields: details,
      },
      {
        withCredentials: true, // Ensure cookies are sent with the request
      }
    );
    return response; // Return the response data
  } catch (error) {
    console.error(
      "Error updating event details:",
      error.response?.data || error.message
    );
    throw error;
  }
};
