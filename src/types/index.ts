import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  isUserActive: boolean;
  uniqueString?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  isUserPassword(password: string): Promise<boolean>;
  toJSON(): Omit<IUser, "password" | "uniqueString" | "__v">;
}

export interface IArticle extends Document {
  _id: Types.ObjectId;
  title: string;
  summary: string;
  content: string;
  isPublished: boolean;
  isArchived: boolean;
  user: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends IUser {}
  }
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
