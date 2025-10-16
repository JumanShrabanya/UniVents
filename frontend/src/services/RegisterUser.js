import axios from "axios";

const apiUrlParticipant =
  "https://univents-backend.vercel.app/api/v1/user/register-participant";
const apiUrlOrg = "https://univents-backend.vercel.app/api/v1/user/register-club";

export const registerUser = async (
  { email, name, clubName, semester, password, collegeName, rollNo },
  userType
) => {
  try {
    if (userType === "organizer") {
      const response = await axios.post(
        `${apiUrlOrg}`,
        { email, clubName, password, collegeName },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);

      return response;
    }
    if (userType === "participant") {
      const response = await axios.post(
        `${apiUrlParticipant}`,
        { email, password, collegeName, name, rollNo, semester },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      return response;
    }
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
