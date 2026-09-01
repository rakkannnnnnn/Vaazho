const { generateAIResponse } = require("../services/aiService");

const testAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const prompt = `
You are VAZHO, an AI travel planning assistant.

Respond only with valid JSON.

The JSON must follow this structure:

{
  "message": "short helpful response",
  "suggestions": [
    "suggestion 1",
    "suggestion 2",
    "suggestion 3"
  ]
}

User message:
${message}
`;

    const result = await generateAIResponse(prompt);

    if (
      !result ||
      typeof result !== "object" ||
      typeof result.message !== "string" ||
      !Array.isArray(result.suggestions)
    ) {
      return res.status(502).json({
        success: false,
        message: "AI returned an invalid response format.",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("AI controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI response.",
    });
  }
};

const generateTravelPlan = async (req, res) => {
  try {
    const { destination, days, travelers, budget, interests } = req.body;

    if (!destination || !destination.trim()) {
      return res.status(400).json({
        success: false,
        message: "Destination is required.",
      });
    }

    if (!interests || !interests.trim()) {
      return res.status(400).json({
        success: false,
        message: "Interests are required.",
      });
    }

    const parsedDays = Number(days);
    const parsedTravelers = Number(travelers);

    if (!Number.isInteger(parsedDays) || parsedDays < 1) {
      return res.status(400).json({
        success: false,
        message: "Days must be a valid number greater than 0.",
      });
    }

    if (!Number.isInteger(parsedTravelers) || parsedTravelers < 1) {
      return res.status(400).json({
        success: false,
        message: "Travelers must be a valid number greater than 0.",
      });
    }

    const prompt = `
You are VAZHO, an AI travel planning assistant.

Return only valid JSON using this exact shape:

{
  "title": "3 Day Jaipur Travel Plan",
  "summary": "A personalized travel plan for Jaipur.",
  "days": [
    {
      "title": "Day 1",
      "description": "Explore Jaipur.",
      "activities": [
        "Visit Amber Fort",
        "Explore City Palace"
      ]
    }
  ],
  "tips": [
    "Start sightseeing early.",
    "Carry water."
  ]
}

Requirements:
- Destination: ${destination.trim()}
- Duration: ${parsedDays} days
- Travelers: ${parsedTravelers}
- Budget: ${budget || "medium"}
- Interests: ${interests.trim()}
- Make the plan realistic and tailored to the destination and interests.
- Do not include markdown or code blocks.
- Return JSON only.
`;

    const result = await generateAIResponse(prompt);

    if (
      !result ||
      typeof result !== "object" ||
      typeof result.title !== "string" ||
      !Array.isArray(result.days) ||
      !Array.isArray(result.tips)
    ) {
      return res.status(502).json({
        success: false,
        message: "AI returned an invalid travel plan format.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        title: result.title,
        summary:
          result.summary ||
          `A personalized travel plan for ${destination.trim()}.`,
        days: result.days,
        tips: result.tips,
      },
    });
  } catch (error) {
    console.error("AI travel plan error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate travel plan.",
    });
  }
};

module.exports = {
  testAI,
  generateTravelPlan,
};