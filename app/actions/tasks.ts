"use server";

import Task from "@/db/models/Task";
import connectDB from "@/db/dbConnect";

// Helper to ensure connection
async function ensureDB() {
  await connectDB();
}

// ➕ ADD TASK
export async function addTask(taskData: { title: string; description?: string; content?: string }) {
  await ensureDB();
  await Task.create(taskData);
}

// ➕ ADD TASKS MANY
export async function addTasksMany({ tasksData }: { tasksData: { title: string; description?: string; content?: string }[] }) {
  await ensureDB();
  await Task.insertMany(tasksData);
}

// ❌ DELETE TASK
export async function deleteTask({ taskId }: { taskId: string }) {
  await ensureDB();
  const deleted = await Task.findByIdAndDelete(taskId);
  if (!deleted) {
    console.error(`deleteTask: Task with ID ${taskId} not found.`);
  }
}

// ❌ DELETE TASKS MANY
export async function deleteTasksMany({ tasks }: { tasks: { taskId: string }[] }) {
  await ensureDB();
  console.log("delete tasks: " + tasks); // [ { taskId: '690145488526f4d537847551' }, { taskId: '690145488526f4d537847552' } ]

  // Check which ones exist before deleting to report missing ones
  const existingTasks = await Task.find({ _id: { $in: tasks } }, '_id').lean();
  if (existingTasks.length === 0) {
    console.error(`deleteTasksMany: Task with ID ${tasks} not found.`);
    return;
  }
  await Task.deleteMany({ _id: { $in: tasks } });
}

// ✏️ UPDATE TASK
export async function updateTask({ id, title, description, content }: { id: string; title: string; description: string; content?: string }) {
  await ensureDB();
  const updated = await Task.findByIdAndUpdate(id, { title, description, content });
  if (!updated) {
    console.error(`updateTask: Task with ID ${id} not found.`);
  }
}

// ✏️ UPDATE TASKS MANY
export async function updateTasksMany({ tasks }: { tasks: { id: string; title: string; description: string; content?: string }[] }) {
  await ensureDB();
  await Promise.all(tasks.map(async (task) => {
    const updated = await Task.findByIdAndUpdate(task.id, {
      title: task.title,
      description: task.description,
      content: task.content
    });
    if (!updated) {
      console.error(`updateTasksMany: Task with ID ${task.id} not found.`);
    }
  }));
}

// 🔍 GET TASK
export async function getTask({ taskId }: { taskId: string }) {
  await ensureDB();
  const task = await Task.findById(taskId).lean();
  if (!task) {
    console.error(`getTask: Task with ID ${taskId} not found.`);
    return undefined;
  }
  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    content: task.content,
  };
}

// 📋 GET ALL TASKS
export async function getTasks() {
  await ensureDB();
  const tasks = await Task.find({}).lean();
  return tasks.map(task => ({
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    content: task.content,
  }));
}
