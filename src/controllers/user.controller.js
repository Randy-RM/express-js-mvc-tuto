const bcrypt = require("bcrypt");
const { UserModel, RoleModel } = require("../models/index.js");
const { isUserAuthorizedToModifyResource } = require("../utils/index.js");

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
  const { username, email, password, roleName = "author" } = req.body;

  try {
    const role = await RoleModel.findOne({ roleName });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!role) {
      return res
        .status(422)
        .json({ message: `The role "${roleName}" does not exist` });
    }

    await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role: role ? role : null,
    });

    return res.status(201).json({ message: "User created" });
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
  const { userId } = req.params;
  const {
    id: loggedUserId,
    role: { roleName: loggedUserRoleName },
  } = req.user;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      !isUserAuthorizedToModifyResource({
        userIdInResource: user.id,
        loggedUserId: loggedUserId,
        loggedUserRoleName: loggedUserRoleName,
      })
    ) {
      return res
        .status(401)
        .json({ message: "Unauthorized to modify resource" });
    }

    await user.updateOne({ ...req.body });

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
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
