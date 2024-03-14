const { Router } = require("express");
const passport = require("passport");
const {
  createUser,
  deleteAllUsers,
  deleteUser,
  getAllUsers,
  getOneUser,
  updateUser,
} = require("../controllers/userController.js");
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
  `/add`,
  [passport.authenticate("jwt", { session: false }), isAdmin],
  createUser
);

//Update user by userId
userRouter.put(
  `/update/:userId`,
  [passport.authenticate("jwt", { session: false })],
  updateUser
);

//Delete user by userId
userRouter.delete(
  `/delete/:userId`,
  [passport.authenticate("jwt", { session: false })],
  deleteUser
);

//Delete all users
userRouter.delete(
  `/delete`,
  [passport.authenticate("jwt", { session: false })],
  deleteAllUsers
);

module.exports = userRouter;
