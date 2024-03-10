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
  return res.send("role is Created");
}

/*
--------------------------
Update a role by the id 
in the request
--------------------------
*/
async function updateRole(req, res, next) {
  return res.send("role is Updated");
}

/*
--------------------------
Delete a role with 
the specified id 
in the request
--------------------------
*/
async function deleteRole(req, res, next) {
  return res.send("role is deleted");
}

/*
--------------------------
Delete all roles from 
the database.
--------------------------
*/
async function deleteAllRole(req, res, next) {
  return res.send("roles are deleted");
}

export {
  createRole,
  deleteAllRole,
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
  deleteAllRole,
  deleteRole,
};
