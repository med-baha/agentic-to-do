import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        content: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default Task;
