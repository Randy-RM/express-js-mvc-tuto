const bcrypt = require("bcrypt");
const { UserModel, RoleModel, ArticleModel } = require("../models/index.js");
const { isAuthorizedToInteractWithResource } = require("../utils/index.js");

/*
--------------------------
Retrieve one user from 
the database.
--------------------------
*/
async function getOneUser(req, res) {
  const { userId } = req.params;
  const { id: loggedUserId, role: loggedUserRoleName } = req.user;

  try {
    if (
      !isAuthorizedToInteractWithResource({
        userIdInResource: userId,
        loggedUserId: loggedUserId,
        loggedUserRoleName: loggedUserRoleName,
      })
    ) {
      return res
        .status(401)
        .json({ message: "Unauthorized to view resources" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id "${userId}" not found` });
    }

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
  const { cursor, limit = 10 } = req.query;
  let query = {};

  // If a cursor is provided, add it to the query
  if (cursor) {
    query = { _id: { $gt: cursor } };
  }

  try {
    const users = await UserModel.find({ ...query }).limit(Number(limit));

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }

    // Extract the next and previous cursor from the result
    const prevCursor = cursor && users.length > 0 ? users[0]._id : null;
    const nextCursor = users.length > 0 ? users[users.length - 1]._id : null;

    return res.status(200).json({
      nextCursor,
      prevCursor,
      totalResults: users.length,
      data: users,
    });
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
      !isAuthorizedToInteractWithResource({
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
      !isAuthorizedToInteractWithResource({
        userIdInResource: user.id,
        loggedUserId: loggedUserId,
        loggedUserRoleName: loggedUserRoleName,
      })
    ) {
      return res
        .status(401)
        .json({ message: "Unauthorized to modify resource" });
    }

    await user.deleteOne();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
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

/*
--------------------------
Retrieve user articles from 
the database.
--------------------------
*/
async function getUserArticles(req, res) {
  const { userId } = req.params;
  const { cursor, limit = 10 } = req.query;
  let query = {};

  const {
    id: loggedUserId,
    role: { roleName: loggedUserRoleName },
  } = req.user;

  // If a cursor is provided, add it to the query
  if (cursor) {
    query = { _id: { $gt: cursor } };
  }

  try {
    if (
      !isAuthorizedToInteractWithResource({
        userIdInResource: userId,
        loggedUserId: loggedUserId,
        loggedUserRoleName: loggedUserRoleName,
      })
    ) {
      return res
        .status(401)
        .json({ message: "Unauthorized to view resources" });
    }

    const articles = await ArticleModel.find({ user: userId, ...query })
      .select({
        id: 1,
        title: 1,
        summary: 1,
        isPublished: 1,
        isArchived: 1,
        createdAt: 1,
      })
      .limit(Number(limit));

    if (!articles || articles.length === 0) {
      return res.status(404).json({ message: "Articles not found" });
    }

    // Extract the next and previous cursor from the result
    const prevCursor = cursor && articles.length > 0 ? articles[0]._id : null;
    const nextCursor =
      articles.length > 0 ? articles[articles.length - 1]._id : null;

    return res.status(200).json({
      nextCursor,
      prevCursor,
      totalResults: articles.length,
      data: articles,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createUser,
  deleteAllUsers,
  deleteUser,
  getAllUsers,
  getOneUser,
  updateUser,
  getUserArticles,
};
