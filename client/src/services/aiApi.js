import { apiRequest, getToken } from "./apiClient";

export const generateAIReport = (reportData) => {
  return apiRequest("/ai/generate-report", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },

    body: JSON.stringify(reportData),
  });
};

export const analyzeRoadPhoto = (photoFile) => {
  const formData = new FormData();

  formData.append("photo", photoFile);

  return apiRequest("/ai/analyze-road-photo", {
    method: "POST",

    headers: {
      Authorization: `Bearer ${getToken()}`,
    },

    body: formData,
  });
};