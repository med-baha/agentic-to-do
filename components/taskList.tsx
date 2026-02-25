"use client";

import { useState, useEffect } from "react";
import { addTask, deleteTask, updateTask, getTasks } from "@/app/actions/taskActions";
import TaskCard from "./TaskCard";
import { Card } from "./ui/card";
import TaskDialog from "./TaskDialog";

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
      const result = await getTasks();
      setTasks(result.data as Task[] || []);
    };
    fetchTasks();
  }, [refreshTrigger]);

  const handleAdd = async (title: string, description: string, content: string) => {
    await addTask({
      title,
      description,
      content
    });

    // Re-fetch tasks to get the new one with ID
    const result = await getTasks();
    setTasks(result.data as Task[] || []);
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
