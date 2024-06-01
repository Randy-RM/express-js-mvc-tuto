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
const { authorize } = require("../middlewares/auth.middleware.js");

const { ROLES } = require("../constant");

const userRouter = Router();

//Get all users
userRouter.get(
  `/`,
  [passport.authenticate("jwt", { session: false }), authorize([ROLES.ADMIN])],
  getAllUsers
);

//Get one user by userId
userRouter.get(
  `/:userId`,
  [passport.authenticate("jwt", { session: false })],
  getOneUser
);

//Create a new user
userRouter.post(
  `/`,
  [passport.authenticate("jwt", { session: false }), authorize([ROLES.ADMIN])],
  createUser
);

//Update user by userId
userRouter.put(
  `/:userId`,
  [passport.authenticate("jwt", { session: false })],
  updateUser
);

//Delete user by userId
userRouter.delete(
  `/:userId`,
  [passport.authenticate("jwt", { session: false })],
  deleteUser
);

//Delete all users
userRouter.delete(
  `/`,
  [passport.authenticate("jwt", { session: false }), authorize([ROLES.ADMIN])],
  deleteAllUsers
);

module.exports = userRouter;
