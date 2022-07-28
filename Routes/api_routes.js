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
MongoClient.connect(accessString, { useUnifiedTopology: true })
	.then((client) => {
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

		// GET Recycle bin items
		// apiRouter_recycle_bin.get("/", (req, res) => {
		// 	recycleBinCollection
		// 		.find()
		// 		.toArray()
		// 		.then((results) => {
		// 			//console.log(results);
		// 			res.render("recycle_bin", { recycle_bin: results });
		// 		})
		// 		.catch((error) => console.error(error));
		// });

		// DELETE items (tasks and projects) from the Recycle bin
		// apiRouter_recycle_bin.get(
		// 	"/delete/:_id/:type/:project_id",
		// 	async (req, res) => {
		// 		let objectId = mongodb.ObjectId;
		// 		const item_id = req.params._id;
		// 		const project_id = req.params.project_id;
		// 		const type = req.params.type;
		// 		if (type === "task") {
		// 			await recycleBinCollection.deleteOne({ _id: new objectId(item_id) });
		// 		}
		// 		if (type === "project") {
		// 			const deletion = await recycleBinCollection
		// 				.find({ project_id })
		// 				.toArray();
		// 			await recycleBinCollection.deleteMany({ project_id });
		// 		}
		// 		recycleBinCollection
		// 			.find()
		// 			.toArray()
		// 			.then((results) => {
		// 				//console.log(results);
		// 				res.render("recycle_bin", { recycle_bin: results });
		// 			})
		// 			.catch((error) => console.error(error));
		// 	}
		// );

		// RESTORE Task from the Recycle bin
		// apiRouter_recycle_bin.get(
		// 	"/restore/:_id/:type/:project_id/:task_id",
		// 	async (req, res) => {
		// 		let objectId = mongodb.ObjectId;
		// 		const item_id = req.params._id;
		// 		const project_id = req.params.project_id;
		// 		const task_id = req.params.task_id;
		// 		const type = req.params.type;

		// 		if (type === "task") {
		// 			const tmp1 = await recycleBinCollection
		// 				.find({ project_id })
		// 				.toArray();
		// 			const tmp2 = new Map([tmp1]);
		// 			const obj1 = Object.fromEntries(tmp2);
		// 			tmpTasksCollection.insertOne(obj1);
		// 			await recycleBinCollection.deleteOne({
		// 				_id: new objectId(item_id),
		// 			});
		// 		}
		// 		recycleBinCollection
		// 			.find()
		// 			.toArray()
		// 			.then((results) => {
		// 				//console.log(results);
		// 				res.render("recycle_bin", { recycle_bin: results });
		// 			})
		// 			.catch((error) => console.error(error));
		// 	}
		// );

		// GET Tasks using TAGs
		// apiRouter_recycle_bin.get("/", async (req, res) => {
		// 	taskCollection
		// 		.find({ isActive: "false" })
		// 		.toArray()
		// 		.then((results) => {
		// 			//console.log(results);
		// 			res.render("recycle_bin", { recycle_bin: results });
		// 		})
		// 		.catch((error) => console.error(error));
		// });

		// GET tasks and projects using TAGs
		apiRouter_recycle_bin.get("/", async (req, res) => {
			const recycled_tasks = await taskCollection
				.find({ isActive: "false" })
				.toArray();
			const recycled_projects = await projectsCollection
				.find({ isActive: "false" })
				.toArray();
			res.render("recycle_bin", {
				recycle_bin_tasks: recycled_tasks,
				recycle_bin_projects: recycled_projects,
			});
		});

		// DELETE Task with isActive TAG
		// apiRouter_recycle_bin.get("/delete/:_id/", async (req, res) => {
		// 	let objectId = mongodb.ObjectId;
		// 	const item_id = req.params._id;
		// 	await taskCollection.deleteOne({
		// 		_id: new objectId(item_id),
		// 	});
		// 	taskCollection
		// 		.find({ isActive: "false" })
		// 		.toArray()
		// 		.then((results) => {
		// 			//console.log(results);
		// 			res.render("recycle_bin", { recycle_bin_tasks: results });
		// 		})
		// 		.catch((error) => console.error(error));
		// });

		// DELETE Task with isActive TAG
		apiRouter_recycle_bin.get("/delete/:_id/", async (req, res) => {
			let objectId = mongodb.ObjectId;
			const item_id = req.params._id;
			await taskCollection.deleteMany({ project_id: item_id });
			await projectsCollection.deleteOne({ _id: new objectId(item_id) });
			await taskCollection.deleteOne({ _id: new objectId(item_id) });
			const recycled_tasks = await taskCollection
				.find({ isActive: "false" })
				.toArray();
			const recycled_projects = await projectsCollection
				.find({ isActive: "false" })
				.toArray();
			res.render("recycle_bin", {
				recycle_bin_tasks: recycled_tasks,
				recycle_bin_projects: recycled_projects,
			});
		});

		// RESTORE Task with isActive TAG
		// apiRouter_recycle_bin.get("/restore/:_id/", async (req, res) => {
		// 	let objectId = mongodb.ObjectId;
		// 	const item_id = req.params._id;
		// 	await taskCollection.updateOne(
		// 		{ _id: objectId(item_id) },
		// 		{ $set: { isActive: "true" } }
		// 	);
		// 	taskCollection
		// 		.find({ isActive: "false" })
		// 		.toArray()
		// 		.then((results) => {
		// 			//console.log(results);
		// 			res.render("recycle_bin", { recycle_bin: results });
		// 		})
		// 		.catch((error) => console.error(error));
		// });

		apiRouter_recycle_bin.get("/restore/:_id/", async (req, res) => {
			let objectId = mongodb.ObjectId;
			const item_id = req.params._id;
			await taskCollection.updateMany(
				{ project_id: objectId(item_id) },
				{ $set: { isActive: "true" } }
			);
			await projectsCollection.updateOne(
				{ _id: objectId(item_id) },
				{ $set: { isActive: "true" } }
			);
			await taskCollection.updateOne(
				{ _id: objectId(item_id) },
				{ $set: { isActive: "true" } }
			);
			const recycled_tasks = await taskCollection
				.find({ isActive: "false" })
				.toArray();
			const recycled_projects = await projectsCollection
				.find({ isActive: "false" })
				.toArray();
			res.render("recycle_bin", {
				recycle_bin_tasks: recycled_tasks,
				recycle_bin_projects: recycled_projects,
			});
		});
	})
	.catch((error) => console.error(error));
