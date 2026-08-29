const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    bedType: {
      type: String,
      required: true,
      trim: true,
    },
    roomSize: {
      type: Number,
      required: true,
      min: 1,
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    totalRooms: {
      type: Number,
      required: true,
      min: 1,
    },
    availableRooms: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.totalRooms;
        },
        message: "availableRooms cannot exceed totalRooms.",
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);
