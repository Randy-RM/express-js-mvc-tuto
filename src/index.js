import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";
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
app.get("/", (req, res) => {
  res.json({ message: "Hello Crud Node Express" });
});

app.listen(PORT, () => {
  console.log(`The server listens on http://localhost:${PORT}`);
});
