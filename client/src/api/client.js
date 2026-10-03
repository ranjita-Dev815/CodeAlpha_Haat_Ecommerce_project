import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  try {
    const stored = JSON.parse(localStorage.getItem('auth'));
    if (stored?.token) config.headers.Authorization = `Bearer ${stored.token}`;
  } catch {
    /* ignore corrupt storage */
  }
  return config;
});

// An expired/invalid token while logged in -> AuthContext logs the user out
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem('auth')) {
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(err);
  }
);

export const errMsg = (err) => {
  if (!err.response) {
    return "Can't reach the server. Check that the backend is running on port 5000.";
  }
  return err.response.data?.message || 'Something went wrong. Try again.';
};

export default api;
