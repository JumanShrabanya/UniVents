import axios from "axios";

const apiUrlParticipant =
  "http://localhost:8000/api/v1/user/register-participant";
const apiUrlOrg = "http://localhost:8000/api/v1/user/register-club";

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

      return response.data;
    }
    if (userType === "participant") {
      const response = await axios.post(
        `${apiUrlParticipant}`,
        { email, password, collegeName, name, rollNo, semester },
        {
          withCredentials: true,
        }
      );
      return response.data;
    }
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
