import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models";
import { isAllowedToManipulate, isRoleExist, throwError } from "../utils";
import { IUser } from "../types";

export async function getOneUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { userId } = req.params;
  const connectedUser = req.user as IUser;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      throwError(404, `User with id "${userId}" not found`);
    }

    if (!isAllowedToManipulate(user!.id, connectedUser)) {
      throwError(403, "Forbidden: not authorized to manipulate this resource");
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "User found",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { cursor, limit = "10" } = req.query;
  let query: Record<string, unknown> = {};

  if (cursor) {
    query = { _id: { $gt: cursor } };
  }

  try {
    const users = await UserModel.find(query).limit(Number(limit));

    if (!users || users.length === 0) {
      throwError(404, "Users not found");
    }

    const prevCursor = cursor && users.length > 0 ? users[0]._id : null;
    const nextCursor = users.length > 0 ? users[users.length - 1]._id : null;

    res.status(200).json({
      success: true,
      status: 200,
      message: "Users found",
      data: {
        nextCursor,
        prevCursor,
        totalResults: users.length,
        data: users,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { username, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    if (role !== undefined && !isRoleExist(role)) {
      throwError(422, `The role "${role}" does not exist`);
    }

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      isUserActive: true,
      role: role || undefined,
    });

    res.status(201).json({
      success: true,
      status: 201,
      message: "User created",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { userId } = req.params;
  const connectedUser = req.user as IUser;

  try {
    const existingUser = await UserModel.findById(userId);

    if (!existingUser) {
      throwError(404, `User with id "${userId}" not found`);
    }

    if (!isAllowedToManipulate(existingUser!.id, connectedUser)) {
      throwError(403, "Forbidden: not authorized to manipulate this resource");
    }

    const { username, email, role } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { username, email, role },
      {
        select: { _id: 1, username: 1, email: 1, role: 1, isUserActive: 1 },
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      status: 200,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { userId } = req.params;
  const connectedUser = req.user as IUser;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      throwError(404, `User with id "${userId}" not found`);
    }

    if (!isAllowedToManipulate(user!.id, connectedUser)) {
      throwError(403, "Forbidden: not authorized to manipulate this resource");
    }

    await user!.deleteOne();

    res.status(200).json({
      success: true,
      status: 200,
      message: "User deleted successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await UserModel.deleteMany({});
    res.status(200).json({
      success: true,
      status: 200,
      message: `${result.deletedCount} users deleted`,
      data: {},
    });
  } catch (error) {
    next(error);
  }
}
