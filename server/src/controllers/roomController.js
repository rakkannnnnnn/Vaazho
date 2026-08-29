const Property = require("../models/Property");
const Room = require("../models/Room");

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({})
      .populate({
        path: "property",
        populate: {
          path: "destination",
        },
      })
      .sort({ pricePerNight: 1, name: 1 });

    return res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch rooms.",
    });
  }
};

const getRoomsByPropertySlug = async (req, res) => {
  try {
    const property = await Property.findOne({ slug: req.params.propertySlug });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    const rooms = await Room.find({ property: property._id })
      .populate({
        path: "property",
        populate: {
          path: "destination",
        },
      })
      .sort({ pricePerNight: 1, name: 1 });

    return res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    console.error("Error fetching rooms by property:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch rooms for this property.",
    });
  }
};

const getRoomBySlug = async (req, res) => {
  try {
    const room = await Room.findOne({ slug: req.params.slug }).populate({
      path: "property",
      populate: {
        path: "destination",
      },
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error("Error fetching room by slug:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch room.",
    });
  }
};

module.exports = {
  getAllRooms,
  getRoomsByPropertySlug,
  getRoomBySlug,
};
