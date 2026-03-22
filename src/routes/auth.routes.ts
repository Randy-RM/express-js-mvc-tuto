import { Router } from "express";
import {
  activateAccount,
  deleteAccount,
  logout,
  recoverAccount,
  signin,
  signup,
} from "../controllers/auth.controller";
import { signupValidation, signinValidation } from "../validators";

const authRouter = Router();

authRouter.post("/signup", signupValidation, signup);

authRouter.post("/signup/:adminRouteParams", signupValidation, signup);

authRouter.get("/activate-account/:uniqueString", activateAccount);

authRouter.post("/signin", signinValidation, signin);

authRouter.post("/recover-account", recoverAccount);

authRouter.get("/logout", logout);

authRouter.post("/delete-account", deleteAccount);

export default authRouter;
