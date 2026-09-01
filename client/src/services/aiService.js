const API_BASE_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("vazho_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const testAI = async (message) => {
  const response = await fetch(`${API_BASE_URL}/ai/test`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ message }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to test AI.");
  }

  return data;
};

export const saveAIPlan = async (plan) => {
  const response = await fetch(`${API_BASE_URL}/ai/plans`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(plan),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to save travel plan.");
  }

  return data;
};

export const getMyAIPlans = async () => {
  const response = await fetch(`${API_BASE_URL}/ai/plans`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load travel plans.");
  }

  return data;
};

export const getAIPlanById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/ai/plans/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load travel plan.");
  }

  return data;
};

export const deleteAIPlan = async (id) => {
  const response = await fetch(`${API_BASE_URL}/ai/plans/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete travel plan.");
  }

  return data;
};

export const updateAIPlan = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/ai/plans/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to update travel plan.");
  }

  return responseData;
};

export const generateTravelPlan = async ({
  destination,
  days,
  travelers,
  budget,
  interests,
}) => {
  const response = await fetch(`${API_BASE_URL}/ai/plan`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      destination,
      days,
      travelers,
      budget,
      interests,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to generate travel plan.");
  }

  return data;
};