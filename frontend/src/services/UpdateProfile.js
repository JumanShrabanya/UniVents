import axios from "axios";

const apiUrl = `http://localhost:8000/api/v1/user/update-profile`;

export const UpdateProfile = async (
  { role },
  { name, collegeName, semester, rollNo, clubName }
) => {
  console.log({ name, collegeName, semester, rollNo, clubName });

  try {
    let response;
    if (role === "student") {
      response = await axios.post(
        apiUrl,
        { name, collegeName, semester, rollNo },
        { withCredentials: true }
      );
    }
    if (role === "organizer") {
      response = await axios.post(
        apiUrl,
        { clubName, collegeName },
        { withCredentials: true }
      );
    }

    return response;
  } catch (error) {
    console.log("error updating profile", error);
  }
};
