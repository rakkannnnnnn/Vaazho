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

module.exports = {
  testAI,
};