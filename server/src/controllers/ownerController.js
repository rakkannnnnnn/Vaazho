const mongoose = require("mongoose");
const Property = require("../models/Property");
const Room = require("../models/Room");
const Booking = require("../models/Booking");
const Customization = require("../models/Customization");
const Destination = require("../models/Destination");

const slugify = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "property";
};

const ensureOwnerProperty = async (req, propertyId) => {
  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return null;
  }

  return Property.findOne({
    _id: propertyId,
    owner: req.user._id,
  });
};

const ensureOwnerRoom = async (req, roomId) => {
  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return null;
  }

  return Room.findOne({ _id: roomId }).populate("property");
};

const getDashboard = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .populate("destination")
      .sort({ createdAt: -1 });

    const propertyIds = properties.map((property) => property._id);

    const rooms = await Room.find({ property: { $in: propertyIds } })
      .populate("property")
      .sort({ createdAt: -1 });

    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate(["user", "property", "room"])
      .sort({ createdAt: -1 });

    const customizations = await Customization.find({ active: true }).sort({
      price: 1,
      name: 1,
    });

    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed").length;
    const completedBookings = bookings.filter((booking) => booking.status === "completed").length;
    const totalRevenue = bookings
      .filter((booking) => ["confirmed", "completed"].includes(booking.status))
      .reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalProperties: properties.length,
        totalRooms: rooms.length,
        totalBookings,
        confirmedBookings,
        completedBookings,
        totalRevenue,
      },
      properties,
      rooms,
      bookings,
      customizations,
    });
  } catch (error) {
    console.error("OWNER DASHBOARD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load owner dashboard.",
    });
  }
};

const getOwnerProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .populate("destination")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      properties,
    });
  } catch (error) {
    console.error("GET OWNER PROPERTIES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch your properties.",
    });
  }
};

const createOwnerProperty = async (req, res) => {
  try {
    const {
      destination,
      name,
      description,
      location,
      address,
      latitude,
      longitude,
      amenities = [],
      images = [],
      featured = false,
    } = req.body;

    if (!destination || !name || !description || !location) {
      return res.status(400).json({
        success: false,
        message: "Destination, name, description, and location are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(destination)) {
      return res.status(400).json({
        success: false,
        message: "Invalid destination ID.",
      });
    }

    const destinationExists = await Destination.findById(destination);
    if (!destinationExists) {
      return res.status(404).json({
        success: false,
        message: "Destination not found.",
      });
    }

    const baseSlug = slugify(name);
    const uniqueSlug = `${baseSlug}-${Date.now()}`;

    const property = await Property.create({
      destination,
      name: String(name).trim(),
      slug: uniqueSlug,
      description: String(description).trim(),
      location: String(location).trim(),
      address: address ? String(address).trim() : "",
      latitude: latitude === undefined || latitude === null ? null : Number(latitude),
      longitude: longitude === undefined || longitude === null ? null : Number(longitude),
      amenities: Array.isArray(amenities) ? amenities.map((item) => String(item).trim()).filter(Boolean) : [],
      images: Array.isArray(images) ? images.filter(Boolean) : [],
      featured: Boolean(featured),
      owner: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Property created successfully.",
      property,
    });
  } catch (error) {
    console.error("CREATE OWNER PROPERTY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create property.",
    });
  }
};

const updateOwnerProperty = async (req, res) => {
  try {
    const property = await ensureOwnerProperty(req, req.params.propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found or you do not own it.",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "location",
      "address",
      "latitude",
      "longitude",
      "amenities",
      "images",
      "featured",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "name") {
          property.name = String(req.body.name).trim();
        } else if (field === "description") {
          property.description = String(req.body.description).trim();
        } else if (field === "location") {
          property.location = String(req.body.location).trim();
        } else if (field === "address") {
          property.address = req.body.address ? String(req.body.address).trim() : "";
        } else if (field === "latitude") {
          property.latitude = req.body.latitude === null ? null : Number(req.body.latitude);
        } else if (field === "longitude") {
          property.longitude = req.body.longitude === null ? null : Number(req.body.longitude);
        } else if (field === "amenities") {
          property.amenities = Array.isArray(req.body.amenities)
            ? req.body.amenities.map((item) => String(item).trim()).filter(Boolean)
            : [];
        } else if (field === "images") {
          property.images = Array.isArray(req.body.images) ? req.body.images.filter(Boolean) : [];
        } else if (field === "featured") {
          property.featured = Boolean(req.body.featured);
        }
      }
    });

    if (req.body.destination && mongoose.Types.ObjectId.isValid(req.body.destination)) {
      const destinationExists = await Destination.findById(req.body.destination);
      if (!destinationExists) {
        return res.status(404).json({
          success: false,
          message: "Destination not found.",
        });
      }
      property.destination = req.body.destination;
    }

    await property.save();

    return res.status(200).json({
      success: true,
      message: "Property updated successfully.",
      property,
    });
  } catch (error) {
    console.error("UPDATE OWNER PROPERTY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update property.",
    });
  }
};

