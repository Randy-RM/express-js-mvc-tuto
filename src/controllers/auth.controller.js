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
  let role =
    adminRouteParams &&
    adminRouteParams === process.env.ADMIN_SECRET_SIGNUP_PARAMS_ROUTE
      ? { roleName: "admin" }
      : { roleName: "user" };

  try {
    const userRole = await RoleModel.findOne(role);

    const user = new UserModel({
      username: username,
      email: email,
      password: await bcrypt.hash(password, 10),
      uniqueString: randomStringGenerator(),
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
    // send mail to user
    const accountActivationEmail = sendAccountActivationEmail(
      newUser.email,
      newUser.uniqueString
    );

    if (!accountActivationEmail.status) {
      throw new Error(accountActivationEmail.data);
    }

    return res.status(201).json({ message: "User is created", data: newUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/*
--------------------------
Activate user account
--------------------------
*/
function activateAccount(req, res) {
  return res.send("User account is activated");
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
      return res.status(400).json({ message: "Invalid email" });
    }
    const passwordMatch = await user.isUserPassword(password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Add your authenticated property below:
    req.session.authenticated = true;
    // Add the user object below:
    req.session.user = {
      email: user.email,
      username: user.username,
      role: user.role,
    };

    return res.json({
      message: "Logged in successfully",
      user: { username: user.username, email: user.email, role: user.role },
      token,
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
