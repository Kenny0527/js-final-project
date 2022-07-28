import express from "express";
import * as mongodb from "mongodb";
import connectionString from "../Utility/dbaccesskey.js";

const apiRouter_projects = express.Router();
export const apiRouter_tasks = express.Router();
export default apiRouter_projects;
// personal access string used to connect to the database
const accessString = connectionString;
// declared this variable as the db client handler
const MongoClient = mongodb.MongoClient;

// connecting db client uding the access string.
MongoClient.connect(accessString, { useUnifiedTopology: true })
  .then((client) => {
    const db = client.db("todomanager");
    const projectsCollection = db.collection("projects");
    const taskCollection = db.collection("tasks");
    /**
     * TODO - setup CRUD calls that will interact with our project.
     * Expected features:
     * 1. post projects on project view
     * 2. post tasks in task view
     *
     * */
    apiRouter_projects.get("/", (req, res) => {
      // filter the destination
      projectsCollection
        .find()
        .toArray()
        .then((results) => {
          //console.log(results);
          res.render("projects", { projects: results });
        })
        .catch((error) => console.error(error));
    });

    // adding a new project to the list
    apiRouter_projects.post("/newproject", async (req, res) => {
      await projectsCollection
        .insertOne(req.body)
        .then((results) => {
          //console.log(results);
          res.redirect("/projects");
        })
        .catch((error) => console.error(error));
    });

    // this is for projects.ejs to update a project
    apiRouter_projects.post("/:_id", async (req, res) => {
      // filter the destination
      let objectId = mongodb.ObjectId;
      const project_id = req.params._id;
      const { title, description } = req.body;
      const updated = await projectsCollection.updateOne(
        { _id: objectId(project_id) },
        { $set: { title, description } }
      );
      projectsCollection
        .find()
        .toArray()
        .then((results) => {
          //console.log(results);
          res.render("projects", { projects: results });
        })
        .catch((error) => console.error(error));
    });

    apiRouter_tasks.get("/", (req, res) => {
      // filter the destination
      taskCollection
        .find()
        .toArray()
        .then((results) => {
          //console.log(results);
          res.render("tasks", { tasks: results });
        })
        .catch((error) => console.error(error));
    });

    apiRouter_tasks.get("/project/:project_id", (req, res) => {
      // TODO: grab param of project_id
      // find the tasks by that project id
      const project_id = req.params.project_id;
      taskCollection
        .find({ project_id })
        .toArray()
        .then((results) => {
          //console.log(results);
          res.render("tasks", { tasks: results });
        })
        .catch((error) => console.error(error));
    });

    // tasks.ejs calls this to update the task to a project
    apiRouter_tasks.post("/:_id/:project_id", async (req, res) => {
      // filter the destination
      let objectId = mongodb.ObjectId;
      const task_id = req.params._id;
      const project_id = req.params.project_id;
      const { title, date, assignedTo, description } = req.body;
      const updated = await taskCollection.updateOne(
        { _id: objectId(task_id) },
        { $set: { title, date, assignedTo, description } }
      );

      taskCollection
        .find({ project_id })
        .toArray()
        .then((results) => {
          //console.log(results);
          res.render("tasks", { tasks: results });
        })
        .catch((error) => console.error(error));
    });

    apiRouter_tasks.post("/addtask/:project_id", (req, res) => {
      const project_id = req.params.project_id;
      taskCollection.insertOne(req.body).then((results) => {
        res.redirect("/tasks/projects/" + project_id);
      });
    });

    // this is supposed to add project tasks and project to recycle bin
    // then removes all tasks and proejct from collections related.
    // renders project page with new results.
    apiRouter_projects.delete("/delete:project_id", (req, res) => {
      let objectId = mongodb.ObjectId;
      const project_id = req.params.project_id;
      const delete_tasks = taskCollection.find(objectId(project_id)).toArray();
      for (let index = 0; index < delete_tasks.length; index++) {
        delete delete_tasks[i];
      }
      const delete_project = projectCollection.find({ _id }).toArray();
      for (let index = 0; index < delete_project.length; index++) {
        delete delete_project[i];
      }
      res.redirect("projects");
    });

    // this is supposed to delete a task associated with a certain
    // project.
    apiRouter_tasks.delete("/delete:_id", (req, res) => {
      const task_id = req.params._id;
      const project_id = taskCollection[task_id].project_id;
      delete taskCollection[task_id];
      taskCollection
        .find({ project_id })
        .toArray()
        .then((results) => {
          //console.log(results);
          res.render("tasks", { tasks: results });
        })
        .catch((error) => console.error(error));
    });
  })
  .catch((error) => console.error(error));
