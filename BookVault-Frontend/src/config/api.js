// Centralized API configuration for BookVault
// Supports both local development and production server deployments

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://bookvault-ktk4.onrender.com"
).replace(/\/+$/, "");

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

export default {
  API_BASE_URL,
  getApiUrl,
};
