import { Router } from "express";
import {
  createRole,
  deleteAllRole,
  deleteRole,
  getAllRoles,
  getOneRole,
  updateRole,
} from "../controllers/roleController.js";

const roleRouter = Router();

//Get all roles
roleRouter.get(`/`, getAllRoles);

//Get one role by roleId
roleRouter.get(`/:roleId`, getOneRole);

//Create a new role
roleRouter.post(`/add`, createRole);

//Update role by id
roleRouter.put(`/update/:roleId`, updateRole);

//Delete role by id
roleRouter.delete(`/delete/:roleId`, deleteRole);

//Delete all role
roleRouter.delete(`/delete`, deleteAllRole);

export default roleRouter;
