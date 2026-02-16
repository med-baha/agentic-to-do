"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

type Task = {
    id: string;
    title: string;
    description: string;
    content?: string;
};

interface TaskDialogProps {
    task?: Task;
    onAdd?: (title: string, description: string, content: string) => Promise<void>;
    onEdit?: (task: Task) => Promise<void>;
    trigger?: React.ReactNode;
}

export default function TaskDialog({ onAdd, onEdit, task, trigger }: TaskDialogProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");

    const isEditMode = !!task;

    useEffect(() => {
        if (open) {
            setTitle(task?.title || "");
            setDescription(task?.description || "");
            setContent(task?.content || "");
        }
    }, [open, task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode && onEdit && task) {
            await onEdit({ ...task, title, description, content });
        } else if (onAdd) {
            await onAdd(title, description, content);
        }
        setOpen(false);
        if (!isEditMode) {
            setTitle("");
            setDescription("");
            setContent("");
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? trigger : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Task
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Task" : "Add New Task"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? "Make changes to your task here." : "Fill in the details for your new task here."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Task title"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Task description"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Task content"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit">{isEditMode ? "Save Changes" : "Save Task"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
