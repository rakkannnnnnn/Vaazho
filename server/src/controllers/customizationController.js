const Customization = require("../models/Customization");

const getCustomizations = async (req, res) => {
  try {
    const customizations = await Customization.find({ active: true }).sort({
      price: 1,
      name: 1,
    });

    return res.status(200).json({
      success: true,
      count: customizations.length,
      customizations,
    });
  } catch (error) {
    console.error("Error fetching customizations:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch customizations.",
      error:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getCustomizations,
};
