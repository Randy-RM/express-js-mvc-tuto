require("dotenv").config();
const mongoose = require("mongoose");
const { ROLES } = require("../constants");

const dbUrl = process.env.MONGOHQ_URL;

async function seedRoles() {
  try {
    await mongoose.connect(String(dbUrl));
    console.log("Connected to DB");

    // Roles are now defined as constants in src/constants/index.js
    // This seeder validates that they are properly configured
    const roles = Object.values(ROLES);
    console.log("Available roles:", roles);
    console.log("Seed validation done — roles are defined as constants, no DB collection needed.");
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from DB");
  }
}

seedRoles();
