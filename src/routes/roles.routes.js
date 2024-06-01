const { Router } = require("express");
const passport = require("passport");
const {
  createRole,
  deleteAllRoles,
  deleteRole,
  getAllRoles,
  getOneRole,
  updateRole,
} = require("../controllers/role.controller.js");
const { authorize } = require("../middlewares");

const { ROLES } = require("../constant");

const roleRouter = Router();

//Get all roles
roleRouter.get(
  `/`,
  [passport.authenticate("jwt", { session: false }), authorize([ROLES.ADMIN])],
  getAllRoles
);

//Get one role by roleId
roleRouter.get(
  `/:roleId`,
  [passport.authenticate("jwt", { session: false }), authorize([ROLES.ADMIN])],
  getOneRole
);

//Create a new role
roleRouter.post(
  `/`,
  [passport.authenticate("jwt", { session: false }), authorize([ROLES.ADMIN])],
  createRole
);

//Update role by roleId
roleRouter.put(
  `/:roleId`,
  [passport.authenticate("jwt", { session: false }), authorize([ROLES.ADMIN])],
  updateRole
);

//Delete role by roleId
roleRouter.delete(
  `/:roleId`,
  [passport.authenticate("jwt", { session: false }), authorize([ROLES.ADMIN])],
  deleteRole
);

//Delete all roles
roleRouter.delete(
  `/`,
  [passport.authenticate("jwt", { session: false }), authorize([ROLES.ADMIN])],
  deleteAllRoles
);

module.exports = roleRouter;
