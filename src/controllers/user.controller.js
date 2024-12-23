const bcrypt = require("bcrypt");
const { UserModel } = require("../models");
const { isAllowedToManipulate, isRoleExist, throwError } = require("../utils");

/*
--------------------------
Retrieve one user from 
the database.
--------------------------
*/
async function getOneUser(req, res, next) {
  const { userId } = req.params;
  const { user: connectedUser } = req;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      throwError(404, `User with id "${userId}" not found`);
    }

    if (!isAllowedToManipulate(user.id, connectedUser)) {
      throwError(401, `Unauthorized to manipulate resource`);
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: `User found`,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}

/*
--------------------------
Retrieve all users from 
the database.
--------------------------
*/
async function getAllUsers(req, res, next) {
  const { cursor, limit = 10 } = req.query;
  let query = {};

  // If a cursor is provided, add it to the query
  if (cursor) {
    query = { _id: { $gt: cursor } };
  }

  try {
    const users = await UserModel.find({ ...query }).limit(Number(limit));

    if (!users || users.length === 0) {
      throwError(404, `Users not found`);
    }

    // Extract the next and previous cursor from the result
    const prevCursor = cursor && users.length > 0 ? users[0]._id : null;
    const nextCursor = users.length > 0 ? users[users.length - 1]._id : null;

    return res.status(200).json({
      success: true,
      status: 200,
      message: `Users found`,
      data: {
        nextCursor,
        prevCursor,
        totalResults: users.length,
        data: users,
      },
    });
  } catch (error) {
    return next(error);
  }
}

/*
--------------------------
Create and save a new user
in the database
--------------------------
*/
async function createUser(req, res, next) {
  const { username, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!isRoleExist(role) && role != undefined) {
      throwError(422, `The role "${role}" does not exist`);
    }

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      isUserActive: true,
      role: role || undefined,
    })
      .then((user) => {
        return {
          username: user.username,
          email: user.email,
          isUserActive: user.isUserActive,
          role: user.role,
        };
      })
      .catch((error) => {
        throwError(422, `User already exists with email "${email}"`);
      });

    return res.status(201).json({
      success: true,
      status: 201,
      message: `User created`,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}

/*
--------------------------
Update a user by the id 
in the request
--------------------------
*/
async function updateUser(req, res, next) {
  const { userId } = req.params;
  const { user: connectedUser } = req;

  try {
    let user = await UserModel.findById(userId);

    if (!user) {
      throwError(404, `User with id "${userId}" not found`);
    }

    if (!isAllowedToManipulate(user.id, connectedUser)) {
      throwError(401, `Unauthorized to manipulate resource`);
    }

    user = await UserModel.findByIdAndUpdate(
      userId,
      { ...req.body },
      {
        select: { _id: 1, username: 1, email: 1, role: 1, isUserActive: 1 },
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      status: 200,
      message: `User updated successfully`,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}

/*
--------------------------
Delete a user with 
the specified id 
in the request
--------------------------
*/
async function deleteUser(req, res, next) {
  const { userId } = req.params;
  const { user: connectedUser } = req;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      throwError(404, `User with id "${userId}" not found`);
    }

    if (!isAllowedToManipulate(user.id, connectedUser)) {
      throwError(401, `Unauthorized to manipulate resource`);
    }

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      status: 200,
      message: `User deleted successfully`,
      data: {},
    });
  } catch (error) {
    return next(error);
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

module.exports = {
  createUser,
  deleteAllUsers,
  deleteUser,
  getAllUsers,
  getOneUser,
  updateUser,
};
