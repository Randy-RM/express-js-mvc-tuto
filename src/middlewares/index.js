module.exports = {
  logger: require("./logger.middleware"),
  authorize: require("./auth.middleware"),
  errorHandler: require("./error.middleware"),
};
