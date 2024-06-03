const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { RoleModel, UserModel } = require("../models/index.js");
const {
  randomStringGenerator,
  sendAccountActivationEmail,
} = require("../utils/index.js");

/*
--------------------------
Create and save a new user
in the database
--------------------------
*/
async function signup(req, res) {
  const { adminRouteParams } = req.params;
  const { username, email, password } = req.body;
  const apiHostDomain = req.headers.host;
  let role =
    adminRouteParams &&
    adminRouteParams === process.env.ADMIN_SECRET_SIGNUP_PARAMS_ROUTE
      ? { roleName: "admin" }
      : { roleName: "user" };

  try {
    const userRole = await RoleModel.findOne(role);
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!userRole) {
      return res
        .status(422)
        .json({ message: `The role "${role.roleName}" does not exist` });
    }

    await UserModel.create({
      username: username,
      email: email,
      password: hashedPassword,
      uniqueString: randomStringGenerator(),
      role: userRole ? userRole : null,
    });

    // send mail to user
    sendAccountActivationEmail(
      newUser.email,
      newUser.uniqueString,
      apiHostDomain
    );

    return res.status(201).json({ message: "User created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/*
--------------------------
Activate user account
--------------------------
*/
async function activateAccount(req, res) {
  // getting the string
  const { uniqueString } = req.params;
  const filter = { uniqueString: uniqueString };
  const update = { isUserActive: true };

  try {
    // check is there is anyone with this string and update
    const user = await UserModel.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });
    if (!user) {
      throw new Error("problems arising from verification");
    }
    console.log("User account is activated");
    return res.json({ message: "User account is activated" });
    // return res.redirect(`${process.env.CLIENT_HOST}${process.env.CLIENT_VERIFY}`);
  } catch (error) {
    return res.status(500).json({ message: ` ${error}` });
  }
}

/*
--------------------------
Signin if user have an account 
and roles 
--------------------------
*/
async function signin(req, res) {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email }).populate("role");

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with this email "${email}" not found` });
    }
    const passwordMatch = await user.isUserPassword(password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { email: user.email, userRole: user.role.roleName },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.json({
      message: "Logged in successfully",
      data: {
        user: { username: user.username, email: user.email },
        token: token,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/*
--------------------------
Logout if user is logged 
--------------------------
*/
async function logout(req, res) {
  req.logout(function (error) {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    return res.send("User is logout");
  });
}

/*
--------------------------
Recover user account 
--------------------------
*/
async function recoverAccount(req, res) {
  return res.send("User account is recovered");
}

/*
--------------------------
Delete user account 
--------------------------
*/
async function deleteAccount(req, res) {
  return res.send("User account is deleted");
}

module.exports = {
  activateAccount,
  deleteAccount,
  logout,
  recoverAccount,
  signin,
  signup,
};
