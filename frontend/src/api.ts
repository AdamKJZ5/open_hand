import axios from 'axios';

// Get API base URL from environment variable or construct from window location
const getBaseURL = () => {
  // Priority 1: Use environment variable if provided (production/staging)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Priority 2: Development - automatically detect network or localhost
  const hostname = window.location.hostname;
  const port = import.meta.env.VITE_API_PORT || '5001';

  // If accessing via network IP (not localhost), use network IP for backend
  // This allows testing on mobile devices on same network
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    console.warn(`Using network IP for API: http://${hostname}:${port}/api`);
    return `http://${hostname}:${port}/api`;
  }

  // Default to localhost for local development
  return `http://localhost:${port}/api`;
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
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
