const mongoose = require("mongoose");

const itineraryDaySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    activities: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const aiPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    days: {
      type: Number,
      required: true,
      min: 1,
    },
    travelers: {
      type: Number,
      required: true,
      min: 1,
    },
    budget: {
      type: String,
      trim: true,
      default: "medium",
    },
    interests: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    itinerary: {
      type: [itineraryDaySchema],
      default: [],
    },
    tips: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const AIPlan = mongoose.model("AIPlan", aiPlanSchema);

module.exports = AIPlan;
