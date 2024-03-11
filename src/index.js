const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const {
  articlesBaseURI,
  authBaseURI,
  rolesBaseURI,
  usersBaseURI,
} = require("./config/paths");
const {
  articleRouter,
  authRouter,
  roleRouter,
  userRouter,
} = require("./routes");

const app = express();
const PORT = process.env.PORT || 8000;
const corsOptions = {
  origin: `http://localhost:${PORT}`,
};

// Config
app.use(express.json());
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Routes
app.use(authBaseURI, authRouter);
app.use(rolesBaseURI, roleRouter);
app.use(usersBaseURI, userRouter);
app.use(articlesBaseURI, articleRouter);

// Run server
mongoose
  .connect(process.env.MONGOHQ_URL)
  .then(() => {
    console.log("Successful connection to DB");
    app.listen(PORT, () => {
      console.log(`The server listens on http://localhost:${PORT}`);
    });
  })
  .catch(() => console.log("DB connection error"));
