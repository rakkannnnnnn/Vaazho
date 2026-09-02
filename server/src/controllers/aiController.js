const AIPlan = require("../models/AIPlan");
const { generateAIResponse } = require("../services/aiService");

const normalizeAIPlan = (destinationInput, plan) => {
  if (!plan || typeof plan !== "object") {
    throw new Error("AI returned an invalid travel plan format.");
  }

  const requiredFields = [
    "title",
    "summary",
    "destination",
    "days",
    "travelers",
    "budget",
    "itinerary",
    "tips",
  ];

  for (const field of requiredFields) {
    if (!(field in plan)) {
      throw new Error(`AI response is missing the required field: ${field}.`);
    }
  }

  const title = String(plan.title || "").trim();
  const summary = String(plan.summary || "").trim();
  const destination = String(plan.destination || "").trim();
  const normalizedDestination = destinationInput?.trim() || "";
  const days = Number(plan.days);
  const travelers = Number(plan.travelers);
  const budget = String(plan.budget || "medium").trim() || "medium";

  if (!title || !summary || !destination) {
    throw new Error("AI response is missing required plan details.");
  }

  if (!Number.isInteger(days) || days < 1) {
    throw new Error("AI response contains an invalid itinerary length.");
  }

  if (!Number.isInteger(travelers) || travelers < 1) {
    throw new Error("AI response contains an invalid traveler count.");
  }

  if (
    normalizedDestination &&
    destination.toLowerCase() !== normalizedDestination.toLowerCase() &&
    !destination.toLowerCase().includes(normalizedDestination.toLowerCase()) &&
    !normalizedDestination.toLowerCase().includes(destination.toLowerCase())
  ) {
    throw new Error("AI response destination does not match the requested destination.");
  }

  if (!Array.isArray(plan.itinerary)) {
    throw new Error("AI response itinerary must be an array.");
  }

  const itinerary = plan.itinerary
    .map((day, index) => {
      if (!day || typeof day !== "object") return null;

      const dayNumber = Number(day.day ?? index + 1);
      const dayTitle = String(day.title || "").trim();
      const dayDescription = String(day.description || "").trim();
      const activities = Array.isArray(day.activities)
        ? day.activities
            .map((activity) => String(activity).trim())
            .filter(Boolean)
        : [];

      if (!dayTitle || !dayDescription) {
        return null;
      }

      return {
        day: Number.isInteger(dayNumber) && dayNumber > 0 ? dayNumber : index + 1,
        title: dayTitle,
        description: dayDescription,
        activities,
      };
    })
    .filter(Boolean);

  if (itinerary.length === 0) {
    throw new Error("AI response itinerary is empty or invalid.");
  }

  if (!Array.isArray(plan.tips)) {
    throw new Error("AI response tips must be an array.");
  }

  const tips = plan.tips.map((tip) => String(tip).trim()).filter(Boolean);

  return {
    title,
    summary,
    destination,
    days,
    travelers,
    budget,
    itinerary,
    tips,
  };
};

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

Return only valid JSON with this exact structure:

{
  "title": "3 Day Jaipur Travel Plan",
  "summary": "A personalized travel plan for Jaipur.",
  "destination": "Jaipur",
  "days": 3,
  "travelers": 2,
  "budget": "medium",
  "itinerary": [
    {
      "day": 1,
      "title": "Historical Jaipur",
      "description": "Begin with the heritage core of Jaipur.",
      "activities": [
        "Visit Amber Fort",
        "Explore City Palace",
        "Walk through the bazaars"
      ]
    }
  ],
  "tips": [
    "Start sightseeing early to avoid the heat.",
    "Carry cash for local markets and street food."
  ]
}

Requirements:
- Destination must be exactly: ${destination.trim()}
- The plan must stay focused on ${destination.trim()} and its local attractions, food, culture, and interests.
- Duration: ${parsedDays} days
- Travelers: ${parsedTravelers}
- Budget: ${budget || "medium"}
- Interests: ${interests.trim()}
- The itinerary must be realistic, day-by-day, and consistent with the destination and interests.
- Do not invent unrelated destinations or generic random travel plans.
- Do not include markdown or code blocks.
- Return JSON only.
`;

    const result = await generateAIResponse(prompt);
    let normalizedPlan;

    try {
      normalizedPlan = normalizeAIPlan(destination.trim(), result);
    } catch (error) {
      console.error("AI travel plan normalization error:", error);
      return res.status(502).json({
        success: false,
        message: error.message || "AI returned an invalid travel plan format.",
      });
    }

    return res.status(200).json({
      success: true,
      data: normalizedPlan,
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