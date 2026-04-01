import { Request, Response, NextFunction } from "express";
import { authService } from "../services";
import { IUser } from "../types";

export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username, email, password } = req.body;
    await authService.signup(
      { username, email, password },
      req.params.adminRouteParams as string | undefined
    );

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
  try {
    await authService.activateAccount(String(req.params.uniqueString));

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
  try {
    const { email, password } = req.body;
    const result = await authService.signin(email, password);

    res.status(200).json({
      success: true,
      status: 200,
      message: "Logged in successfully",
      data: {
        user: {
          username: result.user.username,
          email: result.user.email,
          userRole: result.user.role,
        },
        token: result.token,
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

export async function recoverAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body;
    const apiHostDomain = process.env.API_HOST || `localhost:${process.env.PORT || 8000}`;
    await authService.recoverAccount(email, apiHostDomain);

    res.status(200).json({
      success: true,
      status: 200,
      message: "If the email exists, a recovery link has been sent",
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const resetToken = String(req.params.resetToken);
    const { password } = req.body;
    await authService.resetPassword(resetToken, password);

    res.status(200).json({
      success: true,
      status: 200,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req.user as IUser).id;
    const { password } = req.body;
    await authService.deleteAccount(userId, password);

    res.status(200).json({
      success: true,
      status: 200,
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
