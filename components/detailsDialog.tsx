"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    aiResponse: string;
    onSubmit: (details: string) => void;
}

export default function DetailsDialog({
    open,
    onOpenChange,
    aiResponse,
    onSubmit,
}: DetailsDialogProps) {
    const [details, setDetails] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(details);
        setDetails(""); // Clear input after submit
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>AI Needs More Details</DialogTitle>
                    <DialogDescription>
                        Please provide the requested information below.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="bg-muted p-4 rounded-md text-sm">
                        <p className="font-semibold mb-2">AI Request:</p>
                        <p>{aiResponse}</p>
                    </div>
                    <form id="details-form" onSubmit={handleSubmit} className="grid gap-2">
                        <Textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Type your details here..."
                            className="min-h-[100px]"
                        />
                    </form>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" form="details-form">
                        Submit Details
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
