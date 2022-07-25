import express from "express";
import * as mongodb from "mongodb";
import connectionString from "../Utility/dbaccesskey.js";

const apiRouter = express.Router();
export default apiRouter;
// personal access string used to connect to the database
const accessString = connectionString;
// declared this variable as the db client handler
const MongoClient = mongodb.MongoClient;

// connecting db client uding the access string.
MongoClient.connect(accessString, { useUnifiedTopology: true }).then(
  (client) => {
    const db = client.db("todomanager");
    const projectsCollection = db.collection("projects");
    /**
     * TODO - setup CRUD calls that will interact with our project.
     * Expected features:
     * 1. post projects on project view
     * 2. post tasks in task view
     *
     * */
    apiRouter.get("/", (req, res) => {
      // filter the destination
      projectsCollection
        .find()
        .toArray()
        .then((results) => {
          console.log(results);
          res.render("index.ejs", { projects: results });
        })
        .catch((error) => console.error(error));
    });
  }
);
