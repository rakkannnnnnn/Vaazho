require("dotenv").config();

const mongoose = require("mongoose");
const Destination = require("../models/Destination");

const destinationSeedData = [
  {
    name: "Kerala",
    slug: "kerala",
    description:
      "Backwaters, beaches, lush landscapes and unforgettable experiences.",
    location: {
      city: "Kerala",
      country: "India",
      region: "South India",
    },
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
    rating: 4.8,
    featured: true,
  },
  {
    name: "Goa",
    slug: "goa",
    description:
      "Relax on beautiful beaches, explore local culture and enjoy coastal life.",
    location: {
      city: "Goa",
      country: "India",
      region: "Western India",
    },
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
    rating: 4.7,
    featured: true,
  },
  {
    name: "Jaipur",
    slug: "jaipur",
    description:
      "Discover royal architecture, colorful markets and rich heritage.",
    location: {
      city: "Jaipur",
      country: "India",
      region: "Rajasthan",
    },
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245",
    rating: 4.6,
    featured: false,
  },
  {
    name: "Munnar",
    slug: "munnar",
    description:
      "A peaceful hill destination surrounded by tea plantations and misty mountains.",
    location: {
      city: "Munnar",
      country: "India",
      region: "Kerala",
    },
    image:
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2",
    rating: 4.8,
    featured: true,
  },
  {
    name: "Coorg",
    slug: "coorg",
    description:
      "Escape into coffee plantations, forests, waterfalls and mountain views.",
    location: {
      city: "Coorg",
      country: "India",
      region: "Karnataka",
    },
    image:
      "https://images.unsplash.com/photo-1597074866923-dc0589150358",
    rating: 4.7,
    featured: false,
  },
  {
    name: "Udaipur",
    slug: "udaipur",
    description:
      "Experience lakes, palaces and the timeless beauty of the City of Lakes.",
    location: {
      city: "Udaipur",
      country: "India",
      region: "Rajasthan",
    },
    image:
      "https://images.unsplash.com/photo-1602643163983-ed0babc39797",
    rating: 4.8,
    featured: false,
  },
  {
    name: "Mysore",
    slug: "mysore",
    description:
      "Explore royal heritage, magnificent architecture and local traditions.",
    location: {
      city: "Mysore",
      country: "India",
      region: "Karnataka",
    },
    image:
      "https://images.unsplash.com/photo-1600112356915-089abb8fc71a",
    rating: 4.5,
    featured: false,
  },
  {
    name: "Hampi",
    slug: "hampi",
    description:
      "Walk through ancient ruins, dramatic landscapes and historic temples.",
    location: {
      city: "Hampi",
      country: "India",
      region: "Karnataka",
    },
    image:
      "https://images.unsplash.com/photo-1600100397608-f010b5eae2d0",
    rating: 4.6,
    featured: false,
  },
  {
    name: "Ooty",
    slug: "ooty",
    description:
      "Enjoy cool weather, green hills, gardens and peaceful mountain escapes.",
    location: {
      city: "Ooty",
      country: "India",
      region: "Tamil Nadu",
    },
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23",
    rating: 4.7,
    featured: false,
  },
];

const seedDestinations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 20000,
    });

    console.log("Connected to MongoDB");

    await Destination.deleteMany({});
    console.log("Cleared destinations");

    const result = await Destination.insertMany(destinationSeedData);
    console.log(`Inserted ${result.length} destinations`);
    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Destination seed failed:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

seedDestinations();