const deleteOwnerProperty = async (req, res) => {
  try {
    const property = await ensureOwnerProperty(req, req.params.propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found or you do not own it.",
      });
    }

    await Room.deleteMany({ property: property._id });
    await property.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Property deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE OWNER PROPERTY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete property.",
    });
  }
};

const getOwnerPropertyRooms = async (req, res) => {
  try {
    const property = await ensureOwnerProperty(req, req.params.propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found or you do not own it.",
      });
    }

    const rooms = await Room.find({ property: property._id })
      .populate("property")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error("GET OWNER PROPERTY ROOMS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch rooms for this property.",
    });
  }
};

const createOwnerRoom = async (req, res) => {
  try {
    const property = await ensureOwnerProperty(req, req.params.propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found or you do not own it.",
      });
    }

    const {
      name,
      description,
      pricePerNight,
      capacity,
      bedType,
      roomSize,
      amenities = [],
      images = [],
      totalRooms,
      availableRooms,
      featured = false,
    } = req.body;

    if (!name || !description || !pricePerNight || !capacity || !bedType || !roomSize || !totalRooms) {
      return res.status(400).json({
        success: false,
        message: "Required room fields are missing.",
      });
    }

    const room = await Room.create({
      property: property._id,
      name: String(name).trim(),
      slug: `${slugify(name)}-${Date.now()}`,
      description: String(description).trim(),
      pricePerNight: Number(pricePerNight),
      capacity: Number(capacity),
      bedType: String(bedType).trim(),
      roomSize: Number(roomSize),
      amenities: Array.isArray(amenities) ? amenities.map((item) => String(item).trim()).filter(Boolean) : [],
      images: Array.isArray(images) ? images.filter(Boolean) : [],
      totalRooms: Number(totalRooms),
      availableRooms: availableRooms === undefined ? Number(totalRooms) : Number(availableRooms),
      featured: Boolean(featured),
    });

    return res.status(201).json({
      success: true,
      message: "Room created successfully.",
      room,
    });
  } catch (error) {
    console.error("CREATE OWNER ROOM ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create room.",
    });
  }
};

const updateOwnerRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ _id: req.params.roomId }).populate("property");

    if (!room || !room.property || room.property.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: "Room not found or you do not own it.",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "pricePerNight",
      "capacity",
      "bedType",
      "roomSize",
      "amenities",
      "images",
      "totalRooms",
      "availableRooms",
      "featured",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "name") room.name = String(req.body.name).trim();
        else if (field === "description") room.description = String(req.body.description).trim();
        else if (field === "pricePerNight") room.pricePerNight = Number(req.body.pricePerNight);
        else if (field === "capacity") room.capacity = Number(req.body.capacity);
        else if (field === "bedType") room.bedType = String(req.body.bedType).trim();
        else if (field === "roomSize") room.roomSize = Number(req.body.roomSize);
        else if (field === "amenities") room.amenities = Array.isArray(req.body.amenities) ? req.body.amenities.map((item) => String(item).trim()).filter(Boolean) : [];
        else if (field === "images") room.images = Array.isArray(req.body.images) ? req.body.images.filter(Boolean) : [];
        else if (field === "totalRooms") room.totalRooms = Number(req.body.totalRooms);
        else if (field === "availableRooms") room.availableRooms = Number(req.body.availableRooms);
        else if (field === "featured") room.featured = Boolean(req.body.featured);
      }
    });

    await room.save();

    return res.status(200).json({
      success: true,
      message: "Room updated successfully.",
      room,
    });
  } catch (error) {
    console.error("UPDATE OWNER ROOM ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update room.",
    });
  }
};

const deleteOwnerRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ _id: req.params.roomId }).populate("property");

    if (!room || !room.property || room.property.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: "Room not found or you do not own it.",
      });
    }

    await room.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Room deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE OWNER ROOM ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete room.",
    });
  }
};

const getOwnerBookings = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).select("_id");
    const propertyIds = properties.map((property) => property._id);

    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate(["user", "property", "room"])
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("GET OWNER BOOKINGS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch bookings.",
    });
  }
};

const getOwnerCustomizations = async (req, res) => {
  try {
    const customizations = await Customization.find({ active: true }).sort({
      price: 1,
      name: 1,
    });

    return res.status(200).json({
      success: true,
      customizations,
    });
  } catch (error) {
    console.error("GET OWNER CUSTOMIZATIONS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch customizations.",
    });
  }
};

const createOwnerCustomization = async (req, res) => {
  try {
    const { name, description, type, price, pricingType, active = true } = req.body;

    if (!name || !description || !type || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, description, type, and price are required.",
      });
    }

    const customization = await Customization.create({
      name: String(name).trim(),
      description: String(description).trim(),
      type: String(type).trim(),
      price: Number(price),
      pricingType: pricingType || "per-booking",
      active: Boolean(active),
    });

    return res.status(201).json({
      success: true,
      message: "Customization created successfully.",
      customization,
    });
  } catch (error) {
    console.error("CREATE OWNER CUSTOMIZATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create customization.",
    });
  }
};

const updateOwnerCustomization = async (req, res) => {
  try {
    const customization = await Customization.findById(req.params.customizationId);
    if (!customization) {
      return res.status(404).json({
        success: false,
        message: "Customization not found.",
      });
    }

    if (req.body.name !== undefined) customization.name = String(req.body.name).trim();
    if (req.body.description !== undefined) customization.description = String(req.body.description).trim();
    if (req.body.type !== undefined) customization.type = String(req.body.type).trim();
    if (req.body.price !== undefined) customization.price = Number(req.body.price);
    if (req.body.pricingType !== undefined) customization.pricingType = String(req.body.pricingType).trim();
    if (req.body.active !== undefined) customization.active = Boolean(req.body.active);

    await customization.save();

    return res.status(200).json({
      success: true,
      message: "Customization updated successfully.",
      customization,
    });
  } catch (error) {
    console.error("UPDATE OWNER CUSTOMIZATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update customization.",
    });
  }
};

const deleteOwnerCustomization = async (req, res) => {
  try {
    const customization = await Customization.findById(req.params.customizationId);
    if (!customization) {
      return res.status(404).json({
        success: false,
        message: "Customization not found.",
      });
    }

    await customization.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Customization deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE OWNER CUSTOMIZATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete customization.",
    });
  }
};

module.exports = {
  getDashboard,
  getOwnerProperties,
  createOwnerProperty,
  updateOwnerProperty,
  deleteOwnerProperty,
  getOwnerPropertyRooms,
  createOwnerRoom,
  updateOwnerRoom,
  deleteOwnerRoom,
  getOwnerBookings,
  getOwnerCustomizations,
  createOwnerCustomization,
  updateOwnerCustomization,
  deleteOwnerCustomization,
};
