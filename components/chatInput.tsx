"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import ThinkingProcess from "./thinkingProcess";
import { identifyIntent } from "@/app/actions/agentTools";
interface ChatInputProps {
    onTaskUpdate: () => void;
}

export default function ChatInput({ onTaskUpdate }: ChatInputProps) {
    const [message, setMessage] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [thinkingStep, setThinkingStep] = useState("Processing request...");
    const [steps, setSteps] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        console.log("Sending message:", message);

        setIsThinking(true);
        setSteps([]);
        setThinkingStep("Analyzing request...");

        try {
            await identifyIntent(message);
            onTaskUpdate();
            setMessage("");
        } catch (error) {
            console.error("Error identifying intent:", error);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="fixed bottom-10 left-4 z-50 w-full max-w-sm pb-0">
            <ThinkingProcess
                isVisible={isThinking}
                currentStep={thinkingStep}
                steps={steps}
            />
            <form onSubmit={handleSubmit} className="flex gap-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg border shadow-lg relative z-50">
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask AI agent..."
                    className="flex-1"
                    disabled={isThinking}
                />
                <Button type="submit" size="icon" disabled={isThinking}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
}
