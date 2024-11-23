function errorHandler(err, req, res, next) {
  console.log("Middleware Error Hadnling");
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || "Something went wrong";
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    data: process.env.NODE_ENV === "development" ? err.stack : {},
  });
}

module.exports = errorHandler;
