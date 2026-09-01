const API_BASE_URL = "http://localhost:5000/api";

export const testAI = async (message) => {
  const response = await fetch(`${API_BASE_URL}/ai/test`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      message,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "AI request failed.");
  }

  return data;
};