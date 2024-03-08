import express, { json } from "express";
const app = express();

app.use(json());

app.get("/", (req, res) => {
  res.json({ message: "Hello Crud Node Express" });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
