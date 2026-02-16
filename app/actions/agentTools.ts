"use server";

import { agentConfig, generateUrl } from "@/config/agentConfig";
import { Memory } from "@/lib/memory";
import { addTask, deleteTask, updateTask, getTask, getTasks, addTasksMany, deleteTasksMany, updateTasksMany } from "./tasks";
import UserInfo from "@/db/models/UserInfo";
import mongoose from "mongoose";
import jsonSchema from "mongoose-schema-jsonschema";

jsonSchema(mongoose);

let memory = new Memory(); // lives on the server and persists across requests

const pipelineResponse = {
    type: "object",
    properties: {
        pipeline: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    tool: {
                        type: "string"
                    },
                    parameters: {
                        type: "object"
                    },
                },
                required: ["tool", "parameters"],
                additionalProperties: false
            }
        },

    },
    required: ["pipeline"],
    additionalProperties: false
}

const updateLongTermMemoryResponse = {
    type: "object",
    properties: {
        theUserIs: {
            type: "string",
            default: "",
        },
        theUserLikes: {
            type: "string",
            default: "",
        },
        theUserDislikes: {
            type: "string",
            default: "",
        },
        theUserHobbies: {
            type: "string",
            default: "",
        }

    },
    required: ["theUserIs", "theUserLikes", "theUserDislikes", "theUserHobbies"],
    additionalProperties: false
}




const tools = [
    {
        name: "addTask",
        description: "Create a single new task.",
        parameters: {
            title: "string (required) - The title of the task",
            description: "string (required) - Short summary of the task",
            content: "string (optional) - Additional detailed information"
        },
        useWhen: "Use when the user wants to create ONE task."
    },

    {
        name: "deleteTask",
        description: "Delete a single task by its ID.",
        parameters: {
            taskId: "string (required) - The ID of the task to delete"
        },
        useWhen: "Use when the user wants to delete ONE specific task."
    },

    {
        name: "updateTask",
        description: "Update a single existing task by ID.",
        parameters: {
            id: "string (required) - The ID of the task",
            title: "string (required) - Updated title",
            description: "string (required) - Updated description",
            content: "string (optional) - Updated additional details"
        },
        useWhen: "Use when the user wants to modify ONE task."
    },



    {
        name: "addTasksMany",
        description: "Create multiple new tasks in one operation.",
        parameters: {
            tasksData: "Array of task objects (title, description, optional content)"
        },
        useWhen: "Use when the user wants to create MULTIPLE tasks in one request."
    },

    {
        name: "deleteTasksMany",
        description: "Delete multiple tasks in one operation.",
        parameters: {
            tasks: "Array of objects containing taskId"
        },
        useWhen: "Use when the user wants to delete MULTIPLE tasks at once."
    },

    {
        name: "updateTasksMany",
        description: "Update multiple tasks in one operation.",
        parameters: {
            tasks: "Array of objects containing id, title, description, optional content"
        },
        useWhen: "Use when the user wants to update MULTIPLE tasks at once."
    }
];

export async function identifyIntent(userPrompt: string) {
    if (!userPrompt) {
        throw new Error("User prompt is required");
    }
    memory.setPrompt(userPrompt);
    memory.addPreviousUserPrompts(userPrompt);
    const config: agentConfig = {
        model: "gemma3",
        stream: false,
        think: false,
        system: "this are the availabel tasks: " + JSON.stringify(await getTasks()) + "somtimes the tasks can be empty" +
            "this are the available tools: " + JSON.stringify(tools) +
            "return an array of tools that should be executed in order to complete the user request the array can contain one or more tools examin the tools and the user request and return  the Exact tools that should be executed no extra steps"
    }
    try {
        const response = await fetch(generateUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: config.model,
                system: config.system,
                prompt: userPrompt,
                stream: config.stream,
                think: config.think,
                format: pipelineResponse,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch from Ollama: ${response.statusText}`);
        }

        const data = await response.json();//{...,response:"",created_at:"",...}
        console.log("identifyIntent data:", data);
        const responseText = data.response.trim();//{"tool":"","parameters":{}}
        console.log("identifyIntent response:", responseText);
        const parsed = JSON.parse(responseText);// {tool:"",parameters:{}}
        console.log("identifyIntent parsed:", parsed.pipeline);
        executeTool(parsed.pipeline);
        return parsed.pipeline;

    } catch (error) {
        console.error("identifyIntent error:", error);
        throw error;
    }
}





// execute tool
export async function executeTool(pipeline: any[]) {
    if (!pipeline || !Array.isArray(pipeline)) {
        throw new Error("undefined or invalid pipeline");
    }

    for (const item of pipeline) {
        const { tool, parameters } = item;
        if (!tool || !parameters) {
            console.error("Skipping invalid pipeline item:", item);
            continue;
        }

        console.log(`Executing tool: ${tool}...`);

        switch (tool) {
            case "addTask":
                await addTask(parameters as any);
                break;
            case "deleteTask":
                await deleteTask(parameters as any);
                break;
            case "updateTask":
                await updateTask(parameters as any);
                break;
            case "getTask":
                await getTask(parameters as any);
                break;
            case "addTasksMany":
                await addTasksMany(parameters as any);
                break;
            case "deleteTasksMany":
                await deleteTasksMany(parameters as any);
                break;
            case "updateTasksMany":
                await updateTasksMany(parameters as any);
                break;
            default:
                console.warn(`Unknown tool: ${tool}`);
                break;
        }

        console.log(`Finished executing ${tool}.`);
    }
    console.log("previous user prompts count:", memory.getPreviousUserPromptCount());
    if (memory.getPreviousUserPromptCount() > 2) {
        updateLongTermMemory();
    }
}

async function updateLongTermMemory() {
    console.log("Updating long term memory...");

    // 1. Fetch existing long-term memory
    let existingMemory = null;
    try {
        existingMemory = await UserInfo.findOne().sort({ updatedAt: -1 });
        console.log("Existing memory from DB:", existingMemory);
    } catch (e) {
        console.warn("Could not fetch existing memory:", e);
    }

    const config: agentConfig = {
        model: "gemma3",
        stream: false,
        think: false,
        system: "You are an assistant that maintains long-term memory about a user. " +
            "Below is the existing memory we have about the user: " + (existingMemory ? JSON.stringify(existingMemory) : "None") + "\n" +
            "Below are the recent user prompts: " + JSON.stringify(memory.getPreviousUserPrompts()) + "\n" +
            "Analyze the recent prompts and the existing memory. Create a new, synthesized summary of the user's personality, likes, dislikes, and hobbies. " +
            "Do not lose important information from the existing memory, but update it with the new information. " +
            "Return the data in the specified JSON format."
    }

    try {
        const response = await fetch(generateUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: config.model,
                system: config.system,
                prompt: "Summarize the user's information based on all available context.",
                stream: config.stream,
                think: config.think,
                format: updateLongTermMemoryResponse,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch from Ollama: ${response.statusText}`);
        }

        const data = await response.json();
        const responseText = data.response.trim();
        console.log("updateLongTermMemory LLM response:", responseText);
        const parsed = JSON.parse(responseText);

        // 2. Persist to database
        if (existingMemory) {
            await UserInfo.findByIdAndUpdate(existingMemory._id, parsed);
            console.log("Updated existing memory in DB.");
            memory.clearPreviousUserPrompts();

        } else {
            await UserInfo.create(parsed);
            console.log("Created new memory in DB.");
        }

        return parsed;

    } catch (error) {
        console.error("updateLongTermMemory error:", error);
        throw error;
    }
}



