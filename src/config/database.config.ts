import { prisma } from "../models";

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
  console.log("Successful connection to DB");
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}

export default { connectDatabase, disconnectDatabase };
