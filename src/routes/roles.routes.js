const { Router } = require("express");
const {
  createRole,
  deleteAllRoles,
  deleteRole,
  getAllRoles,
  getOneRole,
  updateRole,
} = require("../controllers/roleController.js");

const roleRouter = Router();

//Get all roles
roleRouter.get(`/`, getAllRoles);

//Get one role by roleId
roleRouter.get(`/:roleId`, getOneRole);

//Create a new role
roleRouter.post(`/add`, createRole);

//Update role by roleId
roleRouter.put(`/update/:roleId`, updateRole);

//Delete role by roleId
roleRouter.delete(`/delete/:roleId`, deleteRole);

//Delete all roles
roleRouter.delete(`/delete`, deleteAllRoles);

module.exports = roleRouter;
