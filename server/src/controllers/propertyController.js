const mongoose = require("mongoose");

const Destination = require("../models/Destination");
const Property = require("../models/Property");
const Room = require("../models/Room");

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

const searchProperties = async (req, res) => {
  try {
    const {
      destination,
      checkIn,
      checkOut,
      guests,
      minPrice,
      maxPrice,
      minRating,
      amenities,
      sort,
    } = req.query;

    // Build filter query
    const filter = {};

    // Destination filter
    if (destination) {
      const dest = await Destination.findOne({ slug: destination });
      if (dest) {
        filter.destination = dest._id;
      } else {
        return res.status(404).json({
          success: false,
          message: "Destination not found.",
        });
      }
    }

    // Rating filter
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    // Amenities filter - property-level amenities
    if (amenities) {
      const amenitiesArray = amenities.split(",").map((a) => a.trim());
      filter.amenities = { $in: amenitiesArray };
    }

    // Get base properties
    let properties = await Property.find(filter).populate("destination");

    // Room-based filtering (price, capacity)
    if (minPrice || maxPrice || guests) {
      const roomFilter = {};

      if (minPrice || maxPrice) {
        roomFilter.pricePerNight = {};
        if (minPrice) roomFilter.pricePerNight.$gte = parseFloat(minPrice);
        if (maxPrice) roomFilter.pricePerNight.$lte = parseFloat(maxPrice);
      }

      if (guests) {
        roomFilter.capacity = { $gte: parseInt(guests) };
      }

      const rooms = await Room.find(roomFilter).lean();
      const propertyIds = new Set(rooms.map((r) => r.property.toString()));

      properties = properties.filter((p) => propertyIds.has(p._id.toString()));
    }

    // Sorting
    if (sort === "price-low") {
      // Get minimum price for each property
      const propertiesWithPrice = await Promise.all(
        properties.map(async (property) => {
          const room = await Room.findOne({ property: property._id }).sort(
            { pricePerNight: 1 }
          );
          return { property, minPrice: room?.pricePerNight || 0 };
        })
      );

      propertiesWithPrice.sort((a, b) => a.minPrice - b.minPrice);
      properties = propertiesWithPrice.map((p) => p.property);
    } else if (sort === "price-high") {
      const propertiesWithPrice = await Promise.all(
        properties.map(async (property) => {
          const room = await Room.findOne({ property: property._id }).sort(
            { pricePerNight: -1 }
          );
          return { property, maxPrice: room?.pricePerNight || 0 };
        })
      );

      propertiesWithPrice.sort((a, b) => b.maxPrice - a.maxPrice);
      properties = propertiesWithPrice.map((p) => p.property);
    } else if (sort === "rating") {
      properties.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Default: featured first, then by name
      properties.sort((a, b) => {
        if (b.featured !== a.featured) return b.featured ? 1 : -1;
        return a.name.localeCompare(b.name);
      });
    }

    return res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("Error searching properties:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to search properties.",
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
  searchProperties,
  getPropertiesByDestinationSlug,
  getPropertyBySlug,
};
