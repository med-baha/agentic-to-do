"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThinkingProcessProps {
    isVisible: boolean;
    steps?: string[];
    currentStep?: string;
}

export default function ThinkingProcess({
    isVisible,
    steps = [],
    currentStep = "Thinking...",
}: ThinkingProcessProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!isVisible) return null;

    return (
        <div className="absolute bottom-full mb-4 w-full left-0 px-2 z-40 animate-in fade-in slide-in-from-bottom-2">
            <Card
                className={cn(
                    "w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-lg transition-all duration-300 ease-in-out cursor-pointer",
                    isExpanded ? "h-auto" : "h-14"
                )}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between p-4 h-14">
                    <div className="flex items-center gap-3">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm font-medium">{currentStep}</span>
                    </div>
                    {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>

                {isExpanded && steps.length > 0 && (
                    <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1">
                        <div className="h-px w-full bg-border mb-3" />
                        <div className="flex flex-col gap-2">
                            {steps.map((step, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <span className="mt-0.5">•</span>
                                    <span>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
