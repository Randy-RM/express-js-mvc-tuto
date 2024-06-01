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

module.exports = { authorize };
