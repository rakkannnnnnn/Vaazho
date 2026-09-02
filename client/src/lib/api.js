const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function fetchJson(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Automatically attach custom JWT Bearer token if stored in localStorage
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("vazho_token");
    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
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

export const api = {
  // Auth API
  register: (userData) =>
    fetchJson("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  login: (credentials) =>
    fetchJson("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  getMe: () => fetchJson("/api/auth/me"),

  // Destinations & Properties
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

  // Bookings API
  checkAvailability: (params) =>
    fetchJson(`/api/bookings/availability?${new URLSearchParams(params).toString()}`),
  createBooking: (bookingData) =>
    fetchJson("/api/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }),
  getMyBookings: () => fetchJson("/api/bookings/my"),
  getBookingById: (bookingId) => fetchJson(`/api/bookings/${bookingId}`),
  cancelBooking: (bookingId) =>
    fetchJson(`/api/bookings/${bookingId}/cancel`, {
      method: "PATCH",
    }),

  // Reviews API
  createReview: (reviewData) =>
    fetchJson("/api/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),
  getPropertyReviews: (propertyId) =>
    fetchJson(`/api/reviews/property/${propertyId}`),
  updateReview: (reviewId, reviewData) =>
    fetchJson(`/api/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    }),
  deleteReview: (reviewId) =>
    fetchJson(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    }),
  respondToReview: (reviewId, responseData) =>
    fetchJson(`/api/reviews/${reviewId}/response`, {
      method: "PATCH",
      body: JSON.stringify(responseData),
    }),

  // AI plans API
  saveAIPlan: (planData) =>
    fetchJson("/api/ai/plans", {
      method: "POST",
      body: JSON.stringify(planData),
    }),
  getMyAIPlans: () => fetchJson("/api/ai/plans"),
  getAIPlanById: (planId) => fetchJson(`/api/ai/plans/${planId}`),
  updateAIPlan: (planId, planData) =>
    fetchJson(`/api/ai/plans/${planId}`, {
      method: "PATCH",
      body: JSON.stringify(planData),
    }),
  deleteAIPlan: (planId) =>
    fetchJson(`/api/ai/plans/${planId}`, {
      method: "DELETE",
    }),
};
