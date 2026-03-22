import { AppError } from "../types";

export function throwError(statusCode: number, message: string): never {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  throw error;
}
