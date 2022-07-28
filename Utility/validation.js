export function firstProjectTask(active_tasks, project_id) {
  if (active_tasks.length === 0) {
    const first_task = {
      title: "My First Task",
      status: "todo",
      description: "This is my first todo",
      assignedTo: "someone special",
      date: "2022-07-28",
      project_id,
      isActive: "true",
    };
    return first_task;
  }
}
