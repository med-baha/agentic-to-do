"use client";

import { useState, useEffect } from "react";
import { addTask, deleteTask, updateTask, getTasks } from "@/app/actions/tasks";
import TaskCard from "./taskCard";
import { Card } from "./ui/card";
import TaskDialog from "./taskDialog";

type Task = {
  id: string;
  title: string;
  description: string;
  content?: string;
};

interface TaskListProps {
  refreshTrigger?: number;
}

const TaskList = ({ refreshTrigger }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks as Task[]);
    };
    fetchTasks();
  }, [refreshTrigger]);

  const handleAdd = async (title: string, description: string, content: string) => {
    // Optimistic update or refetch. Since we don't return the new task from addTask efficiently yet,
    // we might need to rely on refetching or returning the created task from server action.
    // For now, let's just trigger a re-fetch or add it to state if we can get the ID back.
    // Actually actions/tasks.ts addTask returns void.
    // Let's modify addTask to return the task or just re-fetch all. Re-fetching is safer for now.

    await addTask({
      title,
      description,
      content
    });

    // Re-fetch tasks to get the new one with ID
    const fetchedTasks = await getTasks();
    setTasks(fetchedTasks as Task[]);
  };

  const handleDelete = async (id: string) => {
    await deleteTask({ taskId: id });
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleEdit = async (updatedTask: Task) => {
    await updateTask(updatedTask);
    setTasks(prev =>
      prev.map(t => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tasks</h2>
      </div>
      <TaskDialog onAdd={handleAdd} />
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </Card>
  );
};

export default TaskList;
