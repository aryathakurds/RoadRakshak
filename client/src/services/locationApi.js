const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const searchLocations = async (query) => {
  const response = await fetch(
    `${API_URL}/locations/search?q=${encodeURIComponent(query)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to search locations");
  }

  return data.locations;
};