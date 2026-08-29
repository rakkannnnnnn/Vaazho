const mongoose = require("mongoose");

const Destination = require("../models/Destination");
const Property = require("../models/Property");

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).populate("destination").sort({ featured: -1, name: 1 });

    return res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch properties.",
    });
  }
};

const getPropertiesByDestinationSlug = async (req, res) => {
  try {
    const destination = await Destination.findOne({ slug: req.params.destinationSlug });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found.",
      });
    }

    const properties = await Property.find({ destination: destination._id }).populate("destination").sort({ featured: -1, name: 1 });

    return res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("Error fetching properties by destination:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch properties for this destination.",
    });
  }
};

const getPropertyBySlug = async (req, res) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug }).populate("destination");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error("Error fetching property by slug:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch property.",
    });
  }
};

module.exports = {
  getAllProperties,
  getPropertiesByDestinationSlug,
  getPropertyBySlug,
};
