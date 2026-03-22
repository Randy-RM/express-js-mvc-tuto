import { Router } from "express";
import passport from "passport";
import {
  createUser,
  deleteAllUsers,
  deleteUser,
  getAllUsers,
  getOneUser,
  updateUser,
} from "../controllers/user.controller";
import { authorize } from "../middlewares";
import { ROLES } from "../constants";
import {
  createUserValidation,
  updateUserValidation,
  mongoIdParam,
  paginationQuery,
} from "../validators";

const userRouter = Router();

userRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorize([ROLES.ADMIN]),
  paginationQuery,
  getAllUsers
);

userRouter.get(
  "/:userId",
  mongoIdParam("userId"),
  passport.authenticate("jwt", { session: false }),
  getOneUser
);

userRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorize([ROLES.ADMIN]),
  createUserValidation,
  createUser
);

userRouter.put(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  updateUserValidation,
  updateUser
);

userRouter.delete(
  "/:userId",
  mongoIdParam("userId"),
  passport.authenticate("jwt", { session: false }),
  deleteUser
);

userRouter.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorize([ROLES.ADMIN]),
  deleteAllUsers
);

export default userRouter;
