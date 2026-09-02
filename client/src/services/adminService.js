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

export const getAdminSummary = () => fetchJson("/api/admin/summary");
export const getAdminUsers = () => fetchJson("/api/admin/users");
export const getAdminProperties = () => fetchJson("/api/admin/properties");
export const getAdminDestinations = () => fetchJson("/api/admin/destinations");
export const getAdminBookings = () => fetchJson("/api/admin/bookings");
export const getAdminPayments = () => fetchJson("/api/admin/payments");
export const getAdminReviews = () => fetchJson("/api/admin/reviews");
