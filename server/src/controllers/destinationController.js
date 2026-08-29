const Destination = require("../models/Destination");

const getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find({}).sort({ featured: -1, name: 1 });

    return res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (error) {
    console.error("Error fetching destinations:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch destinations.",
    });
  }
};

const getDestinationBySlug = async (req, res) => {
  try {
    const destination = await Destination.findOne({ slug: req.params.slug });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: destination,
    });
  } catch (error) {
    console.error("Error fetching destination by slug:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch destination.",
    });
  }
};

module.exports = {
  getAllDestinations,
  getDestinationBySlug,
};
