const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

/**
 * Fetch wrapper that automatically injects the Bearer token and sets
 * Content-Type: application/json.
 *
 * @param {string} path  - API path starting with "/"
 * @param {RequestInit} options - Standard fetch options
 */
export const authFetch = (path, options = {}) =>
  fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
