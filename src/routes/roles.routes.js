const { Router } = require("express");
const passport = require("passport");
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
roleRouter.post(
  `/add`,
  [passport.authenticate("jwt", { session: false })],
  createRole
);

//Update role by roleId
roleRouter.put(
  `/update/:roleId`,
  [passport.authenticate("jwt", { session: false })],
  updateRole
);

//Delete role by roleId
roleRouter.delete(
  `/delete/:roleId`,
  [passport.authenticate("jwt", { session: false })],
  deleteRole
);

//Delete all roles
roleRouter.delete(
  `/delete`,
  [passport.authenticate("jwt", { session: false })],
  deleteAllRoles
);

module.exports = roleRouter;
