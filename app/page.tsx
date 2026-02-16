"use client"
import { useState } from "react";
import ChatInput from "@/components/chatInput";
import TaskList from "@/components/taskList";

function Page() {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);

  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-10 gap-6 bg-dark relative">
      <h1 className="text-2xl font-bold">My To-Do List</h1>

      <div className="w-full max-w-5xl">
        <TaskList refreshTrigger={refreshKey} />

      </div>
      <div className="-mt-20">
        <ChatInput onTaskUpdate={triggerRefresh} />
      </div>
    </div>
  );
}

export default Page
