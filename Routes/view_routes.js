import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const viewRouter = express.Router();
export default viewRouter;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// will be setup with express routes, home, about us, and others.
viewRouter.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  //res.redirect("/projects");
});
