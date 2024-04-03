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

// Create and save a new user account.
authRouter.post("/signup", signup);

// Create and save a new admin account.
authRouter.post(`/signup/:adminRouteParams`, signup);

// Verify and confirm user account.
authRouter.get("/activate-account/:uniqueString", activateAccount);

// Signin if user have an account.
authRouter.post("/signin", signin);

// Recover account if user have one.
authRouter.post("/recover-account", recoverAccount);

// Logout user.
authRouter.get("/logout", logout);

// Delete user account
authRouter.post("/delete-account", deleteAccount);

module.exports = authRouter;
