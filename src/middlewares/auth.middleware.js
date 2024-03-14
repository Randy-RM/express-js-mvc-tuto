const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(401)
      .json({ msg: "You are not authorized to view this resource" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role.roleName === "admin") {
    next();
  } else {
    res.status(401).json({
      message:
        "You are not authorized to view this resource because you are not an admin.",
    });
  }
};

module.exports = { isAuth, isAdmin };
