import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";
import { authBaseURI, rolesBaseURI } from "./config/paths.js";
import { authRouter, roleRouter } from "./routes/index.js";
const app = express();
const PORT = process.env.PORT || 8000;
const corsOptions = {
  origin: `http://localhost:${PORT}`,
};
dotenv.config();

// Config
app.use(json());
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

app.listen(PORT, () => {
  console.log(`The server listens on http://localhost:${PORT}`);
});
