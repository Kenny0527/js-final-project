import express from "express";
import cors from "cors";
import apiRouter_projects, { apiRouter_tasks } from "./Routes/api_routes.js";
import { apiRouter_recycle_bin } from "./Routes/api_routes.js";
import viewRouter from "./Routes/view_routes.js";

// setting up server object with express functionality
const server = express();
// cors Middleware for testing
//server.use(cors());
server.use(express.urlencoded());
server.use(express.static("public"));
server.use("/projects", apiRouter_projects);
server.use("/project", apiRouter_projects);
server.use("/tasks", apiRouter_tasks);
server.use("/task", apiRouter_tasks);
server.use("/tasks.ejs", apiRouter_tasks);
server.use("/home", viewRouter);
server.use("/home.html", viewRouter);
server.use("/tasks/addtask", apiRouter_tasks);
server.use("/about.html", viewRouter);
server.use("/about", viewRouter);

server.use("/recycle_bin", apiRouter_recycle_bin);
// embedded javascript enabled for html views.
server.set("view engine", "ejs");
// server listening on 3000 port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
