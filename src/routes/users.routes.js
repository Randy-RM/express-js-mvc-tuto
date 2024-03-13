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

const userRouter = Router();

//Get all users
userRouter.get(
  `/`,
  [passport.authenticate("jwt", { session: false })],
  getAllUsers
);

//Get one user by userId
userRouter.get(`/:userId`, getOneUser);

//Create a new user
userRouter.post(`/add`, createUser);

//Update user by userId
userRouter.put(`/update/:userId`, updateUser);

//Delete user by userId
userRouter.delete(`/delete/:userId`, deleteUser);

//Delete all users
userRouter.delete(`/delete`, deleteAllUsers);

module.exports = userRouter;
