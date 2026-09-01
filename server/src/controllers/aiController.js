const AIPlan = require("../models/AIPlan");
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

const saveAIPlan = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const {
      title,
      destination,
      days,
      travelers,
      budget,
      interests,
      summary,
      itinerary,
      tips,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Plan title is required.",
      });
    }

    if (!destination || !destination.trim()) {
      return res.status(400).json({
        success: false,
        message: "Destination is required.",
      });
    }

    if (!summary || !summary.trim()) {
      return res.status(400).json({
        success: false,
        message: "Plan summary is required.",
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
        message: "Days must be a valid number.",
      });
    }

    if (!Number.isInteger(parsedTravelers) || parsedTravelers < 1) {
      return res.status(400).json({
        success: false,
        message: "Travelers must be a valid number.",
      });
    }

    if (!Array.isArray(itinerary) || itinerary.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one itinerary day is required.",
      });
    }

    const normalizedItinerary = itinerary.map((day) => ({
      title: String(day?.title || "").trim(),
      description: String(day?.description || "").trim(),
      activities: Array.isArray(day?.activities)
        ? day.activities.map((activity) => String(activity).trim()).filter(Boolean)
        : [],
    }));

    if (normalizedItinerary.some((day) => !day.title || !day.description)) {
      return res.status(400).json({
        success: false,
        message: "Each itinerary day must include a title and description.",
      });
    }

    const plan = await AIPlan.create({
      user: req.user._id,
      title: title.trim(),
      destination: destination.trim(),
      days: parsedDays,
      travelers: parsedTravelers,
      budget: budget || "medium",
      interests: interests.trim(),
      summary: summary.trim(),
      itinerary: normalizedItinerary,
      tips: Array.isArray(tips)
        ? tips.map((tip) => String(tip).trim()).filter(Boolean)
        : [],
    });

    return res.status(201).json({
      success: true,
      message: "Travel plan saved successfully.",
      plan,
    });
  } catch (error) {
    console.error("SAVE AI PLAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save travel plan.",
    });
  }
};

const getMyAIPlans = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const plans = await AIPlan.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error("GET MY AI PLANS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load travel plans.",
    });
  }
};

const getAIPlanById = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { id } = req.params;

    const plan = await AIPlan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Travel plan not found.",
      });
    }

    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this travel plan.",
      });
    }

    return res.status(200).json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("GET AI PLAN BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load travel plan.",
    });
  }
};

const updateAIPlan = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { id } = req.params;

    const plan = await AIPlan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Travel plan not found.",
      });
    }

    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this travel plan.",
      });
    }

    const updateData = {};
    const hasField = (field) =>
      Object.prototype.hasOwnProperty.call(req.body, field) &&
      req.body[field] !== undefined;

    if (hasField("title")) {
      const title = String(req.body.title).trim();
      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Plan title is required.",
        });
      }
      updateData.title = title;
    }

    if (hasField("destination")) {
      const destination = String(req.body.destination).trim();
      if (!destination) {
        return res.status(400).json({
          success: false,
          message: "Destination is required.",
        });
      }
      updateData.destination = destination;
    }

    if (hasField("days")) {
      const parsedDays = Number(req.body.days);
      if (!Number.isInteger(parsedDays) || parsedDays < 1) {
        return res.status(400).json({
          success: false,
          message: "Days must be a valid number greater than 0.",
        });
      }
      updateData.days = parsedDays;
    }

    if (hasField("travelers")) {
      const parsedTravelers = Number(req.body.travelers);
      if (!Number.isInteger(parsedTravelers) || parsedTravelers < 1) {
        return res.status(400).json({
          success: false,
          message: "Travelers must be a valid number greater than 0.",
        });
      }
      updateData.travelers = parsedTravelers;
    }

    if (hasField("budget")) {
      updateData.budget = String(req.body.budget || "medium").trim() || "medium";
    }

    if (hasField("interests")) {
      const interests = String(req.body.interests).trim();
      if (!interests) {
        return res.status(400).json({
          success: false,
          message: "Interests are required.",
        });
      }
      updateData.interests = interests;
    }

    if (hasField("summary")) {
      const summary = String(req.body.summary).trim();
      if (!summary) {
        return res.status(400).json({
          success: false,
          message: "Plan summary is required.",
        });
      }
      updateData.summary = summary;
    }

    if (hasField("itinerary")) {
      if (!Array.isArray(req.body.itinerary) || req.body.itinerary.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one itinerary day is required.",
        });
      }

      const normalizedItinerary = req.body.itinerary.map((day) => ({
        title: String(day?.title || "").trim(),
        description: String(day?.description || "").trim(),
        activities: Array.isArray(day?.activities)
          ? day.activities.map((activity) => String(activity).trim()).filter(Boolean)
          : [],
      }));

      if (normalizedItinerary.some((day) => !day.title || !day.description)) {
        return res.status(400).json({
          success: false,
          message: "Each itinerary day must include a title and description.",
        });
      }

      updateData.itinerary = normalizedItinerary;
    }

    if (hasField("tips")) {
      updateData.tips = Array.isArray(req.body.tips)
        ? req.body.tips.map((tip) => String(tip).trim()).filter(Boolean)
        : [];
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    const updatedPlan = await AIPlan.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Travel plan updated successfully.",
      plan: updatedPlan,
    });
  } catch (error) {
    console.error("UPDATE AI PLAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update travel plan.",
    });
  }
};

const deleteAIPlan = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { id } = req.params;

    const plan = await AIPlan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Travel plan not found.",
      });
    }

    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this travel plan.",
      });
    }

    await AIPlan.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Travel plan deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE AI PLAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete travel plan.",
    });
  }
};

module.exports = {
  testAI,
  generateTravelPlan,
  saveAIPlan,
  getMyAIPlans,
  getAIPlanById,
  updateAIPlan,
  deleteAIPlan,
};