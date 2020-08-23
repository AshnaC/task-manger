const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

// const User = mongoose.model("User", {
//     name: { type: String, required: true, trim: true },
//     age: {
//         type: Number,
//         validate: value => {
//             if (value < 0) {
//                 throw new Error("Age must be positive");
//             }
//         },
//         default: 30
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         validate: value => {
//             if (!validator.isEmail(value)) {
//                 throw "Wrong Email";
//             }
//         }
//     },
//     password: {
//         type: String,
//         require: true,
//         minlength: 7,
//         validate: value => {
//             if (value.toLowerCase().includes("password")) {
//                 throw "Bad Password";
//             }
//         }
//     }
// });

// const me = new User({
//     name: "Ashna  ",
//     email: "e3@sdc.co  ",
//     password: "213wewewe"
// });

// me.save()
//     .then(result => {
//         console.log(result, me);
//     })
//     .catch(err => {
//         console.log("Err", err);
//     });

const Task = mongoose.model("Task", {
    desc: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const task1 = new Task({ desc: " s ", completed: false });

task1
    .save()
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });
