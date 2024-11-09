import axios from "axios";

const apiUrl = "http://localhost:8000/dashboard-organizer/created-events";

export const CreatedEvents = async () => {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    // Check if the error is a response error (i.e., the server responded with a status outside the 2xx range)
    if (error.response) {
      console.error("Response error:", error.response);
      throw new Error(
        `Error: ${error.response.status} - ${
          error.response.data.message || error.response.statusText
        }`
      );
    }
    // If no response was received (e.g., network error)
    else if (error.request) {
      console.error("Request error:", error.request);
      throw new Error("No response received from the server.");
    }
    // Handle any other errors
    else {
      console.error("General error:", error.message);
      throw new Error(`Error: ${error.message}`);
    }
  }
};
