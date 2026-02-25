"use server";

import Task from "@/db/models/Task";
import connectDB from "@/db/dbConnect";

// Helper to ensure connection
async function ensureDB() {
  await connectDB();
}

// ➕ ADD TASK
export async function addTask(taskData: { title: string; description?: string; content?: string }) {
  try {
    await ensureDB();
    const task = await Task.create(taskData);
    return { success: true, message: "Task created successfully", data: task };
  } catch (error) {
    console.error("addTask error:", error);
    return { success: false, message: "Failed to create task" };
  }
}

// ➕ ADD TASKS MANY
export async function addTasksMany({ tasksData }: { tasksData: { title: string; description?: string; content?: string }[] }) {
  try {
    await ensureDB();
    const tasks = await Task.insertMany(tasksData);
    return { success: true, message: `${tasks.length} tasks created successfully`, data: tasks };
  } catch (error) {
    console.error("addTasksMany error:", error);
    return { success: false, message: "Failed to create tasks" };
  }
}

// ❌ DELETE TASK
export async function deleteTask({ taskId }: { taskId: string }) {
  try {
    await ensureDB();
    const deleted = await Task.findByIdAndDelete(taskId);
    if (!deleted) {
      return { success: false, message: `Task not found` };
    }
    return { success: true, message: "Task deleted successfully" };
  } catch (error) {
    console.error("deleteTask error:", error);
    return { success: false, message: "Failed to delete task" };
  }
}

// ❌ DELETE TASKS MANY
export async function deleteTasksMany({ tasks }: { tasks: (string | { taskId: string })[] }) {
  try {
    await ensureDB();
    const ids = tasks.map(t => typeof t === 'string' ? t : t.taskId);

    const existingTasks = await Task.find(
      { _id: { $in: ids } },
      '_id'
    ).lean();

    if (existingTasks.length === 0) {
      return { success: false, message: "No tasks found to delete" };
    }

    await Task.deleteMany({ _id: { $in: ids } });

    return {
      success: true,
      message: `${existingTasks.length} tasks deleted successfully`
    };

  } catch (error) {
    console.error("deleteTasksMany error:", error);
    return { success: false, message: "Failed to delete tasks" };
  }
}

// ✏️ UPDATE TASK
export async function updateTask({ id, title, description, content }: { id: string; title: string; description: string; content?: string }) {
  try {
    await ensureDB();
    const updated = await Task.findByIdAndUpdate(id, { title, description, content });
    if (!updated) {
      return { success: false, message: "Task not found" };
    }
    return { success: true, message: "Task updated successfully" };
  } catch (error) {
    console.error("updateTask error:", error);
    return { success: false, message: "Failed to update task" };
  }
}

// ✏️ UPDATE TASKS MANY
export async function updateTasksMany({ tasks }: { tasks: { id: string; title: string; description: string; content?: string }[] }) {
  try {
    await ensureDB();
    const results = await Promise.all(tasks.map(async (task) => {
      const updated = await Task.findByIdAndUpdate(task.id, {
        title: task.title,
        description: task.description,
        content: task.content
      });
      return !!updated;
    }));
    const successCount = results.filter(r => r).length;
    return { success: true, message: `${successCount} tasks updated successfully` };
  } catch (error) {
    console.error("updateTasksMany error:", error);
    return { success: false, message: "Failed to update tasks" };
  }
}

// 🔍 GET TASK
export async function getTask({ taskId }: { taskId: string }) {
  try {
    await ensureDB();
    const task = await Task.findById(taskId).lean();
    if (!task) {
      return { success: false, message: "Task not found" };
    }
    return {
      success: true,
      message: "Task found",
      data: {
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        content: task.content,
      }
    };
  } catch (error) {
    console.error("getTask error:", error);
    return { success: false, message: "Failed to get task" };
  }
}

// 📋 GET ALL TASKS
export async function getTasks() {
  try {
    await ensureDB();
    const tasks = await Task.find({}).lean();
    const formattedTasks = tasks.map(task => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      content: task.content,
    }));
    return { success: true, message: "Tasks fetched successfully", data: formattedTasks };
  } catch (error) {
    console.error("getTasks error:", error);
    return { success: false, message: "Failed to fetch tasks", data: [] };
  }
}
