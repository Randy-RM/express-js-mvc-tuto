import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../models";
import { randomStringGenerator, throwError, sendPasswordRecoveryEmail } from "../utils";

export class AuthService {
  async signup(
    data: { username: string; email: string; password: string },
    adminRouteParams?: string
  ): Promise<void> {
    const adminSecret = process.env.ADMIN_SECRET_SIGNUP_PARAMS_ROUTE;
    const userRole = adminRouteParams && adminRouteParams === adminSecret ? "admin" : "user";

    const hashedPassword = await bcrypt.hash(data.password, 12);

    await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        uniqueString: randomStringGenerator(),
        role: userRole,
        isUserActive: true,
      },
    });
  }

  async activateAccount(uniqueString: string): Promise<void> {
    const user = await prisma.user.findFirst({ where: { uniqueString } });

    if (!user) {
      throwError(400, "Invalid activation link");
    }

    await prisma.user.update({
      where: { id: user!.id },
      data: { isUserActive: true },
    });
  }

  async signin(
    email: string,
    password: string
  ): Promise<{ user: { username: string; email: string; role: string }; token: string }> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throwError(401, "Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password, user!.password);

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

  async recoverAccount(email: string, apiHostDomain: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal whether the email exists
      return;
    }

    const resetToken = randomStringGenerator();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    await sendPasswordRecoveryEmail(email, resetToken, apiHostDomain);
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findFirst({
      where: {
        resetToken,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throwError(400, "Invalid or expired reset token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user!.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }

  async deleteAccount(userId: string, password: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throwError(404, "User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user!.password);

    if (!passwordMatch) {
      throwError(401, "Invalid password");
    }

    await prisma.article.deleteMany({ where: { userId: user!.id } });
    await prisma.user.delete({ where: { id: user!.id } });
  }
}

export const authService = new AuthService();
