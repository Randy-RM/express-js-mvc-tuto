function authorize(roles) {
  return (req, res, next) => {
    const {
      role: { roleName },
    } = req.user;

    if (roles.includes(roleName)) {
      next(); // User is authorized, proceed to the next middleware or route handler
    } else {
      return res.status(403).json({
        message:
          "You are not authorize to perform this action because of your role",
      });
    }
  };
}

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

module.exports = { authorize, isAuthorOrAdmin, isAdmin };
