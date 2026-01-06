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


// Request interceptor - Add auth token to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token && req.headers) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Response interceptor - Handle authentication errors globally
API.interceptors.response.use(
  (response) => {
    // If the request is successful, just return the response
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      const { status } = error.response;

      // 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Only redirect to login if not already on auth pages
        const currentPath = window.location.pathname;
        const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];

        if (!authPages.includes(currentPath)) {
          // Redirect to login with return URL
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }

      // 403 Forbidden - User doesn't have permission
      if (status === 403) {
        // Redirect to dashboard or show error
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/admin')) {
          window.location.href = '/dashboard';
        }
      }
    } else if (error.request) {
      // Network error - no response received
      // Could show a toast notification here in the future
    }

    // Always reject the promise so the error can be caught by calling code
    return Promise.reject(error);
  }
);

export default API;
