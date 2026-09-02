require("dotenv").config();

const mongoose = require("mongoose");
const Destination = require("../models/Destination");
const Property = require("../models/Property");

const propertyTemplates = [
  {
    name: "Blue Horizon Stay",
    slug: "blue-horizon-stay",
    description: "A coastal retreat with sea-view balconies and easy access to local beaches.",
    location: "Beachfront",
    address: "12 Shoreline Avenue",
    latitude: 15.2993,
    longitude: 74.1239,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1494526585095-c41746248156",
    ],
    amenities: ["Wi-Fi", "Breakfast", "Pool", "Ocean View"],
    rating: 4.8,
    featured: true,
  },
  {
    name: "Hillcrest Haven",
    slug: "hillcrest-haven",
    description: "A quiet mountain property surrounded by greenery and scenic viewpoints.",
    location: "Hill Station",
    address: "44 Misty Ridge Road",
    latitude: 10.0889,
    longitude: 77.0595,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    ],
    amenities: ["Wi-Fi", "Spa", "Mountain View", "Family Rooms"],
    rating: 4.7,
    featured: true,
  },
  {
    name: "Royal Courtyard",
    slug: "royal-courtyard",
    description: "A heritage-inspired stay with warm interiors and cultural charm.",
    location: "Heritage District",
    address: "88 Palace Lane",
    latitude: 26.9124,
    longitude: 75.7873,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    ],
    amenities: ["Breakfast", "Parking", "Garden", "Air Conditioning"],
    rating: 4.6,
    featured: false,
  },
];

const seedProperties = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 20000,
    });

    console.log("Connected to MongoDB");

    const destinations = await Destination.find({}).lean();

    if (!destinations.length) {
      console.log("No destinations found. Seed destinations before properties.");
      return;
    }

    const allProperties = [];

    destinations.forEach((destination, destinationIndex) => {
      propertyTemplates.forEach((template, templateIndex) => {
        const propertyName = `${template.name} ${destination.name}`;
        const propertySlug = `${template.slug}-${destination.slug}`;

        allProperties.push({
          ...template,
          name: propertyName,
          slug: propertySlug,
          destination: destination._id,
          owner: null,
        });
      });
    });

    await Property.deleteMany({});
    console.log("Cleared properties");

    const result = await Property.insertMany(allProperties);
    console.log(`Inserted ${result.length} properties`);
    console.log("Property seed completed successfully");
  } catch (error) {
    console.error("Property seed failed:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

seedProperties();
