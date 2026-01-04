import axios from 'axios';

// Automatically use network IP if accessing from network, otherwise use localhost
const getBaseURL = () => {
  const hostname = window.location.hostname;

  // If accessing via network IP (not localhost), use network IP for backend
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:5001/api`;
  }

  // Default to localhost
  return 'http://localhost:5001/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
});


API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token && req.headers) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
