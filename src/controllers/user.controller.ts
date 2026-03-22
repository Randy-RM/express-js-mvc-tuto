import { Request, Response, NextFunction } from "express";
import { userService } from "../services";
import { IUser } from "../types";

export async function getOneUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.findById(String(req.params.userId), req.user as IUser);

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
  try {
    const { cursor, limit = "10" } = req.query;
    const data = await userService.findAll(cursor as string | undefined, Number(limit));

    res.status(200).json({
      success: true,
      status: 200,
      message: "Users found",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username, email, password, role } = req.body;
    const user = await userService.create({ username, email, password, role });

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
  try {
    const { username, email, role } = req.body;
    const user = await userService.update(String(req.params.userId), req.user as IUser, {
      username,
      email,
      role,
    });

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
  try {
    await userService.delete(String(req.params.userId), req.user as IUser);

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
    const deletedCount = await userService.deleteAll();

    res.status(200).json({
      success: true,
      status: 200,
      message: `${deletedCount} users deleted`,
      data: {},
    });
  } catch (error) {
    next(error);
  }
}
