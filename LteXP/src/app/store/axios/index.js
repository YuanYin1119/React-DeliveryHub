import axios from 'axios';
const instance = axios.create(
  {
    baseURL: process.env.REACT_APP_BACKEND_API,
    timeout: 10 * 60 * 1000,
    headers: {
      Accept: 'application/json',
    },
  }
);
export default instance;