const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const TOKEN_KEY = "roadrakshak-token";

export const SESSION_EXPIRED_EVENT =
  "roadrakshak:session-expired";

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY) || "";
};

export const apiRequest = async (
  endpoint,
  options = {}
) => {
  let response;

  try {
    response = await fetch(
      `${API_URL}${endpoint}`,
      options
    );
  } catch {
    throw new Error(
      "Unable to connect to the RoadRakshak server"
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);

    window.dispatchEvent(
      new CustomEvent(
        SESSION_EXPIRED_EVENT,
        {
          detail: {
            message:
              data.message ||
              "Your session has expired. Please sign in again.",
          },
        }
      )
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message || "API request failed"
    );
  }

  return data;
};