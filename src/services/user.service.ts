import bcrypt from "bcrypt";
import { prisma } from "../models";
import { isAllowedToManipulate, isRoleExist, throwError } from "../utils";
import { IUser, PaginatedResponse } from "../types";
import { User } from "@prisma/client";

export class UserService {
  async findById(userId: string, connectedUser: IUser): Promise<User> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throwError(404, `User with id "${userId}" not found`);
    }

    if (!isAllowedToManipulate(user!.id, connectedUser)) {
      throwError(403, "Forbidden: not authorized to manipulate this resource");
    }

    return user!;
  }

  async findAll(cursor?: string, limit = 10): Promise<PaginatedResponse<User>> {
    const users = await prisma.user.findMany({
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      take: limit,
      orderBy: { id: "asc" },
    });

    if (!users || users.length === 0) {
      throwError(404, "Users not found");
    }

    return {
      prevCursor: cursor && users.length > 0 ? users[0].id : null,
      nextCursor: users.length > 0 ? users[users.length - 1].id : null,
      totalResults: users.length,
      data: users,
    };
  }

  async create(data: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    if (data.role !== undefined && !isRoleExist(data.role)) {
      throwError(422, `The role "${data.role}" does not exist`);
    }

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        isUserActive: true,
        role: (data.role as "admin" | "moderator" | "user") || undefined,
      },
    });

    return user;
  }

  async update(
    userId: string,
    connectedUser: IUser,
    data: { username?: string; email?: string; role?: string }
  ): Promise<User> {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!existingUser) {
      throwError(404, `User with id "${userId}" not found`);
    }

    if (!isAllowedToManipulate(existingUser!.id, connectedUser)) {
      throwError(403, "Forbidden: not authorized to manipulate this resource");
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        username: data.username,
        email: data.email,
        role: data.role as "admin" | "moderator" | "user" | undefined,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isUserActive: true,
        createdAt: true,
        updatedAt: true,
        password: false,
        uniqueString: false,
      },
    });

    return user as User;
  }

  async delete(userId: string, connectedUser: IUser): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throwError(404, `User with id "${userId}" not found`);
    }

    if (!isAllowedToManipulate(user!.id, connectedUser)) {
      throwError(403, "Forbidden: not authorized to manipulate this resource");
    }

    await prisma.user.delete({ where: { id: userId } });
  }

  async deleteAll(): Promise<number> {
    const result = await prisma.user.deleteMany({});
    return result.count;
  }
}

export const userService = new UserService();
