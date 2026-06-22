import {
  apiRequest,
  getToken,
} from "./apiClient";

export const getReports = () => {
  return apiRequest("/reports");
};

export const getMyReports = () => {
  return apiRequest("/reports/mine", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const createReport = (report) => {
  const formData = new FormData();

  Object.entries(report).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        formData.append(key, value);
      }
    }
  );

  return apiRequest("/reports", {
    method: "POST",

    headers: {
      Authorization: `Bearer ${getToken()}`,
    },

    body: formData,
  });
};

export const updateReport = (
  reportId,
  changes
) => {
  return apiRequest(
    `/reports/${reportId}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },

      body: JSON.stringify(changes),
    }
  );
};

export const resolveReport = (
  reportId,
  {
    resolutionNote,
    evidence,
  }
) => {
  const formData = new FormData();

  formData.append(
    "resolutionNote",
    resolutionNote
  );

  formData.append(
    "evidence",
    evidence
  );

  return apiRequest(
    `/reports/${reportId}/resolve`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${getToken()}`,
      },

      body: formData,
    }
  );
};

export const deleteReport = (
  reportId
) => {
  return apiRequest(
    `/reports/${reportId}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
};