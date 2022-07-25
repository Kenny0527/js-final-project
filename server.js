import express from "express";
import cors from "cors";
import apiRouter from "./Routes/api_routes.js";
import viewRouter from "./Routes/view_routes.js";

// setting up server object with express functionality
const server = express();
// cors Middleware for testing
server.use(cors());
server.use(express.urlencoded());
server.use("/projects", apiRouter);
server.use("/home", viewRouter);
// embedded javascript enabled for html views.
server.set("view engine", "ejs");
// server listening on 3000 port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
