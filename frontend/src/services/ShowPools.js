import axios from "axios";

const apiUrl = "http://localhost:8000/voting/show-pools";

export const showPools = async () => {
  try {
    const response = await axios.get(apiUrl, { withCredentials: true });
    return response;
  } catch (error) {
    console.log("error fetching the pools", error.message);
  }
};
