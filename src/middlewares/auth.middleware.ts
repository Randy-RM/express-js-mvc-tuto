import { Request, Response, NextFunction } from "express";
import { throwError } from "../utils";
import { IUser } from "../types";
import { Role } from "../constants";

export function authorize(roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user as IUser;

    if (roles.includes(user.role as Role)) {
      return next();
    }

    try {
      throwError(403, "Forbidden: insufficient permissions");
    } catch (error) {
      next(error);
    }
  };
}
