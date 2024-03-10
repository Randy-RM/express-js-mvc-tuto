import { Router } from "express";
import {
  activateAccount,
  deleteAccount,
  logout,
  recoverAccount,
  signin,
  signup,
} from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/signup", signup);

authRouter.post("/signin", signin);

authRouter.get("/activate-account", activateAccount);

authRouter.get("/logout", logout);

authRouter.post("/recover-account", recoverAccount);

authRouter.post("/delete-account", deleteAccount);

export default authRouter;
