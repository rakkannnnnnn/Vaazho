const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function fetchJson(url, options = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.message || (typeof data === "string" ? data : "Request failed");
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  getDestinations: () => fetchJson("/api/destinations"),
  getDestinationBySlug: (slug) => fetchJson(`/api/destinations/${slug}`),
  getProperties: () => fetchJson("/api/properties"),
  getPropertiesByDestination: (destinationSlug) =>
    fetchJson(`/api/properties/destination/${destinationSlug}`),
  getPropertyBySlug: (slug) => fetchJson(`/api/properties/${slug}`),
  getPropertiesBySearch: (params) =>
    fetchJson(`/api/properties/search?${params}`),
  getRooms: () => fetchJson("/api/rooms"),
  getRoomsByProperty: (propertySlug) =>
    fetchJson(`/api/rooms/property/${propertySlug}`),
  getRoomBySlug: (slug) => fetchJson(`/api/rooms/${slug}`),
  getCustomizations: () => fetchJson("/api/customizations"),
  checkAvailability: (params) =>
    fetchJson(`/api/bookings/availability?${new URLSearchParams(params).toString()}`),
  createBooking: (bookingData) =>
    fetchJson("/api/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }),
};
