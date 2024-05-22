const { Router } = require("express");
const passport = require("passport");
const {
  createUser,
  deleteAllUsers,
  deleteUser,
  getAllUsers,
  getOneUser,
  updateUser,
} = require("../controllers/user.controller.js");
const { isAdmin } = require("../middlewares/auth.middleware.js");

const userRouter = Router();

//Get all users
userRouter.get(
  `/`,
  [passport.authenticate("jwt", { session: false }), isAdmin],
  getAllUsers
);

//Get one user by userId
userRouter.get(
  `/:userId`,
  [passport.authenticate("jwt", { session: false }), isAdmin],
  getOneUser
);

//Create a new user
userRouter.post(
  `/`,
  [passport.authenticate("jwt", { session: false }), isAdmin],
  createUser
);

//Update user by userId
userRouter.put(
  `/:userId`,
  [passport.authenticate("jwt", { session: false }), isAdmin],
  updateUser
);

//Delete user by userId
userRouter.delete(
  `/:userId`,
  [passport.authenticate("jwt", { session: false }), isAdmin],
  deleteUser
);

//Delete all users
userRouter.delete(
  `/`,
  [passport.authenticate("jwt", { session: false }), isAdmin],
  deleteAllUsers
);

module.exports = userRouter;
