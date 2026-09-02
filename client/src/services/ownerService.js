const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("vazho_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function fetchJson(url, options = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.message || (typeof data === "string" ? data : "Request failed");
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const getOwnerDashboard = () => fetchJson("/api/owner/dashboard");
export const getOwnerProperties = () => fetchJson("/api/owner/properties");
export const createOwnerProperty = (propertyData) =>
  fetchJson("/api/owner/properties", {
    method: "POST",
    body: JSON.stringify(propertyData),
  });
export const updateOwnerProperty = (propertyId, propertyData) =>
  fetchJson(`/api/owner/properties/${propertyId}`, {
    method: "PUT",
    body: JSON.stringify(propertyData),
  });
export const deleteOwnerProperty = (propertyId) =>
  fetchJson(`/api/owner/properties/${propertyId}`, {
    method: "DELETE",
  });

export const getOwnerPropertyRooms = (propertyId) =>
  fetchJson(`/api/owner/properties/${propertyId}/rooms`);
export const createOwnerRoom = (propertyId, roomData) =>
  fetchJson(`/api/owner/properties/${propertyId}/rooms`, {
    method: "POST",
    body: JSON.stringify(roomData),
  });
export const updateOwnerRoom = (roomId, roomData) =>
  fetchJson(`/api/owner/rooms/${roomId}`, {
    method: "PUT",
    body: JSON.stringify(roomData),
  });
export const deleteOwnerRoom = (roomId) =>
  fetchJson(`/api/owner/rooms/${roomId}`, {
    method: "DELETE",
  });

export const getOwnerBookings = () => fetchJson("/api/owner/bookings");
export const getOwnerCustomizations = () => fetchJson("/api/owner/customizations");
export const createOwnerCustomization = (data) =>
  fetchJson("/api/owner/customizations", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateOwnerCustomization = (customizationId, data) =>
  fetchJson(`/api/owner/customizations/${customizationId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteOwnerCustomization = (customizationId) =>
  fetchJson(`/api/owner/customizations/${customizationId}`, {
    method: "DELETE",
  });
