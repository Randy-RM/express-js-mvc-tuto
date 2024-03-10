import { Router } from "express";
import {
  createRole,
  deleteAllRole,
  deleteRole,
  getAllRoles,
  updateRole,
} from "../controllers/roleController.js";

const roleRouter = Router();

//Get all roles or one role by roleName
roleRouter.get(`/`, getAllRoles);

//Create a new role
roleRouter.post(`/add`, createRole);

//Update role by id
roleRouter.put(`/update/:roleId`, updateRole);

//Delete role by id
roleRouter.delete(`/delete/:roleId`, deleteRole);

//Delete all role
roleRouter.delete(`/delete`, deleteAllRole);

export default roleRouter;
