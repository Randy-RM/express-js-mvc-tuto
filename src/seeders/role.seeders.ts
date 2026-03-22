import "dotenv/config";
import mongoose from "mongoose";
import { ROLES } from "../constants";

const dbUrl = process.env.MONGOHQ_URL || "";

async function seedRoles(): Promise<void> {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to DB");

    const roles = Object.values(ROLES);
    console.log("Available roles:", roles);
    console.log("Seed validation done — roles are defined as constants, no DB collection needed.");
  } catch (error) {
    console.error("Seed error:", (error as Error).message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from DB");
  }
}

seedRoles();
