function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.protocol}://${req.get(
      "host"
    )}${req.originalUrl}`
  );
  next();
}

module.exports = logger;
