/*
--------------------------
Create and save a new user
in the database
--------------------------
*/
async function signup(req, res, next) {
  return res.send("User is created");
}

/*
--------------------------
Activate user account
--------------------------
*/
function activateAccount(req, res, next) {
  return res.send("User account is activated");
}

/*
--------------------------
Signin if user have an account 
and roles 
--------------------------
*/
async function signin(req, res, next) {
  return res.send("User is signin");
}

/*
--------------------------
Logout if user is logged 
--------------------------
*/
async function logout(req, res, next) {
  return res.send("User is logout");
}

/*
--------------------------
Recover user account 
--------------------------
*/
async function recoverAccount(req, res, next) {
  return res.send("User account is recovered");
}

/*
--------------------------
Delete user account 
--------------------------
*/
async function deleteAccount(req, res, next) {
  return res.send("User account is deleted");
}

export {
  activateAccount,
  deleteAccount,
  logout,
  recoverAccount,
  signin,
  signup,
};

export default {
  activateAccount,
  deleteAccount,
  logout,
  recoverAccount,
  signin,
  signup,
};
