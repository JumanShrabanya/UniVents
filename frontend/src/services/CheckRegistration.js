import axios from "axios";

export const checkRegistration = async ({ eventId, studentId }) => {
  const apiUrl = "http://localhost:8000/api/v1/event/check-registration";

  try {
    const response = await axios.post(
      apiUrl,
      { eventId, studentId },
      { withCredentials: true }
    );
    if (response.status === 201) {
      console.log("isRegistered:", response.data);
      return response;
    }
  } catch (error) {
    console.log("error finding the registration status");
  }
};
