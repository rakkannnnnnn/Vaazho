require("dotenv").config();

const mongoose = require("mongoose");
const Property = require("../models/Property");
const Room = require("../models/Room");

const roomTemplates = [
  {
    name: "Ocean View Suite",
    slug: "ocean-view-suite",
    description: "A bright suite with a private balcony, soft linen finishes, and scenic sea views.",
    pricePerNight: 210,
    capacity: 2,
    bedType: "King Bed",
    roomSize: 42,
    amenities: ["Sea view", "Private bath", "Air conditioning", "Breakfast"],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    ],
    totalRooms: 4,
    availableRooms: 2,
  },
  {
    name: "Garden Deluxe",
    slug: "garden-deluxe",
    description: "A tranquil room surrounded by greenery with a cozy lounge and warm natural tones.",
    pricePerNight: 180,
    capacity: 2,
    bedType: "Queen Bed",
    roomSize: 38,
    amenities: ["Garden access", "Tea setup", "Free Wi-Fi", "Workspace"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      "https://images.unsplash.com/photo-1494526585095-c41746248156",
    ],
    totalRooms: 5,
    availableRooms: 3,
  },
  {
    name: "Heritage King Room",
    slug: "heritage-king-room",
    description: "An elegant room that blends heritage interiors with all the comforts of a modern stay.",
    pricePerNight: 190,
    capacity: 3,
    bedType: "King Bed",
    roomSize: 40,
    amenities: ["Heritage decor", "Balcony", "Parking", "Room service"],
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    ],
    totalRooms: 6,
    availableRooms: 4,
  },
];

const seedRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 20000,
    });

    console.log("Connected to MongoDB");

    const properties = await Property.find({}).lean();

    if (!properties.length) {
      console.log("No properties found. Seed properties before rooms.");
      return;
    }

    const allRooms = [];

    properties.forEach((property, propertyIndex) => {
      roomTemplates.forEach((template, templateIndex) => {
        allRooms.push({
          ...template,
          name: `${template.name} ${property.name}`,
          slug: `${template.slug}-${property.slug}`,
          property: property._id,
          pricePerNight: template.pricePerNight + (propertyIndex % 3) * 15 + templateIndex * 10,
          totalRooms: template.totalRooms + (propertyIndex % 2),
          availableRooms: template.availableRooms + (propertyIndex % 3),
        });
      });
    });

    await Room.deleteMany({});
    console.log("Cleared rooms");

    const result = await Room.insertMany(allRooms);
    console.log(`Inserted ${result.length} rooms`);
    console.log("Room seed completed successfully");
  } catch (error) {
    console.error("Room seed failed:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

seedRooms();
