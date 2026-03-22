import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models";
import { randomStringGenerator, throwError } from "../utils";

export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { adminRouteParams } = req.params;
  const { username, email, password } = req.body;
  const adminSecret = process.env.ADMIN_SECRET_SIGNUP_PARAMS_ROUTE;
  const userRole = adminRouteParams && adminRouteParams === adminSecret ? "admin" : "user";

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    await UserModel.create({
      username,
      email,
      password: hashedPassword,
      uniqueString: randomStringGenerator(),
      role: userRole,
      isUserActive: true,
    });

    res.status(201).json({
      success: true,
      status: 201,
      message: "User created",
    });
  } catch (error) {
    next(error);
  }
}

export async function activateAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { uniqueString } = req.params;

  try {
    const user = await UserModel.findOneAndUpdate(
      { uniqueString },
      { isUserActive: true },
      { returnOriginal: false }
    );

    if (!user) {
      throwError(400, "Invalid activation link");
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "User account is activated",
    });
  } catch (error) {
    next(error);
  }
}

export async function signin(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throwError(401, "Invalid email or password");
    }

    const passwordMatch = await user!.isUserPassword(password);

    if (!passwordMatch) {
      throwError(401, "Invalid email or password");
    }

    const token = jwt.sign({ email: user!.email }, process.env.JWT_SECRET || "", {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Logged in successfully",
      data: {
        user: {
          username: user!.username,
          email: user!.email,
          userRole: user!.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  req.logout((error: Error) => {
    if (error) {
      res.status(500).json({
        success: false,
        status: 500,
        message: error.message,
      });
      return;
    }
    res.status(200).json({
      success: true,
      status: 200,
      message: "User is logged out",
    });
  });
}

export async function recoverAccount(req: Request, res: Response): Promise<void> {
  // TODO: Implement account recovery with email token flow
  res.status(501).json({
    success: false,
    status: 501,
    message: "Account recovery not yet implemented",
  });
}

export async function deleteAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // TODO: Implement account deletion with password confirmation
  res.status(501).json({
    success: false,
    status: 501,
    message: "Account deletion not yet implemented",
  });
}
