import axios from "../api/api"; // ✅ correct path


export const getUserProfile = async () => {
  const response = await axios.get("/users/profile");
  return response.data;
};

export const updateUserProfile = async (payload) => {
  const response = await axios.put("/users/profile", payload);
  return response.data;
};
