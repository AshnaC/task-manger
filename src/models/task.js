const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        desc: {
            type: String,
            required: true,
            trim: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            // Reference from this field to another model
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model("Task", taskSchema);

// const Task = mongoose.model("Task", {
//     desc: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     owner: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         // Reference from this field to another model
//         ref: "User"
//     }
// });

module.exports = Task;
