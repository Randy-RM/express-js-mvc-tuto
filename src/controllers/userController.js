/*
--------------------------
Retrieve one user from 
the database.
--------------------------
*/
async function getOneUser(req, res, next) {
  return res.send("One user");
}

/*
--------------------------
Retrieve all users from 
the database.
--------------------------
*/
async function getAllUsers(req, res, next) {
  return res.send("All users");
}

/*
--------------------------
Create and save a new user
in the database
--------------------------
*/
async function createUser(req, res, next) {
  return res.send("User is Created");
}

/*
--------------------------
Update a user by the id 
in the request
--------------------------
*/
async function updateUser(req, res, next) {
  return res.send("User is updated");
}

/*
--------------------------
Delete a user with 
the specified id 
in the request
--------------------------
*/
async function deleteUser(req, res, next) {
  return res.send("User is deleted");
}

/*
--------------------------
Delete all users from 
the database.
--------------------------
*/
async function deleteAllUsers(req, res, next) {
  return res.send("Users are deleted");
}

module.exports = {
  createUser,
  deleteAllUsers,
  deleteUser,
  getAllUsers,
  getOneUser,
  updateUser,
};
