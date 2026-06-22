import {
  apiRequest,
  getToken,
} from "./apiClient";

const buildQuery = (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        params.set(
          key,
          String(value).trim()
        );
      }
    }
  );

  const query = params.toString();

  return query ? `?${query}` : "";
};

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const getAuthorities = (
  filters = {}
) => {
  return apiRequest(
    `/authorities${buildQuery(filters)}`
  );
};

export const getAuthorityById = (
  authorityId
) => {
  return apiRequest(
    `/authorities/${authorityId}`
  );
};

export const matchAuthority = ({
  state = "",
  district = "",
  city = "",
  roadType = "",
}) => {
  return apiRequest(
    `/authorities/match${buildQuery({
      state,
      district,
      city,
      roadType,
    })}`
  );
};

export const createAuthority = (
  authority
) => {
  return apiRequest("/authorities", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(authority),
  });
};

export const updateAuthority = (
  authorityId,
  changes
) => {
  return apiRequest(
    `/authorities/${authorityId}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(changes),
    }
  );
};

export const verifyAuthority = (
  authorityId
) => {
  return updateAuthority(authorityId, {
    verificationStatus: "Verified",
    lastVerifiedAt:
      new Date().toISOString(),
  });
};

export const disableAuthority = (
  authorityId
) => {
  return apiRequest(
    `/authorities/${authorityId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
};