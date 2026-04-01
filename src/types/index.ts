import { User, Article } from "@prisma/client";

export type IUser = User;

export type IArticle = Article;

// Module augmentation for Express
import "express";
declare module "express" {
  // Add properties to Express.User if needed
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends IUser {} // Only if you want to add extra fields
  // Otherwise, you can use IUser directly in your code
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  stack?: string;
}

export interface PaginatedResponse<T> {
  nextCursor: string | null;
  prevCursor: string | null;
  totalResults: number;
  data: T[];
}

export interface AppError extends Error {
  statusCode: number;
}
