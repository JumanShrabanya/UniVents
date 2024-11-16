import axios from "axios";

const apiUrl = "http://localhost:8000/api/v1/event/create-event";

export const CreateEvent = async ({
  title,
  description,
  eventDate,
  venue,
  category,
  coverImg,
  availableFor,
  availableSeats,
  collegeName,
}) => {
  console.log(
    title,
    description,
    eventDate,
    venue,
    category,
    coverImg,
    availableFor,
    availableSeats,
    collegeName
  );

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("eventDate", eventDate);
    formData.append("venue", venue);
    formData.append("category", category);
    formData.append("availableFor", availableFor);
    formData.append("availableSeats", availableSeats);
    formData.append("collegeName", collegeName);

    // Append the cover image file if it exists

    if (coverImg) {
      console.log("Cover Image File:", coverImg);
      formData.append("coverImg", coverImg);
    }

    // Send the FormData object with axios
    const response = await axios.post(apiUrl, formData, {
      withCredentials: true, // to send cookies if any (for authentication)
      headers: {
        // Don't manually set Content-Type when using FormData
        // Axios will automatically set the correct Content-Type
      },
    });
    console.log(response.data);

    return response;
  } catch (error) {
    console.log("Failed to create the event:", error);
    if (error.response) {
      console.error("API error:", error.response.data);
    }
  }
};
