const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const buildApiUrl = (path) => {
  const base = API_BASE_URL.replace(/\/$/, "").replace(/\/api$/, "");
  const normalizedPath = path.startsWith("/api")
    ? path
    : `/api${path.startsWith("/") ? path : `/${path}`}`;

  return `${base}${normalizedPath}`;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("vazho_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function fetchJson(url, options = {}) {
  const response = await fetch(buildApiUrl(url), {
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

export const checkAvailability = async ({ roomId, checkIn, checkOut, guests }) =>
  fetchJson(
    `/api/bookings/availability?${new URLSearchParams({
      roomId,
      checkIn,
      checkOut,
      guests: String(guests),
    }).toString()}`
  );

export const createBooking = async (bookingData) =>
  fetchJson("/api/bookings", {
    method: "POST",
    body: JSON.stringify(bookingData),
  });

export const getMyBookings = async () => fetchJson("/api/bookings/my");

export const getBookingById = async (bookingId) =>
  fetchJson(`/api/bookings/${bookingId}`);

export const cancelBooking = async (bookingId) =>
  fetchJson(`/api/bookings/${bookingId}/cancel`, {
    method: "PATCH",
  });
