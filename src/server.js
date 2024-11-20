require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const dbConnection = require("./config/database.config");
const router = require("./routes");
const { logger } = require("./middlewares");

/**
 * -------------- GENERAL SETUP ----------------
 */
const app = express();
const PORT = process.env.PORT || 8000;
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [`${process.env.API_HOST}`, `${process.env.CLIENT_HOST}`]
      : "*",
};
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(helmet());
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
// Need to require the entire Passport config
// module so index.js knows about it
require("./config/passport.config")(passport);
app.use(passport.initialize());

/**
 * -------------- ROUTE ----------------
 */
// logger middleware
app.use(logger);
// Imports all of the routes
// from ./routes/index
app.use("/api", router);
app.get("/api", (req, res, next) => {
  return res.json({ message: "Welcome to Express MVC Tuto API" });
});

/**
 * -------------- RUN SERVER ----------------
 */
dbConnection.once("open", () => {
  console.log("Successful connection to DB");
  app.listen(PORT, () => {
    console.log(`Server listen on http://localhost:${PORT}`);
  });
});

dbConnection.on("error", (error) => {
  console.log("DB connection error : ", error);
  console.log(`Server can't listen on http://localhost:${PORT}`);
});
