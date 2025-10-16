import axios from "axios";

const apiUrl = "https://univents-backend.vercel.app/api/v1/user/login";

export const LoginUser = async ({ email, password }) => {
  try {
    const response = await axios.post(
      apiUrl,
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    // Capture the error details and throw them for handling in the component
    throw error.response;
  }
};
