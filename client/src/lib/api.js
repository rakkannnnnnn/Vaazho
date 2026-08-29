const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function fetchJson(url, options = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Request failed");
  }

  return response.json();
}

export const api = {
  getDestinations: () => fetchJson("/api/destinations"),
  getDestinationBySlug: (slug) => fetchJson(`/api/destinations/${slug}`),
};
