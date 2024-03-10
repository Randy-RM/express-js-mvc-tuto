import { Router } from "express";
import {
  createUser,
  deleteAllUsers,
  deleteUser,
  getAllUsers,
  getOneUser,
  updateUser,
} from "../controllers/userController.js";

const userRouter = Router();

//Get all users
userRouter.get(`/`, getAllUsers);

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

export default userRouter;
