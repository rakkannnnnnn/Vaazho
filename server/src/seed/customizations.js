require("dotenv").config();

const mongoose = require("mongoose");
const Customization = require("../models/Customization");

const sampleCustomizations = [
  {
    name: "Breakfast Package",
    description: "Daily freshly prepared breakfast buffet with regional specialties and beverages.",
    type: "food",
    price: 300,
    pricingType: "per-person",
    active: true,
  },
  {
    name: "Campfire Experience",
    description: "Private evening bonfire setup under the stars with marshmallows and hot drinks.",
    type: "campfire",
    price: 500,
    pricingType: "per-booking",
    active: true,
  },
  {
    name: "Room Decoration",
    description: "Romantic floral arrangement and celebration setup for special occasions.",
    type: "decoration",
    price: 400,
    pricingType: "per-booking",
    active: true,
  },
  {
    name: "Extra Bed",
    description: "Premium rollaway bed with soft bedding and plush pillows.",
    type: "extra-bed",
    price: 250,
    pricingType: "per-night",
    active: true,
  },
  {
    name: "Local Activity Package",
    description: "Guided local exploration tour with heritage walk and scenic photography stops.",
    type: "activity",
    price: 600,
    pricingType: "per-person",
    active: true,
  },
];

const seedCustomizations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 20000,
    });

    console.log("Connected to MongoDB for customizations seeding");

    try {
      await mongoose.connection.collection("customizations").drop();
      console.log("Dropped existing customizations collection & indexes");
    } catch (dropErr) {
      console.log("No existing customizations collection to drop or drop error:", dropErr.message);
    }

    const created = await Customization.insertMany(sampleCustomizations);
    console.log(`Successfully seeded ${created.length} customizations:`);
    created.forEach((c) => console.log(` - [${c._id}] ${c.name} (₹${c.price} ${c.pricingType})`));
  } catch (error) {
    console.error("Failed to seed customizations:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

if (require.main === module) {
  seedCustomizations();
}

module.exports = { sampleCustomizations, seedCustomizations };
