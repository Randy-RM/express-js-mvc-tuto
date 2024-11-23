const { throwError } = require("../utils");

function authorize(roles) {
  return (req, res, next) => {
    const { role } = req.user;

    try {
      if (roles.includes(role)) {
        return next(); // User is authorized, proceed to the next middleware or route handler
      }

      throwError(403, `You are not authorize to perform this action`);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = authorize;
