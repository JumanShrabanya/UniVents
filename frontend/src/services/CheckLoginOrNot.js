import axios from "axios";

const apiUrl = "https://univents-backend.vercel.app/api/v1/user/check-auth-status";

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
