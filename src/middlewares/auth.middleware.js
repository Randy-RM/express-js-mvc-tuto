const { throwError } = require("../utils");

function authorize(roles) {
  return (req, res, next) => {
    const { role } = req.user;

    try {
      if (roles.includes(role)) {
        return next();
      }

      throwError(403, "Forbidden: insufficient permissions");
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = authorize;
