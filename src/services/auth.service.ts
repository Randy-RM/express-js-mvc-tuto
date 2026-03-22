import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models";
import { randomStringGenerator, throwError } from "../utils";
import { IUser } from "../types";

export class AuthService {
  async signup(
    data: { username: string; email: string; password: string },
    adminRouteParams?: string
  ): Promise<void> {
    const adminSecret = process.env.ADMIN_SECRET_SIGNUP_PARAMS_ROUTE;
    const userRole = adminRouteParams && adminRouteParams === adminSecret ? "admin" : "user";

    const hashedPassword = await bcrypt.hash(data.password, 12);

    await UserModel.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      uniqueString: randomStringGenerator(),
      role: userRole,
      isUserActive: true,
    });
  }

  async activateAccount(uniqueString: string): Promise<void> {
    const user = await UserModel.findOneAndUpdate(
      { uniqueString },
      { isUserActive: true },
      { returnOriginal: false }
    );

    if (!user) {
      throwError(400, "Invalid activation link");
    }
  }

  async signin(
    email: string,
    password: string
  ): Promise<{ user: Pick<IUser, "username" | "email" | "role">; token: string }> {
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

    return {
      user: {
        username: user!.username,
        email: user!.email,
        role: user!.role,
      },
      token,
    };
  }
}

export const authService = new AuthService();
