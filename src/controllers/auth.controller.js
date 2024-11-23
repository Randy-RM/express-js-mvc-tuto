const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models");
const {
  randomStringGenerator,
  throwError,
  /**
   * to be uncommented
   * to set up mail sending,
   * activation and confirmation functionality
   */
  // sendAccountActivationEmail,
} = require("../utils");

/*
--------------------------
Create and save a new user
in the database
--------------------------
*/
async function signup(req, res, next) {
  const { adminRouteParams } = req.params;
  const { username, email, password } = req.body;
  /**
   * to be uncommented
   * to set up mail sending,
   * activation and confirmation functionality
   */
  // const apiHostDomain = req.headers.host;
  const adminSecret = process.env.ADMIN_SECRET_SIGNUP_PARAMS_ROUTE;
  const userRole =
    adminRouteParams && adminRouteParams === adminSecret ? "admin" : "user";

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      username: username,
      email: email,
      password: hashedPassword,
      uniqueString: randomStringGenerator(),
      role: userRole,
      /**
       * to be commented
       * to set up mail sending,
       * activation and confirmation functionality
       */
      isUserActive: true,
    });

    /**
     * to be uncommented
     * to set up mail sending,
     * activation and confirmation functionality
     */
    // send mail to user
    // sendAccountActivationEmail(
    //   newUser.email,
    //   newUser.uniqueString,
    //   apiHostDomain
    // );

    return res.status(201).json({ message: "User created" });
  } catch (error) {
    return next(error);
  }
}

/*
--------------------------
Activate user account
--------------------------
*/
async function activateAccount(req, res, next) {
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
      throwError(500, `problems arising from verification`);
    }

    console.log("User account is activated");
    return res.json({ message: "User account is activated" });
    // return res.redirect(`${process.env.CLIENT_HOST}${process.env.CLIENT_VERIFY}`);
  } catch (error) {
    return next(error);
  }
}

/*
--------------------------
Signin if user have an account 
and roles 
--------------------------
*/
async function signin(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      throwError(404, `User with this email "${email}" not found`);
    }

    const passwordMatch = await user.isUserPassword(password);

    if (!passwordMatch) {
      throwError(400, `Invalid password for "${email}"`);
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      message: "Logged in successfully",
      data: {
        user: {
          username: user.username,
          email: user.email,
          userRole: user.role,
        },
        token: token,
      },
    });
  } catch (error) {
    return next(error);
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
