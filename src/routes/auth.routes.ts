import { Router } from "express";
import passport from "passport";
import {
  activateAccount,
  deleteAccount,
  logout,
  recoverAccount,
  resetPassword,
  signin,
  signup,
} from "../controllers/auth.controller";
import {
  signupValidation,
  signinValidation,
  recoverAccountValidation,
  resetPasswordValidation,
  deleteAccountValidation,
} from "../validators";

const authRouter = Router();

authRouter.post("/signup", signupValidation, signup);

authRouter.post("/signup/:adminRouteParams", signupValidation, signup);

authRouter.get("/activate-account/:uniqueString", activateAccount);

authRouter.post("/signin", signinValidation, signin);

authRouter.post("/recover-account", recoverAccountValidation, recoverAccount);

authRouter.post("/reset-password/:resetToken", resetPasswordValidation, resetPassword);

authRouter.get("/logout", logout);

authRouter.post(
  "/delete-account",
  passport.authenticate("jwt", { session: false }),
  deleteAccountValidation,
  deleteAccount
);

export default authRouter;
