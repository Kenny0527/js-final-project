import express from "express";
import * as mongodb from "mongodb";
import connectionString from "../Utility/dbaccesskey.js";

const apiRouter_projects = express.Router();
export const apiRouter_tasks = express.Router();
export const apiRouter_recycle_bin = express.Router();
export default apiRouter_projects;
// personal access string used to connect to the database
const accessString = connectionString;
// declared this variable as the db client handler
const MongoClient = mongodb.MongoClient;

// connecting db client uding the access string.
MongoClient.connect(accessString, { useUnifiedTopology: true }).then(
	(client) => {
		const db = client.db("todomanager");
		const projectsCollection = db.collection("projects");
		const taskCollection = db.collection("tasks");
		const recycleBinCollection = db.collection("recycle_bin");
		const tmpTasksCollection = db.collection("tmp_tasks");
		const tmpProjectsCollection = db.collection("tmp_projects");
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
		// POST Calls to backend
		apiRouter_tasks.post("/addtask:project_id", (req, res) => {
			const project_id = req.params.project_id;
			taskCollection.insertOne(req.body).then((results) => {
				res.redirect("/tasks/projects/" + project_id);
			});
		});

		// this is supposed to add project tasks and project to recycle bin
		// then removes all tasks and proejct from collections related.
		// renders project page with new results.
		apiRouter_projects.delete("/delete:project_id", (req, res) => {
			const project_id = req.params.project_id;
			const delete_tasks = taskCollection.find({ project_id }).toArray();
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

		apiRouter_recycle_bin.get("/", (req, res) => {
			// filter the destination
			recycleBinCollection
				.find()
				.toArray()
				.then((results) => {
					//console.log(results);
					res.render("recycle_bin", { recycle_bin: results });
				})
				.catch((error) => console.error(error));
		});

		// DELETE items (tasks and projects) from the Recycle bin
		apiRouter_recycle_bin.get(
			"/delete/:_id/:type/:project_id",
			async (req, res) => {
				let objectId = mongodb.ObjectId;
				const item_id = req.params._id;
				const project_id = req.params.project_id;
				const type = req.params.type;
				if (type === "task") {
					await recycleBinCollection.deleteOne({ _id: new objectId(item_id) });
				}
				if (type === "project") {
					const deletion = await recycleBinCollection
						.find({ project_id })
						.toArray();
					await recycleBinCollection.deleteMany({ project_id });
				}
				recycleBinCollection
					.find()
					.toArray()
					.then((results) => {
						//console.log(results);
						res.render("recycle_bin", { recycle_bin: results });
					})
					.catch((error) => console.error(error));
			}
		);

		// RESTORE Task
		apiRouter_recycle_bin.get(
			"/restore/:_id/:type/:project_id/:task_id",
			async (req, res) => {
				let objectId = mongodb.ObjectId;
				const item_id = req.params._id;
				const project_id = req.params.project_id;
				const task_id = req.params.task_id;
				const type = req.params.type;

				if (type === "task") {
					const tmp1 = await recycleBinCollection
						.find({ project_id })
						.toArray();
					const tmp2 = new Map([tmp1]);
					const obj1 = Object.fromEntries(tmp2);
					tmpTasksCollection.insertOne(obj1);
					await recycleBinCollection.deleteOne({
						_id: new objectId(item_id),
					});
				}
				recycleBinCollection
					.find()
					.toArray()
					.then((results) => {
						//console.log(results);
						res.render("recycle_bin", { recycle_bin: results });
					})
					.catch((error) => console.error(error));
			}
		);
	}
);
