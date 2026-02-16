"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTask, updateTask } from "@/app/actions/tasks";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

type Task = {
    id: string;
    title: string;
    description: string;
    content?: string;
};

export default function TaskContentPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [task, setTask] = useState<Task | null>(null);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const data = await getTask({ taskId: id });
                if (data) {
                    setTask(data);
                    setContent(data.content);
                }
            } catch (error) {
                console.error("Failed to fetch task:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTask();
        }
    }, [id]);

    const handleSave = async () => {
        if (task) {
            const updatedTask = { ...task, content };
            await updateTask(updatedTask);
            // Optionally show a success message or toast
        }
    };

    const handleBack = () => {
        router.push("/");
    };

    if (loading) {
        return <div className="p-8 text-center">Loading task...</div>;
    }

    if (!task) {
        return <div className="p-8 text-center">Task not found.</div>;
    }

    return (
        <div className="min-h-screen p-8 bg-background flex flex-col gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={handleBack} className="p-0">
                    <ChevronLeft className="w-6 h-6 mr-1" />
                    Back
                </Button>
                <h1 className="text-2xl font-bold">{task.title}</h1>
            </div>

            <Card className="flex-1 flex flex-col p-6 gap-4 min-h-[60vh]">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing your task content..."
                    className="flex-1 resize-none border-none focus-visible:ring-0 text-lg p-0"
                />
                <div className="flex justify-end">
                    <Button onClick={handleSave}>Save Content</Button>
                </div>
            </Card>
        </div>
    );
}
