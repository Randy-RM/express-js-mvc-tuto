const isAuthorOrAdmin = (req, res, next) => {
  if (
    req.user.role.roleName === "author" ||
    req.user.role.roleName === "admin"
  ) {
    next();
  } else {
    res.status(401).json({
      message:
        "You are not authorized to view this resource because you are not an author or admin.",
      data: {},
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role.roleName === "admin") {
    next();
  } else {
    res.status(401).json({
      message:
        "You are not authorized to view this resource because you are not an admin.",
      data: {},
    });
  }
};

module.exports = { isAuthorOrAdmin, isAdmin };
