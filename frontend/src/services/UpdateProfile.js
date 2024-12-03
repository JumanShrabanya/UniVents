import axios from "axios";

const apiUrl = "http://localhost:8000/api/v1/user/update-profile";

export const UpdateProfile = async ({ payload }) => {
  try {
    // Send API request with the payload
    const response = await axios.patch(apiUrl, payload, {
      withCredentials: true,
    });

    return response;
  } catch (error) {
    console.error("Error updating profile:", error);
    // Re-throw the error so the caller can handle it
  }
};
