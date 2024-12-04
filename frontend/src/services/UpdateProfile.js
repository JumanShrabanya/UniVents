import axios from "axios";

const apiUrl = "http://localhost:8000/api/v1/user/update-profile";

export const UpdateProfile = async ({ payload, role }) => {
  try {
    console.log(payload);
    console.log(role);

    // Send API request with the payload
    const response = await axios.patch(
      apiUrl,
      { ...payload, role },
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    console.log(
      "Error updating profile:",
      error.response?.data || error.message
    );
    // Re-throw the error so the caller can handle it
  }
};
