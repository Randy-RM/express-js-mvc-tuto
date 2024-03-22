const { Router } = require("express");
const {
  activateAccount,
  deleteAccount,
  logout,
  recoverAccount,
  signin,
  signup,
} = require("../controllers/auth.controller.js");

const authRouter = Router();

authRouter.post("/signup", signup);

authRouter.post(`/signup/:adminRouteParams`, signup);

authRouter.post("/signin", signin);

authRouter.get("/activate-account", activateAccount);

authRouter.get("/logout", logout);

authRouter.post("/recover-account", recoverAccount);

authRouter.post("/delete-account", deleteAccount);

module.exports = authRouter;
