import crypto from "crypto";

export function randomStringGenerator(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}
