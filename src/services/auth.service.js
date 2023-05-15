import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/auth";

const register = (username, email, password) => {
  return axios.post(API_URL + "/register", {
    username,
    email,
    password,
  });
};

const login = async (username, password) => {
  const response = await axios.post(API_URL + "/login", {
    username,
    password,
  });
  console.log(response.data);
  if (response.data.accessToken) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const getAllUsers = () => {
  return axios.get(API_URL + "/users", {headers: authHeader()});
};

const deleteUserById = (id) => {
  return axios.delete(API_URL + `/users/${id}`, {headers: authHeader()});
}

const authService = {
  register,
  login,
  logout,
  getAllUsers,
  deleteUserById
};

export default authService;
