import axios from "axios";

const apiUrl = "http://localhost:8000/voting/cast-vote";
export const CastVote = async (option, pollTitle) => {
  console.log(option, pollTitle);

  try {
    const response = await axios.post(
      apiUrl,
      { option, pollTitle },
      { withCredentials: true }
    );

    return response;
  } catch (error) {
    console.log("error casting the vote");
  }
};
