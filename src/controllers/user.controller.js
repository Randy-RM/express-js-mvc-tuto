const bcrypt = require("bcrypt");
const { UserModel, RoleModel } = require("../models/index.js");

/*
--------------------------
Retrieve one user from 
the database.
--------------------------
*/
async function getOneUser(req, res) {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId).populate("role");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/*
--------------------------
Retrieve all users from 
the database.
--------------------------
*/
async function getAllUsers(req, res) {
  try {
    const users = await UserModel.find({}).populate("role");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/*
--------------------------
Create and save a new user
in the database
--------------------------
*/
async function createUser(req, res) {
  const { username, email, password } = req.body;
  try {
    const userRole = await RoleModel.findOne({ roleName: "author" });

    const user = new UserModel({
      username: username,
      email: email,
      password: await bcrypt.hash(password, 10),
      role: userRole ? userRole : null,
    });

    const newUser = await user
      .save()
      .then((user) => user)
      .catch((error) => {
        return { error: error.message };
      });

    if (newUser.error) {
      throw new Error(newUser.error);
    }
    return res.status(201).json({ message: "User is created", data: newUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/*
--------------------------
Update a user by the id 
in the request
--------------------------
*/
async function updateUser(req, res) {
  return res.send("User is updated");
}

/*
--------------------------
Delete a user with 
the specified id 
in the request
--------------------------
*/
async function deleteUser(req, res) {
  return res.send("User is deleted");
}

/*
--------------------------
Delete all users from 
the database.
--------------------------
*/
async function deleteAllUsers(req, res) {
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
