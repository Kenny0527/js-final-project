import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import * as mongodb from "mongodb";
import connectionString from "./Utility/dbaccesskey.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// setting up server object with express functionality
const server = express();
// cors Middleware for testing
server.use(cors());
server.use(express.urlencoded());
// embedded javascript enabled for html views.
server.set("view engine", "ejs");
// server listening on 3000 port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// personal access string used to connect to the database
const accessString = connectionString;
// declared this variable as the db client handler
const MongoClient = mongodb.MongoClient;

// connecting db client uding the access string.
MongoClient.connect(accessString, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to Database`);
    const db = client.db("ProjectManager");
    /**
     * TODO - setup CRUD calls that will interact with our project.
     * Expected features:
     * 1. post projects on project view
     * 2. post tasks in task view
     *
     * */
  }
);

// will be setup with express routes, home, about us, and others.
server.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
