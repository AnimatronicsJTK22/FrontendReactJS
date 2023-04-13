import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const userTableService = {
    getAllUsers
}

export default userTableService
