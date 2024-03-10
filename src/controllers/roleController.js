/*
--------------------------
Retrieve one role from 
the database.
--------------------------
*/
async function getOneRole(req, res, next) {
  return res.send("One role");
}

/*
--------------------------
Retrieve all roles from 
the database.
--------------------------
*/
async function getAllRoles(req, res, next) {
  return res.send("All roles");
}

/*
--------------------------
Create and save a new role
in the database
--------------------------
*/
async function createRole(req, res, next) {
  return res.send("Role is created");
}

/*
--------------------------
Update a role by the id 
in the request
--------------------------
*/
async function updateRole(req, res, next) {
  return res.send("Role is updated");
}

/*
--------------------------
Delete a role with 
the specified id 
in the request
--------------------------
*/
async function deleteRole(req, res, next) {
  return res.send("Role is deleted");
}

/*
--------------------------
Delete all roles from 
the database.
--------------------------
*/
async function deleteAllRoles(req, res, next) {
  return res.send("Roles are deleted");
}

export {
  createRole,
  deleteAllRoles,
  deleteRole,
  getAllRoles,
  getOneRole,
  updateRole,
};

export default {
  createRole,
  getOneRole,
  getAllRoles,
  updateRole,
  deleteAllRoles,
  deleteRole,
};
