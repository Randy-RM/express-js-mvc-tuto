import bcrypt from "bcrypt";
import { UserModel } from "../models";
import { isAllowedToManipulate, isRoleExist, throwError } from "../utils";
import { IUser, PaginatedResponse } from "../types";

export class UserService {
  async findById(userId: string, connectedUser: IUser): Promise<IUser> {
    const user = await UserModel.findById(userId);

    if (!user) {
      throwError(404, `User with id "${userId}" not found`);
    }

    if (!isAllowedToManipulate(user!.id, connectedUser)) {
      throwError(403, "Forbidden: not authorized to manipulate this resource");
    }

    return user!;
  }

  async findAll(cursor?: string, limit = 10): Promise<PaginatedResponse<IUser>> {
    const query: Record<string, unknown> = {};

    if (cursor) {
      query._id = { $gt: cursor };
    }

    const users = await UserModel.find(query).limit(limit);

    if (!users || users.length === 0) {
      throwError(404, "Users not found");
    }

    return {
      prevCursor: cursor && users.length > 0 ? String(users[0]._id) : null,
      nextCursor: users.length > 0 ? String(users[users.length - 1]._id) : null,
      totalResults: users.length,
      data: users,
    };
  }

  async create(data: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    if (data.role !== undefined && !isRoleExist(data.role)) {
      throwError(422, `The role "${data.role}" does not exist`);
    }

    const user = await UserModel.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      isUserActive: true,
      role: data.role || undefined,
    });

    return user;
  }

  async update(
    userId: string,
    connectedUser: IUser,
    data: { username?: string; email?: string; role?: string }
  ): Promise<IUser> {
    const existingUser = await UserModel.findById(userId);

    if (!existingUser) {
      throwError(404, `User with id "${userId}" not found`);
    }

    if (!isAllowedToManipulate(existingUser!.id, connectedUser)) {
      throwError(403, "Forbidden: not authorized to manipulate this resource");
    }

    const user = await UserModel.findByIdAndUpdate(userId, data, {
      select: { _id: 1, username: 1, email: 1, role: 1, isUserActive: 1 },
      new: true,
    });

    return user!;
  }

  async delete(userId: string, connectedUser: IUser): Promise<void> {
    const user = await UserModel.findById(userId);

    if (!user) {
      throwError(404, `User with id "${userId}" not found`);
    }

    if (!isAllowedToManipulate(user!.id, connectedUser)) {
      throwError(403, "Forbidden: not authorized to manipulate this resource");
    }

    await user!.deleteOne();
  }

  async deleteAll(): Promise<number> {
    const result = await UserModel.deleteMany({});
    return result.deletedCount;
  }
}

export const userService = new UserService();
