const mongoose = require("mongoose");

const customizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customization name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Customization description is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Customization type is required"],
      enum: ["food", "campfire", "decoration", "extra-bed", "activity"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Customization price is required"],
      min: [0, "Price cannot be negative"],
    },
    pricingType: {
      type: String,
      required: [true, "Pricing type is required"],
      enum: ["per-booking", "per-night", "per-person"],
      default: "per-booking",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customization", customizationSchema);
