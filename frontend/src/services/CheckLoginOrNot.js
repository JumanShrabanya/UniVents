import axios from "axios";

const apiUrl = "http://localhost:8000/api/v1/user/check-auth-status";

export const CheckLoginOrNot = async ({ userId }) => {
  const response = await axios.post(
    `${apiUrl}`,
    { userId },
    {
      withCredentials: true,
    }
  );
  return response.data;
};
