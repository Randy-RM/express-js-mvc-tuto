require("dotenv").config();

const cors = require("cors");
const express = require("express");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const passport = require("passport");
const dbConnection = require("./config/database");

const {
  articleBaseURI,
  authBaseURI,
  roleBaseURI,
  userBaseURI,
} = require("./config/paths.config");
const {
  articleRouter,
  authRouter,
  roleRouter,
  userRouter,
} = require("./routes");

/**
 * -------------- GENERAL SETUP ----------------
 */
const app = express();
const PORT = process.env.PORT || 8000;
const corsOptions = {
  origin: `http://localhost:${PORT}`,
};
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

/**
 * -------------- SESSION SETUP ----------------
 */
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGOHQ_URL,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      // Equals 1 day
      // (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
// Need to require the entire Passport config
// module so index.js knows about it
require("./config/passport")(passport);

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  console.log(req.session);
  next();
});

/**
 * -------------- ROUTE ----------------
 */
app.use(authBaseURI, authRouter);
app.use(roleBaseURI, roleRouter);
app.use(userBaseURI, userRouter);
app.use(articleBaseURI, articleRouter);

/**
 * -------------- RUN SERVER ----------------
 */
if (dbConnection) {
  console.log("Successful connection to DB");
  app.listen(PORT, () => {
    console.log(`The server listens on http://localhost:${PORT}`);
  });
} else {
  console.log("DB connection error");
}
