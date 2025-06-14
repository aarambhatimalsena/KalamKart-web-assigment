import axios from "../api/api"; 
export const loginUserService = async ({ email, password }) => {
  const response = await axios.post("/users/login", { email, password });
  return response.data;
};

export const registerUserService = async ({ name, email, password }) => {
  const response = await axios.post("http://localhost:5000/api/users/register", {
    name,
    email,
    password,
  });
  return response.data;
};

export const googleLogin = async (token) => {
  const response = await axios.post("/users/google-login", { token });
  return response.data;
};

export const sendOtp = async (email) => {
  const response = await axios.post("/otp/send-otp", { email });
  return response.data;
};

export const verifyOtp = async (payload) => {
  const response = await axios.post("/otp/verify-otp", payload);
  return response.data;
};




