import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { ROLES } from "../constants";

const prisma = new PrismaClient();

async function seedRoles(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("Connected to DB");

    const roles = Object.values(ROLES);
    console.log("Available roles:", roles);
    console.log("Seed validation done — roles are defined as enum in Prisma schema.");
  } catch (error) {
    console.error("Seed error:", (error as Error).message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from DB");
  }
}

seedRoles();
