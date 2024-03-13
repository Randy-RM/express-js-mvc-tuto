const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model.js");

/*
--------------------------
Create and save a new user
in the database
--------------------------
*/
async function signup(req, res) {
  const { username, email, password } = req.body;

  const user = new UserModel({
    username: username,
    email: email,
    password: await bcrypt.hash(password, 10),
  });

  try {
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
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const passwordMatch = await user.isValidPassword(password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { username: user.username, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.json({
      message: "Logged in successfully",
      user: { username: user.username, email: user.email },
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
  return res.send("User is logout");
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
